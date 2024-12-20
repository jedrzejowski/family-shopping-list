use crate::database::sqlite::SqliteDatabase;
use crate::family_context::FamilyContext;
use crate::model::{SearchParams, SearchResult, ShoppingList};
use crate::repository::{CrudRepository, ShoppingListRepository};
use anyhow::Result;
use sqlx::sqlite::SqliteRow;
use sqlx::Row;
use uuid::Uuid;

#[async_trait::async_trait]
impl CrudRepository<ShoppingList> for SqliteDatabase {
  fn id_field(&self) -> &str {
    "shoppingListId"
  }

  async fn search(
    &self,
    family_context: &FamilyContext,
    search_params: SearchParams,
  ) -> Result<SearchResult<Uuid>> {
    // language=sqlite
    let mut qb = sqlx::QueryBuilder::new("select shopping_list_id from shopping_lists where ");
    qb.push("family_id = ")
      .push_bind(family_context.family_id.to_string());

    self
      .make_text_search(qb, ["name"], ["shopping_list_id asc"], search_params)
      .await
  }

  async fn get(
    &self,
    family_context: &FamilyContext,
    shopping_list_id: Uuid,
  ) -> Result<Option<ShoppingList>> {
    // language=sqlite
    let mut shopping_list = sqlx::query(
      "
      select shopping_list_id, name,
             _meta_created_at, _meta_updated_at
      from shopping_lists
      where family_id = ? and shopping_list_id = ?
    ",
    )
    .bind(family_context.family_id.to_string())
    .bind(shopping_list_id.to_string())
    .try_map(|row: SqliteRow| {
      Ok(ShoppingList {
        shopping_list_id: self.try_get_uuid_field(&row, 0)?,
        name: row.get(1),
        meta: Some(self.try_get_meta_fields(&row)?),
      })
    })
    .fetch_all(self.pool())
    .await?;

    Ok(shopping_list.pop())
  }

  async fn create(
    &self,
    family_context: &FamilyContext,
    shopping_list: ShoppingList,
  ) -> Result<Uuid> {
    let shopping_list_id = Uuid::new_v4();

    // language=sqlite
    sqlx::query(
      "
      insert
      into shopping_lists
        (_meta_created_at, _meta_updated_at,
         family_id, shopping_list_id, name)
      values (current_timestamp, current_timestamp,
              ?, ?, ?)
    ",
    )
    .bind(family_context.family_id.to_string())
    .bind(shopping_list_id.to_string())
    .bind(&shopping_list.name)
    .execute(self.pool())
    .await?;

    Ok(shopping_list_id)
  }

  async fn update(
    &self,
    family_context: &FamilyContext,
    shopping_list: ShoppingList,
  ) -> Result<()> {
    // language=sqlite
    sqlx::query(
      "
      update shopping_lists
      set name = ?,
          _meta_updated_at = current_timestamp
      where family_id = ? and shopping_list_id = ?
    ",
    )
    .bind(&shopping_list.name)
    .bind(family_context.family_id.to_string())
    .bind(shopping_list.shopping_list_id.to_string())
    .execute(self.pool())
    .await?;

    Ok(())
  }

  async fn delete(&self, family_context: &FamilyContext, shopping_list_id: Uuid) -> Result<()> {
    // language=sqlite
    sqlx::query(
      "
      delete from shopping_lists where family_id = ? and shopping_list_id = ?
    ",
    )
    .bind(family_context.family_id.to_string())
    .bind(shopping_list_id.to_string())
    .execute(self.pool())
    .await?;

    Ok(())
  }
}

#[async_trait::async_trait]
impl ShoppingListRepository for SqliteDatabase {
  async fn search_items(
    &self,
    family_context: &FamilyContext,
    shopping_list_id: Uuid,
    search_params: SearchParams,
  ) -> Result<SearchResult<Uuid>> {
    // language=sqlite
    let mut qb = sqlx::QueryBuilder::new(
      "
      select shopping_list_item_id
      from shopping_list_items items
      left join main.products p on items.product_id = p.product_id
      where
    ",
    );
    qb.push("items.family_id = ")
      .push_bind(family_context.family_id.to_string());
    qb.push("and items.shopping_list_id = ")
      .push_bind(shopping_list_id.to_string());

    self
      .make_text_search(
        qb,
        ["p.trade_name", "items.product_name"],
        [
          "is_checked asc",
          "items._meta_updated_at desc",
          "shopping_list_item_id asc",
        ],
        search_params,
      )
      .await
  }
}
