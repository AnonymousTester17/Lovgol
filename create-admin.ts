import { storage } from "./server/storage.ts";
import bcrypt from "bcrypt";
import "dotenv/config";

async function createAdmin() {
  const username = "admin"; // Change this to your desired username
  const password = "password"; // Change this to a strong password

  // Check if admin already exists
  const existingAdmin = await storage.getAdminByUsername(username);
  if (existingAdmin) {
    console.log(`Admin user "${username}" already exists.`);
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await storage.createAdmin({ username, password: hashedPassword });

  console.log("Admin user created successfully!");
  process.exit(0);
}

createAdmin().catch((err) => {
  console.error("Failed to create admin user:", err);
  process.exit(1);
});