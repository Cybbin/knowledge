# computed

## 概念

特点:
1. 计算属性的结果会被缓存，除非依赖的属性发生变化，才会重新计算；
2. 适用于依赖多个属性时。

缓存的概念：
`computed` 的值在 `getter` 执行后是会缓存的，只有在它依赖的属性值改变之后，下一次获取 `computed` 的值时才会重新调用对应的 `getter` 来计算。


## 原理

### initComputed

初始化 `computed` 参数

1. 在 `initComputed` 中，循环遍历 `computed` 中的属性，属性中的 `get`，因为 `computed` 有两种写法，所以这里对函数和对象做了区分。
2. 将当前实例的 `computed` 的每一个属性通过 `watcher` 实例化，设置 `watcher` 的 `lazy`为 `true`，标识这是一个计算 `watcher`，并存放到 `vm._computedWatchers` 中。
3. 调用 `defineComputed`，重写属性中的 `getter` 函数。

```js
// 初始化属性函数
export function initState (vm: Component) {
  // ...
  if (opts.computed) initComputed(vm, opts.computed)
  // ...
}

// 计算 watcher 的配置
const computedWatcherOptions = { lazy: true }

// 初始化computed
function initComputed (vm: Component, computed: Object) {
  // $flow-disable-line
  const watchers = vm._computedWatchers = Object.create(null)

  // 循环遍历 computed
  for (const key in computed) {

    const userDef = computed[key]
    // 区分对象还是函数，获取 getter
    const getter = typeof userDef === 'function' ? userDef : userDef.get

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      )
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef)
    }
    // ...
  }
}
```

### defineComputed

1. `shouldCache` 为服务端渲染使用，此处忽略。
2. 实现 `createComputedGetter` 来重写 `getter` 函数。

```js
// 定义 computed
export function defineComputed (
  target: any,
  key: string,
  userDef: Object | Function
) {
  const shouldCache = !isServerRendering()
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef)
    sharedPropertyDefinition.set = noop
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop
    sharedPropertyDefinition.set = userDef.set || noop
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
```

### createComputedGetter

1. 在 `createComputedGetter` 中，通过 `_computedWatchers` 拿到在前面创建好的 `watcher`。
2. `dirty` 属性表示是否需要计算，如果为 `true`，不走缓存，则执行 `wathcer` 里的 `evaluate` 函数。
3. `evaluate` 函数的作用是执行 `get` 函数，赋值给 `watcher.value`，并将 `dirty` 设置为 `false`。
4. 如果 `dirty` 为 `false`，则代表已经计算过，下次访问时直接返回 `watcher.value`。
5. 当依赖项发生变化时，会执行依赖项 `dep` 里的 `notify`，通知当前计算 `watcher` 执行 `update`，此时将 `dirty` 设置为 `true`，所以下次访问当前计算属性时候，会重新执行 `evaluate` 计算。
6. 这就是 `computed` 缓存的原理。

```js
// 创建 computed 的 getter 函数
function createComputedGetter (key) {
  return function computedGetter () {
    const watcher = this._computedWatchers && this._computedWatchers[key]
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate()
      }
      if (Dep.target) {
        watcher.depend()
      }
      return watcher.value
    }
  }
}

// -------
// watcher.js 里的 evaluate
evaluate () {
  this.value = this.get()
  this.dirty = false
}
// watcher.js 里的 update
update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true
  } else if (this.sync) {
    this.run()
  } else {
    queueWatcher(this)
  }
}
// -------
```


### watcher.depend

在上面代码中，判断了当前 `Dep.target` 有无值，执行 `watcher.depend()`，作用是将当前 `watcher` 中的 `deps` 将**渲染** `watcher` 也收集起来。

1. `this.deps` 是怎么来的?
在前面执行 `get` 函数时，`Dep.target` 指向的是当前的计算 `watcher`，所有在 `get` 函数中依赖的属性就会将当前的计算 `watcher` 收集起来，当前的计算 `watcher` 也会通过 `deps` 将依赖的属性收集起来。（比如 `fullname = firstname + lastname`，此处的 `deps` 就等于 [`firstname`, `lastname`]）。

2. 为什么此处是收集渲染 `watcher` ?
`Dep` 中的 `targetStack` 保存着各个 watcher，在上面例子访问 `firstname` 的 `get` 时候，将计算 `watcher` 收集起来后，计算 `watcher` 就出栈了，剩下渲染 `watcher`，那么此时 `Dep.target`即指向渲染 `watcher`，所以此处是收集渲染 `watcher`。

```js
/**
  * Depend on all deps collected by this watcher.
  */
depend () {
  let i = this.deps.length
  while (i--) {
    this.deps[i].depend()
  }
}
```

以上就是 computed 的依赖收集的过程。
