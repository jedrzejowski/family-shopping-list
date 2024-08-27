use serde::{Deserialize, Serialize};
use uuid::Uuid;
use anyhow::Result;
use crate::database::Repository;
use crate::database::sqlite::SqlLiteDatabase;
use crate::model::{SearchParams, SearchResult};

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Product {
    pub family_id: Uuid,
    pub product_id: Uuid,
    pub trade_name: String,
    pub tags: Vec<ProductTag>,
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ProductTag {
  pub name: String,
}


#[async_trait::async_trait]
impl Repository<Product> for SqlLiteDatabase {
  async fn search(&self, search_params: SearchParams) -> Result<SearchResult<String>> {
    self.make_text_search(
      "select product_id from products where true",
      ["trade_name"],
      search_params
    ).await
  }

  async fn get(&self, product_id: Uuid) -> Result<Option<Product>> {
    let connection = self.lock_connection().await;

    let sql_result = connection.query_row(
      "select family_id, product_id, trade_name from products where product_id = ?;",
      [product_id.to_string()],
      |row| {
        let product_id: String = row.get("product_id")?;
        let family_id: String = row.get("family_id")?;

        Ok(Product {
          family_id: Uuid::parse_str(family_id.as_str()).unwrap(),
          product_id: Uuid::parse_str(product_id.as_str()).unwrap(),
          trade_name: row.get("trade_name")?,
          tags: vec![],
        })
      },
    );

    match sql_result {
      Ok(product) => Ok(Some(product)),
      Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
      Err(err) => Err(err.into()),
    }
  }

  async fn create(&self, product: Product) -> Result<String> {
    let connection = self.lock_connection().await;

    let product_id = Uuid::new_v4();

    connection.execute(
      "
insert
into products(family_id, product_id, trade_name)
values (?, ?, ?)
",
      (product.family_id.to_string(), product_id.to_string(), &product.trade_name),
    )?;

    Ok(product_id.to_string())
  }

  async fn update(&self, product: Product) -> Result<()> {
    let connection = self.lock_connection().await;

    connection.execute(
      "
update products
set family_id = ?, trade_name = ?
where product_id = ?
",
      (product.family_id.to_string(), &product.trade_name, product.product_id.to_string()),
    )?;

    Ok(())
  }
}
