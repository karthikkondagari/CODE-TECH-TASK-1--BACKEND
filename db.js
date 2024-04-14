const mongoose = require("mongoose");

// const dotenv = require("dotenv");
// dotenv.config({ path: "./config.env" });
require('dotenv').config()
const app = require("./index");
const port = process.env.PORT || 5001;

//  console.log(process.env);
console.log(app.get("env"));
console.log(process.env.MONGODB_URI);
mongoose
  .connect(process.env.MONGODB_URI, {})
  .then((conn) => {
    // console.log(conn);
    console.log("DB connected successfully");
  })
  .catch((err) => {
    console.log("DB not connected successfully");
    console.log(err);
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
