const bestRequire = require('best-require')

// best-require 定义常用目录变量
bestRequire(process.cwd(), {
  '@': '~/app',
  config: ':@/config',
  utils: ':@/utils',
  router: ':@/router',
  middle: ':@/middle',
  core: ':@/core',
  api: ':@/api',
  model: ':@/model',
  query: ':@/core/query'
})
const app = require('./app/index')
const { host, port } = require(':config').APP_HOST
app.listen(port, host,
  console.log(`RESTFul CMS api listening on http://${host}:${port}!`)
)
