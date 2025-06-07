<template>
  <view class="container">
    <custom-nav-bar title="聊天" :show-back="true"></custom-nav-bar>
    <scroll-view scroll-y class="msg-list">
      <view v-for="msg in messages" :key="msg.id" :class="['msg-item',msg.senderId===userId?'me':'other']">
        <image v-if="msg.senderId!==userId" :src="friendAvatar" class="avatar"></image>
        <view class="msg-bubble">{{msg.content}}</view>
        <image v-if="msg.senderId===userId" :src="myAvatar" class="avatar"></image>
      </view>
    </scroll-view>
    <view class="input-bar">
      <input v-model="input" class="input" placeholder="请输入消息..." @confirm="sendMsg"/>
      <button class="send-btn" @click="sendMsg">发送</button>
    </view>
  </view>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import CustomNavBar from '@/components/CustomNavBar.vue';
export default {
  components: { CustomNavBar },
  data() { return { input:'', userId:1, friendId:null, myAvatar:'/static/avatars/user1.png', friendAvatar:'/static/avatars/user2.png' }; },
  computed: {
    ...mapState('chat', ['chatMessages']),
    messages() { return this.chatMessages; }
  },
  methods: {
    ...mapActions('chat', ['getChatMessages','sendMessage']),
    async loadMsgs() {
      await this.getChatMessages({senderId:this.userId,receiverId:this.friendId});
    },
    async sendMsg() {
      if (!this.input.trim()) return;
      await this.sendMessage({senderId:this.userId,receiverId:this.friendId,content:this.input,messageType:'TEXT'});
      this.input='';
      this.loadMsgs();
    }
  },
  onLoad(options) {
    this.friendId = options.friendId;
    this.loadMsgs();
  }
}
</script>
<style>
.container{min-height:100vh;background:#f5f5f5;display:flex;flex-direction:column;}
.msg-list{flex:1;padding:30rpx;overflow-y:auto;}
.msg-item{display:flex;align-items:flex-end;margin-bottom:20rpx;}
.msg-item.me{flex-direction:row-reverse;}
.avatar{width:60rpx;height:60rpx;border-radius:30rpx;margin:0 10rpx;}
.msg-bubble{max-width:60vw;padding:20rpx 30rpx;border-radius:20rpx;background:#fff;font-size:28rpx;box-shadow:0 2rpx 8rpx rgba(0,0,0,0.04);}
.msg-item.me .msg-bubble{background:#4CAF50;color:#fff;}
.input-bar{display:flex;padding:20rpx;background:#fff;}
.input{flex:1;height:60rpx;border-radius:30rpx;background:#f5f5f5;padding:0 20rpx;font-size:28rpx;}
.send-btn{background:#4CAF50;color:#fff;border-radius:30rpx;padding:0 30rpx;margin-left:20rpx;}
</style> 