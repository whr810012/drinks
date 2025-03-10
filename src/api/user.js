import request from '@/utils/request'

// 获取用户列表
export function getUsers() {
  return request({
    url: 'api/users',
    method: 'get'
  })
}

// 添加用户
export function addUser(data) {
  return request({
    url: 'api/users',
    method: 'post',
    data
  })
}

// 编辑用户
export function updateUser(id, data) {
  return request({
    url: `api/users/${id}`,
    method: 'put',
    data
  })
}

// 更新用户状态
export function updateUserStatus(id, status) {
  return request({
    url: `api/users/${id}/status`,
    method: 'patch',
    data: { status }
  })
} 