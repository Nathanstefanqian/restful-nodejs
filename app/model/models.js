const Sequelize = require('sequelize')
const { STRING, INTEGER, TEXT, DATE, NOW } = Sequelize

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
  Date: { type: DATE, defaultValue: NOW }
}

module.exports = {
  // 超级管理员
  Manages: {
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
  User: {
    username: STRING,
    password: STRING
  }
}
