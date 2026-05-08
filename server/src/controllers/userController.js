const User = require("../models/User");
const Notification = require("../models/Notification");
const fileUrl = require("../utils/fileUrl");

const publicUserSelect = "-password";

const getUsers = async (req, res, next) => {
  try {
    const query = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { username: { $regex: req.query.search, $options: "i" } }
          ]
        }
      : {};

    const users = await User.find(query).select(publicUserSelect).limit(24).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const getUserByUsername = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username.toLowerCase() }).select(publicUserSelect);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const fields = ["name", "bio", "location", "website"];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) user[field] = req.body[field];
    });

    if (req.file) user.avatar = fileUrl(req.file);
    const updated = await user.save();
    res.json(updated.toSafeObject());
  } catch (error) {
    next(error);
  }
};

const followUser = async (req, res, next) => {
  try {
    const target = await User.findById(req.params.id);
    const current = await User.findById(req.user._id);

    if (!target || !current) {
      res.status(404);
      throw new Error("User not found");
    }

    if (target._id.equals(current._id)) {
      res.status(400);
      throw new Error("You cannot follow yourself");
    }

    const alreadyFollowing = current.following.some((id) => id.equals(target._id));

    if (alreadyFollowing) {
      current.following.pull(target._id);
      target.followers.pull(current._id);
    } else {
      current.following.push(target._id);
      target.followers.push(current._id);
      await Notification.create({
        recipient: target._id,
        sender: current._id,
        type: "follow",
        message: `${current.name} started following you`
      });
    }

    await current.save();
    await target.save();

    res.json({
      following: !alreadyFollowing,
      currentUser: current.toSafeObject(),
      targetUser: target.toSafeObject()
    });
  } catch (error) {
    next(error);
  }
};

const suggestedUsers = async (req, res, next) => {
  try {
    const users = await User.find({
      _id: { $ne: req.user._id, $nin: req.user.following }
    })
      .select(publicUserSelect)
      .limit(6)
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, getUserByUsername, updateProfile, followUser, suggestedUsers };
