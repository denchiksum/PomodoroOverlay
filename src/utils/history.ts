import { readDir, readTextFile } from "@tauri-apps/plugin-fs";

export async function loadHistory() {
  const files = await readDir("logs");
  const results = [];

  for (const file of files) {
    if (!file.name) continue;
    const content = await readTextFile(`logs/${file.name}`);
    results.push({ name: file.name, content });
  }

  return results;
}