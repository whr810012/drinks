import request from '@/utils/request'

// 获取订单列表
export function getOrders(params) {
  return request({
    url: '/api/orders',
    method: 'get',
    params
  })
}

// 获取订单统计数据
export function getOrderStats() {
  return request({
    url: '/api/orders/stats',
    method: 'get'
  })
}

// 创建新订单
export function createOrder(data) {
  return request({
    url: '/api/orders',
    method: 'post',
    data
  })
}

// 更新订单状态
export function updateOrderStatus(orderId, status) {
  return request({
    url: `/api/orders/${orderId}/status`,
    method: 'patch',
    data: { status }
  })
}

// 获取订单详情
export function getOrderDetail(orderId) {
  return request({
    url: `/api/orders/${orderId}`,
    method: 'get'
  })
}

// 取消订单
export function cancelOrder(orderId) {
  return request({
    url: `/api/orders/${orderId}/cancel`,
    method: 'post'
  })
}

// 处理订单
export function processOrder(orderId) {
  return request({
    url: `/api/orders/${orderId}/process`,
    method: 'post'
  })
} 