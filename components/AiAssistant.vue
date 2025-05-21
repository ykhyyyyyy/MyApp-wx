<template>
	<view>
		<!-- 悬浮AI助手按钮 -->
		<view class="ai-floating-btn" @click="openAiDialog">
			<image :src="'/static/icons/ai.png'" class="ai-icon"></image>
		</view>
		
		<!-- AI对话框 -->
		<view class="ai-dialog" v-if="showDialog">
			<view class="ai-dialog-header">
				<text class="ai-dialog-title">智能助手</text>
				<view class="ai-dialog-close" @click="closeAiDialog">×</view>
			</view>
			<view class="ai-dialog-content">
				<scroll-view scroll-y class="ai-messages">
					<view class="ai-message ai-message-bot">
						<text>您好，我是校园益友智能助手，有什么可以帮您？</text>
					</view>
					<view class="ai-message ai-message-user" v-for="(msg, index) in userMessages" :key="index">
						<text>{{msg}}</text>
					</view>
					<view class="ai-message ai-message-bot" v-if="botResponse">
						<text>{{botResponse}}</text>
					</view>
				</scroll-view>
				<view class="ai-input-area">
					<input class="ai-input" v-model="userInput" placeholder="请输入您的问题..." @confirm="sendMessage"/>
					<view class="ai-send-btn" @click="sendMessage">发送</view>
				</view>
			</view>
		</view>
		
		<!-- 遮罩层 -->
		<view class="ai-mask" v-if="showDialog" @click="closeAiDialog"></view>
	</view>
</template>

<script>
	export default {
		name: 'AiAssistant',
		data() {
			return {
				showDialog: false,
				userInput: '',
				userMessages: [],
				botResponse: ''
			}
		},
		methods: {
			openAiDialog() {
				this.showDialog = true;
			},
			closeAiDialog() {
				this.showDialog = false;
			},
			sendMessage() {
				if (this.userInput.trim()) {
					// 添加用户消息
					this.userMessages.push(this.userInput);
					
					// 模拟AI响应（实际项目中会调用AI接口）
					setTimeout(() => {
						this.botResponse = "感谢您的提问。我们正在开发AI功能，即将上线，敬请期待！";
					}, 500);
					
					// 清空输入框
					this.userInput = '';
				}
			}
		}
	}
</script>

<style>
	/* 悬浮AI助手按钮 */
	.ai-floating-btn {
		position: fixed;
		right: 30rpx;
		bottom: 160rpx;
		width: 100rpx;
		height: 100rpx;
		background-color: #8A3324; /* 朱砂红 */
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.2);
		z-index: 100;
		border: 4rpx solid rgba(255, 255, 255, 0.8);
	}
	
	.ai-icon {
		width: 60rpx;
		height: 60rpx;
	}
	
	/* AI对话框 */
	.ai-dialog {
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 80%;
		height: 70%;
		background-color: #F8F3E6; /* 宣纸色 */
		border-radius: 20rpx;
		z-index: 1001;
		display: flex;
		flex-direction: column;
		box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.15);
		background-image: url('/static/decoration/paper-texture.png');
		border: 6rpx solid #8A3324; /* 朱砂红 */
		overflow: hidden;
	}
	
	.ai-dialog-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 30rpx;
		border-bottom: 2rpx solid #D7C9AA; /* 淡竹色 */
		background-color: #8A3324; /* 朱砂红 */
	}
	
	.ai-dialog-title {
		font-size: 32rpx;
		color: #FFF;
		font-weight: bold;
		font-family: "FangSong", serif;
		letter-spacing: 4rpx;
	}
	
	.ai-dialog-close {
		font-size: 40rpx;
		color: #FFF;
		width: 60rpx;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.ai-dialog-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 20rpx;
	}
	
	.ai-messages {
		flex: 1;
		padding: 10rpx;
	}
	
	.ai-message {
		margin-bottom: 20rpx;
		padding: 20rpx;
		border-radius: 10rpx;
		max-width: 80%;
	}
	
	.ai-message-bot {
		background-color: #D7C9AA; /* 淡竹色 */
		align-self: flex-start;
		border-top-left-radius: 0;
		margin-left: 10rpx;
		color: #333333; /* 墨色 */
	}
	
	.ai-message-user {
		background-color: #8A6642; /* 茶褐色 */
		color: #FFF;
		align-self: flex-end;
		border-top-right-radius: 0;
		margin-left: auto;
		margin-right: 10rpx;
	}
	
	.ai-input-area {
		display: flex;
		padding: 20rpx 10rpx;
		border-top: 2rpx solid #D7C9AA; /* 淡竹色 */
		background-color: rgba(248, 243, 230, 0.7); /* 宣纸色 */
	}
	
	.ai-input {
		flex: 1;
		height: 80rpx;
		padding: 0 20rpx;
		border: 2rpx solid #D7C9AA; /* 淡竹色 */
		border-radius: 40rpx;
		background-color: #FFF;
		font-size: 28rpx;
	}
	
	.ai-send-btn {
		width: 120rpx;
		height: 80rpx;
		background-color: #8A3324; /* 朱砂红 */
		color: #FFF;
		border-radius: 40rpx;
		margin-left: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
	}
	
	/* 遮罩层 */
	.ai-mask {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 1000;
	}
</style> 