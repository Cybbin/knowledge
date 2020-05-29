# 手撸代码

## new
> `new` 运算符创建一个用户定义的对象类型的实例或具有构造函数的内置对象的实例。 --- 《MDN web docs》

``` js
  function Person (name, age) {
    this.name = name
    this.age = age

    return {
      height: 100
    }
  }

  var p1 = new Person('p1', 10) // Person {name:"p1", age:10}
```

new 关键字会进行如下的操作：
1. 创建一个空对象；
2. 将对象的 __proto__ 指向构造函数的 prototype；
3. 调用构造函数，指定 this；
4. 如果构造函数返回对象，则直接返回，否则返回当前创建的对象。

``` js
  // 手动实现 new
  function myNew () {
    var constructor = Array.prototype.shift.call(arguments)

    // 1. 创建一个空对象
    var obj = {}

    // 2. 将对象的 __proto__ 指向构造函数的 prototype
    obj.__proto__ = constructor.prototype

    // 3. 调用构造函数，指定 this
    var result = constructor.apply(obj, arguments)

    // 4. 如果构造函数返回对象，则直接返回，否则返回当前创建的对象
    return typeof result === 'object' ? result : obj
  }

  var p2 = myNew(Person, 'p2', 20)
```

## 防抖
触发事件后的n秒内，如果再次触发事件，就会重新计算时间，只有在n秒不再触发事件，n秒后执行事件。

``` js
  // 防抖
  function debounce (fn, delay) {
    var timer = null

    return function (...args) {
      clearTimeout(timer)
      timer = setTimeout(function () {
        fn.apply(this, args)
      }, delay)
    }
  }

  var debounceResize = debounce(function (text) {
    console.log(`resize: ${window.innerWidth} * ${window.innerHeight} + ${text}`)
  }, 200)

  window.addEventListener('resize', debounceResize.bind(this, 'debounce'), false)
```

## 节流
不管事件的触发频率有多高，单位时间内只执行一次。

``` js
  // 节流
  function throttle (fn, delay) {
    var timer = null

    return function (...args) {
      if (!timer) {
        fn.apply(this, args)
        timer = setTimeout(function () {
          timer = null
        }, delay)
      }
    }
  }

  var throttleResize = throttle(function (text) {
    console.log(`reisze: ${window.innerWidth} * ${window.innerHeight} + ${text}`)
  }, 1000)

  window.addEventListener('resize', throttleResize.bind(this, 'throttle'), false)
```

## promise

``` js
  class myPromise {
    constructor (handle) {
      if (typeof handle !== 'function') {
        throw new TypeError('Promise resolver #<Object> is not a function')
      }

      this.id = id++

      // 初始化状态为 pending
      this._status = PENDING
      // 初始化值
      this._value = undefined

      // 添加成功回调函数队列
      this._fulfilledQueue = []
      // 添加失败回调函数队列
      this._rejectedQueue = []

      // 执行 handle
      try {
        handle(this._resolve.bind(this), this._reject.bind(this))
      } catch (err) {
        this._reject(err)
      }
    }

    _resolve (value) {
      // 如果不处于 pending 状态，直接返回
      if (this._status !== PENDING) return

      const run  = () => {
        // 执行了 resolve，状态变为 fulfilled
        this._status = FULFILLED
        // 改变当前 promise 的值
        this._value = value
        let cb
        while (cb = this._fulfilledQueue.shift()) {
          cb(value)
        }
      }

      setTimeout(run, 0)
    }

    _reject (err) {
      // 如果不处于 pending 状态，直接返回
      if (this._status !== PENDING) return

      const run = () => {
        // 执行了 reject，状态变为 rejected
        this._status = REJECTED
        // 改变当前 promise 的值
        this._value = err
        let cb
        while (cb = this._rejectedQueue.shift()) {
          cb(err)
        }
      }

      setTimeout(run, 0)
    }

    then (onFulfilled, onRejected) {
      const { _value, _status } = this

      // 返回一个新的 Promise 对象
      return new myPromise((onFulfilledNext, onRejectedNext) => {
        // 封装 fulfilled 函数
        let fulfilled = function (value) {
          try {
            // 如果当前回调函数 onFulfilled 不是一个函数，当前的 Promise 对象状态变为 fulfilled，并执行下一个 then
            if (typeof onFulfilled !== 'function') {
              onFulfilledNext(value)
            } else {
              var res = onFulfilled(value)
              // 如果当前回调函数 onFulfilled 返回是 Promise 实例，需要等到 onFulfilled 状态改变后再执行下一个回调
              if (res instanceof myPromise) {
                res.then(onFulfilledNext, onRejectedNext)
              } else {
                // 否则当前的 Promise 对象状态变为 fulfilled，将返回值作为参数传入下一个 then，并执行下一个 then
                onFulfilledNext(res)
              }
            }
          } catch (error) {
            // 如果报错，当前的 Promise 对象状态变为 rejected
            onRejectedNext(error)
          }
        }

        // 封装 rejected 函数
        let rejected = function (err) {
          try {
            if (typeof onRejected !== 'function') {
              onRejectedNext(err)
            } else {
              var res = onRejected(err)
              if (res instanceof myPromise) {
                res.then(onFulfilledNext, onRejectedNext)
              } else {
                onRejectedNext(res)
              }
            }
          } catch (error) {
            onRejectedNext(error)
          }
        }

        switch (_status) {
          // 状态为 pending 时，将 onFulfilled 和 onRejected 加入执行队列里等待执行
          case PENDING:
            this._fulfilledQueue.push(fulfilled)
            this._rejectedQueue.push(rejected)
            break
          // 状态为 fulfilled 时，直接执行 onFulfilled
          case FULFILLED:
            fulfilled(_value)
            break
          // 状态为 rejected 时，直接执行 onRejected
          case REJECTED:
            rejected(_value)
            break
        }
      })
    }

    catch (onRejected) {
      return this.then(undefined, onRejected)
    }
  }
```

## bind

### 第一阶段：基本实现

``` js
  Function.prototype.myBind = function (context, ...args) {
    var self = this
    return function () {
      self.apply(context, args) // 柯里化
    }
  }

  var obj = {
    a: 2
  }

  function foo (...args) {
    console.log(`${this.a} - ${args}`)
  }

  foo.myBind(obj, 1,2,3)()
```

### 第二阶段：柯里化

`bind()` 可以在绑定时给原函数传递参数，绑定之后的函数执行时还可以再次传递参数。

``` js
  Function.prototype.myBind = function (context, ...args) {
    var self = this
    return function (...args2) {
      self.apply(context, args.concat(args2)) // 柯里化
    }
  }

  var obj = {
    a: 2
  }

  function foo (...args) {
    console.log(`${this.a} - ${args}`)
  }

  foo.myBind(obj, 1,2,3)(4,5,6)
```

### 第三阶段：构造函数

一个函数执行 `bind()` 后，如果使用 `new` 调用，即当作构造函数
* `bind()` 传入的上下文 `context` 会失效
* 两次传入的参数 `ars` 仍有效

``` js
  Function.prototype.myBind = function (context, ...args) {
    if (typeof this !== 'function') {
      return
    }

    var self = this
    var fBound = function (...args2) {
      // 如果 this 是 fBound 这个函数的实例，说明 fBound 作为构造函数被调用了
      var curContext = this instanceof fBound ? this : context

      return self.apply(curContext, args.concat(args2)) // 柯里化
    }
    return fBound
  }

  var obj = {
    a: 2
  }

  function foo (...args) {
    console.log(this)
    console.log(`${args}`)
  }

  var Foo2 = foo.myBind(obj, 1,2,3)

  Foo2(4,5,6) //  普通调用
  new Foo2(4,5,6) // 构造函数调用
```

### 第四阶段：继承

需要把 `bind` 前的函数的原型挂载到 `bind` 后函数的原型上，因为对象是引用类型，用 `new` 操作符做一层中转。

``` js
  Function.prototype.myBind = function (context, ...args) {
    if (typeof this !== 'function') {
      return
    }

    var self = this
    var fBound = function (...args2) {
      // 如果 this 是 fBound 这个函数的实例，说明 fBound 作为构造函数被调用了
      console.log(this instanceof fBound)
      console.log(this instanceof func)

      var curContext = this instanceof fBound ? this : context

      return self.apply(curContext, args.concat(args2)) // 柯里化
    }

    var func = function () {}
    // 将 this 原型挂载到 func 原型上
    func.prototype = this.prototype
    // 为了修改 fBound 的原型影响到 this 的原型，通过 new 操作符做一层中转
    fBound.prototype = new func()
    return fBound
  }
```

## instanceof

instanceof可以检测某个对象是不是另一个对象的实例。

``` js
  function myInstanceOf (target, origin) {
    if (!origin) {
      throw new TypeError('Right-hand side of \'instanceof\' is not an object')
    }
    while (target) {
      if (target.__proto__ === origin.prototype) {
        return true
      } else {
        target = target.__proto__
      }
    }
    return false
  }
```

## 浅拷贝

## 深拷贝

在浅拷贝的基础上，加上引用类型的判断，因为用 `for...in`遍历数组，会把 Array.prototype 上的属性给遍历出来，这里用 `for...of` 数组的优化。

``` js
  function deepClone (obj) {
    if (typeof obj === 'object') {
      var isArray = Array.isArray(obj)
      var ret = isArray ? [] : {}
      if (isArray) {
        for (var [key,value] of obj.entries()) {
          if (typeof value === 'object') {
            ret[key] = deepClone(value)
          } else {
            ret[key] = value
          }
        }
      } else {
        for (var key in obj) {
          if (typeof obj[key] === 'object') {
            ret[key] = deepClone(obj[key])
          } else {
            ret[key] = obj[key]
          }
        }
      }
      return ret
    } else {
      return obj
    }
  }

  var o1 = {
    a: 1,
    list: [1,2,3],
    b: {
      c:2
    }
  }

  var o2 = deepClone(o1)
```

## 函数柯里化

## 单例模式

## es5 继承

## Ajax

