const express = require('express');
const jwt = require('jsonwebtoken');
const Message = require('../models/Message');
const User = require('../models/User');
const router = express.Router();

// Middleware to extract user from token
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.sendStatus(401);
  try {
    const user = jwt.verify(token, 'secret');
    req.user = user;
    next();
  } catch {
    res.sendStatus(403);
  }
};

// Send message
router.post('/', auth, async (req, res) => {
  const msg = new Message({
    sender: req.user.id,
    receiver: req.body.receiver,
    content: req.body.content
  });
  await msg.save();
  res.status(201).json(msg);
});

// Get chat history
router.get('/:withUserId', auth, async (req, res) => {
  const messages = await Message.find({
    $or: [
      { sender: req.user.id, receiver: req.params.withUserId },
      { sender: req.params.withUserId, receiver: req.user.id }
    ]
  }).sort('createdAt');
  res.json(messages);
});

module.exports = router;
