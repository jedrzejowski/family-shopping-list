use crate::app_state::Bean;
use crate::family_context::FamilyContext;
use crate::model;
use crate::model::SearchParams;
use crate::repository::{CrudRepositoryBean, ShoppingListItemRepository, ShoppingListRepository};
use axum::http::StatusCode;
use axum::Json;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use uuid::Uuid;

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Everything {
  pub products: Vec<model::Product>,
  pub shops: Vec<model::Shop>,
  pub shopping_lists: Vec<model::ShoppingList>,
  pub shopping_list_items: Vec<model::ShoppingListItem>,
  pub shopping_lists_items: HashMap<Uuid, Vec<Uuid>>,
}

pub async fn everything(
  family_context: FamilyContext,
  product_repo: CrudRepositoryBean<model::Product>,
  shop_repo: CrudRepositoryBean<model::Shop>,
  shopping_list_repo: Bean<dyn ShoppingListRepository>,
  shopping_list_item_repo: Bean<dyn ShoppingListItemRepository>,
) -> Result<Json<Everything>, StatusCode> {
  let shopping_lists = shopping_list_repo
    .get_all(&family_context)
    .await
    .map_err(|err| StatusCode::INTERNAL_SERVER_ERROR)?;
  let mut shopping_lists_items = HashMap::<Uuid, Vec<Uuid>>::new();

  for shopping_list in &shopping_lists {
    let search_result = shopping_list_repo
      .search_items(
        &family_context,
        shopping_list.shopping_list_id.clone(),
        SearchParams::infinity(),
      )
      .await
      .map_err(|err| StatusCode::INTERNAL_SERVER_ERROR)?;

    shopping_lists_items.insert(shopping_list.shopping_list_id.clone(), search_result.items);
  }

  Ok(Json(Everything {
    products: product_repo
      .get_all(&family_context)
      .await
      .map_err(|err| StatusCode::INTERNAL_SERVER_ERROR)?,
    shops: shop_repo
      .get_all(&family_context)
      .await
      .map_err(|err| StatusCode::INTERNAL_SERVER_ERROR)?,
    shopping_lists,
    shopping_list_items: shopping_list_item_repo
      .get_all(&family_context)
      .await
      .map_err(|err| StatusCode::INTERNAL_SERVER_ERROR)?,
    shopping_lists_items,
  }))
}
