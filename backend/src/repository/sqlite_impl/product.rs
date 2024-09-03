use sqlx::Row;
use sqlx::sqlite::SqliteRow;
use uuid::Uuid;
use crate::database::sqlite::SqliteDatabase;
use crate::family_context::FamilyContext;
use crate::model::{Product, SearchParams, SearchResult};
use crate::repository::CrudRepository;

#[async_trait::async_trait]
impl CrudRepository<Product> for SqliteDatabase {
  fn id_field(&self) -> &str {
    "productId"
  }

  async fn search(&self, family_context: &FamilyContext, search_params: SearchParams) -> anyhow::Result<SearchResult<Uuid>> {

    // language=sqlite
    let mut qb = sqlx::QueryBuilder::new(
      "select product_id from products where ");
    qb.push("family_id = ").push_bind(family_context.family_id.to_string());

    self.make_text_search(qb, ["trade_name"], ["product_id"], search_params).await
  }

  async fn get(&self, family_context: &FamilyContext, product_id: Uuid) -> anyhow::Result<Option<Product>> {

    // language=sqlite
    let product = sqlx::query("
      select product_id, trade_name
      from products
      where family_id = ? and product_id = ?
    ")
      .bind(family_context.family_id.to_string())
      .bind(product_id.to_string())
      .map(|row: SqliteRow| {
        Product {
          product_id: Uuid::parse_str(row.get(0)).unwrap(),
          trade_name: row.get(1),
          tags: vec![],
        }
      })
      .fetch_all(self.pool())
      .await?
      .pop();

    Ok(product)
  }

  async fn create(&self, family_context: &FamilyContext, product: Product) -> anyhow::Result<String> {
    let product_id = Uuid::new_v4();

    // language=sqlite
    sqlx::query("
      insert
      into products(family_id, product_id, trade_name)
      values (?, ?, ?)
    ")
      .bind(family_context.family_id.to_string())
      .bind(product_id.to_string())
      .bind(&product.trade_name)
      .execute(self.pool())
      .await?;

    Ok(product_id.to_string())
  }

  async fn update(&self, family_context: &FamilyContext, product: Product) -> anyhow::Result<()> {
    // language=sqlite
    sqlx::query("
      update products
      set trade_name = ?
      where family_id = ? and product_id = ?
    ")
      .bind(&product.trade_name)
      .bind(family_context.family_id.to_string())
      .bind(product.product_id.to_string())
      .execute(self.pool())
      .await?;

    Ok(())
  }

  async fn delete(&self, family_context: &FamilyContext, product_id: Uuid) -> anyhow::Result<()> {

    // language=sqlite
    sqlx::query("
      delete from products where family_id = ? and product_id = ?
    ")
      .bind(family_context.family_id.to_string())
      .bind(product_id.to_string())
      .execute(self.pool())
      .await?;

    Ok(())
  }
}
