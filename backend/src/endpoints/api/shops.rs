use crate::app_state::AppState;
use crate::model;
use crate::repo_endpoint_builder::RepoEndpointBuilder;
use axum::Router;

pub fn make_router() -> Router<AppState> {
  Router::new().with_crud_repository::<model::Shop>()
}
