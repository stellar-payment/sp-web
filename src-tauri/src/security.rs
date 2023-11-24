use aes::cipher::block_padding::{Pkcs7, UnpadError};
use aes::cipher::generic_array::GenericArray;
use aes::cipher::typenum::U32;
use aes::cipher::{BlockDecryptMut, BlockEncryptMut, KeyIvInit};
use hmac::Mac;
use p256::ecdh;
use rand_core::{OsRng, RngCore};
use p256::{SecretKey, PublicKey};
use sha2::Sha256;
use hkdf::Hkdf;

use crate::error::BackendError;

// AES-256-CBC
type Aes256CbcEnc = cbc::Encryptor<aes::Aes256>;
type Aes256CbcDec = cbc::Decryptor<aes::Aes256>;
pub fn aes256_iv_encrypt(key: GenericArray<u8, U32>, msg: &[u8]) -> (Vec<u8>, Vec<u8>) {
   let mut iv = [0u8; 16];
   OsRng.fill_bytes(&mut iv);

   let mut ct = Aes256CbcEnc::new(&key, &iv.into()).encrypt_padded_vec_mut::<Pkcs7>(msg);

   ct.extend_from_slice(&iv);
   (ct, iv.into())
}

pub fn aes256_encrypt(key: GenericArray<u8, U32>, msg: &[u8]) -> Vec<u8> {
   let mut iv = [0u8; 16];
   OsRng.fill_bytes(&mut iv);

   let mut ct = Aes256CbcEnc::new(&key, &iv.into()).encrypt_padded_vec_mut::<Pkcs7>(msg);

   ct.extend_from_slice(&iv);
   ct
}

pub fn aes256_decrypt(key: GenericArray<u8, U32>, msg: &[u8]) -> Result<Vec<u8>, UnpadError> {
   let (ct, iv) = msg.split_at(msg.len()-16);

   Aes256CbcDec::new(&key, iv.into()).decrypt_padded_vec_mut::<Pkcs7>(ct)
}


pub fn aes256_iv_decrypt(key: GenericArray<u8, U32>, iv: &[u8], msg: &[u8]) -> Result<Vec<u8>, UnpadError> {
   Aes256CbcDec::new(&key, iv.into()).decrypt_padded_vec_mut::<Pkcs7>(msg)
}

// ECDH
pub fn ecdh_generate_secret(sk: SecretKey, pk: PublicKey) -> ecdh::SharedSecret  {
   ecdh::diffie_hellman(sk.to_nonzero_scalar(), pk.as_affine())
}


// HKDF-SHA-256
pub fn generate_shared_key(secret: &ecdh::SharedSecret) -> Result<Vec<u8>, BackendError>{
   let key = secret.extract::<Sha256>(Some(b""));

   let mut shared_key = [0u8; 64]; 
   match Hkdf::expand(&key, &[], &mut shared_key) {
      Ok(_) => Ok(shared_key.to_vec()),
      Err(e) => Err(BackendError::GenericError(e.to_string()))
   }
}


// HMAC256
type HMAC256 = hmac::Hmac<sha2::Sha256>;

pub fn hmac256_hash(key: &[u8], msg: &[u8]) -> Result<Vec<u8>, BackendError> {
   let mut hash = HMAC256::new_from_slice(key).map_err(|e| BackendError::GenericError(e.to_string()))?;
   hash.update(msg);
   Ok(hash.finalize().into_bytes().to_vec())
}


pub fn hmac256_verify(key: &[u8], msg: &[u8], tag: &[u8]) -> Result<(), BackendError> {
   let mut hash = HMAC256::new_from_slice(key).map_err(|e| BackendError::GenericError(e.to_string()))?;
   hash.update(msg);
   match hash.verify_slice(tag) {
      Ok(_) => Ok(()),
      Err(e) => Err(BackendError::GenericError(e.to_string()))
   }  
}

// HMAC512
type HMAC512 = hmac::Hmac<sha2::Sha512>;

pub fn hmac512_hash(key: &[u8], msg: &[u8]) -> Result<Vec<u8>, BackendError> {
   let mut hash = HMAC512::new_from_slice(key).map_err(|e| BackendError::GenericError(e.to_string()))?;
   hash.update(msg);
   Ok(hash.finalize().into_bytes().to_vec())
}


pub fn hmac512_verify(key: &[u8], msg: &[u8], tag: &[u8]) -> Result<(), BackendError> {
   let mut hash = HMAC512::new_from_slice(key).map_err(|e| BackendError::GenericError(e.to_string()))?;
   hash.update(msg);
   match hash.verify_slice(tag) {
      Ok(_) => Ok(()),
      Err(e) => Err(BackendError::GenericError(e.to_string()))
   }  
}

