# 导航守卫

路由路径切换时，执行的一系列钩子函数叫导航守卫（导航钩子）

## 有哪几种导航守卫

### 全局前置守卫

`router.beforeEach`：路由跳转前触发。

### 全局解析守卫

`router.beforeResolve`：与 `beforeEach` 类似，也是在路由跳转前触发。

> 在导航被确认之前，同时在所有组件内守卫和异步路由组件被解析之后，解析守卫就被调用。

### 全局后置守卫

`router.afterEach`：路由跳转后触发。

### 路由独享守卫

`router.beforeEnter`：路由跳转前， `beforeEach` 后执行。

### 组件内的守卫

`router.beforeRouteEnter`：在渲染该组件的对应路由被 confirm 前调用。

`router.beforeRouteUpdate`：在当前路由改变，但是该组件被复用时调用。

`router.beforeRouteLeave`：导航离开该组件的对应路由时调用。

### 完整的导航解析流程

1. 导航被触发。
2. 在失活的组件内调用 `beforeRouteLeave` 。
3. 调用全局的 `beforeEach`。
4. 在复用的组件里调用 `beforeRouteUpdate`。
5. 在路由配置里调用 `beforeEnter`。
6. 调用全局的 `beforeResolve`。
7. 导航被确认。
8. 调用全局的 `afterEach`。
9. 触发 DOM 更新。
10. 调用 `beforeRouteEnter`。


## 实现原理

异步函数队列化执行模式，发布订阅结合函数劫持。

1. 发布订阅模式先注册一个钩子函数的收集中心（此处举例钩子 `beforeEach`）。
2. 发布收集钩子事件 `beforeEach`，订阅时就存进收集中心。
3. 路由路径切换时，会执行 `runQueue` 函数，异步函数队列化执行`beforeEachs` 收集起来的函数;
4. 利用函数劫持，在 `iterator` 函数里将 `from` 和 `to` 传进收集起来的函数中执行。

```js
// 发布订阅注册一个钩子收集中心
let beforeEachs = []

// 发布钩子
function beforeEach(fn) {
  beforeEachs.push(fn)
}

// 订阅钩子
beforeEach((from, to, next)=> {
  console.log(1)
  next()
})
beforeEach((from, to, next)=> {
  console.log(2)
  next()
})
beforeEach((from, to, next)=> {
  console.log(3)
  next()
})

// 异步函数队列化执行
function runQueue(queue, iterator, callback) {
  const step = index => {
    if(index >= queue.length) return callback()
    iterator(queue[index], () => step(index + 1))
  }
  step(0)
}

// 函数劫持，from 代表失活组件， to 代表激活组件
function iterator (hook, next) {
  console.log('---')
  hook('from', 'to', next)
}

// 切换路由时触发 beforeEach 函数挨个执行
runQueue(beforeEachs, iterator, ()=> {
  console.log('update')
})
```