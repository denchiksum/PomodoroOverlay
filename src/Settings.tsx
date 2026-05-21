import { getCurrentWindow } from "@tauri-apps/api/window";
import { useState, useEffect } from "react";

export default function Settings() {
  const appWindow = getCurrentWindow();
  const [volume, setVolume] = useState(() => {
    return Number(localStorage.getItem("volume") ?? "1");
  });
  
  useEffect(() => {
    localStorage.setItem("volume", String(volume));
  }, [volume]);
 
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        background: "rgba(20,20,20,0.7)",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
      }}
    >
      <div>
        <button
          onClick={() => appWindow.close()}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "red",
            color: "white",
            border: "none",
            borderRadius: 6,
            padding: "4px 8px"
          }}
        >
          ✕
        </button>

        <h3>Settings</h3>

        <label>Volume: {Math.round(volume * 100)}%</label>

        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
        />
      </div>
    </div>
  );
}