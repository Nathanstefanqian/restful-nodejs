/*
删除数据方法
  /xxx/1,2,3,4,5
*/

const models = require(':model')
const { logger } = global.tool

module.exports = async (ctx, model, method, params, id) => {
  console.log(id)
  const res = { succ: [], fail: [] }
  const ids = id.split(',')
  await Promise.all(ids.map(async id => {
    const data = await models[model].findOne({ where: { id } }).catch(e => logger.error(e.message))
    console.log(data)
    if (data) {
      await data.destroy() // 硬删除
      res.succ.push(data.id)
    } else {
      res.fail.push(id)
    }
  }))
  return res
}
