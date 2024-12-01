use crate::app_state::{AppState, Bean};
use crate::family_context::FamilyContext;
use crate::model;
use crate::model::SearchParams;
use crate::repo_endpoint_builder::RepoEndpointBuilder;
use crate::repository::ShoppingListRepository;
use axum::extract::{Path, Query};
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::routing::get;
use axum::{Json, Router};
use uuid::Uuid;

pub fn make_router() -> Router<AppState> {
  Router::<AppState>::new()
    .with_crud_repository::<model::ShoppingList>()
    .route("/:id/items", get(get_shopping_list_items))
}

pub async fn get_shopping_list_items(
  family_context: FamilyContext,
  Path(shopping_list_id): Path<Uuid>,
  Query(search_params): Query<SearchParams>,
  shopping_list_repo: Bean<dyn ShoppingListRepository>,
) -> Result<impl IntoResponse, StatusCode> {
  match shopping_list_repo
    .search_items(&family_context, shopping_list_id, search_params)
    .await
  {
    Ok(items) => Ok(Json(items)),
    Err(err) => {
      log::error!("{}", err);
      Err(StatusCode::INTERNAL_SERVER_ERROR)
    }
  }
}
