# 模块化

## 模块化分类

### cjs

cjs = CommonJS

规范：
- 每个文件都是一个模块；
- 运行时导入(动态导入)；
- 导出用 `module.exports`、`exports.x = xx`、`this.x = xx`；
- 导入用 `require`。

### esm

esm = ES6 Modules

规范：
- `import xxx from 'xxx'` 只能用在页面顶端（静态导入）
- `import()` 支持动态导入
- 导入用 `import`
- 导出用 `export`

### AMD

AMD = Asynchronous Module Definition

define require

### CMD

seajs

### UMD

UMD = Universal Module Definition

统一模块规范，兼容 cjs、AMD、CMD

## esm 和 cjs 的区别

1. commonjs 模块输出的是值的拷贝， esm 模块输出的是值的引用；
2. commonjs 加载的是整个模块，会把所有的代码都加载进来,esm 可以单独加载其中的某个输出；
3. commonjs 是运行时加载， esm 是编译时加载；
4. commonjs `this` 指向当前模块， esm `this` 指向 `undefined`。

## 模块化的好处

1. 解决命名冲突问题；
2. 方便管理代码（解耦，一个文件一个功能）。
