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
pub struct Shop {
  pub shop_id: Uuid,
  pub brand_name: String,
  pub address_city: Option<String>,
  pub address_street: Option<String>,
  pub address_street_no: Option<String>,
}

#[async_trait::async_trait]
impl CrudRepository<Shop> for SqliteDatabase {
  fn id_field(&self) -> &str {
    "shopId"
  }

  async fn search(&self, family_context: &FamilyContext, search_params: SearchParams) -> Result<SearchResult<String>> {
    self.make_text_search(
      family_context,
      // language=sqlite
      "select shop_id from shops where family_id = ?",
      ["brand_name"],
      search_params,
    ).await
  }

  async fn get(&self, family_context: &FamilyContext, shop_id: Uuid) -> Result<Option<Shop>> {

    // language=sqlite
    let shop = sqlx::query("
      select shop_id, brand_name, address_city, address_street, address_street_no
      from shops
      where family_id = ?
        and shop_id = ?
    ")
      .bind(family_context.family_id.to_string())
      .bind(shop_id.to_string())
      .map(|row: SqliteRow| {
        Shop {
          shop_id: Uuid::parse_str(row.get(0)).unwrap(),
          brand_name: row.get(1),
          address_city: row.get(2),
          address_street: row.get(3),
          address_street_no: row.get(4),
        }
      })
      .fetch_all(self.pool())
      .await?
      .pop();

    Ok(shop)
  }

  async fn create(&self, family_context: &FamilyContext, shop: Shop) -> Result<String> {
    let shop_id = Uuid::new_v4();

    // language=sqlite
    sqlx::query("
      insert
      into shops(family_id, shop_id, brand_name, address_city, address_street, address_street_no)
      values (?, ?, ?, ?, ?, ?)
    ")
      .bind(family_context.family_id.to_string())
      .bind(shop_id.to_string())
      .bind(&shop.brand_name)
      .bind(&shop.address_city)
      .bind(&shop.address_street)
      .bind(&shop.address_street_no)
      .execute(self.pool())
      .await?;

    Ok(shop_id.to_string())
  }

  async fn update(&self, family_context: &FamilyContext, shop: Shop) -> Result<()> {

    // language=sqlite
    sqlx::query("
      update shops
      set brand_name = ?,
        address_city = ?,
        address_street = ?,
        address_street_no = ?
      where family_id = ? and shop_id = ?
    ")
      .bind(&shop.brand_name)
      .bind(&shop.address_city)
      .bind(&shop.address_street)
      .bind(&shop.address_street_no)
      .bind(family_context.family_id.to_string())
      .bind(shop.shop_id.to_string())
      .execute(self.pool())
      .await?;

    Ok(())
  }
}
