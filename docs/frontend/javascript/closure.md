# 闭包

> 当在函数内部定义了其他函数，就创建了闭包。闭包有权访问包含函数内部的所有变量。 --- 《JavaScript 高级程序设计》


## 应用场景
1. 封装变量

用闭包定义能访问私有函数和的私有变量公有函数。

### setTimeout 传参

``` js
  var foo = function (params) {
    return function () {
      console.log(params)
    }
  }
  var f1 = foo('f1')
  setTimeout(f1, 1000)
```

::: tip
用 bind 函数也可实现此功能，详见 ???
:::

### 闭包缓存

``` js
  var memorize = function () {
    var cache = {}
    return {
      set: function (key, value) {
        cache[key] = value
      },
      get: function (key) {
        return cache[key]
      }
    }
  }

  var a = memorize()

  a.set('num1',1)
  a.set('num2',2)

  console.log(a.get('num1'))
  console.log(a.get('num2'))
```

### 防抖、节流函数

详见 ???

## 缺点

函数中的变量保存在内存中，内存开销大，滥用闭包会造成页面性能问题。
* 解决办法：Chrome等有垃圾回收，IE导致内存泄露，在退出函数前，将不使用的局部变量全部删除。

