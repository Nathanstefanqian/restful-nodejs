/*
  更新数据方法
  1. 支持未知ID单条数据修改
  url: /xxx/first
  data: {...}
  此方法会找到数据库第一条数据，进行对应修改，用于特殊用途
  2. 支持单ID数据修改
  url: /xxx/:id
  data: {...}
  正常使用，数据为需要修改的数据字典
  3. 支持多ID单数据修改
  url: /xxx/1,2,3,4,5,6
  data: {...}
  支持将多条数据内容进行统一处理，例如批量加入回收站或者批量转移归属栏目
  4. 支持多ID多数据修改
  url: /xxx/batch
  data: [{...}, {...}, {...}, {...}]
  将需要多条修改的数据构成数组传进来，
  每个数据里面必须包含'id'字段，否则参数错误
*/
const models = require(':model')
const { toType, logger } = global.tool

module.exports = async (ctx, model, method, params, id) => {
  // 构建返回数据结构
  const res = { succ: [], fail: [] }
  // 构建添加数据方法，update不会返回数据，使用findOne方法先查询，再保存的做法
  const putItem = async (id, item) => {
    const where = id === 'first' ? {} : { where: { id } }
    const data = await models[model].findOne(where).catch(e => logger.error(e.message))
    if (data) {
      for (const i in item) data[i] = item[i]
      const saveData = await data.save()
      res.succ.push(saveData.id)
    } else {
      res.fail.push(id)
    }
  }

  // 处理逻辑
  if (id === 'batch') {
    // 多ID多数据修改
    // 数据校验
    if (toType(params) !== 'array') ctx.throw(412, '批量更新数据，数据参数必须为数组对象')
    if (params.filter(r => !r.id).length) ctx.throw(412, '批量更新数据，每条数据必须包含ID字段')
    await Promise.all(params.map(async item => {
      await putItem(item.id, item)
    }))
  } else {
    // 数据校验
    if (toType(params) !== 'object') ctx.throw(412, '更新数据，数据参数必须为对象')
    delete params.id
    if (!Object.keys(params).length) ctx.throw(412, '更新数据，数据对象不能为空')

    if (id === 'first') {
      // 未知ID单条数据修改
      await putItem(id, params)
    } else {
      // 多ID单数据修改 以及 单ID单数据修改
      const ids = id.split(',')
      await Promise.all(ids.map(async itemId => {
        await putItem(itemId, params)
      }))
    }
  }
  return res
}
