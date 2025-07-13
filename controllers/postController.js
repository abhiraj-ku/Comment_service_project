const Comment = require("../models/Comment");
const Post = require("../models/Post");

// Get all posts with pagination
/*
 @route -> GET /api/v1/posts
 @description -> Retrieves a paginated list of all posts
 @access -> Public
*/
const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Query object which holds final query to perform
    const queryObj = {};

    // filter by Author
    if (req.query.author) {
      queryObj.author = req.query.author;
    }

    // Field Selection to return only selected fields for advance filtering
    const fields = req.query.fields?.split(",").join(" ") || "";

    // Sorting documents (based sort=createdAt,-title)
    const sortBy = req.query.sort?.split(",").join("") || "-createdAt";

    // Prepare and execute the search query
    const posts = await Post.find(queryObj)
      .sort(sortBy)
      .select(fields)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Post.countDocuments(queryObj);
    res.status(200).json({
      sucess: true,
      message: "post fetch sucessfully",
      data: {
        posts,
      },
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching all posts: ", error);
    return res.status(500).json({
      sucess: false,
      message: "Internal Server error while fetching post",
    });
  }
};

// Get Post by ID
/*
 @route -> GET /api/v1/posts/:id
 @description -> Retrieves a specific post
 @access -> Public
*/

const getPostById = async (req, res) => {
  try {
    const postId = req.param.id;
    if (!postId) {
      return res.status(400).json({
        sucess: false,
        message: "Missing required fields",
      });
    }

    // searcht the post id
    const post = await Post.findById(postId).lean();

    // return the post
    return res.status(201).json({
      sucess: true,
      message: "Fetch post sucessfully",
      data: {
        post,
      },
    });
  } catch (error) {
    console.error("Error fetching post by id: ", error);
    return res.status(500).json({
      sucess: false,
      message: "Internal Server error while fetching post",
    });
  }
};

// Create a post
/*
 @route -> POST /api/v1/posts
 @description -> Creates a post
 @access -> Public
*/
const createPost = async (req, res) => {
  const { title, content, author } = req.body;
  try {
    if (!title || !content || !author) {
      return res.status(400).json({
        sucess: false,
        message: "Missing required fields",
      });
    }

    // create post schema to save
    const post = new Post({
      title,
      content,
      author,
    });

    const savedPost = await post.save();

    // invalidate cache for post list
    await invalidateCache(req.app.locals.redis, "posts:*");

    res.status(200).json({
      sucess: true,
      message: "Post created sucessfully",
      data: {
        savedPost,
      },
    });
  } catch (error) {
    console.error("Error fetching post by id: ", error);
    return res.status(500).json({
      sucess: false,
      message: "Internal Server error while fetching post",
    });
  }
};

// Update a post
/* 
/*
 @route -> POST /api/v1/posts/:id
 @description -> updates a post by its id
 @access -> Public
*/
const updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const postId = req.params.id;

    if (!postId) {
      return res.status(400).json({
        sucess: false,
        message: "Missing required fields",
      });
    }
    if (!title || !content) {
      return res.status(400).json({
        sucess: false,
        message: "Missing required fields",
      });
    }

    const post = await Post.findByIdAndUpdate(
      postId,
      { title, content, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Invalidate cache
    await invalidateCache(req.app.locals.redis, [
      `posts:${req.params.id}`,
      "posts:*",
    ]);

    res.status(200).json({
      sucess: true,
      message: "Post updated sucessfully",
      data: {
        post,
      },
    });
  } catch (error) {
    console.error("Error updating post: ", error);
    return res.status(500).json({
      sucess: false,
      message: "Internal Server error",
    });
  }
};

/**
 /*
 @route -> POST /api/v1/posts/:id
 @description -> updates a post by its id
 @access -> Public
*/

const deletePost = async (req, res) => {
  const postId = req.params.id;
  try {
    if (!postId) {
      return res.status(400).json({
        sucess: false,
        message: "Missing required fields",
      });
    }
    const post = await Post.findByIdAndDelete(postId);
    if (!post)
      return res.status(404).json({
        sucess: false,
        message: "Post not found",
      });

    await Comment.deleteMany({ postId });
    await invalidateCache(req.app.locals.redis, [
      `posts:${req.params.id}`,
      "posts:*",
      `comments:post:${req.params.id}:*`,
    ]);

    res.status(201).json({
      sucess: true,
      message: "Post and associated comments deleted successfully",
    });
  } catch (error) {
    if (error.name === "CastError")
      return res.status(400).json({ error: "Invalid post ID" });
    res.status(500).json({ error: "Failed to delete post" });
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
