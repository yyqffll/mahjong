const autoprefixer = require('autoprefixer')
const pxtorem = require('postcss-pxtorem')
module.exports = ({ file }) => {
  let remUnit
  if (file && file.dirname && file.dirname.indexOf('vant') > -1) {
    remUnit = 75
  } else {
    remUnit = 37.5
  }
  return {
    plugins: [
      autoprefixer(),
      pxtorem({
        rootValue: remUnit,
        propList: ['*'],
        selectorBlackList: ['van-circle__layer']
      })
    ]
  }
}
