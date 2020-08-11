module.exports = {
  port: 8081,
  base: '/docs/',
  dest: './docs/dist',
  title: 'ContrataDos',
  description: 'Ayuda para ContrataDos',
  extraWatchFiles: ['/docs/**/*'],
  // plugins: [['autonav', { enable: true }]],
  plugins: [
    [
      '@snowdog/vuepress-plugin-pdf-export',
      {
        puppeteerLaunchOptions: {
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        },
      },
    ],
  ],
  themeConfig: {
    sidebar: 'auto',
    logo: '/logo.png',
    searchPlaceholder: 'Buscar...',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Trabajos', link: '/trabajos/' },
      { text: 'Cliente', link: '/cliente/' },
      { text: 'Profesional', link: '/profesional/' },
    ],
    activeHeaderLinks: true,
    displayAllHeaders: true,
    lastUpdated: 'Ultima actualización',
  },
}
