const express = require('express');
const { addFollowings } = require('../controllers/user');
const { isLoggedIn } = require("./middlewares")
const router = express.Router()

// POST /user/1/follow
router.post("/:id/follow", isLoggedIn, addFollowings)

module.exports = router