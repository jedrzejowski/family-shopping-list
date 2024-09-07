use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ShoppingListItem {
  pub shopping_list_item_id: Uuid,
  pub shopping_list_id: Uuid,
  pub product_id: Option<Uuid>,
  pub product_name: Option<String>,
  pub is_checked: bool,
}
