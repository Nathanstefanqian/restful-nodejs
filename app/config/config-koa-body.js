const { makeDir } = global.tool
const { TMP_DIR } = require(':config').APP_DIR
// 检查临时文件夹是否存在，不存在则创建
makeDir(TMP_DIR)

module.exports = {
  multipart: true,
  parsedMethods: ['POST', 'PUT', 'PATCH', 'GET', 'HEAD', 'DELETE'],
  formidable: {
    uploadDir: TMP_DIR,
    hash: 'md5',
    maxFieldsSize: 4 * 1024 * 1024, // 表单字段最大尺寸
    maxFileSize: 2 * 1024 * 1024, // 单个文件最大尺寸
    onFileBegin(name, file) {
      global.tmpFileUrl = global.tmpFileUrl || 0
      file.path = TMP_DIR + '/upfile_' + global.tmpFileUrl
      // 每10个文件为一个文件夹 ？todo
      global.tmpFileUrl = global.tmpFileUrl >= 10 ? 0 : global.tmpFileUrl + 1
    },
    keepExtensions: false
  },
  onError(err, ctx) {
    console.err('请求体传入发现问题', err)
    // ctx.throw(413, '文件超过限额大小！')
    ctx.throw(500, '服务器故障')
  }
}
