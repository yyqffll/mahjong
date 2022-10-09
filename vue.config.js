const devHosturl = 'http://localhost:3000'
const proHosturl = 'http://124.223.7.93:3000'
const baseUrl = process.env.NODE_ENV === 'development' ? devHosturl : proHosturl

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  assetsDir: 'static',
  outputDir: 'dist',
  indexPath: 'index.html',
  lintOnSave: false,
  parallel: false,
  chainWebpack (config) {
    config.plugin('html').tap((args) => {
      args[0].title = '眼神-专为屠晓丽打造'
      return args
    })
  },
  devServer: {
    proxy: {
      '/api': {
        target: baseUrl,
        changeOrigin: true
      }
    }
  }
}
