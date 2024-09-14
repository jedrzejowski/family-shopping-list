use axum::Router;
use axum::routing::get;
use crate::app_state::AppState;

pub mod products;
pub mod shops;
pub mod shopping_lists;
pub mod shopping_list_items;
pub mod everything;

pub fn make_router() -> Router<AppState> {
  Router::<AppState>::new()
    .route("/everything", get(everything::everything))
    .nest("/products", products::make_router())
    .nest("/shops", shops::make_router())
    .nest("/shopping-lists", shopping_lists::make_router())
    .nest("/shopping-list-items", shopping_list_items::make_router())
}

