import axios from 'axios'
import { Message } from 'element-ui'
import router from '@/router'

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000', // 使用 Vite 的环境变量方式
  timeout: 15000
})

// request拦截器
service.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = token
    } else {
      console.log('未找到token，请求将不包含Authorization头')
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
    return response.data
  },
  error => {
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