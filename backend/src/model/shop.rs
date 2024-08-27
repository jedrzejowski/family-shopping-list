use serde::{Deserialize, Serialize};
use uuid::Uuid;
use anyhow::Result;
use crate::database::Repository;
use crate::database::sqlite::SqlLiteDatabase;
use crate::model::{SearchParams, SearchResult};
use rusqlite::types::{Value as SqlValue};

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Shop {
  pub family_id: Uuid,
  pub shop_id: Uuid,
  pub brand_name: String,
  pub address_city: Option<String>,
  pub address_street: Option<String>,
  pub address_street_no: Option<String>,
}

#[async_trait::async_trait]
impl Repository<Shop> for SqlLiteDatabase {
  async fn search(&self, search_params: SearchParams) -> Result<SearchResult<String>> {
    let connection = self.lock_connection().await;

    let mut sql = vec!["select shop_id from shops where true".to_string()];

    if search_params.search_text.is_some() {
      sql.push("and brand_name like :search_text".to_string());
    }

    sql.push("limit :limit offset :offset".to_string());

    let mut stmt = connection.prepare(&sql.join(" "))?;
    if let Some(search_text) = &search_params.search_text {
      stmt.raw_bind_parameter(stmt.parameter_index(":search_text").unwrap().unwrap(), SqlValue::Text(format!("%{}%", search_text)))?;
    }
    stmt.raw_bind_parameter(stmt.parameter_index(":limit").unwrap().unwrap(), SqlValue::Integer(search_params.limit as i64))?;
    stmt.raw_bind_parameter(stmt.parameter_index(":offset").unwrap().unwrap(), SqlValue::Integer(search_params.offset as i64))?;

    let mut rows = stmt.raw_query();

    let mut items = vec![];

    while let Some(row) = rows.next()? {
      let shop_id: String = row.get(0)?;

      items.push(shop_id);
    }

    Ok(SearchResult { items })
  }

  async fn get(&self, shop_id: Uuid) -> Result<Option<Shop>> {
    let connection = self.lock_connection().await;

    let sql_result = connection.query_row(
      "select family_id, shop_id, brand_name, address_city, address_street, address_street_no from shops where shop_id = ?;",
      [shop_id.to_string()],
      |row| {
        let family_id: String = row.get("family_id")?;
        let shop_id: String = row.get("shop_id")?;

        Ok(Shop {
          family_id: Uuid::parse_str(family_id.as_str()).unwrap(),
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

  async fn create(&self, shop: Shop) -> Result<String> {
    let connection = self.lock_connection().await;

    let shop_id = Uuid::new_v4();

    connection.execute(
      "
insert
into shops(family_id, shop_id, brand_name, address_city, address_street, address_street_no)
values (?, ?, ?, ?, ?, ?)
",
      (shop.family_id.to_string(), shop_id.to_string(), &shop.brand_name,
       &shop.address_city, &shop.address_street, &shop.address_street_no),
    )?;

    Ok(shop_id.to_string())
  }

  async fn update(&self, shop: Shop) -> Result<()> {
    let connection = self.lock_connection().await;

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