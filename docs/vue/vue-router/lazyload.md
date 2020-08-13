# 路由懒加载

**为什么需要懒加载**

优化单页面应用加载性能，减少代码体积，较少加载用时。

结合 `Vue` 的异步组件和 `Webpack` 的代码分割功能。

## require

```js
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: resolve => require(['../views/About.vue'], resolve)
  }
]
```


## import

```js
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "views/about" */ '../views/About.vue')
  }
]
```

## require.ensure() 

```js
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: r => require.ensure([], () => r(require('../views/About.vue')), 'about')
  }
]
```