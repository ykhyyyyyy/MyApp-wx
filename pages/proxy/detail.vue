<template>
  <view class="container">
    <custom-nav-bar title="任务详情" subtitle="任务信息" :show-back="true"></custom-nav-bar>
    
    <!-- 添加明显的返回按钮 -->
    <view class="back-button" @click="goBack">
      <text class="back-arrow">←</text>
      <text class="back-text">返回</text>
    </view>
    
    <!-- 显示加载中状态 -->
    <view v-if="isLoading" class="loading-container">
      <view class="loading-spinner"></view>
      <text class="loading-text">加载中...</text>
    </view>
    
    <!-- 显示无数据状态 -->
    <view v-else-if="!task" class="empty-container">
      <text class="empty-text">未找到任务</text>
      <button class="return-button" @click="goBack">返回任务列表</button>
    </view>
    
    <!-- 任务详情内容 -->
    <view v-else class="task-detail">
      <!-- 基本信息卡片 -->
      <view class="detail-card">
        <view class="card-header">
          <view class="task-type-badge" :class="getBadgeClass(task.taskType)">{{ getTypeText(task.taskType) }}</view>
          <view class="task-price">悬赏: <text class="price-amount">¥{{ task.price }}</text></view>
        </view>
        
        <view class="task-route">
          <view class="task-pickup">
            <text class="location-icon pickup">取</text>
            <text class="location-text">{{ task.pickupAddress }}</text>
          </view>
          <view class="route-arrow">↓</view>
          <view class="task-delivery">
            <text class="location-icon delivery">送</text>
            <text class="location-text">{{ task.deliveryAddress }}</text>
          </view>
        </view>
      </view>
      
      <!-- 详细信息卡片 -->
      <view class="detail-card">
        <view class="section-title">详细信息</view>
        
        <view class="info-item">
          <text class="info-label">发布者：</text>
          <text class="info-value">{{ task.publisherName || '匿名用户' }}</text>
        </view>
        
        <view class="info-item">
          <text class="info-label">联系电话：</text>
          <text class="info-value">{{ task.publisherPhone || '暂无' }}</text>
        </view>
        
        <view class="info-item">
          <text class="info-label">取件备注：</text>
          <text class="info-value">{{ task.pickupNote || '无' }}</text>
        </view>
        
        <view class="info-item">
          <text class="info-label">物品描述：</text>
          <text class="info-value">{{ task.itemDescription || '无' }}</text>
        </view>
        
        <view class="info-item">
          <text class="info-label">发布时间：</text>
          <text class="info-value">{{ formatDate(task.createdAt) }}</text>
        </view>
      </view>
      
      <!-- 操作按钮 -->
      <view class="actions-card">
        <button class="action-button accept" @click="acceptTask" v-if="task.status === 'WAITING'">接受任务</button>
        <button class="action-button delete" @click="deleteTask">删除任务</button>
      </view>
    </view>
    
    <!-- AI助手组件 -->
    <ai-assistant></ai-assistant>
  </view>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import CustomNavBar from '@/components/CustomNavBar.vue';
import AiAssistant from '@/components/AiAssistant.vue';

export default {
  components: { 
    CustomNavBar,
    AiAssistant
  },
  data() { 
    return { 
      id: null 
    }; 
  },
  computed: {
    ...mapState('express', ['currentExpress', 'isLoading']),
    task() { return this.currentExpress; }
  },
  methods: {
    ...mapActions('express', ['getExpressDetail', 'deleteExpress']),
    async loadDetail() {
      if (!this.id) return;
      await this.getExpressDetail(this.id);
    },
    async deleteTask() {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除该任务吗？',
        success: async (res) => {
          if (res.confirm) {
            await this.deleteExpress(this.id);
            uni.showToast({ title: '删除成功', icon: 'success' });
            setTimeout(() => uni.navigateBack(), 1000);
          }
        }
      });
    },
    acceptTask() {
      uni.showModal({
        title: '确认接单',
        content: '确定要接受这个任务吗？',
        success: (res) => {
          if (res.confirm) {
            uni.showToast({ 
              title: '接单成功', 
              icon: 'success' 
            });
            // 这里需要添加接单的API调用
          }
        }
      });
    },
    getTypeText(type) {
      switch(type) {
        case 'EXPRESS': return '快递代取';
        case 'TAKEOUT': return '外卖代取';
        case 'DOCUMENT': return '文件代送';
        case 'OTHER': return '其他';
        default: return type;
      }
    },
    getBadgeClass(type) {
      switch(type) {
        case 'EXPRESS': return 'express';
        case 'TAKEOUT': return 'takeout';
        case 'DOCUMENT': return 'document';
        case 'OTHER': return 'other';
        default: return '';
      }
    },
    formatDate(dateStr) {
      if (!dateStr) return '';
      const d = new Date(dateStr);
      return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2,'0')}`;
    },
    goBack() {
      uni.navigateBack({
        delta: 1,
        fail: () => {
          uni.navigateTo({ url: '/pages/proxy/index' });
        }
      });
    }
  },
  onLoad(options) {
    this.id = options.id;
    this.loadDetail();
  }
}
</script>

<style>
.container {
  background-color: #F8F7F2;
  min-height: 100vh;
}

.back-button {
  position: fixed;
  top: calc(var(--status-bar-height) + 50rpx);
  left: 30rpx;
  z-index: 1000;
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 10rpx 20rpx;
  border-radius: 30rpx;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
  border: 1rpx solid #e0c9d1;
}

.back-arrow {
  font-size: 40rpx;
  color: #8A3324;
  font-weight: bold;
  margin-right: 10rpx;
}

.back-text {
  font-size: 28rpx;
  color: #333;
  font-family: "FangSong", serif;
}

/* 加载状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
}

.loading-spinner {
  width: 60rpx;
  height: 60rpx;
  border: 6rpx solid #f3f3f3;
  border-top: 6rpx solid #7EC4CF;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20rpx;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 28rpx;
  color: #999;
}

.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
  margin-bottom: 30rpx;
}

.return-button {
  background-color: #7EC4CF;
  color: #fff;
  font-size: 28rpx;
  padding: 12rpx 30rpx;
  border-radius: 30rpx;
}

.task-detail {
  padding: 30rpx;
  padding-bottom: 50rpx;
}

.detail-card {
  background-color: #fff;
  border-radius: 15rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  border: 1rpx solid #e0c9d1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  padding-bottom: 15rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.task-type-badge {
  font-size: 22rpx;
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
}

.task-type-badge.express {
  background-color: rgba(126, 196, 207, 0.1);
  color: #7EC4CF;
  border: 1rpx solid #7EC4CF;
}

.task-type-badge.takeout {
  background-color: rgba(255, 149, 0, 0.1);
  color: #FF9500;
  border: 1rpx solid #FF9500;
}

.task-type-badge.document {
  background-color: rgba(138, 51, 36, 0.1);
  color: #8A3324;
  border: 1rpx solid #8A3324;
}

.task-type-badge.other {
  background-color: rgba(102, 102, 102, 0.1);
  color: #666;
  border: 1rpx solid #666;
}

.task-price {
  font-size: 26rpx;
  color: #666;
}

.price-amount {
  font-weight: bold;
  color: #FF6B6B;
  font-size: 32rpx;
}

.task-route {
  margin-top: 10rpx;
}

.task-pickup, .task-delivery {
  display: flex;
  align-items: center;
  margin-bottom: 10rpx;
}

.location-icon {
  width: 40rpx;
  height: 40rpx;
  border-radius: 20rpx;
  text-align: center;
  line-height: 40rpx;
  font-size: 24rpx;
  margin-right: 15rpx;
  color: #fff;
}

.location-icon.pickup {
  background-color: #7EC4CF;
}

.location-icon.delivery {
  background-color: #FF9500;
}

.location-text {
  font-size: 28rpx;
  color: #333;
  flex: 1;
}

.route-arrow {
  text-align: center;
  font-size: 24rpx;
  color: #999;
  margin: 5rpx 0 5rpx 20rpx;
}

.section-title {
  font-size: 30rpx;
  color: #333;
  font-weight: bold;
  font-family: "FangSong", serif;
  margin-bottom: 20rpx;
  padding-bottom: 15rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.info-item {
  display: flex;
  margin-bottom: 20rpx;
}

.info-label {
  width: 150rpx;
  font-size: 28rpx;
  color: #666;
}

.info-value {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

.actions-card {
  display: flex;
  justify-content: space-between;
  padding: 30rpx 0;
}

.action-button {
  flex: 1;
  margin: 0 15rpx;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  border-radius: 40rpx;
  font-size: 28rpx;
}

.action-button.accept {
  background-color: #7EC4CF;
  color: #fff;
}

.action-button.delete {
  background-color: rgba(255, 77, 79, 0.1);
  color: #ff4d4f;
  border: 1rpx solid #ff4d4f;
}
</style> 