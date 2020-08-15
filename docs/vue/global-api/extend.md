# Vue.extend

`Vue.extend` 的作用是创建一个子类来继承  `Vue`，参数是一个包含组件选项的对象。


## 使用

创建一个按钮。在该例子中，创建了一个子类 `OneButton`，实例化该组件并挂载到 `dom` 上。

```html
<div id="button"></div>
<script>
  var OneButton = Vue.extend({
    template: '<button>{{text}}</button>',
    data: function () {
      return {
        text: '点击'
      }
    }
  });

  new OneButton().$mount('#app')
</script>
```


## 源码

1. cachedCtors 用来缓存。
2. 创建子类 `Sub`，构造函数执行 `Vue` 上的 `_init` 方法。
3. 将 `Sub.prototype` 的 `__proto__` 指向 `Super.prototype`，这样当前子类找不到的属性就可以顺着原型链到 `Super` 上找，此处的 `Super` 就是构造函数 `Vue`。
4. 将 `Sub.prototype.constructor` 指向 `Sub` 本身。
5. 合并 当前 `options` 和 `Super` 的 `options`。
6. 再将 `Super` 的 `extend`、`mixin`、`use`、`components` 等方法注入到 `Sub`
7. 最后返回的 `Sub` 就是构造函数 `Vue` 的一个子类。

```js
export function initExtend (Vue: GlobalAPI) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0
  let cid = 1

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions: Object): Function {
    extendOptions = extendOptions || {}
    const Super = this
    const SuperId = Super.cid
    const cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {})
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    const name = extendOptions.name || Super.options.name

    // ...

    const Sub = function VueComponent (options) {
      this._init(options)
    }
    Sub.prototype = Object.create(Super.prototype)
    Sub.prototype.constructor = Sub
    Sub.cid = cid++
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    )
    Sub['super'] = Super

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps(Sub)
    }
    if (Sub.options.computed) {
      initComputed(Sub)
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend
    Sub.mixin = Super.mixin
    Sub.use = Super.use

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type]
    })
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options
    Sub.extendOptions = extendOptions
    Sub.sealedOptions = extend({}, Sub.options)

    // cache constructor
    cachedCtors[SuperId] = Sub
    return Sub
  }
}
```