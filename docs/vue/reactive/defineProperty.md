# 响应式原理

## 核心

1. `Object.defineProperty()`
2. `Vue` 在初始化数据时，会给 `data` 中的属性使用 `defineProperty` ，进行**依赖收集**（收集当前组件的 `watcher`），如果属性变化时（`setter`）会通知相关依赖进行更新操作（`dep.notify()`）。

## 原理

<img :src="$withBase('/assets/vue/start/defineProperty.jpg')"/>
