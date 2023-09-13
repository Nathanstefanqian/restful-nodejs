const query = require('./query')
const { succ, getJSFile } = global.tool
const beforeHandle = getJSFile('../api/restful/before')
const afterHandle = getJSFile('../api/restful/after')
module.exports = async (ctx, allParams, next) => {
  const { model, method, apiName, id } = allParams
  // 根据请求方法处理参数
  // 如果有前处理，加载前处理
  if (beforeHandle.includes(apiName)) {
    const handle = require(':api/restful/before/' + apiName)[method]
    if (handle) allParams.params = await handle(ctx, allParams)
    // 在前处理中没有任何返回值则终止后续操作
    if (!allParams.params) return
  }
  // 进入数据库查询
  let data = await query[method](ctx, model, method, allParams.params, id)
  // 如果有后处理，对查询结果进行处理
  if (afterHandle.includes(apiName)) {
    const handle = require(':@/api/restful/after/' + apiName)[method]
    if (handle) data = await handle(data, ctx, allParams)
  }

  ctx.body = succ(data)
}
