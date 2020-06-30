# Promise

> [Promise A+规范](https://promisesaplus.com)

1. `Promise` 接收的第一个参数为 `executor` 执行器，默认会立即执行；
```javascript
new Promise(function executor(resolve, reject) {
  console.log('executor now') // 会立即执行
})
```
2. `Promise` 一共有三个状态：`pending`、`fulfilled`、`rejected`，默认是 `pending` 状态，当调用 `resolve` 时会变成 `fulfilled` 状态，调用 `reject` 时会变成 `rejected` 状态。
3. `pending` 状态只能改变一次，要么变成 `fulfilled`，要么变成 `rejected`，后面两个状态无法相互转变。
4. 只要抛出错误，就变成 `rejected` 状态。
5. `new Promise()` 返回的实例有一个 `then` 方法，提供两个参数，分别是 `fulfilled` 对应的函数和 `rejected` 对应的函数，这两个函数支持传值。
6. 调用 `then` 时，如果当前状态为等待态（异步调用 `resolve` 或 `reject` 时会发生），需要将 `fulfilled` 和 `rejected` 的回调分别存放，当状态变化时，再以此执行对应状态的回调（发布-订阅模式）。
7. 同一个 `Promise` 支持链式多次调用 `then` 方法。
8. `then` 接收的成功和失败两个函数的返回值（普通值）会传入下一个 `then` 的成功函数中。
9. `then` 接收的成功和失败两个函数如果返回一个 `Promise`，会用这个 `Promise` 的状态来作为结果
10. `then` 抛出的异常或返回一个失败的 `Promise` 会传入最近的 `then` 中的失败函数。
11. `then` 的实现原理：返回一个新的 `Promise`
12. `then` 支持透传
13. `finally` 传入的函数，无论成功、失败都会执行。
14. `finally` 如果返回的是成功的 `promise`，会采用上一次的结果，如果返回的是失败的 `promise`，会用这个失败的结果传入下一个失败的函数。

```javascript

```