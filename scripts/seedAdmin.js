const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { env } = require("../src/config/env");
const { UserModel } = require("../src/modules/user/user.model");

async function run() {
  const email = (
    process.env.ADMIN_EMAIL || "admin@companyname.com"
  ).toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "Admin@12345";
  const name = process.env.ADMIN_NAME || "System Admin";

  await mongoose.connect(env.MONGODB_URI);

  const existing = await UserModel.findOne({ email, isDeleted: false }).lean();
  if (existing) {
    console.log("Admin already exists:", email);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await UserModel.create({
    name,
    email,
    passwordHash,
    role: "Admin",
    isActive: true,
  });

  console.log("Seeded Admin:", { email, password });
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
