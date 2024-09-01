use std::marker::PhantomData;
use axum::extract::{FromRef, FromRequestParts};
use axum::http::request::Parts;
use axum::http::StatusCode;
use crate::database::sqlite::SqliteDatabase;
use crate::model;
use crate::repository::CrudRepositoryBean;

#[derive(FromRef, Clone)]
pub struct AppState {
  pub database: SqliteDatabase,
  pub product_repo: CrudRepositoryBean<model::Product>,
  pub shop_repo: CrudRepositoryBean<model::Shop>,
  pub shopping_list_repo: CrudRepositoryBean<model::ShoppingList>,
}

pub struct Bean<T: ?Sized> {
  phantom_data: PhantomData<T>,
}

#[async_trait::async_trait]
impl <T: ?Sized> FromRequestParts<AppState> for Bean<T>{
  type Rejection = StatusCode;

  async fn from_request_parts(parts: &mut Parts, state: &AppState) -> Result<Self, Self::Rejection> {
    todo!()
  }
}
