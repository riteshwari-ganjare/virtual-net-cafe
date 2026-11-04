require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/User");

(async () => {
  await connectDB();
  const email = "admin@virtualcafe.com";
  const exists = await User.findOne({ email });
  if (exists) {
    console.log("Admin already exists:", email);
  } else {
    await User.create({ name: "Admin", email, password: "admin123", role: "admin" });
    console.log("Admin created:", email, "password: admin123");
  }
  process.exit(0);
})();