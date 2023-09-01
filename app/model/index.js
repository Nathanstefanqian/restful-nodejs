const Sequelize = require('sequelize')
const { DB_CONN, DB_PREFIX } = require('../config')
const models = require('./models')
const sequelize = new Sequelize(DB_CONN)
const model = {}

// 初始化所有模型映射到数据库中 ORM
Object.keys(models).forEach(item => {
  const tempModel = sequelize.define(
    item, // 模型的名称
    models[item], // 模型的字段
    {
      freezeTableName: true, // 表示将使用模型的名称作为表名，并且不会对其进行任何更改
      tableName: (DB_PREFIX + item).toLowerCase(),
      timestamps: false // 该模型不会自动添加时间戳字段（如 createdAt 和 updatedAt)a
    }
  )
  model[item] = tempModel
})

// sequelize.sync() 是 Sequelize 库的一个方法，用于同步数据库和 Sequelize 模型定义。
// 它会根据模型定义自动创建数据库表（如果表不存在），或者更新已存在的表结构（如果表已经存在但模型定义发生了更改）。
sequelize.sync()

console.log('model init success')

module.exports = model
