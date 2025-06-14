import axios from '@/plugins/axios';

export const getTasks = () => {
  return axios.get('/api/tasks');
};

export const completeTask = (taskId) => {
  return axios.post(`/api/tasks/${taskId}/complete`);
};