use serde::{Deserialize, Serialize};
use uuid::Uuid;
use crate::model::EntityMeta;

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Shop {
  pub shop_id: Uuid,
  pub brand_name: String,
  pub address_city: Option<String>,
  pub address_street: Option<String>,
  pub address_street_no: Option<String>,
  #[serde(skip_deserializing)]
  pub meta: Option<EntityMeta>,
}
