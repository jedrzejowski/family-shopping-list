pub mod sqlite;

use std::sync::Arc;
use anyhow::Result;
use uuid::Uuid;
use crate::model::{SearchParams, SearchResult};

// #[async_trait::async_trait]
// pub trait Database: Sync + Send {
//   async fn search_products(&self, search_params: SearchParams) -> Result<SearchResult<String>>;
//   async fn get_product(&self, product_id: Uuid) -> Result<Option<model::product::Product>>;
//   async fn create_product(&self, product: model::product::Product) -> Result<String>;
//   async fn update_product(&self, product: model::product::Product) -> Result<()>;
// }
//
// pub type DatabaseBean = Arc<Box<dyn Database>>;

#[async_trait::async_trait]
pub trait Repository<T>: Sync + Send {
  async fn search(&self, search_params: SearchParams) -> Result<SearchResult<String>>;
  async fn get(&self, id: Uuid) -> Result<Option<T>>;
  async fn create(&self, object: T) -> Result<String>;
  async fn update(&self, object: T) -> Result<()>;
}

pub type RepositoryBean<T> = Arc<Box<dyn Repository<T>>>;
