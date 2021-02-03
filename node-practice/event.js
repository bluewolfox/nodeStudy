const EventEmitter = require('events');

const myEvent = new EventEmitter();

myEvent.on("event1", () => {
  console.log('event1')
})
myEvent.on("event1", () => {
  console.log('event1-1')
})
const event2 = () => {
  console.log('변수 event2')
}
myEvent.on("event2", event2)

myEvent.removeListener('event2', event2);