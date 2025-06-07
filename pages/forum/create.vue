<template>
  <view class="container">
    <custom-nav-bar title="发帖" :show-back="true"></custom-nav-bar>
    <view class="form-box">
      <view class="form-item">
        <text class="label">标题</text>
        <input v-model="title" class="input" placeholder="请输入标题"/>
      </view>
      <view class="form-item">
        <text class="label">内容</text>
        <textarea v-model="content" class="textarea" placeholder="请输入内容"/>
      </view>
      <view class="form-item">
        <text class="label">图片（可选）</text>
        <button @click="chooseImage">选择图片</button>
        <view class="img-list">
          <image v-for="(img,i) in imgs" :key="i" :src="img" class="img"></image>
        </view>
      </view>
      <button class="submit-btn" @click="submit">发布</button>
    </view>
  </view>
</template>
<script>
import { mapActions } from 'vuex';
import CustomNavBar from '@/components/CustomNavBar.vue';
export default {
  components: { CustomNavBar },
  data() { return { title:'', content:'', imgs:[], userId:1 }; },
  methods: {
    ...mapActions('post', ['createPost']),
    chooseImage() {
      uni.chooseImage({count:3,success:res=>{this.imgs.push(...res.tempFilePaths);}});
    },
    async submit() {
      if (!this.title.trim() || !this.content.trim()) {
        uni.showToast({title:'标题和内容不能为空',icon:'none'});return;
      }
      await this.createPost({userId:this.userId,title:this.title,content:this.content,imgs:this.imgs});
      uni.showToast({title:'发布成功',icon:'success'});
      setTimeout(()=>uni.navigateBack(),1000);
    }
  }
}
</script>
<style>
.container{min-height:100vh;background:#f5f5f5;}
.form-box{background:#fff;margin:30rpx;border-radius:16rpx;padding:40rpx;box-shadow:0 2rpx 8rpx rgba(0,0,0,0.04);}
.form-item{margin-bottom:30rpx;}
.label{font-size:28rpx;color:#333;margin-bottom:10rpx;display:block;}
.input{width:100%;height:60rpx;border-radius:8rpx;background:#f5f5f5;padding:0 20rpx;font-size:28rpx;}
.textarea{width:100%;height:160rpx;border-radius:8rpx;background:#f5f5f5;padding:20rpx;font-size:28rpx;}
.img-list{display:flex;margin-top:10rpx;}
.img{width:120rpx;height:120rpx;border-radius:8rpx;margin-right:10rpx;}
.submit-btn{background:#4CAF50;color:#fff;border-radius:30rpx;padding:20rpx 0;font-size:32rpx;width:100%;}
</style> 