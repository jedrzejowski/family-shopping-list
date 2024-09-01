use anyhow::Result;
use rusqlite::named_params;
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use crate::database::Repository;
use crate::database::sqlite::SqlLiteDatabase;
use crate::family_context::FamilyContext;
use crate::model::{SearchParams, SearchResult};

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ShoppingList {
  pub shopping_list_id: Uuid,
  pub name: String,
  pub items: Vec<ShoppingListItem>,
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ShoppingListItem {
  pub item_id: Uuid,
  pub sort_order: i32,
  pub product_id: Uuid,
  pub is_checked: bool,
}

#[async_trait::async_trait]
impl Repository<ShoppingList> for SqlLiteDatabase {
  async fn search(&self, family_context: &FamilyContext, search_params: SearchParams) -> Result<SearchResult<String>> {
    todo!()
    // self.make_text_search(
    //   family_context,
    //   "select product_id from products where family_id = :family_id",
    //   ["trade_name"],
    //   search_params,
    // ).await
  }

  async fn get(&self, family_context: &FamilyContext, shopping_list_id: Uuid) -> Result<Option<ShoppingList>> {
    todo!()
    // let connection = self.lock_connection().await;
    //
    // let sql_result = connection.query_row(
    //   "select product_id, trade_name from products where family_id = :family_id and product_id = :product_id",
    //   named_params! {
    //     ":family_id": family_context.family_id,
    //     ":product_id": product_id.to_string(),
    //   },
    //   |row| {
    //     let product_id: String = row.get("product_id")?;
    //
    //     Ok(ShoppingList {
    //       product_id: Uuid::parse_str(product_id.as_str()).unwrap(),
    //       trade_name: row.get("trade_name")?,
    //       tags: vec![],
    //     })
    //   },
    // );
    //
    // match sql_result {
    //   Ok(product) => Ok(Some(product)),
    //   Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
    //   Err(err) => Err(err.into()),
    // }
  }

  async fn create(&self, family_context: &FamilyContext, shopping_list: ShoppingList) -> Result<String> {
    let connection = self.lock_connection().await;

    let shopping_list_id = Uuid::new_v4();

    connection.execute(
      "
insert
into shopping_list(family_id, shopping_list_id, name)
values (:family_id, :shopping_list_id, :name)
",
      named_params! {
        ":family_id": family_context.family_id,
        ":shopping_list_id": shopping_list_id.to_string(),
        ":name": shopping_list.name,
      },
    )?;




    Ok(shopping_list_id.to_string())
  }

  async fn update(&self, family_context: &FamilyContext, shopping_list: ShoppingList) -> Result<()> {
    let connection = self.lock_connection().await;

    todo!()
//     connection.execute(
//       "
// update products
// set trade_name = :trade_name
// where family_id = :family_id and product_id = :product_id
// ",
//       named_params! {
//         ":trade_name": product.trade_name,
//         ":family_id": family_context.family_id,
//         ":product_id": product.product_id.to_string(),
//       },
//     )?;
//
//     Ok(())
  }
}
