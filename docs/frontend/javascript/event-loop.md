# 事件循环 (Event Loop)

## 进程、线程

* 计算机在调度任务时，是以进程为单位的，也是分配任务的最小单位。
* 浏览器是一个多进程的（每一个标签页都是一个进程）
* 每个标签页里有一个渲染进程（浏览器内核）、网络进程、绘图绘制（GPU渲染进程）等
* `Javascript` 渲染进程（浏览器内核）中运行，该进程包括多个线程：
  * `ui`渲染线程；
  * `javascript`引擎，执行`js`（`ui`和`js`是互斥的，共用一个线程）；
  * 事件线程（`click`、定时器、`ajax`等）
  * 事件触发线程（`Event Loop`，单独的调度线程，处理事件、处理定时器、处理 `ajax` 回调）

## 宏任务、微任务

### `macro-task`(宏任务)
* 包括整体代码 script
* setTimeout
* setInterval
* setImmediate（IE10+、Node.js）
* requestAnimationFrame（浏览器独有）
* I/O
* UI rendering（浏览器独有）

### `micro-task`(微任务)
* Promise
* MutationObserver
* process.nextTick（Node.js独有）
* ~~Object.observe~~（废弃）

## Event Loop

`Javascript` 有一个主线程 `main thread` 和调用栈（执行栈）`call-stack`，所有的任务都会放到调用栈等待主线程执行。

### 调用栈

采用先进后出、后进先出的规则，当函数执行时，会被添加到栈的顶部，当该函数执行完成后，就会从栈顶移出，直到栈内被清空。

### 同步任务和异步任务

单线程任务被分为同步任务和异步任务，同步任务在调用栈按照顺序等待主线程以此执行，异步任务会在异步任务有了结果后，将注册的回调函数放入任务队列 `Task queue` 中等待调用栈被清空的时候，读取到调用栈内执行。

<img :src="$withBase('/assets/event-loop/task.jpg')"/>

## 浏览器事件循环流程

1. 从任务队列取出一个**宏任务**并执行；
2. 执行并清空**微任务**队列，如果微任务的执行中又加入了新的微任务，也会在这一步一起执行;
3. 进入更新渲染阶段，判断是否需要渲染，不一定每一轮 `Event Loop` 都会执行渲染，取决于屏幕刷新率、页面性能、页面是否在后台运行来共同决定。
    * 浏览器会尽可能的保持帧率稳定，如页面性能 60fps （每16.6ms渲染一次）。
    * 满足下面条件，会跳过渲染：
        1. 浏览器判定更新渲染不会带来视觉上的变化。
        2. 帧动画回调为空（通过 `requestAnimationFrame` ）来请求帧动画。
4. 如果第3步决定本轮 `Event Loop`需要渲染，继续往下运行，否则跳转第一步；
5. 如果窗口大小发生了变化，执行监听的 `resize` 方法；
6. 如果页面发生了滚动，执行监听的 `scroll` 方法；
7. 执行帧动画回调，也就是 `requestAnimationFrame` 的回调；
8. 执行 `IntersectionObserver` 的回调；
9. 重新渲染绘制用户界面。

<img :src="$withBase('/assets/event-loop/eventloop.jpg')"/>

## Node.js 事件循环


> [官方文档](https://nodejs.org/zh-cn/docs/guides/event-loop-timers-and-nexttick/)

```javascript
  // 此阶段执行已经放进队列的 setTimeout、setInterval 回调函数
   ┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘   
│ // 执行延迟到下一个循环迭代的 I/O 回调
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘        
│ // 供系统内部使用
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘
│                │             │               
│ // 轮询，检测新的I/O 事件，执行与I/O相关的回调，如 fs.readFile
│                │             │      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│                │             │      └───────────────┘
│ // 执行 setImmediate 回调函数
│  ┌─────────────┴─────────────┐
│  │           check           │
│  └─────────────┬─────────────┘
|  // 执行关闭的回调函数 如 socket.on('close', ...)
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
```

三个重点阶段：`timers`、`poll`、`check`

### timers

timers 阶段会执行 `setTimeout` 和 `setInterval` 回调，由 `poll` 阶段控制。定时器指定的事件不是准确事件，只能是尽快执行。

### poll
poll 阶段执行顺序：

1. 如果存在定时器，且定时器时间到了，`event loop` 回到 `timer` 阶段；
2. 如果没有定时器：
  * 如果 `poll` 队列不为空，会遍历回调队列同步执行，知道队列为空或达到系统限制；
  * 如果 `poll` 队列为空：
    * 如果有 `setImmediate` 回调需要执行，`poll` 阶段会进入 `check` 阶段执行 `setImmediate` 的回调；
    * 如果没有 `setImmediate` 回调需要执行，会等待回调被加入到当前队列中并执行，超出一定时间会自动进入 `check` 阶段。

### check

`check` 阶段执行 `setImmediate` 的回调。

### process.nextTick

`process.nextTick` 有一个独立于 `evevt loop` 的任务队列

在每一个 `event loop` 阶段完成后会检查 `nextTick` 队列，如果里面有任务，会清空该队列。

### Node 版本差异

`Node 11` 版本前后差异：
- `Node 11`之前：每执行一个阶段才回去清空微任务；
- `Node 11`之后：每执行一个宏任务（`setTimeout、setInterval、serImmediate`）后就会清空微任务。

## async / await 执行顺序

`await` 后面的函数执行完毕时，`await`会产生一个微任务（`Promise.then`）。注意这个微任务的产生时机：
- 执行完`await`后面函数之后，直接跳出 `async` 函数，执行其他代码；
- 其他代码执行完后，再回到 `async` 函数去执行剩下的代码，在此时产生微任务。

> [async/await 在chrome 环境和 node 环境的 执行结果不一致，求解？](https://www.zhihu.com/question/268007969)
