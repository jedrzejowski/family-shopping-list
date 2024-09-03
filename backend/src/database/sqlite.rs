use std::path::Path;
use anyhow::Result;
use log::LevelFilter;
use crate::model::{SearchParams, SearchResult};
use sqlx::pool::PoolConnection;
use sqlx::{ConnectOptions, Encode, Execute, Executor, QueryBuilder, Row, Sqlite, SqlitePool, Type};
use sqlx::sqlite::{SqliteConnectOptions, SqlitePoolOptions, SqliteRow};
use crate::family_context::FamilyContext;

#[derive(Clone)]
pub struct SqliteDatabase {
  sqlx_pool: SqlitePool,
}

impl SqliteDatabase {
  pub async fn from_file<T: AsRef<Path>>(path: T) -> Result<Self> {
    let connect_options = SqliteConnectOptions::new()
      .filename(path.as_ref())
      .log_statements(LevelFilter::Info);

    let mut pool_options = SqlitePoolOptions::new();

    let pool = pool_options.connect_with(connect_options).await?;

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

    Ok(Self {
      sqlx_pool: pool,
    })
  }

  #[inline]
  pub fn pool(&self) -> &SqlitePool {
    &self.sqlx_pool
  }

  pub async fn acquire(&self) -> Result<PoolConnection<Sqlite>> {
    Ok(self.sqlx_pool.acquire().await?)
  }

  pub async fn make_text_search<'args>(
    &self,
    mut query_builder: QueryBuilder<'args, Sqlite>,
    text_columns: impl AsRef<[&str]>,
    order_by: impl AsRef<[&str]>,
    search_params: SearchParams,
  ) -> Result<SearchResult<String>> {
    if let Some(search_text) = &search_params.search_text {
      let search_text = format!("%{}%", search_text);
      for text_column in text_columns.as_ref() {
        query_builder.push(" and ");
        query_builder.push(text_column);
        query_builder.push(" like ");

        query_builder.push_bind(search_text.to_string());
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
        for order_by in order_by {
          query_builder.push(order_by).push(" asc ");
        }
      }

      query_builder.push(" limit ").push_bind(search_params.limit);
      query_builder.push(" offset ").push_bind(search_params.offset);

      let query = query_builder.build();

      let query = query.map(|row: SqliteRow| {
        let id: String = row.get(0);
        id
      });

      query.fetch_all(&self.sqlx_pool).await?
    };

    let total_count = {
      let sql = format!("select count(*) from({})", &base_sql);
      let mut query_builder = QueryBuilder::with_arguments(sql, base_arguments.clone());
      let query = query_builder.build();

      let query = query.map(|row: SqliteRow| {
        let id: u32 = row.get(0);
        id
      });

      query.fetch_one(&self.sqlx_pool).await?
    };

    Ok(SearchResult {
      items,
      total_count,
    })
  }
}
