<template>
	<view class="container">
		<!-- 使用自定义导航栏组件 -->
		<custom-nav-bar title="墨香书院" subtitle="校园论坛" :show-back="true"></custom-nav-bar>
		
		<!-- 添加明显的返回按钮 -->
		<view class="back-button" @click="goBack">
			<text class="back-arrow">←</text>
			<text class="back-text">返回</text>
		</view>
		
		<view class="header">
			<view class="search-box">
				<view class="search-input-wrapper">
					<image src="https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg" class="search-icon"></image>
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
		
		<!-- 置顶帖子 -->
		<view class="pinned-posts">
			<view class="section-title">
				<image class="pin-icon" src="https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg"></image>
				<text>置顶内容</text>
			</view>
			
			<view class="post-card pinned" v-for="(post, index) in pinnedPosts" :key="'pinned-'+index">
				<view class="post-header">
					<image class="user-avatar" :src="post.avatar" mode="aspectFill"></image>
					<view class="post-info">
						<text class="post-author">{{post.author}}</text>
						<text class="post-time">{{post.time}}</text>
					</view>
					<view class="post-badge official">官方</view>
				</view>
				<view class="post-content">
					<text class="post-title">{{post.title}}</text>
					<text class="post-summary">{{post.summary}}</text>
				</view>
				<view class="post-footer">
					<view class="post-stats">
						<text class="stat-item">{{post.views}} 浏览</text>
						<text class="stat-item">{{post.comments}} 评论</text>
						<text class="stat-item">{{post.likes}} 点赞</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 普通帖子列表 -->
		<view class="posts-list">
			<view class="section-title">
				<text>最新帖子</text>
			</view>
			
			<view class="post-card" v-for="(post, index) in posts" :key="index">
				<view class="post-header">
					<image class="user-avatar" :src="post.avatar" mode="aspectFill"></image>
					<view class="post-info">
						<text class="post-author">{{post.author}}</text>
						<text class="post-time">{{post.time}}</text>
					</view>
					<view class="post-badge" v-if="post.badge">{{post.badge}}</view>
				</view>
				<view class="post-content">
					<text class="post-title">{{post.title}}</text>
					<text class="post-summary">{{post.summary}}</text>
					<view class="post-images" v-if="post.images && post.images.length">
						<image v-for="(img, imgIndex) in post.images" :key="imgIndex" :src="img" mode="aspectFill" class="post-image"></image>
					</view>
				</view>
				<view class="post-footer">
					<view class="post-stats">
						<text class="stat-item">{{post.views}} 浏览</text>
						<text class="stat-item">{{post.comments}} 评论</text>
						<text class="stat-item">{{post.likes}} 点赞</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 发帖按钮 -->
		<view class="floating-button">
			<image src="https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg" class="add-icon"></image>
		</view>
		
		<!-- AI助手组件 -->
		<ai-assistant></ai-assistant>
	</view>
</template>

<script>
	import AiAssistant from '@/components/AiAssistant.vue';
	import CustomNavBar from '@/components/CustomNavBar.vue';
	
	export default {
		components: {
			AiAssistant,
			CustomNavBar
		},
		data() {
			return {
				pinnedPosts: [
					{
						id: '1',
						author: '校园管理员',
						avatar: 'https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg',
						title: '【重要通知】关于校园APP使用指南',
						summary: '为了帮助同学们更好地使用校园APP，现发布使用指南，请大家仔细阅读并遵守相关规定。',
						time: '2023-10-15',
						views: 1256,
						comments: 45,
						likes: 320
					}
				],
				posts: [
					{
						id: '2',
						author: '文学爱好者',
						avatar: 'https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg',
						title: '推荐几本值得一读的中国古典文学作品',
						summary: '最近在读《红楼梦》，感触良多，想和大家分享一些经典中国文学作品的阅读体验和心得...',
						time: '2023-10-14',
						views: 328,
						comments: 23,
						likes: 89,
						badge: '文学'
					},
					{
						id: '3',
						author: '美食达人',
						avatar: 'https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg',
						title: '校园周边美食探店报告',
						summary: '今天去了学校南门新开的那家川菜馆，环境不错，价格实惠，最重要的是味道很正宗！',
						time: '2023-10-13',
						views: 456,
						comments: 32,
						likes: 105,
						badge: '美食',
						images: [
							'https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg',
							'https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg',
							'https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg'
						]
					},
					{
						id: '4',
						author: '学习委员',
						avatar: 'https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg',
						title: '期中复习资料分享',
						summary: '整理了一些期中考试可能用到的复习资料，希望对大家有所帮助，有问题可以在评论区讨论...',
						time: '2023-10-12',
						views: 892,
						comments: 56,
						likes: 234,
						badge: '学习'
					},
					{
						id: '5',
						author: '社团联合会',
						avatar: 'https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg',
						title: '本周末校园文化节活动预告',
						summary: '本周末将在大礼堂举办校园文化节，有舞台表演、美食摊位、手工艺品展示等多种活动，欢迎大家参加！',
						time: '2023-10-11',
						views: 675,
						comments: 28,
						likes: 143,
						badge: '活动',
						images: [
							'https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg'
						]
					}
				]
			}
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
	
	.pinned-posts, .posts-list {
		margin: 0 30rpx 30rpx;
	}
	
	.section-title {
		display: flex;
		align-items: center;
		padding: 20rpx 0;
		margin-bottom: 15rpx;
		font-size: 30rpx;
		color: #333;
		font-weight: bold;
		font-family: "FangSong", serif;
	}
	
	.pin-icon {
		width: 32rpx;
		height: 32rpx;
		margin-right: 10rpx;
	}
	
	.post-card {
		background-color: #fff;
		border-radius: 15rpx;
		padding: 20rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 6rpx rgba(0,0,0,0.05);
		border: 1rpx solid #e0e0e0;
	}
	
	.post-card.pinned {
		border-left: 6rpx solid #8A3324;
	}
	
	.post-header {
		display: flex;
		align-items: center;
		margin-bottom: 15rpx;
	}
	
	.user-avatar {
		width: 70rpx;
		height: 70rpx;
		border-radius: 35rpx;
		margin-right: 15rpx;
	}
	
	.post-info {
		flex: 1;
	}
	
	.post-author {
		font-size: 28rpx;
		color: #333;
		font-weight: bold;
	}
	
	.post-time {
		font-size: 22rpx;
		color: #999;
		margin-top: 4rpx;
	}
	
	.post-badge {
		padding: 4rpx 12rpx;
		background-color: #f0f0f0;
		border-radius: 6rpx;
		font-size: 22rpx;
		color: #666;
	}
	
	.post-badge.official {
		background-color: rgba(138, 51, 36, 0.1);
		color: #8A3324;
	}
	
	.post-content {
		margin-bottom: 15rpx;
	}
	
	.post-title {
		font-size: 30rpx;
		color: #333;
		font-weight: bold;
		margin-bottom: 10rpx;
		font-family: "FangSong", serif;
	}
	
	.post-summary {
		font-size: 26rpx;
		color: #666;
		line-height: 1.5;
		margin-bottom: 15rpx;
	}
	
	.post-images {
		display: flex;
		margin: 0 -5rpx;
	}
	
	.post-image {
		flex: 1;
		height: 180rpx;
		margin: 0 5rpx;
		border-radius: 8rpx;
	}
	
	.post-footer {
		border-top: 1rpx solid #f0f0f0;
		padding-top: 15rpx;
	}
	
	.post-stats {
		display: flex;
	}
	
	.stat-item {
		font-size: 24rpx;
		color: #999;
		margin-right: 20rpx;
	}
	
	.floating-button {
		position: fixed;
		right: 30rpx;
		bottom: 100rpx;
		width: 100rpx;
		height: 100rpx;
		background-color: #7EC4CF;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4rpx 10rpx rgba(0,0,0,0.2);
		z-index: 10;
	}
	
	.add-icon {
		width: 50rpx;
		height: 50rpx;
	}
	
	.back-button {
		position: fixed;
		top: calc(var(--status-bar-height) + 50rpx);
		left: 30rpx;
		z-index: 1000;
		display: flex;
		align-items: center;
		background-color: rgba(255, 255, 255, 0.8);
		padding: 10rpx 20rpx;
		border-radius: 30rpx;
		box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
		border: 1rpx solid #e0c9d1;
	}
	
	.back-arrow {
		font-size: 40rpx;
		color: #8A3324;
		font-weight: bold;
		margin-right: 10rpx;
	}
	
	.back-text {
		font-size: 28rpx;
		color: #333;
		font-family: "FangSong", serif;
	}
</style> 