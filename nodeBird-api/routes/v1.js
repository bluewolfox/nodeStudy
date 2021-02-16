const express = require('express');
const jwt = require('jsonwebtoken');

const { verifyToken } = require("./middlewares")
const { Domain, User } = require("../models");

const router = express.Router();

router.post("/token", async (req, res) => {
  const { clientSecret } = req.body;
  try {
    const domain = await Domain.findOne({
      where: { clientSecret },
      include: {
        model: User,
        attribute: ["nick", "id"]
      }
    })
    if (!domain) {
      return res.status(401).json({
        code: 401,
        message: "등록되지 않은 도메인입니다. 먼저 도메인을 등록하세요"
      });
    }
    const token = jwt.sign({ // jwt.sign() 토큰발급 첫번째 인수에 id,nick같은 필요한데이터를 넣는다. 두번째 인자에 JWT_SECRET을 넣는다. 세번째가 유효기간과 issuer = 발급자. 를 넣어준다.
      id: domain.user.id,
      nick: domain.user.nick
    }, process.env.JWT_SECRET, {
      expiresIn: "1m", // 만료기간
      issuer: "nodebird" // 발급자
    });

    return res.json({
      code: 200,
      message: "토큰이 발급되었습니다.",
      token
    })
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: "서버 에러"
    })
  }
})

router.get("/test", verifyToken, (req, res) => {
  res.json(req.decoded)
})

module.exports = router