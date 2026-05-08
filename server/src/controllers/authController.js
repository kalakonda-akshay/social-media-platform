const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const registerUser = async (req, res, next) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      res.status(400);
      throw new Error("Please provide name, username, email, and password");
    }

    const normalizedUsername = username.toLowerCase().replace(/\s+/g, "");
    const exists = await User.findOne({ $or: [{ email: email.toLowerCase() }, { username: normalizedUsername }] });
    if (exists) {
      res.status(409);
      throw new Error("Email or username already exists");
    }

    const user = await User.create({ name, username: normalizedUsername, email, password });
    res.status(201).json({ user: user.toSafeObject(), token: generateToken(user._id) });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });

    if (user && (await user.matchPassword(password))) {
      return res.json({ user: user.toSafeObject(), token: generateToken(user._id) });
    }

    res.status(401);
    throw new Error("Invalid email or password");
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res) => {
  res.json({ user: req.user });
};

module.exports = { registerUser, loginUser, getMe };
