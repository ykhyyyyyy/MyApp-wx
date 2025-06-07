<template>
  <view class="container">
    <custom-nav-bar title="商品详情" subtitle="Product Detail" :show-back="true"></custom-nav-bar>
    <view class="back-button" @click="goBack">
      <text class="back-arrow">←</text>
      <text class="back-text">返回</text>
    </view>
    <view v-if="loading" class="loading-container">
      <view class="loading-spinner"></view>
      <text class="loading-text">加载中...</text>
    </view>
    <view v-else-if="!product" class="empty-container">
      <text class="empty-text">未找到该商品</text>
      <button class="return-button" @click="goBack">返回商城</button>
    </view>
    <view v-else class="product-container">
      <swiper v-if="productImages.length > 0" class="product-swiper" circular indicator-dots autoplay>
        <swiper-item v-for="(img, index) in productImages" :key="index">
          <image :src="img" class="product-image" mode="aspectFill" @click="previewImage(img, productImages)"></image>
        </swiper-item>
      </swiper>
      <image v-else class="product-image-single" :src="product.avatar || product.image || 'https://ykhyyy.oss-cn-beijing.aliyuncs.com/MyApp/default-product.png'" mode="aspectFill"></image>
      <view class="product-info-card">
        <text class="product-price">¥ {{product.price || '0.00'}}</text>
        <text class="product-name">{{product.name || '无名商品'}}</text>
        <view class="product-stats">
          <text class="product-sales">销量: {{product.sales || product.stock || 0}}</text>
          <text class="product-rating">评分: {{product.rating || '暂无评分'}}</text>
        </view>
      </view>
      <view class="product-detail-card">
        <view class="card-header">
          <view class="header-line"></view>
          <text class="header-text">商品详情</text>
          <view class="header-line"></view>
        </view>
        <view class="product-description">
          <text class="description-text">{{product.description || '暂无商品详情'}}</text>
        </view>
        <view v-if="detailImages.length > 0" class="detail-images">
          <image v-for="(img, index) in detailImages" 
            :key="index" 
            :src="img" 
            mode="widthFix" 
            class="detail-image"></image>
        </view>
      </view>
      <view v-if="product.shopId" class="shop-info-card" @click="viewShop(product.shopId)">
        <view class="shop-header">
          <image class="shop-avatar" :src="product.shopAvatar || 'https://ykhyyy.oss-cn-beijing.aliyuncs.com/MyApp/default-shop.png'"></image>
          <view class="shop-text">
            <text class="shop-name">{{product.shopName || '未知店铺'}}</text>
            <text class="shop-subtitle">查看店铺更多商品 ></text>
          </view>
        </view>
      </view>
      <view class="bottom-actions">
        <view class="action-container">
          <view class="action-buttons">
            <button class="action-button add-cart" @click="showNotImplemented">加入购物车</button>
            <button class="action-button buy-now" @click="showNotImplemented">立即购买</button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import CustomNavBar from '@/components/CustomNavBar.vue';
import config from '@/config/index.js';
export default {
  components: { CustomNavBar },
  data() { return { id:null, userId:1, loading: true, product: null }; },
  computed: {
    productImages() {
      // Check for product images in different possible fields
      if (this.product && this.product.imgs) {
        return this.product.imgs.split(',').filter(img => img && img.trim() !== '');
      }
      else if (this.product && this.product.imgList && Array.isArray(this.product.imgList)) {
        return this.product.imgList;
      }
      else if (this.product && this.product.images) {
        return this.product.images.split(',').filter(img => img && img.trim() !== '');
      }
      else if (this.product && (this.product.avatar || this.product.image)) {
        return [this.product.avatar || this.product.image];
      }
      return ['https://ykhyyy.oss-cn-beijing.aliyuncs.com/MyApp/default-product.png'];
    },
    detailImages() {
      if (this.product && this.product.detailImages && this.product.detailImages.length > 0) {
        return this.product.detailImages.split(',').filter(img => img && img.trim() !== '');
      } 
      else if (this.product && this.product.imgList && Array.isArray(this.product.imgList)) {
        return this.product.imgList;
      }
      return [];
    }
  },
  methods: {
    goToOrder() { uni.navigateTo({url:`/pages/order/create?productId=${this.id}`}); },
    loadProductDetail() {
      this.loading = true;
      uni.request({
        url: `${config.BaseUrl}/api/shop/product/${this.id}`,
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: (res) => {
          console.log('获取商品详情成功:', res.data);
          if (res.data && res.data.code === 1) {
            this.product = res.data.data;
            console.log('商品数据:', this.product);
          } else {
            uni.showToast({
              title: '获取商品详情失败',
              icon: 'none'
            });
          }
        },
        fail: (err) => {
          console.error('请求失败:', err);
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
    viewShop(shopId) {
      if (!shopId) {
        uni.showToast({
          title: '店铺信息不完整',
          icon: 'none'
        });
        return;
      }
      uni.navigateTo({
        url: `/pages/mall/shops/detail?id=${shopId}`
      });
    },
    previewImage(current, urls) {
      uni.previewImage({
        current: current,
        urls: urls
      });
    },
    showNotImplemented() {
      uni.showToast({
        title: '该功能暂未开放',
        icon: 'none'
      });
    },
    goBack() {
      uni.navigateBack({
        delta: 1,
        fail: () => {
          uni.navigateTo({
            url: '/pages/mall/index'
          });
        }
      });
    }
  },
  onLoad(options) { 
    this.id = options.id; 
    
    // 检查查询中是否直接包含完整的产品数据对象
    if (typeof options.code !== 'undefined' && options.data) {
      // 直接处理API响应对象
      this.product = options.data;
      this.loading = false;
      console.log('直接使用传入的商品数据对象:', this.product);
      return;
    }
    
    // 检查是否传入了编码的商品数据
    if (options.data) {
      try {
        // 尝试解析从查询参数传入的数据
        const productData = JSON.parse(decodeURIComponent(options.data));
        if (productData && productData.code === 1 && productData.data) {
          this.product = productData.data;
          this.loading = false;
          console.log('从参数加载商品数据:', this.product);
          return;
        }
      } catch (e) {
        console.error('解析商品数据失败:', e);
      }
    }
    
    // 如果没有传入数据或数据不完整，则通过API请求
    this.loadProductDetail();
  }
}
</script>
<style>
.container{min-height:100vh;background:#f5f5f5;padding-bottom:120rpx;}
.back-button{position:fixed;top:calc(var(--status-bar-height)+50rpx);left:30rpx;z-index:1000;display:flex;align-items:center;background-color:rgba(255,255,255,0.8);padding:10rpx 20rpx;border-radius:30rpx;box-shadow:0 2rpx 6rpx rgba(0,0,0,0.1);border:1rpx solid #e0c9d1;}
.back-arrow{font-size:40rpx;color:#8A3324;font-weight:bold;margin-right:10rpx;}
.back-text{font-size:28rpx;color:#333;font-family:"FangSong",serif;}
.loading-container{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:100rpx 0;}
.loading-spinner{width:60rpx;height:60rpx;border:6rpx solid #f3f3f3;border-top:6rpx solid #7EC4CF;border-radius:50%;animation:spin 1s linear infinite;margin-bottom:20rpx;}
@keyframes spin{0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}
.loading-text{font-size:28rpx;color:#999;}
.empty-container{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:100rpx 30rpx;}
.empty-text{font-size:28rpx;color:#999;margin-bottom:30rpx;}
.return-button{background-color:#7EC4CF;color:#fff;font-size:28rpx;padding:12rpx 30rpx;border-radius:30rpx;}
.product-container{width:100%;}
.product-swiper{width:100%;height:750rpx;}
.product-image{width:100%;height:100%;}
.product-image-single{width:100%;height:750rpx;display:block;}
.product-info-card{background-color:#fff;padding:30rpx;margin-bottom:20rpx;box-shadow:0 2rpx 8rpx rgba(0,0,0,0.05);border-bottom:1rpx solid #f0f0f0;}
.product-price{font-size:40rpx;color:#ff6b6b;font-weight:bold;margin-bottom:15rpx;display:block;}
.product-name{font-size:34rpx;color:#333;font-weight:bold;margin-bottom:15rpx;display:block;line-height:1.4;}
.product-stats{display:flex;justify-content:space-between;font-size:26rpx;color:#999;}
.product-detail-card{background-color:#fff;padding:30rpx;margin-bottom:20rpx;box-shadow:0 2rpx 8rpx rgba(0,0,0,0.05);}
.card-header{display:flex;align-items:center;margin-bottom:20rpx;}
.header-line{flex:1;height:1rpx;background-color:#e0e0e0;}
.header-text{padding:0 20rpx;color:#666;font-size:28rpx;font-family:"FangSong",serif;}
.product-description{padding:10rpx 0 30rpx 0;}
.description-text{font-size:28rpx;color:#666;line-height:1.6;}
.detail-images{display:flex;flex-direction:column;}
.detail-image{width:100%;margin-bottom:20rpx;}
.shop-info-card{background-color:#fff;padding:30rpx;margin-bottom:20rpx;box-shadow:0 2rpx 8rpx rgba(0,0,0,0.05);}
.shop-header{display:flex;align-items:center;}
.shop-avatar{width:80rpx;height:80rpx;border-radius:40rpx;margin-right:20rpx;border:1rpx solid #e0e0e0;}
.shop-text{flex:1;}
.shop-name{font-size:28rpx;color:#333;font-weight:bold;margin-bottom:6rpx;display:block;}
.shop-subtitle{font-size:24rpx;color:#999;}
.bottom-actions{position:fixed;bottom:0;left:0;right:0;background-color:#fff;box-shadow:0 -2rpx 10rpx rgba(0,0,0,0.05);z-index:100;}
.action-container{padding:20rpx 30rpx;}
.action-buttons{display:flex;}
.action-button{flex:1;height:80rpx;line-height:80rpx;text-align:center;border-radius:40rpx;font-size:28rpx;margin:0 10rpx;}
.add-cart{background-color:rgba(255,107,107,0.1);color:#ff6b6b;border:1rpx solid #ff6b6b;}
.buy-now{background-color:#ff6b6b;color:#fff;}
</style> 