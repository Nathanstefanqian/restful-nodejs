const router = require('koa-router')() // 引入路由函数
const path = require('path')
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerDefinition = {
  info: {
    title: 'api interface',
    version: '1.0.0',
    description: 'API'
  },
  host: 'localhost:3000',
  basePath: '/',
  tags: [
    {
      name: 'user',
      description: '用户相关接口'
    },
    {
      name: 'icon',
      description: '图标相关接口'
    },
    {
      name: 'atlas',
      description: '图标仓库相关接口'
    },
    {
      name: 'project',
      description: '项目相关接口'
    }
  ]
}

const options = {
  swaggerDefinition,
  apis: [path.join(__dirname, '../router/*.js')] // 写有注解的router的存放地址，最好是path.join()
}

const swaggerSpec = swaggerJSDoc(options)

// 通过路由获取生成的注释文件
router.get('/swagger.json', async ctx => {
  ctx.set('Content-Type', 'application/json')
  ctx.body = swaggerSpec
})
module.exports = router
