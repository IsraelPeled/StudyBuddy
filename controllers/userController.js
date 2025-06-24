const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Group = require("../models/Group");

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });
    res.json(user);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateCurrentUser = async (req, res) => {
  const { username } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { username },
      { new: true }
    ).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Remove user from all groups' members & admins
    const groups = await Group.find({
      $or: [{ members: userId }, { admins: userId }, { createdBy: userId }],
    });

    for (const group of groups) {
      // Remove user from members/admins
      group.members = group.members.filter((id) => id.toString() !== userId);
      group.admins = group.admins.filter((id) => id.toString() !== userId);

      // 2. Handle if user was the creator
      if (group.createdBy?.toString() === userId) {
        if (group.admins.length > 0) {
          // Transfer ownership to another admin
          group.createdBy = group.admins[0];
        } else if (group.members.length > 0) {
          // Transfer to member if no admins
          group.createdBy = group.members[0];
          group.admins.push(group.members[0]); // Promote to admin
        } else {
          // No members left — delete the group
          await group.deleteOne();
          continue;
        }
      }

      await group.save();
    }

    // 3. Delete the user
    await User.findByIdAndDelete(userId);

    res.json({ message: "User and related group references deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
