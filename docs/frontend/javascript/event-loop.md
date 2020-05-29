# 事件循环 (Event Loop)

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
