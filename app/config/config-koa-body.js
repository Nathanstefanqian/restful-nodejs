const path = require('path')
const { makeDir } = global.tool
const tempDir = path.resolve(process.cwd(), './tmp')
// 检查临时文件夹是否存在，不存在则创建 todo 临时文件的作用是什么
makeDir(tempDir)
module.exports = {
  multipart: true,
  parsedMethods: ['POST', 'PUT', 'PATCH', 'GET', 'HEAD', 'DELETE'],
  formidable: {
    uploadDir: tempDir,
    hash: 'md5',
    maxFieldsSize: 4 * 1024 * 1024, // 表单字段最大尺寸
    maxFileSize: 2 * 1024 * 1024, // 单个文件最大尺寸
    onFileBegin(name, file) {  // eslint-disable-line
      global.tmpFileUrl = global.tmpFileUrl || 0
      file.path = tempDir + '/upfile_' + global.tmpFileUrl
      // 每10个文件为一个文件夹 ？todo
      global.tmpFileUrl = global.tmpFileUrl >= 10 ? 0 : global.tmpFileUrl + 1
    },
    keepExtensions: false
  },
  onError(err, ctx) {  // eslint-disable-line
    console.log(err)
    // ctx.throw(413, '文件超过限额大小！')
    ctx.throw(500, '服务器故障')
  }
}
