# 柯里化

作用：细化函数功能。

1. 逐步接收参数，并缓存供后期计算使用;
2. 不立即计算，延后执行;
3. 符合计算的条件，将缓存的参数，统一传递给执行方法

## 例子

实现一个`实现 add(1)(2, 3)(4)() = 10`的效果。

```javascript
function add (...args) {
  return args.reduce((sum, index) => sum+index)
}

let currying = (fn, arr = []) => {
  return (...args) => {
    let concatArgs = [...arr, ...args] // 拼接此轮和上轮的参数，arr:上轮参数，args:此轮参数

    if (args.length !== 0) { // 如果传入的参数个数不为 0，递归柯里化
      return currying(fn, concatArgs)
    } else { // 否则执行 add 函数
      return fn(...concatArgs)
    }
  }
}

let newAdd = currying(add)
newAdd(1)(2, 3)(4)() // 10
```
