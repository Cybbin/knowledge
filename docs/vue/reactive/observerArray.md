# 数组响应式

## 核心

1. 使用**函数劫持**，重写数组的方法，对新增的元素进行`Object.defineProperty`，会新增元素的数组函数有：`push`、`unshift`、`splice`，其他改变数组的函数有：`pop`、`shift`、`sort`、`reverse`。
2. 对 `data` 中的数组进行原型重写（改写数组的 `__proto__` 属性），指向经过**函数劫持**的数组原型。因此，当 `data` 中的数组变化（调用`api`）时，就可以通知依赖更新。