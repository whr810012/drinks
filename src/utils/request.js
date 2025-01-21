import axios from 'axios'
import { Message } from 'element-ui'
import router from '@/router'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:3000/api', // 根据环境变量配置baseURL
  timeout: 15000, // 增加超时时间到15秒
  retry: 3, // 请求重试次数
  retryDelay: 1000 // 请求重试间隔
})

// request拦截器
service.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token
    }
    return config
  },
  error => {
    console.error('请求拦截器错误:', error)
    return Promise.reject(error)
  }
)

// response拦截器
service.interceptors.response.use(
  response => {
    return response
  },
  async error => {
    if (error.config && error.config.retry) {
      error.config.__retryCount = error.config.__retryCount || 0
      if (error.config.__retryCount < error.config.retry) {
        error.config.__retryCount++
        await new Promise(resolve => setTimeout(resolve, error.config.retryDelay))
        return service(error.config)
      }
    }

    if (!error.response) {
      Message({
        message: '网络错误，请检查您的网络连接',
        type: 'error',
        duration: 5000
      })
      return Promise.reject(error)
    }

    const { status } = error.response
    switch (status) {
      case 401:
        Message.error('登录已过期，请重新登录')
        localStorage.removeItem('token')
        router.push('/login')
        break
      case 403:
        Message.error('没有权限访问')
        break
      case 404:
        Message.error('请求的资源不存在')
        break
      case 500:
        Message.error('服务器内部错误')
        break
      default:
        Message({
          message: error.response.data?.message || '请求失败',
          type: 'error',
          duration: 5000
        })
    }
    return Promise.reject(error)
  }
)

export default service 