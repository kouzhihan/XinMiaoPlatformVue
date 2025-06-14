<template>
  <div class="task-form">
    <h2>发布新生任务</h2>
    <form @submit.prevent="submitTask">
      <!-- 任务名称 -->
      <div class="form-group">
        <label for="task-name">任务名称</label>
        <input
          id="task-name"
          v-model="formData.name"
          type="text"
          required
          placeholder="例如：新生报到"
        />
      </div>

      <!-- 任务描述 -->
      <div class="form-group">
        <label for="task-desc">任务描述</label>
        <textarea
          id="task-desc"
          v-model="formData.description"
          rows="3"
          placeholder="详细说明任务要求..."
        ></textarea>
      </div>

      <!-- 积分设置 -->
      <div class="form-group">
        <label for="task-points">奖励积分</label>
        <input
          id="task-points"
          v-model.number="formData.points"
          type="number"
          min="1"
          required
          placeholder="例如：10"
        />
      </div>

      <!-- 截止日期 -->
      <div class="form-group">
        <label for="task-deadline">截止日期</label>
        <input
          id="task-deadline"
          v-model="formData.deadline"
          type="datetime-local"
        />
      </div>

      <!-- 提交按钮 -->
      <button type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? '提交中...' : '发布任务' }}
      </button>
    </form>
  </div>
</template>

<script>
import { createTask } from '../api/taskApi';
import { useToast } from 'vue-toastification'; // 可选：消息提示库

export default {
  data() {
    return {
      formData: {
        name: '',
        description: '',
        points: 10, // 默认积分
        deadline: ''
      },
      isSubmitting: false
    };
  },
  methods: {
    async submitTask() {
      if (!this.validateForm()) return;

      this.isSubmitting = true;
      try {
        await createTask(this.formData);
        this.$emit('task-created'); // 通知父组件刷新任务列表
        this.resetForm();
        useToast().success('任务发布成功！'); // 提示用户
      } catch (error) {
        console.error('发布任务失败:', error);
        useToast().error('发布失败: ' + error.message);
      } finally {
        this.isSubmitting = false;
      }
    },
    validateForm() {
      if (!this.formData.name.trim()) {
        useToast().warning('请填写任务名称');
        return false;
      }
      if (this.formData.points <= 0) {
        useToast().warning('积分必须大于0');
        return false;
      }
      return true;
    },
    resetForm() {
      this.formData = {
        name: '',
        description: '',
        points: 10,
        deadline: ''
      };
    }
  }
};
</script>

<style scoped>
.task-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
}
.form-group {
  margin-bottom: 15px;
}
label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}
input[type='text'],
input[type='number'],
input[type='datetime-local'],
textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
button {
  background-color: #42b983;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:disabled {
  background-color: #cccccc;
}
</style>