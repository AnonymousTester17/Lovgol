import { storage } from "./server/storage.js";
import bcrypt from "bcrypt";
import "dotenv/config";

async function createAdmin() {
  const username = "admin"; // Change this to your desired username
  const password = "password"; // Change this to a strong password

  const hashedPassword = await bcrypt.hash(password, 10);

  await storage.createAdmin({ username, password: hashedPassword });

  console.log("Admin user created successfully!");
  process.exit(0);
}

createAdmin();