# Vue.set

`Vue.set` 的作用是向响应式对象中添加一个响应式属性，且触发视图更新。

`Vue` 无法检测对象新增的属性，可以用 `Vue.set` 解决这个问题。

## 源码

1. 判断对象是否为数组，因为在 `Vue` 对 `splice` 做了函数劫持，所以使用数组的 `splice` 新增属性，并触发视图更新；
2. 如果是对象上已经定义过属性，则直接返回；
3. 如果对象是给 `Vue` 的实例，则直接返回，不能在 `Vue` 实例上新增响应式属性；
4. 如果对象不是响应式对象，则设置完值返回，因为对象不是响应式的，新增的属性也没必要设置响应式；
5. 最后调用 `defineReactive` 定义成响应式属性，手动触发视图更新。

文件位置：src\core\observer\index.js
```js
export function set (target: Array<any> | Object, key: any, val: any): any {
  // 数组的处理
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key)
    target.splice(key, 1, val)
    return val
  }
  // 已存在属性的处理
  if (key in target && !(key in Object.prototype)) {
    target[key] = val
    return val
  }
  // 不能在 Vue 实例上新增响应式属性
  const ob = target.__ob__
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    )
    return val
  }
  // 对象不是响应式对象
  if (!ob) {
    target[key] = val
    return val
  }
  // 定义成响应式属性
  defineReactive(ob.value, key, val)
  // 手动触发视图更新
  ob.dep.notify()
  return val
}
```