const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const authMiddleware = require("../middlewares/authMiddleware");
const helmet = require("helmet");
const cookieSession = require("cookie-session");
const passport = require("passport");
const { Strategy } = require("passport-google-oauth20");
router.use(
  cookieSession({
    name: "googleauthsession",
    keys: ["key1", "key2"],
  })
);
router.use(passport.initialize());
router.use(passport.session());

const AUTH_OPTIONS = {
  callbackURL: "/auth/google/callback",
  clientID:
    "758664794215-vtohbemume2i079nbneriik6jecm8t1p.apps.googleusercontent.com",
  clientSecret: "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",
};

async function verifyCallback(accessToken, refreshToken, profile, done) {
  const Userprofile = {
    name: profile.displayName,
    email: profile.emails[0].value,
  };
  console.log("Google Profile", Userprofile);
  //check if user exists

  const user = await User.findOne({
    email: Userprofile.email,
  });

  if (user) {
    console.log(`User exists`);
  } else {
    const NewUser = new User({
      name: Userprofile.name,
      email: Userprofile.email,
      password: "notdecidedyet",
    });

    const response = await NewUser.save();
    console.log(`New user created`, response);
  }

  done(null, profile);
}
passport.use(new Strategy(AUTH_OPTIONS, verifyCallback));

passport.serializeUser((user, done) => {
  done(null, { email: user.emails[0].value });
});

passport.deserializeUser((obj, done) => {
  console.log(`Passport deserialize`, obj);
  done(null, obj);
});

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/failure",
    successRedirect: "/",
    // sessions: true,
  }),
  (req, res) => {
    console.log("GOogle called us back!");
  }
);
router.get("/failed", (req, res) => {
  res.send("Failed");
});
router.get("/auth/check", async (req, res) => {
  res.send({
    ServerStatus: "active",
  });
});

module.exports = router;
