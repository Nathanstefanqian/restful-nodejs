module.exports = (ctx, next) => {
  ctx.body = global.tool.succ({ love: 1 })
}
