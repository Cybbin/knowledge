# Vue.mixin

`Vue.mixin` 的作用是向全局混入一个对象，这个对象会影响之后所有创建的 `Vue` 实例。

## 使用

在全局混入一个 `beforeCreate` 函数，在之后创建的所有 Vue 实例的 `beforeCreate` 阶段  打印 `mixin beforeCreate`。

```js
Vue.mixin({
  beforeCreate(){
    console.log('mixin beforeCreate')
  }
})
```

## 源码

`mergeOptions` 的作用是合并两个选项的值。

```js
export function initMixin (Vue: GlobalAPI) {
  Vue.mixin = function (mixin: Object) {
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}
```