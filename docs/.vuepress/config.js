module.exports = {
  port: 8081,
  dest: './docs/dist',
  title: 'ContrataDos',
  description: 'Ayuda para ContrataDos',
  extraWatchFiles: ['/docs/**/*'],
  // plugins: [['autonav', { enable: true }]],
  themeConfig: {
    sidebar: 'auto',
    logo: '/logo.png',
    searchPlaceholder: 'Buscar...',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Cliente', link: '/cliente/' },
      { text: 'Profesional', link: '/profesional/' },
    ],
    activeHeaderLinks: true,
    displayAllHeaders: true,
    lastUpdated: 'Ultima actualización',
  },
}
