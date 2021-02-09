const express = require("express");
const path = require("path");
const app = express();
const morgan = require('morgan');


// 전역 변수 느낌
app.set("port", process.env.PORT || 3000);

// 무슨 요청,응답을 받았는지 console에서 보여줌
// dev // combined
app.use(morgan("dev"))

app.get("/", (req, res, next) => {
  // send, sendFile, json, render 모두 응답 메서드
  res.sendFile(path.join(__dirname, "index.html"));
  // res.json({ hello: "abc" });
  // res.render();
  next("route"); // next("route")는 다음 같은 "/"주소를 찾는다
});

app.get("/category/:name", (req, res) => {
  res.send(`hello ${req.params.name}`);
});

app.get("/", (req, res) => {
  console.log("해이");
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
