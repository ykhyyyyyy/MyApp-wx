<template>
	<view class="container">
		<!-- Custom navigation bar with back button -->
		<custom-nav-bar title="AI助手" subtitle="智能问答" :show-back="true"></custom-nav-bar>
		
		<view class="ai-content">
			<view class="ai-header">
				<image src="/static/decoration/ai-header.png" mode="aspectFit" class="ai-header-image"></image>
				<text class="ai-title">智能校园助手</text>
				<text class="ai-subtitle">随时为您解答校园相关问题</text>
			</view>
			
			<view class="chat-container">
				<scroll-view scroll-y class="chat-messages">
					<view class="message ai">
						<image src="/static/avatars/ai-avatar.png" class="message-avatar"></image>
						<view class="message-content">
							<text class="message-text">您好，我是校园AI助手，有什么可以帮助您的吗？</text>
						</view>
					</view>
					
					<!-- Example user message -->
					<view class="message user">
						<view class="message-content">
							<text class="message-text">食堂几点开始供应早餐？</text>
						</view>
						<image src="/static/avatars/user-avatar.png" class="message-avatar"></image>
					</view>
					
					<!-- Example AI response -->
					<view class="message ai">
						<image src="/static/avatars/ai-avatar.png" class="message-avatar"></image>
						<view class="message-content">
							<text class="message-text">校内各食堂早餐供应时间为6:30-9:00，其中一食堂和三食堂会提前到6:00开始供应。</text>
						</view>
					</view>
				</scroll-view>
				
				<view class="chat-input-area">
					<input type="text" class="chat-input" placeholder="请输入您的问题..." />
					<button class="send-btn">发送</button>
				</view>
			</view>
			
			<view class="ai-features">
				<view class="feature-title">
					<text>常见问题</text>
				</view>
				<view class="feature-items">
					<view class="feature-item">
						<text>课程安排查询</text>
					</view>
					<view class="feature-item">
						<text>校园活动推荐</text>
					</view>
					<view class="feature-item">
						<text>校园设施导航</text>
					</view>
					<view class="feature-item">
						<text>食堂菜单预览</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import CustomNavBar from '@/components/CustomNavBar.vue';

export default {
	components: {
		CustomNavBar
	},
	data() {
		return {
			
		}
	},
	methods: {
		
	}
}
</script>

<style>
.container {
	background-color: #F8F3E6;
	min-height: 100vh;
	background-image: url('/static/decoration/paper-texture.png');
}

.ai-content {
	padding: 30rpx;
}

.ai-header {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 40rpx;
}

.ai-header-image {
	width: 120rpx;
	height: 120rpx;
	margin-bottom: 20rpx;
}

.ai-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	font-family: "FangSong", serif;
	margin-bottom: 10rpx;
}

.ai-subtitle {
	font-size: 24rpx;
	color: #666;
}

.chat-container {
	background-color: #FFFFFF;
	border-radius: 20rpx;
	padding: 20rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	margin-bottom: 30rpx;
	border: 1rpx solid rgba(224, 201, 209, 0.5);
}

.chat-messages {
	height: 600rpx;
	margin-bottom: 20rpx;
}

.message {
	display: flex;
	margin-bottom: 30rpx;
}

.message-avatar {
	width: 80rpx;
	height: 80rpx;
	border-radius: 40rpx;
	border: 2rpx solid #E0C9D1;
}

.message-content {
	max-width: 70%;
	padding: 20rpx;
	border-radius: 16rpx;
	margin: 0 20rpx;
}

.ai .message-content {
	background-color: #EEE9E1;
}

.user {
	flex-direction: row-reverse;
}

.user .message-content {
	background-color: #D6E4C9;
}

.message-text {
	font-size: 28rpx;
	line-height: 1.5;
	color: #333;
}

.chat-input-area {
	display: flex;
	border-top: 1rpx solid #F0F0F0;
	padding-top: 20rpx;
}

.chat-input {
	flex: 1;
	height: 80rpx;
	background-color: #F8F8F8;
	border-radius: 40rpx;
	padding: 0 30rpx;
	font-size: 28rpx;
}

.send-btn {
	width: 120rpx;
	height: 80rpx;
	background-color: #7EC4CF;
	color: #FFFFFF;
	border-radius: 40rpx;
	margin-left: 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28rpx;
}

.ai-features {
	background-color: #FFFFFF;
	border-radius: 20rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	border: 1rpx solid rgba(224, 201, 209, 0.5);
}

.feature-title {
	font-size: 32rpx;
	color: #333;
	margin-bottom: 20rpx;
	font-weight: bold;
	font-family: "FangSong", serif;
	border-bottom: 1rpx solid #F0F0F0;
	padding-bottom: 16rpx;
}

.feature-items {
	display: flex;
	flex-wrap: wrap;
	gap: 20rpx;
}

.feature-item {
	width: calc(50% - 10rpx);
	background-color: #F5F5F5;
	padding: 20rpx;
	border-radius: 10rpx;
	text-align: center;
	font-size: 28rpx;
	color: #333;
}
</style> 