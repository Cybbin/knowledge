# 鉴权

## 鉴权方式

### HTTP Basic Authentication（HTTP 基本认证）

HTTP 1.0或1.1规范的客户端（如IE，FIREFOX）收到`401`返回值时，将自动弹出一个登录窗口，要求用户输入用户名和密码。 用户名及密码以 `base64` 加密方式加密(`base64`不安全!)。

客户端未认证的时候，会弹出用户名密码输入框，这个时候请求时属于`pending`状态， 用户输入用户名和密码后，会带在`http request header`上，发送给服务器进行校验。

认证流程
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
<img :src="$withBase('/assets/program/401.jpg')"/>
4. 用户输入用户名、密码后，将用户名、密码经过 `base64` 加密，再次请求。
    ```
    Authorization: Basic MTIzMTIzMTIzMToxMjMxMjM=
    ```
5. 服务端收到请求信息后，将`Authorization`字段加密后的用户名、密码经过解密后，校验，校验通过返回`200`，校验不通过返回`401`（同第2步骤）。

**优点**

简单，被广泛支持。

**缺点**

1. 如果没有 `SSL/TLS` 这样的传输层安全协议，明文传输的密钥和口令不安全（基于`HTTP`的缺点都有）。
2. 浏览器会保存认证信息，除非关闭浏览器(标签页)、清缓存，否则无法主动退出登录。

### session-cookie

利用服务端的`session`和客户端的`cookie`来实现前后端的鉴权，



## 前端鉴权方案
