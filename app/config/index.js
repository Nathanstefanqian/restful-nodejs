const DB_CONN = {
  host: 'localhost',
  dialect: 'sqlite',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  storage: 'db/data.db'
}

// app 运行设置
const APP_HOST = {
  host: '0.0.0.0',
  port: 3000
}

// 表名前缀
const DB_PREFIX = 'koa_'

// 路由前缀
const API_PREFIX = '/api/v1/'

module.exports = {
  DB_CONN,
  DB_PREFIX,
  APP_HOST,
  API_PREFIX
}
