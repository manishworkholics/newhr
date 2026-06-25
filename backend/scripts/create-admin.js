import dotenv from "dotenv";
import mongoose from "mongoose";
import { AdminUser } from "../src/models/AdminUser.js";

dotenv.config({ path: ".env", override: true });

const [, , emailArg, passwordArg, nameArg] = process.argv;

if (!emailArg || !passwordArg) {
  console.error("Usage: node scripts/create-admin.js admin@example.com StrongPassword123 \"Admin Name\"");
  process.exit(1);
}

if (passwordArg.length < 8) {
  console.error("Password must be at least 8 characters.");
  process.exit(1);
}

if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is required.");
  process.exit(1);
}

await mongoose.connect(process.env.MONGODB_URI);

const email = emailArg.toLowerCase().trim();
const existing = await AdminUser.findOne({ email });

if (existing) {
  existing.name = nameArg || existing.name;
  existing.password = passwordArg;
  existing.isActive = true;
  await existing.save();
  console.log(`Updated admin account: ${email}`);
} else {
  await AdminUser.create({
    email,
    password: passwordArg,
    name: nameArg || "EventMax Admin"
  });
  console.log(`Created admin account: ${email}`);
}

await mongoose.disconnect();
