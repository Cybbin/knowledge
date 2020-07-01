# 编译

文件入口`src/platforms/web/entry-runtime-with-compiler.js`，定义了`$mount`方法。
```javascript
const mount = Vue.prototype.$mount
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && query(el)

  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== 'production' && warn(
      `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
    )
    return this
  }

  const options = this.$options
  // resolve template/el and convert to render function
  if (!options.render) {
    let template = options.template
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template)
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && !template) {
            warn(
              `Template element not found or is empty: ${options.template}`,
              this
            )
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML
      } else {
        if (process.env.NODE_ENV !== 'production') {
          warn('invalid template option:' + template, this)
        }
        return this
      }
    } else if (el) {
      template = getOuterHTML(el)
    }
    if (template) {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile')
      }

      const { render, staticRenderFns } = compileToFunctions( template, {
        shouldDecodeNewlines,
        shouldDecodeNewlinesForHref,
        delimiters: options.delimiters,
        comments: options.comments
      }, this)
      options.render = render
      options.staticRenderFns = staticRenderFns

      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile end')
        measure(`vue ${this._name} compile`, 'compile', 'compile end')
      }
    }
  }
  return mount.call(this, el, hydrating)
}
```

**编译核心**，文件位置：`src/compiler/index.js`。
1.生成 `ast`(parse)；
2.优化 `ast` (optimize)；
3.生成 `render` 函数 (generate)。
```javascript
export const createCompiler = createCompilerCreator(function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {
  const ast = parse(template.trim(), options) // 生成 ast
  optimize(ast, options) // 优化 ast
  const code = generate(ast, options) // 生成 render 函数
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
})
```

## parse

语法解析器，将 `template` 模版字符串解析成 `AST` (抽象语法树)，[与Vitural Dom的区别]()。

过程：通过正则表达式顺序解析模板，当解析到开始标签、闭合标签、注释、文本的时候会分别执行对应的回调函数（`start`、`end`、`comment`、`chars`），来达到构造 AST 树的目的。
'
## optimize

优化 `AST` 树，标记非数据响应的静态节点，在 `patch` 的过程可以跳过这些静态节点，无需创建新的 `DOM`。

过程：
1. 标记静态节点，深度遍历 `AST`，用 `isStatic` 函数判断是否为静态节点，并标记，静态节点需要满足以下条件:
    * 普通元素；
    * 不存在 `v-pre` 属性；
    * 不存在 `node.hasBindings`，当节点有绑定 `Vue` 属性，比如指令、事件等，`node.hasBindings` 为  `true`；
    * 不存在 `v-if` 和 `v-for`；
    * 节点名称不为 `slot` 和 `component`；
    * `isPlatformReservedTag` 为正常的 `HTML` 标签；
    * `isDirectChildOfTemplateFor` 节点父辈以上不能是 `template` 或 `v-for`；
    * 节点的所有属性需要在 `type,tag,attrsList,attrsMap,plain,parent,children,attrs` 的范围内。
    ```javascript
    function isStatic (node: ASTNode): boolean {
      if (node.type === 2) { // expression
        return false
      }
      if (node.type === 3) { // text
        return true
      }
      return !!(node.pre || (
        !node.hasBindings && // no dynamic bindings
        !node.if && !node.for && // not v-if or v-for or v-else
        !isBuiltInTag(node.tag) && // not a built-in
        isPlatformReservedTag(node.tag) && // not a component
        !isDirectChildOfTemplateFor(node) &&
        Object.keys(node).every(isStaticKey)
      ))
    }
    ```
2. 标记静态根节点，深度遍历 `AST`，标记静态根节点，静态根节点需要满足以下条件：
    * 本身是静态节点；
    * 拥有子节点；
    * 子节点不能为一个文本节点。
    ```javascript
    function markStaticRoots (node: ASTNode, isInFor: boolean) {
      if (node.type === 1) {
        if (node.static || node.once) {
          node.staticInFor = isInFor
        }
        // For a node to qualify as a static root, it should have children that
        // are not just static text. Otherwise the cost of hoisting out will
        // outweigh the benefits and it's better off to just always render it fresh.
        if (node.static && node.children.length && !(
          node.children.length === 1 &&
          node.children[0].type === 3
        )) {
          node.staticRoot = true
          return
        } else {
          node.staticRoot = false
        }
        if (node.children) {
          for (let i = 0, l = node.children.length; i < l; i++) {
            markStaticRoots(node.children[i], isInFor || !!node.for)
          }
        }
        if (node.ifConditions) {
          for (let i = 1, l = node.ifConditions.length; i < l; i++) {
            markStaticRoots(node.ifConditions[i].block, isInFor)
          }
        }
      }
    }
    ```

## generate

根据 `AST` 树生成 `render` 函数内的 `code`，后续用 `new Function(code)` 生成 `render` 函数。

过程：通过 `genElement(ast, state)` 生成 `code`，再把 `code` 通过 `with(this){return ${code}}` 包裹起来，构成函数内的代码。
