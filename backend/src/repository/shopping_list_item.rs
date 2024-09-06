use uuid::Uuid;
use anyhow::Result;
use crate::family_context::FamilyContext;
use crate::model::ShoppingListItem;
use crate::repository::CrudRepository;

#[async_trait::async_trait]
pub trait ShoppingListItemRepository: CrudRepository<ShoppingListItem> {
  async fn set_is_checked(&self, family_context: &FamilyContext, shopping_list_item_id: Uuid, is_checked: bool) -> Result<()>;
}
