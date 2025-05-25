<template>
	<view class="container page-content-with-tabbar">
		<!-- Use the custom navigation bar component with back button disabled -->
		<custom-nav-bar title="校园益友" subtitle="Campus Friend" :show-back="false"></custom-nav-bar>

		<!-- Header with Chinese-style design -->
		<view class="header">
			<view class="search-box">
				<view class="search-input-wrapper">
					<image src="/static/icons/search.png" class="search-icon"></image>
					<input class="search-input" type="text" placeholder="搜索帖子、店铺或商品" />
				</view>
			</view>
		</view>
		
		<!-- Banner carousel with scroll decoration -->
		<view class="banner-wrapper">
			<image class="scroll-left" src="/static/decoration/scroll-left.png" mode="aspectFit"></image>
			<swiper class="banner" circular autoplay interval="3000" indicator-dots>
				<swiper-item v-for="(item, index) in bannerList" :key="index">
					<image :src="item.image" mode="aspectFill" style="width:100%;height:100%"></image>
				</swiper-item>
			</swiper>
			<image class="scroll-right" src="/static/decoration/scroll-right.png" mode="aspectFit"></image>
		</view>
		
		<!-- Quick access icons 添加云纹背景 -->
		<view class="quick-access">
			<image class="cloud-pattern" src="/static/decoration/cloud-pattern.png" mode="aspectFill"></image>
			<view class="quick-item" v-for="(item, index) in quickAccessList" :key="index" @click="navigateTo(item.path)">
				<image :src="item.icon" mode="aspectFit" class="quick-item-icon"></image>
				<text class="quick-item-text">{{item.name}}</text>
			</view>
		</view>
		
		<!-- Post section -->
		<view class="section post-section">
			<!-- 添加装饰标题 -->
			<view class="section-header">
				<image class="section-title-decoration" src="/static/decoration/title-left.png" mode="aspectFit"></image>
				<text class="section-title">热门帖子</text>
				<image class="section-title-decoration" src="/static/decoration/title-right.png" mode="aspectFit"></image>
				<view class="section-more" @click="navigateTo('./forum/index')">
					<text>查看更多</text>
					<image src="/static/icons/arrow-right.png" class="icon-arrow"></image>
				</view>
			</view>
			<!-- Post list -->
			<view class="post-list">
				<view class="post-item" v-for="(post, index) in postList" :key="index" @click="viewPostDetail(post.id)">
					<view class="post-header">
						<view class="post-user">
							<image :src="post.avatar" class="post-avatar"></image>
							<text class="post-username">{{post.username}}</text>
						</view>
						<text class="post-time">{{post.time}}</text>
					</view>
					<text class="post-title">{{post.title}}</text>
					<text class="post-content">{{post.content}}</text>
					<view class="post-images" v-if="post.images && post.images.length">
						<image 
							v-for="(img, imgIndex) in post.images" 
							:key="imgIndex" 
							:src="img" 
							mode="aspectFill" 
							class="post-image"
						></image>
					</view>
					<view class="post-footer">
						<view class="post-action">
							<image src="/static/icons/eye.png" class="icon-action"></image>
							<text>{{post.views}}</text>
						</view>
						<view class="post-action">
							<image src="/static/icons/comment.png" class="icon-action"></image>
							<text>{{post.comments}}</text>
						</view>
						<view class="post-action">
							<image src="/static/icons/like.png" class="icon-action"></image>
							<text>{{post.likes}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 页脚装饰元素 -->
		<view class="footer-decoration">
			<image src="/static/decoration/footer-pattern.png" mode="aspectFit" class="footer-image"></image>
		</view>
		
		<!-- AI助手组件 -->
		<ai-assistant></ai-assistant>
		
		<!-- 自定义TabBar组件 -->
		<tab-bar :current="0"></tab-bar>
	</view>
</template>

<script>
import AiAssistant from '@/components/AiAssistant.vue';
import CustomNavBar from '@/components/CustomNavBar.vue';
import TabBar from '@/components/TabBar.vue';
import { mapState } from 'vuex';

export default {
	components: {
		AiAssistant,
		CustomNavBar,
		TabBar
	},
	data() {
		return {
			title: '校园益友'
		}
	},
	computed: {
		...mapState(['bannerList', 'quickAccessList', 'postList', 'shopList'])
	},
	onLoad() {
		// Initial page loading logic
	},
	methods: {
		navigateTo(path) {
			// Ensure path has the correct format
			if (path.startsWith('./')) {
				// Convert relative path to absolute path for index page
				const absolutePath = `/pages${path.substring(1)}`;
				uni.navigateTo({
					url: absolutePath
				});
			} else {
				// Use the path as-is if it already has the correct format
				uni.navigateTo({
					url: path
				});
			}
		},
		viewPostDetail(id) {
			uni.navigateTo({
				url: `/pages/forum/detail?id=${id}`
			});
		},
		viewShopDetail(id) {
			uni.navigateTo({
				url: `/pages/shops/detail?id=${id}`
			});
		}
	}
}
</script>

<style>
	.container {
		background-color: var(--bg-paper); /* 使用全局变量 */
		min-height: 100vh;
		background-image: url('/static/decoration/paper-texture.png');
		background-repeat: repeat;
	}
	
	.header {
		padding: 20rpx 30rpx;
	}
	
	.search-box {
		width: 100%;
	}
	
	.search-input-wrapper {
		display: flex;
		align-items: center;
		background: #fff;
		border-radius: 30rpx;
		padding: 0 20rpx;
		border: 1rpx solid var(--light-cream);
		/* 添加卷轴样式边框 */
		box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05);
		background-image: url('/static/decoration/paper-subtle.png');
	}
	
	/* Banner styling with scroll decoration */
	.banner-wrapper {
		position: relative;
		padding: 20rpx 30rpx;
	}
	
	.banner {
		border-radius: 20rpx;
		overflow: hidden;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
		height: 300rpx;
		z-index: 1;
	}
	
	.scroll-left, .scroll-right {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		width: 60rpx;
		height: 180rpx;
		z-index: 2;
	}
	
	.scroll-left {
		left: 10rpx;
	}
	
	.scroll-right {
		right: 10rpx;
	}
	
	/* Quick access icons with cloud pattern */
	.quick-access {
		position: relative;
		display: flex;
		justify-content: space-around;
		padding: 30rpx;
		background-color: #FFFFFF;
		margin: 20rpx 30rpx;
		border-radius: 20rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
		overflow: hidden;
	}
	
	.cloud-pattern {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0.05;
		z-index: 1;
	}
	
	.quick-item {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		z-index: 2;
	}
	
	.quick-item-icon {
		width: 80rpx;
		height: 80rpx;
		margin-bottom: 10rpx;
	}
	
	.quick-item-text {
		font-size: 26rpx;
		color: #333;
		font-family: "KaiTi", "FangSong"; /* 使用楷体 */
	}
	
	/* Section styling */
	.section {
		margin: 30rpx;
		background-color: #FFFFFF;
		border-radius: 20rpx;
		padding: 30rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
		border: 1rpx solid rgba(224, 201, 209, 0.5); /* 浅色边框 */
	}
	
	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
		border-bottom: 2rpx solid #F0F0F0;
		padding-bottom: 16rpx;
		position: relative;
	}
	
	.section-title-decoration {
		width: 24rpx;
		height: 24rpx;
		margin: 0 10rpx;
	}
	
	.section-title {
		font-family: "Source Han Serif CN", "FangSong", serif;
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
		position: relative;
		letter-spacing: 4rpx;
	}
	
	.section-title::before {
		content: "";
		position: absolute;
		left: -15rpx;
		top: 50%;
		height: 30rpx;
		width: 8rpx;
		background-color: #7EC4CF; /* Main cyan color */
		border-radius: 4rpx;
		transform: translateY(-50%);
	}
	
	.section-more {
		display: flex;
		align-items: center;
		font-size: 24rpx;
		color: #7EC4CF;
	}
	
	/* Post styling with more Chinese elements */
	.post-list {
		display: flex;
		flex-direction: column;
		gap: 30rpx;
	}
	
	.post-item {
		background-color: #FFFFFF;
		border-radius: 16rpx;
		padding: 20rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
		border-left: 6rpx solid #E0C9D1; /* Secondary color */
		position: relative;
		background-image: url('/static/decoration/paper-subtle.png');
		background-repeat: repeat;
	}
	
	.post-item::after {
		content: "";
		position: absolute;
		right: 20rpx;
		bottom: 20rpx;
		width: 60rpx;
		height: 60rpx;
		background-image: url('/static/decoration/corner-decoration.png');
		background-size: contain;
		background-repeat: no-repeat;
		opacity: 0.15;
	}
	
	.post-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 16rpx;
	}
	
	.post-user {
		display: flex;
		align-items: center;
	}
	
	.post-avatar {
		width: 60rpx;
		height: 60rpx;
		border-radius: 30rpx;
		margin-right: 12rpx;
		border: 2rpx solid rgba(126, 196, 207, 0.3);
	}
	
	.post-username {
		font-size: 28rpx;
		color: #333;
		font-weight: bold;
		font-family: "KaiTi", "FangSong";
	}
	
	.post-time {
		font-size: 24rpx;
		color: #999;
	}
	
	.post-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 12rpx;
		line-height: 1.4;
		font-family: "FangSong", serif;
	}
	
	.post-content {
		font-size: 28rpx;
		color: #666;
		line-height: 1.6;
		margin-bottom: 16rpx;
		font-family: "SimSun", serif;
	}
	
	.post-images {
		display: flex;
		flex-wrap: wrap;
		gap: 10rpx;
		margin-bottom: 16rpx;
	}
	
	.post-image {
		width: 220rpx;
		height: 220rpx;
		border-radius: 10rpx;
		border: 2rpx solid rgba(224, 201, 209, 0.3);
	}
	
	.post-footer {
		display: flex;
		justify-content: flex-end;
		gap: 30rpx;
	}
	
	.post-action {
		display: flex;
		align-items: center;
		gap: 6rpx;
		color: #999;
		font-size: 24rpx;
	}
	
	/* Shop styling */
	.shop-scroll {
		white-space: nowrap;
		margin: 0 -30rpx;
		padding: 0 30rpx;
	}
	
	.shop-item {
		display: inline-block;
		width: 240rpx;
		margin-right: 20rpx;
		background-color: #FFF;
		border-radius: 16rpx;
		overflow: hidden;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
		border: 1rpx solid rgba(224, 201, 209, 0.3);
	}
	
	.shop-image {
		width: 240rpx;
		height: 180rpx;
	}
	
	.shop-name {
		display: block;
		font-size: 28rpx;
		color: #333;
		font-weight: bold;
		margin: 10rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-family: "KaiTi", "FangSong";
	}
	
	.shop-rating {
		display: flex;
		align-items: center;
		gap: 6rpx;
		margin: 0 10rpx 10rpx 10rpx;
		font-size: 24rpx;
		color: #666;
	}
	
	/* Rice paper background texture */
	.post-section, .shop-section {
		/* Temporarily removing the background image until assets are available */
		/* background-image: url('../../static/textures/rice-paper.png'); */
		background-color: rgba(255, 255, 255, 0.9);
		border: 1px solid rgba(126, 196, 207, 0.2); /* Light border with main color */
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
		font-family: "SimSun", serif;
	}
	
	.icon-arrow {
		width: 28rpx;
		height: 28rpx;
		margin-left: 6rpx;
	}
	
	.icon-action {
		width: 28rpx;
		height: 28rpx;
		margin-right: 4rpx;
	}
	
	.icon-star {
		width: 24rpx;
		height: 24rpx;
		margin-right: 4rpx;
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
