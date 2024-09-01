use axum::extract::FromRef;
use crate::database::{RepositoryBean};
use crate::model;

#[derive(FromRef, Clone)]
pub struct AppState {
    pub product_repo: RepositoryBean<model::Product>,
    pub shop_repo: RepositoryBean<model::Shop>,
    pub shopping_list_repo: RepositoryBean<model::ShoppingList>,
}

