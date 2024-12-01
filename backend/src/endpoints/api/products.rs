use crate::app_state::{AppState, Bean};
use crate::family_context::FamilyContext;
use crate::model;
use crate::model::SearchParams;
use crate::problem_details::ProblemDetails;
use crate::repo_endpoint_builder::RepoEndpointBuilder;
use crate::repository::ProductRepository;
use axum::extract::{Path, Query};
use axum::response::IntoResponse;
use axum::routing::get;
use axum::{Json, Router};
use uuid::Uuid;

pub fn make_router() -> Router<AppState> {
  Router::<AppState>::new()
    .with_crud_repository::<model::Product>()
    .route("/:id/shopping-lists", get(get_product_shopping_lists))
}

async fn get_product_shopping_lists(
  family_context: FamilyContext,
  Path(product_id): Path<Uuid>,
  Query(search_params): Query<SearchParams>,
  product_repo: Bean<dyn ProductRepository>,
) -> Result<impl IntoResponse, ProblemDetails> {
  let items = product_repo
    .search_shopping_lists(&family_context, product_id, search_params)
    .await?;

  Ok(Json(items))
}
