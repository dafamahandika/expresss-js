const dotenv = require("dotenv");
dotenv.config();
const { Sequelize, DataTypes } = require("sequelize");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const app = express();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: "mysql",
  logging: false, // matikan log query kalau nggak perlu
});

app.use(cors());
app.use(express.json());
app.use(logger("dev"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(logger("dev"));

app.use((req, res, next) => {
  const ipAddress = req.ip || req.headers["x-forwarded-for"][0];
  console.log(ipAddress);
  next();
});

app.get("/hostname", async (req, res) => {
  try {
    const [results] = await sequelize.query("SELECT @@hostname AS hostname");
    return res.status(200).json({
      message: "Success",
      hostname: results[0].hostname,
    });
  } catch (err) {
    console.error("Query error:", err.message);
    return res.status(500).json({ error: err.message });
  }
});

app.get("/count", async (req, res) => {
  try {
    const [results] = await sequelize.query("SELECT COUNT(*) AS total_user FROM users");
    return res.status(200).json({
      message: "Success",
      total_user: results[0].total_user,
    });
  } catch (err) {
    console.error("Query error:", err.message);
    return res.status(500).json({ error: err.message });
  }
});

app.get("/", function (req, res) {
  const test = Math.floor(Math.random() * 10000);
  res.status(200).json({ message: "Server running", number: test });
});

// app.use(require('./middlewares/midelware-error'))

app.listen(6001, async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to ProxySQL via Sequelize");
    console.log(`Server running at http://localhost:${6001}`);
  } catch (err) {
    console.error("❌ Connection failed:", err.message);
  }
});
