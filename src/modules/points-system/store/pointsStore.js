import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core'; // 可选：实现本地存储持久化
import pointsApi from '../points/api/pointsApi';
import achievementApi from '../achievements/api/achievementApi';

export const usePointsStore = defineStore('points', {
  state: () => ({
    // 从本地存储初始化（防止刷新丢失）
    totalPoints: useStorage('points-total', 0),
    transactions: useStorage('points-transactions', []),
    unlockedAchievements: useStorage('points-achievements', []),
    lastUpdated: null
  }),

  getters: {
    // 今日获得的积分
    todayPoints: (state) => {
      const today = new Date().toDateString();
      return state.transactions
        .filter(t => new Date(t.date).toDateString() === today && t.points > 0)
        .reduce((sum, t) => sum + t.points, 0);
    },

    // 已解锁的成就ID数组（快速查询用）
    unlockedAchievementIds: (state) => 
      state.unlockedAchievements.map(a => a.id),

    // 按分类分组的成就
    groupedAchievements: (state) => {
      const groups = {};
      state.unlockedAchievements.forEach(a => {
        groups[a.category] = groups[a.category] || [];
        groups[a.category].push(a);
      });
      return groups;
    }
  },

  actions: {
    // 增加积分（完成任务时调用）
    async addPoints(amount, reason = '') {
      if (amount <= 0) return;
      
      const transaction = {
        id: Date.now(),
        points: amount,
        reason,
        date: new Date().toISOString()
      };

      this.totalPoints += amount;
      this.transactions.unshift(transaction); // 添加到交易记录
      this.lastUpdated = new Date().toISOString();

      // 检查是否解锁新成就
      await this.checkAchievements();
    },

    // 扣除积分（兑换商品时调用）
    deductPoints(amount) {
      if (amount <= 0 || this.totalPoints < amount) return false;
      
      this.totalPoints -= amount;
      this.transactions.unshift({
        id: Date.now(),
        points: -amount,
        reason: '积分兑换',
        date: new Date().toISOString()
      });
      return true;
    },

    // 从服务器同步最新数据
    async syncFromServer() {
      try {
        const [pointsRes, achievementsRes] = await Promise.all([
          pointsApi.getCurrentPoints(),
          achievementApi.getAchievements()
        ]);

        this.totalPoints = pointsRes.data.balance;
        this.unlockedAchievements = achievementsRes.data
          .filter(a => a.unlocked)
          .map(({ id, name, points, icon }) => ({ id, name, points, icon }));
      } catch (error) {
        console.error('同步积分数据失败:', error);
      }
    },

    // 检查成就解锁条件
    async checkAchievements() {
      try {
        const res = await achievementApi.checkNewAchievements({
          totalPoints: this.totalPoints,
          transactionsCount: this.transactions.length
        });

        if (res.data.newAchievements.length > 0) {
          this.unlockedAchievements.push(...res.data.newAchievements);
          return res.data.newAchievements; // 返回新解锁的成就
        }
      } catch (error) {
        console.error('成就检查失败:', error);
      }
      return [];
    },

    // 重置本地数据（开发调试用）
    reset() {
      this.totalPoints = 0;
      this.transactions = [];
      this.unlockedAchievements = [];
    }
  }
});