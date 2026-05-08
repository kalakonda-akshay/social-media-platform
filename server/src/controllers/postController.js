const Post = require("../models/Post");
const Comment = require("../models/Comment");
const User = require("../models/User");
const Notification = require("../models/Notification");
const fileUrl = require("../utils/fileUrl");

const hydratePost = (query) =>
  query
    .populate("author", "name username avatar bio followers following")
    .populate("likes", "name username avatar");

const attachComments = async (posts) => {
  const postIds = posts.map((post) => post._id);
  const comments = await Comment.find({ post: { $in: postIds } })
    .populate("author", "name username avatar")
    .sort({ createdAt: 1 });

  return posts.map((post) => ({
    ...post.toObject(),
    comments: comments.filter((comment) => comment.post.equals(post._id))
  }));
};

const createPost = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text && !req.file) {
      res.status(400);
      throw new Error("Write something or attach media");
    }

    const mediaType = req.file?.mimetype.startsWith("video") ? "video" : req.file ? "image" : "";
    const post = await Post.create({
      author: req.user._id,
      text,
      media: fileUrl(req.file),
      mediaType
    });

    const fullPost = await hydratePost(Post.findById(post._id));
    res.status(201).json({ ...fullPost.toObject(), comments: [] });
  } catch (error) {
    next(error);
  }
};

const getFeed = async (req, res, next) => {
  try {
    const ids = [req.user._id, ...req.user.following];
    const posts = await hydratePost(Post.find({ author: { $in: ids } }).sort({ createdAt: -1 }).limit(50));
    res.json(await attachComments(posts));
  } catch (error) {
    next(error);
  }
};

const getExplorePosts = async (req, res, next) => {
  try {
    const posts = await hydratePost(Post.find({}).sort({ createdAt: -1 }).limit(80));
    res.json(await attachComments(posts));
  } catch (error) {
    next(error);
  }
};

const getTrendingPosts = async (req, res, next) => {
  try {
    const posts = await hydratePost(Post.find({}).sort({ likes: -1, createdAt: -1 }).limit(12));
    const withComments = await attachComments(posts);
    res.json(withComments.sort((a, b) => b.likes.length + b.comments.length - (a.likes.length + a.comments.length)));
  } catch (error) {
    next(error);
  }
};

const getUserPosts = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username.toLowerCase() });
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    const posts = await hydratePost(Post.find({ author: user._id }).sort({ createdAt: -1 }));
    res.json(await attachComments(posts));
  } catch (error) {
    next(error);
  }
};

const toggleLike = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "name");
    if (!post) {
      res.status(404);
      throw new Error("Post not found");
    }

    const liked = post.likes.some((id) => id.equals(req.user._id));
    liked ? post.likes.pull(req.user._id) : post.likes.push(req.user._id);
    await post.save();

    if (!liked && !post.author._id.equals(req.user._id)) {
      await Notification.create({
        recipient: post.author._id,
        sender: req.user._id,
        type: "like",
        post: post._id,
        message: `${req.user.name} liked your post`
      });
    }

    const updated = await hydratePost(Post.findById(post._id));
    const [withComments] = await attachComments([updated]);
    res.json(withComments);
  } catch (error) {
    next(error);
  }
};

const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) {
      res.status(400);
      throw new Error("Comment cannot be empty");
    }

    const post = await Post.findById(req.params.id).populate("author", "name");
    if (!post) {
      res.status(404);
      throw new Error("Post not found");
    }

    const comment = await Comment.create({ post: post._id, author: req.user._id, text });
    await comment.populate("author", "name username avatar");

    if (!post.author._id.equals(req.user._id)) {
      await Notification.create({
        recipient: post.author._id,
        sender: req.user._id,
        type: "comment",
        post: post._id,
        message: `${req.user.name} commented on your post`
      });
    }

    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404);
      throw new Error("Post not found");
    }

    if (!post.author.equals(req.user._id)) {
      res.status(403);
      throw new Error("You can delete only your own posts");
    }

    await Comment.deleteMany({ post: post._id });
    await Notification.deleteMany({ post: post._id });
    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPost,
  getFeed,
  getExplorePosts,
  getTrendingPosts,
  getUserPosts,
  toggleLike,
  addComment,
  deletePost
};
