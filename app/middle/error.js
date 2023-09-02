// 异常处理
module.exports = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500
    ctx.body = global.tool.fail(err.message, ctx.status)
    // 记录应用级的异常到日志中
    global.tool.logger.error(err)
  }
}
