# OAuth

`OAuth` （Open Authorization）：开放授权，允许用户授权第三方访问存储在另外服务提供者的信息，而不需要用户名和密码提供给第三方或分享他们数据的所有内容。

## 角色
1. `Client`：客户端（第三方）；
2. `Resource Ower`： 资源拥有者（用户）；
3. `Resource Server`：资源服务器；
4. `Authorization Server`：认证服务器

## 认证流程
<img :src="$withBase('/assets/program/authentication/oauth.png')"/>

1. `Authorization Request`：第三方请求用户授权；
2. `Authorization Grant`：用户统一授权后，会从服务方获取一次性用户**授权凭证**（如`code`码）给第三方；
3. `Authorization Grant`：第三方把**授权凭证**和服务方给它的**身份凭据**(`AppId`)，一起交给服务方的认证服务器申请**访问令牌**；
4. `Access Token`：服务方验证**授权凭证**、**身份凭据**等信息，验证通过后下发**访问令牌**(`Access Token`)等信息；
5. `Access Token`：第三方通过 `Access Token` 向资源服务器索要数据；
6. `Protected Resource`：资源服务器使用令牌向认证服务器验证令牌的正确性，验证通过后提供资源。

## 授权方式
1. 授权码模式（`authorization code`）
2. 简化模式（`implicit`）
3. 密码模式（`resource owner password credentials`）
4. 客户端模式（`client credentials`）
