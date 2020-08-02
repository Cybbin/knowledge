# matcher

`matcher` 主要返回了两个方法 `match`、`addRoutes`。
* `match` 的作用是根据路由路径返回匹配的 `route`；
* `addRoutes` 的作用是动态添加路由配置，为 `api` 可供外部调用。

## createMatcher

`matcher` 是通过 `createMatcher` 函数创建，该函数接收两个参数，一个是 `routes`（用户自定义的路由配置），另一个是 `router`（当前路由 `VueRouter` 的实例）。

首先通过 `createRouteMap` 创建路由的映射表 `pathList`、`pathMap`、`nameMap `。
* `pathList` 存储所有注册过的 `path` 数组；
* `pathMap` 为 `path-RouteRecord` 的映射表；
* `nameMap` 为 `name-RouteRecord` 的映射表。

通过遍历用户自定义的路由配置 `routes`，分别生成`pathList`、`pathMap`、`nameMap `。

```js
export function createRouteMap (
  routes: Array<RouteConfig>,
  oldPathList?: Array<string>,
  oldPathMap?: Dictionary<RouteRecord>,
  oldNameMap?: Dictionary<RouteRecord>
): {
  pathList: Array<string>;
  pathMap: Dictionary<RouteRecord>;
  nameMap: Dictionary<RouteRecord>;
} {
  const pathList: Array<string> = oldPathList || []
  const pathMap: Dictionary<RouteRecord> = oldPathMap || Object.create(null)
  const nameMap: Dictionary<RouteRecord> = oldNameMap || Object.create(null)

  routes.forEach(route => {
    addRouteRecord(pathList, pathMap, nameMap, route)
  })

  for (let i = 0, l = pathList.length; i < l; i++) {
    if (pathList[i] === '*') {
      pathList.push(pathList.splice(i, 1)[0])
      l--
      i--
    }
  }

  return {
    pathList,
    pathMap,
    nameMap
  }
}
```
