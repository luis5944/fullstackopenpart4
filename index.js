const http = require("http");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const Blog = require("./models/blog");
const blogRouter = require("./controllers/blogController");
const app = require("./app");
const { PORT } = require("./utils/config");
dotenv.config();


;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
