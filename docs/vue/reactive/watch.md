# watch

## 概念

Vue 中一个自定义的侦听器，用于监听某个属性的变化，从而执行复杂业务逻辑。

## 原理

### initWatch

初始化 `watch` 参数

1. 在 `initWatch` 中，循环遍历 `watch` 中的属性，执行 `createWatcher`；
2. 在 `createWatcher` 中，对数据做了下处理，调用 `vue.$watch` 实现对属性的监听。

```js
export function initState (vm: Component) {
  // ...
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch)
  }
}
// ...

function initWatch (vm: Component, watch: Object) {
  for (const key in watch) {
    const handler = watch[key]
    if (Array.isArray(handler)) {
      for (let i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i])
      }
    } else {
      createWatcher(vm, key, handler)
    }
  }
}
// ...
function createWatcher (
  vm: Component,
  expOrFn: string | Function,
  handler: any,
  options?: Object
) {
  if (isPlainObject(handler)) {
    options = handler
    handler = handler.handler
  }
  if (typeof handler === 'string') {
    handler = vm[handler]
  }
  return vm.$watch(expOrFn, handler, options)
}
```

### vue.$watch

1. 创建一个用户 `wathcer`，标志符为 `user=true`，
2. 如果 `immediate` 为 `true`，则直接执行用户自定义的 `handler`（`cb`）；

```js
Vue.prototype.$watch = function (
  expOrFn: string | Function,
  cb: any,
  options?: Object
): Function {
  const vm: Component = this
  if (isPlainObject(cb)) {
    return createWatcher(vm, expOrFn, cb, options)
  }
  options = options || {}
  options.user = true
  const watcher = new Watcher(vm, expOrFn, cb, options)
  if (options.immediate) {
    try {
      cb.call(vm, watcher.value)
    } catch (error) {
      handleError(error, vm, `callback for immediate watcher "${watcher.expression}"`)
    }
  }
  return function unwatchFn () {
    watcher.teardown()
  }
}
```

### watcher.run

1. 执行 `get` 函数，在用户 `wathcer` 中，`get` 方法为取当前监听的属性的值。
2. 如果为用户 `watcher`，则执行`cb`，此处 `cb` 就是用户自定义的 `handler`。

```js
run () {
  if (this.active) {
    const value = this.get()
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      const oldValue = this.value
      this.value = value
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue)
        } catch (e) {
          handleError(e, this.vm, `callback for watcher "${this.expression}"`)
        }
      } else {
        this.cb.call(this.vm, value, oldValue)
      }
    }
  }
}
```