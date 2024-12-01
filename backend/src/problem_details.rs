use axum::body::Body;
use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
pub struct ProblemDetails {
  pub status: u16,
}

impl IntoResponse for ProblemDetails {
  fn into_response(self) -> Response {
    let my_json = serde_json::to_vec(&self).unwrap();

    Response::builder()
      .status(self.status)
      .body(Body::from(my_json))
      .unwrap()
  }
}

impl From<anyhow::Error> for ProblemDetails {
  fn from(value: anyhow::Error) -> Self {
    log::error!("{}", value);

    Self {
      status: StatusCode::INTERNAL_SERVER_ERROR.as_u16(),
    }
  }
}
