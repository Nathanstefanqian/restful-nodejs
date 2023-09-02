const fs = require('fs')
const path = require('path')
const { logger } = require(':middle/logger')

const getJSFile = filePath => {
  // 使用 path.resolve() 方法获取传入文件路径的绝对路径
  const srcPath = path.resolve(__dirname, filePath)
  const JSFile = []
  const res = fs.readdirSync(srcPath)
  res.forEach(r => {
    const JSFileName = r.split('.')[0]
    JSFileName && JSFile.push(JSFileName)
  })
  // 最后返回的是js的文件名列表
  return JSFile
}

const succ = data => {
  return {
    status: 0,
    data
  }
}

const fail = (message, status = 1) => {
  return {
    status,
    message
  }
}

module.exports = {
  getJSFile,
  succ,
  fail,
  logger
}
