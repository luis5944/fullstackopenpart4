require("dotenv").config();

let PORT = process.env.PORT;
let MONGO_URL = process.env.NODE_ENV === 'test' 
? process.env.TEST_MONGODB_URI
: process.env.MONGO_URL

module.exports = {
  MONGO_URL,
  PORT,
};
