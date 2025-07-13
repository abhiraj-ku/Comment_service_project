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

const getPostById = async (req, res) => {};
