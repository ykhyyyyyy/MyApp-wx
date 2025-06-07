<template>
  <view class="container">
    <custom-nav-bar title="探店" :show-back="false"></custom-nav-bar>
    <view class="header-actions">
      <button class="publish-btn" @click="goToCreate">发布探店</button>
    </view>
    <scroll-view scroll-y class="review-list" @scrolltolower="loadMore">
      <view v-if="isLoading && reviews.length===0" class="loading"><uni-load-more status="loading" content-text="加载中..."></uni-load-more></view>
      <view v-else-if="reviews.length===0" class="empty">暂无探店</view>
      <view v-else>
        <view class="review-item" v-for="review in reviews" :key="review.id" @click="goToDetail(review.id)">
          <view class="review-title">{{review.title}}</view>
          <view class="review-content">{{review.content}}</view>
          <view class="review-info">
            <text>作者：{{review.username}}</text>
            <text>评论：{{review.comments}}</text>
            <text>浏览：{{review.views}}</text>
          </view>
        </view>
      </view>
      <uni-load-more v-if="isLoading && reviews.length>0" status="loading" content-text="加载中..."></uni-load-more>
      <uni-load-more v-if="!hasMore && reviews.length>0" status="noMore" content-text="没有更多了"></uni-load-more>
    </scroll-view>
  </view>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import CustomNavBar from '@/components/CustomNavBar.vue';
export default {
  components: { CustomNavBar },
  data() { return { page:1, size:10, hasMore:true }; },
  computed: {
    ...mapState('shopReview', ['reviewList','isLoading','pagination']),
    reviews() { return this.reviewList; }
  },
  methods: {
    ...mapActions('shopReview', ['getReviewPage']),
    async loadReviews(reset=false) {
      if (reset) { this.page=1; this.hasMore=true; }
      if (!this.hasMore) return;
      await this.getReviewPage({current:this.page,size:this.size});
      if (this.pagination && this.pagination.total<=this.reviews.length) {
        this.hasMore=false;
      } else {
        this.page++;
      }
    },
    loadMore() { this.loadReviews(); },
    goToDetail(id) { uni.navigateTo({url:`/pages/shop/detail?id=${id}`}); },
    goToCreate() { uni.navigateTo({url:'/pages/shop/create'}); }
  },
  onLoad() { this.loadReviews(true); },
  onPullDownRefresh() { this.loadReviews(true).then(()=>uni.stopPullDownRefresh()); }
}
</script>
<style>
.container{min-height:100vh;background:#f5f5f5;}
.header-actions{padding:20rpx;text-align:right;}
.publish-btn{background:#4CAF50;color:#fff;border-radius:30rpx;padding:10rpx 40rpx;}
.review-list{height:80vh;overflow-y:auto;}
.review-item{background:#fff;margin:20rpx 0;border-radius:12rpx;padding:30rpx;box-shadow:0 2rpx 8rpx rgba(0,0,0,0.04);}
.review-title{font-size:32rpx;font-weight:bold;color:#333;}
.review-content{font-size:28rpx;color:#666;margin:10rpx 0;}
.review-info{font-size:24rpx;color:#999;display:flex;justify-content:space-between;}
.loading,.empty{text-align:center;color:#999;padding:100rpx 0;}
</style> 