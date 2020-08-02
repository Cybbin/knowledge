# Vue-Router 对象

## 构造函数

在构造函数中，定义了一些属性，其中 `matcher` 代表路由匹配器。

根据不同环境设置了当前路由使用的模式 `mode`，包括三种：`hash`、`history`、`abstract`（Node环境中使用）。

```js
constructor (options: RouterOptions = {}) {
  this.app = null // Vue 根实例
  this.apps = [] // 持有当前 router 的 Vue 实例
  this.options = options // 参数
  this.beforeHooks = [] // 钩子函数
  this.resolveHooks = [] // 钩子函数
  this.afterHooks = [] // 钩子函数
  this.matcher = createMatcher(options.routes || [], this) // 路由匹配器

  let mode = options.mode || 'hash'
  this.fallback =
    mode === 'history' && !supportsPushState && options.fallback !== false
  if (this.fallback) {
    mode = 'hash'
  }
  if (!inBrowser) {
    mode = 'abstract'
  }
  this.mode = mode

  switch (mode) {
    case 'history':
      this.history = new HTML5History(this, options.base)
      break
    case 'hash':
      this.history = new HashHistory(this, options.base, this.fallback)
      break
    case 'abstract':
      this.history = new AbstractHistory(this, options.base)
      break
    default:
      if (process.env.NODE_ENV !== 'production') {
        assert(false, `invalid mode: ${mode}`)
      }
  }
}
```

## init

在 `install` 函数执行时调用了 `init` 函数，主要逻辑为：

* 定义 `handleInitialScroll` 函数，主要功能是路由切换后将页面滑到顶部，就像重新加载页面一样。
* 定义 `setupListeners` 函数，该函数在路由切换后调用，执行 `history.setupListeners()` 和 `handleInitialScroll`；
* `app._route = route` 将 Vue 实例上的 _route设置为跳转后的路由路径。

```js
init (app: any /* Vue component instance */) {
  const history = this.history

  if (history instanceof HTML5History || history instanceof HashHistory) {
    const handleInitialScroll = routeOrError => {
      const from = history.current
      const expectScroll = this.options.scrollBehavior
      const supportsScroll = supportsPushState && expectScroll

      if (supportsScroll && 'fullPath' in routeOrError) {
        handleScroll(this, routeOrError, from, false)
      }
    }
    const setupListeners = routeOrError => {
      history.setupListeners()
      handleInitialScroll(routeOrError)
    }
    history.transitionTo(
      history.getCurrentLocation(), // 获取当前的路由路径
      setupListeners,
      setupListeners
    )
  }

  history.listen(route => {
    this.apps.forEach(app => {
      app._route = route // 将 Vue 实例上的 _route设置为跳转后的路由路径
    })
  })
}
```