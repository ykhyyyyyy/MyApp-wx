<template>
  <view class="container">
    <!-- 自定义导航栏 -->
    <custom-nav-bar title="优惠券中心" subtitle="限时秒杀" :show-back="true"></custom-nav-bar>
    
    <!-- 顶部banner -->
    <view class="banner">
      <image src="/static/banners/coupon-banner.png" mode="widthFix" class="banner-image"></image>
    </view>
    
    <!-- 优惠券列表 -->
    <view class="coupon-list">
      <view class="section-title">
        <text class="title-text">限时秒杀</text>
        <text class="title-desc">每日限量发放，先到先得</text>
      </view>
      
      <view class="coupon-container">
        <!-- 加载中状态 -->
        <view class="loading-container" v-if="isLoading">
          <uni-load-more status="loading" :content-text="loadingText"></uni-load-more>
        </view>
        
        <!-- 空状态 -->
        <view class="empty-container" v-else-if="coupons.length === 0">
          <image src="/static/icons/empty-coupon.png" class="empty-icon"></image>
          <text class="empty-text">暂无可用优惠券</text>
        </view>
        
        <!-- 优惠券列表 -->
        <view 
          class="coupon-item" 
          v-else
          v-for="(coupon, index) in coupons" 
          :key="coupon.id"
          :class="{'claimed': coupon.claimed}"
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
                class="claim-btn" 
                :disabled="coupon.claimed || coupon.stock <= 0" 
                @click="claimCoupon(coupon)"
              >
                {{ coupon.claimed ? '已领取' : (coupon.stock <= 0 ? '已抢光' : '立即领取') }}
              </button>
            </view>
          </view>
          <view class="coupon-tag" v-if="coupon.type === 'NEW_USER'">新人专享</view>
        </view>
      </view>
    </view>
    
    <!-- 我的优惠券按钮 -->
    <view class="my-coupon-btn" @click="goToMyCoupons">
      <text>我的优惠券</text>
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
    ...mapState('user', ['userInfo'])
  },
  methods: {
    ...mapActions('coupon', ['speedKillCoupon', 'getUserCoupons']),
    
    // 领取优惠券
    async claimCoupon(coupon) {
      if (!this.userId) {
        uni.showToast({
          title: '请先登录',
          icon: 'none'
        });
        setTimeout(() => {
          uni.navigateTo({
            url: '/pages/login/index'
          });
        }, 1500);
        return;
      }
      
      try {
        const result = await this.speedKillCoupon({
          userId: this.userId,
          couponId: coupon.id
        });
        
        if (result && result.code === 1) {
          uni.showToast({
            title: '领取成功',
            icon: 'success'
          });
          
          // 更新本地状态
          coupon.claimed = true;
          coupon.stock -= 1;
        } else {
          uni.showToast({
            title: result.message || '领取失败',
            icon: 'none'
          });
        }
      } catch (error) {
        console.error('领取优惠券失败:', error);
        uni.showToast({
          title: '领取失败，请稍后再试',
          icon: 'none'
        });
      }
    },
    
    // 跳转到我的优惠券页面
    goToMyCoupons() {
      uni.navigateTo({
        url: '/pages/mall/my-coupons'
      });
    },
    
    // 格式化日期
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
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

.banner {
  width: 100%;
  padding: 20rpx;
  box-sizing: border-box;
}

.banner-image {
  width: 100%;
  height: auto;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.section-title {
  padding: 30rpx 30rpx 20rpx;
}

.title-text {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.title-desc {
  font-size: 24rpx;
  color: #999;
  margin-left: 20rpx;
}

.coupon-list {
  padding: 0 20rpx;
}

.coupon-container {
  margin-bottom: 30rpx;
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

.coupon-item.claimed {
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
}

.claim-btn {
  background-color: #FF6B6B;
  color: #fff;
  font-size: 26rpx;
  padding: 10rpx 30rpx;
  border-radius: 30rpx;
  border: none;
}

.claim-btn[disabled] {
  background-color: #ccc;
  color: #fff;
}

.coupon-tag {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  background-color: #FFD166;
  color: #fff;
  font-size: 22rpx;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
}

.my-coupon-btn {
  position: fixed;
  bottom: 40rpx;
  left: 50%;
  transform: translateX(-50%);
  background-color: #fff;
  color: #FF6B6B;
  font-size: 32rpx;
  padding: 20rpx 60rpx;
  border-radius: 40rpx;
  box-shadow: 0 4rpx 20rpx rgba(255, 107, 107, 0.3);
  border: 2rpx solid #FF6B6B;
}
</style> 