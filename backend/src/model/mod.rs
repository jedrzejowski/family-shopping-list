pub mod product;
pub mod shop;

use serde::{Deserialize, Serialize};
pub use product::Product;
pub use shop::Shop;

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct SearchResult<T> {
  pub items: Vec<T>,
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct SearchParams {
  pub search_text: Option<String>,
  pub limit: u32,
  pub offset: u32,
}
