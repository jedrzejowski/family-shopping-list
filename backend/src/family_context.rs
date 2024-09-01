use axum::extract::FromRequestParts;
use axum::http::request::Parts;
use axum::http::{StatusCode};
use uuid::Uuid;

pub struct FamilyContext {
  pub family_id: Uuid,
}

#[async_trait::async_trait]
impl <S> FromRequestParts<S> for FamilyContext {
  type Rejection = StatusCode;

  async fn from_request_parts(parts: &mut Parts, state: &S) -> Result<Self, Self::Rejection> {
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
      family_id: family_id,
    })
  }
}
