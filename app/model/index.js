const Sequelize = require('sequelize')
const { DB_CONN_SQLITE, DB_PREFIX } = require('../config')
const models = require('./models')
const sequelize = new Sequelize('restful', 'root', 'Qlj20020503@', DB_CONN_SQLITE)
const model = {}

// 初始化所有模型映射到数据库中 ORM
Object.keys(models).forEach(item => {
  const tempModel = sequelize.define(
    item, // 模型的名称
    models[item], // 模型的字段
    {
      freezeTableName: false, // 表示将使用模型的名称作为表名，并且不会对其进行任何更改
      tableName: (DB_PREFIX + item).toLowerCase(), // 这里表名都为 koa_user 这样的形式
      timestamps: false // 该模型不会自动添加时间戳字段（如 createdAt 和 updatedAt)a
    }
  )
  model[item] = tempModel
})
// 这里是sequelize5的语法，在sequlize6中不适用，无法同步模型到数据库中 todo
sequelize.sync()

console.log('model init success')

module.exports = model
