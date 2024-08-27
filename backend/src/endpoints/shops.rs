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
use crate::model;

pub fn make_router() -> Router<AppState> {
  Router::new()
    .route("/", get(get_shop_id_list).post(create_shop))
    .route("/:shop_id", get(get_shop).put(update_shop))
}


pub async fn get_shop_id_list(
  shop_repo: State<RepositoryBean<model::Shop>>,
  Query(search_params): Query<model::SearchParams>,
) -> Result<impl IntoResponse, StatusCode> {
  match shop_repo.search(search_params).await {
    Ok(search_result) => {
      Ok(Json(search_result))
    }
    Err(err) => {
      log::error!("{}", err);
      Err(StatusCode::INTERNAL_SERVER_ERROR)
    },
  }
}


pub async fn get_shop(
  shop_repo: State<RepositoryBean<model::Shop>>,
  Path(shop_id): Path<Uuid>,
) -> Result<impl IntoResponse, StatusCode> {
  match shop_repo.get(shop_id).await {
    Ok(Some(shop)) => Ok(Json(shop)),
    Ok(None) => Err(StatusCode::NOT_FOUND),
    Err(err) => {
      log::error!("{}", err);
      Err(StatusCode::INTERNAL_SERVER_ERROR)
    }
  }
}

pub async fn create_shop(
  shop_repo: State<RepositoryBean<model::Shop>>,
  Json(shop): Json<model::Shop>,
) -> Result<impl IntoResponse, StatusCode> {
  match shop_repo.create(shop).await {
    Ok(shopId) => {
      let value = json!({
        "shopId": shopId
      });
      Ok((StatusCode::CREATED, Json(value)))
    }
    Err(err) => {
      println!("{}", err);
      Err(StatusCode::INTERNAL_SERVER_ERROR)
    }
  }
}

pub async fn update_shop(
  shop_repo: State<RepositoryBean<model::Shop>>,
  Json(shop): Json<model::Shop>,
) -> Result<impl IntoResponse, StatusCode> {
  match shop_repo.update(shop).await {
    Ok(_) => {
      Ok(StatusCode::ACCEPTED)
    }
    Err(err) => {
      println!("{}", err);
      Err(StatusCode::INTERNAL_SERVER_ERROR)
    }
  }
}
