# WebSocket

一种网络通信协议，解决 `HTTP` 协议通信只能由客户端发起的缺陷，实现了客户端和服务端的全双工通信。

客户端主动获取服务端消息：
1. 轮询：每个一段时间，客户端就发起一个询问，了解服务端有没有新的消息；
2. 长轮询：客户端发送一个超时时间很长的请求，服务端 hold 住这个连接，在有新数据到达时再返回；
3. `WebSocket`。

---

`WebSocket` 与 `HTTP` 区别
相同点：
1. 都是基于 `TCP` 协议，都是可靠性传输协议；
2. 都属于应用层协议；
不同点：
`WebSocket` 是双向通信协议，`HTTP` 是单向的。
https://user-gold-cdn.xitu.io/2017/5/15/9cb2a748556c4ce6decaddcf41e31ae9?imageView2/0/w/1280/h/960/format/webp/ignore-error/1
---

`WebSocket` 握手
基于 `HTTP` 握手，是 `HTTP` 请求的升级。

1. 浏览器请求
```
GET /chat HTTP/1.1   //必需。
Host: server.example.com  // 必需。WebSocket服务器主机名
Upgrade: websocket // 必需。并且值为" websocket"。有个空格
Connection: Upgrade // 必需。并且值为" Upgrade"。有个空格
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ== // 必需。其值采用base64编码的随机16字节长的字符序列。
Origin: http://example.com //浏览器必填。头域（RFC6454）用于保护WebSocket服务器不被未授权的运行在浏览器的脚本跨源使用WebSocket API。
Sec-WebSocket-Protocol: chat, superchat //选填。可用选项有子协议选择器。
Sec-WebSocket-Version: 13 //必需。版本。
```

2. 服务端响应
```
HTTP/1.1 101 Switching Protocols   //必需。响应头。状态码为101。任何非101的响应都为握手未完成。但是HTTP语义是存在的。
Upgrade: websocket  // 必需。升级类型。
Connection: Upgrade //必需。本次连接类型为升级。
Sec-WebSocket-Accept:s3pPLMBiTxaQ9kYGzzhZRbK+xOo=  //必需。表明服务器是否愿意接受连接。如果接受，值就必须是通过上面算法得到的值。
```

---

特点
1. 建立在 `TCP` 协议之上，服务端的实现比较容易；
2. 与 `HTTP` 协议有良好的兼容性，默认端口也是 `80` 和 `443`，握手阶段通过 `HTTP` 协议；
3. 数据格式比较轻量，性能开销小，通行高效；
4. 可以发送文本，也可以发送二进制数据；
5. 没有同源限制；
6. 标志符是 `ws` （如果加密，则为 `wss`），服务器网址就是`URL`。
    * `ws://example.com:80/some/path`

https://user-gold-cdn.xitu.io/2017/5/15/60014297b1ab2e908f9543f3fdb5003c?imageView2/0/w/1280/h/960/format/webp/ignore-error/1


## 鉴权，房间分配，心跳机制，重连方案等。
