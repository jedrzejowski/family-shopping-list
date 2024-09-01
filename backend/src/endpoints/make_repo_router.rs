use std::collections::HashMap;
use std::marker::PhantomData;
use axum::extract::{FromRef, Path, Query, Request, State};
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::{Json, Router};
use axum::handler::Handler;
use axum::routing::{get, post, put};
use serde::{Deserialize, Serialize};
use serde::de::DeserializeOwned;
use uuid::Uuid;
use crate::app_state::AppState;
use crate::database::CrudRepositoryBean;
use crate::family_context::FamilyContext;
use crate::model::SearchParams;

pub fn make_repo_router<T: 'static>() -> Router<AppState>
where
  T: Serialize + DeserializeOwned + Send,
  CrudRepositoryBean<T>: FromRef<AppState>,
{
  Router::new()
    .route("/", get(get_id_list::<T>))
    .route("/", post(create_entity::<T>))
    .route("/:shop_id", get(get_entity::<T>))
    .route("/:shop_id", put(update_entity::<T>))
}

async fn get_id_list<T>(
  family_context: FamilyContext,
  repo: State<CrudRepositoryBean<T>>,
  Query(search_params): Query<SearchParams>,
) -> Result<impl IntoResponse, StatusCode>
where
  T: Serialize + DeserializeOwned + Send,
{
  match repo.search(&family_context, search_params).await {
    Ok(search_result) => {
      Ok(Json(search_result))
    }
    Err(err) => {
      log::error!("{}", err);
      Err(StatusCode::INTERNAL_SERVER_ERROR)
    }
  }
}


async fn get_entity<T>(
  family_context: FamilyContext,
  product_repo: State<CrudRepositoryBean<T>>,
  Path(product_id): Path<Uuid>,
) -> Result<impl IntoResponse, StatusCode>
where
  T: Serialize + DeserializeOwned + Send,
{
  match product_repo.get(&family_context, product_id).await {
    Ok(Some(product)) => Ok(Json(product)),
    Ok(None) => Err(StatusCode::NOT_FOUND),
    Err(err) => {
      log::error!("{}", err);
      Err(StatusCode::INTERNAL_SERVER_ERROR)
    }
  }
}

async fn create_entity<T>(
  family_context: FamilyContext,
  repo: State<CrudRepositoryBean<T>>,
  Json(entity): Json<T>,
) -> Result<impl IntoResponse, StatusCode>
where
  T: Serialize + DeserializeOwned + Send,
{
  match repo.create(&family_context, entity).await {
    Ok(productId) => {
      let mut response = HashMap::<String, serde_json::Value>::new();
      response.insert(repo.id_field().to_string(), serde_json::Value::String(productId));

      Ok((StatusCode::CREATED, Json(response)))
    }
    Err(err) => {
      println!("{}", err);
      Err(StatusCode::INTERNAL_SERVER_ERROR)
    }
  }
}

async fn update_entity<T>(
  family_context: FamilyContext,
  repo: State<CrudRepositoryBean<T>>,
  Json(entity): Json<T>,
) -> Result<impl IntoResponse, StatusCode>
where
  T: Serialize + DeserializeOwned + Send,
{
  match repo.update(&family_context, entity).await {
    Ok(_) => {
      Ok(StatusCode::ACCEPTED)
    }
    Err(err) => {
      println!("{}", err);
      Err(StatusCode::INTERNAL_SERVER_ERROR)
    }
  }
}
