// import Router from 'koa-router'   es6写法
const Router = require('koa-router')
const core = require(':core')
const models = require('../model')
const { API_PREFIX } = require(':config')
const { getJSFile } = global.tool
const extraAPI = getJSFile('../api/extra')

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
  console.log('模型', res)
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
  console.log(reqPath.split('/').map(i => i.toLocaleLowerCase()))
  const [reqApiName, reqId, errPath] = reqPath.split('/').map(i => i.toLocaleLowerCase())
  console.log(reqApiName, reqId, errPath)
  if (errPath) ctx.throw(400, '请求路径不支持')
  // 根据请求计算内置请求方法
  const reqMethod = calcMethodAndCheckUrl(reqApiName, reqId, ctx)
  if (extraAPI.includes(reqApiName)) {
    // 拓展接口直接调用拓展文件并执行
    await require(':api/extra/' + reqApiName)(ctx, next)
  } else if (Object.keys(RestFulModel).includes(reqApiName)) {
    // 标准RESTFUL 查询
    const reqModelName = RestFulModel[reqApiName]
    await core(ctx, reqModelName, reqMethod, reqApiName, reqId, next)
  } else {
    ctx.throw(404)
  }
})

module.exports = router
