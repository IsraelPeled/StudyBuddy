const express = require("express");
const auth = require("../middlewares/authMiddleware");
const {
  getHistory,
  getGroupChatHistory,
} = require("../controllers/chatController");

const router = express.Router();

router.get("/history/:user1/:user2", auth, getHistory);

router.get("/history/:groupId", auth, getGroupChatHistory);

module.exports = router;
