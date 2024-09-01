use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ShoppingList {
  pub shopping_list_id: Uuid,
  pub name: String,
}
