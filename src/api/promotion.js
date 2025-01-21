import request from '@/utils/request';

// 获取促销活动列表
export function getPromotions() {
  return request({
    url: '/api/promotions',
    method: 'get'
  });
}

// 添加促销活动
export function addPromotion(data) {
  return request({
    url: '/api/promotions',
    method: 'post',
    data
  });
}

// 更新促销活动
export function updatePromotion(id, data) {
  return request({
    url: `/api/promotions/${id}`,
    method: 'put',
    data
  });
}

// 删除促销活动
export function deletePromotion(id) {
  return request({
    url: `/api/promotions/${id}`,
    method: 'delete'
  });
} 