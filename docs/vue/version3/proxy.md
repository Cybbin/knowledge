# Proxy

## 介绍

> [Proxy MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

在 `Vue 2.x` 中，数据的响应式是通过 `Object.defineProperty` 的 `setter/getter` 对属性进行数据劫持。

不足：
1. 无法通过数组下标来观测变化，如 `arr[2]= 1` 这种写法不会被捕捉到；
2. 无法监测数组长度的变化，为此对数组的7个原生方法做了劫持，从而实现对数组的观测；
3. 对象的新增属性无法直接观测，只能通过 `Vue.set` 辅助方法达到观测目的。

在 `Vue 3` 中，基于 `Proxy` 对数据响应系统重写。


## 原理

### `Proxy` 代理只能代理到第一层，当代理的对象是多层嵌套的时候，怎么实现深度观测？

执行 `get` 为对象时，递归执行 `reactive`。否则直接返回。
