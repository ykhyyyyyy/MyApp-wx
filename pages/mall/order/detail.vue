<template>
  <view class="container">
    <!-- 显示加载状态 -->
    <view v-if="loading && !showOrderHere" class="loading">
      <view class="loading-spinner"></view>
      <text class="loading-text">正在跳转到订单详情页...</text>
    </view>
    
    <!-- 显示订单详情 -->
    <block v-if="showOrderHere && orderData">
      <custom-nav-bar title="订单详情" :show-back="true"></custom-nav-bar>
      <view class="detail-box">
        <view class="order-title">订单号：{{orderData.id}}</view>
        <view class="order-info">金额：¥{{orderData.totalAmount || orderData.payAmount || 0}}</view>
        <view class="order-info">状态：{{getStatusText(orderData.status)}}</view>
        <view class="order-info">创建时间：{{formatTime(orderData.createTime)}}</view>
        <view class="order-info" v-if="orderData.address">收货地址：{{orderData.address}}</view>
        <view class="order-info" v-if="orderData.phone">联系电话：{{orderData.phone}}</view>
        <view class="order-items">
          <view class="item-title">商品明细</view>
          <view v-for="(item, index) in getOrderItems()" :key="index" class="item-row">
            <text>{{item.productName}} × {{item.quantity}}</text>
            <text>¥{{item.price * item.quantity}}</text>
          </view>
        </view>
        <view class="actions">
          <button v-if="orderData.status === 0" class="btn" @click="payOrder">支付</button>
          <button v-if="orderData.status === 0" class="btn cancel" @click="cancelOrder">取消</button>
          <button v-if="orderData.status === 1" class="btn complete" @click="completeOrder">确认收货</button>
        </view>
      </view>
    </block>
    
    <!-- 显示错误状态 -->
    <view v-if="!loading && !orderData && showOrderHere" class="empty">
      <text class="empty-text">未找到订单信息</text>
      <view class="empty-desc">订单ID: {{id}}</view>
      <button class="back-btn" @click="goBack">返回</button>
    </view>
  </view>
</template>

<script>
import config from '@/config/index.js';
import CustomNavBar from '@/components/CustomNavBar.vue';

export default {
  components: { CustomNavBar },
  data() {
    return {
      id: null,
      redirecting: false,
      orderData: null,
      loading: false,
      showOrderHere: false
    };
  },
  onLoad(options) {
    console.log('mall/order/detail页面加载, 准备重定向, 参数:', options);
    this.id = options.id;
    
    if (!this.redirecting) {
      this.redirecting = true;
      
      // 先尝试获取订单数据，确保订单存在
      this.loadOrderData();
      
      // 延迟500ms再跳转，避免过快跳转
      setTimeout(() => {
        uni.redirectTo({
          url: `/pages/order/detail?id=${this.id}`,
          success: () => {
            console.log('重定向到正确的订单详情页成功');
          },
          fail: (err) => {
            console.error('重定向失败:', err);
            
            // 如果跳转失败，但我们有订单数据，就在当前页显示
            if (this.orderData) {
              this.showOrderHere = true;
              uni.showToast({
                title: '正在当前页面显示订单',
                icon: 'none'
              });
            } else {
              uni.showToast({
                title: '页面跳转失败',
                icon: 'none'
              });
              
              // 再次尝试加载订单数据
              this.loadOrderData();
              this.showOrderHere = true;
              
              // 如果重定向失败且数据加载失败，尝试返回上一页
              if (!this.orderData) {
                setTimeout(() => {
                  uni.navigateBack({
                    delta: 1,
                    fail: () => {
                      uni.switchTab({
                        url: '/pages/mall/index'
                      });
                    }
                  });
                }, 3000);
              }
            }
          }
        });
      }, 500);
    }
  },
  
  methods: {
    // 直接加载订单数据，以备跳转失败时显示
    loadOrderData() {
      this.loading = true;
      
      uni.request({
        url: `${config.BaseUrl}/api/shop/order/detail`,
        method: 'GET',
        data: {
          orderId: this.id,
          userId: 1 // 应该从用户状态获取
        },
        header: {
          'content-type': 'application/json',
          ...config.getAuthHeader()
        },
        success: (res) => {
          console.log('获取订单详情成功:', JSON.stringify(res.data));
          if (res.data && res.data.code === 1) {
            this.orderData = res.data.data;
          } else {
            uni.showToast({
              title: res.data?.msg || '获取订单详情失败',
              icon: 'none'
            });
          }
        },
        fail: (err) => {
          console.error('获取订单详情失败:', JSON.stringify(err));
        },
        complete: () => {
          this.loading = false;
        }
      });
    },
    
    // 获取订单商品项
    getOrderItems() {
      if (!this.orderData) return [];
      
      // 处理不同的API响应格式
      if (this.orderData.items && Array.isArray(this.orderData.items)) {
        return this.orderData.items;
      } else if (this.orderData.orderItems && Array.isArray(this.orderData.orderItems)) {
        return this.orderData.orderItems;
      }
      
      return [];
    },
    
    // 获取订单状态文本
    getStatusText(status) {
      switch(status){
        case 0: return '待支付';
        case 1: return '已支付';
        case 2: return '已完成';
        case 3: return '已取消';
        default: return status;
      }
    },
    
    // 支付订单
    payOrder() {
      uni.request({
        url: `${config.BaseUrl}/api/shop/order/pay`,
        method: 'POST',
        data: {
          userId: 1,
          orderId: this.id
        },
        header: {
          'content-type': 'application/json',
          ...config.getAuthHeader()
        },
        success: (res) => {
          if (res.data && res.data.code === 1) {
            uni.showToast({
              title: '支付成功',
              icon: 'success'
            });
            this.loadOrderData(); // 重新加载订单数据
          } else {
            uni.showToast({
              title: res.data?.msg || '支付失败',
              icon: 'none'
            });
          }
        },
        fail: () => {
          uni.showToast({
            title: '网络请求失败',
            icon: 'none'
          });
        }
      });
    },
    
    // 取消订单
    cancelOrder() {
      uni.request({
        url: `${config.BaseUrl}/api/shop/order/cancel`,
        method: 'POST',
        data: {
          userId: 1,
          orderId: this.id
        },
        header: {
          'content-type': 'application/json',
          ...config.getAuthHeader()
        },
        success: (res) => {
          if (res.data && res.data.code === 1) {
            uni.showToast({
              title: '已取消',
              icon: 'success'
            });
            this.loadOrderData(); // 重新加载订单数据
          } else {
            uni.showToast({
              title: res.data?.msg || '取消失败',
              icon: 'none'
            });
          }
        },
        fail: () => {
          uni.showToast({
            title: '网络请求失败',
            icon: 'none'
          });
        }
      });
    },
    
    // 完成订单
    completeOrder() {
      uni.request({
        url: `${config.BaseUrl}/api/shop/order/complete`,
        method: 'POST',
        data: {
          userId: 1,
          orderId: this.id
        },
        header: {
          'content-type': 'application/json',
          ...config.getAuthHeader()
        },
        success: (res) => {
          if (res.data && res.data.code === 1) {
            uni.showToast({
              title: '已完成',
              icon: 'success'
            });
            this.loadOrderData(); // 重新加载订单数据
          } else {
            uni.showToast({
              title: res.data?.msg || '操作失败',
              icon: 'none'
            });
          }
        },
        fail: () => {
          uni.showToast({
            title: '网络请求失败',
            icon: 'none'
          });
        }
      });
    },
    
    // 格式化时间
    formatTime(timeStr) {
      if (!timeStr) return '未知';
      
      try {
        const date = new Date(timeStr);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
      } catch (e) {
        return timeStr;
      }
    },
    
    // 返回上一页
    goBack() {
      uni.navigateBack({
        delta: 1,
        fail: () => {
          uni.switchTab({
            url: '/pages/mall/index'
          });
        }
      });
    }
  }
}
</script>

<style>
.container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 300rpx;
}

.loading-spinner {
  width: 60rpx;
  height: 60rpx;
  border: 6rpx solid #f3f3f3;
  border-top: 6rpx solid #4CAF50;
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
  color: #666;
}

.detail-box {
  background: #fff;
  margin: 30rpx;
  border-radius: 16rpx;
  padding: 40rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04);
}

.order-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.order-info {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 10rpx;
}

.order-items {
  margin: 20rpx 0;
}

.item-title {
  font-size: 28rpx;
  color: #4CAF50;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.item-row {
  display: flex;
  justify-content: space-between;
  font-size: 26rpx;
  color: #333;
  margin-bottom: 8rpx;
}

.actions {
  margin-top: 30rpx;
  text-align: center;
}

.btn {
  background: #4CAF50;
  color: #fff;
  border-radius: 30rpx;
  padding: 16rpx 60rpx;
  font-size: 28rpx;
  margin: 0 10rpx;
}

.btn.cancel {
  background: #ff4d4f;
}

.btn.complete {
  background: #ff9800;
}

.empty {
  text-align: center;
  color: #999;
  padding: 100rpx 0;
}

.empty-text {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.empty-desc {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 20rpx;
}

.back-btn {
  background: #4CAF50;
  color: #fff;
  border-radius: 30rpx;
  padding: 16rpx 60rpx;
  font-size: 28rpx;
}
</style> 