use axum::{Router};
use crate::app_state::AppState;
use crate::make_repo_router::make_repo_router;
use crate::model;

pub fn make_router() -> Router<AppState> {
  make_repo_router::<model::Product>()
}

