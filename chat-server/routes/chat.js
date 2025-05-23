const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Chat = require('../models/Chat');
const Message = require('../models/Message');

// Create new chat between 2 users
router.post('/', auth, async (req, res) => {
  console.log('Create chat request body:', req.body);

  const { members } = req.body;

  if (!members || !Array.isArray(members)) {
    return res.status(400).json({ error: 'Members must be an array' });
  }

  try {
    let chat = await Chat.findOne({ members: { $all: members } });
    if (chat) return res.status(200).json(chat);

    chat = new Chat({ members });
    await chat.save();
    res.status(201).json(chat);
  } catch (err) {
    console.error('Error creating chat:', err);
    res.status(500).json({ error: err.message });
  }
});


// Get chats of logged in user
router.get('/', auth, async (req, res) => {
  try {
    const chats = await Chat.find({ members: req.user.id }).populate('members', 'username');
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get messages of a chat
router.get('/:chatId/messages', auth, async (req, res) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
