const path = require('path')
const fs = require('fs')

const uploadDir = path.resolve(process.cwd(), './upload')
// 检查临时文件夹是否存在，不存在则创建
fs.access(uploadDir, err => {
  if (err) {
    fs.mkdir(uploadDir, { recursive: true }, err => {
      if (err) throw err
    })
  }
})
module.exports = {
  multipart: true,
  parsedMethods: ['POST', 'PUT', 'PATCH', 'GET', 'HEAD', 'DELETE'],
  formidable: {
    uploadDir: uploadDir,
    hash: 'md5',
    maxFieldsSize: 2 * 1024 * 1024, // 表单字段最大尺寸
    maxFileSize: 2 * 1024 * 1024, // 单个文件最大尺寸
    onFileBegin(name, file) {  // eslint-disable-line
      global.tmpFileUrl = global.tmpFileUrl || 0
      file.path = uploadDir + '/upfile_' + global.tmpFileUrl
      // 每10个文件为一个文件夹 ？todo
      global.tmpFileUrl = global.tmpFileUrl >= 10 ? 0 : global.tmpFileUrl + 1
    },
    keepExtensions: false
  },
  onError(_, ctx) {  // eslint-disable-line
    ctx.throw(411, '文件超过限额大小！')
  }
}
