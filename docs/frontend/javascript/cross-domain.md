# 跨域

跨域指`协议`、`域名`、`端口号`不同的资源间进行交互通信，受浏览器同源策略，无法进行交互通信。

## 同源策略

> 同源策略限制了从同一个源加载的文档或脚本如何与来自另一个源的资源进行交互。这是一个用于隔离潜在恶意文件的重要安全机制。

同一源：同一协议、同一域名、同一端口号。

同源的目的是为了防止 XSS，CSRF等攻击。

## 解决方案

### JSONP

基于 `script` 标签允许跨域请求资源，动态创建 `script` 实现跨域。

1. 需要服务端支持，返回一个带数据参数的函数。
``` js
var express = require('express');
var app = express();

app.get('/jsonp-test', function (req, res) {
  let callback = req.query.callback
  let data = {
    email: 'test@163.com'
  }

  if (callback) {
    res.type('text/javascript')
    res.send(callback + '(' + JSON.stringify(data) + ')')
  } else {
    res.json(data)
  }
})

var server = app.listen(9000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
})
```

2. 客户端
``` js
  var script = document.createElement('script')
  script.src = 'http://localhost:9000/jsonp-test'
  document.body.appendChild(script)

  function loadSuccess (res) {
    console.log(res)
  }
```

::: warning
缺点：JSONP 只支持 GET 请求。
:::

### 跨域资源共享（CORS）

普通跨域请求：后端设置 `Access-Control-Allow-Origin` 为跨域的域名，前端无需设置。

带`cookie`请求：前端设置 `xhr.withCredentials = true`，后端设置 `Access-Control-Allow-Credentials` 为 `true`

### postMessage

### document.domain + iframe

两个页面通过js设置 document.domain 为基础域名，实现同域。

1. 父窗口
``` html
<iframe id="iframe" src="https://www.oneplus.cn"></iframe>
<script>
  document.domain = 'cha.oneplus.com';
  var user = 'admin';
</script>

<iframe src="http://cha.oneplus.com:9000/test"></iframe>
```

2. 子窗口（`http://cha.oneplus.com:9000/test`）
``` html
<<!doctype html>
<html lang="en">
<head>
</head>
<body>
<script>
  document.domain = 'cha.oneplus.com';
  var div = document.createElement('div')
  div.innerHTML = window.parent.user
  // 获取父窗口中变量
  document.body.appendChild(div)
</script>
</body>
</html>
```

::: warning
缺点：仅限主域相同。
:::

### location.hash + iframe

### window.name + iframe

### Nginx 代理跨域

浏览器跨域访问js、css、img等常规静态资源被同源策略许可，但iconfont字体文件(eot|otf|ttf|woff|svg)例外，此时可在nginx的静态资源服务器中加入以下配置。

```
location / {
  add_header Access-Control-Allow-Origin *;
}
```

### 中间件代理跨域

### WebSocket协议跨域
