<template>
  <div class="badges-container">
    <h2>成就系统</h2>
    <div class="user-stats">
      <span>已解锁徽章: {{ unlockedCount }}/{{ totalBadges }}</span>
      <span>总成就点: {{ totalAchievementPoints }}</span>
    </div>

    <div class="badge-categories">
      <button 
        v-for="category in categories" 
        :key="category.id"
        :class="{ active: activeCategory === category.id }"
        @click="activeCategory = category.id"
      >
        {{ category.name }}
      </button>
    </div>

    <div class="badge-grid">
      <div 
        v-for="badge in filteredBadges" 
        :key="badge.id"
        class="badge-card"
        :class="{ locked: !badge.unlocked }"
        @mouseenter="hoveredBadge = badge.id"
        @mouseleave="hoveredBadge = null"
      >
        <div class="badge-icon">
          <img 
            :src="badge.unlocked ? badge.icon : lockedIcon" 
            :alt="badge.name"
          >
          <span v-if="badge.unlocked" class="badge-points">+{{ badge.points }}</span>
        </div>
        <div class="badge-info">
          <h3>{{ badge.name }}</h3>
          <p>{{ badge.description }}</p>
          <div v-if="!badge.unlocked" class="progress-bar">
            <div :style="{ width: `${badge.progress}%` }"></div>
            <span>{{ badge.progress }}%</span>
          </div>
          <button 
            v-if="badge.unlocked && hoveredBadge === badge.id"
            class="share-btn"
            @click.stop="shareBadge(badge)"
          >
            分享成就
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAchievements, shareAchievement } from '../api/achievementApi';
import lockedIcon from '@/assets/images/locked-badge.png'; // 默认锁定徽章图标

export default {
  data() {
    return {
      badges: [],
      categories: [
        { id: 'all', name: '全部' },
        { id: 'tasks', name: '任务达人' },
        { id: 'points', name: '积分王者' },
        { id: 'social', name: '社交之星' }
      ],
      activeCategory: 'all',
      hoveredBadge: null
    };
  },
  computed: {
    filteredBadges() {
      return this.activeCategory === 'all' 
        ? this.badges 
        : this.badges.filter(b => b.category === this.activeCategory);
    },
    unlockedCount() {
      return this.badges.filter(b => b.unlocked).length;
    },
    totalBadges() {
      return this.badges.length;
    },
    totalAchievementPoints() {
      return this.badges
        .filter(b => b.unlocked)
        .reduce((sum, b) => sum + b.points, 0);
    }
  },
  async created() {
    await this.loadBadges();
  },
  methods: {
    async loadBadges() {
      try {
        const response = await getAchievements();
        this.badges = response.data.map(badge => ({
          ...badge,
          progress: Math.min(100, Math.floor((badge.currentProgress / badge.target) * 100))
        }));
      } catch (error) {
        console.error('加载成就数据失败:', error);
        this.$toast.error('无法加载成就数据');
      }
    },
    async shareBadge(badge) {
      try {
        await shareAchievement(badge.id);
        this.$toast.success(`已分享成就: ${badge.name}`);
      } catch (error) {
        this.$toast.error('分享失败: ' + error.message);
      }
    }
  }
};
</script>

<style scoped>
.badges-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.user-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  font-weight: bold;
  color: #666;
}

.badge-categories {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.badge-categories button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 20px;
  background: white;
  cursor: pointer;
}

.badge-categories button.active {
  background: #42b983;
  color: white;
  border-color: #42b983;
}

.badge-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.badge-card {
  display: flex;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
  transition: transform 0.2s;
}

.badge-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.badge-card.locked {
  opacity: 0.7;
  background-color: #f9f9f9;
}

.badge-icon {
  position: relative;
  margin-right: 15px;
}

.badge-icon img {
  width: 60px;
  height: 60px;
}

.badge-points {
  position: absolute;
  bottom: -10px;
  right: -10px;
  background: gold;
  color: #333;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.badge-info {
  flex: 1;
}

.badge-info h3 {
  margin: 0 0 5px 0;
  color: #333;
}

.badge-info p {
  margin: 0 0 10px 0;
  color: #666;
  font-size: 14px;
}

.progress-bar {
  height: 6px;
  background: #eee;
  border-radius: 3px;
  margin-top: 10px;
  position: relative;
}

.progress-bar div {
  height: 100%;
  background: #42b983;
  border-radius: 3px;
}

.progress-bar span {
  position: absolute;
  right: 0;
  top: -20px;
  font-size: 12px;
  color: #666;
}

.share-btn {
  margin-top: 10px;
  padding: 4px 8px;
  background: #e3f2fd;
  color: #1976d2;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
}
</style>