// 各类校验数据工具集中放在这里
module.exports = {
  isNumber(num) { // eslint-disable-line
    return /^\d+$/.test(num)
  }
}
