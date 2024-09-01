use serde::{Deserialize, Serialize};
use uuid::Uuid;
use anyhow::Result;
use crate::repository::CrudRepository;
use crate::database::sqlite::SqlLiteDatabase;
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
impl CrudRepository<Shop> for SqlLiteDatabase {
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
    let connection = self.legacy_lock_connection().await;

    let sql_result = connection.query_row(
      // language=sqlite
      "select shop_id, brand_name, address_city, address_street, address_street_no
from shops
where family_id = ?
  and shop_id = ?",
      (family_context.family_id.to_string(), shop_id.to_string()),
      |row| {
        let shop_id: String = row.get("shop_id")?;

        Ok(Shop {
          shop_id: Uuid::parse_str(shop_id.as_str()).unwrap(),
          brand_name: row.get("brand_name")?,
          address_city: row.get("address_city")?,
          address_street: row.get("address_street")?,
          address_street_no: row.get("address_street_no")?,
        })
      },
    );

    match sql_result {
      Ok(shop) => Ok(Some(shop)),
      Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
      Err(err) => Err(err.into()),
    }
  }

  async fn create(&self, family_context: &FamilyContext, shop: Shop) -> Result<String> {
    let connection = self.legacy_lock_connection().await;

    let shop_id = Uuid::new_v4();

    connection.execute(
      "
insert
into shops(family_id, shop_id, brand_name, address_city, address_street, address_street_no)
values (?, ?, ?, ?, ?, ?)
",
      (family_context.family_id.to_string(), shop_id.to_string(), &shop.brand_name,
       &shop.address_city, &shop.address_street, &shop.address_street_no),
    )?;

    Ok(shop_id.to_string())
  }

  async fn update(&self, family_context: &FamilyContext, shop: Shop) -> Result<()> {
    let connection = self.legacy_lock_connection().await;

    connection.execute(
      "
update shops
set brand_name = ?,
  address_city = ?,
  address_street = ?,
  address_street_no = ?
where shop_id = ?
",
      (&shop.brand_name,
       &shop.address_city, &shop.address_street, &shop.address_street_no,
       shop.shop_id.to_string()),
    )?;

    Ok(())
  }
}
