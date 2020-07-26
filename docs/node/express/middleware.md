# Express 中间件

## 定义

> Middleware functions are functions that have access to the request object (req), the response object (res), and the next middleware function in the application’s request-response cycle. The next middleware function is commonly denoted by a variable named next.

中间件函数在请求的 `request-response` 周期内，能请求对象 `request` 、响应对象 `response` 和 `next` 函数，实现如下功能：
* 执行任何代码。
* 对请求和响应对象进行更改。
* 结束请求/响应循环。
* 调用堆栈中的下一个中间件函数（`next`）。

中间件包括以下类型：

1. 应用层中间件 
2. 路由层中间件
3. 错误处理中间件
4. 内置中间件
5. 第三方中间件

## 应用层中间件

使用 `app.use()` 和 `app.METHOD()`（`METHOD` 指代`HTTP`方法，如 `GET、POST` 等） 将应用层中间件绑定到 `express` 实例上。

```js
const express = require('express')
const app = express()

app.use('/user', (req,res,next) => {
  console.log('use')
  next()
})
app.get('/user', (req,res,next) => {
  console.log('get')
  next()
})

app.listen(3000)
```

特点（路由层中间件同理）：
1. `app.use` 只要路径开头匹配就执行，如上面例子请求 `/user/add`，将打印 `use`。
2. `app.METHOD` 需要路径且请求方法完全匹配才执行。

## 路由层中间件

与应用层中间件基本相同，差异之处在它绑定到 `express.Router()` 的实例上。

```js
const express = require('express')
const app = express()
const router = express.Router()

router.use('/user', (req,res,next) => {
  console.log('router use')
  next()
})

router.get('/user', (req,res,next) => {
  console.log('router get')
  next()
})

app.use(router)
app.listen(3000)
```

## 错误处理中间件

错误处理中间件必须提供`四个`变量，以此标识为错误处理中间件函数。以 `next` 

`next()` 传入的参数除了字符串 `route` 外，其他参数会认为出错，交由错误处理函数处理。若未显式定义错误处理函数，则函数集的末尾有express隐式包含的默认错误处理程序。

如交给错误处理中间件处理，会跳过中间定义的中间件，直接执行错误处理中间件。

```js
const express = require('express')
const app = express()

app.use('/user', (req,res,next) => {
  console.log('app use')
  next('custom error')
})

app.get('/user', (req,res,next) => {
  console.log('app get')
  next()
})

app.use(function (err, req, res, next) {
  console.log(err)
})

app.listen(3000)
```