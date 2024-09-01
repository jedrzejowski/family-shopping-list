use axum::{Router};
use crate::app_state::AppState;
use crate::repo_endpoint_builder::{RepoEndpointBuilder};
use crate::model;

pub fn make_router() -> Router<AppState> {
  Router::new()
    .with_crud_repository::<model::ShoppingList>()
}

