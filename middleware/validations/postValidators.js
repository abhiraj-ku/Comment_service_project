const Joi = require("joi");

// Create Post Validator
const createPostSchema = Joi.object({
  title: Joi.string().min(3).max(150).required(),
  content: Joi.string().min(5).required(),
  author: Joi.string().required(), // MongoDB ObjectId
});

// Update Post Validator
const updatePostSchema = Joi.object({
  title: Joi.string().min(3).max(150),
  content: Joi.string().min(5),
}).or("title", "content");

// Query Params Validator for listing
const querySchema = Joi.object({
  q: Joi.string(),
  page: Joi.number().min(1),
  limit: Joi.number().min(1).max(100),
  sort: Joi.string(),
  fields: Joi.string(),
  author: Joi.string().length(24),
});

// Param validator for Post ID
const getPostByIdSchema = Joi.object({
  id: Joi.string().required(), // MongoDB ID
});

function validate(schema, source = "body") {
  return (req, res, next) => {
    const { error } = schema.validate(req[source]);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }
    next();
  };
}

module.exports = {
  validateCreatePost: validate(createPostSchema),
  validateUpdatePost: validate(updatePostSchema),
  validatePostQuery: validate(querySchema, "query"),
  validateGetPostById: validate(getPostByIdSchema, "params"),
};
