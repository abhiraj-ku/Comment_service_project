const Joi = require("joi");

//  Create Post Validator
const createPostSchema = Joi.object({
  title: Joi.string().min(3).max(150).required(),
  content: Joi.string().min(5).required(),
  author: Joi.string().length(24).required(), //  MongoDB ObjectId
});

//  Update Post Validator (partial update allowed)
const updatePostSchema = Joi.object({
  title: Joi.string().min(3).max(150),
  content: Joi.string().min(5),
}).or("title", "content");

//  Query Validator
const querySchema = Joi.object({
  q: Joi.string(),
  page: Joi.number().min(1),
  limit: Joi.number().min(1).max(100),
  sort: Joi.string(),
  fields: Joi.string(),
  author: Joi.string().length(24),
});
const getPostByIdSchema = Joi.object({
  id: Joi.string().length(24).required(), // mongoDB id
});

//  middleware creator
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
  validateGetPostById: validate(getPostByIdSchema),
  validateCreatePost: validate(createPostSchema),
  validateUpdatePost: validate(updatePostSchema),
  validatePostQuery: validate(querySchema, "query"),
};
