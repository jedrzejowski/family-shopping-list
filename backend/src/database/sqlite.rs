use crate::model::{EntityMeta, SearchParams, SearchParamsLimit, SearchResult};
use anyhow::Result;
use log::LevelFilter;
use sqlx::pool::PoolConnection;
use sqlx::sqlite::{SqliteConnectOptions, SqlitePoolOptions, SqliteRow};
use sqlx::{ColumnIndex, ConnectOptions, Execute, Executor, QueryBuilder, Row, Sqlite, SqlitePool};
use std::path::Path;
use time::{OffsetDateTime, UtcOffset};
use uuid::Uuid;

#[derive(Clone)]
pub struct SqliteDatabase {
  sqlx_pool: SqlitePool,
}

impl SqliteDatabase {
  pub async fn from_file<T: AsRef<Path>>(path: T) -> Result<Self> {
    let connect_options = SqliteConnectOptions::new()
      .filename(path.as_ref())
      .create_if_missing(true)
      .log_statements(LevelFilter::Info);

    let mut pool_options = SqlitePoolOptions::new();

    let pool = pool_options.connect_with(connect_options).await?;

    // sqlx::migrate!("src/database/sqlite-migrations")
    //   .run(&pool)
    //   .await?;

    // .connect("database.sqlite").await?;

    //     connection.execute(
    //       "
    //
    // create table products
    // (
    //     product_id TEXT
    //         constraint products_pk
    //             primary key,
    //     trade_name TEXT
    // );
    //
    //       ",
    //       (),
    //     )?;

    Ok(Self { sqlx_pool: pool })
  }

  #[inline]
  pub fn pool(&self) -> &SqlitePool {
    &self.sqlx_pool
  }

  pub async fn acquire(&self) -> Result<PoolConnection<Sqlite>> {
    Ok(self.sqlx_pool.acquire().await?)
  }

  pub fn try_get_meta_fields(&self, row: &SqliteRow) -> Result<EntityMeta, sqlx::Error> {
    Ok(EntityMeta {
      created_at: row.try_get("_meta_created_at")?,
      updated_at: row.try_get("_meta_updated_at")?,
    })
  }

  pub fn try_get_uuid_field<I>(&self, row: &SqliteRow, index: I) -> Result<Uuid, sqlx::Error>
  where
    I: ColumnIndex<SqliteRow> + Copy,
  {
    let field = row.try_get::<String, I>(index)?;
    match Uuid::try_parse(field.as_str()) {
      Ok(uuid) => Ok(uuid),
      Err(err) => Err(sqlx::Error::ColumnDecode {
        index: format!("{index:?}"),
        source: Box::new(err),
      }),
    }
  }

  pub fn try_get_option_uuid_field<I>(
    &self,
    row: &SqliteRow,
    index: I,
  ) -> Result<Option<Uuid>, sqlx::Error>
  where
    I: ColumnIndex<SqliteRow> + Copy,
  {
    let field = match row.try_get::<Option<String>, I>(index)? {
      None => return Ok(None),
      Some(value) => value,
    };
    match Uuid::try_parse(field.as_str()) {
      Ok(uuid) => Ok(Some(uuid)),
      Err(err) => Err(sqlx::Error::ColumnDecode {
        index: format!("{index:?}"),
        source: Box::new(err),
      }),
    }
  }

  pub async fn make_text_search<'args>(
    &self,
    mut query_builder: QueryBuilder<'args, Sqlite>,
    text_columns: impl AsRef<[&str]>,
    order_by: impl AsRef<[&str]>,
    search_params: SearchParams,
  ) -> Result<SearchResult<Uuid>> {
    let text_columns = text_columns.as_ref();

    if text_columns.len() > 0 {
      if let Some(search_text) = &search_params.search_text {
        let search_text = format!("%{}%", search_text);
        query_builder.push(" and ");

        let mut is_first = true;

        if text_columns.len() > 1 {
          query_builder.push("( ");
        }

        for text_column in text_columns {
          if is_first {
            is_first = false;
          } else {
            query_builder.push(" or ");
          }

          query_builder.push("( ifnull(");
          query_builder.push(text_column);
          query_builder.push(", '')");
          query_builder.push(" like ");
          query_builder.push_bind(search_text.to_string());
          query_builder.push(" )");
        }

        if text_columns.len() > 1 {
          query_builder.push(" )");
        }
      }
    }

    let mut base_query = query_builder.build();
    let base_sql = base_query.sql();
    let base_arguments = base_query.take_arguments().unwrap().unwrap();

    let items = {
      let mut query_builder = QueryBuilder::with_arguments(base_sql, base_arguments.clone());

      let order_by = order_by.as_ref();
      if order_by.len() > 0 {
        query_builder.push(" order by ");
        let mut is_first = true;

        for order_by in order_by {
          if is_first {
            is_first = false;
          } else {
            query_builder.push(", ");
          }

          query_builder.push(order_by);
        }
      }

      if let SearchParamsLimit::Number(limit) = &search_params.limit {
        query_builder.push(" limit ").push_bind(*limit as i64);
        query_builder
          .push(" offset ")
          .push_bind(search_params.offset as i64);
      }

      let query = query_builder.build();

      let query = query.try_map(|row: SqliteRow| self.try_get_uuid_field(&row, 0));

      query.fetch_all(&self.sqlx_pool).await?
    };

    let total_count = {
      let sql = format!("select count(*) from({})", &base_sql);
      let mut query_builder = QueryBuilder::with_arguments(sql, base_arguments.clone());
      let query = query_builder.build();

      let query = query.map(|row: SqliteRow| {
        let id: i64 = row.get(0);
        id
      });

      query.fetch_one(&self.sqlx_pool).await?
    };

    let mut next_page_params: Option<SearchParams> = None;
    let mut previous_page_params: Option<SearchParams> = None;

    match &search_params.limit {
      SearchParamsLimit::Number(limit) => {
        if total_count < (search_params.offset + limit) as i64 {
          next_page_params = Some(SearchParams {
            search_text: search_params.search_text.clone(),
            limit: SearchParamsLimit::Number(*limit),
            offset: search_params.offset + limit,
          });
        }

        if search_params.offset > 0 {
          let offset = search_params.offset - limit;
          previous_page_params = Some(SearchParams {
            search_text: search_params.search_text.clone(),
            limit: SearchParamsLimit::Number(*limit),
            offset,
          });
        }
      }
      SearchParamsLimit::Infinity => {}
    }

    Ok(SearchResult {
      search_params,
      items,
      total_count: total_count as usize,
      next_page_params,
      previous_page_params,
    })
  }
}
