const Comment = require("../models/Comment");
const Post = require("../models/Post");
const sanitizeHtml = require("sanitize-html");

// Get all comment for a specified post
/** 
 @route -> GET /api/v1/comments/posts/:postIdß
 @description -> Retrieves all comments for a specified post
 @access -> Public
*/
const getCommentById = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const postId = req.params.pid;
    if (!postId) {
      return res.status(400).json({
        sucess: false,
        message: "Missing required fields",
      });
    }
    const comments = await Comment.find({ postId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Comment.countDocuments({ postId: req.params.postId });

    res.json({
      sucess: true,
      message: "Fetched comments for a post sucessfully",
      data: {
        comments,
      },
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalComments: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching comment by id: ", error);
    return res.status(500).json({
      sucess: false,
      message: "Internal Server error while fetching comment",
    });
  }
};

// Create a comment
/** 
 @route -> POST /api/v1/comments
 @description -> Create a comment 
 @access -> Public
*/
const createComment = async (req, res) => {
  try {
    const { postId, content, author, isRichText = false } = req.body;
    if (!postId || !content || !author) {
      return res.status(400).json({
        sucess: false,
        message: "Missing required fields",
      });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({
        sucess: false,
        message: "Post not found",
      });
    }

    // sanitize html comment to allow only Bold,italics,and underlined comments
    const sanitizedContent = isRichText
      ? sanitizeHtml(content, {
          allowedTags: ["b", "i", "a"],
          allowedAttributes: {
            a: ["href", "target"],
          },
          allowedSchemes: ["http", "https"],
        })
      : content;

    // Create comment Object
    const comment = new Comment({
      postId,
      content: sanitizedContent,
      author,
      isRichText,
    });

    const saveComment = await comment.save();

    // Update comment count in Post
    await Post.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });

    return res.status(201).json({
      sucess: true,
      message: "Comment created successfully",
      data: {
        saveComment,
      },
    });
  } catch (error) {
    console.error("Error creating comment: ", error);
    return res.status(500).json({
      sucess: false,
      message: "Internal Server error ",
    });
  }
};

/**
 @route -> PUT /api/v1/comments/:id
 @description -> Update a comment
 @access -> Public
*/
const updateComment = async (req, res) => {
  try {
    const { content, isRichText } = req.body;
    const commentId = req.params.id;

    const comment = await Comment.findByIdAndUpdate(
      commentId,
      { content, isRichText, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Comment updated successfully",
      data: {
        comment,
      },
    });
  } catch (error) {
    console.error("Error updating comment:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/**
 @route -> DELETE /api/v1/comments/:id
 @description -> Delete a comment
 @access -> Public
*/
const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;

    const comment = await Comment.findByIdAndDelete(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Update comment count on the post
    await Post.findByIdAndUpdate(comment.postId, {
      $inc: { commentCount: -1 },
    });

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
};
