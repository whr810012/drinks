import request from '@/utils/request'

// 获取商品列表
export function getProducts() {
  return request({
    url: '/api/products',
    method: 'get'
  })
}

// 添加商品
export function addProduct(data) {
  return request({
    url: '/api/products',
    method: 'post',
    data
  })
}

// 更新商品
export function updateProduct(id, data) {
  return request({
    url: `/api/products/${id}`,
    method: 'put',
    data
  })
}

// 更新商品状态
export function updateProductStatus(id, status) {
  return request({
    url: `/api/products/${id}/status`,
    method: 'patch',
    data: { status }
  })
}

// 上传商品图片
export function uploadImage(data) {
  return request({
    url: '/api/upload',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
} 