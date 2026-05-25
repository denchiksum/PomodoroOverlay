import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { getCurrentWindow } from "@tauri-apps/api/window";

const LABEL = "settings";
let settingsWindow: WebviewWindow | null = null;

export async function openSettings() {
  if (settingsWindow) {
    await settingsWindow.setFocus();
    return;
  }

  const main = getCurrentWindow();
  const mainPos = await main.outerPosition();
  const scale = await main.scaleFactor();

  const width = 300;
  const height = 240;
  const gap = 12;

  // Calculate position
  const x = (mainPos.x / scale) - width - gap;
  const y = (mainPos.y / scale);

  settingsWindow = new WebviewWindow(LABEL, {
    url: "#settings",
    title: "Settings",
    width: width,
    height: height,
    resizable: false,
    transparent: true,
    decorations: false,
    alwaysOnTop: true,
    visible: false, 
    x: x,           
    y: y,
  });

  settingsWindow.once("tauri://created", async () => {
    await settingsWindow?.show();
    await settingsWindow?.setFocus();
  });

  settingsWindow.once("tauri://destroyed", () => {
    settingsWindow = null;
  });
}