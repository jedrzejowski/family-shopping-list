use std::path::Path;
use std::sync::Arc;
use anyhow::Result;
use rusqlite::{Connection, Params, ToSql};
use tokio::sync::{Mutex, MutexGuard};
use crate::model::{SearchParams, SearchResult};
use rusqlite::types::{Value as SqlValue};
use crate::family_context::FamilyContext;

#[derive(Clone)]
pub struct SqlLiteDatabase {
  connection: Arc<Mutex<Connection>>,
}

impl SqlLiteDatabase {
  pub fn from_file<T: AsRef<Path>>(path: T) -> Result<Self> {
    let connection = Connection::open(path)?;

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

    Ok(Self { connection: Arc::new(Mutex::new(connection)) })
  }

  pub async fn lock_connection(&self) -> MutexGuard<'_, Connection> {
    self.connection.lock().await
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
        sql.push_str(" like :search_text");
      }
    }

    sql.push_str(" limit :limit offset :offset");

    let connection = self.lock_connection().await;

    let mut stmt = connection.prepare(&sql)?;

    if let Some(search_text) = &search_params.search_text {
      stmt.raw_bind_parameter(
        stmt.parameter_index(":search_text").unwrap().unwrap(),
        SqlValue::Text(format!("%{}%", search_text)),
      )?;
    }

    stmt.raw_bind_parameter(
      stmt.parameter_index(":family_id").unwrap().unwrap(),
      SqlValue::Text(family_context.family_id.clone()),
    )?;

    stmt.raw_bind_parameter(
      stmt.parameter_index(":limit").unwrap().unwrap(),
      SqlValue::Integer(search_params.limit as i64),
    )?;

    stmt.raw_bind_parameter(
      stmt.parameter_index(":offset").unwrap().unwrap(),
      SqlValue::Integer(search_params.offset as i64),
    )?;

    let mut rows = stmt.raw_query();

    let mut items = vec![];

    while let Some(row) = rows.next()? {
      let id: String = row.get(0)?;
      items.push(id);
    }

    Ok(SearchResult { items })
  }
}
