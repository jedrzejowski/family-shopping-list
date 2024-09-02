mod app_state;
mod endpoints;
mod database;
mod model;
mod family_context;
mod repository;
pub mod repo_endpoint_builder;

use anyhow::Result;
use axum::Router;
use sqlx::{Acquire, Connection};
use crate::app_state::AppState;
use crate::database::sqlite::SqliteDatabase;

#[tokio::main]
async fn main() -> Result<()> {
  dotenv::dotenv().ok();
  env_logger::init();

  let database = SqliteDatabase::from_file("database.sqlite").await?;

  let app_state = AppState {
    database,
  };

  let app = Router::new()
    .nest("/api/products", endpoints::products::make_router())
    .nest("/api/shops", endpoints::shops::make_router())
    .nest("/api/shopping-lists", endpoints::shopping_lists::make_router())
    .nest("/api/shopping-list-items", endpoints::shopping_list_items::make_router())
    .with_state(app_state)
    ;


  let listener = tokio::net::TcpListener::bind("127.0.0.1:8081").await?;
  axum::serve(listener, app).await?;

  Ok(())
}
