use axum::extract::{Path, Query, State};
use axum::{Json, Router};
use axum::body::Body;
use axum::http::{Response, StatusCode};
use axum::response::IntoResponse;
use axum::routing::{get, post};
use uuid::Uuid;
use log::log;
use serde::Deserialize;
use serde_json::json;
use crate::app_state::AppState;
use crate::database::{RepositoryBean};
use crate::family_context::FamilyContext;
use crate::model;

pub fn make_router() -> Router<AppState> {
  Router::new()
    .route("/", get(get_product_id_list).post(create_product))
    .route("/:product_id", get(get_product).put(update_product))
}


pub async fn get_product_id_list(
  family_context: FamilyContext,
  product_repo: State<RepositoryBean<model::Product>>,
  Query(search_params): Query<model::SearchParams>,
) -> Result<impl IntoResponse, StatusCode> {
  match product_repo.search(&family_context, search_params).await {
    Ok(search_result) => {
      Ok(Json(search_result))
    }
    Err(err) => {
      log::error!("{}", err);
      Err(StatusCode::INTERNAL_SERVER_ERROR)
    }
  }
}


pub async fn get_product(
  family_context: FamilyContext,
  product_repo: State<RepositoryBean<model::Product>>,
  Path(product_id): Path<Uuid>,
) -> Result<impl IntoResponse, StatusCode> {
  match product_repo.get(&family_context, product_id).await {
    Ok(Some(product)) => Ok(Json(product)),
    Ok(None) => Err(StatusCode::NOT_FOUND),
    Err(err) => {
      log::error!("{}", err);
      Err(StatusCode::INTERNAL_SERVER_ERROR)
    }
  }
}

pub async fn create_product(
  family_context: FamilyContext,
  product_repo: State<RepositoryBean<model::Product>>,
  Json(product): Json<model::Product>,
) -> Result<impl IntoResponse, StatusCode> {
  match product_repo.create(&family_context, product).await {
    Ok(productId) => {
      let value = json!({
        "productId": productId
      });
      Ok((StatusCode::CREATED, Json(value)))
    }
    Err(err) => {
      println!("{}", err);
      Err(StatusCode::INTERNAL_SERVER_ERROR)
    }
  }
}

pub async fn update_product(
  family_context: FamilyContext,
  product_repo: State<RepositoryBean<model::Product>>,
  Json(product): Json<model::Product>,
) -> Result<impl IntoResponse, StatusCode> {
  match product_repo.update(&family_context, product).await {
    Ok(_) => {
      Ok(StatusCode::ACCEPTED)
    }
    Err(err) => {
      println!("{}", err);
      Err(StatusCode::INTERNAL_SERVER_ERROR)
    }
  }
}
