const express = require("express");

const auth = require("../middlewares/authMiddleware");
const {
  getCurrentUser,
  getUserById,
  updateCurrentUser,
  changePassword,
  deleteAccount,
  getAllUsers,
} = require("../controllers/userController");

const router = express.Router();

//* get current user info
router.get("/me", auth, getCurrentUser);

//*get all users
router.get("/", auth, getAllUsers);

//* get user by id
router.get("/:id", auth, getUserById);

//? update current user
router.put("/update", auth, updateCurrentUser);

//? change password
router.put("/change-password", auth, changePassword);

//! delete current user
router.delete("/delete", auth, deleteAccount);

module.exports = router;
