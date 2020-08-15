# Vue.component

`Vue.component` 的作用是注册/获取一个全局组件。

## 用法

注册组件场景，可以看到第一个参数为组件的 `tag`，第二个参数支持一个函数或者一个对象。

```js
// 注册组件，传入一个扩展过的构造器
Vue.component('my-component', Vue.extend({ /* ... */ }))

// 注册组件，传入一个选项对象 (自动调用 Vue.extend)
Vue.component('my-component', { /* ... */ })

// 获取注册的组件 (始终返回构造器)
var MyComponent = Vue.component('my-component')
```

## 创建过程

从上面的注册使用场景可以看到，不管参数是函数还是对象，都依赖 `Vue.extend` 返回一个函数。

1. Vue源码中， Vue.component 定义在 `src/core/global-api/assets.js`。
2. `ASSET_TYPES` 包括  `component`、`directive`、`filter`。
3. 在这里可以看到如果定义过就直接返回，正是获取组件的原理。
4. 注册组件核心是调用 `this.options._base.extend(definition)`，其中 `this.options._base` 指向 `Vue`，也就是调用 `Vue.extend`。

```js
// 

import { ASSET_TYPES } from 'shared/constants'
import { isPlainObject, validateComponentName } from '../util/index'

export function initAssetRegisters (Vue: GlobalAPI) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(type => {
    Vue[type] = function (
      id: string,
      definition: Function | Object
    ): Function | Object | void {
      //  如果定义过，直接返回
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        // ************************************
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id
          definition = this.options._base.extend(definition)
        }
        // ************************************
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition }
        }
        this.options[type + 's'][id] = definition
        return definition
      }
    }
  })
}

```

## 组件渲染流程

1. 调用 `Vue.component`，内部调用 `Vue.extend` ，产生子类继承 `Vue`
2. 在模版编译时，调用 `_createElement` 时，遇到非原生标签，调用 `createComponent`。
3. 根据标签筛选出对应的组件，创建这个组件的虚拟节点(`VNode`)。

文件位置： `src\core\vdom\create-element.js`
```js
export function _createElement (
  context: Component,
  tag?: string | Class<Component> | Function | Object,
  data?: VNodeData,
  children?: any,
  normalizationType?: number
): VNode | Array<VNode> {
  // ... 省略代码

  let vnode, ns
  if (typeof tag === 'string') {
    let Ctor
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag)
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      )
    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag)
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      )
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children)
  }
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) applyNS(vnode, ns)
    if (isDef(data)) registerDeepBindings(data)
    return vnode
  } else {
    return createEmptyVNode()
  }
}
```

文件位置：`src\core\vdom\create-component.js`
```js
export function createComponent (
  Ctor: Class<Component> | Function | Object | void,
  data: ?VNodeData,
  context: Component,
  children: ?Array<VNode>,
  tag?: string
): VNode | Array<VNode> | void {
  // ... 省略代码
  // install component management hooks onto the placeholder node
  installComponentHooks(data)

  // return a placeholder vnode
  const name = Ctor.options.name || tag
  const vnode = new VNode(
    `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
    data, undefined, undefined, undefined, context,
    { Ctor, propsData, listeners, tag, children },
    asyncFactory
  )
  return vnode
}
```