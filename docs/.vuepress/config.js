module.exports = {
  base: "/knowledge/",
  dest: "dist",
  title: "知识库",
  themeConfig: {
    repo: "https://github.com/Cybbin/knowledge",
    editLinkText: "在 GitHub 上编辑此页",
    lastUpdated: "上次更新",
    nav: [
      {
        text: "前端",
        link: "/frontend/javascript/variable",
      },
      {
        text: "Vue",
        link: "/vue/start/instructor",
      },
      {
        text: "Node",
        link: "/node/express/middleware",
      },
      {
        text: "网络",
        link: "/internet/http",
      },
      {
        text: "数据结构",
        link: "/data-structure/linkedlist",
      },
    ],
    sidebar: {
      "/frontend/": [
        {
          title: "Javascript",
          collapsable: true,
          children: [
            "javascript/variable",
            "javascript/closure",
            "javascript/prototype",
            "javascript/cross-domain",
            "javascript/event-loop",
            "javascript/code",
            "javascript/currying",
            "javascript/promise",
          ],
        },
        {
          title: "工程化",
          collapsable: true,
          children: ["engineer/module", "engineer/commonjs"],
        },
        {
          title: "Javascript 设计模式",
          collapsable: true,
          children: ["design-pattern/observer"],
        },
        {
          title: "鉴权方式",
          collapsable: true,
          children: [
            "program/authentication/authentication-method",
            "program/authentication/basic",
            "program/authentication/session-cookie",
            "program/authentication/token",
            "program/authentication/oauth",
          ],
        },
      ],
      "/internet/": [
        {
          title: "网络",
          collapsable: true,
          children: [
            "http",
            "https",
            "tcp",
            "cdn",
            "dns",
            "proxy",
            "websocket",
          ],
        },
        {
          title: "缓存",
          collapsable: true,
          children: ["storage"],
        },
      ],
      "/vue/": [
        {
          title: "开始",
          collapsable: true,
          children: [
            "start/instructor",
            "start/mvvm"
          ],
        },
        {
          title: "响应式",
          collapsable: true,
          children: [
            "reactive/defineProperty",
            "reactive/observerArray",
            "reactive/async-render",
            "reactive/getters",
            "reactive/watch",
            "reactive/computed"
          ],
        },
        {
          title: "数据驱动",
          collapsable: true,
          children: ["data-driven/render"],
        },
        {
          title: "组件化",
          collapsable: true,
          children: ["component/lifecycle"],
        },
        {
          title: "编译",
          collapsable: true,
          children: ["compile/parse", "compile/optimize", "compile/codegen"],
        },
        {
          title: "拓展",
          collapsable: true,
          children: ["extend/v-model", "extend/nextTick"],
        },
        {
          title: "全局API",
          collapsable: true,
          children: [
            "global-api/use",
            "global-api/mixin",
            "global-api/extend",
            "global-api/component",
            "global-api/set"
          ],
        },
        {
          title: "Vue 3.0",
          collapsable: true,
          children: ["version3/instructor"],
        },
        {
          title: "Vuex",
          collapsable: true,
          children: [
            "vuex/start",
            "vuex/entry",
            "vuex/init",
            "vuex/installModule",
            "vuex/mutations",
            "vuex/plugins",
          ]
        },
        {
          title: "FAQ",
          collapsable: true,
          children: [
            "faq/message"
          ]
        }
      ],
      "/data-structure/": [
        {
          title: "链表",
          collapsable: true,
          children: ["linkedlist"],
        },
      ],
      "/node/": [
        {
          title: "Express",
          collapsable: true,
          children: ["express/middleware"],
        },
        {
          title: "Koa",
          collapsable: true,
          children: ["koa/onion", "koa/middleware"],
        },
      ],
    },
  },
};
