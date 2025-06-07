<template>
  <view class="container">
    <!-- 自定义导航栏 -->
    <custom-nav-bar title="我的优惠券" :show-back="true"></custom-nav-bar>
    
    <!-- 优惠券状态选项卡 -->
    <view class="tabs">
      <view 
        class="tab-item" 
        v-for="(tab, index) in tabs" 
        :key="index" 
        :class="{'active': currentTab === index}"
        @click="switchTab(index)"
      >
        <text>{{ tab }}</text>
        <view class="tab-line" v-if="currentTab === index"></view>
      </view>
    </view>
    
    <!-- 优惠券列表 -->
    <view class="coupon-list">
      <!-- 加载中状态 -->
      <view class="loading-container" v-if="isLoading">
        <uni-load-more status="loading" :content-text="loadingText"></uni-load-more>
      </view>
      
      <!-- 空状态 -->
      <view class="empty-container" v-else-if="filteredCoupons.length === 0">
        <image src="/static/icons/empty-coupon.png" class="empty-icon"></image>
        <text class="empty-text">{{ emptyText }}</text>
      </view>
      
      <!-- 优惠券列表 -->
      <view 
        class="coupon-item" 
        v-else
        v-for="(coupon, index) in filteredCoupons" 
        :key="coupon.id"
        :class="{'expired': coupon.status === 'EXPIRED', 'used': coupon.status === 'USED'}"
      >
        <view class="coupon-left">
          <view class="coupon-amount">
            <text class="amount-symbol">¥</text>
            <text class="amount-value">{{ coupon.amount }}</text>
          </view>
          <view class="coupon-condition">
            <text>满{{ coupon.minSpend }}元可用</text>
          </view>
        </view>
        <view class="coupon-right">
          <view class="coupon-info">
            <text class="coupon-name">{{ coupon.name }}</text>
            <text class="coupon-desc">{{ coupon.description }}</text>
            <text class="coupon-time">{{ formatDate(coupon.startTime) }} - {{ formatDate(coupon.endTime) }}</text>
          </view>
          <view class="coupon-action">
            <button 
              class="use-btn" 
              v-if="coupon.status === 'VALID'"
              @click="useCoupon(coupon)"
            >
              去使用
            </button>
            <text class="status-text" v-else>{{ getStatusText(coupon.status) }}</text>
          </view>
        </view>
        
        <!-- 优惠券状态水印 -->
        <view class="coupon-status-mark" v-if="coupon.status !== 'VALID'">
          <image 
            :src="coupon.status === 'USED' ? '/static/icons/used-mark.png' : '/static/icons/expired-mark.png'" 
            class="status-mark-img"
          ></image>
        </view>
      </view>
    </view>
    
    <!-- 底部按钮 -->
    <view class="bottom-btn" @click="goToCouponCenter">
      <text>去领券中心</text>
    </view>
  </view>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import CustomNavBar from '@/components/CustomNavBar.vue';

export default {
  components: {
    CustomNavBar
  },
  data() {
    return {
      tabs: ['全部', '可使用', '已使用', '已过期'],
      currentTab: 0,
      loadingText: {
        contentdown: '上拉显示更多',
        contentrefresh: '加载中...',
        contentnomore: '没有更多数据了'
      },
      userId: null, // 用户ID，从登录状态获取
      refreshing: false
    };
  },
  computed: {
    ...mapState('coupon', ['coupons', 'isLoading']),
    ...mapGetters('coupon', ['getAllCoupons']),
    ...mapState('user', ['userInfo']),
    
    // 根据当前选项卡过滤优惠券
    filteredCoupons() {
      if (this.currentTab === 0) {
        return this.coupons;
      } else if (this.currentTab === 1) {
        return this.coupons.filter(coupon => coupon.status === 'VALID');
      } else if (this.currentTab === 2) {
        return this.coupons.filter(coupon => coupon.status === 'USED');
      } else {
        return this.coupons.filter(coupon => coupon.status === 'EXPIRED');
      }
    },
    
    // 空状态文本
    emptyText() {
      if (this.currentTab === 0) {
        return '暂无优惠券';
      } else if (this.currentTab === 1) {
        return '暂无可使用的优惠券';
      } else if (this.currentTab === 2) {
        return '暂无已使用的优惠券';
      } else {
        return '暂无已过期的优惠券';
      }
    }
  },
  methods: {
    ...mapActions('coupon', ['getUserCoupons']),
    
    // 切换选项卡
    switchTab(index) {
      this.currentTab = index;
    },
    
    // 使用优惠券
    useCoupon(coupon) {
      // 跳转到商城首页
      uni.switchTab({
        url: '/pages/mall/index'
      });
    },
    
    // 跳转到优惠券中心
    goToCouponCenter() {
      uni.navigateTo({
        url: '/pages/mall/coupon'
      });
    },
    
    // 格式化日期
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    },
    
    // 获取状态文本
    getStatusText(status) {
      if (status === 'USED') {
        return '已使用';
      } else if (status === 'EXPIRED') {
        return '已过期';
      } else {
        return '可使用';
      }
    },
    
    // 加载优惠券数据
    async loadCoupons() {
      if (this.isLoading) return;
      
      try {
        await this.getUserCoupons(this.userId);
      } catch (error) {
        console.error('获取优惠券列表失败:', error);
        uni.showToast({
          title: '获取优惠券列表失败',
          icon: 'none'
        });
      }
    },
    
    // 下拉刷新
    onPullDownRefresh() {
      this.refreshing = true;
      this.loadCoupons().then(() => {
        uni.stopPullDownRefresh();
        this.refreshing = false;
      }).catch(() => {
        uni.stopPullDownRefresh();
        this.refreshing = false;
      });
    }
  },
  onLoad() {
    // 获取用户信息
    if (this.userInfo) {
      this.userId = this.userInfo.id;
    } else {
      // 尝试从缓存获取
      const userInfoStr = uni.getStorageSync('userInfo');
      if (userInfoStr) {
        try {
          const userInfo = JSON.parse(userInfoStr);
          this.userId = userInfo.id;
        } catch (e) {
          console.error('解析用户信息失败:', e);
        }
      }
    }
    
    // 加载优惠券数据
    this.loadCoupons();
  },
  // 支持下拉刷新
  onPullDownRefresh() {
    this.onPullDownRefresh();
  }
}
</script>

<style>
.container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
}

.tabs {
  display: flex;
  background-color: #fff;
  padding: 0 30rpx;
  border-bottom: 1rpx solid #eee;
  position: sticky;
  top: 0;
  z-index: 10;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 30rpx 0;
  position: relative;
  font-size: 28rpx;
  color: #666;
}

.tab-item.active {
  color: #FF6B6B;
  font-weight: bold;
}

.tab-line {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60rpx;
  height: 6rpx;
  background-color: #FF6B6B;
  border-radius: 3rpx;
}

.coupon-list {
  padding: 20rpx;
}

.loading-container, .empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
}

.empty-icon {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 20rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}

.coupon-item {
  display: flex;
  margin-bottom: 30rpx;
  background-color: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  position: relative;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.coupon-item.expired, .coupon-item.used {
  opacity: 0.7;
}

.coupon-left {
  width: 200rpx;
  background-color: #FF6B6B;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20rpx 0;
  position: relative;
}

.coupon-item.expired .coupon-left, .coupon-item.used .coupon-left {
  background-color: #999;
}

.coupon-left::after {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 20rpx;
  background: radial-gradient(circle at right, #f5f5f5 10rpx, transparent 10rpx) repeat-y;
  background-size: 20rpx 40rpx;
  background-position: 0 10rpx;
}

.amount-symbol {
  font-size: 28rpx;
  font-weight: bold;
}

.amount-value {
  font-size: 56rpx;
  font-weight: bold;
}

.coupon-condition {
  font-size: 24rpx;
  margin-top: 10rpx;
}

.coupon-right {
  flex: 1;
  padding: 30rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.coupon-info {
  margin-bottom: 20rpx;
}

.coupon-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
  display: block;
}

.coupon-desc {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 10rpx;
  display: block;
}

.coupon-time {
  font-size: 22rpx;
  color: #999;
  display: block;
}

.coupon-action {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.use-btn {
  background-color: #FF6B6B;
  color: #fff;
  font-size: 26rpx;
  padding: 10rpx 30rpx;
  border-radius: 30rpx;
  border: none;
}

.status-text {
  font-size: 26rpx;
  color: #999;
}

.coupon-status-mark {
  position: absolute;
  top: 50%;
  right: 80rpx;
  transform: translateY(-50%);
  opacity: 0.8;
}

.status-mark-img {
  width: 120rpx;
  height: 120rpx;
}

.bottom-btn {
  position: fixed;
  bottom: 40rpx;
  left: 50%;
  transform: translateX(-50%);
  background-color: #FF6B6B;
  color: #fff;
  font-size: 32rpx;
  padding: 20rpx 60rpx;
  border-radius: 40rpx;
  box-shadow: 0 4rpx 20rpx rgba(255, 107, 107, 0.3);
}
</style> 