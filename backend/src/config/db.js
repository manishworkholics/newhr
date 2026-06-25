import dns from "node:dns";
import mongoose from "mongoose";
import { env } from "./env.js";

const srvDnsServers = ["8.8.8.8", "8.8.4.4"];

export async function connectDatabase() {
  if (!env.mongoUri) {
    throw new Error("MONGODB_URI is missing in environment variables.");
  }

  if (env.mongoUri.startsWith("mongodb+srv://")) {

    dns.setServers(srvDnsServers);

    console.log("DNS Servers:", dns.getServers());

    try {
      const records = await dns.promises.resolveSrv(
        "_mongodb._tcp.cluster0.6vfzzbv.mongodb.net"
      );

      console.log("SRV Records Found:");
      console.log(records);

    } catch (err) {
      console.error("SRV Lookup Failed:", err);
      throw err;
    }
  }

  mongoose.set("strictQuery", true);

  await mongoose.connect(env.mongoUri, {
    serverSelectionTimeoutMS: 10000
  });

  console.log(`MongoDB connected: ${mongoose.connection.name}`);
}