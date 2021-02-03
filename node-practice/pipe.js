const fs = require('fs');
const zlib = require('zlib');

const readStream = fs.createReadStream("./readme3.txt", { highWaterMark: 16 });
const zlibStream = zlib.createGzip();
const writeStream = fs.createWriteStream("./writeme5.txt");
readStream.pipe(zlibStream).pipe(writeStream)