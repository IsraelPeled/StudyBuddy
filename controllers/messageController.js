const Message = require("../models/Message");

const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { from: req.user.id, to: req.params.userId },
        { from: req.params.userId, to: req.user.id },
      ],
    }).sort({ timestamp: 1 });
  } catch (error) {
    res.status(500).json({ messgae: "Server Error", details: error.message });
  }
};

module.exports = { getMessages };
