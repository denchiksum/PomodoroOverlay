#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;
use std::path::Path;

#[tauri::command]
fn log_session(title: String, desc: String, duration: i32, result: String) {
    let dir = "logs";

    if !Path::new(dir).exists() {
        fs::create_dir_all(dir).unwrap();
    }

    let filename = format!(
        "logs/{}_{}.md",
        chrono::Local::now().format("%Y-%m-%d_%H-%M-%S"),
        title.replace(" ", "-")
    );

    let content = format!(
        "# {}\n\n\
**Duration:** {} sec\n\
**Description:** {}\n\
**Result:** {}\n\n\
---\n\
Logged at: {}\n",
        title,
        duration,
        desc,
        result,
        chrono::Local::now()
    );

    fs::write(filename, content).unwrap();
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![log_session])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}