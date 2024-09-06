use std::ops::Deref;
use axum::extract::{FromRef, FromRequestParts};
use axum::http::request::Parts;
use axum::http::StatusCode;
use serde::de::DeserializeOwned;
use serde::Serialize;
use crate::database::sqlite::SqliteDatabase;
use crate::repository::{CrudRepository, ShoppingListRepository, ShoppingListItemRepository};


#[derive(FromRef, Clone)]
pub struct AppState {
  pub database: SqliteDatabase,
}

pub struct Bean<T: ?Sized>(Box<T>);

impl<T: ?Sized> Deref for Bean<T> {
  type Target = T;

  fn deref(&self) -> &Self::Target {
    self.0.deref()
  }
}

#[async_trait::async_trait]
impl<M> FromRequestParts<AppState> for Bean<dyn CrudRepository<M>>
where
  M: Serialize + DeserializeOwned + Send,
  SqliteDatabase: CrudRepository<M>,
{
  type Rejection = StatusCode;

  async fn from_request_parts(parts: &mut Parts, state: &AppState) -> Result<Self, Self::Rejection> {
    Ok(Bean(Box::new(state.database.clone())))
  }
}

macro_rules! db_bean {
    ($trat_name:ident) => {
        #[async_trait::async_trait]
        impl FromRequestParts<AppState> for Bean<dyn $trat_name> {
          type Rejection = StatusCode;

          async fn from_request_parts(parts: &mut Parts, state: &AppState) -> Result<Self, Self::Rejection> {
            Ok(Bean(Box::new(state.database.clone())))
          }
        }
    };
}

db_bean!(ShoppingListRepository);
db_bean!(ShoppingListItemRepository);



// #[async_trait::async_trait]
// impl FromRequestParts<AppState> for Bean<dyn ShoppingListRepository> {
//   type Rejection = StatusCode;
//
//   async fn from_request_parts(parts: &mut Parts, state: &AppState) -> Result<Self, Self::Rejection> {
//     Ok(Bean(Box::new(state.database.clone())))
//   }
// }
