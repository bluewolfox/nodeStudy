var relationship1 = {
  name: "zero",
  friends: ["nero", "zero", "xero"],
  logFriends: function () {
    var that = this;
    this.friends.forEach(function (friend) {
      console.log(that.name, friend)
      console.log("this ", this)
    })
  }
}


function aa() {
  console.log(this)
}

const bb = () => {
  console.log(this)
}

console.log("aa")
aa()
console.log("bb")

bb();