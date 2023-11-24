use std::fs;

use rusqlite::Connection;
use tauri::AppHandle;

const CURR_DB_VER: u32 = 1;

pub(crate) fn init_db(app_handle: &AppHandle) -> Result<Connection, rusqlite::Error> {
   let app_dir = app_handle
      .path_resolver()
      .app_data_dir()
      .expect("appdata dir should be exists");
   fs::create_dir_all(&app_dir).expect("appdata dir should be created");
   let sqlite_path = app_dir.join("spdata.db");

   let mut db = Connection::open(sqlite_path)?;

   let mut user_pragma = db.prepare("PRAGMA user_version")?;
   let exist_user_ver: u32 = match user_pragma.query_row([], |row| row.get(0)) {
      Ok(v) => v,
      Err(e) => match e {
        rusqlite::Error::QueryReturnedNoRows => 0,
        _ => return Err(e)
      }
   };
   drop(user_pragma);

   migrate_db(&mut db, exist_user_ver)?;

   Ok(db)
}

pub(crate) fn migrate_db(db: &mut Connection, exist_ver: u32) -> Result<(), rusqlite::Error> {
   if exist_ver < CURR_DB_VER {
      db.pragma_update(None, "journal_mode", "WAL")?;

      let tx = db.transaction()?;
      tx.pragma_update(None, "user_version", CURR_DB_VER)?;

      tx.execute_batch(
         "
                create table sp_config (
                    key text not null,
                    data text
                );
            ",
      )?;

      tx.commit()?;
   }

   Ok(())
}
