const query = require('./query')
const { succ, getJSFile, objKeyLower } = global.tool
const beforeHandle = getJSFile('../api/restful/before')
const afterHandle = getJSFile('../api/restful/after')
module.exports = async (ctx, model, method, name, id, next) => {
  // 根据请求方法处理参数
  let params = method === 'ls' ? objKeyLower(ctx.request.query) : ctx.request.body
  // console.log('参数校验', params)
  // console.log('方法', method)
  // 如果有前处理，加载前处理
  if (beforeHandle.includes(name)) {
    const handle = require(':api/restful/before/' + name)[method]
    if (handle) params = handle(params, ctx, id)
  }
  // 进入数据库查询
  let data = await query[method](ctx, model, method, params, id)
  // 如果有后处理，对查询结果进行处理
  if (afterHandle.includes(name)) {
    const handle = require(':api/restful/after/' + name)[method]
    if (handle) data = handle(data, ctx)
  }
  ctx.body = succ(data)
}
