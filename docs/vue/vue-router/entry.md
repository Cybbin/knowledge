# Vue-Router 使用逻辑

使用时，引入一个 `vue-router`，并使用 `Vue.use(Vuex)`，注入到 `Vue` 中，导出 `VueRouter` 的一个实例，代码如下：

```js
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  }
]

const router = new VueRouter({
  routes
})

export default router
```

## Vue.use
在 `Vue` 中，使用 `Vue.use`，默认会执行当前插件的 `install` 方法，并将 `Vue` 作为参数传入 `install` 方法中。

## install

利用 Vue.mixin 将 beforeCreate 和 destroyed 钩子函数注入到每一个组件中

在 `beforeCreate` 钩子函数中：
1. 将 `_router ` （当前 `VueRouter` 的实例），注入到当前组件中，并掉用当前 `VueRouter` 实例的 `init` 方法进行初始化，
2. 再调用 `Vue.util.defineReactive` ，将 `_route` 属性指向 `this._router.history.current` 并变成响应式对象，代表当前的路由路径，即如果当前路由路径一旦发生变化，`_route` 就会发生改变；
3. 将 `_routerRoot` （当前 `Vue` 的实例）注入到当前组件和每一个子组件中。

给Vue的原型定义了 `$router` 和 `$route` 两个属性的 `get`，这就是为什么能够在组件的实例上访问 `this.$router` 和 `this.$route`。

接着利用 `Vue.component` 在全局定义了两个组件：`router-view` 和 `router-link`。

最后定义了路由中钩子 函数的合并策略

```js
// src/install.js
export function install (Vue) {
  // ...
  _Vue = Vue

  const isDef = v => v !== undefined

  const registerInstance = (vm, callVal) => {
    let i = vm.$options._parentVnode
    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
      i(vm, callVal)
    }
  }
  

  // 往全局 vue 注入 beforeCreate 、destroyed
  Vue.mixin({
    beforeCreate () {
      if (isDef(this.$options.router)) {
        this._routerRoot = this
        this._router = this.$options.router
        this._router.init(this)
        Vue.util.defineReactive(this, '_route', this._router.history.current)
      } else {
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
      }
      registerInstance(this, this)
    },
    destroyed () {
      registerInstance(this)
    }
  })

  // 定义 $router 、 $route 属性
  Object.defineProperty(Vue.prototype, '$router', {
    get () { return this._routerRoot._router }
  })
  Object.defineProperty(Vue.prototype, '$route', {
    get () { return this._routerRoot._route }
  })

  // 定义 RouterView 、 RouterLink 组件
  Vue.component('RouterView', View)
  Vue.component('RouterLink', Link)

  // 定义路由钩子的合并策略
  const strats = Vue.config.optionMergeStrategies
  // use the same hook merging strategy for route hooks
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created
}
```