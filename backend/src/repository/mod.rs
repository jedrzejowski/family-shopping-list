mod shopping_list;
mod sqlite_impl;
mod shopping_list_item;

pub use shopping_list::ShoppingListRepository;
pub use shopping_list_item::ShoppingListItemRepository;

use serde::de::DeserializeOwned;
use serde::Serialize;
use uuid::Uuid;
use anyhow::Result;
use crate::app_state::Bean;
use crate::family_context::FamilyContext;
use crate::model::{SearchParams, SearchResult};

#[async_trait::async_trait]
pub trait CrudRepository<M>: Sync + Send
where
  M: Serialize + DeserializeOwned + Send,
{
  fn id_field(&self) -> &str;
  async fn search(&self, family_context: &FamilyContext, search_params: SearchParams) -> Result<SearchResult<Uuid>>;
  async fn get(&self, family_context: &FamilyContext, id: Uuid) -> Result<Option<M>>;
  async fn create(&self, family_context: &FamilyContext, object: M) -> Result<String>;
  async fn update(&self, family_context: &FamilyContext, object: M) -> Result<()>;
  async fn delete(&self, family_context: &FamilyContext, id: Uuid) -> Result<()>;

  async fn get_all_ids(&self, family_context: &FamilyContext) -> Result<Vec<Uuid>> {
    Ok(self.search(family_context, SearchParams::infinity()).await?.items)
  }

  async fn get_all(&self, family_context: &FamilyContext) -> Result<Vec<M>> {
    let all_ids = self.get_all_ids(family_context).await?;

    let mut vec = Vec::with_capacity(all_ids.len());

    for id in all_ids {
      let entity = self.get(family_context, id).await?;
      if let Some(entity) = entity {
        vec.push(entity);
      }
    }

    return Ok(vec);
  }
}

pub type CrudRepositoryBean<T> = Bean<dyn CrudRepository<T>>;
