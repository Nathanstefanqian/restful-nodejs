// import Router from 'koa-router'   es6写法
const path = require('path')
const Router = require('koa-router')
const { API_PREFIX } = require('../config')
const extraAPI = global.tool.getJSFile('../api/extra')
const router = new Router()

// 这里适配koa-router@8.0.8 最新版本为@12.0.0
// 定义了一个方法可以获取所有method的路由，/api/v1 + *
router.all(API_PREFIX + '*', async (ctx, next) => {
  // 获取路由名
  const reqApiName = ctx.request.url.replace(new RegExp(API_PREFIX), '')
  if (extraAPI.includes(reqApiName)) {
    // path.resolve可以解析字符串路径
    const api = require(path.resolve(__dirname, '../api/extra/' + reqApiName))
    await api(ctx, next)
  } else {
    ctx.body = {
      nathan: 1
    }
  }
})

module.exports = router
