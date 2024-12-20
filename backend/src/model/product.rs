use crate::model::EntityMeta;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Product {
  pub product_id: Uuid,
  pub trade_name: String,
  pub tags: Vec<ProductTag>,
  #[serde(skip_deserializing)]
  pub meta: Option<EntityMeta>,
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ProductTag {
  pub name: String,
}
