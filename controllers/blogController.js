const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs.map((blog) => blog.toJSON()));
});

blogRouter.post("/", async (request, response, next) => {
  const body = request.body;
  const token = request.token;
  try {
    if (!token) {
      return response.status(401).json({ error: "Token missing" });
    }

    const decodedToken = jwt.verify(token, process.env.SECRET);

    if (!decodedToken.id) {
      return response.status(401).json({ error: "Token Invalid" });
    }

    const user = await User.findById(decodedToken.id);

    const blog = new Blog({
      author: request.body.author,
      likes: request.body.likes || 0,
      title: request.body.title,
      url: request.body.url,
      user: user._id,
    });

    const savedNote = await blog.save();
    user.blogs = user.blogs.concat(savedNote._id);
    await user.save();
    response.json(savedNote.toJSON());
  } catch (exception) {
    next(exception);
  }
});

blogRouter.delete("/:id", async (request, response, next) => {
  const id = request.params.id;

  const token = request.token;
  console.log(token);
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET);
    const blog = await Blog.findById(id);

    if (decodedToken.id.toString() === blog.user.toString()) {
      await Blog.findByIdAndRemove(id);
      response.status(204).end();
    } else {
      response
        .status(401)
        .send({ error: "You have no permission to delete tha blog" });
    }
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
