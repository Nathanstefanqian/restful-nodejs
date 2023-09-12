const path = require('path')
const PERMISSION = require('./permission')
const { DB_CONN_SQLITE, DB_CONN_MYSQL, DB_PREFIX } = require('./database')

// app 运行设置
const APP_HOST = {
  host: '0.0.0.0',
  port: 3000
}

// 分页列表默认每页条数
const PAGE_SIZE = 10

// 路由前缀
const API_PREFIX = '/api/v1/'

// 存储目录路径
const APP_DIR = {
  TMP_DIR: path.resolve(process.cwd(), './tmp'),
  LOG_DIR: path.resolve(process.cwd(), './log')
}

// 设置RSA密钥文件配置
const KEY = {
  RSA_PRIVATE_KEY_PATH: path.resolve(__dirname, './key/rsa_private_key.pem'),
  RSA_PUBLIC_KEY_PATH: path.resolve(__dirname, './key/rsa_public_key.pem')
}

// 初始化数据库时是否添加测试数据
const IS_POST_TEST_DB = true

module.exports = {
  DB_CONN_MYSQL,
  DB_CONN_SQLITE,
  DB_PREFIX,
  APP_HOST,
  API_PREFIX,
  PAGE_SIZE,
  PERMISSION,
  KEY,
  APP_DIR,
  IS_POST_TEST_DB
}
