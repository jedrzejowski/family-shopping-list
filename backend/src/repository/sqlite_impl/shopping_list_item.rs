use crate::database::sqlite::SqliteDatabase;
use crate::family_context::FamilyContext;
use crate::model::{SearchParams, SearchResult, ShoppingListItem};
use crate::repository::{CrudRepository, ShoppingListItemRepository};
use anyhow::Result;
use sqlx::sqlite::SqliteRow;
use sqlx::{Execute, Row};
use uuid::Uuid;

#[async_trait::async_trait]
impl CrudRepository<ShoppingListItem> for SqliteDatabase {
  fn id_field(&self) -> &str {
    "shoppingListItemId"
  }

  async fn search(
    &self,
    family_context: &FamilyContext,
    search_params: SearchParams,
  ) -> Result<SearchResult<Uuid>> {
    todo!()
  }

  async fn get(
    &self,
    family_context: &FamilyContext,
    shopping_list_id: Uuid,
  ) -> Result<Option<ShoppingListItem>> {
    // language=sqlite
    let mut list = sqlx::query("
      select shopping_list_item_id, shopping_list_id, product_id, product_name, is_checked, product_id,
             _meta_created_at, _meta_updated_at
      from shopping_list_items
      where family_id = ? and shopping_list_item_id = ?
    ")
      .bind(family_context.family_id.to_string())
      .bind(shopping_list_id.to_string())
      .try_map(|row: SqliteRow| {
        Ok(ShoppingListItem {
          shopping_list_item_id: self.try_get_uuid_field(&row, 0)?,
          shopping_list_id: self.try_get_uuid_field(&row, 1)?,
          product_id: self.try_get_option_uuid_field(&row, 2)?,
          product_name: row.try_get(3)?,
          is_checked: row.get(4),
          meta: Some(self.try_get_meta_fields(&row)?),
        })
      })
      .fetch_all(self.pool())
      .await?;

    Ok(list.pop())
  }

  async fn create(
    &self,
    family_context: &FamilyContext,
    shopping_list_item: ShoppingListItem,
  ) -> Result<Uuid> {
    let shopping_list_item_id = Uuid::new_v4();

    // language=sqlite
    sqlx::query(
      "
      insert
      into shopping_list_items
        (_meta_created_at, _meta_updated_at,
         family_id,
         shopping_list_item_id, shopping_list_id,
         product_id, product_name,
         is_checked)
      values (current_timestamp, current_timestamp,
              ?, ?, ?, ?, ?, ?)
    ",
    )
    .bind(family_context.family_id.to_string())
    .bind(shopping_list_item_id.to_string())
    .bind(shopping_list_item.shopping_list_id.to_string())
    .bind(shopping_list_item.product_id.map(|id| id.to_string()))
    .bind(shopping_list_item.product_name)
    .bind(&shopping_list_item.is_checked)
    .execute(self.pool())
    .await?;

    Ok(shopping_list_item_id)
  }

  async fn update(
    &self,
    family_context: &FamilyContext,
    shopping_list_item: ShoppingListItem,
  ) -> Result<()> {
    // language=sqlite
    sqlx::query(
      "
      update shopping_list_items
      set product_id = ?,
          product_name = ?,
          is_checked = ?,
          shopping_list_id = ?,
          _meta_updated_at = current_timestamp
      where family_id = ? and shopping_list_item_id = ?
    ",
    )
    .bind(shopping_list_item.product_id.map(|id| id.to_string()))
    .bind(&shopping_list_item.product_name)
    .bind(&shopping_list_item.is_checked)
    .bind(shopping_list_item.shopping_list_id.to_string())
    .bind(family_context.family_id.to_string())
    .bind(shopping_list_item.shopping_list_item_id.to_string())
    .execute(self.pool())
    .await?;

    Ok(())
  }

  async fn delete(
    &self,
    family_context: &FamilyContext,
    shopping_list_item_id: Uuid,
  ) -> Result<()> {
    // language=sqlite
    sqlx::query(
      "
      delete from shopping_list_items where family_id = ? and shopping_list_item_id = ?
    ",
    )
    .bind(family_context.family_id.to_string())
    .bind(shopping_list_item_id.to_string())
    .execute(self.pool())
    .await?;

    Ok(())
  }

  async fn get_all_ids(&self, family_context: &FamilyContext) -> Result<Vec<Uuid>> {
    // language=sqlite
    let all_ids = sqlx::query(
      "
      select shopping_list_item_id
      from shopping_list_items
      where family_id = ?
    ",
    )
    .bind(family_context.family_id.to_string())
    .try_map(|row: SqliteRow| self.try_get_uuid_field(&row, 0))
    .fetch_all(self.pool())
    .await?;

    Ok(all_ids)
  }
}

#[async_trait::async_trait]
impl ShoppingListItemRepository for SqliteDatabase {
  async fn set_is_checked(
    &self,
    family_context: &FamilyContext,
    shopping_list_item_id: Uuid,
    is_checked: bool,
  ) -> Result<()> {
    // language=sqlite
    sqlx::query(
      "
      update shopping_list_items
      set is_checked = ?,
          _meta_updated_at = current_timestamp
      where family_id = ? and shopping_list_item_id = ?
    ",
    )
    .bind(is_checked)
    .bind(family_context.family_id.to_string())
    .bind(shopping_list_item_id.to_string())
    .execute(self.pool())
    .await?;

    Ok(())
  }
}
