# 介绍

模版(`template`)渲染成真实 `dom` 的过程，中间有个生成 `render` 函数的过程，这个过程叫做编译。

`Vue.js` 提供两个版本，一个是 `Runtime + Compiler`（包含编译代码），一个是 `Runtime only`（运行时）。

<img :src="$withBase('/assets/vue/start/lifecycle.png')"/>
