module.exports = {
  apps: [{
    name: 'eyeChat',
    script: './index.ts/',
    watch: '.',
    cwd: './',
    interpreter: '../node_modules/.bin/ts-node',
    env: {
      PM2_SERVE_PATH: '../mongodb'
    }
  }]
}
