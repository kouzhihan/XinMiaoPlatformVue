<template>
  <div>
    <h2>积分商城</h2>
    <p>当前积分: {{ pointsStore.totalPoints }}</p>
    <div v-for="item in shopItems" :key="item.id">
      {{ item.name }} ({{ item.cost }}积分)
      <button @click="buyItem(item.id)">兑换</button>
    </div>
  </div>
</template>

<script>
import { usePointsStore } from '../store/pointsStore';
import { buyItem } from '../api/pointsApi';

export default {
  data() {
    return {
      shopItems: [
        { id: 1, name: '优惠券', cost: 50 },
        { id: 2, name: '纪念品', cost: 100 }
      ]
    };
  },
  computed: {
    pointsStore() {
      return usePointsStore();
    }
  },
  methods: {
    async buyItem(itemId) {
      await buyItem(itemId);
      this.pointsStore.deductPoints(this.shopItems.find(i => i.id === itemId).cost);
    }
  }
};
</script>