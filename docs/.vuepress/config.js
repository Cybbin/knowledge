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
        text: 'Front End',
        link: '/frontend/javascript/variable'
      },
      {
        text: 'Vue',
        link: '/vue/instructor'
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
            'javascript/code'
          ]
        },
        {
          title: '网络',
          collapsable: false,
          children: [
            // ['prepare/', 'Introduction'],
            'internet/http',
            'internet/https',
            'internet/storage',
            'internet/tcp',
            'internet/cdn',
            'internet/dns',
            'internet/proxy'
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
      '/vue/': [
        {
          title: '开始',
          collapsable: false,
          children: [
            'instructor'
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
          title: '响应式原理',
          collapsable: false,
          children: [
            'reactive/getters'
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
            'extend/v-model'
          ]
        },
        {
          title: 'Vue 3.0',
          collapsable: false,
          children: [
            'version3/instructor'
          ]
        },
      ]

    }
  }
}
