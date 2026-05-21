import { writeTextFile, mkdir } from "@tauri-apps/plugin-fs";

export async function logSession(session: {
  title: string;
  description: string;
  duration: number;
  result: "completed" | "failed";
}) {
  const date = new Date().toISOString().split("T")[0];
  const filename = `logs/${date}_${session.title.replace(/\s+/g, "-")}.md`;

  const content = `# ${session.title}

**Duration:** ${session.duration / 60} min  
**Description:** ${session.description}  
**Result:** ${session.result === "completed" ? "✔ Completed" : "✖ Failed"}

---

Logged at: ${new Date().toLocaleString()}
`;

  await mkdir("logs", { recursive: true });
  await writeTextFile(filename, content);
}