<template>
	<view class="container page-content-with-tabbar">
		<!-- 自定义中国风导航栏 -->
		<view class="custom-nav">
			<image class="nav-bg" src="/static/images/nav-explore.png" mode="aspectFill"></image>
			<view class="nav-content">
				<text class="nav-title">探店寻宝</text>
				<text class="nav-subtitle">美食与商店探索</text>
			</view>
		</view>
		
		<view class="header">
			<view class="search-box">
				<view class="search-input-wrapper">
					<image src="/static/icons/search.png" class="search-icon"></image>
					<input class="search-input" type="text" placeholder="搜索店铺或美食" />
				</view>
			</view>
		</view>
		
		<view class="content">
			<text class="placeholder-text">探店功能开发中，敬请期待...</text>
		</view>
		
		<!-- AI助手组件 -->
		<ai-assistant></ai-assistant>
		
		<!-- 自定义TabBar组件 -->
		<tab-bar :current="1"></tab-bar>
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
	
	.header {
		padding: 30rpx;
	}
	
	.search-input-wrapper {
		display: flex;
		align-items: center;
		background: #fff;
		border-radius: 30rpx;
		padding: 0 20rpx;
		border: 1rpx solid var(--light-cream);
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