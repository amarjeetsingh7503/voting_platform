const express = require("express");
const bcrypt = require("bcrypt");
const session = require("express-session");
const Poll = require("../models/poll");
const User = require("../models/user");
const router = express.Router();

// Session Middleware
router.use(
  session({
    secret: "6a9d89b2c3f15eb5c4f5d13bc7e6f29147a1babc32defaad1c12c2345f67890p",
    resave: false,
    saveUninitialized: false,
  })
);
// Middleware to Check Authentication
function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    return next();
  }
  res.redirect("/login");
}

// Home Page - List Polls
router.get("/", isAuthenticated, async (req, res) => {
  const polls = await Poll.find();
  res.render("index",{ polls, session: req.session });
});

// Login Page
router.get("/login", (req, res) => {
  res.render("login");
});

// Handle Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (user && (await bcrypt.compare(password, user.password))) {
    req.session.userId = user._id;
    res.redirect("/");
  } else {
    // Pass error to the EJS view
    res.render("login", { error: "Invalid username or password" });
  }
});
// Signup Page
router.get("/signup", (req, res) => {
  res.render("signup");
});

// Handle Signup
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  const existingUser = await User.findOne({ username });

  if (existingUser) {
    // Pass error to the EJS view if the username already exists
    return res.render("signup", { error: "Username already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword });

  try {
    await newUser.save();
    res.redirect("/login");
  } catch (err) {
    res.render("signup", { error: "An error occurred during signup" });
  }
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});


// New Poll Form
router.get("/polls/new", isAuthenticated, (req, res) => {
  res.render("new_poll");
});

// Create New Poll
router.post("/polls/new", isAuthenticated, async (req, res) => {
  const { question, options } = req.body;

  const pollOptions = options.map((option) => ({
    text: option,
    votes: 0,
  }));

  const newPoll = new Poll({
    question,
    options: pollOptions,
  });

  await newPoll.save();
  res.redirect("/");
});

// View a specific poll
router.get("/polls/:id", async (req, res) => {
  const poll = await Poll.findById(req.params.id);
  res.render("poll", { poll });
});

// Vote on a poll
router.post("/polls/:id/vote", async (req, res) => {
  const poll = await Poll.findById(req.params.id);
  const optionIndex = req.body.option;

  if (poll && poll.options[optionIndex]) {
    poll.options[optionIndex].votes += 1;
    poll.totalVotes += 1;
    await poll.save();
  }
  // console.log(poll.totalVotes);
  // console.log(poll);
  res.redirect(`/polls/${req.params.id}/result`);
});

// View poll results
router.get("/polls/:id/result", async (req, res) => {
  const poll = await Poll.findById(req.params.id);
  //   console.log(poll);
  res.render("result", { poll });
});

module.exports = router;
