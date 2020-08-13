# Webpack

`Webpack` 是一个前端资源加载、打包工具。它将根据模块的依赖关系进行静态分析，然后将这些模块按照指定的规则生成对应的静态资源

<img :src="$withBase('/assets/webpack/webpack.jpeg')"/>

## 核心概念

* `entry`：打包入口。
* `output`：打包出口。
* `loader`：模块转换器，用于将模块原内容按照特定格式转换成新内容。
* `plugins`：拓展插件，用于监听打包过程中的许多事件，执行各种任务。
* `mode`：环境模式，告知 `webpack` 使用相应模式的内置优化。

## 基本配置

```js
const path=require('path');
module.exports={
  mode: 'development',
  entry: './src/index.js',
  output: {
      path: path.resolve(__dirname,'dist'),
      filename:'bundle.js'
  },
  module: {},
  plugins: []
}
```

## 构建流程

1. 识别入口文件；
2. 从入口文件出发，逐层识别模块依赖（commonjs、es6等）；
3. 使用 `loader` 将代码进行转换，得到模块转换后的内容以及各个模块依赖关系；
4. 根据入口和模块的依赖关系，组装转换后的代码；
5. 把文件内容输出到文件系统中。