const mongoose = require("mongoose");
const supertest = require("supertest");

const app = require("../app");
const Blog = require("../models/blog");
const helper = require("./testHelper");

const api = supertest(app);

const initialBlogs = [
  {
    author: "AAA",
    likes: 2,
    title: "AAA",
    url: "AAA",
  },
  {
    author: "BBB",
    likes: 3,
    title: "BBB",
    url: "BBB",
  },
];
beforeEach(async () => {
  await Blog.deleteMany({});
  let first = new Blog(initialBlogs[0]);
  await first.save();
  let second = new Blog(initialBlogs[1]);
  await second.save();
});

test("there are two blogs", async () => {
  const response = await api.get("/api/blogs");
  expect(response.body).toHaveLength(initialBlogs.length);
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("there is a property called id", async () => {
  const response = await api.get("/api/blogs");
  expect(response.body[0].id).toBeDefined();
});

test("a valid blog can be added", async () => {
  const newBlog = {
    author: "CCC",
    likes: 3,
    title: "CCC",
    url: "CCC",
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");

  const title = response.body.map((r) => r.title);

  expect(response.body).toHaveLength(initialBlogs.length + 1);
  expect(title).toContain("CCC");
});

test("If the likes property is missing, it will default to 0 ", async () => {
  const newBlog = {
    title: "DDD",
    author: "DDD",
    url: "DDD",
  };

  const blogAdd = await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  expect(blogAdd.body.likes).toBe(0);
});

test("If title and url are missing, respond with 400 bad request", async () => {
  const newBlog = {
    author: "Edsger W. Dijkstra",
    likes: 12,
  };

  await api.post("/api/blogs").send(newBlog).expect(400);
  const response = await api.get("/api/blogs");

  expect(response.body).toHaveLength(initialBlogs.length);
});

test("delete a blog post", async () => {
  let blogs = await helper.blogsInDb();
  const blogToDelete = blogs[0];
  console.log(blogToDelete);
  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

  const notesAtEnd = await helper.blogsInDb();

  expect(notesAtEnd).toHaveLength(initialBlogs.length - 1);
});

test("should update a blog post", async () => {
  let blogs = await helper.blogsInDb();
  const blogToUpdate = blogs[0];
  await api.put(`/api/blogs/${blogToUpdate.id}`).expect(200);
});
afterAll(() => {
  mongoose.connection.close();
});
