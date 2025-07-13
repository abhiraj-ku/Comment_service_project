# 📝 Post & Comment API (Bonus Rich Text implementation Done)

### Thank You Message

Thank you team Cloudsek for giving me this opportunity i enjoyed and learned few things working on this project. I tried my best to follow the assignment documentation provided to me .

A RESTful API built with Node.js, Express, and MongoDB to manage blog posts and comments. Supports features like:

- CRUD operations for Posts and Comments
- Pagination, Filtering, and Sorting
- Optional Rich Text Comments (with sanitization)
- Comment count tracking on Posts
- Request validation using Joi

## 📦 Tech Stack

- **Backend**: Node.js, Express
- **Database**: MongoDB with Mongoose
- **Validation**: Joi
- **Security**: sanitize-html (for rich text)

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/post-comment-api.git
cd post-comment-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Environment Variables

Create a `.env` file in the root:

```env
PORT=8080
MONGODB_DEP=mongodb://localhost:27017/blog-db
```

### 4. Start the Server

```bash
npm run dev
```

## 🛠️ API Endpoints

### 📚 Posts

| Method | Endpoint            | Description                         |
| ------ | ------------------- | ----------------------------------- |
| GET    | `/api/v1/posts`     | Get all posts (pagination, filters) |
| GET    | `/api/v1/posts/:id` | Get a single post by ID             |
| POST   | `/api/v1/posts`     | Create a new post                   |
| PATCH  | `/api/v1/posts/:id` | Update a post by ID                 |
| DELETE | `/api/v1/posts/:id` | Delete a post + its comments        |

**Query Parameters**: `?page=1&limit=10&author=<authorId>&sort=-createdAt&fields=title,author`

### 💬 Comments

| Method | Endpoint                      | Description                               |
| ------ | ----------------------------- | ----------------------------------------- |
| GET    | `/api/v1/comments/posts/:pid` | Get comments by post ID (with pagination) |
| POST   | `/api/v1/comments`            | Create a new comment                      |
| PUT    | `/api/v1/comments/:id`        | Update a comment                          |
| DELETE | `/api/v1/comments/:id`        | Delete a comment                          |

**Note**: Use `isRichText: true` to enable rich text formatting (e.g., `<b>`, `<a>`, `<ul>`)

## 🧪 Sample POST Request (Create Comment)

```json
POST /api/v1/comments
Content-Type: application/json

{
  "postId": "6873c0abdc3dce4af24e3a39",
  "author": "6873c0abdc3dce4af24e3a01",
  "content": "<b>Hello</b>, this is a <a href='https://example.com'>link</a>",
  "isRichText": true
}
```

## 🔐 Validation

All inputs are validated using Joi:

- MongoDB ObjectId length check
- Pagination inputs are type-checked
- Rich text is sanitized using sanitize-html

## 📁 Project Structure

```
.
├── controllers/
│   ├── postController.js
│   └── commentController.js
├── routes/
│   ├── post.js
│   └── comment.js
├── Middlewares/
│   ├── validations
│        └── commentValidators.js
|        └── postValidators.js
├── models/
│   ├── Post.js
│   └── Comment.js
├── index.js
├── .gitignore
└── README.md
```

## 👨‍💻 Author

Built with ❤️ by Abhishek Kumar
