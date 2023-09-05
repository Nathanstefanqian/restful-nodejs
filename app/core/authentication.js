const { PERMISSION } = require(':config')
module.exports = (ctx, apiName, method) => {
  const [reqRoleName, token] = (ctx.header.token || '').split('||')
  console.log('角色', reqRoleName)
  const roleName = ['editor', 'admin'].includes(reqRoleName) ? reqRoleName : 'anyone'
  console.log('权限列表', PERMISSION)
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
    // 校验token是否过期
    console.log(token)
  } else {
    /*
    如权限配置内未配置，可直接放走，交由路由层面处理
     */
    ctx.throw(404, '该角色没有权限哦！')
  }
  return roleName
}
