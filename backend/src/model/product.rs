use serde::{Deserialize, Serialize};
use uuid::Uuid;
use anyhow::Result;
use sqlx::Row;
use sqlx::sqlite::SqliteRow;
use crate::repository::CrudRepository;
use crate::database::sqlite::SqliteDatabase;
use crate::family_context::FamilyContext;
use crate::model::{SearchParams, SearchResult};

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Product {
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
impl CrudRepository<Product> for SqliteDatabase {
  fn id_field(&self) -> &str {
    "productId"
  }

  async fn search(&self, family_context: &FamilyContext, search_params: SearchParams) -> Result<SearchResult<String>> {
    self.make_text_search(
      family_context,
      // language=sqlite
      "select product_id from products where family_id = ?",
      ["trade_name"],
      search_params,
    ).await
  }

  async fn get(&self, family_context: &FamilyContext, product_id: Uuid) -> Result<Option<Product>> {

    // language=sqlite
    let product = sqlx::query("
      select product_id, trade_name
      from products
      where family_id = :family_id and product_id = :product_id
    ")
      .bind(family_context.family_id.to_string())
      .bind(product_id.to_string())
      .map(|row: SqliteRow| {
        Product {
          product_id: Uuid::parse_str(row.get(1)).unwrap(),
          trade_name: row.get(1),
          tags: vec![],
        }
      })
      .fetch_all(self.pool())
      .await?
      .pop();

    Ok(product)
  }

  async fn create(&self, family_context: &FamilyContext, product: Product) -> Result<String> {
    let product_id = Uuid::new_v4();

    // language=sqlite
    sqlx::query("
      insert
      into products(family_id, product_id, trade_name)
      values (?, ?, ?)
    ")
      .bind(family_context.family_id.to_string())
      .bind(product.product_id.to_string())
      .bind(&product.trade_name)
      .execute(self.pool())
      .await?;

    Ok(product_id.to_string())
  }

  async fn update(&self, family_context: &FamilyContext, product: Product) -> Result<()> {
    // language=sqlite
    sqlx::query("
      update products
      set trade_name = ?
      where family_id = ? and product_id = ?
    ")
      .bind(&product.trade_name)
      .bind(family_context.family_id.to_string())
      .bind(product.product_id.to_string())
      .execute(self.pool())
      .await?;

    Ok(())
  }
}
