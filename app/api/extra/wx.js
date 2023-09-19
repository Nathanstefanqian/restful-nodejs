const { service, succ } = global.tool

const data = {
  grant_type: 'client_credential',
  appid: 'wxb6b66008bee95427',
  secret: 'e214de28749d64e594193685206d029e'
}
const getAccessToken = () => service.get('/cgi-bin/token', data) // 获取接口调用凭证

const getStableAccessToken = () => service.post('/cgi-bin/stable_token', data) // 获取全局接口调用凭证

module.exports = async (ctx, { params }, next) => {
  const res = await getAccessToken()
  ctx.body = succ(res)
}
