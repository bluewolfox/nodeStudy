const express = require('express');

const router = express.Router();

router.get("/:id", (req, res) => { //  /는 /user와 같다
  // /user/123?limit=5&skip=10
  console.log(req.params) // => {id:123}
  console.log(req.query) // => {limit:5, skip:10}
  res.send("Hello, This is about page...")
})

// 라우터 그룹화하기
// router.route("/abc")
// .get((req,res)=>{
//   res.send("GET")
// })
// .post((req,res)=>{
//   res.send("POST")
// })


module.exports = router;