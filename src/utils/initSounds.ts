// src/utils/initSounds.ts
import { invoke } from "@tauri-apps/api/core";

export async function initDefaultSounds() {
  try {
    console.log("🔄 Initializing sounds via Rust...");
    await invoke("init_sounds");
    console.log("✅ init_sounds command sent successfully");
  } catch (err) {
    console.error("💥 Failed to call init_sounds:", err);
  }
}