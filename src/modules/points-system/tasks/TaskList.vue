<template>
  <div class="task-list">
    <h2>新生任务</h2>
    <button @click="fetchTasks">刷新任务</button>
    <ul>
      <li v-for="task in tasks" :key="task.id">
        {{ task.name }} (积分: {{ task.points }})
        <button @click="completeTask(task.id)">完成</button>
      </li>
    </ul>
  </div>
</template>

<script>
import { getTasks, completeTask } from '../api/taskApi';
import { usePointsStore } from '../store/pointsStore';

export default {
  data() {
    return {
      tasks: []
    };
  },
  methods: {
    async fetchTasks() {
      this.tasks = await getTasks();
    },
    async completeTask(taskId) {
      await completeTask(taskId);
      const pointsStore = usePointsStore();
      pointsStore.addPoints(10); // 假设完成任务奖励10积分
      await this.fetchTasks();
    }
  },
  mounted() {
    this.fetchTasks();
  }
};
</script>