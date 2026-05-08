const Notification = require("../models/Notification");

const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate("sender", "name username avatar")
      .populate("post", "text media mediaType")
      .sort({ createdAt: -1 })
      .limit(40);
    res.json(notifications);
  } catch (error) {
    next(error);
  }
};

const markNotificationsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ recipient: req.user._id, read: false }, { read: true });
    res.json({ message: "Notifications marked as read" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getNotifications, markNotificationsRead };
