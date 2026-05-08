const express = require("express");
const {
  createPost,
  getFeed,
  getExplorePosts,
  getTrendingPosts,
  getUserPosts,
  toggleLike,
  addComment,
  deletePost
} = require("../controllers/postController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/", protect, upload.single("media"), createPost);
router.get("/feed", protect, getFeed);
router.get("/explore", protect, getExplorePosts);
router.get("/trending", protect, getTrendingPosts);
router.get("/user/:username", protect, getUserPosts);
router.put("/:id/like", protect, toggleLike);
router.post("/:id/comments", protect, addComment);
router.delete("/:id", protect, deletePost);

module.exports = router;
