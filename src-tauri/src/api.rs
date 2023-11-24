use crate::error::BackendError;
use serde::{Deserialize, Serialize};

macro_rules! env_or {
   ($name: expr, $default: expr) => {
      if let Some(val) = option_env!($name) {
         val
      } else {
         $default
      }
   };
}

pub const BASE_API: &str = env_or!("BASE_API", "");

#[derive(Clone, Debug, PartialEq, Eq, Deserialize, Serialize)]
pub struct ApiResponse<T> {
   pub data: Option<T>,
   pub error: Option<ErrorResponse>,
}

#[derive(Clone, Debug, PartialEq, Eq, Deserialize, Serialize)]
pub struct ErrorResponse {
   pub code: u16,
   #[serde(rename = "msg")]
   pub message: Option<String>,
}

#[derive(Clone, Debug, PartialEq, Eq, Deserialize, Serialize)]
pub struct PingResponse {
   message: String,
   timestamp: u64,
}

#[tauri::command]
pub async fn ping_backend() -> String {
   let client = reqwest::Client::new();

   let res = match client.get(format!("{}/api/v1/ping", BASE_API)).send().await {
      Ok(v) => v,
      Err(_) => return format!("failed to contacting home"),
   };

   if !res.status().is_success() {
      let data = match res.json::<ApiResponse<PingResponse>>().await {
         Ok(v) => v,
         Err(e) => return format!("failed to contacting home err: {}", e.to_string()),
      };

      data.error.unwrap().message.unwrap()
   } else {
      "".to_string()
   }
}