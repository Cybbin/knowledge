# await & async

`async` 函数返回一个 `promise`

```javascript

function print1 () {
  return new Promise((resolve, reject) => {
    console.log('start 1')
    setTimeout(()=> {
      resolve(1)
    }, 1000)
  })
}

function print2 () {
  return new Promise((resolve, reject) => {
    console.log('start 2')
    setTimeout(()=> {
      resolve(2)
    }, 1000)
  })
}

async function asyncPrint () {
  let a = await print1()
  let b = await print2()
  console.log(a,b)
}

asyncPrint()
```