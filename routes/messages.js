const express = require("express");
const auth = require("../middlewares/authMiddleware");
const { getMessages } = require("../controllers/messageController");

const router = express.Router();

router.get("/:userId", auth, getMessages);

module.exports = router;
