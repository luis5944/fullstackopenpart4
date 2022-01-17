const app = require("../app");
const supertest = require("supertest");
const api = supertest(app);
const User = require("../models/user");
const bcrypt = require("bcrypt");
const helper = require("./testHelper");
const mongoose = require("mongoose");

beforeEach(async () => {
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash("secret", 10);

  const user = new User({
    username: "root",
    passwordHash,
  });

  await user.save();
});

test("create a new user", async () => {
  const usersAtStart = await helper.usersInDb();

  const newUser = {
    username: "elle",
    password: "secret",
  };

  await api
    .post("/api/users")
    .send(newUser)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const usersAtEnd = await helper.usersInDb();
  expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

  const usernames = usersAtEnd.map((u) => u.username);
  expect(usernames).toContain(newUser.username);
});
test("should fails when username is already taken with proper statuscode", async () => {
  const usersAtStart = await helper.usersInDb();

  const user = {
    username: "root",
    password: "secret",
  };

 const result = await api
    .post("/api/users")
    .send(user)
    .expect(400)
    .expect("Content-Type", /application\/json/);


    expect(result.body.error).toContain("`username` to be unique");
    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
});

afterAll(() => {
  mongoose.connection.close();
});
