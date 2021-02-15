const express = require('express');
const router = express.Router();

const { Post, User, Hashtag } = require("../models")

// 유저 인포와 팔로워들을 초기화
router.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.followerCount = req.user ? req.user.Followers.length : 0;
  res.locals.followingCount = req.user ? req.user.Followings.length : 0;
  res.locals.followerIdList = req.user ? req.user.Followings.map(f => f.id) : [];
  next();
})

router.get("/profile", (req, res) => {
  res.render("profile", { title: "내 정보 - NOdeBird" });
})

router.get("/join", (req, res) => {
  res.render("join", { title: "회원가입 - NOdeBird" });
})

router.get("/", async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      // post와 관련된 User정보를 가져올 수 있다.
      // attributes에는 가져올 User의 column명을 가져오고
      // order에서는 어떤 값을 기준으로 정렬해서 가져올지.
      include: {
        model: User,
        attributes: ["id", "nick"],
      },
      order: [['createdAt', "DESC"]]
    })
    res.render("main", {
      title: "NodeBird",
      twits: posts,
    });

  } catch (error) {
    console.log(error)
    next(error)
  }
})

// GET /hashtag?hashtag=encodeURIcomponent
router.get("/hashtag", async (req, res, next) => {
  const query = decodeURIComponent(req.query.hashtag);
  if (!query) {
    return res.redirect("/")
  }

  try {
    const hashtag = await Hashtag.findOne({
      where: { title: query }
    })
    let posts = [];
    if (hashtag) {
      posts = await hashtag.getPosts({ include: [{ model: User, attributes: ["id", "nick"] }] });
    }

    return res.render("main", {
      title: `#${query} 검색 결과 | NodeBird`,
      twits: posts,
      search: query
    });
  } catch (error) {
    console.error(error);
    next(error)
  }
})

module.exports = router