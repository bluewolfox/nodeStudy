const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const nunjucks = require('nunjucks');

// 비밀키 환경변수 .env 사용하게해주는 모듈
const dotenv = require('dotenv');
dotenv.config();

const indexRouter = require("./routes");
const userRouter = require("./routes/user");
const app = express();
// 전역 변수 느낌
app.set('port', process.env.PORT || 3000)

app.set("view engine", "html"); // 넌적스는 html로 넘겨준다.
nunjucks.configure("views", { // app.set으로 하는게 아니라 configure로 세팅
  express: app,
  watch: true
})

// 무슨 요청,응답을 받았는지 console에서 보여줌
// dev // combined
app.use(morgan('dev'));

// 정적 파일 자동으로 보내줄때
// app.use("요청경로", express.static(path.join(__dirname, "실제경로폴더")));
app.use("/", express.static(path.join(__dirname, 'public')))

// bodyParser 역할
// 알아서 body parser 해주는 역할 !!!필수
app.use(express.json()); // 클라이언트에서 json 데이터로 보냈을때  body에 넣어놓은.
app.use(express.urlencoded({ extended: false })); // 클라이언트에서 form으로 보냈을때 자동으로 query를 펴준다. // true면 querystring
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false
  },
  name: "session-cookie"
}))

app.use("/", indexRouter)
app.use("/user", userRouter)

const multer = require('multer');
const fs = require('fs');

try {
  fs.readdirSync("uploads");
} catch (error) {
  console.error("uploads 폴더가 없어 uploads 폴더를 생성합니다.");
  fs.mkdirSync("uploads");
}

const upload = multer({
  // 업로드한 파일을 어디에 저장할까
  // 기본 diskStorage 하드디스크에 저장
  // 클라우드에 저장할수도있다.
  storage: multer.diskStorage({
    // 어디에 저장할지 destination 에서 정한다.
    destination(req, file, done) {
      done(null, "uploads/");
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      // 이름이 같으면 덮어 씌어지기때문에 실제 시간을 넣어준다.
      // done(에러, 파일경로)
      done(null, path.basename(file.originalname, ext) + Date.now() + ext)
    }
  }),
  // 파일 크기 제한
  // 5MB까지
  limits: { fileSize: 100 * 1024 * 1024 }
})

app.get("/upload", (req, res) => {
  res.sendFile(path.join(__dirname, "multipart.html"))
})

// upload.single('image')
// app.use("/upload", upload.single("image")); 특정 url일따 이렇게 써도됨.. 근데 비추
// 파일이 하나일때 upload.single, 여러개일때 upload.array, input이 여러개일때 upload.fields()
// app.post("/upload", upload.single('image'), (req, res) => {
//   app.post("/upload", upload.array('image'), (req, res) => {
//   app.post("/upload", upload.none(), (req, res) => { // form만 멀티파트일때 none()을 쓴다.
app.post("/upload", upload.fields([{ name: 'image1', limits: 5 }, { name: "image2" }, { name: "image3", limits: 10 }]), (req, res) => {
  console.log(req.file) // 하나일땐 req.file이라는 key에 있다.
  console.log(req.files) // 여러개일땐 req.files라는 key에 있다.
  console.log(req.files.image3) // input이 여러개일땐 req.files.[key]라는 key에 있다.
  console.log(req.body.title)
  res.send("ok");
})

app.get("/", (req, res, next) => {
  console.log("GET / 요청에서만 실행됩니다.");
  next();
}, (req, res) => {
  throw new Error("에러는 에러 처리 미들웨어로 갑니다.")
});


app.use((err, req, res, next) => {
  console.error(err);
  res.status(404).send(err.message);
})

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중")
})