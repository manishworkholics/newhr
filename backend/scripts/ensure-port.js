import { exec } from "child_process";
import { promisify } from "util";

const execp = promisify(exec);
const port = process.argv[2] || process.env.PORT || "5000";
const platform = process.platform;

async function main() {
  try {
    if (platform === "win32") {
      const { stdout } = await execp(`netstat -ano | findstr ":${port}"`);
      const lines = stdout.split(/\r?\n/).filter(Boolean);
      const listeners = lines.filter((line) => line.includes("LISTENING"));
      if (listeners.length === 0) {
        console.log(`Port ${port} is free.`);
        return;
      }

      const pids = [...new Set(listeners.map((line) => line.trim().split(/\s+/).pop()))];
      for (const pid of pids) {
        if (pid && pid !== `${process.pid}`) {
          console.log(`Killing process ${pid} using port ${port}`);
          await execp(`taskkill /PID ${pid} /F`);
        }
      }
      console.log(`Port ${port} has been cleared.`);
      return;
    }

    const { stdout } = await execp(`lsof -i :${port} -sTCP:LISTEN -t`);
    const pids = stdout.split(/\r?\n/).filter(Boolean);
    if (pids.length === 0) {
      console.log(`Port ${port} is free.`);
      return;
    }

    for (const pid of pids) {
      console.log(`Killing process ${pid} using port ${port}`);
      await execp(`kill -9 ${pid}`);
    }
    console.log(`Port ${port} has been cleared.`);
  } catch (error) {
    const message = String(error.message || error);
    if (platform === "win32" && message.includes("findstr") && message.includes("No files")) {
      console.log(`Port ${port} is free.`);
      return;
    }
    if (platform === "win32" && message.includes("The system cannot find the file specified.")) {
      console.log(`Port ${port} is free.`);
      return;
    }
    if (platform !== "win32" && message.includes("No such file or directory")) {
      console.log(`Port ${port} is free.`);
      return;
    }
    console.error(`Failed to ensure port ${port} is free:`, message);
    process.exit(1);
  }
}

main();
