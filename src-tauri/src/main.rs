#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use chrono::Local;
use std::fs::{self, File};
use std::io::{Write, BufReader};
use tauri::AppHandle;
use rand::prelude::*; // This brings in IndexedRandom and other essentials
use rodio::{Decoder, OutputStream, Sink}; // For audio playback

#[tauri::command]
fn get_app_dir(_app: AppHandle) -> String {
    std::env::current_exe()
        .ok()
        .and_then(|exe| exe.parent().map(|p| p.to_string_lossy().to_string()))
        .unwrap_or_else(|| ".".to_string())
}

#[tauri::command]
fn play_random_sound(app: AppHandle, volume: f32) {
    let app_dir = get_app_dir(app);
    let sounds_dir = std::path::Path::new(&app_dir).join("sounds");

    // Read the directory
    let Ok(paths) = fs::read_dir(sounds_dir) else { return };
    
    let sound_files: Vec<_> = paths
        .filter_map(|entry| entry.ok())
        .map(|entry| entry.path())
        .filter(|path| path.extension().map_or(false, |ext| ext == "mp3"))
        .collect();

    // FIXED: Use rand::rng() and the IndexedRandom trait (via prelude)
    if let Some(random_path) = sound_files.choose(&mut rand::rng()) {
        let path_to_play = random_path.clone();
        
        std::thread::spawn(move || {
            let Ok((_stream, stream_handle)) = OutputStream::try_default() else { return };
            let Ok(sink) = Sink::try_new(&stream_handle) else { return };
            
            sink.set_volume(volume); 

            let Ok(file) = File::open(path_to_play) else { return };
            let Ok(source) = Decoder::new(std::io::BufReader::new(file)) else { return };
            
            sink.append(source);
            sink.sleep_until_end();
        });
    }
}

#[tauri::command]
fn log_session(app: AppHandle, title: String, desc: String, duration: u32, result: String) {
    let app_dir = get_app_dir(app);
    let logs_dir = std::path::Path::new(&app_dir).join("logs");
    let _ = fs::create_dir_all(&logs_dir);

    let date = Local::now().format("%Y-%m-%d").to_string();
    let safe_title = title.replace(|c: char| !c.is_alphanumeric() && c != ' ' && c != '-', "_");
    let filename = logs_dir.join(format!("{}_{}.md", date, safe_title));

    let content = format!(
        "# {}\n**Duration:** {} min\n**Description:** {}\n**Result:** {}\n---\nLogged at: {}\n",
        title, duration / 60, desc,
        if result == "completed" { "✅ Completed" } else { "❌ Failed" },
        Local::now().format("%Y-%m-%d %H:%M:%S")
    );

    let _ = File::create(&filename).and_then(|mut f| f.write_all(content.as_bytes()));
}

#[tauri::command]
fn init_sounds(app: AppHandle) {
    let app_dir = get_app_dir(app);
    let sounds_dir = std::path::Path::new(&app_dir).join("sounds");

    if !sounds_dir.exists() {
        let _ = fs::create_dir_all(&sounds_dir);
    }

    let sounds = vec![
        ("huh.mp3", include_bytes!("../../src/assets/sounds/huh.mp3").as_ref()),
        ("a.mp3", include_bytes!("../../src/assets/sounds/a.mp3").as_ref()),
        ("boom.mp3", include_bytes!("../../src/assets/sounds/boom.mp3").as_ref()),
    ];

    for (filename, data) in sounds {
        let path = sounds_dir.join(filename);
        if !path.exists() {
            let _ = std::fs::write(&path, data);
        }
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_app_dir,
            log_session,
            init_sounds,
            play_random_sound // Register the command here!
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}