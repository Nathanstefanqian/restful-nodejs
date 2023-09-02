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
  middle: ':@/middle'
})
global.tool = require(':utils/tool')

// 引入配置
const { host, port } = require(':config').APP_HOST
const configKoaBody = require(':config/config-koa-body')
// 引入自定义的异常处理中间件
const koaError = require(':middle/error')
const { accessLogger, logger } = require(':@/middle/logger')
// 引入路由
const router = require(':router')
// 创建app并注册各种中间件
const app = new Koa()
app.use(koaError)
app.use(accessLogger())
app.use(staticFiles(path.resolve(__dirname, '../static')))
app.use(koaBody(configKoaBody))
app.use(koaJson({ pretty: false, param: 'pretty' }))
app.use(router.routes())
app.use(router.allowedMethods())
app.on('error', (err, ctx) => {
  // 通过监听error事件，来捕获其中的错误
  logger.error(err)
})

app.listen(port, host,
  console.log(`RESTFul CMS api listening on http://${host}:${port}!`)
)
