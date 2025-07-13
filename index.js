const express = require("express");
const mongoose = require("mongoose");
const connectRedis = require("./db/cachedDb");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const PORT = process.env.PORT;

const connectDb = require("./db/db");
const morgan = require("morgan");

const app = express();

// connect to MongoDB database
connectDb();

// connect to Redis client
connectRedis();

// Security Middlewares 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"))

// Rate Limiting for abuse protection
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: "Too many request from this IP address,please try again later",
});
// Middleware to track Limiter
app.use('/api',limiter)


app.get("/health", (req, res) => {
  res.send("hello team cloudsek");
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await mongoose.connection.close();
  await redisClient.quit();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
