const autoprefixer = require('autoprefixer')
const pxtorem = require('postcss-pxtorem')
const devHosturl = 'http://localhost:3001'
const proHosturl = 'http://124.223.7.93:3001'
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
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          autoprefixer(),
          pxtorem({
            rootValue: 37.5,
            propList: ['*']
            // selectorBlackList: ['van-']
          })
        ]
      }
    }
  },
  devServer: {
    proxy: {
      '/ecapi': {
        target: baseUrl,
        changeOrigin: true
      }
    }
  }
}
