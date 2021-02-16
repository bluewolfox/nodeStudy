const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require("../models/user");

module.exports = () => {
  passport.use(new LocalStrategy({
    usernameField: "email", // req.body.email 둘이 일치해야된다.
    passwordField: "password", //req.body.password 둘이 일치해야된다.
  }, async (email, password, done) => {
    try {
      const exUser = await User.findOne({ where: { email } });
      if (exUser) {
        const result = await bcrypt.compare(password, exUser.password); // db의 비밀번호와 비교
        if (result) {
          done(null, exUser);
        } else {
          done(null, false, { message: "비밀번호가 일치하지 않습니다." });
        }
      } else {
        done(null, false, { message: "가입되지 않은 회원입니다." })
        // done인자 첫번째는 서버에러, 두번째는 로그인 성공여부, 세번째는 실패했을때 메새지 
      }

    } catch (error) {
      console.error(error);
      done(error)
    }
  }))
}