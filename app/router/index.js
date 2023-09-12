// import Router from 'koa-router'   es6写法
const Router = require('koa-router')
const Core = require(':core')
const models = require('../model')
const { API_PREFIX } = require(':config')
const { getJSFile, objKeyLower } = global.tool
const extraAPI = getJSFile('../api/extra')
const Authentication = require(':core/authentication')
/*
  获取数据库模型数据，并输出为对象
  {
    article: Article,
    site: Site
  }
  key 用于关联项目内操作，value 用于模型操作
*/
const RestFulModel = (() => {
  const res = {}
  Object.keys(models).forEach(i => {
    res[i.toLocaleLowerCase()] = i
  })
  return res
})()

const calcMethodAndCheckUrl = (reqApiName, reqId, ctx) => {
  const { method } = ctx.request
  let reqMethod = method.toLocaleLowerCase()
  if (reqId) {
    if (method === 'POST') ctx.throw(405)
    if (method === 'DELETE') reqMethod = 'del'
  } else {
    if (['DELETE', 'PUT'].includes(method)) ctx.throw(405)
    if (method === 'GET') reqMethod = 'ls'
  }
  return reqMethod
}

const router = new Router()

/*
  计算请求方法
  /apiname
    GET     ls      获取资源列表
    POST    post    创新新资源
  /apiname/:id
    GET     get     获取指定ID资源
    PUT     put     更新指定ID资源
    DELETE  del     删除指定ID资源
*/

// 这里适配koa-router@8.0.8 最新版本为@12.0.0
// 定义了一个方法可以获取所有method的路由，/api/v1 + *

router.all(API_PREFIX + '*', async (ctx, next) => {
  // 获取路由名
  // 根据请求path获取请求apiname以及请求 id，并判断path是否合法
  const reqPath = ctx.request.path.replace(new RegExp(API_PREFIX), '')
  const [reqApiName, reqId, errPath] = reqPath.split('/').map(i => i.toLocaleLowerCase())
  // reqApiName代表路由名， reqId代表/:id，errPath代表多余的路由
  if (errPath) ctx.throw(400, '请求路径不支持')
  // 根据请求计算内置请求方法
  const reqMethod = calcMethodAndCheckUrl(reqApiName, reqId, ctx)
  // 查看当前所属角色
  const roleName = await Authentication(ctx, reqApiName, reqMethod)
  console.log('当前请求用户的角色为', roleName)
  // 根据请求方法整理参数
  const reqParams = reqMethod === 'ls' ? objKeyLower(ctx.request.query) : ctx.request.body
  if (extraAPI.includes(reqApiName)) {
    // 拓展接口直接调用拓展文件并执行
    await require(':api/extra/' + reqApiName)(ctx, reqParams, next)
  } else if (Object.keys(RestFulModel).includes(reqApiName)) {
    // 标准RESTFUL 查询
    const reqModelName = RestFulModel[reqApiName]
    await Core(ctx, reqParams, reqModelName, reqMethod, reqApiName, reqId, next)
  } else {
    ctx.throw(404, '没有找到该路由哦')
  }
})

module.exports = router
