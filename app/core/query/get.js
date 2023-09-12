// 获取单条数据方法
const models = require(':model')
module.exports = async (ctx, model, method, params, id) => {
  const condition = id === 'first' ? {} : { where: { id } }
  const res = await models[model].findOne(condition).then(r => r).catch(err => console.error('get方法出错', err))
  return res
}
