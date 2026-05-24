import { invoke } from "@tauri-apps/api/core";

export async function playRandomSound() {
  try {
    // Read volume from storage, default to 1.0 if not set
    const savedVolume = localStorage.getItem("volume");
    const volume = savedVolume ? parseFloat(savedVolume) : 1.0;

    await invoke("play_random_sound", { volume });
  } catch (err) {
    console.error("Failed to play sound:", err);
  }
}