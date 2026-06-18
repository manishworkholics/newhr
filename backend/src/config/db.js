import dns from "dns";
import mongoose from "mongoose";
import { env } from "./env.js";

const srvDnsServers = ["8.8.8.8", "8.8.4.4"];

export async function connectDatabase() {
  if (!env.mongoUri) {
    throw new Error("MONGODB_URI is missing in environment variables.");
  }

  if (env.mongoUri.startsWith("mongodb+srv://")) {
    dns.setServers(srvDnsServers);
    console.log("Using custom DNS servers for MongoDB SRV resolution:", srvDnsServers);
  }

  mongoose.set("strictQuery", true);

  await mongoose.connect(env.mongoUri, {
    serverSelectionTimeoutMS: 10000
  });

  console.log(`MongoDB connected: ${mongoose.connection.name}`);
}
