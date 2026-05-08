const express = require("express");
const {
  getUsers,
  getUserByUsername,
  updateProfile,
  followUser,
  suggestedUsers
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/", protect, getUsers);
router.get("/suggested", protect, suggestedUsers);
router.put("/profile", protect, upload.single("avatar"), updateProfile);
router.put("/:id/follow", protect, followUser);
router.get("/:username", protect, getUserByUsername);

module.exports = router;
