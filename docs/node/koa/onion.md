# 洋葱模型

## 概念
可以理解为中间件的一种串行行机制，并且支持异步。

## compose 的实现

### 准备工作
使用 `app` 代替 `Koa` 实例，`hanlders` 为管理中间件的数组，每次 `use` 都会向数组里添加对应的执行方法。
案例中忽略 `ctx` 参数，只关注 `next` 参数。

```js

const handlers = []

function use (fn) {
  handlers.push(fn)
}

```

准备测试用例：

```js
// 异步函数，用来测试异步实现
function fn() {
  return new Promise((resolve, reject)  => {
    setTimeout(()=> {
      console.log("hello");
      resolve()
    }, 3000)
  })
}

//第一个中间件
use(async (next) => {
  console.log(1)
  await next()
  console.log(2)
})

//第二个中间件
use(async (next) => {
  console.log(3)
  await next()
  console.log(4)
})

//第三个中间件
use(async (next) => {
  console.log(5)
  await fn() // 异步实现时调用，会在此卡3秒后再往下执行
  await next()
  console.log(6)
})

// 测试执行compose函数即可，在下面实现
compose()
```

### 同步实现

```js
function compose () {
  // 递归调用
  function dispatch (index) {
    // 如果所有中间件都执行完，则跳出
    if (index === handlers.length) return

    // 拿到当前执行的中间件
    const middleware = handlers[index]

    // 将下一个中间件的 dispatch 函数作为参数 next 传入当前中间件
    const next = function() {
      dispatch(index + 1)
    }
    // 执行当前中间件
    return middleware(next)
  }

  // 从第0个开始执行
  dispatch(0)
}
```

输出结果：`1 3 5 6 4 2`。

### 异步实现

```js
function compose () {
  // 递归调用
  function dispatch (index) {
    // 如果所有中间件都执行完，则跳出
    if (index === handlers.length) return Promise.resolve()

    // 拿到当前执行的中间件
    const middleware = handlers[index]

    // 将下一个中间件的 dispatch 函数作为参数 next 传入当前中间件
    const next = function() {
      dispatch(index + 1)
    }
    // 执行当前中间件
    return Promise.resolve(middleware(next))
  }

  // 从第0个开始执行
  dispatch(0)
}
```

输出结果：`1 3 5`，卡3秒，再输出 `6 4 2`。