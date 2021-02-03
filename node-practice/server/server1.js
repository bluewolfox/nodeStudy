const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" }); // content-type : text/html은 브라우저가 이 html이 뭔지 알게하기위함이고 한글을 쓰려면 utf-8을 써야한다.
  res.write("<h1>Hello node</h1>")
  res.write("<p>Hello server</p>")
  res.end("<p>Hello kws</p>")
})
  .listen(80)

server.on("listening", () => {
  console.log("8080번 포트에서 서버 대기 중입니다.")
})

server.on("error", (error) => {
  console.error(error)
})