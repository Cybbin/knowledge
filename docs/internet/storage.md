# 缓存

浏览器缓存机制

## 缓存位置
* Service Worker：运行在浏览器背后的独立线程，一般用来实现缓存。
  1. 无法操作DOM
  2. 只能使用HTTPS
  3. 拦截全站请求从而控制应用
  4. 独立于主线程
  5. 完全异步，无法使用 XHR 和 LocalStorage
  6. 一旦被 install，就永远存在，除非手动删除
  7. 独立上下文
  8. 响应推送
  9. 后台同步
* Memory Cache：内存中的缓存。
* Disk Cache：硬盘中的缓存。
* Push Cache：推送缓存（HTTP 2.0 的内容【服务器推送】）。

---

## 强缓存

定义：不会向服务器发送请求，直接从本地缓存中读取资源，状态码为200。

HTTP Header 包含强缓存的字段

1. Expires  
  HTTP 1.0 产物，指定缓存的过期时间。
  * 缺点：受限于本地时间，如果修改了本地时间，可能会造成缓存失效。

2. cache-control  
    HTTP 1.1 产物，请求返回时间的 n 秒内再次加载资源，就会命中强缓存。
    ```
      指令：
      public：所有内容都可被缓存（客户端和代理服务器都可缓存）。
      private：所有内容只有客户端可以缓存
      no-cache：不使用强缓存，缓存策略由协商缓存接管。
      no-store：不使用强缓存和协商缓存。
      max-age：max-age=n 表示缓存内容在 n 秒后失效。
    ```
3. 两者对比
  * Expires 是HTTP 1.0 的产物，cache-control 是 HTTP 1.1的产物；
  * cache-control 优先级高于 Expires。

---

## 协商缓存
定义：强制缓存失效后，浏览器向服务器发送携带缓存标识的请求，由服务器决定浏览器是否缓存。

HTTP Header 包含强缓存的字段

**Last-Modified、If-Modified-Since**

  1. 浏览器第一次访问时，服务器返回资源时在相应头里添加 Last-Modified 字段，值为该资源在服务器上的最后修改时间；
  2. 浏览器下次访问该资源时，将上次返回的 Last-Modified 的值 放在 If-Modified-Since 字段里；
  3. 服务器收到 If-Modified-Since 的值，与对应的资源的最后修改时间做对比;
  4. 如果没有变化，返回 304 和空的响应体，告诉浏览器直接从缓存读取;
  5. 如果小于最后的修改时间，返回 200 和新的资源，并更新 Last-Modified。

**缺点**：
    1. 一些文件周期性地更改，但是内容不变，会导致 Last-Modified 的时间修改；
    2. If-Modified-Since 能检查到的精度是秒级的，文件如果在秒以下的时间进行修改，这种修改无法判断。

**Etag、If-None-Match**
  1.  Etag 是服务器响应请求时，由服务器省省当前资源的一个唯一标识符并返回，只要有资源变化，Etag就会重新生成；
  2. 浏览器下次访问该资源时，将上次返回的 Etag 的值放在 If-None-Match 字段里；
  3. 服务器收到 If-None-Match 的值，与对应资源的 Etag 做对比;
  4. 如果一样，则返回 304 和空的响应体，告诉浏览器直接从缓存读取;
  5. 如果不一样，返回 200 和新的资源，并更新 Etag。

* 两者对比
  1. 精确度上，Etag 要优于 Last-Modified，注：负载均衡的服务器上，各个服务器生成的 Last-Modified 有可能不一致；
  2. 性能上，Last-Modified 要优于 Etag，因为 Last-Modified 只记录时间，Etag 需要计算文件的 hash 值；
  3. 如果同时存在，Etag 优先级于  Last-Modified；
  4. 应用场景上，Last-Modified 偏向于时间状态， Etag 偏向于资源是否有变更。