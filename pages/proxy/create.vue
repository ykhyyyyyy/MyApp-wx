<template>
  <view class="container">
    <custom-nav-bar title="发布任务" subtitle="创建代取任务" :show-back="true"></custom-nav-bar>
    
    <!-- 添加明显的返回按钮 -->
    <view class="back-button" @click="goBack">
      <text class="back-arrow">←</text>
      <text class="back-text">返回</text>
    </view>
    
    <view class="form-container">
      <view class="form-card">
        <view class="section-title">基本信息</view>
        
        <view class="form-item">
          <text class="form-label">任务类型</text>
          <picker class="form-picker" :range="taskTypes" range-key="label" @change="taskTypeChange">
            <view class="picker-value">
              <text>{{ taskForm.taskType ? getTypeText(taskForm.taskType) : '请选择任务类型' }}</text>
              <text class="picker-arrow">▼</text>
            </view>
          </picker>
        </view>
        
        <view class="form-item">
          <text class="form-label">取件地址</text>
          <input class="form-input" type="text" v-model="taskForm.pickupAddress" placeholder="请输入取件地址" />
        </view>
        
        <view class="form-item">
          <text class="form-label">送达地址</text>
          <input class="form-input" type="text" v-model="taskForm.deliveryAddress" placeholder="请输入送达地址" />
        </view>
        
        <view class="form-item">
          <text class="form-label">联系电话</text>
          <input class="form-input" type="number" v-model="taskForm.publisherPhone" placeholder="请输入联系电话" />
        </view>
        
        <view class="form-item">
          <text class="form-label">悬赏金额</text>
          <input class="form-input" type="digit" v-model="taskForm.price" placeholder="请输入悬赏金额" />
        </view>
      </view>
      
      <view class="form-card">
        <view class="section-title">详细信息</view>
        
        <view class="form-item">
          <text class="form-label">取件备注</text>
          <textarea class="form-textarea" v-model="taskForm.pickupNote" placeholder="请输入取件备注，如取件码、位置说明等" />
        </view>
        
        <view class="form-item">
          <text class="form-label">物品描述</text>
          <textarea class="form-textarea" v-model="taskForm.itemDescription" placeholder="请描述物品信息，如重量、大小等" />
        </view>
      </view>
      
      <view class="submit-container">
        <button class="submit-btn" @click="submitTask" :disabled="isSubmitting">{{ isSubmitting ? '发布中...' : '发布任务' }}</button>
      </view>
    </view>
    
    <!-- AI助手组件 -->
    <ai-assistant></ai-assistant>
  </view>
</template>

<script>
import { mapActions } from 'vuex';
import CustomNavBar from '@/components/CustomNavBar.vue';
import AiAssistant from '@/components/AiAssistant.vue';

export default {
  components: { 
    CustomNavBar,
    AiAssistant
  },
  data() {
    return {
      isSubmitting: false,
      taskForm: {
        taskType: '',
        pickupAddress: '',
        deliveryAddress: '',
        publisherPhone: '',
        price: '',
        pickupNote: '',
        itemDescription: ''
      },
      taskTypes: [
        { label: '快递代取', value: 'EXPRESS' },
        { label: '外卖代取', value: 'TAKEOUT' },
        { label: '文件代送', value: 'DOCUMENT' },
        { label: '其他', value: 'OTHER' }
      ]
    };
  },
  methods: {
    ...mapActions('express', ['createExpress']),
    
    taskTypeChange(e) {
      const index = e.detail.value;
      this.taskForm.taskType = this.taskTypes[index].value;
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
    
    validateForm() {
      if (!this.taskForm.taskType) {
        uni.showToast({ title: '请选择任务类型', icon: 'none' });
        return false;
      }
      if (!this.taskForm.pickupAddress) {
        uni.showToast({ title: '请输入取件地址', icon: 'none' });
        return false;
      }
      if (!this.taskForm.deliveryAddress) {
        uni.showToast({ title: '请输入送达地址', icon: 'none' });
        return false;
      }
      if (!this.taskForm.publisherPhone) {
        uni.showToast({ title: '请输入联系电话', icon: 'none' });
        return false;
      }
      if (!this.taskForm.price) {
        uni.showToast({ title: '请输入悬赏金额', icon: 'none' });
        return false;
      }
      return true;
    },
    
    async submitTask() {
      if (!this.validateForm()) return;
      
      this.isSubmitting = true;
      try {
        // 转换价格为数字
        const formData = {
          ...this.taskForm,
          price: parseFloat(this.taskForm.price)
        };
        
        await this.createExpress(formData);
        uni.showToast({ title: '发布成功', icon: 'success' });
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      } catch (error) {
        console.error('发布任务失败:', error);
        uni.showToast({ title: '发布失败，请重试', icon: 'none' });
      } finally {
        this.isSubmitting = false;
      }
    },
    
    goBack() {
      uni.navigateBack();
    }
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

.form-container {
  padding: 30rpx;
  padding-bottom: 50rpx;
}

.form-card {
  background-color: #fff;
  border-radius: 15rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  border: 1rpx solid #e0c9d1;
}

.section-title {
  font-size: 30rpx;
  color: #333;
  font-weight: bold;
  font-family: "FangSong", serif;
  margin-bottom: 30rpx;
  padding-bottom: 15rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.form-item {
  margin-bottom: 30rpx;
}

.form-label {
  display: block;
  font-size: 28rpx;
  color: #666;
  margin-bottom: 10rpx;
}

.form-input {
  width: 100%;
  height: 80rpx;
  background-color: #f8f8f8;
  border-radius: 10rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  color: #333;
  border: 1rpx solid #e0e0e0;
}

.form-textarea {
  width: 100%;
  height: 160rpx;
  background-color: #f8f8f8;
  border-radius: 10rpx;
  padding: 20rpx;
  font-size: 28rpx;
  color: #333;
  border: 1rpx solid #e0e0e0;
}

.form-picker {
  width: 100%;
}

.picker-value {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80rpx;
  background-color: #f8f8f8;
  border-radius: 10rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  color: #333;
  border: 1rpx solid #e0e0e0;
}

.picker-arrow {
  font-size: 24rpx;
  color: #999;
}

.submit-container {
  padding: 30rpx 0;
}

.submit-btn {
  width: 100%;
  height: 90rpx;
  line-height: 90rpx;
  background-color: #8A3324;
  color: #fff;
  font-size: 32rpx;
  border-radius: 45rpx;
  box-shadow: 0 4rpx 8rpx rgba(138, 51, 36, 0.2);
}

.submit-btn[disabled] {
  background-color: #cccccc;
  box-shadow: none;
}
</style> 