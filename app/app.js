// const model = require('./model')
const path = require('path')
const Koa = require('koa')
const koaJson = require('koa-json')
// 最新版的koa-body为6.0.1  这里使用4.1.1
const koaBody = require('koa-body')
const staticFiles = require('koa-static')
const bestRequire = require('best-require')

// best-require 定义常用目录变量
// 它将项目根目录的路径作为第一个参数传给
bestRequire(process.cwd(), {
  '@': '~/app',
  config: ':@/config',
  utils: ':@/utils',
  router: ':@/router',
  middle: ':@/middle',
  core: ':@/core',
  api: ':@/api',
  model: ':@/model'
})
global.tool = require(':utils/tool')
// 引入配置
const { host, port } = require(':config').APP_HOST
const configKoaBody = require(':config/config-koa-body')
// 引入日志处理
const { accessLogger, logger } = require(':@/middle/logger')
global.tool.logger = logger
// 引入自定义的异常处理中间件
const koaError = require(':middle/error')
// 引入路由
const router = require(':router')
// 创建app并注册各种中间件
const app = new Koa()
app.use(koaError)
app.use(accessLogger())
app.use(staticFiles(path.resolve(process.cwd(), './static')))
app.use(koaBody(configKoaBody))
app.use(koaJson({ pretty: true, param: 'pretty' }))
app.use(router.routes())
app.use(router.allowedMethods())
app.on('error', (err, ctx) => {
  // 通过监听error事件，来捕获其中的错误
  console.error('监听到error事件', err)
  logger.error(err)
})

// swagger文档配置项
const swagger = require(':utils/swagger')
app.use(swagger.routes(), swagger.allowedMethods())
const koaSwagger = require('koa2-swagger-ui').koaSwagger
app.use(koaSwagger({
  routePrefix: '/swagger',
  swaggerOptions: {
    url: '/swagger.json' // 代表路由跳转后的地址
  }
}))
app.listen(port, host,
  console.log(`RESTFul CMS api listening on http://${host}:${port}!`)
)
