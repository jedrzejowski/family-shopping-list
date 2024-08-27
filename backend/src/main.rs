mod app_state;
mod endpoints;
mod database;
mod model;
mod family_context;

use std::sync::Arc;
use anyhow::Result;
use axum::Router;
use crate::app_state::AppState;
use crate::database::{RepositoryBean};
use crate::database::sqlite::SqlLiteDatabase;

#[tokio::main]
async fn main() -> Result<()> {
  dotenv::dotenv().ok();
  env_logger::init();

  let database = SqlLiteDatabase::from_file("database.sqlite")?;
  let product_repo: RepositoryBean<model::Product> = Arc::new(Box::new(database.clone()));
  let shop_repo: RepositoryBean<model::Shop> = Arc::new(Box::new(database.clone()));

  let app_state = AppState {
    product_repo,
    shop_repo,
  };

  let app = Router::new()
    .nest("/api/products", endpoints::products::make_router())
    .nest("/api/shops", endpoints::shops::make_router())
    .with_state(app_state)
    ;


  let listener = tokio::net::TcpListener::bind("127.0.0.1:8081").await?;
  axum::serve(listener, app).await?;

  Ok(())
}
