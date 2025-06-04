const express = require("express");
const auth = require("../middlewares/authMiddleware");
const {
  createGroup,
  getAllGroups,
  joinGroup,
  leaveGroup,
  cancelJoinGroupRequest,
} = require("../controllers/groupController");

const router = express.Router();

//? create group
router.post("/create", auth, createGroup);

//* get all groups
router.get("/", auth, getAllGroups);

//? join group
router.post("/:id/join", auth, joinGroup);

//? cancel join group request
router.post("/:id/cancel", auth, cancelJoinGroupRequest);

//? leave group
router.post("/:id/leave", auth, leaveGroup);

module.exports = router;
