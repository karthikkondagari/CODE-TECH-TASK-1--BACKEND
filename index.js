const express = require("express");
const cors = require("cors");
// const connectToMongo = require("./db");
// const dotenv = require("dotenv");
// dotenv.config({ path: "/.env" });

const app = express();

// function logger(req, res, next) {
//   console.log(" logger middleware executed ");
//   next();
// }

app.use(cors());
app.use(express.json());
// app.use(logger);

const Auth = require("./Routes/auth");
const Notes = require("./Routes/notes");

app.use("/api/auth", Auth);
app.use("/api/notes", Notes);

module.exports = app;
