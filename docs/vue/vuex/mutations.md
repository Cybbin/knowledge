# commit & dispatch

## 函数劫持

在构造函数中，对 `commit` 和 `dispatch` 进行函数劫持，

1. 通过 `es6` 的解构赋值，获取当前对象的 `commit` 和 `dispatch` 并重写；
2. 我们在调用 `commit` 和 `dispatch` 的时候，实际上调用的是 `boundCommit` 和 `boundDispatch`;
3. 利用上一步发布订阅收集起来的 `entry`，`commit` 和 `dispatch` 只需传递 `payload` 参数即可，剩下的参数在`wrappedMutationHandler` 和 `wrappedActionHandler` 中劫持后传递。

```js
export class Store {
  constructor (options = {}) {
    // ...
    const { dispatch, commit } = this

    // ...
    this.dispatch = function boundDispatch (type, payload) {
      return dispatch.call(store, type, payload)
    }
    this.commit = function boundCommit (type, payload, options) {
      return commit.call(store, type, payload, options)
    }
    // ...
  }

  commit (_type, _payload, _options) {
    // ...
    this._withCommit(() => {
      entry.forEach(function commitIterator (handler) { // 执行 mutation
        handler(payload)
      })
    })
    // ...
  }

  dispatch (_type, _payload) {
    // ...
    const result = entry.length > 1
      ? Promise.all(entry.map(handler => handler(payload)))  // 执行 action
      : entry[0](payload)
    // ...
  }
}
```