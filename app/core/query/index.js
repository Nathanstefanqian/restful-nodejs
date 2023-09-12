// 注册不同的方法对应的查询
const { toType } = global.tool

const { IS_POST_TEST_DB } = require(':config')
const ls = require('./ls')
const post = require('./post')
const get = require('./get')
const put = require('./put')
const del = require('./del')

// 系统内部查询数据列表方法
const getList = async (model, params) => await ls({}, model, '', params)

// 系统内部查询单条数据方法
const getItem = async (model, params) => {
  if (toType(params) === 'object') {
    const res = await getList(model, params)
    if (res.list.length) {
      // todo 这里存在一个问题
      // return res.list[0].dataValues
      return res.list[0]
    } else {
      return null
    }
  } else {
    return await get({}, model, '', {}, params)
  }
}

// 系统内部添加新数据方法
const postItem = async (model, params) => {
  const res = await post({}, model, '', params)
  return res
}

// 初始化空数据时添加默认的数据方法
const initDb = async () => {
  const hasManage = await getItem('Admin', 'first')
  if (!hasManage) {
    postItem('Admin', {
      account: 'admin',
      password: 'DQnIHd5oupt/oZvkBQ/qvgl1gXTK3NwDJVYjxnyG2zXSa3debJ5yIX/jDzSc3SGK+adHUOxWllQa8leLcCCbOhdB89YbGicESufr086xWaWDx0fPsELTRUTT0yWQLUJDVT1WrnHQqAMsI+KgM/28zULWgkrqj190O4oBBgwwGLc='
    }).then(() => {
      console.log('初始管理员账号添加完成 admin: 123456')
    })
  }
  const hasSite = await getItem('Site', 'first')
  if (!hasSite) {
    postItem('Site', {
      name: 'RESTFul CMS koa By Nathan',
      title: 'RESTFul CMS koa By FungLeo',
      keywords: 'RESTFul,CMS,koa',
      copyright: 'By FungLeo'
    }).then(() => {
      console.log('初始系统信息数据完成')
    })
  }
  const hasChan = await getItem('Channel', 'first')
  if (!hasChan) {
    const calcchannelMockDat = (pid, pre = '顶级') => {
      return 'leo'.split('').map((i, index) => {
        return { pid, name: `${pre}栏目${pid}${index}` }
      })
    }
    const { ids } = await postItem('Channel', calcchannelMockDat(0))
    ids.forEach(async i => {
      const { ids } = await postItem('Channel', calcchannelMockDat(i, '二级'))
      ids.forEach(async i => {
        await postItem('Channel', calcchannelMockDat(i, '三级'))
        console.log('初始测试栏目数据完成')
      })
    })
  }
}
IS_POST_TEST_DB && initDb()

module.exports = {
  ls,
  post,
  get,
  put,
  del,
  getList,
  getItem,
  postItem
}
