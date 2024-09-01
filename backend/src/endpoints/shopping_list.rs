use axum::{Json, Router};
use axum::routing::get;
use crate::app_state::{AppState, Bean};
use crate::family_context::FamilyContext;
use crate::repo_endpoint_builder::{RepoEndpointBuilder};
use crate::model;
use crate::repository::ShoppingListRepository;

pub fn make_router() -> Router<AppState> {
  Router::new()
    .with_crud_repository::<model::ShoppingList>()
    .route("/:id/items", get(get_shopping_list_items))
}

pub async fn get_shopping_list_items(
  family_context: FamilyContext,
  shopping_list_repo: Bean<dyn ShoppingListRepository>,
) -> Json<Vec<String>> {
  todo!()
}

