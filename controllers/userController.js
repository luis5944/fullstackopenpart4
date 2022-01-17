const bcrypt = require("bcrypt");
const User = require("../models/user");
const userRouter = require("express").Router();

userRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    url: 1,
    title: 1,
    author: 1,
  });
  response.json(users);
});

userRouter.post("/", async (request, response, next) => {
  const body = request.body;

  if (!body.password) {
    return response.status(400).json({ error: "Password is required" });
  }

  if (body.password.length < 3) {
    return response
      .status(400)
      .json({ error: "Password must be longer than 3" });
  }
  const passwordHash = await bcrypt.hash(body.password, 10);

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  });

  const userSaved = await user.save();
  response.json(userSaved);
});

module.exports = userRouter;
