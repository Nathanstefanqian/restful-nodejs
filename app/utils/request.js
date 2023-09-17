import axios from 'axios'

const baseURL = 'https://www.fastmock.site/mock/bf1fcb3c2e2945669c2c8d0ecb8009b8/api'

// 创建axios实例
const service = axios.create({
  baseURL: baseURL,
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
  const code = data.code
  if (code !== 200) {
    return Promise.reject(data)
  }
  return data
}, err => {
  console.log(err)
})

export default service
