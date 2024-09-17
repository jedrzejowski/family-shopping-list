use serde::{Deserialize, Serialize};
use uuid::Uuid;
use crate::model::EntityMeta;

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

