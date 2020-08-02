# 插件

> [官方文档](https://vuex.vuejs.org/zh/guide/plugins.html)

## 使用方法

```js
import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

let store = new Vuex.Store({
  plugins: [
    createLogger()
  ]
})
```

## 常用插件

`vuex-persist` vue持久化存储插件，原理是将 `state` 存到本地缓存 `localStorage` 或 `sessionStorage`，当页面刷新时，会从本地缓存的 `state` 覆盖用户传入的 `state`。

## 原理

插件的原理为在构造函数中执行 `plugins` 里的所有函数。

```js
plugins.forEach(plugin => plugin(this))
```

在 `plugin` 函数里面需要调用 `store.subscribe` 通过发布订阅模式来收集方法（即每次调用 `mutation` 会执行这些方法）。

* 通过发布订阅模式将 `subscribe` 收集的函数放到数组 `_subscribers` 中；
* 在执行 `commit` 的时候，再将 `_subscribers` 批量执行。

``` js
this._subscribers = [] // 收集的数组

subscribe (fn, options) { // 大概是这样实现的，源码要绕一点，将订阅的 fn 收集到 _subscribers中
  this._subscribers.push(fn)
}

commit (_type, _payload, _options) {
  // ...
  this._withCommit(() => {
    entry.forEach(function commitIterator (handler) {
      handler(payload)
    })
  })

  this._subscribers
    .slice() // shallow copy to prevent iterator invalidation if subscriber synchronously calls unsubscribe
    .forEach(sub => sub(mutation, this.state))
  // ...  
}
```

