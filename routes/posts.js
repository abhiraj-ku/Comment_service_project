const express = require("express");
const router = express.Router();

const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} = require("../controllers/postController");

const {
  validateCreatePost,
  validateUpdatePost,
  validateGetPostById,
  validatePostQuery,
} = require("../middleware/validations/postValidators");

//  Get all posts (with pagination, filters, sort, fields)
router.get("/", validatePostQuery, getAllPosts);

//  Get post by ID
router.get("/:id", validateGetPostById, getPostById);

// Create a new post
router.post("/", validateCreatePost, createPost);

//  Update a post
router.patch("/:id", validateGetPostById, validateUpdatePost, updatePost);

//  Delete a post and its comments
router.delete("/:id", validateGetPostById, deletePost);

module.exports = router;
