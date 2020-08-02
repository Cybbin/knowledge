# 数据初始化

在构造函数中初始化内部数据

```js
export class Store {
  constructor() {
    const {
      plugins = [],
      strict = false
    } = options

    // store internal state
    this._committing = false
    this._actions = Object.create(null)
    this._actionSubscribers = []
    this._mutations = Object.create(null)
    this._wrappedGetters = Object.create(null)
    this._modules = new ModuleCollection(options) // 初始化 modules 结构树
    this._modulesNamespaceMap = Object.create(null)
    this._subscribers = []
    this._watcherVM = new Vue()
    this._makeLocalGettersCache = Object.create(null)
  }
}

```

## ModuleCollection

`ModuleCollection` 的主要作用是将用户传进来的 `modules` 构造为 `module` 对象。

主要格式化的函数为 `register`，将整个 `modules` 格式化为 `Module` 类型，包含 `_rawModule`、`_children`、`state` 等属性。循环递归调用 `register`，将每个模块都格式化为 `Module` 类型。

```js
export default class ModuleCollection {
  constructor (rawRootModule) {
    // register root module (Vuex.Store options)
    this.register([], rawRootModule, false)
  }

  // ...
  register (path, rawModule, runtime = true) {
    if (__DEV__) {
      assertRawModule(path, rawModule)
    }

    const newModule = new Module(rawModule, runtime) // 格式化 rawModule
    if (path.length === 0) { // 判断是否为根节点
      this.root = newModule // 根节点的 rawModule 赋值给 root
    } else {
      const parent = this.get(path.slice(0, -1)) // 获取当前节点的父节点
      parent.addChild(path[path.length - 1], newModule) // 父节点新增一个 children 为当前节点
    }

    // register nested modules
    if (rawModule.modules) { // 如果当前节点定义了 modules 属性，遍历所有子节点，递归格式化
      forEachValue(rawModule.modules, (rawChildModule, key) => {
        this.register(path.concat(key), rawChildModule, runtime)
      })
    }
  }

  get (path) { // 获取当前节点的父节点
    return path.reduce((module, key) => {
      return module.getChild(key)
    }, this.root)
  }
  // ...
}
```

`get` 函数的作用是获取 `path` 路径最后的元素的模块，比如下面结构
* 当格式化执行到 `a` 和 `b` 时，`get` 函数执行得到 `root` 模块；
* 格式化c时，`path` 因为前面 `slice(0,-1)` 截取掉了`c`，所以这里的 `path` 为`['b']`，`get` 函数执行得到 `b`的模块。


```js
 modules: {
   a: {
     modules: {}
   }
   b: {
     modules: {
       c:{}
     }
   }
 }
```