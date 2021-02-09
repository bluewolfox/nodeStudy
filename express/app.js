const express = require("express");
const path = require("path");
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const multer = require('multer');

// 전역 변수 느낌
app.set("port", process.env.PORT || 3000);

// 무슨 요청,응답을 받았는지 console에서 보여줌
// dev // combined
app.use(morgan("dev"));

app.use("/", (req, res, next) => {
  express.static(path.join(__dirname, "public"));
}); // 정적 파일 자동으로 보내줄때
// app.use("요청경로", express.static(__dirname, "실제경로폴더"));

app.use(cookieParser("bluewolfox"));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "blueWolfox_password",
    cookie: {
      httpOnly: true,
    },
    name: "connect.sid",
  })
); // const session = {} 역할. 자동으로 개인의 저장공간이 생성

// bodyParser 역할
// 알아서 body parser 해주는 역할 !!!필수
app.use(express.json()); // 클라이언트에서 json 데이터로 보냈을때  body에 넣어놓은.
app.use(express.urlencoded({ extended: true })); // 클라이언트에서 form으로 보냈을때 자동으로 query를 펴준다. // true면 querystring

app.get("/", (req, res, next) => {
  // req.session.id = "hello";

  // send, sendFile, json, render 모두 응답 메서드
  res.sendFile(path.join(__dirname, "index.html"));
  // res.json({ hello: "abc" });
  // res.render();
  // next("route"); // next("route")는 다음 같은 "/"주소를 찾는다
});

app.get("/category/:name", (req, res) => {
  res.send(`hello ${req.params.name}`);
});

app.get("/about", (req, res) => {
  res.send("hello about");
});

// next가 있어야 에러 미들웨어이다. 강조!!!!
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(200).send("에러났지롱..");
});

app.listen(3000, () => {
  console.log(`${app.get("port")}번 익스ㅡ프레스 서버 실행`);
});
