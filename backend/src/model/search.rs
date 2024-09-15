use serde::{Deserialize, Deserializer, Serialize, Serializer};

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct SearchResult<T> {
  pub search_params: SearchParams,
  pub items: Vec<T>,
  pub total_count: usize,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub next_page_params: Option<SearchParams>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub previous_page_params: Option<SearchParams>,
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct SearchParams {
  #[serde(skip_serializing_if = "Option::is_none")]
  pub search_text: Option<String>,
  pub limit: SearchParamsLimit,
  pub offset: usize,
}

impl SearchParams {
  pub fn infinity() -> Self {
    Self {
      search_text: None,
      limit: SearchParamsLimit::Infinity,
      offset: 0,
    }
  }
}


#[derive(Clone)]
pub enum SearchParamsLimit {
  Number(usize),
  Infinity,
}

impl Serialize for SearchParamsLimit {
  fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
  where
    S: Serializer,
  {
    match *self {
      SearchParamsLimit::Number(ref number) => {
        Serialize::serialize(number, serializer)
      }
      SearchParamsLimit::Infinity => "Infinity".serialize(serializer),
    }
  }
}

impl<'de> Deserialize<'de> for SearchParamsLimit {
  fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
  where
    D: Deserializer<'de>,
  {
    use serde::de::Error;

    #[derive(Deserialize)]
    #[serde(untagged)]
    enum Helper {
      Number(usize),
      String(String),
    }

    let helper = Helper::deserialize(deserializer)?;

    match helper {
      Helper::Number(num) => Ok(SearchParamsLimit::Number(num)),
      Helper::String(string) => {
        if string == "Infinity" {
          return Ok(SearchParamsLimit::Infinity);
        }

        match string.parse::<usize>() {
          Ok(num) => Ok(SearchParamsLimit::Number(num)),
          Err(err) => Err(Error::custom("cant parse"))
        }
      }
    }
  }
}
