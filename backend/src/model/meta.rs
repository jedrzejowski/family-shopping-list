use serde::{Deserialize, Serialize};
use time::OffsetDateTime;

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct EntityMeta {
  #[serde(with = "time::serde::rfc3339")]
  pub updated_at: OffsetDateTime,
  #[serde(with = "time::serde::rfc3339")]
  pub created_at: OffsetDateTime,
}
