setImmediate(() => {
  console.log("setImmediate")
Promise.resolve().then(()=>console.log("promise1"));
})

process.nextTick(() => {
  console.log("nextTick")
})

setTimeout(() => {
  console.log("setTimeout")
}, 0)

Promise.resolve().then(()=>console.log("promise2"));

process.nextTick(() => {
  console.log("nextTick2")
})