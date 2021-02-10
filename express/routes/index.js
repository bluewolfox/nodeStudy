const express = require('express');

const router = express.Router();

router.get("/", (req, res) => {
  res.cookie("name", "bluewolfox", {
    httpOnly: true,
    signed: true
  })
  res.send("hello Express")
})

module.exports = router;