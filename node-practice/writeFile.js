const fs = require("fs").promises;

fs.writeFile('./wirteme.txt', "글이 또 입력됨")
  .then(() => {
    return fs.readFile("./wirteme.txt")
  })
  .then((data) => console.log(data.toString()))
  .catch(err => console.error(err))