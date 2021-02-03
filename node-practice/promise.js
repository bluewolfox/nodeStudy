const abc = (params) => {
  return new Promise((resolve, reject) => {
    if (params) {
      resolve("하이")
    } else {
      reject("노노")
    }
  })
}

async function test() {
  try {
    const bc = await abc(0);
    console.log(bc)

  } catch (err) {
    console.error(err)

  }
}

test();