import { app } from "./app.js";
import { connectDatabase } from "./config/db.js";
import { env } from "./config/env.js";
import { seedCmsIfEmpty } from "./utils/seedCms.js";

async function startServer() {
  try {
    await connectDatabase();
    await seedCmsIfEmpty();

    app.listen(env.port, () => {
      console.log(`Backend running on http://127.0.0.1:${env.port}`);
    });
  } catch (err) {
    console.error("Failed to start backend:", err);
    process.exit(1);
  }
}

startServer();
