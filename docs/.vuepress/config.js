module.exports = {
  base: '/knowledge/',
  dest: 'dist',
  title: '知识库',
  themeConfig: {
    repo: 'https://github.com/Cybbin/knowledge',
    editLinkText: '在 GitHub 上编辑此页',
    lastUpdated: '上次更新',
    nav: [
      // {
      //   text: 'text',
      //   link: '/internet/'
      // }
    ],
    sidebar: {
      '/frontend/': [
        {
          title: 'Javascript',
          collapsable: false,
          children: [
            'javascript/variable',
            'javascript/prototype',
            'javascript/event-loop'
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
            'internet/dns'
          ]
        },
        {
          title: 'Javascript 设计模式',
          collapsable: false,
          children: [
            'design-pattern/observer'
          ]
        }
      ],
    }
  }
}
