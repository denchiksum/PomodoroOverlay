import { getCurrentWindow } from "@tauri-apps/api/window";
import { currentMonitor, LogicalPosition } from "@tauri-apps/api/window";

export async function moveTopRight() {
  const appWindow = getCurrentWindow();

  try {
    const monitor = await currentMonitor();

    if (!monitor) {
      console.error("No monitor found");
      return;
    }

    const scale = monitor.scaleFactor;

    // Real window size
    const size = await appWindow.outerSize();

    const windowWidth = size.width / scale;

    const padding = 10;

    // Logical monitor coordinates
    const monitorWidth = monitor.size.width / scale;
    const monitorX = monitor.position.x / scale;
    const monitorY = monitor.position.y / scale;

    // Final top-right position
    const x = monitorX + monitorWidth - windowWidth - padding;
    const y = monitorY + padding;

    await appWindow.setPosition(
      new LogicalPosition(x, y)
    );

  } catch (err) {
    console.error("moveTopRight failed:", err);
  }
}