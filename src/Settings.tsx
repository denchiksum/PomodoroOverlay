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
        width: "100vw",
        height: "100vh",
        background: "rgba(25,25,25,0.85)",
        backdropFilter: "blur(15px)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
        borderRadius: "16px",
        border: "1px solid rgba(255,255,255,0.1)",
        overflow: "hidden",
        boxSizing: "border-box",
        // FIXED: Bypass TS check for non-standard property
        ["WebkitAppRegion" as any]: "drag",
      }}
    >
      <button
        onClick={() => appWindow.close()}
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          background: "#ff4444",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "24px",
          height: "24px",
          cursor: "pointer",
          // FIXED: Bypass TS check
          ["WebkitAppRegion" as any]: "no-drag",
        }}
      >
        ×
      </button>

      <h3 style={{ margin: "0 0 20px 0" }}>Settings</h3>

      <div style={{ width: "80%", ["WebkitAppRegion" as any]: "no-drag" }}>
        <label style={{ display: "block", marginBottom: "10px", fontSize: "14px" }}>
          Volume: {Math.round(volume * 100)}%
        </label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          style={{ width: "100%", cursor: "pointer" }}
        />
      </div>
    </div>
  );
}