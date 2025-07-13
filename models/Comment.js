const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000,
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

  isRichText: {
    type: Boolean,
    default: false,
  },
});

// Update the updatedAt before saving a comment
commentSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Index for better performance
commentSchema.index({ postId: 1, createdAt: -1 });
commentSchema.index({ author: 1 });

module.exports = new mongoose.model("Comment", commentSchema);
