const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1500,
  },
  author: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  commentCount: {
    type: Number,
    default: 0,
  },
});

postSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Index for better performance
postSchema.index({ createdAt: -1 });
postSchema.index({ author: 1 });
