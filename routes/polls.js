const express = require("express");
const Poll = require("../models/poll");
const router = express.Router();

// Home Page - List Polls
router.get("/", async (req, res) => {
  const polls = await Poll.find();
  res.render("index", { polls });
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

  res.redirect(`/polls/${req.params.id}/result`);
});

// View poll results
router.get("/polls/:id/result", async (req, res) => {
  const poll = await Poll.findById(req.params.id);
  res.render("result", { poll });
});

module.exports = router;
