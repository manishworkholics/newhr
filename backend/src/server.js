import { app } from "./app.js";
import { connectDatabase } from "./config/db.js";
import { env } from "./config/env.js";
import { seedCmsIfEmpty } from "./utils/seedCms.js";

async function startServer() {
  try {
    await connectDatabase();
    await seedCmsIfEmpty();

    const server = app.listen(env.port, () => {
      console.log(`Backend running on http://127.0.0.1:${env.port}`);
    });

    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.error(`Port ${env.port} is already in use. Stop the conflicting process or set PORT to another port.`);
      } else {
        console.error("Server error:", err);
      }
      process.exit(1);
    });
  } catch (err) {
    console.error("Failed to start backend:", err);
    process.exit(1);
  }
}

startServer();
