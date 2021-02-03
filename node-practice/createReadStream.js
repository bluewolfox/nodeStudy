const fs = require('fs');
const readStream = fs.createReadStream("./readme3.txt", { highWaterMark: 16 });

const data = []
readStream.on("data", (chunk) => {
  data.push(chunk);
  console.log("data", chunk, chunk.length)
  // 콘솔로그로 찍어보면 한번에 다 읽어진다. 왜이럴까? => createReadStream이 한번에 버퍼 조각이 64kb인데 한번에 읽어버릴 수 밖에 없다.
})

readStream.on('end', () => {
  console.log("end: ", Buffer.concat(data).toString());
})

readStream.on("error", () => {
  console.log("error: ", error)
})