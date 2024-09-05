mod app_state;
mod endpoints;
mod database;
mod model;
mod family_context;
mod repository;
mod repo_endpoint_builder;

use tower_http::services::ServeDir;
use anyhow::Result;
use axum::Router;
use sqlx::{Acquire, Connection};
use crate::app_state::AppState;
use crate::database::sqlite::SqliteDatabase;

#[tokio::main]
async fn main() -> Result<()> {
  dotenv::dotenv().ok();
  env_logger::init();

  let database_file = get_env_var("DATABASE_FILE", "database.sqlite");
  let database = SqliteDatabase::from_file(database_file).await?;

  let app_state = AppState {
    database,
  };

  let serve_dir = {
    let serve_dir = get_env_var("SERVER_DIR", "./");
    ServeDir::new(serve_dir)
  };

  let app = Router::new()
    .nest("/api/products", endpoints::products::make_router())
    .nest("/api/shops", endpoints::shops::make_router())
    .nest("/api/shopping-lists", endpoints::shopping_lists::make_router())
    .nest("/api/shopping-list-items", endpoints::shopping_list_items::make_router())
    .nest_service("/", serve_dir)
    .with_state(app_state)
    ;

  let bind_addr = {
    let server_host = get_env_var("SERVER_HOST", "127.0.0.1");
    let server_port = get_env_var("SERVER_PORT", "8080");
    format!("{}:{}", &server_host, &server_port)
  };
  log::info!("binding to {}", bind_addr);
  let listener = tokio::net::TcpListener::bind(bind_addr).await?;
  axum::serve(listener, app).await?;

  Ok(())
}

fn get_env_var(name: &str, default: &str) -> String {
  match std::env::var(name) {
    Ok(ok) => ok,
    Err(_) => default.to_string()
  }
}
