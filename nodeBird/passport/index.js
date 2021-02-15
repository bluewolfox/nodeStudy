const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id) // 세션에 user의 id만 저장. user로 통째로 저장하려면 user만 저장
  })

  // {id:3, "connect.sid":s%316161616161};

  // passport.session이 실행될때 deserializeUser가 실행된다.
  // 로그인 이후 동작. 
  passport.deserializeUser((id, done) => {
    User.findOne({
      where: { id },
      include: [{
        model: User,
        attributes: ["id", "nick"],
        as: "Followers"
      }, {
        model: User,
        attributes: ["id", "nick"],
        as: "Followings"
      }]
    })
      .then(user => done(null, user)) // req.user를 찾아서 넘겨준다.
      .catch(err => done(err));
  })

  local();
  kakao();
}