const Joi = require("joi");

// Create Comment Validator
const createCommentSchema = Joi.object({
  postId: Joi.string().length(24).required(), // MongoDB ObjectId
  content: Joi.string().min(1).required(),
  author: Joi.string().required(), // MongoDB ObjectId
  isRichText: Joi.boolean().optional(),
});

// Update Comment Validator
const updateCommentSchema = Joi.object({
  content: Joi.string().min(1),
  isRichText: Joi.boolean(),
}).or("content", "isRichText");

// Get comments by postId
const getCommentByPostIdSchema = Joi.object({
  pid: Joi.string().length(24).required(),
});

// Comment ID validator
const commentIdParamSchema = Joi.object({
  id: Joi.string().length(24).required(),
});

// Query params for pagination
const commentQuerySchema = Joi.object({
  page: Joi.number().min(1),
  limit: Joi.number().min(1).max(100),
});

// Middleware creator
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
  validateCreateComment: validate(createCommentSchema),
  validateUpdateComment: validate(updateCommentSchema),
  validateCommentQuery: validate(commentQuerySchema, "query"),
  validateCommentIdParam: validate(commentIdParamSchema, "params"),
  validateGetCommentsByPostId: validate(getCommentByPostIdSchema, "params"),
};
