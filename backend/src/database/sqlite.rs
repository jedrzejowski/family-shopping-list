use std::path::Path;
use anyhow::Result;
use log::LevelFilter;
use crate::model::{SearchParams, SearchResult};
use sqlx::pool::PoolConnection;
use sqlx::{ConnectOptions, Executor, Row, Sqlite, SqlitePool};
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

  pub async fn make_text_search(
    &self,
    family_context: &FamilyContext,
    base_sql: &str,
    text_columns: impl AsRef<[&str]>,
    search_params: SearchParams,
  ) -> Result<SearchResult<String>> {
    let mut sql = base_sql.to_string();

    if search_params.search_text.is_some() {
      for text_column in text_columns.as_ref() {
        sql.push_str(" and ");
        sql.push_str(text_column);
        sql.push_str(" like ?");
      }
    }

    sql.push_str(" limit ? offset ?");

    let mut query = sqlx::query(&sql);

    query = query.bind(family_context.family_id.to_string());

    if let Some(search_text) = &search_params.search_text {
      if search_params.search_text.is_some() {
        for text_column in text_columns.as_ref() {
          query = query.bind(search_text);
        }
      }
    }

    query = query.bind(&search_params.limit);
    query = query.bind(&search_params.offset);

    let query = query.map(|row: SqliteRow| {
      let id: String = row.get(0);
      id
    });

    let items = query.fetch_all(&self.sqlx_pool).await?;

    Ok(SearchResult { items })
  }
}
