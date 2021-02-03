const fs = require('fs').promises;
const http = require('http');

const server = http.createServer(async (req, res) => {
  try {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    const data = await fs.readFile("./server2.html");
    res.end(data);
  } catch (error) {
    console.error(error.message)
  }
})
  .listen(8080)

server.on("listening", () => {
  console.log(`포트 8080에서 서버 대기중입니다.`)
})

server.on("error", (error) => {
  console.error(error);
})