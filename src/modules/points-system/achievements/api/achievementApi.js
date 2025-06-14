import axios from '@/plugins/axios';

export const getAchievements = () => {
  return axios.get('/api/achievements');
};

export const shareAchievement = (badgeId) => {
  return axios.post('/api/achievements/share', { badgeId });
};

// 示例响应数据结构
/*
{
  data: [
    {
      id: 'task-master',
      name: '任务达人',
      description: '完成10个新生任务',
      icon: '/badges/task-master.png',
      category: 'tasks',
      points: 50,
      unlocked: true,
      currentProgress: 10,
      target: 10
    },
    {
      id: 'points-king',
      name: '积分王者',
      description: '累计获得1000积分',
      icon: '/badges/points-king.png',
      category: 'points',
      points: 100,
      unlocked: false,
      currentProgress: 350,
      target: 1000
    }
  ]
}
*/