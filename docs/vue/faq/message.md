# 组件通信

1. 父组件 `v-bind:` 传入，子组件 `props` 接收；
2. `event bus`，通过 `$on` 、 `$emit` 全局事件派发和监听；
3. `vuex` 数据管理中心；
4. 父组件通过 `$refs` 调用子组件；
5. 父组件通过 `$children `调用子组件，子组件通过 `$parent` 调用父组件；
6. 父组件通过 `provide` 注入属性，子孙组件通过 `inject` 接收属性；
7. `$attrs` 获取所有父组件传给当前组件的属性， `$listeners` 获取所有父组件绑定到当前组件的事件。