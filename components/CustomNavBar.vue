<template>
	<view class="custom-nav" :style="{ paddingTop: statusBarHeight + 'px' }">
		<image class="nav-bg" src="/static/images/nav-bg.png" mode="aspectFill"></image>
		<view class="nav-content">
			<!-- Back button (shown if not on a tabbar page) -->
			<view v-if="!isTabbarPage && showBack" class="nav-back" @click="goBack">
				<view class="back-icon"></view>
			</view>
			
			<!-- Title area -->
			<view class="title-area">
				<text class="nav-title">{{ title }}</text>
				<text v-if="subtitle" class="nav-subtitle">{{ subtitle }}</text>
			</view>
			
			<!-- Right decoration (optional) -->
			<image v-if="showSeal" class="nav-seal" src="/static/decoration/seal.png" mode="aspectFit"></image>
		</view>
	</view>
</template>

<script>
export default {
	name: 'CustomNavBar',
	props: {
		title: {
			type: String,
			default: '校园益友'
		},
		subtitle: {
			type: String,
			default: 'Campus Friend'
		},
		showBack: {
			type: Boolean,
			default: true
		},
		showSeal: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			statusBarHeight: 20,
			isTabbarPage: false,
			tabbarPages: [
				'pages/index/index',
				'pages/explore/index',
				'pages/forum/index', 
				'pages/mall/index',
				'pages/user/index',
				'pages/friends/index',
				'pages/messages/index'
			]
		}
	},
	created() {
		// Get status bar height
		const systemInfo = uni.getSystemInfoSync();
		this.statusBarHeight = systemInfo.statusBarHeight || 20;
		
		// Check if current page is a tabbar page
		const pages = getCurrentPages();
		const currentPage = pages[pages.length - 1];
		const currentRoute = currentPage.route;
		
		this.isTabbarPage = this.tabbarPages.includes(currentRoute);
	},
	methods: {
		goBack() {
			uni.navigateBack({
				delta: 1,
				fail: () => {
					// If there's no page to go back to, navigate to home
					uni.switchTab({
						url: '/pages/index/index'
					});
				}
			});
		}
	}
}
</script>

<style>
.custom-nav {
	position: relative;
	height: 44px;
	width: 100%;
	overflow: hidden;
	z-index: 999;
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
	align-items: center;
	justify-content: center;
	z-index: 2;
	padding: 0 15px;
}

.nav-back {
	position: absolute;
	left: 15px;
	top: 50%;
	transform: translateY(-50%);
	z-index: 3;
	padding: 8px;
	width: 32rpx;
	height: 32rpx;
}

.back-icon {
	width: 32rpx;
	height: 32rpx;
	background-image: url("data:image/svg+xml,%3Csvg width='24px' height='24px' viewBox='0 0 24 24' version='1.1' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20,11 L7.83,11 L13.42,5.41 L12,4 L4,12 L12,20 L13.41,18.59 L7.83,13 L20,13 L20,11 Z' fill='%23333333'%3E%3C/path%3E%3C/svg%3E");
	background-size: cover;
}

.title-area {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.nav-title {
	font-family: "FangSong", serif;
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	text-shadow: 2rpx 2rpx 4rpx rgba(255, 255, 255, 0.6);
	letter-spacing: 6rpx;
}

.nav-subtitle {
	font-size: 20rpx;
	color: #666;
	margin-top: 4rpx;
}

.nav-seal {
	position: absolute;
	right: 15px;
	top: 50%;
	transform: translateY(-50%);
	width: 60rpx;
	height: 60rpx;
	opacity: 0.8;
	z-index: 3;
}
</style> 