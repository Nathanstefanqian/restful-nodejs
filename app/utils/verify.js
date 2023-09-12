// 各类校验数据工具集中放在这里
module.exports = {
  isNumber(num) { // eslint-diable-line
    return /^-?\d+$|^(-1)$/.test(num)
  }
}
