use uuid::Uuid;
use anyhow::Result;
use sqlx::Row;
use sqlx::sqlite::SqliteRow;
use crate::repository::CrudRepository;
use crate::database::sqlite::SqliteDatabase;
use crate::family_context::FamilyContext;
use crate::model::{SearchParams, SearchResult, Shop};


#[async_trait::async_trait]
impl CrudRepository<Shop> for SqliteDatabase {
  fn id_field(&self) -> &str {
    "shopId"
  }

  async fn search(&self, family_context: &FamilyContext, search_params: SearchParams) -> Result<SearchResult<Uuid>> {
    // language=sqlite
    let mut qb = sqlx::QueryBuilder::new(
      "select shop_id from shops where ");
    qb.push("family_id = ").push_bind(family_context.family_id.to_string());

    self.make_text_search(qb, ["brand_name"], ["shop_id"], search_params).await
  }

  async fn get(&self, family_context: &FamilyContext, shop_id: Uuid) -> Result<Option<Shop>> {

    // language=sqlite
    let shop = sqlx::query("
      select shop_id, brand_name, address_city, address_street, address_street_no,
             _meta_created_at, _meta_updated_at
      from shops
      where family_id = ?
        and shop_id = ?
    ")
      .bind(family_context.family_id.to_string())
      .bind(shop_id.to_string())
      .try_map(|row: SqliteRow| {
        Ok(Shop {
          shop_id: self.try_get_uuid_field(&row, 0)?,
          brand_name: row.get(1),
          address_city: row.get(2),
          address_street: row.get(3),
          address_street_no: row.get(4),
          meta: Some(self.try_get_meta_fields(&row)?),
        })
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

  async fn delete(&self, family_context: &FamilyContext, shop_id: Uuid) -> Result<()> {

    // language=sqlite
    sqlx::query("
      delete from shops where family_id = ? and shop_id = ?
    ")
      .bind(family_context.family_id.to_string())
      .bind(shop_id.to_string())
      .execute(self.pool())
      .await?;

    Ok(())
  }
}
