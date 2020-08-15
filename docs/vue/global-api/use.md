# Vue.use

`Vue.use` 的作用是安装 `Vue` 插件。

1. 如果有缓存，则直接返回；
2. 如果插件有 `install` 方法，则执行插件上的 `install` 方法，参数为 `Vue`;
2. 否则执行插件本身;
3. 将插件缓存起来，以后再安装时直接返回缓存值。

```js
export function initUse (Vue: GlobalAPI) {
  Vue.use = function (plugin: Function | Object) {
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    const args = toArray(arguments, 1)
    args.unshift(this)
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args)
    }
    installedPlugins.push(plugin)
    return this
  }
}

```