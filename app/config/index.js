const path = require('path')
const PERMISSION = require('./permission')
const { DB_CONN_SQLITE, DB_CONN_MYSQL, DB_PREFIX } = require('./database')
const XSS_WHITE_LIST = require('./xss-white-list')

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

/*
  session type 支持 memory 内存存储 和 file 文件存储
  除非是在开发阶段 否则推荐 memory 存储
  因为 file 存储的 session 文件不会自动删除，会越来越多
  有更高要求，可参考 memory 写法，增加 redis 数据库
    代码在 /app/core/session.js
*/
const SESSION_TYPE = 'file'

// 初始化数据库时是否添加测试数据
const IS_POST_TEST_DB = true

const BASEURL = 'https://api.weixin.qq.com'

module.exports = {
  SESSION_TYPE,
  DB_CONN_MYSQL,
  DB_CONN_SQLITE,
  DB_PREFIX,
  APP_HOST,
  API_PREFIX,
  PAGE_SIZE,
  PERMISSION,
  KEY,
  APP_DIR,
  IS_POST_TEST_DB,
  XSS_WHITE_LIST,
  BASEURL
}
