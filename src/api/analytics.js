import request from '@/utils/request'

// 获取数据概览
export function getOverviewStats() {
  return request({
    url: '/api/analytics/overview',
    method: 'get'
  })
}

// 获取销售趋势数据
export function getSalesTrend(params) {
  return request({
    url: '/api/analytics/sales-trend',
    method: 'get',
    params
  })
}

// 获取商品分类占比
export function getCategoryDistribution() {
  return request({
    url: '/api/analytics/category-distribution',
    method: 'get'
  })
}

// 获取热销商品排行
export function getHotProducts(params) {
  return request({
    url: '/api/analytics/hot-products',
    method: 'get',
    params
  })
} 