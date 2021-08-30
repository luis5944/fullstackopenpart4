const blogRouter = require("express").Router();
const Blog = require("../models/blog");

blogRouter.get("/", async (request, response) => {
  const notes = await Blog.find({});
  response.json(notes.map((note) => note.toJSON()));
});

blogRouter.post("/", async (request, response) => {
  const blog = new Blog({
    author: request.body.author,
    likes: request.body.likes || 0,
    title: request.body.title,
    url: request.body.url,
  });

  try {
    const saveBlog = await blog.save();

    response.json(saveBlog);
  } catch (exception) {
    next(exception);
  }
});

module.exports = blogRouter;
