# 操作符 new

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

---

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
