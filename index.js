const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger("dev"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(logger("dev"));

app.get("/", function (req, res) {
  const test = Math.floor(Math.random() * 10000);
  res.status(200).json({ message: "Server running", number: test });
});

// app.use(require('./middlewares/midelware-error'))

app.listen(6001, () => console.log("Listening on port: 6001 http://localhost:6001"));
