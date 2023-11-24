// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod api;
mod config_store;
mod database;
mod error;
mod mapper;
mod partner_handler;
mod security;
mod security_handler;

use api::ping_backend;
use config_store::ConfigStore;
use security_handler::{
   decrypt_payload, encrypt_payload, handle_is_registered, 
   handle_register_partner, init_keystore, get_partner_id,
   KeyStoreState,
};
use tauri::{utils::config::AppUrl, Manager, State, WindowUrl};

#[tokio::main]
async fn main() {
   let port = portpicker::pick_unused_port().expect("failed to find unused port");

   let mut context = tauri::generate_context!();
   let url = format!("http://localhost:{}", port).parse().unwrap();
   let window_url = WindowUrl::External(url);

   context.config_mut().build.dist_dir = AppUrl::Url(window_url);

   tauri::Builder::default()
      .plugin(tauri_plugin_localhost::Builder::new(port).build())
      .manage(ConfigStore {
         db: Default::default(),
      })
      .manage(KeyStoreState {
         keystore: Default::default(),
      })
      .invoke_handler(tauri::generate_handler![
         ping_backend,
         encrypt_payload,
         decrypt_payload,
         handle_is_registered,
         handle_register_partner,
         get_partner_id,
      ])
      .setup(|app| {
         let handle = app.handle();

         let cfg_state: State<ConfigStore> = handle.state();
         let db = database::init_db(&handle).expect("failed to init database");
         *cfg_state.db.lock().unwrap() = Some(db);

         let keystore_state: State<KeyStoreState> = handle.state();
         let keystore = init_keystore(&cfg_state).unwrap_or_default();
         *keystore_state.keystore.lock().unwrap() = keystore;

         Ok(())
      })
      .run(context)
      .expect("error while running tauri application");
}
