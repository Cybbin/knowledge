# Vuex 介绍

> [官方文档](https://vuex.vuejs.org/zh/)

## Vuex 是什么

Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。采用集中式存储管理应用的所有组件的状态，并以响应的规则保证状态以可预测的方式发生变化。


## Vuex 核心概念

Vuex的五个核心属性：state 、getter、mutation、action、module。

* state: 存储数据，该数据为响应式。
* getter: 计算属性，类似于(computed)。
* mutation: 同步操作，更改 state 的唯一方式是提交 mutation。
* action: 异步操作，通过提交 mutation 来改变状态，结果一个 Promise。
* module: 将 store 切分成模块，每个模块都具有 state 、getter、mutation、action 属性。

<img :src="$withBase('/assets/vue/vuex/vuex.png')"/>

## 为什么要用 Vuex

解决以下问题：

* 多个组件依赖同一个状态的时候，组件间的传参会非常繁琐。
* 不同组件需要变更同一个状态时，往往采用父子组件的直接饮用（$refs）或通过 `emit` 事件来变更同步状态的多份拷贝。

使用场景：

* 多个组件依赖统一状态时；
* 不同组件需要变更同一状态时。