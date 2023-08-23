const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const authMiddleware = require("../middlewares/authMiddleware");
//new user registration
router.post("/register", async (req, res) => {
  console.log(`Register APi called`);
  try {
    //check if user already exist

    const user = await User.findOne({
      email: req.body.email,
    });
    if (user) {
      return res.send({
        success: false,
        message: "User already exist",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    //save user

    const newUser = new User(req.body);
    await newUser.save();
    res.status(200).send({
      success: true,
      message: "User created successfully",
      createdUser: newUser,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
    console.log(`Error Found: ${error}`);
  }
});

//user login'

router.post("/login", async (req, res) => {
  try {
    //check if user exist
    const user = await User.findOne({
      email: req.body.email,
    });
    if (!user) {
      throw new Error("User not found");
    }

    //if user is blocked
    if (user.status !== "active")
      throw new Error("The user accound is blocked,please contact admin");

    //compare password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) throw new Error("Invalid Password");

    //create and assign token

    const token = jwt.sign({ userId: user._id }, process.env.jwt_secret, {
      // expiresIn: "1d",
    });

    res.send({
      success: true,
      message: "User logged in successfully",
      data: token,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
    console.log(`Error Found: ${error}`);
  }
});

//get current user
router.get("/get-current-user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    res.send({
      success: true,
      message: "User Fetched successfully",
      data: user,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
    console.log(`Error Found: ${error}`);
  }
});

//get all users
router.get("/get-all-users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find();
    res.send({
      success: true,
      message: "User Fetched successfully",
      users,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
    console.log(`Error Found: ${error}`);
  }
});

router.get("/get-google-user", async (req, res) => {
  try {
    const myCookie = req.cookies;
    if (myCookie.googleauthsession) {
      console.log(`Value of myCookie:`, myCookie.googleauthsession);

      const email = req.user.email;

      const user = await User.findOne({ email: email });

      // console.log(`USer fetched:`, user);
      // if (!user) throw new Error("User not found");

      const token = jwt.sign({ userId: user._id }, process.env.jwt_secret, {
        // expiresIn: "1d",
      });

      res.send({
        success: true,
        message: "User Fetched successfully",
        data: token,
      });
    }
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
    console.log(`Error Found: ${error}`);
  }
});

router.get("/read-cookie", (req, res) => {
  const myCookieName = "google-auth-session";
  const myCookie = req.cookies; // Replace 'myCookieName' with your cookie name
  if (myCookie) {
    console.log(`Value of myCookie:`, myCookie);
    res.send({
      message: "ok",
    });
  } else {
    res.send("Cookie not found");
  }
});

//logout google user

router.get("/google-logout", async (req, res) => {
  try {
    req.logout();
    res.send({
      success: true,
      message: "Logged Out",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

//update user status
router.put("/update-user-status/:id", authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, req.body);
    res.send({
      success: true,
      message: "User Updated successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
    console.log(`Error Found: ${error}`);
  }
});
module.exports = router;
