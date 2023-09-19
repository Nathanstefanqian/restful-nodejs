const axios = require('axios')
const { BASEURL } = require(':config')
// 创建axios实例
const service = axios.create({
  baseURL: BASEURL,
  timeout: 5000,
  headers: {
    'Content-type': 'application/json;charset=utf-8'
  }
})

// 请求拦截器
service.interceptors.request.use((config) => {
  return config
})

// 响应拦截器
service.interceptors.response.use(({ data }) => {

  return data
}, err => {
  console.log(err)
})

module.exports = service
