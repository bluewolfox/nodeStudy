const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const url = require('url');

const { verifyToken, apiLimiter } = require("./middlewares")
const { Domain, User, Post, Hashtag } = require("../models");

const router = express.Router();
router.use(async(req, res, next) => {
  const domain = await Domain.findOne({
    where: { host: url.parse(req.get("origin"))?.host } // [앞]?.[뒤] => node14부터 가능한 [앞]의 것이 undefined면 undefined , 값이 있으면 객체 안에서 host를 꺼낸다
  })
  if (domain) {
    cors({
      origin: true,
      credentials: true
    })(req, res, next);
  } else {
    next();
  }
})

router.post("/token", apiLimiter, async (req, res) => {
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
      id: domain.User.id,
      nick: domain.User.nick
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

router.get("/test", verifyToken, apiLimiter, (req, res) => {
  res.json(req.decoded)
})

router.get("/posts/my", verifyToken, apiLimiter, (req, res) => {
  Post.findAll({ where: { userId: req.decoded.id } })
    .then((posts) => {
      res.json({
        code: 200,
        payload: posts
      })
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({
        code: 500,
        message: "서버 에러"
      })
    })
})

router.get("/posts/hashtag/:title", verifyToken, apiLimiter, async (req, res) => {
  try {
    const hashtag = await Hashtag.findOne({ where: { title: req.params.title } });
    if (!hashtag) {
      return res.status(404).json({
        code: 404,
        message: "검색 결과가 없습니다."
      })
    }
    const posts = await hashtag.getPosts();
    return res.json({
      code: 200,
      payload: posts
    })
  } catch (error) {
    console.error(error);
    return resizeBy.status(500).json({
      code: 500,
      message: "서버 에러"
    })
  }
})

module.exports = router