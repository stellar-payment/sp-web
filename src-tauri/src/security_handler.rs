use std::sync::{Arc, Mutex};

use data_encoding::BASE64;
use log::{debug, info};
use p256::{elliptic_curve::generic_array::GenericArray, NistP256, PublicKey, SecretKey, U32};
use rand::seq::SliceRandom;
use rand_core::OsRng;
use serde::{Deserialize, Serialize};

use crate::{
    api::{ApiResponse, BASE_API},
    config_store::ConfigStore,
    error::{BackendError, BackendResult},
    partner_handler::{register_partner, register_partner_pk, PartnerPKPayload, PartnerPayload},
    security::{
        aes256_decrypt, aes256_encrypt, aes256_iv_decrypt, aes256_iv_encrypt, ecdh_generate_secret,
        generate_shared_key, hmac512_hash, hmac512_verify,
    },
};

const KEY_PID: &str = "PARTNER_ID";
const KEY_SK: &str = "SECRET_KEY";
const KEY_PK: &str = "PUBLIC_KEY";

#[derive(Clone, Serialize, Deserialize, Default)]
pub struct DecryptDataPayload {
    // pub partner_id: String,
    pub data: String,
    pub tag: String,
    pub keypair_hash: String,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct EncryptDataPayload {
    pub data: String,
    pub partner_id: String,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct EncryptedData {
    pub data: String,
    pub tag: String,
    pub partner_id: String,
    pub keypair_hash: String,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct DecryptedData {
    pub data: String,
}

#[tauri::command]
pub async fn encrypt_payload(
    key_state: tauri::State<'_, KeyStoreState>,
    payload: String,
) -> BackendResult<EncryptedData, BackendError> {
    let (secret_key, partner_id) = {
        let keystore = &mut *key_state.keystore.lock().unwrap();

        let secret_key = match keystore.get_secret_key() {
            Some(v) => v,
            None => {
                return Err(BackendError::ConfigMalformedError(
                    "SecretKey not found".to_string(),
                ))
            }
        };

        (secret_key, keystore.get_partner_id())
    };

    let master_cred = match generate_master_keypair().await {
        Ok(v) => v,
        Err(e) => return Err(BackendError::GenericError(e.to_string())),
    };
    
    let decoded_pk = match BASE64.decode(master_cred.public_key.as_bytes()) {
        Ok(v) => v,
        Err(e) => return Err(BackendError::GenericError(e.to_string())),
    };
    let public_key = match PublicKey::from_sec1_bytes(&decoded_pk) {
        Ok(v) => v,
        Err(e) => return Err(BackendError::GenericError(e.to_string())),
    };
    
    let shared_secret: p256::elliptic_curve::ecdh::SharedSecret<NistP256> =
        ecdh_generate_secret(secret_key.clone(), public_key);
    let (enc_key, mac_key) = generate_shared_key(&shared_secret)?;

    let enc_key: GenericArray<u8, U32> = GenericArray::clone_from_slice(&enc_key);

    let (ct, iv) = aes256_iv_encrypt(enc_key, payload.as_bytes());
    let mac = match hmac512_hash(&mac_key, &ct) {
        Ok(v) => v,
        Err(e) => return Err(BackendError::GenericError(e.to_string())),
    };

    Ok(EncryptedData {
        data: format!("{}.{}", BASE64.encode(&ct), BASE64.encode(&iv)),
        tag: BASE64.encode(&mac),
        keypair_hash: master_cred.keypair_hash,
        partner_id: partner_id,
    })
}

#[tauri::command]
pub async fn decrypt_payload(
    key_state: tauri::State<'_, KeyStoreState>,
    payload: DecryptDataPayload,
) -> BackendResult<String, BackendError> {
    let secret_key = {
        let keystore = &mut *key_state.keystore.lock().unwrap();

        // if keystore.get_partner_id() != payload.partner_id {
        //    return Err(BackendError::GenericError(
        //       "malformed data received".to_string(),
        //    ));
        // };

        match keystore.get_secret_key() {
            Some(v) => v,
            None => {
                return Err(BackendError::ConfigMalformedError(
                    "SecretKey not found".to_string(),
                ))
            }
        }
    };

    let master_cred = match get_master_keypair_by_hash(payload.keypair_hash).await {
        Ok(v) => v,
        Err(e) => return Err(BackendError::GenericError(e.to_string())),
    };

    let decoded_pk = match BASE64.decode(master_cred.public_key.as_bytes()) {
        Ok(v) => v,
        Err(e) => return Err(BackendError::GenericError(e.to_string())),
    };

    let public_key = match PublicKey::from_sec1_bytes(&decoded_pk) {
        Ok(v) => v,
        Err(e) => return Err(BackendError::GenericError(e.to_string())),
    };

    let (ct, iv) = payload.data.split_once('.').unwrap();

    let shared_secret = ecdh_generate_secret(secret_key.clone(), public_key);
    let (enc_key, mac_key) = generate_shared_key(&shared_secret)?;

    let ct = match BASE64.decode(ct.as_bytes()) {
        Ok(v) => v,
        Err(e) => return Err(BackendError::DataIntegrityError(e.to_string())),
    };

    let iv = match BASE64.decode(iv.as_bytes()) {
        Ok(v) => v,
        Err(e) => return Err(BackendError::DataIntegrityError(e.to_string())),
    };

    let tag = match BASE64.decode(payload.tag.as_bytes()) {
        Ok(v) => v,
        Err(e) => return Err(BackendError::DataIntegrityError(e.to_string())),
    };

    let enc_key: GenericArray<u8, U32> = GenericArray::clone_from_slice(&enc_key);
    match hmac512_verify(&mac_key, &ct, &tag) {
        Ok(_) => (),
        Err(e) => return Err(BackendError::DataIntegrityError(e.to_string())),
    }

    let pt = match aes256_iv_decrypt(enc_key, &iv, &ct) {
        Ok(v) => v,
        Err(e) => return Err(BackendError::DataIntegrityError(e.to_string())),
    };

    return Ok(String::from_utf8_lossy(&pt).to_string());
}

#[tauri::command]
pub async fn handle_is_registered(
    state: tauri::State<'_, KeyStoreState>,
) -> BackendResult<bool, ()> {
    let ks = &mut *state.keystore.lock().unwrap();

    Ok(!ks.get_partner_id().is_empty())
}

#[tauri::command]
pub async fn handle_register_partner(
    key_state: tauri::State<'_, KeyStoreState>,
    cfg_state: tauri::State<'_, ConfigStore>,
    payload: PartnerPayload,
) -> BackendResult<String, BackendError> {
    let secret = SecretKey::random(&mut OsRng);
    let public_key = secret.public_key();

    let encoded_pk = BASE64.encode(&public_key.to_sec1_bytes());
    let encoded_sk = BASE64.encode(&secret.to_bytes());
    let register_res = match register_partner(payload).await {
        Ok(v) => v,
        Err(e) => return Err(e),
    };

    let payload = PartnerPKPayload {
        public_key: encoded_pk.clone(),
    };
    match register_partner_pk(register_res.id.clone(), payload).await {
        Ok(_) => (),
        Err(e) => return Err(e),
    };

    let ks = &mut *key_state.keystore.lock().unwrap();

    ks.set_partner_id(register_res.id.clone());
    ks.set_public_key(public_key);
    ks.set_secret_key(secret);

    match cfg_state.save(KEY_PID.to_string(), Some(register_res.id.clone())) {
        Ok(_) => (),
        Err(e) => {
            return Err(BackendError::GenericError(format!(
                "failed to save config for partner_id err: {}",
                e
            )))
        }
    };

    match cfg_state.save(KEY_PK.to_string(), Some(encoded_pk)) {
        Ok(_) => (),
        Err(e) => {
            return Err(BackendError::GenericError(format!(
                "failed to save config for public_key err: {}",
                e
            )))
        }
    };

    match cfg_state.save(KEY_SK.to_string(), Some(encoded_sk)) {
        Ok(_) => (),
        Err(e) => {
            return Err(BackendError::GenericError(format!(
                "failed to save config for secret_key err: {}",
                e
            )))
        }
    };

    Ok(register_res.id)
}

pub struct KeyStore {
    partner_id: String,
    secret_key: Option<SecretKey>,
    public_key: Option<PublicKey>,
}

impl Default for KeyStore {
    fn default() -> Self {
        Self {
            partner_id: "".to_string(),
            secret_key: None,
            public_key: None,
        }
    }
}

pub struct KeyStoreState {
    pub keystore: Arc<Mutex<KeyStore>>,
}

pub fn init_keystore(config: &ConfigStore) -> Result<KeyStore, BackendError> {
    let pid = config
        .get(KEY_PID.to_string())
        .expect("failed to fetch partner_id")
        .unwrap_or("".to_string());

    if pid.is_empty() {
        return Err(BackendError::ConfigMalformedError("PartnerID".to_string()));
    }

    let encoded_secret_key = config
        .get(KEY_SK.to_string())
        .expect("failed to fetch secret_key")
        .unwrap();

    let encoded_public_key = config
        .get(KEY_PK.to_string())
        .expect("failed to fetch public_key")
        .unwrap();

    let slice_secret_key = BASE64.decode(encoded_secret_key.as_bytes()).unwrap();
    let secret_key = SecretKey::from_slice(&slice_secret_key).unwrap();

    let slice_public_key = BASE64.decode(encoded_public_key.as_bytes()).unwrap();
    let public_key = PublicKey::from_sec1_bytes(&slice_public_key).unwrap();

    Ok(KeyStore {
        partner_id: pid,
        secret_key: Some(secret_key),
        public_key: Some(public_key),
    })
}

impl KeyStore {
    pub fn get_partner_id(&self) -> String {
        self.partner_id.clone()
    }

    pub fn get_secret_key(&self) -> Option<SecretKey> {
        self.secret_key.clone()
    }

    pub fn get_public_key(&self) -> Option<PublicKey> {
        self.public_key
    }

    pub fn set_partner_id(&mut self, partner_id: String) {
        self.partner_id = partner_id;
    }

    pub fn set_secret_key(&mut self, secret_key: SecretKey) {
        self.secret_key = Some(secret_key);
    }

    pub fn set_public_key(&mut self, public_key: PublicKey) {
        self.public_key = Some(public_key);
    }
}

#[tauri::command]
pub async fn get_partner_id(
    key_state: tauri::State<'_, KeyStoreState>,
) -> BackendResult<String, BackendError> {
    let keystore = &mut *key_state
        .keystore
        .lock()
        .map_err(|e| BackendError::ConfigMalformedError(e.to_string()))?;

    Ok(keystore.get_partner_id())
}

#[derive(Clone, Serialize, Deserialize)]
pub struct MasterPKResponse {
    pub id: String,
    pub public_key: String,
    pub keypair_hash: String,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct ListMasterPKResponse {
    pub keys: Vec<MasterPKResponse>,
}

async fn get_master_keypair_by_hash(hash: String) -> Result<MasterPKResponse, BackendError> {
    let res = match reqwest::get(format!(
        "{}/ms/security/api/v1/keypairs/master/hash/{}",
        BASE_API,
        hash.clone()
    ))
    .await
    {
        Ok(v) => v,
        Err(_) => {
            return Err(BackendError::GenericError(
                "failed to fetch remote credentials".to_string(),
            ))
        }
    };

    let req_status = res.status();

    let data = match res.json::<ApiResponse<MasterPKResponse>>().await {
        Ok(v) => v,
        Err(e) => {
            return Err(BackendError::GenericError(format!(
                "failed to parse remote credentials err: {}",
                e
            )))
        }
    };

    if !req_status.is_success() {
        return Err(BackendError::GenericError(format!(
            "failed to fetch remote credentials err: {}",
            data.error.unwrap().message.unwrap()
        )));
    }

    Ok(data.data.unwrap())
}

async fn get_master_keypair_list() -> Result<ListMasterPKResponse, BackendError> {
    let res = match reqwest::get(format!("{}/ms/security/api/v1/keypairs/master", BASE_API,)).await
    {
        Ok(v) => v,
        Err(_) => {
            return Err(BackendError::GenericError(
                "failed to fetch remote credentials".to_string(),
            ))
        }
    };

    let req_status = res.status();

    let data = match res.json::<ApiResponse<ListMasterPKResponse>>().await {
        Ok(v) => v,
        Err(e) => {
            return Err(BackendError::GenericError(format!(
                "failed to parse remote credentials err: {}",
                e
            )))
        }
    };

    if !req_status.is_success() {
        return Err(BackendError::GenericError(format!(
            "failed to fetch remote credentials err: {}",
            data.error.unwrap().message.unwrap()
        )));
    }

    let master_keys = data.data.unwrap();
    if master_keys.keys.is_empty() {
        return Err(BackendError::GenericError(
            "master key not defined".to_string(),
        ));
    }

    Ok(master_keys)
}

async fn generate_master_keypair() -> Result<MasterPKResponse, BackendError> {
    let client = reqwest::Client::new();

    let res = match client
        .post(format!("{}/ms/security/api/v1/keypairs/master", BASE_API,))
        .send()
        .await
    {
        Ok(v) => v,
        Err(_) => {
            return Err(BackendError::GenericError(
                "failed to fetch remote credentials".to_string(),
            ))
        }
    };

    let req_status = res.status();

    let data = match res.json::<ApiResponse<MasterPKResponse>>().await {
        Ok(v) => v,
        Err(e) => {
            return Err(BackendError::GenericError(format!(
                "failed to parse remote credentials err: {}",
                e
            )))
        }
    };

    if !req_status.is_success() {
        return Err(BackendError::GenericError(format!(
            "failed to fetch remote credentials err: {}",
            data.error.unwrap().message.unwrap()
        )));
    }

    Ok(data.data.unwrap())
}
