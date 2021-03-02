const express = require('express');

const Room = require('../schemas/room');
const Chat = require('../schemas/chat');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const rooms = await Room.find({});
    res.render('main', { rooms, title: "GIF 채팅방" });
  } catch (error) {
    console.error(error);
    next(error)
  }
});


module.exports = router;
