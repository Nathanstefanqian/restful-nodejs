const { PERMISSION } = require(':config')
const { checkToken } = require(':core/session')
module.exports = async (ctx, apiName, method) => {
  /*
    获取 token 并从 token 获取用户角色
    同时支持从header和cookies中读取token
   */
  const token = ctx.header.token || ctx.cookies.get('token') || ''
  const tokenCheckRes = await checkToken(token)
  const reqRoleName = tokenCheckRes ? tokenCheckRes.role : ''
  console.log('当前请求角色', reqRoleName)
  const roleName = ['editor', 'admin'].includes(reqRoleName) ? reqRoleName : 'anyone'
  const apiPerm = PERMISSION[apiName]
  if (apiPerm) {
    const apiRolePerm = apiPerm[roleName]
    if (!apiRolePerm) ctx.throw(500, '服务器接口权限配置有误')
    if (!apiRolePerm.includes(method)) {
      if (roleName === 'anyone') {
        ctx.throw(401, '请登录后操作')
      } else {
        ctx.throw(403, '您没有权限操作')
      }
    }
  } else {
    // 如权限配置内未配置，可直接放走，交由路由层面处理
    ctx.throw(404, '该角色没有权限哦！')
  }
  return { roleName, token }
}
