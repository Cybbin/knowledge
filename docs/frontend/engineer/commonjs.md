# commonjs

实现原理：通过函数来隔离作用域，（将 `module.exports` 返回给当前内容）

## 源码分析

以加载 `a.js` 分析 `require` 源码：

1. `makeRequireFunction` 创建一个 `require` 函数，该 `require` 函数由 `mod.require(path)` 返回；
2. `mod` 是 `Module` 类的一个实例，在 `Module.prototype.require` 实现了 `require` 的逻辑；
3. 通过 `Module._load` 静态方法**开始加载**；
4. 通过 `Module._resolveFilename` 解析 `a.js` 的绝对路径；
5. 判断有无缓存，有缓存，则直接返回缓存数据，没有继续加载；
6. 查看是否为原生模块（如 `fs` 等）,如果是则返回该原生模块，不是继续加载；
7. `new Module()` 创建该模块，`id` 为第 4 步加载的路径，初始化 `exports = {}` 为导出的结果；
8. 缓存该模块，方便下次使用直接用缓存；
9. 根据文件的后缀，通过 `Module._extensions` 调用对应后缀的解析规则；
10. `fs.readFileSync` 读取该文件，`module._compile(stripBOM(content), filename)` 编译该模块；
11. 通过 `Module.wrap` 包裹代码块，再利用 `vm.runInThisContext` 编译包裹后的代码成函数；
12. 最后通过 `compiledWrapper.call` 执行该函数，该函数中，执行了 `module.exports = x`，即改变了当前模块的 `exports`，最后返回 `module.exports` 就能拿到 `a.js` 模块的值了。


## 特点

[ES6-模块与-CommonJS-模块的差异](https://es6.ruanyifeng.com/#docs/module-loader#ES6-%E6%A8%A1%E5%9D%97%E4%B8%8E-CommonJS-%E6%A8%A1%E5%9D%97%E7%9A%84%E5%B7%AE%E5%BC%82)有一句话：CommonJS 模块输出的是值的拷贝，也就是说，一旦输出一个值，模块内部的变化就影响不到这个值。

个人觉得不准确，例子只举了基础类型的情况，如果是引用类型，模块内部的变化就会影响这个值。

基础类型
```javascript
// lib.js
var counter = 3;
function incCounter() {
  counter++;
}
module.exports = {
  counter: counter,
  incCounter: incCounter,
};

// main.js
var mod = require('./lib');
console.log(mod.counter);  // 3
mod.incCounter();
console.log(mod.counter); // 3
```

引用类型
```javascript
// lib.js
var counter = {
  count: 0
};
function incCounter() {
  counter.count++;
}
module.exports = {
  counter: counter,
  incCounter: incCounter,
};

// main.js
var mod = require('./lib');
console.log(mod.counter);  // {count:0}
mod.incCounter();
console.log(mod.counter); // {count:1}
```