const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const User = require("../models/user")

const router = express.Router();

router.post("/join", isNotLoggedIn, async (req, res, next) => {
  const { email, nick, password } = req.body;

  try {
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      return res.redirect('/join?error=exist');
    }
    const hash = await bcrypt.hash(password, 12);
    await User.create({
      email, nick, password: hash
    });
    return res.redirect("/");
  } catch (err) {
    console.error(err);
    next(err)
  }
})

// 로그인 전략 설명
// 1. Front 에서 /auth/login을 POST로 보내면 passport.authenticate('local'까지 실행이 된다.
// 2. "local"이 해당되는 localStrategy.js로 간다.
// 3. localStrategy.js 로직이 완료되고 done()함수가 실행되면 (authError, user, info) => 함수로 온다. (authError, user, info) ==done(서버에러,user여부, 에러메세지)
// 4. 로그인 성공시에 req.login()이 실행되면 /passport/index.js로 간다. serializeUser가 실행이되고 done()실행이된다.
// 5. done이 실행되면 (loginError) => 가 실행된다. 
router.post("/login", isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError)
    }
    if (!user) {
      return res.redirect(`/?loginError=${info.message}`);
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError)
        return next(loginError)
      }
      return res.redirect("/");
      // 세션 쿠키를 브라우저로 보낸다.
    });
  })(req, res, next);
});

router.get("/logout", isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect("/");
})

router.get("/kakao", passport.authenticate('kakao'));

router.get("/kakao/callback", passport.authenticate("kakao", {
  failureRedirect: "/",
}), (req, res) => {
  res.redirect("/");
})

module.exports = router;