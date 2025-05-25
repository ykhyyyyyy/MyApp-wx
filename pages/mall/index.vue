<template>
	<view class="container">
		<!-- 自定义中国风导航栏 -->
		<view class="custom-nav">
			<image class="nav-bg" src="/static/images/nav-mall.png" mode="aspectFill"></image>
			<view class="nav-content">
				<text class="nav-title">锦绣商阁</text>
				<text class="nav-subtitle">校园精品汇</text>
			</view>
		</view>
		
		<view class="header">
			<view class="search-box">
				<view class="search-input-wrapper">
					<image src="/static/icons/search.png" class="search-icon"></image>
					<input class="search-input" type="text" placeholder="搜索商品" />
				</view>
			</view>
		</view>
		
		<view class="banner">
			<swiper circular autoplay interval="3000" indicator-dots class="mall-swiper">
				<swiper-item>
					<image src="/static/images/mall-banner1.png" mode="aspectFill" class="banner-image"></image>
				</swiper-item>
				<swiper-item>
					<image src="/static/images/mall-banner2.png" mode="aspectFill" class="banner-image"></image>
				</swiper-item>
			</swiper>
		</view>
		
		<view class="categories">
			<view class="category-item">
				<image src="/static/icons/cat-food.png" class="category-icon"></image>
				<text class="category-text">美食</text>
			</view>
			<view class="category-item">
				<image src="/static/icons/cat-book.png" class="category-icon"></image>
				<text class="category-text">书籍</text>
			</view>
			<view class="category-item">
				<image src="/static/icons/cat-clothing.png" class="category-icon"></image>
				<text class="category-text">服饰</text>
			</view>
			<view class="category-item">
				<image src="/static/icons/cat-digital.png" class="category-icon"></image>
				<text class="category-text">数码</text>
			</view>
		</view>
		
		<view class="content">
			<text class="placeholder-text">商城功能开发中，敬请期待...</text>
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
	
	.header {
		padding: 20rpx 30rpx;
	}
	
	.search-input-wrapper {
		display: flex;
		align-items: center;
		background: #fff;
		border-radius: 30rpx;
		padding: 0 20rpx;
		border: 1rpx solid #e0c9d1;
	}
	
	.search-icon {
		width: 32rpx;
		height: 32rpx;
		margin-right: 10rpx;
	}
	
	.search-input {
		flex: 1;
		border: none;
		background: transparent;
		font-size: 28rpx;
		padding: 16rpx 0;
		outline: none;
	}
	
	.banner {
		margin: 0 30rpx 30rpx;
	}
	
	.mall-swiper {
		height: 300rpx;
		border-radius: 15rpx;
		overflow: hidden;
	}
	
	.banner-image {
		width: 100%;
		height: 100%;
	}
	
	.categories {
		display: flex;
		justify-content: space-between;
		margin: 0 30rpx 40rpx;
	}
	
	.category-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 25%;
	}
	
	.category-icon {
		width: 80rpx;
		height: 80rpx;
		margin-bottom: 10rpx;
	}
	
	.category-text {
		font-size: 26rpx;
		color: #333;
	}
	
	.content {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 50rpx 30rpx;
	}
	
	.placeholder-text {
		font-size: 30rpx;
		color: #999;
		text-align: center;
	}
</style> 