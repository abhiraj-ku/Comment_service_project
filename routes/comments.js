const express = require("express");
const router = express.Router();
const {
  validateCreateComment,
  validateUpdateComment,
  validateCommentIdParam,
  validateGetCommentsByPostId,
  validateCommentQuery,
} = require("../middleware/validations/commentValidators");

const {
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");

router.get(
  "/posts/:pid",
  validateGetCommentsByPostId,
  validateCommentQuery,
  getCommentById
);

router.post("/", validateCreateComment, createComment);

router.put(
  "/:id",
  validateCommentIdParam,
  validateUpdateComment,
  updateComment
);

router.delete("/:id", validateCommentIdParam, deleteComment);

module.exports = router;
