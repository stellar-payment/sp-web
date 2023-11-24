use serde::{Deserialize, Serialize};

use crate::{
   api::{ApiResponse, BASE_API},
   error::BackendError,
};

#[derive(Clone, Serialize, Deserialize, Default)]
pub struct PartnerPKPayload {
   pub public_key: String,   
}

#[derive(Clone, Serialize, Deserialize, Default)]
#[serde(default)]
pub struct PartnerPayload {
   pub id: String,
   pub name: String,
   pub address: String,
   pub phone: String,
   pub email: String,
   pub pic_name: String,
   pub pic_email: String,
   pub pic_phone: String,
   pub partner_secret: String,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct PartnerResponse {
   pub id: String,
   pub name: String,
   pub address: String,
   pub phone: String,
   pub email: String,
   #[serde(skip_serializing_if = "String::is_empty")]
   pub pic_name: String,
   #[serde(skip_serializing_if = "String::is_empty")]
   pub pic_email: String,
   #[serde(skip_serializing_if = "String::is_empty")]
   pub pic_phone: String,
   #[serde(skip_serializing_if = "String::is_empty")]
   pub partner_secret: String,
}

pub async fn register_partner(payload: PartnerPayload) -> Result<PartnerResponse, BackendError> {
   let client = reqwest::Client::new();

   let res = match client
      .post(format!("{}/ms/security/api/v1/partners", BASE_API))
      .json(&payload)
      .send()
      .await
   {
      Ok(v) => v,
      Err(_) => {
         return Err(BackendError::GenericError(
            "failed to register client".to_string(),
         ))
      }
   };

   let req_status = res.status();

   let data = match res.json::<ApiResponse<PartnerResponse>>().await {
      Ok(v) => v,
      Err(e) => {
         return Err(BackendError::GenericError(
            format!("failed to register client req err: {}", e),
         ))
      }
   };

   if !req_status.is_success() {
      return Err(BackendError::GenericError(format!(
         "failed to register client res err: {}",
         data.error.unwrap().message.unwrap()
      )));
   }

   Ok(data.data.unwrap())
}

pub async fn register_partner_pk(pid: String, payload: PartnerPKPayload) -> Result<(), BackendError> {
   let client = reqwest::Client::new();

   let res = match client
      .post(format!("{}/ms/security/api/v1/keypairs/partners/{}", BASE_API, pid))
      .json(&payload)
      .send()
      .await
   {
      Ok(v) => v,
      Err(_) => {
         return Err(BackendError::GenericError(
            "failed to register client".to_string(),
         ))
      }
   };

   let req_status = res.status();

   let data = match res.json::<ApiResponse<PartnerPKPayload>>().await {
      Ok(v) => v,
      Err(e) => {
         return Err(BackendError::GenericError(
            format!("failed to register client err: {}", e),
         ))
      }
   };

   if !req_status.is_success() {
      return Err(BackendError::GenericError(format!(
         "failed to register client err: {}",
         data.error.unwrap().message.unwrap()
      )));
   }

   Ok(())
}