const express = require("express");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const PORT = process.env.PORT;
const commentRoutes = require("./routes/comments");
const postRoutes = require("./routes/posts");

const connectDb = require("./db/db");
const morgan = require("morgan");

const app = express();

// connect to MongoDB database
connectDb();

// Security Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));

// Rate Limiting for abuse protection
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: "Too many request from this IP address,please try again later",
});
// Middleware to track Limiter
app.use("/api", limiter);

// use Routes
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/comments", commentRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Hello team Cloudsek,Thank you for considering my assignment",
  });
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  await mongoose.connection.close();
  await redisClient.quit();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
