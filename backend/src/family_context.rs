use axum::extract::FromRequestParts;
use axum::http::request::Parts;
use axum::http::{StatusCode};
use uuid::Uuid;
use crate::app_state::AppState;

pub struct FamilyContext {
  pub family_id: String,
}

#[async_trait::async_trait]
impl FromRequestParts<AppState> for FamilyContext {
  type Rejection = StatusCode;

  async fn from_request_parts(parts: &mut Parts, state: &AppState) -> Result<Self, Self::Rejection> {
    let family_id = parts.headers.get("x-family-id");

    let family_id = match family_id {
      None => return Err(StatusCode::BAD_REQUEST),
      Some(some) => some,
    };

    let family_id = match Uuid::try_parse_ascii(family_id.as_bytes()) {
      Err(_) => return Err(StatusCode::BAD_REQUEST),
      Ok(ok) => ok,
    };

    Ok(FamilyContext {
      family_id: family_id.to_string(),
    })
  }
}
