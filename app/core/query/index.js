// 注册不同的方法对应的查询
const { toType } = global.tool

const ls = require('./ls')
const post = require('./post')
const get = require('./get')
const put = require('./put')
const del = require('./del')

const getList = async (model, params) => await ls({}, model, '', params)

const getItem = async (model, params) => {
  if (toType(params) === 'object') {
    const res = await getList(model, params)
    if (res.list.length) {
      return res.list[0].dataValues
    } else {
      return null
    }
  } else {
    return await get({}, model, '', {}, params)
  }
}

module.exports = {
  ls,
  post,
  get,
  put,
  del,
  getList,
  getItem
}
