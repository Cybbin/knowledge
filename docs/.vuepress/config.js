module.exports = {
  base: '/knowledge/',
  dest: 'dist',
  title: '知识库',
  themeConfig: {
    repo: 'https://github.com/Cybbin/knowledge',
    editLinkText: '在 GitHub 上编辑此页',
    lastUpdated: '上次更新',
    nav: [
      {
        text: '前端',
        link: '/frontend/javascript/variable'
      },
      {
        text: 'Vue',
        link: '/vue/start/instructor'
      },
      {
        text: '网络',
        link: '/internet/http'
      },
      {
        text: '数据结构',
        link: '/data-structure/linkedlist'
      }
    ],
    sidebar: {
      '/frontend/': [
        {
          title: 'Javascript',
          collapsable: false,
          children: [
            'javascript/variable',
            'javascript/closure',
            'javascript/prototype',
            'javascript/cross-domain',
            'javascript/event-loop',
            'javascript/code',
            'javascript/currying',
            'javascript/promise'
          ]
        },
        {
          title: '工程化',
          collapsable: false,
          children: [
            'engineer/module'
          ]
        },
        {
          title: 'Javascript 设计模式',
          collapsable: false,
          children: [
            'design-pattern/observer'
          ]
        },
        {
          title: '方案',
          collapsable: false,
          children: [
            'program/authentication-method'
          ]
        }
      ],
      '/internet/': [
        {
          title: '网络',
          collapsable: false,
          children: [
            'http',
            'https',
            'tcp',
            'cdn',
            'dns',
            'proxy'
          ]
        },
        {
          title: '缓存',
          collapsable: false,
          children: [
            'storage'
          ]
        }
      ],
      '/vue/': [
        {
          title: '开始',
          collapsable: false,
          children: [
            'start/instructor',
            'start/mvvm'
          ]
        },
        {
          title: '响应式',
          collapsable: false,
          children: [
            'reactive/defineProperty',
            'reactive/observerArray',
            'reactive/async-render',
            'reactive/getters'
          ]
        },
        {
          title: '数据驱动',
          collapsable: false,
          children: [
            'data-driven/render'
          ]
        },
        {
          title: '组件化',
          collapsable: false,
          children: [
            'component/lifecycle'
          ]
        },
        {
          title: '编译',
          collapsable: false,
          children: [
            'compile/parse',
            'compile/optimize',
            'compile/codegen',
          ]
        },
        {
          title: '拓展',
          collapsable: false,
          children: [
            'extend/v-model',
            'extend/nextTick'
          ]
        },
        {
          title: 'Vue 3.0',
          collapsable: false,
          children: [
            'version3/instructor'
          ]
        },
      ],
      '/data-structure/': [
        {
          title: '链表',
          collapsable: false,
          children: [
            'linkedlist'
          ]
        }
      ],
      '/node/': [
        {
          title: 'Express',
          collapsable: false,
          children: [
            'middleware'
          ]
        },
        {
          title: 'Koa',
          collapsable: false,
          children: [
            'onion',
            'middleware'
          ]
        }
      ]
    }
  }
}
