const express = require("express");
const connectDB = require("./config/db");

require("dotenv").config();

const app = express();
app.use(express.json());

connectDB();

app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/test", require("./routes/debug"));
app.use("/api/friends", require("./routes/friends"));
app.use("/api/posts", require("./routes/posts"));
app.use("/api/groups", require("./routes/groups"));
app.use("/api/groups/admin", require("./routes/adminGroup"));
app.use("/api/messages", require("./routes/messages"));

app.get("/", (req, res) => {
  res.send("StudyBuddy API is working 🚀");
});

module.exports = app;
