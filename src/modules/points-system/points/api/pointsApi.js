import axios from '@/plugins/axios'; // 假设项目已封装axios实例

/**
 * 积分系统API封装
 */
export default {
  /**
   * 获取用户当前积分
   * @param {string} userId - 用户ID（可选，默认从token中解析）
   */
  getCurrentPoints(userId = '') {
    return axios.get('/api/points/balance', {
      params: { user_id: userId }
    });
  },

  /**
   * 积分兑换商品
   * @param {number} itemId - 商品ID
   * @param {number} quantity - 兑换数量（默认为1）
   */
  redeemItem(itemId, quantity = 1) {
    return axios.post('/api/points/redeem', {
      item_id: itemId,
      quantity
    });
  },

  /**
   * 获取可兑换商品列表
   */
  getRedeemableItems() {
    return axios.get('/api/points/shop/items');
  },

  /**
   * 获取积分变动记录
   * @param {object} params - 查询参数（分页、类型过滤等）
   */
  getPointsHistory(params = { page: 1, limit: 10 }) {
    return axios.get('/api/points/history', { params });
  },

  /**
   * 手动调整积分（管理员权限）
   * @param {object} data - { user_id, points, reason }
   */
  adjustPoints(data) {
    return axios.patch('/api/points/adjust', data);
  }
};

// 可选：为方便组件调用，导出命名方法
export const {
  getCurrentPoints,
  redeemItem,
  getRedeemableItems,
  getPointsHistory,
  adjustPoints
} = this;