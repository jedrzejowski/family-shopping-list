use crate::family_context::FamilyContext;
use crate::model::{SearchParams, SearchResult, ShoppingList};
use crate::repository::CrudRepository;
use anyhow::Result;
use uuid::Uuid;

#[async_trait::async_trait]
pub trait ShoppingListRepository: CrudRepository<ShoppingList> {
  async fn search_items(
    &self,
    family_context: &FamilyContext,
    shopping_list_id: Uuid,
    search_params: SearchParams,
  ) -> Result<SearchResult<Uuid>>;
}
