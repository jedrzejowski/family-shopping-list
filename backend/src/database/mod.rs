pub mod sqlite;

use std::sync::Arc;
use anyhow::Result;
use uuid::Uuid;
use crate::family_context::FamilyContext;
use crate::model::{SearchParams, SearchResult};


#[async_trait::async_trait]
pub trait CrudRepository<T>: Sync + Send {
  fn id_field(&self) -> &str;
  async fn search(&self, family_context: &FamilyContext, search_params: SearchParams) -> Result<SearchResult<String>>;
  async fn get(&self, family_context: &FamilyContext, id: Uuid) -> Result<Option<T>>;
  async fn create(&self, family_context: &FamilyContext, object: T) -> Result<String>;
  async fn update(&self, family_context: &FamilyContext, object: T) -> Result<()>;
}

pub type CrudRepositoryBean<T> = Arc<Box<dyn CrudRepository<T>>>;
