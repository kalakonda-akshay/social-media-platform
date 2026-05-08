const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("../config/db");
const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const Notification = require("../models/Notification");

const demoUsers = [
  {
    name: "Aarav Mehta",
    username: "aarav",
    email: "aarav@connectsphere.dev",
    password: "password123",
    bio: "Product thinker, weekend photographer, chai loyalist.",
    location: "Hyderabad",
    website: "https://connectsphere.dev",
    avatar: "https://api.dicebear.com/8.x/initials/svg?seed=Aarav"
  },
  {
    name: "Maya Rao",
    username: "maya",
    email: "maya@connectsphere.dev",
    password: "password123",
    bio: "Designing interfaces that feel calm and fast.",
    location: "Bengaluru",
    avatar: "https://api.dicebear.com/8.x/initials/svg?seed=Maya"
  },
  {
    name: "Kabir Sen",
    username: "kabir",
    email: "kabir@connectsphere.dev",
    password: "password123",
    bio: "Full-stack dev sharing tiny wins and useful snippets.",
    location: "Pune",
    avatar: "https://api.dicebear.com/8.x/initials/svg?seed=Kabir"
  },
  {
    name: "Nisha Kapoor",
    username: "nisha",
    email: "nisha@connectsphere.dev",
    password: "password123",
    bio: "Community builder. Always collecting good questions.",
    location: "Mumbai",
    avatar: "https://api.dicebear.com/8.x/initials/svg?seed=Nisha"
  }
];

const runSeed = async () => {
  await connectDB();
  const demoEmails = demoUsers.map((user) => user.email);
  const existingDemoUsers = await User.find({ email: { $in: demoEmails } }).select("_id");
  const demoIds = existingDemoUsers.map((user) => user._id);

  if (demoIds.length) {
    const demoPosts = await Post.find({ author: { $in: demoIds } }).select("_id");
    const demoPostIds = demoPosts.map((post) => post._id);

    await Promise.all([
      Comment.deleteMany({ $or: [{ author: { $in: demoIds } }, { post: { $in: demoPostIds } }] }),
      Notification.deleteMany({ $or: [{ sender: { $in: demoIds } }, { recipient: { $in: demoIds } }, { post: { $in: demoPostIds } }] }),
      Post.deleteMany({ author: { $in: demoIds } }),
      User.deleteMany({ _id: { $in: demoIds } })
    ]);
  }

  const users = await Promise.all(demoUsers.map((user) => User.create(user)));

  users[0].following = [users[1]._id, users[2]._id];
  users[1].followers = [users[0]._id];
  users[2].followers = [users[0]._id];
  await Promise.all(users.map((user) => user.save()));

  const posts = await Post.insertMany([
    {
      author: users[0]._id,
      text: "Launched a new dashboard concept today. The sweet spot is when power features still feel friendly.",
      likes: [users[1]._id, users[2]._id]
    },
    {
      author: users[1]._id,
      text: "Tiny design note: empty states should reward curiosity, not make people feel like they broke something.",
      likes: [users[0]._id, users[3]._id]
    },
    {
      author: users[2]._id,
      text: "Refactored a messy auth flow into small middleware pieces. Future-me owes present-me a coffee.",
      likes: [users[0]._id]
    },
    {
      author: users[3]._id,
      text: "Good communities are built from repeatable small moments: welcomes, thoughtful replies, and visible care.",
      likes: [users[0]._id, users[1]._id, users[2]._id]
    }
  ]);

  await Comment.insertMany([
    { post: posts[0]._id, author: users[1]._id, text: "This is exactly the kind of product energy I like." },
    { post: posts[0]._id, author: users[2]._id, text: "Ship the case study when it is ready." },
    { post: posts[3]._id, author: users[0]._id, text: "That is the whole playbook in one post." }
  ]);

  await Notification.insertMany([
    { recipient: users[0]._id, sender: users[1]._id, type: "like", post: posts[0]._id, message: "Maya liked your post" },
    { recipient: users[0]._id, sender: users[2]._id, type: "comment", post: posts[0]._id, message: "Kabir commented on your post" }
  ]);

  console.log("Seed complete. Demo login: aarav@connectsphere.dev / password123");
  process.exit(0);
};

runSeed().catch((error) => {
  console.error(error);
  process.exit(1);
});
