import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { getCurrentWindow, LogicalPosition } from "@tauri-apps/api/window";

const LABEL = "settings";

let settingsWindow: WebviewWindow | null = null;

export async function openSettings() {
  console.log("Settings button clicked");

  if (settingsWindow) {
    await settingsWindow.setFocus?.();
    return;
  }

  settingsWindow = new WebviewWindow(LABEL, {
    url: "#settings", // ✅ FIXED
    title: "Settings",
    width: 300,
    height: 240,
    resizable: false,
    transparent: true,
    decorations: false,
    alwaysOnTop: true,
  });

  settingsWindow.once("tauri://created", async () => {
    try {
      const main = getCurrentWindow();

      const mainPos = await main.outerPosition();

      const settingsWidth = 300;
      const padding = 0;

      const x = mainPos.x - settingsWidth - padding;
      const y = mainPos.y;

      await settingsWindow?.setPosition(new LogicalPosition(x, y));

      await settingsWindow?.setFocus();
    } catch (err) {
      console.error("Dock positioning failed:", err);
    }
  });

  settingsWindow.once("tauri://destroyed", () => {
    settingsWindow = null;
  });

  settingsWindow.once("tauri://error", (e) => {
    console.error("Settings window error:", e);
    settingsWindow = null;
  });
}
