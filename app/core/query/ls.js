// 分页数据查询方法，支持各种复杂查询条件
/*
/apiname?a=1,2,3,4,5&sort=
*/
const { Op } = require('sequelize')
const models = require(':model')
const { PAGE_SIZE } = require(':config')
const { isNumber } = global.tool.verify

// 从请求参数中找出非标准参数并输出为对象
const getArgs = (params) => {
  const args = {}
  for (const i in params) {
    if (!['pagesize', 'page', 'time', 'sort'].includes(i)) args[i] = params[i]
  }
  console.log('参数为', args)
  return args
}

// 非标配置项处理字典
const ArgHandle = {
  like(arg) { // eslint-disable-line
    // 模糊查询
    return { [Op.like]: `%${arg}&` }
  },
  neq(arg) { // eslint-disable-line
    // 不等查询
    return { [Op.ne]: arg }
  },
  gteq(arg) { // eslint-disable-line
    // 大于等于查询
    return { [Op.gte]: arg }
  },
  lt(arg) { // eslint-disable-line
    // 小于查询
    return { [Op.lt]: arg }
  },
  lteq(arg) { // eslint-disable-line
    // 小于等于查询
    return { [Op.lte]: arg }
  },
  in(arg) { // eslint-disable-line
    // in 查询 （和 无 argConf 查询多条记录是一样的）
    return { [Op.in]: arg.split(',') }
  },
  nin(arg) { // eslint-disable-line
    // notIn 查询
    return { [Op.notIn]: arg.split(',') }
  }
}

module.exports = async (ctx, model, method, params) => {
  const { pagesize = PAGE_SIZE, page = 0, time } = params
  model = models[model]
  const modelField = Object.keys(model.rawAttributes)
  // 校验分页参数
  console.log(isNumber(pagesize), page)
  if (!isNumber(pagesize) || !isNumber(page)) ctx.throw(412, '参数非法，pagesize和page只能是数字')

  // 构建基础where参数
  const condition = {
    where: {},
    offset: page * pagesize,
    limit: pagesize,
    order: [['id', 'DESC']]
  }
  // pagesize 为 -1 时 查询全部数据
  if (pagesize === '-1') {
    delete condition.offset
    delete condition.limit
  }
  // 处理排序
  if (params.sort) {
    const sortArr = params.sort.split(',')
    const order = []
    sortArr.forEach(i => {
      let sortField = i
      if (i.substring(0, 1) === '-') {
        sortField = i.substring(1)
        order.push([sortField, 'ASC'])
      } else {
        order.push([sortField, 'DESC'])
      }
      // 如果排序的字段不在模型中
      if (!modelField.includes(sortField)) ctx.throw(412, 'sort 排序参数包含非法字段')
    })
    condition.order = order
  }

  // 处理时间参数
  if (time) {
    // 起始时间戳-结束时间戳 或者 计算起始时间 st（表示当天的开始时间）和结束时间 et（表示下一天的开始时间）
    const timeArr = time.split('-')
    const timeArrLen = timeArr.length
    let st, et
    if (timeArrLen > 2) ctx.throw(412, 'time参数有误')
    if (timeArr.filter(i => !isNumber(i)).length) ctx.throw(412, 'time参数只接受时间戳数字')
    if (timeArrLen === 1) {
      const t = +timeArr[0]
      st = t - t % 86400000
      et = st + 86400000
    } else {
      st = +timeArr[0]
      et = +timeArr[1]
    }
    condition.where.time = {
      [Op.gte]: st,
      [Op.lte]: et
    }
  }

  // 处理非标准参数
  const args = getArgs(params)
  for (const i in args) {
    const [fieldName, argConf, arrErr] = i.split('-')
    if (arrErr) ctx.throw(412, i + ' 请求参数配置非法')
    if (!modelField.includes(fieldName)) ctx.throw(412, '请求参数包含非法字段' + fieldName)
    if (!argConf) {
      /*
      处理相等条件
      支持 a = 1 单个相等条件查询
      支持 a = 1,2,3,4,5多个相等条件查询
      会被解析为 in查询
       */
      const argArr = args[i].split(',')
      condition.where[fieldName] = argArr.length === 1 ? args[i] : { [Op.in]: argArr }
    } else {
      // 处理配置查询参数
      if (ArgHandle[argConf]) {
        const handleReq = ArgHandle[argConf](args[i])
        const condField = condition.where[fieldName]
        /*
          查看该字段是否已有非标配置参数
          若有，则追加 and 条件
            如 a-gt=10&a-lt=1&a-neq=5 这样的多重复核查询条件的支持
         */
        condition.where[fieldName] = condField ? { [Op.and]: [condField, handleReq] } : handleReq
      } else { // 如果不存在这个配置的话
        ctx.throw(412, i + ' 请求参数配置不被支持')
      }
    }
  }

  // 查询从数据库查询的数据
  const res = await model.findAndCountAll(condition).then(r => {
    return {
      page,
      list: r.rows,
      count: r.count
    }
  })
  return res
}
