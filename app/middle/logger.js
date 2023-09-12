const koaLog = require('koa-log4')
const path = require('path')
const fs = require('fs')
const { LOG_DIR } = require(':config').APP_DIR
// 如果不存在则创建
fs.access(LOG_DIR, err => {
  if (err) {
    fs.mkdir(LOG_DIR, { recursive: true }, err => {
      console.error(err)
    })
  } else {
    console.error(err)
  }
})

koaLog.configure({
  appenders: {
    access: {
      type: 'dateFile',
      pattern: '-yyyy-MM-dd.log', // 生成文件名的规则
      filename: path.resolve(LOG_DIR, 'access.log') // 生成文件名
    },
    application: {
      type: 'dateFile',
      pattern: '-yyyy-MM-dd.log',
      filename: path.resolve(LOG_DIR, 'application.log')
    },
    out: {
      type: 'console'
    }
  },
  categories: {
    default: { appenders: ['out'], level: 'info' },
    access: { appenders: ['access'], level: 'info' },
    application: { appenders: ['application'], level: 'WARN' }
  }
})

// // exports.accessLogger = () => koaLog.koaLogger(koaLog.getLogger('access')) // 记录所有访问级别的日志
// // exports.logger = koaLog.getLogger('application') // 记录所有应用级别的日志

module.exports = {
  accessLogger: () => koaLog.koaLogger(koaLog.getLogger('access')),
  logger: koaLog.getLogger('application')
}
