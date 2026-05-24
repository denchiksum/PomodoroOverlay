import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { moveTopRight } from "./utils/window";
import { playRandomSound } from "./utils/sound";
import { openSettings } from "./utils/settingsWindow";
import { initDefaultSounds } from "./utils/initSounds";
import "./App.css";

function App() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(10);
  const [seconds, setSeconds] = useState(durationMinutes * 60);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState<"idle" | "done">("idle");

  useEffect(() => {
    initDefaultSounds();
  }, []);

  useEffect(() => {
    const initWindow = async () => {
      try {
        await new Promise((r) => setTimeout(r, 200));
        await moveTopRight();
      } catch (err) {
        console.error("Failed to move window:", err);
      }
    };
    initWindow();
  }, []);

  useEffect(() => {
    if (status === "idle" && !running) {
      setSeconds(durationMinutes * 60);
    }
  }, [durationMinutes, status, running]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(id);
          setRunning(false);
          setStatus("done");
          playRandomSound();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  function formatTime(s: number) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }

  async function log(result: "completed" | "failed") {
    const plannedDurationSec = durationMinutes * 60;
    try {
      await invoke("log_session", {
        title,
        desc,
        duration: plannedDurationSec,
        result,
      });
    } catch (e) {
      console.log("Logging not set up yet:", e);
    }
    reset();
  }

  function reset() {
    setSeconds(durationMinutes * 60);
    setRunning(false);
    setStatus("idle");
  }

  return (
    <main style={styles.container}>
      <h2 style={styles.timer}>{formatTime(seconds)}</h2>

      {status === "idle" && (
        <div style={styles.card}>
          <button
            style={styles.settingsBtn}
            onClick={openSettings}
          >
            ⚙
          </button>

          <input
            style={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />
          <textarea
            style={styles.textarea}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Description"
          />
          <div style={styles.durationRow}>
            <label style={{ fontSize: 14, color: "#fff" }}>
              Minutes:
            </label>
            <input
              type="number"
              min={1}
              max={99}
              style={{ ...styles.input, width: "60px" }}
              value={durationMinutes}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (!Number.isNaN(v)) setDurationMinutes(v);
              }}
            />
          </div>

          {!running ? (
            <button
              style={styles.startBtn}
              onClick={() => {
                setSeconds(durationMinutes * 60);
                setRunning(true);
              }}
            >
              Start
            </button>
          ) : (
            <button
              style={styles.stopBtn}
              onClick={() => {
                setRunning(false);
                setStatus("done");
              }}
            >
              Stop Early
            </button>
          )}
        </div>
      )}

      {status === "done" && (
        <div style={styles.card}>
          <p>Session ended</p>
          <button style={styles.okBtn} onClick={() => log("completed")}>
            Completed
          </button>
          <button style={styles.failBtn} onClick={() => log("failed")}>
            Failed
          </button>
        </div>
      )}
    </main>
  );
}

export default App;

/* INLINE STYLES */
const styles = {
  container: {
    width: "100vw",        // Fill the whole window
    height: "100vh",       // Fill the whole window
    background: "rgba(20,20,20,0.55)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxSizing: "border-box" as const, // Ensure border stays inside the 320x240 area
    overflow: "hidden",
    color: "white",
    padding: "12px",
    borderRadius: "16px",
    fontFamily: "sans-serif",
    display: "flex",
    flexDirection: "column",
    WebkitAppRegion: "drag" as const,
  } as React.CSSProperties,

  timer: {
    textAlign: "center",
    fontSize: "28px",
    margin: "0 0 8px",
  } as React.CSSProperties,

  card: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  } as React.CSSProperties,

  settingsBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    WebkitAppRegion: "no-drag" as const,
    background: "transparent",
    border: "none",
    color: "white",
    fontSize: "18px",
    cursor: "pointer",
  } as React.CSSProperties,

  input: {
    padding: "6px",
    borderRadius: "6px",
    border: "none",
    outline: "none",
    color: "#fff",
    background: "#0f0f0f98",
  } as React.CSSProperties,

  textarea: {
    padding: "6px",
    borderRadius: "6px",
    resize: "none",
    height: "50px",
    border: "none",
    outline: "none",
    color: "#fff",
    background: "#0f0f0f98",
  } as React.CSSProperties,

  durationRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: "14px",
  } as React.CSSProperties,

  startBtn: {
    padding: "8px",
    background: "green",
    color: "white",
    border: "none",
    borderRadius: "6px",
  } as React.CSSProperties,

  stopBtn: {
    padding: "8px",
    background: "#ff6b35",
    color: "white",
    border: "none",
    borderRadius: "6px",
    alignSelf: "center",
  } as React.CSSProperties,

  okBtn: {
    padding: "8px",
    background: "green",
    color: "white",
    border: "none",
    borderRadius: "6px",
  } as React.CSSProperties,

  failBtn: {
    padding: "8px",
    background: "red",
    color: "white",
    border: "none",
    borderRadius: "6px",
  } as React.CSSProperties,
};