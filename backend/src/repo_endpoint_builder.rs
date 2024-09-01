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
use crate::repository::CrudRepositoryBean;
use crate::family_context::FamilyContext;
use crate::model::SearchParams;

pub trait RepoEndpointBuilder<State> {
  fn with_crud_repository<Model>(self) -> Self
  where
    Model: Serialize + DeserializeOwned + Send + 'static,
    CrudRepositoryBean<Model>: FromRef<State>;
}

impl<S> RepoEndpointBuilder<S> for Router<S>
where
  S: Clone + Send + Sync + 'static,
{
  fn with_crud_repository<M>(self) -> Self
  where
    M: Serialize + DeserializeOwned + Send + 'static,
    CrudRepositoryBean<M>: FromRef<S>,
  {
    self
      .route("/", get(get_id_list::<M>))
      .route("/", post(create_entity::<M>))
      .route("/:shop_id", get(get_entity::<M>))
      .route("/:shop_id", put(update_entity::<M>))
  }
}

async fn get_id_list<M>(
  family_context: FamilyContext,
  repo: State<CrudRepositoryBean<M>>,
  Query(search_params): Query<SearchParams>,
) -> Result<impl IntoResponse, StatusCode>
where
  M: Serialize + DeserializeOwned + Send,
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


async fn get_entity<M>(
  family_context: FamilyContext,
  product_repo: State<CrudRepositoryBean<M>>,
  Path(product_id): Path<Uuid>,
) -> Result<impl IntoResponse, StatusCode>
where
  M: Serialize + DeserializeOwned + Send,
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

async fn create_entity<M>(
  family_context: FamilyContext,
  repo: State<CrudRepositoryBean<M>>,
  Json(entity): Json<M>,
) -> Result<impl IntoResponse, StatusCode>
where
  M: Serialize + DeserializeOwned + Send,
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

async fn update_entity<M>(
  family_context: FamilyContext,
  repo: State<CrudRepositoryBean<M>>,
  Json(entity): Json<M>,
) -> Result<impl IntoResponse, StatusCode>
where
  M: Serialize + DeserializeOwned + Send,
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