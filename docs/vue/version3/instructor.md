# Vue 3.0 介绍

## Composition API

> [文档](https://vue-composition-api-rfc.netlify.app/zh/api.html)

`Composition API` 的核心入口点是 `setup` 函数。

调用时机： 创建组件实例，初始化 `props`，调用 `setup` 函数，再调用 `beforeCreate`...

## Proxy

用 `Proxy` 取代 `Object.defineProperty` 数据劫持。

## Performance

性能更好：
1. 虚拟 `DOM` 重写（跳过静态节点，值处理动态节点）。
2. `update` 性能更快。
3. `SSR` 速度更快。

## TypeScript

更好的 TypeScript 支持。

## Tree-shaking

全局 `API Tree-shaking`，基于函数的 `API` 每一个模块都可以被单独引入，没有被使用的 `API` 在最终打包时会被移除。

## Fragment：不再限于模版的单个根节点

模版里不再需要放到一个单一的 `DOM` 里。

现在可以这样写模版：
```js
<template>
  <div>Hello</div>
  <div>World</div>
</template>
```

## \<Teleport>：传送门

## \<Suspense>

开箱即用的异步组件，通过变量来控制加载。

```js
<Suspense v-if="loadAsync">
  <template #default>
    <AsyncComponent></AsyncComponent>
  </template>
  <template #fallback>
    <div class="loading"></div>
  </template>
</Suspense>
```
