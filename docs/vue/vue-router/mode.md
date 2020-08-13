# 路由模式

`vue-router` 默认为 `hahh` 模式。

## hash

`hash`：在地址栏 URL 中的 `#` 符号，可通过 `location.hash` 获取或设置。

`vue-router` 中原理： 利用 `hashchange` 事件，监听路由变化。

```js
window.addEventListener('hashchange', () => {
  console.log(location.hash)
})
```

## history

`history`：与正常 URL 类似，利用 HTML5 新增加的 `pushState()` 和 `replaceState()` 设置，可实现不刷新页面改变 URL。 

`vue-router` 中原理：
1. 利用 `pushState`、`replaceState` 改变页面URL并执行对应回调。  
2. 利用 `poostate` 事件，监听 `go`、`forward`、`back` 事件执行，执行对应回调。

```js
window.addEventListener('popstate', () => {
  console.log(location.href)
})
```

## abstract