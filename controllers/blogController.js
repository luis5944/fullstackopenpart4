const blogRouter = require("express").Router();
const Blog = require("../models/blog");

blogRouter.get("/", async (request, response) => {
  const notes = await Blog.find({});
  response.json(notes.map((note) => note.toJSON()));
});

blogRouter.post("/", async (request, response, next) => {
  try {
    const blog = new Blog({
      author: request.body.author,
      likes: request.body.likes || 0,
      title: request.body.title,
      url: request.body.url,
    });

    const saveBlog = await blog.save();
    response.json(saveBlog.toJSON());
  } catch (exception) {
    next(exception);
  }
});

blogRouter.delete("/:id", async (request, response, next) => {
  const id = request.params.id;
  try {
    await Blog.findByIdAndRemove(id);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

blogRouter.put("/:id", async (request, response, next) => {
  const body = request.body;

  const note = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, note, {
      new: true,
      omitUndefined: true,
    });

    response.json(updatedBlog.toJSON());
  } catch (error) {
    next(error);
  }
});

module.exports = blogRouter;
