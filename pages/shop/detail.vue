<template>
  <view class="container">
    <custom-nav-bar title="探店详情" :show-back="true"></custom-nav-bar>
    <view v-if="isLoading" class="loading"><uni-load-more status="loading" content-text="加载中..."></uni-load-more></view>
    <view v-else-if="!review" class="empty">未找到探店</view>
    <view v-else class="detail-box">
      <view class="review-title">{{review.title}}</view>
      <view class="review-content">{{review.content}}</view>
      <view class="review-info">作者：{{review.username}} | 浏览：{{review.views}}</view>
      <view class="actions">
        <button class="del-btn" @click="deleteReview">删除</button>
      </view>
      <view class="comment-section">
        <view class="comment-title">评论</view>
        <view v-for="c in comments" :key="c.id" class="comment-item">
          <text class="comment-user">{{c.username}}：</text>
          <text class="comment-content">{{c.content}}</text>
          <button class="del-btn" v-if="c.userId===userId" @click="deleteComment(c.id)">删除</button>
        </view>
        <view class="comment-input">
          <input v-model="input" class="input" placeholder="写下你的评论..." @confirm="addComment"/>
          <button class="send-btn" @click="addComment">发送</button>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import CustomNavBar from '@/components/CustomNavBar.vue';
export default {
  components: { CustomNavBar },
  data() { return { id:null, input:'', userId:1 }; },
  computed: {
    ...mapState('shopReview', ['currentReview','reviewComments','isLoading']),
    review() { return this.currentReview; },
    comments() { return this.reviewComments; }
  },
  methods: {
    ...mapActions('shopReview', ['getReviewDetail','getReviewCommentPage','createReviewComment','deleteReview','deleteReviewComment']),
    async loadDetail() {
      await this.getReviewDetail(this.id);
      await this.getReviewCommentPage({reviewId:this.id});
    },
    async addComment() {
      if (!this.input.trim()) return;
      await this.createReviewComment({reviewId:this.id,userId:this.userId,content:this.input});
      this.input='';
      this.getReviewCommentPage({reviewId:this.id});
    },
    async deleteReview() {
      uni.showModal({title:'确认删除',content:'确定要删除该探店吗？',success:async(res)=>{
        if(res.confirm){await this.deleteReview(this.id);uni.showToast({title:'删除成功',icon:'success'});setTimeout(()=>uni.navigateBack(),1000);}
      }});
    },
    async deleteComment(id) {
      uni.showModal({title:'确认删除',content:'确定要删除该评论吗？',success:async(res)=>{
        if(res.confirm){await this.deleteReviewComment(id);this.getReviewCommentPage({reviewId:this.id});}
      }});
    }
  },
  onLoad(options) { this.id=options.id; this.loadDetail(); }
}
</script>
<style>
.container{min-height:100vh;background:#f5f5f5;}
.detail-box{background:#fff;margin:30rpx;border-radius:16rpx;padding:40rpx;box-shadow:0 2rpx 8rpx rgba(0,0,0,0.04);}
.review-title{font-size:36rpx;font-weight:bold;color:#333;margin-bottom:20rpx;}
.review-content{font-size:30rpx;color:#666;margin-bottom:20rpx;}
.review-info{font-size:24rpx;color:#999;margin-bottom:20rpx;}
.actions{margin-bottom:20rpx;}
.del-btn{background:#ff4d4f;color:#fff;border-radius:20rpx;padding:10rpx 30rpx;}
.comment-section{margin-top:40rpx;}
.comment-title{font-size:28rpx;color:#4CAF50;font-weight:bold;margin-bottom:20rpx;}
.comment-item{background:#f8f8f8;border-radius:12rpx;padding:20rpx;margin-bottom:16rpx;display:flex;align-items:center;}
.comment-user{font-size:26rpx;color:#333;margin-right:10rpx;}
.comment-content{font-size:26rpx;color:#666;flex:1;}
.comment-input{display:flex;margin-top:20rpx;}
.input{flex:1;height:60rpx;border-radius:30rpx;background:#f5f5f5;padding:0 20rpx;font-size:28rpx;}
.send-btn{background:#4CAF50;color:#fff;border-radius:30rpx;padding:0 30rpx;margin-left:20rpx;}
.loading,.empty{text-align:center;color:#999;padding:100rpx 0;}
</style> 