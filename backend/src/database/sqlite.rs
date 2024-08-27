use std::path::Path;
use std::sync::Arc;
use anyhow::Result;
use rusqlite::Connection;
use tokio::sync::{Mutex, MutexGuard};

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

}

// #[async_trait::async_trait]
// impl Database for SqlLiteDatabase {
//   async fn search_products(&self, search_params: SearchParams) -> Result<SearchResult<String>> {
//     let connection = self.connection.lock().await;
//
//     let mut sql = vec!["select product_id from products where true".to_string()];
//
//     if search_params.search_text.is_some() {
//       sql.push("and trade_name like :search_text".to_string());
//     }
//
//     sql.push("limit :limit offset :offset".to_string());
//
//     let mut stmt = connection.prepare(&sql.join(" "))?;
//     if let Some(search_text) = &search_params.search_text {
//       stmt.raw_bind_parameter(stmt.parameter_index(":search_text").unwrap().unwrap(), SqlValue::Text(format!("%{}%", search_text)))?;
//     }
//     stmt.raw_bind_parameter(stmt.parameter_index(":limit").unwrap().unwrap(), SqlValue::Integer(search_params.limit as i64))?;
//     stmt.raw_bind_parameter(stmt.parameter_index(":offset").unwrap().unwrap(), SqlValue::Integer(search_params.offset as i64))?;
//
//     let mut rows = stmt.raw_query();
//
//     let mut items = vec![];
//
//     while let Some(row) = rows.next()? {
//       let product_id: String = row.get(0)?;
//
//       items.push(product_id);
//     }
//
//     Ok(SearchResult { items })
//   }
//
//   async fn get_product(&self, product_id: Uuid) -> Result<Option<model::Product>> {
//     let connection = self.connection.lock().await;
//
//     let sql_result = connection.query_row(
//       "select family_id, product_id, trade_name from products where product_id = ?;",
//       [product_id.to_string()],
//       |row| {
//         let product_id: String = row.get("product_id")?;
//         let family_id: String = row.get("family_id")?;
//
//         Ok(model::Product {
//           family_id: Uuid::parse_str(family_id.as_str()).unwrap(),
//           product_id: Uuid::parse_str(product_id.as_str()).unwrap(),
//           trade_name: row.get("trade_name")?,
//           tags: vec![],
//         })
//       },
//     );
//
//     match sql_result {
//       Ok(product) => Ok(Some(product)),
//       Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
//       Err(err) => Err(err.into()),
//     }
//   }
//
//   async fn create_product(&self, product: model::Product) -> Result<String> {
//     let connection = self.connection.lock().await;
//
//     let product_id = Uuid::new_v4();
//
//     connection.execute(
//       "
// insert
// into products(family_id, product_id, trade_name)
// values (?, ?, ?)
// ",
//       (product.family_id.to_string(), product_id.to_string(), &product.trade_name),
//     )?;
//
//     Ok(product_id.to_string())
//   }
//
//   async fn update_product(&self, product: model::Product) -> Result<()> {
//     let connection = self.connection.lock().await;
//
//     connection.execute(
//       "
// update products
// set family_id = ?, trade_name = ?
// where product_id = ?
// ",
//       (product.family_id.to_string(), &product.trade_name, product.product_id.to_string()),
//     )?;
//
//     Ok(())
//   }
// }

//
// let count: rusqlite::Result<u32> = connection.query_row(
// "select count(product_id) from products where product_id = ?",
// [&product.id],
// |row| row.get(0),
// );
//
// if count == Ok(1) {} else {
//
// }
