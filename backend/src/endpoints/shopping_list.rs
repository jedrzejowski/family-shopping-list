use axum::{Json, Router};
use axum::extract::{Path};
use axum::http::StatusCode;
use axum::routing::get;
use uuid::Uuid;
use crate::app_state::{AppState, Bean};
use crate::family_context::FamilyContext;
use crate::repo_endpoint_builder::{RepoEndpointBuilder};
use crate::model;
use crate::repository::ShoppingListRepository;

pub fn make_router() -> Router<AppState> {
  Router::<AppState>::new()
    .with_crud_repository::<model::ShoppingList>()
    .route("/:id/items", get(get_shopping_list_items))
}

pub async fn get_shopping_list_items(
  family_context: FamilyContext,
  Path(product_id): Path<Uuid>,
  shopping_list_repo: Bean<dyn ShoppingListRepository>,
) -> Result<Json<Vec<String>>, StatusCode> {
  match shopping_list_repo.get_items(&family_context, product_id).await {
    Ok(items) => Ok(Json(items)),
    Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
  }
}

