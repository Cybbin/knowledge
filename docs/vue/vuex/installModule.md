# 安装 module

`module` 的安装执行 `installModule` 函数，此过程会将根模块的 `state`、`getters`、`mutations`、`actions` 都进行安装，并循环递归执行 `installModule`，将每个子模块都进行安装。

```js
  // init root module.
  // this also recursively registers all sub-modules
  // and collects all module getters inside this._wrappedGetters
  installModule(this, state, [], this._modules.root)

  function installModule (store, rootState, path, module, hot) {
    // ...
  }
```

## 安装 state

* 使用 `getNestedState` 根据 `path` 获取当前模块的父模块的 `state` 为 `parentState`；
* 拿到当前的模块名 `moduleName`；
* 因为安装的为新属性，这里使用 `Vue.set` 将父模块的 `state` 设置新属性`moduleName`，值为当前模块的 `state`。

```js
  // set state
  if (!isRoot && !hot) {
    const parentState = getNestedState(rootState, path.slice(0, -1))
    const moduleName = path[path.length - 1]
    store._withCommit(() => {
      Vue.set(parentState, moduleName, module.state)
    })
  }

  function getNestedState (state, path) {
    return path.reduce((state, key) => state[key], state)
  }
```

如以下结构，安装后的结果为：
* $store.state.a.text = a1
* $store.state.b.text = b1
* $store.state.b.c.text = c1

```js
 let modules = {
   a: {
     state: {
       text: 'a1'
     }
   },
   b: {
     state: {
       text: 'b1'
     },
     modules: {
      c:{
        state: {
          text: 'b1'
        }
      }
     }
   }
 }
```


## 命名空间

在后面 `getters`、`mutations`、`actions` 中，都使用到了命名空间 `namespaced`，其核心逻辑是通过解析 `path`，获取当前模块的 `namespace`。

```js
// src/store.js
const namespace = store._modules.getNamespace(path)

// src/module/module-collection.js
getNamespace (path) {
  let module = this.root
  return path.reduce((namespace, key) => {
    module = module.getChild(key)
    return namespace + (module.namespaced ? key + '/' : '')
  }, '')
}
```

## 安装 getters

* 循环执行 `registerGetter`，收集当前模块所有的 `getter`；
* 将 `getter` 收集到 `_wrappedGetters`中，并进行利用 `wrapperGetter` 函数劫持，这就是 `getter` 函数中四个参数的由来（`state`, `getters`, `rootState`, `rootGetters`）。

```js
module.forEachGetter((getter, key) => {
  const namespacedType = namespace + key
  registerGetter(store, namespacedType, getter, local)
})

function registerGetter (store, type, rawGetter, local) {
  // ...
  store._wrappedGetters[type] = function wrappedGetter (store) {
    return rawGetter(
      local.state, // local state
      local.getters, // local getters
      store.state, // root state
      store.getters // root getters
    )
  }
}
```

## 安装 mutations 

* 循环执行 `registerMutation`，收集当前模块所有的 `mutation`；
* 将收集的 `mutation` 放进 `stpre._mutations` 数组中，方便后续发布订阅时调用；
* 利用 `wrappedMutationHandler` 函数劫持，这就是 `mutation` 函数中第一参数为 `state`，第二参数为用户传参的原因；
* 利用 `call` 绑定`this`，这就是 `mutation` 函数中 `this` 指向 `store` 的原因。

```js
module.forEachMutation((mutation, key) => {
  const namespacedType = namespace + key
  registerMutation(store, namespacedType, mutation, local)
})

function registerMutation (store, type, handler, local) {
  const entry = store._mutations[type] || (store._mutations[type] = [])
  entry.push(function wrappedMutationHandler (payload) {
    handler.call(store, local.state, payload)
  })
}
```

## 安装 actions

* 循环执行 `registerAction`，收集当前模块所有的 `action`；
* 将收集的 `action` 放进 `stpre._actions` 数组中，方便后续发布订阅时调用；
* 利用 `wrappedActionHandler` 函数劫持，这就是 `action` 函数中第一个参数始终为包括 `dispatch`、`commit` 等属性的对象，第二个参数为用户传参的原因；
* 利用 `call` 绑定`this`，这就是 `action` 函数中 `this` 指向 `store` 的原因；
* 利用 `Promise.resolve(res)` 将 `action` 函数的返回结果封装为一个 `Promise`，所以在调用 `action` 后，可以调用 `then`。

```js
module.forEachAction((action, key) => {
  const type = action.root ? key : namespace + key
  const handler = action.handler || action
  registerAction(store, type, handler, local)
})

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
    if (!isPromise(res)) {
      res = Promise.resolve(res)
    }
    if (store._devtoolHook) {
      return res.catch(err => {
        store._devtoolHook.emit('vuex:error', err)
        throw err
      })
    } else {
      return res
    }
  })
}
```

## 递归循环安装

最后，循环 `module` 的子模块，递归安装。

```js
module.forEachChild((child, key) => {
  installModule(store, rootState, path.concat(key), child, hot)
})
```