# session-cookie

利用服务端的 `Session` 和客户端的 `Cookie` 来实现前后端的鉴权，`Session` 是依据 `Cookie` 来识别是否是同一个用户。

## 过程
1. 客户端使用用户名跟密码请求登录;
2. 服务端验证通过后，在当前会话 `session` 保存相关数据，如用户角色，登录时间等；
3. 服务端向客户端通过 `response header` 的 `Set-Cookie` 返回一个 `SESSONID`，写入用户的 `cookie`；
4. 客户端之后的每一次请求，通过 `resquest header` 的 `Cookie` 带上这个`SESSONID`；
5. 服务端通过这个 `SESSONID`，找到之前保存的相关数据，从而知道用户的身份。

<img :src="$withBase('/assets/program/authentication/session-cookie')"/>

## 缺点
1. 易受到 `CSRF` 攻击，基于 `Cookie` 的一种跨站伪造攻击；
2. 服务器内存消耗大，用户每一次认证，就需要在内存做一次记录；
3. 服务器集群、跨域的服务导向结构，要求 `Session` 数据共享，每台服务器都需要能读取 `Session`。

**`Session` 共享方案：**
1. 使用 `Token` ，以 `cookie` 加密的方式存在客户端；
2. 根据请求的 `IP` 进行 `Hash` 映射到对应的机器上（相当于请求的 `IP` 一直会访问同一个服务器）。【如果服务器宕机了，会丢失了一大部分 `Session` 的数据】
3. `Session` 复制：任何一个服务器 `Session` 发生变化，就广播给其他节点，同步更新。【会影响集群的性能】
4. 把 `Session` 数据放在 `Redis` 中(注：如果 `Reis` 挂了，就无法校验)。

**`Cookie` 跨域：**
1. 利用 `Token` 解决；
2. 多个域名共享 `Cookie`，设置 `Cookie` 的 `domain` 。

---
