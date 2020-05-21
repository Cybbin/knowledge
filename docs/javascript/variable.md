# 变量

## 变量类型
1. 基础类型（值类型）
    * Boolean
    * String
    * Number
    * undefined
    * null
    * Symbol (ES6)
    * BigInt (ES10)
2. 引用类型
    * Object

**for...in、for...in 区别**
1. `for...in`
    * 用来遍历对象及其原型链上带有字符串 key 的属性;
    * 遍历数组时，除了遍历元素外，还会遍历数组对象的自定义属性，故不推荐在数组中使用 `for...in`
2. `for...of`
    * ES6引入循环遍历语法；
    * 遍历的输出结果对应为 value;
    * 支持数组遍历，类数组对象（DOM NodeList），字符串，Map、Set对象;
    * 不支持遍历普通对象;

```
/* for...in */
Array.prototype.test = 'test'
var a = ['one', 'two']
for (var i in a) {
  console.log(i)
}
// 0 1 test

/* for...of */
var b = [1,2]
for (var j of b) {
  console.log(j)
}
// 1 2
```

## 变量存储

### 存储方式
1. 基础类型：保存在栈内存中；
2. 引用类型：保存一个指针在栈内存中，这个指针指向的对象保存在堆内存中。

### 读取（赋值）方式
1. 基础类型：按值访问，读取（赋值）栈中实际保存的值；
2. 引用类型：按引用反问，先从栈中读取堆内存的指针，然后读取（赋值）保存在堆内存中的值。
