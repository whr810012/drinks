import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'api/admin/login',
    method: 'post',
    data
  })
}

export function register(data) {
  return request({
    url: 'api/admin/register',
    method: 'post',
    data
  })
}

export function getProfile() {
  return request({
    url: 'api/admin/profile',
    method: 'get'
  })
} 