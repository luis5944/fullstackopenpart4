const app = require("../app");
const supertest = require("supertest");
const api = supertest(app);
const helper = require("./testHelper");
const Blog = require("../models/blog");
const mongoose = require("mongoose");

let headers;
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

  const newUser = {
    username: "rootaa",
    name: "root",
    password: "password",
  };

  await api.post("/api/users").send(newUser);

  const result = await api.post("/api/login").send(newUser);

  headers = {
    Authorization: `bearer ${result.body.token}`,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(200)
    .set(headers)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");

  const title = response.body.map((r) => r.title);

  expect(response.body).toHaveLength(initialBlogs.length + 1);
  expect(title).toContain("CCC");
});
test("without token fail to create a blog", async () => {
  const newBlog = {
    author: "CCC",
    likes: 3,
    title: "CCC",
    url: "CCC",
  };
  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(401)

    .expect("Content-Type", /application\/json/);
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
    .set(headers)
    .expect("Content-Type", /application\/json/);

  expect(blogAdd.body.likes).toBe(0);
});

test("If title and url are missing, respond with 400 bad request", async () => {
  const newBlog = {
    author: "Edsger W. Dijkstra",
    likes: 12,
  };

  await api.post("/api/blogs").send(newBlog).set(headers).expect(400);
  const response = await api.get("/api/blogs");

  expect(response.body).toHaveLength(initialBlogs.length);
});

test("delete a blog post", async () => {
  const newBlog = {
    title: "one blog",
    author: "Me",
    url: "www",
    likes: 14,
  };

  await api.post("/api/blogs").send(newBlog).set(headers).expect(200);

  const allBlogs = await helper.blogsInDb();
  const blogToDelete = allBlogs.find((blog) => blog.title === newBlog.title);
  await api.delete(`/api/blogs/${blogToDelete.id}`).set(headers).expect(204);
});

test("should update a blog post", async () => {
  let blogs = await helper.blogsInDb();
  const blogToUpdate = blogs[0];
  await api.put(`/api/blogs/${blogToUpdate.id}`).expect(200);
});
afterAll(() => {
  mongoose.connection.close();
});
