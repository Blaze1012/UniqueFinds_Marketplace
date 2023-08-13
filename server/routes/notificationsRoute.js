const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const auth = require("../middlewares/authMiddleware");
const Notification = require("../models/notificationsModel");

//add a notification

router.post("/notify", authMiddleware, async (req, res) => {
  try {
    const newNotification = new Notification(req.body);
    await newNotification.save();
    res.send({
      success: true,
      message: "Notification added successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

//get all notifications by user
router.get("/get-all-notifications", auth, async (req, res) => {
  try {
    const notification = await Notification.find({
      user: req.body.userId,
    }).sort({
      createdAt: -1,
    });

    res.send({
      success: true,
      message: "All notifications sent for the user",
      data: notification,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

//delete notification

router.delete("/delete-notifications/:id", auth, async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.send({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

//read all notificatiom

router.put("/read-all-notifications", auth, async (req, res) => {
  try {
    await Notification.updateMany(
      {
        user: req.body.userId,
        read: false,
      },
      {
        $set: { read: true },
      }
    );
    res.send({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
