use crate::family_context::FamilyContext;
use crate::model::{SearchParams, SearchResult, ShoppingList};
use crate::repository::CrudRepository;
use anyhow::Result;
use uuid::Uuid;

#[async_trait::async_trait]
pub trait ProductRepository: CrudRepository<ShoppingList> {
  async fn search_shopping_lists(
    &self,
    family_context: &FamilyContext,
    product_id: Uuid,
    search_params: SearchParams,
  ) -> Result<SearchResult<Uuid>>;
}
