const { succ, rsa } = global.tool
const { getItem } = require(':query')
module.exports = async (ctx, params, next) => {
  console.log(params)
  const { account, password, role } = params
  // 校验传参是否为空
  if (!account || !password || !role) ctx.throw(400, '请输入用户名密码')
  // 校验登录角色参数
  if (!['admin', 'editor'].includes(role)) ctx.throw(400, '用户角色参数错误')
  // 校验传入密码是否能解密，如能解密则赋值 reqPw
  const reqPw = await rsa.decrypt(password).catch(e => ctx.throw(400, '用户名密码错误'))
  // 从数据库存储用户信息，根据不同角色，从不同表内读取
  const dbUser = await getItem(role === 'admin' ? 'Admin' : 'Editor', { account })
  // 校验传入用户是否存在
  if (!dbUser) ctx.throw(400, '用户名不存在')
  const dbPw = await rsa.decrypt(dbUser.password).catch(e => ctx.throw(500, '用户数据存在异常'))
  // 校验密码是否正确
  if (dbPw !== reqPw) ctx.throw(400, '密码错误')

  // 用户通过校验，此处需要增加一个用户 session 管理机制

  ctx.cookies.set('token', 'admin||xxxxxx', {
    httpOnly: true
  })
  ctx.body = succ({ token: 'admin||xxxxx' })
}
