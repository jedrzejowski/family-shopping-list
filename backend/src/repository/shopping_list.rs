use uuid::Uuid;
use crate::family_context::FamilyContext;
use anyhow::Result;
use crate::model::ShoppingList;
use crate::repository::CrudRepository;

#[async_trait::async_trait]
pub trait ShoppingListRepository: CrudRepository<ShoppingList> {
  async fn get_items(&self, family_context: &FamilyContext, shopping_list_id: Uuid) -> Result<Vec<String>>;
}

