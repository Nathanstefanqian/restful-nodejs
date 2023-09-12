const Sequelize = require('sequelize')
const { STRING, INTEGER, TEXT } = Sequelize

// 自定义私有字段类型
const privateTypes = {
  Mobile: {
    type: INTEGER,
    validate: {
      is: /^1[3456789]\d{9}$/i
    }
  },
  Url: {
    type: STRING,
    validate: {
      isUrl: true
    }
  },
  Email: {
    type: STRING,
    validate: {
      isEmail: true
    }
  },
  Date: { type: INTEGER, defaultValue: () => +new Date() }
}
// 定义了三种角色
module.exports = {
  // 超级管理员
  Admin: {
    account: STRING, // 超级管理员账号
    password: TEXT, // 超级管理员密码
    name: STRING, // 姓名
    mobile: privateTypes.Mobile,
    email: privateTypes.Email,
    time: privateTypes.Date
  },
  // 作者
  Author: {
    name: STRING, // 作者姓名
    avatar: STRING, // 作者头像
    mark: TEXT, // 备注
    mobile: privateTypes.Mobile,
    email: privateTypes.Email,
    website: privateTypes.Url,
    time: privateTypes.Date
  },
  // 文章栏目
  Channel: {
    pid: INTEGER, // 归属父ID
    name: STRING, // 栏目名称
    sort: INTEGER, // 栏目排序
    keywords: STRING, // 栏目关键词
    description: TEXT, // 栏目描述
    time: privateTypes.Date
  },
  // 文章小编
  Editor: {
    account: STRING,
    password: TEXT,
    name: STRING,
    avatar: STRING,
    mobile: privateTypes.Mobile,
    email: privateTypes.Email,
    website: privateTypes.Url,
    time: privateTypes.Date
  },
  // 站点信息
  Site: {
    name: STRING, // 站点名称
    title: STRING, // 站点标题
    logo: STRING, // 站点logo
    keywords: TEXT, // 站点关键词
    description: TEXT, // 站点描述
    copyright: TEXT, // 站点版权
    time: privateTypes.Date
  }
}
