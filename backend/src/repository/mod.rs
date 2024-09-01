use std::sync::Arc;
use serde::de::DeserializeOwned;
use serde::Serialize;
use uuid::Uuid;
use crate::family_context::FamilyContext;
use crate::model::{SearchParams, SearchResult};

#[async_trait::async_trait]
pub trait CrudRepository<M>: Sync + Send
where
  M: Serialize + DeserializeOwned + Send,
{
  fn id_field(&self) -> &str;
  async fn search(&self, family_context: &FamilyContext, search_params: SearchParams) -> anyhow::Result<SearchResult<String>>;
  async fn get(&self, family_context: &FamilyContext, id: Uuid) -> anyhow::Result<Option<M>>;
  async fn create(&self, family_context: &FamilyContext, object: M) -> anyhow::Result<String>;
  async fn update(&self, family_context: &FamilyContext, object: M) -> anyhow::Result<()>;
}

pub type CrudRepositoryBean<T> = Arc<Box<dyn CrudRepository<T>>>;
