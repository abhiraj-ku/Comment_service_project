const mongoose = require("mongoose");

async function connectDb() {
  const uri = process.env.MONGODB_DEP || "mongodb://localhost:27017/post-comments-db";

  try {
    await mongoose.connect(uri);
    console.log(" Connected to MongoDB");
  } catch (err) {
    console.error(" MongoDB connection error:", err.message);
    process.exit(1); // Exit process if connection fails
  }
}

module.exports = connectDb;
