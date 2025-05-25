<template>
	<view class="container page-content-with-tabbar">
		<!-- 自定义中国风导航栏 -->
		<view class="custom-nav">
			<image class="nav-bg" src="/static/images/nav-user.png" mode="aspectFill"></image>
			<view class="nav-content">
				<text class="nav-title">个人竹简</text>
				<text class="nav-subtitle">个人中心</text>
			</view>
		</view>
		
		<!-- 用户信息卡片 -->
		<view class="user-card chinese-border">
			<!-- 添加装饰元素 -->
			<image class="card-decoration" src="/static/decoration/bamboo-corner.png" mode="aspectFit"></image>
			
			<view class="user-info">
				<view class="avatar-container">
					<image class="avatar" src="/static/avatars/default.png"></image>
					<image class="avatar-frame" src="/static/decoration/avatar-frame.png" mode="aspectFit"></image>
				</view>
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
				<view class="header-title">
					<image class="title-decoration" src="/static/decoration/title-icon.png" mode="aspectFit"></image>
					<text class="card-title">我的订单</text>
				</view>
				<view class="view-all">
					<text>查看全部</text>
					<image src="/static/icons/arrow-right.png" class="icon-arrow"></image>
				</view>
			</view>
			
			<view class="order-items">
				<view class="order-item">
					<view class="order-icon-wrapper">
						<image src="/static/icons/order-unpaid.png" class="order-icon"></image>
					</view>
					<text class="order-text">待付款</text>
				</view>
				<view class="order-item">
					<view class="order-icon-wrapper">
						<image src="/static/icons/order-unshipped.png" class="order-icon"></image>
					</view>
					<text class="order-text">待发货</text>
				</view>
				<view class="order-item">
					<view class="order-icon-wrapper">
						<image src="/static/icons/order-shipped.png" class="order-icon"></image>
					</view>
					<text class="order-text">待收货</text>
				</view>
				<view class="order-item">
					<view class="order-icon-wrapper">
						<image src="/static/icons/order-completed.png" class="order-icon"></image>
					</view>
					<text class="order-text">已完成</text>
				</view>
			</view>
		</view>
		
		<!-- 功能列表 -->
		<view class="menu-list">
			<view class="menu-group">
				<view class="menu-item" @tap="navigateTo('/pages/user/address')">
					<image src="/static/icons/menu-address.png" class="menu-icon"></image>
					<text class="menu-text">收货地址</text>
					<image src="/static/icons/arrow-right.png" class="arrow-icon"></image>
				</view>
				<view class="menu-item" @tap="navigateTo('/pages/user/coupon')">
					<image src="/static/icons/menu-coupon.png" class="menu-icon"></image>
					<text class="menu-text">优惠券</text>
					<view class="menu-badge">3</view>
					<image src="/static/icons/arrow-right.png" class="arrow-icon"></image>
				</view>
				<view class="menu-item" @tap="navigateTo('/pages/user/explore')">
					<image src="/static/icons/menu-explore.png" class="menu-icon"></image>
					<text class="menu-text">我的探店</text>
					<image src="/static/icons/arrow-right.png" class="arrow-icon"></image>
				</view>
			</view>
			
			<view class="menu-group">
				<view class="menu-item" @tap="navigateTo('/pages/user/setting')">
					<image src="/static/icons/menu-setting.png" class="menu-icon"></image>
					<text class="menu-text">设置</text>
					<image src="/static/icons/arrow-right.png" class="arrow-icon"></image>
				</view>
				<view class="menu-item" @tap="navigateTo('/pages/user/feedback')">
					<image src="/static/icons/menu-feedback.png" class="menu-icon"></image>
					<text class="menu-text">意见反馈</text>
					<image src="/static/icons/arrow-right.png" class="arrow-icon"></image>
				</view>
				<view class="menu-item" @tap="navigateTo('/pages/user/about')">
					<image src="/static/icons/menu-about.png" class="menu-icon"></image>
					<text class="menu-text">关于我们</text>
					<image src="/static/icons/arrow-right.png" class="arrow-icon"></image>
				</view>
			</view>
		</view>
		
		<!-- 页脚装饰 -->
		<view class="footer-decoration">
			<image src="/static/decoration/footer-pattern.png" mode="aspectFit" class="footer-image"></image>
		</view>
		
		<!-- AI助手组件 -->
		<ai-assistant></ai-assistant>
		
		<!-- 自定义TabBar组件 -->
		<tab-bar :current="4"></tab-bar>
	</view>
</template>

<script>
	import AiAssistant from '@/components/AiAssistant.vue';
	import TabBar from '@/components/TabBar.vue';
	
	export default {
		components: {
			AiAssistant,
			TabBar
		},
		data() {
			return {
				
			}
		},
		methods: {
			navigateTo(url) {
				uni.navigateTo({
					url: url
				});
			}
		}
	}
</script>

<style>
	.container {
		background-color: var(--bg-paper);
		min-height: 100vh;
		background-image: url('/static/decoration/paper-texture.png');
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
		color: var(--text-brown);
		text-shadow: 2rpx 2rpx 4rpx rgba(255, 255, 255, 0.6);
	}
	
	.nav-subtitle {
		font-size: 20rpx;
		color: #666;
		margin-top: 4rpx;
	}
	
	/* 用户信息卡片 */
	.user-card {
		background-color: var(--primary-red);
		position: relative;
		border-radius: 20rpx;
		padding: 30rpx;
		margin: 20rpx 30rpx 30rpx;
		color: #fff;
		box-shadow: 0 4rpx 10rpx rgba(138, 51, 36, 0.3);
		overflow: hidden;
		background-image: linear-gradient(to bottom right, #8A3324, #A05544);
	}
	
	.card-decoration {
		position: absolute;
		top: 0;
		right: 0;
		width: 120rpx;
		height: 120rpx;
		opacity: 0.2;
		z-index: 1;
	}
	
	.user-info {
		position: relative;
		display: flex;
		align-items: center;
		margin-bottom: 30rpx;
		z-index: 2;
	}
	
	.avatar-container {
		position: relative;
		width: 120rpx;
		height: 120rpx;
		margin-right: 20rpx;
	}
	
	.avatar {
		width: 120rpx;
		height: 120rpx;
		border-radius: 60rpx;
		border: 4rpx solid var(--light-cream);
	}
	
	.avatar-frame {
		position: absolute;
		top: -10rpx;
		left: -10rpx;
		width: 140rpx;
		height: 140rpx;
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
		position: relative;
		display: flex;
		justify-content: space-around;
		border-top: 1rpx solid rgba(255, 255, 255, 0.3);
		padding-top: 20rpx;
		z-index: 2;
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
		background-image: url('/static/decoration/paper-subtle.png');
	}
	
	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
		padding-bottom: 20rpx;
		border-bottom: 1rpx dashed var(--light-cream);
	}
	
	.header-title {
		display: flex;
		align-items: center;
	}
	
	.title-decoration {
		width: 36rpx;
		height: 36rpx;
		margin-right: 10rpx;
	}
	
	.card-title {
		font-size: 32rpx;
		color: var(--text-brown);
		font-family: "FangSong", serif;
		font-weight: bold;
	}
	
	.view-all {
		display: flex;
		align-items: center;
		font-size: 24rpx;
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
	
	.order-icon-wrapper {
		width: 80rpx;
		height: 80rpx;
		background-color: rgba(138, 51, 36, 0.05);
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 10rpx;
	}
	
	.order-icon {
		width: 48rpx;
		height: 48rpx;
	}
	
	.order-text {
		font-size: 24rpx;
		color: var(--text-brown);
	}
	
	/* 功能列表 */
	.menu-list {
		margin: 0 30rpx 30rpx;
	}
	
	.menu-group {
		background-color: #fff;
		border-radius: 20rpx;
		margin-bottom: 30rpx;
		box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.05);
		overflow: hidden;
	}
	
	.menu-item {
		display: flex;
		align-items: center;
		padding: 30rpx;
		position: relative;
	}
	
	.menu-item:not(:last-child)::after {
		content: "";
		position: absolute;
		left: 30rpx;
		right: 30rpx;
		bottom: 0;
		height: 1rpx;
		background-image: linear-gradient(to right, transparent, var(--light-cream), transparent);
	}
	
	.menu-icon {
		width: 40rpx;
		height: 40rpx;
		margin-right: 20rpx;
	}
	
	.menu-text {
		flex: 1;
		font-size: 28rpx;
		color: var(--text-brown);
		font-family: "KaiTi", "FangSong";
	}
	
	.menu-badge {
		background-color: var(--primary-red);
		color: #fff;
		font-size: 20rpx;
		height: 32rpx;
		min-width: 32rpx;
		border-radius: 16rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 8rpx;
		margin-right: 10rpx;
	}
	
	.arrow-icon {
		width: 24rpx;
		height: 24rpx;
	}
	
	/* 页脚装饰 */
	.footer-decoration {
		padding: 40rpx 0;
		display: flex;
		justify-content: center;
	}
	
	.footer-image {
		width: 320rpx;
		height: 60rpx;
		opacity: 0.6;
	}
</style> 