# Vuex 使用逻辑

使用时，引入一个 `vuex`，并使用 `Vue.use(Vuex)`，注入到 `Vue` 中，导出 `Vuex.Store` 的一个实例，代码如下：

```js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex) // 执行 Vuex 的 install 方法

export default new Vuex.Store({ // 导出 Vuex.Store 的一个实例
  state:{},
  getters:{},
  mutations: {},
  actions: {}
})
```

## Vue.use
在 `Vue` 中，使用 `Vue.use`，默认会执行当前插件的 `install` 方法，并将 `Vue` 作为参数传入 `install` 方法中。

## install

在 `install` 方法中，主要是执行 `applyMixin` 函数，将 `store` 属性注入到当起组件和子组件中。

1. 调用 `Vue.mixin`,在 `beforeCreate` 钩子中执行 `vuexInit`，将此功能通过 `mixin` 混入到每一个 `Vue` 实例中；
2. 利用 `Vue` 组件创建过程是先父后子，即先调用父组件的 `beforeCreate`，再调用子组件的 `beforeCreate`；
3. 在 `vuexInit` 方法中，先判断当前组件有无 `store` 属性（这个组件为根组件），有则将根组件的 `$store` 属性赋值为传入 `options` 的 `store`；
4. 如果当前组件无 `store` 属性，则代表当前组件为子组件，子组件的 `$store` 属性则赋值为父组件的 `$store` 属性即可。

```js
function install (_Vue) {
  if (Vue && _Vue === Vue) {
    return
  }
  Vue = _Vue;
  applyMixin(Vue);
}

function applyMixin (Vue) {
  // 省略代码
  Vue.mixin({ beforeCreate: vuexInit });
  // 省略代码

  function vuexInit () {
    var options = this.$options;
    // store injection
    if (options.store) { // 根实例
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store;
    } else if (options.parent && options.parent.$store) { // 子组件
      this.$store = options.parent.$store;
    }
  }
}
```

## state 响应式

为了让用户传进来的 `state` 具有双向绑定属性，在初始化的时候使用 `new Vue()`对 `state` 进行双向绑定处理。

```js
export class Store {
  constructor(options = {}){
    // ...
    resetStoreVM(this, state)
    // ...
  }
}

function resetStoreVM (store, state, hot) {
  // ...
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed
  })
  //...
}
```