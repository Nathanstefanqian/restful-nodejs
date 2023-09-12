const path = require('path')
const DB_CONN_SQLITE = {
  host: 'localhost',
  dialect: 'sqlite',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
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

// app 运行设置
const APP_HOST = {
  host: '0.0.0.0',
  port: 3000
}

// 分页列表默认每页条数
const PAGE_SIZE = 10

// 表名前缀
const DB_PREFIX = 'koa_'

// 路由前缀
const API_PREFIX = '/api/v1/'

const PERMISSION = require('./permission')

const APP_DIR = {
  TMP_DIR: path.resolve(process.cwd(), './tmp'),
  LOG_DIR: path.resolve(process.cwd(), './log')
}

// 设置RSA密钥文件配置
const KEY = {
  RSA_PRIVATE_KEY_PATH: path.resolve(__dirname, './key/rsa_private_key.pem'),
  RSA_PUBLIC_KEY_PATH: path.resolve(__dirname, './key/rsa_public_key.pem')
}

module.exports = {
  DB_CONN_SQLITE,
  DB_CONN_MYSQL,
  DB_PREFIX,
  APP_HOST,
  API_PREFIX,
  PAGE_SIZE,
  PERMISSION,
  KEY,
  APP_DIR
}
