<template>
	<view class="container">
		<!-- 使用自定义导航栏 -->
		<custom-nav-bar title="消息中心" subtitle="Messages" :show-back="false"></custom-nav-bar>
		
		<!-- 搜索框 -->
		<view class="header">
			<view class="search-box">
				<view class="search-input-wrapper">
					<image src="/static/icons/search.png" class="search-icon"></image>
					<input class="search-input" type="text" placeholder="搜索聊天记录" />
				</view>
			</view>
		</view>
		
		<!-- 消息分类 -->
		<view class="category-tabs">
			<view class="tab-item active">
				<text>私信</text>
				<view class="active-line"></view>
			</view>
			<view class="tab-item">
				<text>通知</text>
			</view>
			<view class="tab-item">
				<text>系统</text>
			</view>
		</view>
		
		<!-- 消息列表 -->
		<scroll-view scroll-y class="message-scroll">
			<view class="section-title-wrapper">
				<view class="section-title-line"></view>
				<text class="section-title">最近消息</text>
				<view class="section-title-line"></view>
			</view>
			
			<view class="messages-list">
				<view class="message-item" v-for="(chat, index) in chatList" :key="index" @click="openChat(chat.id)">
					<view class="message-left">
						<view class="avatar-container">
							<image :src="chat.avatar" class="message-avatar"></image>
							<view v-if="chat.unread" class="unread-badge">{{chat.unread > 99 ? '99+' : chat.unread}}</view>
						</view>
					</view>
					<view class="message-right">
						<view class="message-header">
							<text class="message-name">{{chat.name}}</text>
							<text class="message-time">{{chat.time}}</text>
						</view>
						<view class="message-content">
							<text class="message-preview">{{chat.lastMessage}}</text>
							<view class="message-status" v-if="chat.status">{{chat.status}}</view>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 消息空状态 -->
			<view class="empty-state" v-if="chatList.length === 0">
				<image src="/static/icons/comment.png" mode="aspectFit" class="empty-image"></image>
				<text class="empty-text">暂无消息</text>
				<text class="empty-subtext">添加好友开始聊天吧</text>
			</view>
		</scroll-view>
		
		<!-- 创建新消息按钮 -->
		<view class="new-message-btn">
			<image src="/static/icons/write.png" class="new-message-icon"></image>
		</view>
		
		<!-- 页脚装饰元素 -->
		<view class="footer-decoration">
			<image src="/static/decoration/footer-pattern.png" mode="aspectFit" class="footer-image"></image>
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
			chatList: [
				{
					id: '1',
					name: '张三',
					avatar: 'https://ykhyyy.oss-cn-beijing.aliyuncs.com/MyApp/userAvatar/default-avatar.png',
					lastMessage: '你好，请问什么时候可以一起讨论项目？',
					time: '12:30',
					unread: 2,
					status: ''
				},
				{
					id: '2',
					name: '李四',
					avatar: 'https://ykhyyy.oss-cn-beijing.aliyuncs.com/MyApp/userAvatar/default-avatar.png',
					lastMessage: '我已经完成了任务，请查收。',
					time: '昨天',
					unread: 0,
					status: '已读'
				},
				{
					id: '3',
					name: '王五',
					avatar: 'https://ykhyyy.oss-cn-beijing.aliyuncs.com/MyApp/userAvatar/default-avatar.png',
					lastMessage: '[图片]',
					time: '周一',
					unread: 5,
					status: ''
				},
				{
					id: '4',
					name: '系统通知',
					avatar: 'https://ykhyyy.oss-cn-beijing.aliyuncs.com/MyApp/userAvatar/default-avatar.png',
					lastMessage: '您的账户已完成实名认证',
					time: '周日',
					unread: 0,
					status: ''
				}
			]
		}
	},
	onLoad() {
		// Initialize user data
	},
	methods: {
		openChat(id) {
			uni.navigateTo({
				url: `/pages/messages/chat/index?id=${id}`
			});
		}
	}
}
</script>

<style>
.container {
	background-color: #F8F7F2;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
}

/* 搜索框样式 */
.header {
	padding: 20rpx 30rpx;
	background-color: #FFFFFF;
}

.search-box {
	width: 100%;
}

.search-input-wrapper {
	display: flex;
	align-items: center;
	background-color: #F5F5F5;
	border-radius: 40rpx;
	padding: 0 20rpx;
	height: 70rpx;
}

.search-icon {
	width: 32rpx;
	height: 32rpx;
	margin-right: 10rpx;
}

.search-input {
	flex: 1;
	height: 70rpx;
	font-size: 28rpx;
	background-color: transparent;
	border: none;
}

/* 分类标签样式 */
.category-tabs {
	display: flex;
	background-color: #FFFFFF;
	padding: 0 30rpx;
	border-bottom: 1rpx solid #EEEEEE;
}

.tab-item {
	position: relative;
	padding: 20rpx 0;
	margin-right: 60rpx;
	font-size: 28rpx;
	color: #666666;
}

.tab-item.active {
	color: #8A3324;
	font-weight: bold;
}

.active-line {
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 4rpx;
	background-color: #8A3324;
	border-radius: 2rpx;
}

/* 消息列表滚动区域 */
.message-scroll {
	flex: 1;
	background-color: #F8F7F2;
	padding: 20rpx 30rpx;
}

/* 标题样式 */
.section-title-wrapper {
	display: flex;
	align-items: center;
	margin: 20rpx 0 30rpx;
}

.section-title-line {
	flex: 1;
	height: 1rpx;
	background-color: #DDDDDD;
}

.section-title {
	padding: 0 20rpx;
	font-size: 28rpx;
	color: #999999;
	font-family: "FangSong", serif;
}

/* 消息列表样式 */
.messages-list {
	display: flex;
	flex-direction: column;
}

.message-item {
	display: flex;
	padding: 24rpx;
	background-color: #FFFFFF;
	margin-bottom: 20rpx;
	border-radius: 16rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.message-left {
	margin-right: 20rpx;
}

.avatar-container {
	position: relative;
}

.message-avatar {
	width: 90rpx;
	height: 90rpx;
	border-radius: 12rpx;
	border: 2rpx solid rgba(138, 51, 36, 0.1);
}

.unread-badge {
	position: absolute;
	top: -8rpx;
	right: -8rpx;
	min-width: 32rpx;
	height: 32rpx;
	border-radius: 16rpx;
	background-color: #8A3324;
	color: white;
	font-size: 20rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 0 6rpx;
}

.message-right {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.message-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10rpx;
}

.message-name {
	font-size: 30rpx;
	color: #333333;
	font-weight: bold;
}

.message-time {
	font-size: 24rpx;
	color: #999999;
}

.message-content {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.message-preview {
	font-size: 26rpx;
	color: #666666;
	flex: 1;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.message-status {
	font-size: 22rpx;
	color: #7EC4CF;
	background-color: rgba(126, 196, 207, 0.1);
	padding: 4rpx 12rpx;
	border-radius: 20rpx;
	margin-left: 10rpx;
}

/* 空状态样式 */
.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 100rpx 0;
}

.empty-image {
	width: 160rpx;
	height: 160rpx;
	margin-bottom: 30rpx;
	opacity: 0.5;
}

.empty-text {
	font-size: 32rpx;
	color: #8C7853;
	font-weight: bold;
	margin-bottom: 10rpx;
}

.empty-subtext {
	font-size: 26rpx;
	color: #999999;
}

/* 新消息按钮 */
.new-message-btn {
	position: fixed;
	right: 40rpx;
	bottom: 100rpx;
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	background: linear-gradient(135deg, #7EC4CF, #8A3324);
	display: flex;
	justify-content: center;
	align-items: center;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.2);
}

.new-message-icon {
	width: 50rpx;
	height: 50rpx;
}

/* 页脚装饰 */
.footer-decoration {
	padding: 30rpx 0;
	display: flex;
	justify-content: center;
}

.footer-image {
	width: 300rpx;
	height: 40rpx;
	opacity: 0.6;
}
</style> 