<template>
  <view class="container">
    <custom-nav-bar title="订单详情" :show-back="true"></custom-nav-bar>
    
    <!-- 加载中状态 -->
    <view v-if="isLoading || loading" class="loading-container">
      <view class="loading-spinner"></view>
      <text class="loading-text">加载订单详情中...</text>
    </view>
    
    <!-- 订单不存在状态 -->
    <view v-else-if="!orderInfo" class="empty-container">
      <image class="empty-icon" src="/static/images/empty-order.png" mode="aspectFit"></image>
      <text class="empty-title">未找到订单信息</text>
      <view class="empty-desc">订单ID: {{id}}</view>
      <button class="primary-btn" @click="goBack">返回</button>
    </view>
    
    <!-- 订单详情内容 -->
    <block v-else>
      <scroll-view scroll-y class="order-scroll">
        <!-- 订单状态卡片 -->
        <view class="status-card">
          <view class="status-icon" :class="getStatusClass(orderInfo.status)">
            <text class="status-emoji">{{getStatusEmoji(orderInfo.status)}}</text>
          </view>
          <view class="status-info">
            <text class="status-text">{{getStatusText(orderInfo.status)}}</text>
            <text class="status-desc">{{getStatusDescription(orderInfo.status)}}</text>
          </view>
        </view>
        
        <!-- 订单信息卡片 -->
        <view class="order-card">
          <view class="section-title">订单信息</view>
          <view class="info-row">
            <text class="info-label">订单编号</text>
            <view class="info-value-copy">
              <text class="info-value">{{orderInfo.id}}</text>
              <text class="copy-btn" @click="copyOrderId">复制</text>
            </view>
          </view>
          <view class="info-row">
            <text class="info-label">下单时间</text>
            <text class="info-value">{{formatTime(orderInfo.createTime)}}</text>
          </view>
          <view class="info-row" v-if="orderInfo.payTime">
            <text class="info-label">支付时间</text>
            <text class="info-value">{{formatTime(orderInfo.payTime)}}</text>
          </view>
          <view class="info-row" v-if="orderInfo.cancelTime">
            <text class="info-label">取消时间</text>
            <text class="info-value">{{formatTime(orderInfo.cancelTime)}}</text>
          </view>
          <view class="info-row">
            <text class="info-label">支付方式</text>
            <text class="info-value">微信支付</text>
          </view>
        </view>
        
        <!-- 商品列表卡片 -->
        <view class="order-card">
          <view class="section-title">商品信息</view>
          <view class="product-list">
            <view v-for="(item, index) in orderItems" :key="index" class="product-item">
              <image class="product-image" :src="getProductImage(item)" mode="aspectFill"></image>
              <view class="product-info">
                <text class="product-name">{{item.productName}}</text>
                <view class="product-price-row">
                  <text class="product-price">¥{{item.price}}</text>
                  <text class="product-quantity">x{{item.quantity}}</text>
                </view>
              </view>
            </view>
          </view>
          
          <!-- 价格明细 -->
          <view class="price-summary">
            <view class="price-row">
              <text>商品总额</text>
              <text>¥{{orderInfo.totalAmount}}</text>
            </view>
            <view class="price-row" v-if="orderInfo.totalAmount !== orderInfo.payAmount">
              <text>优惠金额</text>
              <text class="discount-price">-¥{{orderInfo.totalAmount - orderInfo.payAmount}}</text>
            </view>
            <view class="price-row total">
              <text>实付金额</text>
              <text class="total-price">¥{{orderInfo.payAmount}}</text>
            </view>
          </view>
        </view>
        
        <!-- 收货信息卡片 -->
        <view class="order-card" v-if="orderInfo.address || orderInfo.phone">
          <view class="section-title">收货信息</view>
          <view class="info-row" v-if="orderInfo.address">
            <text class="info-label">收货地址</text>
            <text class="info-value address">{{orderInfo.address}}</text>
          </view>
          <view class="info-row" v-if="orderInfo.phone">
            <text class="info-label">联系电话</text>
            <text class="info-value">{{orderInfo.phone}}</text>
          </view>
        </view>
        
        <!-- 店铺信息卡片 -->
        <view class="order-card">
          <view class="section-title">店铺信息</view>
          <view class="info-row">
            <text class="info-label">店铺ID</text>
            <text class="info-value">{{orderInfo.shopId}}</text>
          </view>
          <button class="shop-btn" @click="goToShop">查看店铺</button>
        </view>
      </scroll-view>
      
      <!-- 底部操作按钮 -->
      <view class="bottom-actions" v-if="orderInfo.status !== 3">
        <button v-if="orderInfo.status === 0" class="action-btn cancel" @click="cancelOrder">取消订单</button>
        <button v-if="orderInfo.status === 0" class="action-btn primary" @click="payOrder">立即支付</button>
        <button v-if="orderInfo.status === 1" class="action-btn primary" @click="completeOrder">确认收货</button>
      </view>
    </block>
  </view>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import CustomNavBar from '@/components/CustomNavBar.vue';
import config from '@/config/index.js';

export default {
  components: { CustomNavBar },
  data() { 
    return { 
      id: null, 
      userId: 1,
      orderData: null,
      loading: false 
    }; 
  },
  computed: {
    ...mapState('order', ['currentOrder','isLoading']),
    
    // 优先使用直接API请求获取的数据
    orderInfo() {
      // 如果有直接获取的数据，优先使用
      if (this.orderData) {
        return this.orderData.order || this.orderData;
      }
      
      // 如果有Vuex中的数据，使用Vuex数据
      if (this.currentOrder) {
        return this.currentOrder.order || this.currentOrder;
      }
      
      return null;
    },
    
    // 获取订单商品项
    orderItems() {
      if (!this.orderInfo) return [];
      
      // 处理嵌套数据结构
      if (this.orderData && this.orderData.orderItems) {
        return this.orderData.orderItems;
      }
      
      // 处理其他可能的数据结构
      if (this.orderInfo.items) {
        return this.orderInfo.items;
      }
      
      if (this.orderInfo.orderItems) {
        return this.orderInfo.orderItems;
      }
      
      return [];
    }
  },
  methods: {
    ...mapActions('order', ['getOrderDetail','payOrder','cancelOrder','completeOrder']),
    
    async loadDetail() { 
      console.log('加载订单详情, orderId:', this.id, 'userId:', this.userId);
      
      try {
        // 尝试使用Vuex action
        await this.getOrderDetail({orderId: this.id, userId: this.userId});
      } catch(error) {
        console.error('Vuex加载订单详情失败:', error);
      }
      
      // 无论Vuex是否成功，都尝试直接API调用以获取最新数据
      this.loadOrderDetailDirect();
    },
    
    // 直接通过API获取订单详情（不通过Vuex）
    loadOrderDetailDirect() {
      this.loading = true;
      
      uni.request({
        url: `${config.BaseUrl}/api/shop/order/detail`,
        method: 'GET',
        data: {
          orderId: this.id,
          userId: this.userId
        },
        header: {
          'content-type': 'application/json',
          ...config.getAuthHeader()
        },
        success: (res) => {
          console.log('直接API获取订单详情成功:', JSON.stringify(res.data));
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
          console.error('直接API获取订单详情失败:', JSON.stringify(err));
          uni.showToast({
            title: '网络请求失败',
            icon: 'none'
          });
        },
        complete: () => {
          this.loading = false;
        }
      });
    },
    
    // 获取商品图片
    getProductImage(item) {
      // 如果商品项有图片属性，则使用
      if (item.image) return item.image;
      
      // 否则使用默认图片
      return 'https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg';
    },
    
    // 获取订单状态文本
    getStatusText(status) {
      switch(parseInt(status)){
        case 0: return '待支付';
        case 1: return '已支付';
        case 2: return '已完成';
        case 3: return '已取消';
        default: return '未知状态';
      }
    },
    
    // 获取订单状态描述
    getStatusDescription(status) {
      switch(parseInt(status)){
        case 0: return '请在30分钟内完成支付';
        case 1: return '商家正在处理您的订单';
        case 2: return '订单已完成，感谢您的购买';
        case 3: return '订单已取消';
        default: return '';
      }
    },
    
    // 获取状态对应的CSS类
    getStatusClass(status) {
      switch(parseInt(status)){
        case 0: return 'status-pending';
        case 1: return 'status-paid';
        case 2: return 'status-completed';
        case 3: return 'status-cancelled';
        default: return '';
      }
    },
    
    // 获取状态对应的emoji
    getStatusEmoji(status) {
      switch(parseInt(status)){
        case 0: return '⏱️';
        case 1: return '🚚';
        case 2: return '✅';
        case 3: return '❌';
        default: return '❓';
      }
    },
    
    // 复制订单ID
    copyOrderId() {
      if (!this.orderInfo || !this.orderInfo.id) return;
      
      uni.setClipboardData({
        data: this.orderInfo.id.toString(),
        success: () => {
          uni.showToast({
            title: '订单号已复制',
            icon: 'success'
          });
        }
      });
    },
    
    // 支付订单
    async payOrder() {
      uni.showModal({
        title: '订单支付',
        content: '确定要支付此订单吗？',
        success: async (res) => {
          if (res.confirm) {
            uni.showLoading({
              title: '处理中...'
            });
            
            try {
              // 使用正确的API路径格式
              uni.request({
                url: `${config.BaseUrl}/api/shop/order/${this.userId}/${this.id}/pay`,
                method: 'PUT',
                header: {
                  'content-type': 'application/json',
                  ...config.getAuthHeader()
                },
                success: (res) => {
                  uni.hideLoading();
                  if (res.data && res.data.code === 1) {
                    uni.showToast({
                      title: '支付成功',
                      icon: 'success'
                    });
                    this.loadDetail(); // 重新加载订单数据
                  } else {
                    uni.showToast({
                      title: res.data?.msg || '支付失败',
                      icon: 'none'
                    });
                  }
                },
                fail: (err) => {
                  uni.hideLoading();
                  console.error('支付订单请求失败:', JSON.stringify(err));
                  uni.showToast({
                    title: '网络请求失败',
                    icon: 'none'
                  });
                }
              });
            } catch(error) {
              uni.hideLoading();
              console.error('支付订单失败:', error);
              uni.showToast({
                title: '支付处理失败',
                icon: 'none'
              });
            }
          }
        }
      });
    },
    
    // 取消订单
    async cancelOrder() {
      uni.showModal({
        title: '取消订单',
        content: '确定要取消此订单吗？',
        success: async (res) => {
          if (res.confirm) {
            uni.showLoading({
              title: '处理中...'
            });
            
            try {
              // 使用正确的API路径格式
              uni.request({
                url: `${config.BaseUrl}/api/shop/order/${this.userId}/${this.id}/cancel`,
                method: 'PUT',
                header: {
                  'content-type': 'application/json',
                  ...config.getAuthHeader()
                },
                success: (res) => {
                  uni.hideLoading();
                  if (res.data && res.data.code === 1) {
                    uni.showToast({
                      title: '订单已取消',
                      icon: 'success'
                    });
                    this.loadDetail(); // 重新加载订单数据
                  } else {
                    uni.showToast({
                      title: res.data?.msg || '取消失败',
                      icon: 'none'
                    });
                  }
                },
                fail: (err) => {
                  uni.hideLoading();
                  console.error('取消订单请求失败:', JSON.stringify(err));
                  uni.showToast({
                    title: '网络请求失败',
                    icon: 'none'
                  });
                }
              });
            } catch(error) {
              uni.hideLoading();
              console.error('取消订单失败:', error);
              uni.showToast({
                title: '处理失败',
                icon: 'none'
              });
            }
          }
        }
      });
    },
    
    // 完成订单
    async completeOrder() {
      uni.showModal({
        title: '确认收货',
        content: '确认已收到商品吗？',
        success: async (res) => {
          if (res.confirm) {
            uni.showLoading({
              title: '处理中...'
            });
            
            try {
              // 使用正确的API路径格式
              uni.request({
                url: `${config.BaseUrl}/api/shop/order/${this.userId}/${this.id}/complete`,
                method: 'PUT',
                header: {
                  'content-type': 'application/json',
                  ...config.getAuthHeader()
                },
                success: (res) => {
                  uni.hideLoading();
                  if (res.data && res.data.code === 1) {
                    uni.showToast({
                      title: '订单已完成',
                      icon: 'success'
                    });
                    this.loadDetail(); // 重新加载订单数据
                  } else {
                    uni.showToast({
                      title: res.data?.msg || '操作失败',
                      icon: 'none'
                    });
                  }
                },
                fail: (err) => {
                  uni.hideLoading();
                  console.error('完成订单请求失败:', JSON.stringify(err));
                  uni.showToast({
                    title: '网络请求失败',
                    icon: 'none'
                  });
                }
              });
            } catch(error) {
              uni.hideLoading();
              console.error('完成订单失败:', error);
              uni.showToast({
                title: '处理失败',
                icon: 'none'
              });
            }
          }
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
    
    // 跳转到店铺页面
    goToShop() {
      if (!this.orderInfo || !this.orderInfo.shopId) return;
      
      uni.navigateTo({
        url: `/pages/mall/shops/detail?id=${this.orderInfo.shopId}`,
        fail: (err) => {
          console.error('导航到店铺页面失败:', JSON.stringify(err));
          uni.showToast({
            title: '导航到店铺页面失败',
            icon: 'none'
          });
        }
      });
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
  },
  onLoad(options) { 
    this.id = options.id;
    // 从本地存储或全局状态中获取用户ID
    const userInfo = uni.getStorageSync('userInfo');
    if (userInfo && userInfo.id) {
      this.userId = userInfo.id;
    }
    this.loadDetail(); 
  }
}
</script>

<style>
.container {
  min-height: 100vh;
  background-color: #F8F7F2;
  display: flex;
  flex-direction: column;
  position: relative;
  padding-bottom: 120rpx;
}

/* 加载状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 70vh;
}

.loading-spinner {
  width: 60rpx;
  height: 60rpx;
  border: 6rpx solid #f3f3f3;
  border-top: 6rpx solid #8A3324;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 20rpx;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 28rpx;
  color: #666;
  font-family: "FangSong", serif;
}

/* 空状态 */
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 70vh;
}

.empty-icon {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 30rpx;
}

.empty-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
  font-family: "FangSong", serif;
}

.empty-desc {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 40rpx;
  font-family: "FangSong", serif;
}

.primary-btn {
  background-color: #8A3324;
  color: #fff;
  border-radius: 40rpx;
  font-size: 28rpx;
  padding: 16rpx 60rpx;
  border: none;
  font-family: "FangSong", serif;
}

/* 订单内容区域 */
.order-scroll {
  flex: 1;
  height: calc(100vh - 120rpx);
  padding: 30rpx 30rpx 50rpx;
}

/* 状态卡片 */
.status-card {
  background: linear-gradient(135deg, #8A3324, #a54b3c);
  border-radius: 20rpx;
  padding: 40rpx 30rpx;
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(138, 51, 36, 0.2);
  border: 1rpx solid #e0c9d1;
}

.status-icon {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 30rpx;
  border: 1rpx solid #e0c9d1;
}

.status-emoji {
  font-size: 50rpx;
}

.status-info {
  flex: 1;
}

.status-text {
  font-size: 36rpx;
  color: #fff;
  font-weight: bold;
  margin-bottom: 10rpx;
  font-family: "FangSong", serif;
}

.status-desc {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
  font-family: "FangSong", serif;
}

/* 状态颜色 */
.status-card.status-pending {
  background: linear-gradient(135deg, #ff9800, #f57c00);
}

.status-card.status-paid {
  background: linear-gradient(135deg, #7EC4CF, #5ba3ae);
}

.status-card.status-completed {
  background: linear-gradient(135deg, #8A3324, #a54b3c);
}

.status-card.status-cancelled {
  background: linear-gradient(135deg, #9e9e9e, #616161);
}

/* 订单卡片 */
.order-card {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
  border: 1rpx solid #e0c9d1;
}

.section-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  padding-bottom: 16rpx;
  border-bottom: 2rpx solid #f2f2f2;
  font-family: "FangSong", serif;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.info-label {
  font-size: 28rpx;
  color: #666;
  font-family: "FangSong", serif;
}

.info-value {
  font-size: 28rpx;
  color: #333;
  max-width: 70%;
  text-align: right;
  font-family: "FangSong", serif;
}

.info-value.address {
  word-break: break-all;
}

.info-value-copy {
  display: flex;
  align-items: center;
}

.copy-btn {
  font-size: 24rpx;
  color: #8A3324;
  margin-left: 10rpx;
  background-color: rgba(138, 51, 36, 0.1);
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
  font-family: "FangSong", serif;
}

/* 商品列表 */
.product-list {
  margin-bottom: 30rpx;
}

.product-item {
  display: flex;
  margin-bottom: 20rpx;
  padding-bottom: 20rpx;
  border-bottom: 2rpx solid #f5f5f5;
}

.product-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.product-image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 12rpx;
  margin-right: 20rpx;
  background-color: #f5f5f5;
  border: 1rpx solid #e0c9d1;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-name {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 10rpx;
  line-height: 1.4;
  font-family: "FangSong", serif;
}

.product-price-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.product-price {
  font-size: 32rpx;
  color: #8A3324;
  font-weight: bold;
}

.product-quantity {
  font-size: 28rpx;
  color: #999;
}

/* 价格明细 */
.price-summary {
  padding-top: 20rpx;
  border-top: 2rpx solid #f5f5f5;
}

.price-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16rpx;
  font-size: 28rpx;
  color: #666;
  font-family: "FangSong", serif;
}

.price-row.total {
  margin-top: 20rpx;
  padding-top: 20rpx;
  border-top: 2rpx dashed #f0f0f0;
  font-weight: bold;
  color: #333;
}

.discount-price {
  color: #8A3324;
}

.total-price {
  font-size: 36rpx;
  color: #8A3324;
  font-weight: bold;
}

/* 店铺按钮 */
.shop-btn {
  margin-top: 20rpx;
  background-color: #f5f5f5;
  color: #666;
  font-size: 28rpx;
  border-radius: 40rpx;
  padding: 16rpx 0;
  border: none;
  font-family: "FangSong", serif;
}

/* 底部操作区 */
.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  padding: 20rpx 30rpx;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: flex-end;
  box-sizing: border-box;
  z-index: 100;
  border-top: 1rpx solid #e0c9d1;
}

.action-btn {
  font-size: 28rpx;
  border-radius: 40rpx;
  padding: 16rpx 40rpx;
  margin-left: 20rpx;
  border: none;
  font-family: "FangSong", serif;
}

.action-btn.cancel {
  background-color: #f5f5f5;
  color: #666;
  border: 1rpx solid #e0c9d1;
}

.action-btn.primary {
  background-color: #8A3324;
  color: #fff;
}
</style> 