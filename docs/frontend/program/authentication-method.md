# 鉴权方式

## HTTP Basic Authorization

HTTP 基本认证，HTTP 1.0或1.1规范的客户端（如IE，FIREFOX）收到`401`返回值时，将自动弹出一个登录窗口，要求用户输入用户名和密码。 用户名及密码以 `base64` 加密方式加密(`base64`不安全!)。

客户端未认证的时候，会弹出用户名密码输入框，这个时候请求时属于`pending`状态， 用户输入用户名和密码后，会带在`http request header`上，发送给服务器进行校验。

### 过程
1. 客户端向服务端请求数据；
2. 服务端返回`401`，`WWW-Authenticate: Basic realm="Restricted"`是关键。
    ```
    HTTP/1.1 401 Unauthorized
    Server: nginx
    Date: Mon, 22 Jun 2020 11:43:47 GMT
    Content-Type: text/html
    WWW-Authenticate: Basic realm="Restricted"
    ```
3. 客户端弹出登录窗口，要求用户输入用户名和密码。
<img :src="$withBase('/assets/program/authentication/401.jpg')"/>
4. 用户输入用户名、密码后，将用户名、密码经过 `base64` 加密，再次请求。
    ```
    Authorization: Basic MTIzMTIzMTIzMToxMjMxMjM=
    ```
5. 服务端收到请求信息后，将`Authorization`字段加密后的用户名、密码经过解密后，校验，校验通过返回`200`，校验不通过返回`401`（同第2步骤）。

### 优点

简单，被广泛支持。

### 缺点

1. 如果没有 `SSL/TLS` 这样的传输层安全协议，明文传输的密钥和口令不安全（基于`HTTP`的缺点都有）。
2. 浏览器会保存认证信息，除非关闭浏览器(标签页)、清缓存，否则无法主动退出登录。

---

## session-cookie

利用服务端的 `Session` 和客户端的 `Cookie` 来实现前后端的鉴权，`Session` 是依据 `Cookie` 来识别是否是同一个用户。

### 过程
1. 客户端使用用户名跟密码请求登录;
2. 服务端验证通过后，在当前会话 `session` 保存相关数据，如用户角色，登录时间等；
3. 服务端向客户端通过 `response header` 的 `Set-Cookie` 返回一个 `SESSONID`，写入用户的 `cookie`；
4. 客户端之后的每一次请求，通过 `resquest header` 的 `Cookie` 带上这个`SESSONID`；
5. 服务端通过这个 `SESSONID`，找到之前保存的相关数据，从而知道用户的身份。

<img :src="$withBase('/assets/program/authentication/session-cookie')"/>

### 缺点
1. 易受到 `CSRF` 攻击，基于 `Cookie` 的一种跨站伪造攻击；
2. 服务器内存消耗大，用户每一次认证，就需要在内存做一次记录；
3. 服务器集群、跨域的服务导向结构，要求 `Session` 数据共享，每台服务器都需要能读取 `Session`。

**`Session` 共享：**
1. 根据请求的 `IP` 进行 `Hash` 映射到对应的机器上（这就相当于请求的`IP`一直会访问同一个服务器）。【如果服务器宕机了，会丢失了一大部分Session的数据，不建议】
2. `Session` 复制：任何一个服务器 `Session` 发生变化，就广播给其他节点，同步更新。【会影响集群的性能呢，不建议】
3. 把 `Session` 数据放在 `Redis` 中。

**`Cookie` 跨域：**
1. 利用 `Token` 解决；
2. 多个域名共享 `Cookie`，设置 `Cookie` 的 `domain` 。

---

## Token

### 过程
1. 客户端使用用户名跟密码请求登录;
2. 服务端验证通过后，生成一个 `Token` ，发送给客户端；
3. 客户端收到 `Token` 后，存储在 `Cookie` 或 `LocalStorage` 或 `SessionStorage` 里。
4. 客户端之后的每一次请求，通过 `request header` 的 `Authorization` 
5. 服务端通过这个 `Token`，从而知道用户的身份。

### 优点
不需要在服务端去保留用户的认证信息，解决 `Session` 拓展性的的弊端。

### 缺点
1. 占带宽：`Token` 通常比 `SESSIONID` 大，需要消耗更多流量，挤占更多带宽（不过可以忽略不计）；
2. 性能问题： 相比于 `session-cookie`，需要服务端花费更多的时间和性能来对 `Token` 进行解密验证。

### Token 与 Session 的区别
1. 使用 `Token`，服务端不需要保留状态，有更好的拓展性；
2. `Token` 不需要借助 `Cookie`，预防 `CSRF`；
3. `SESSIONID` 是在登陆的时候生成的而且在登出时一直不变的，在一定程度上安全就会低，而 `Token`是可以在一段时间内动态改变的。

### JWT
基于 `Token` 的一种解决方案，`JWT` 的原理是，服务器认证后，生成一个 `JSON` 对象，经过服务器签名加密后返回给用户，以后用户每次请求都带着这个令牌。

`JWT` 由三部分构成：`Header`（头部）、`Payload`（负载）、`Signature`（签名）。

#### 特点
1. 默认不加密，可以用密钥加密一次；
2. 不能将秘密数据写进未加密的 `JWT` 中；
3. 降低服务器查询数据库的次数；
4. `JWT` 包含认证信息，一旦泄露，任何人都可以获得该令牌的所有权限；
5. 为了减少盗用，`JWT` 不应该使用 `HTTP` 协议明码传输，要使用 `HTTPS` 协议传输。

---

## OAuth

`OAuth` （Open Authorization）：开放授权，允许用户授权第三方访问存储在另外服务提供者的信息，而不需要用户名和密码提供给第三方或分享他们数据的所有内容。

### 角色
1. `Client`：客户端（第三方）；
2. `Resource Ower`： 资源拥有者（用户）；
3. `Resource Server`：资源服务器；
4. `Authorization Server`：认证服务器

### 认证流程
<img :src="$withBase('/assets/program/authentication/oauth.png')"/>

1. `Authorization Request`：第三方请求用户授权；
2. `Authorization Grant`：用户统一授权后，会从服务方获取一次性用户**授权凭证**（如`code`码）给第三方；
3. `Authorization Grant`：第三方把**授权凭证**和服务方给它的**身份凭据**(`AppId`)，一起交给服务方的认证服务器申请**访问令牌**；
4. `Access Token`：服务方验证**授权凭证**、**身份凭据**等信息，验证通过后下发**访问令牌**(`Access Token`)等信息；
5. `Access Token`：第三方通过 `Access Token` 向资源服务器索要数据；
6. `Protected Resource`：资源服务器使用令牌向认证服务器验证令牌的正确性，验证通过后提供资源。

### 授权方式
1. 授权码模式（`authorization code`）
2. 简化模式（`implicit`）
3. 密码模式（`resource owner password credentials`）
4. 客户端模式（`client credentials`）
