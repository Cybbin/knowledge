# commit & dispatch

## 发布订阅

1. 在 `Store` 的构造函数中，使用了发布订阅模式，先将 `mutations` 和 `actions` 收集起来；
2. 使用 `call` 绑定 `this`，这就是为什么在 `mutations` 和 `actions` 函数中的 `this` 指向当前 `store` ；
3. 在 `mutations` 中的函数的第一个参数始终为 `state`，在 `actions` 的第一个参数始终为包括 `dispatch`、`commit` 等属性的对象也是在这里定义。

```js
constructor () {
  // ...
  this._actions = Object.create(null)
  this._mutations = Object.create(null)
  // ...
  registerMutation()
  registerAction()
  // ...
}

// 收集 mutation
function registerMutation (store, type, handler, local) {
  const entry = store._mutations[type] || (store._mutations[type] = [])
  entry.push(function wrappedMutationHandler (payload) {
    handler.call(store, local.state, payload)
  })
}

// 收集 action
function registerAction (store, type, handler, local) {
  const entry = store._actions[type] || (store._actions[type] = [])
  entry.push(function wrappedActionHandler (payload) {
    let res = handler.call(store, {
      dispatch: local.dispatch,
      commit: local.commit,
      getters: local.getters,
      state: local.state,
      rootGetters: store.getters,
      rootState: store.state
    }, payload)
  })
  // ...
}
```

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