const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

require("dotenv").config();

const app = express();
app.use(express.json());

connectDB();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:3001",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/test", require("./routes/debug"));
app.use("/api/friends", require("./routes/friends"));
app.use("/api/posts", require("./routes/posts"));
app.use("/api/groups", require("./routes/groups"));
app.use("/api/groups/admin", require("./routes/adminGroup"));

app.get("/", (req, res) => {
  res.send("StudyBuddy API is working 🚀");
});

module.exports = app;
