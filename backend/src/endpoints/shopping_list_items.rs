use axum::{Router};
use crate::app_state::{AppState};
use crate::model;
use crate::repo_endpoint_builder::RepoEndpointBuilder;

pub fn make_router() -> Router<AppState> {
  Router::<AppState>::new()
    .with_crud_repository::<model::ShoppingListItem>()
}


