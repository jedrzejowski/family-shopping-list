use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ShoppingListItem {
  pub shopping_list_item_id: Uuid,
  pub shopping_list_id: Uuid,
  pub sort_order: i32,
  pub product_id: Uuid,
  pub is_checked: bool,
}
