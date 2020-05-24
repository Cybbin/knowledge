# 闭包

> 当在函数内部定义了其他函数，就创建了闭包。闭包有权访问包含函数内部的所有变量。 --- 《JavaScript 高级程序设计》


## Demo

``` js
var closure = function () {
  var number = 1
  
  return function () {
    return number
  }
}

var a = closure()

console.log(a())
```

## 闭包缓存

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
