const exec = require('child_process').exec;

var process = exec("dir"); // dir 은 현재폴더의 파일들을 가져온다

process.stdout.on("data", function (data) {
  console.log(data.toString());
})



process.stderr.on("data", function (data) {
  console.error(data.toString());
})

