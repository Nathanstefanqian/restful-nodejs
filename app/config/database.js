const DB_CONN_SQLITE = {
  host: 'localhost',
  dialect: 'sqlite',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  query: { raw: true }, // 执行原始的sql语句
  storage: 'db/data.db',
  logging: false // 不打印数据库操作相关的信息
  // logging: function (sql) {
  //   logger.info(sql)
  // }
}

const DB_CONN_MYSQL = {
  database: 'restful',
  username: 'root',
  password: 'Qlj20020503@', // 别试了 误推 密码已经改了
  host: '47.96.156.243',
  port: 3306,
  dialect: 'mysql',
  logging: false,
  timezone: '+00:00',
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
}

// 数据库表名前缀设置
const DB_PREFIX = 'koa_'

module.exports = {
  DB_CONN_SQLITE,
  DB_CONN_MYSQL,
  DB_PREFIX
}
