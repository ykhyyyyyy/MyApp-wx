<template>
	<view class="container">
		<!-- 自定义中国风导航栏 -->
		<view class="custom-nav">
			<image class="nav-bg" src="/static/images/nav-user.png" mode="aspectFill"></image>
			<view class="nav-content">
				<text class="nav-title">个人竹简</text>
				<text class="nav-subtitle">个人中心</text>
			</view>
		</view>
		
		<!-- 用户信息卡片 -->
		<view class="user-card">
			<view class="user-info">
				<image class="avatar" src="https://ykhyyy.oss-cn-beijing.aliyuncs.com/MyApp/userAvatar/default-avatar.png"></image>
				<view class="user-detail">
					<text class="username">未登录</text>
					<text class="login-tip">点击登录账号</text>
				</view>
			</view>
			<view class="user-stats">
				<view class="stat-item">
					<text class="stat-num">0</text>
					<text class="stat-label">收藏</text>
				</view>
				<view class="stat-item">
					<text class="stat-num">0</text>
					<text class="stat-label">关注</text>
				</view>
				<view class="stat-item">
					<text class="stat-num">0</text>
					<text class="stat-label">点赞</text>
				</view>
			</view>
		</view>
		
		<!-- 订单信息卡片 -->
		<view class="order-card">
			<view class="card-header">
				<text class="card-title">我的订单</text>
				<view class="view-all">
					<text>查看全部</text>
					<image src="/static/icons/arrow-right.png" class="icon-arrow"></image>
				</view>
			</view>
			
			<view class="order-items">
				<view class="order-item">
					<image src="/static/icons/order-unpaid.png" class="order-icon"></image>
					<text class="order-text">待付款</text>
				</view>
				<view class="order-item">
					<image src="/static/icons/order-unshipped.png" class="order-icon"></image>
					<text class="order-text">待发货</text>
				</view>
				<view class="order-item">
					<image src="/static/icons/order-shipped.png" class="order-icon"></image>
					<text class="order-text">待收货</text>
				</view>
				<view class="order-item">
					<image src="/static/icons/order-completed.png" class="order-icon"></image>
					<text class="order-text">已完成</text>
				</view>
			</view>
		</view>
		
		<!-- 功能列表 -->
		<view class="menu-list">
			<view class="menu-group">
				<view class="menu-item">
					<image src="/static/icons/menu-address.png" class="menu-icon"></image>
					<text class="menu-text">收货地址</text>
					<image src="/static/icons/arrow-right.png" class="arrow-icon"></image>
				</view>
				<view class="menu-item">
					<image src="/static/icons/menu-coupon.png" class="menu-icon"></image>
					<text class="menu-text">优惠券</text>
					<image src="/static/icons/arrow-right.png" class="arrow-icon"></image>
				</view>
				<view class="menu-item">
					<image src="/static/icons/menu-explore.png" class="menu-icon"></image>
					<text class="menu-text">我的探店</text>
					<image src="/static/icons/arrow-right.png" class="arrow-icon"></image>
				</view>
			</view>
			
			<view class="menu-group">
				<view class="menu-item">
					<image src="/static/icons/menu-setting.png" class="menu-icon"></image>
					<text class="menu-text">设置</text>
					<image src="/static/icons/arrow-right.png" class="arrow-icon"></image>
				</view>
				<view class="menu-item">
					<image src="/static/icons/menu-feedback.png" class="menu-icon"></image>
					<text class="menu-text">意见反馈</text>
					<image src="/static/icons/arrow-right.png" class="arrow-icon"></image>
				</view>
				<view class="menu-item">
					<image src="/static/icons/menu-about.png" class="menu-icon"></image>
					<text class="menu-text">关于我们</text>
					<image src="/static/icons/arrow-right.png" class="arrow-icon"></image>
				</view>
			</view>
		</view>
		
		<!-- AI助手组件 -->
		<ai-assistant></ai-assistant>
	</view>
</template>

<script>
	import AiAssistant from '@/components/AiAssistant.vue';
	
	export default {
		components: {
			AiAssistant
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
		background-color: #F8F7F2;
		min-height: 100vh;
	}
	
	/* 自定义中国风导航栏 */
	.custom-nav {
		position: relative;
		height: 180rpx;
		padding-top: var(--status-bar-height);
		overflow: hidden;
	}
	
	.nav-bg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
	}
	
	.nav-content {
		position: relative;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		z-index: 2;
	}
	
	.nav-title {
		font-family: "FangSong", serif;
		font-size: 40rpx;
		font-weight: bold;
		color: #333;
		text-shadow: 2rpx 2rpx 4rpx rgba(255, 255, 255, 0.6);
	}
	
	.nav-subtitle {
		font-size: 20rpx;
		color: #666;
		margin-top: 4rpx;
	}
	
	/* 用户信息卡片 */
	.user-card {
		background-color: #7EC4CF;
		border-radius: 20rpx;
		padding: 30rpx;
		margin: 20rpx 30rpx 30rpx;
		color: #fff;
		box-shadow: 0 4rpx 10rpx rgba(126, 196, 207, 0.3);
	}
	
	.user-info {
		display: flex;
		align-items: center;
		margin-bottom: 30rpx;
	}
	
	.avatar {
		width: 120rpx;
		height: 120rpx;
		border-radius: 60rpx;
		border: 4rpx solid rgba(255, 255, 255, 0.6);
		margin-right: 20rpx;
	}
	
	.username {
		font-size: 36rpx;
		font-weight: bold;
		margin-bottom: 10rpx;
		display: block;
	}
	
	.login-tip {
		font-size: 24rpx;
		opacity: 0.8;
	}
	
	.user-stats {
		display: flex;
		justify-content: space-around;
		border-top: 1rpx solid rgba(255, 255, 255, 0.3);
		padding-top: 20rpx;
	}
	
	.stat-item {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.stat-num {
		font-size: 32rpx;
		font-weight: bold;
		margin-bottom: 6rpx;
	}
	
	.stat-label {
		font-size: 24rpx;
		opacity: 0.8;
	}
	
	/* 订单卡片 */
	.order-card {
		background-color: #fff;
		border-radius: 20rpx;
		padding: 30rpx;
		margin: 0 30rpx 30rpx;
		box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.05);
	}
	
	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
		padding-bottom: 20rpx;
		border-bottom: 1rpx solid #f0f0f0;
	}
	
	.card-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}
	
	.view-all {
		display: flex;
		align-items: center;
		font-size: 26rpx;
		color: #999;
	}
	
	.icon-arrow {
		width: 24rpx;
		height: 24rpx;
		margin-left: 6rpx;
	}
	
	.order-items {
		display: flex;
		justify-content: space-around;
	}
	
	.order-item {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.order-icon {
		width: 60rpx;
		height: 60rpx;
		margin-bottom: 10rpx;
	}
	
	.order-text {
		font-size: 26rpx;
		color: #666;
	}
	
	/* 菜单列表 */
	.menu-list {
		background-color: #fff;
		border-radius: 20rpx;
		overflow: hidden;
		margin: 0 30rpx;
		box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.05);
	}
	
	.menu-group {
		margin-bottom: 20rpx;
	}
	
	.menu-item {
		display: flex;
		align-items: center;
		padding: 30rpx;
		border-bottom: 1rpx solid #f5f5f5;
	}
	
	.menu-item:last-child {
		border-bottom: none;
	}
	
	.menu-icon {
		width: 40rpx;
		height: 40rpx;
		margin-right: 20rpx;
	}
	
	.menu-text {
		flex: 1;
		font-size: 28rpx;
		color: #333;
	}
	
	.arrow-icon {
		width: 24rpx;
		height: 24rpx;
		opacity: 0.5;
	}
</style> 