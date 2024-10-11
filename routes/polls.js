const express = require("express");
const Poll = require("../models/poll");
const router = express.Router();

// Home Page - List Polls
router.get("/", async (req, res) => {
  const polls = await Poll.find();
  res.render("index", { polls });
});

// Create New Poll (GET route to show the form)
router.get("/polls/new", (req, res) => {
  res.render("new_poll");
});

// Create New Poll (POST route to save the poll)
router.post("/polls/new", async (req, res) => {
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
  console.log(poll.totalVotes);
  console.log(poll);
  res.redirect(`/polls/${req.params.id}/result`);
});

// View poll results
router.get("/polls/:id/result", async (req, res) => {
  const poll = await Poll.findById(req.params.id);
  //   console.log(poll);
  res.render("result", { poll });
});

module.exports = router;
