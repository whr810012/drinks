import request from '@/utils/request'

// 获取管理员列表
export function getAdminList() {
  return request({
    url: '/api/admins',
    method: 'get'
  })
}

// 创建管理员
export function createAdmin(data) {
  return request({
    url: '/api/admins',
    method: 'post',
    data
  })
}

// 更新管理员信息
export function updateAdmin(id, data) {
  return request({
    url: `/api/admins/${id}`,
    method: 'put',
    data
  })
}

// 删除管理员
export function deleteAdmin(id) {
  return request({
    url: `/api/admins/${id}`,
    method: 'delete'
  })
}

// 更新管理员状态
export function updateAdminStatus(id, status) {
  return request({
    url: `/api/admins/${id}/status`,
    method: 'patch',
    data: { status }
  })
} 