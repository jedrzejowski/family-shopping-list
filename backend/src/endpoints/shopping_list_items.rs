use axum::{Router};
use axum::extract::Path;
use axum::http::StatusCode;
use axum::routing::post;
use uuid::Uuid;
use crate::app_state::{AppState, Bean};
use crate::family_context::FamilyContext;
use crate::model;
use crate::repo_endpoint_builder::RepoEndpointBuilder;
use crate::repository::ShoppingListItemRepository;

pub fn make_router() -> Router<AppState> {
  Router::<AppState>::new()
    .route("/:id/check", post(check_item))
    .route("/:id/uncheck", post(uncheck_item))
    .with_crud_repository::<model::ShoppingListItem>()
}

async fn check_item(
  family_context: FamilyContext,
  Path(id): Path<Uuid>,
  repo: Bean<dyn ShoppingListItemRepository>,
) -> StatusCode {
  match repo.set_is_checked(&family_context, id, true).await {
    Ok(_) => StatusCode::OK,
    Err(err) => {
      log::error!("{}", err);
      StatusCode::INTERNAL_SERVER_ERROR
    },
  }
}

async fn uncheck_item(
  family_context: FamilyContext,
  Path(id): Path<Uuid>,
  repo: Bean<dyn ShoppingListItemRepository>,
) -> StatusCode {
  match repo.set_is_checked(&family_context, id, false).await {
    Ok(_) => StatusCode::OK,
    Err(err) => {
      log::error!("{}", err);
      StatusCode::INTERNAL_SERVER_ERROR
    },
  }
}

