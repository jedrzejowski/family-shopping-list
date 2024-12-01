use crate::app_state::Bean;
use crate::family_context::FamilyContext;
use crate::model::SearchParams;
use crate::problem_details::ProblemDetails;
use crate::repository::{CrudRepository, CrudRepositoryBean};
use axum::extract::{FromRef, FromRequestParts, Path, Query, Request, State};
use axum::handler::Handler;
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::routing::{delete, get, post, put};
use axum::{Json, Router};
use serde::de::DeserializeOwned;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::marker::PhantomData;
use uuid::Uuid;

pub trait RepoEndpointBuilder<S> {
  fn with_crud_repository<M>(self) -> Self
  where
    M: Serialize + DeserializeOwned + Send + 'static,
    Bean<dyn CrudRepository<M>>: FromRequestParts<S>;
}

impl<S> RepoEndpointBuilder<S> for Router<S>
where
  S: Clone + Send + Sync + 'static,
{
  fn with_crud_repository<M>(self) -> Self
  where
    M: Serialize + DeserializeOwned + Send + 'static,
    Bean<dyn CrudRepository<M>>: FromRequestParts<S>,
  {
    self
      .route("/", get(get_id_list::<M>))
      .route("/", post(create_entity::<M>))
      .route("/:shop_id", get(get_entity::<M>))
      .route("/:shop_id", put(update_entity::<M>))
      .route("/:shop_id", delete(delete_entity::<M>))
  }
}

async fn get_id_list<M>(
  family_context: FamilyContext,
  repo: CrudRepositoryBean<M>,
  Query(search_params): Query<SearchParams>,
) -> Result<impl IntoResponse, ProblemDetails>
where
  M: Serialize + DeserializeOwned + Send,
{
  let search_result = repo.search(&family_context, search_params).await?;

  Ok(Json(search_result))
}

async fn get_entity<M>(
  family_context: FamilyContext,
  repo: CrudRepositoryBean<M>,
  Path(id): Path<Uuid>,
) -> Result<impl IntoResponse, ProblemDetails>
where
  M: Serialize + DeserializeOwned + Send,
{
  let entity = repo.get(&family_context, id).await?;
  match entity {
    Some(entity) => Ok(Json(entity)),
    None => Err(ProblemDetails::not_found()),
  }
}

async fn create_entity<M>(
  family_context: FamilyContext,
  repo: CrudRepositoryBean<M>,
  Json(entity): Json<M>,
) -> Result<impl IntoResponse, ProblemDetails>
where
  M: Serialize + DeserializeOwned + Send,
{
  let entity_id = repo.create(&family_context, entity).await?;

  let mut response = HashMap::<String, serde_json::Value>::new();
  response.insert(
    repo.id_field().to_string(),
    serde_json::Value::String(entity_id.to_string()),
  );

  Ok((StatusCode::CREATED, Json(response)))
}

async fn update_entity<M>(
  family_context: FamilyContext,
  repo: CrudRepositoryBean<M>,
  Json(entity): Json<M>,
) -> Result<impl IntoResponse, ProblemDetails>
where
  M: Serialize + DeserializeOwned + Send,
{
  repo.update(&family_context, entity).await?;
  Ok(StatusCode::ACCEPTED)
}

async fn delete_entity<M>(
  family_context: FamilyContext,
  repo: CrudRepositoryBean<M>,
  Path(id): Path<Uuid>,
) -> Result<impl IntoResponse, ProblemDetails>
where
  M: Serialize + DeserializeOwned + Send,
{
  repo.delete(&family_context, id).await?;
  Ok(StatusCode::ACCEPTED)
}
