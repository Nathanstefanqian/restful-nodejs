const fs = require('fs')
const path = require('path')
const { logger } = require(':middle/logger')

// 返回对象类型的字符串表示，精准判断数据类型
const toType = obj => {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

// 获取某文件夹下全部js文件
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

// 成功返回数据的方法
const succ = data => {
  return {
    status: 0,
    data
  }
}

// 失败返回数据的方法
const fail = (message, status = 1) => {
  return {
    status,
    message
  }
}

// 判断路径是否在项目内
const isInRootPath = path => {
  const rootPath = process.cwd()
  const pathPre = path.substring(0, rootPath.length) //  ???
  return rootPath === pathPre
}

const makeDir = dirPath => {
  return new Promise((resolve, reject) => {
    // 这里设定仅允许在项目根目录以内建立文件夹
    // 如果可以调用这个方法在服务器任意地方建立文件夹，那挺可怕的
    if (!isInRootPath(dirPath)) {
      reject(new Error('不支持在项目根目录以外创建文件夹！'))
    }
    fs.access(dirPath, err => {
      if (err) {
        fs.mkdir(dirPath, { recursive: true }, err => {
          if (err) {
            resolve()
          }
        })
      } else {
        resolve()
      }
    })
  })
}

// 移动文件
const moveFile = (sourcePath, targetPath) => {
  return new Promise((resolve, reject) => {
    if (!isInRootPath(sourcePath) || !isInRootPath(targetPath)) {
      reject(new Error('不支持操作项目根目录以外的文件或文件夹！'))
    }
    fs.rename(sourcePath, targetPath, function (err) {
      if (err) {
        reject(new Error(err))
      } else {
        fs.stat(targetPath, function (err, stats) {
          if (err) {
            reject(new Error(err))
          } else {
            resolve(stats)
          }
        })
      }
    })
  })
}

module.exports = {
  getJSFile,
  succ,
  fail,
  logger,
  toType,
  isInRootPath,
  makeDir,
  moveFile
}
