use axum::extract::FromRef;
use crate::database::{CrudRepositoryBean};
use crate::model;

#[derive(FromRef, Clone)]
pub struct AppState {
    pub product_repo: CrudRepositoryBean<model::Product>,
    pub shop_repo: CrudRepositoryBean<model::Shop>,
    pub shopping_list_repo: CrudRepositoryBean<model::ShoppingList>,
}

