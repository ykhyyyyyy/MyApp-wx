<template>
	<view class="container">
		<!-- 自定义中国风导航栏 -->
		<view class="custom-nav">
			<image class="nav-bg" src="/static/images/nav-forum.png" mode="aspectFill"></image>
			<view class="nav-content">
				<text class="nav-title">墨香书院</text>
				<text class="nav-subtitle">校园论坛</text>
			</view>
		</view>
		
		<view class="header">
			<view class="search-box">
				<view class="search-input-wrapper">
					<image src="/static/icons/search.png" class="search-icon"></image>
					<input class="search-input" type="text" placeholder="搜索帖子" />
				</view>
			</view>
		</view>
		
		<view class="categories">
			<scroll-view scroll-x class="categories-scroll" show-scrollbar="false">
				<view class="category-item active">
					<text>全部</text>
				</view>
				<view class="category-item">
					<text>热门</text>
				</view>
				<view class="category-item">
					<text>美食</text>
				</view>
				<view class="category-item">
					<text>学习</text>
				</view>
				<view class="category-item">
					<text>活动</text>
				</view>
				<view class="category-item">
					<text>交友</text>
				</view>
			</scroll-view>
		</view>
		
		<view class="content">
			<text class="placeholder-text">论坛功能开发中，敬请期待...</text>
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
	
	.categories {
		margin: 0 30rpx 30rpx;
	}
	
	.categories-scroll {
		white-space: nowrap;
	}
	
	.category-item {
		display: inline-block;
		padding: 12rpx 30rpx;
		margin-right: 15rpx;
		background-color: #fff;
		border-radius: 30rpx;
		font-size: 28rpx;
		color: #666;
		border: 1rpx solid #e0e0e0;
	}
	
	.category-item.active {
		background-color: #7EC4CF;
		color: #fff;
		border-color: #7EC4CF;
	}
	
	.content {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 100rpx 30rpx;
	}
	
	.placeholder-text {
		font-size: 30rpx;
		color: #999;
		text-align: center;
	}
</style> 