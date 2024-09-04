use sqlx::Row;
use sqlx::sqlite::SqliteRow;
use uuid::Uuid;
use crate::database::sqlite::SqliteDatabase;
use crate::family_context::FamilyContext;
use crate::model::{SearchParams, SearchResult, ShoppingListItem};
use crate::repository::CrudRepository;

#[async_trait::async_trait]
impl CrudRepository<ShoppingListItem> for SqliteDatabase {
  fn id_field(&self) -> &str {
    "shoppingListItemId"
  }

  async fn search(&self, family_context: &FamilyContext, search_params: SearchParams) -> anyhow::Result<SearchResult<Uuid>> {
    todo!()
  }

  async fn get(&self, family_context: &FamilyContext, shopping_list_id: Uuid) -> anyhow::Result<Option<ShoppingListItem>> {

    // language=sqlite
    let mut list = sqlx::query("
      select shopping_list_item_id, shopping_list_id, sort_order, product_id, is_checked, product_id
      from shopping_list_items
      where family_id = ? and shopping_list_item_id = ?
    ")
      .bind(family_context.family_id.to_string())
      .bind(shopping_list_id.to_string())
      .map(|row: SqliteRow| {
        ShoppingListItem {
          shopping_list_item_id: Uuid::parse_str(row.get(0)).unwrap(),
          shopping_list_id: Uuid::parse_str(row.get(1)).unwrap(),
          sort_order: row.get(2),
          product_id: Uuid::parse_str(row.get(3)).unwrap(),
          is_checked: row.get(4),
        }
      })
      .fetch_all(self.pool())
      .await?;

    Ok(list.pop())
  }

  async fn create(&self, family_context: &FamilyContext, shopping_list_item: ShoppingListItem) -> anyhow::Result<String> {
    let shopping_list_item_id = Uuid::new_v4();

    log::warn!("{} {} {} {}",      family_context.family_id.to_string(),
      shopping_list_item_id.to_string(),
      shopping_list_item.shopping_list_id.to_string(),
      shopping_list_item.product_id.to_string(),);

    // language=sqlite
    sqlx::query("
      insert
      into shopping_list_items(family_id, shopping_list_item_id, shopping_list_id, product_id, sort_order, is_checked)
      values (?, ?, ?, ?, ?, ?)
    ")
      .bind(family_context.family_id.to_string())
      .bind(shopping_list_item_id.to_string())
      .bind(shopping_list_item.shopping_list_id.to_string())
      .bind(shopping_list_item.product_id.to_string())
      .bind(&shopping_list_item.sort_order)
      .bind(&shopping_list_item.is_checked)
      .execute(self.pool())
      .await?;

    Ok(shopping_list_item_id.to_string())
  }

  async fn update(&self, family_context: &FamilyContext, shopping_list_item: ShoppingListItem) -> anyhow::Result<()> {
    // language=sqlite
    sqlx::query("
      update shopping_list_items
      set product_id = ?,
          sort_order = ?,
          is_checked = ?,
          shopping_list_id = ?
      where family_id = ? and shopping_list_item_id = ?
    ")
      .bind(shopping_list_item.product_id.to_string())
      .bind(&shopping_list_item.sort_order)
      .bind(&shopping_list_item.is_checked)
      .bind(shopping_list_item.shopping_list_id.to_string())
      .bind(family_context.family_id.to_string())
      .bind(shopping_list_item.shopping_list_item_id.to_string())
      .execute(self.pool())
      .await?;

    Ok(())
  }

  async fn delete(&self, family_context: &FamilyContext, shopping_list_item_id: Uuid) -> anyhow::Result<()> {

    // language=sqlite
    sqlx::query("
      delete from shopping_list_items where family_id = ? and shopping_list_item_id = ?
    ")
      .bind(family_context.family_id.to_string())
      .bind(shopping_list_item_id.to_string())
      .execute(self.pool())
      .await?;

    Ok(())
  }
}
