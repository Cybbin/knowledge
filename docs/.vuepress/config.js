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
      '/internet/': [
        {
          title: '网络',
          collapsable: false,
          children: [
            // ['prepare/', 'Introduction'],
            'http',
            'https',
            'storage',
            'tcp',
            'cdn',
            'dns'
          ]
        }
      ]
    }
  }
}
