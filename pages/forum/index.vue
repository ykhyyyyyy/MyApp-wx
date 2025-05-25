<template>
	<view class="container page-content-with-tabbar">
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
				<view class="category-item" 
					v-for="(item, index) in categories" 
					:key="index" 
					:class="{ active: currentCategory === index }"
					@tap="selectCategory(index)"
				>
					<text>{{item.name}}</text>
				</view>
			</scroll-view>
		</view>
		
		<!-- 发帖按钮 -->
		<view class="floating-button" @tap="goToCreatePost">
			<image src="/static/icons/write.png" mode="aspectFit" class="floating-button-icon"></image>
		</view>
		
		<!-- 帖子列表 -->
		<view class="forum-content">
			<view class="post-list">
				<view class="post-item" v-for="(post, index) in postList" :key="index" @tap="viewPostDetail(post.id)">
					<!-- 装饰元素 -->
					<view class="post-decoration"></view>
					
					<view class="post-header">
						<view class="post-user">
							<image :src="post.avatar" class="post-avatar"></image>
							<view class="user-info">
								<text class="post-username">{{post.username}}</text>
								<view class="user-badge" v-if="post.badge">{{post.badge}}</view>
							</view>
						</view>
						<text class="post-time">{{post.time}}</text>
					</view>
					
					<text class="post-title">{{post.title}}</text>
					<text class="post-content">{{post.content}}</text>
					
					<view class="post-images" v-if="post.images && post.images.length">
						<image 
							v-for="(img, imgIndex) in post.images.slice(0,3)" 
							:key="imgIndex" 
							:src="img" 
							mode="aspectFill" 
							class="post-image"
						></image>
						<view class="image-count" v-if="post.images.length > 3">+{{post.images.length - 3}}</view>
					</view>
					
					<view class="post-category" v-if="post.category">
						<text class="category-tag">#{{post.category}}</text>
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
			
			<!-- 加载更多 -->
			<view class="load-more">
				<view class="load-more-content">
					<image src="/static/decoration/loading.png" class="loading-icon" :class="{ rotating: loading }"></image>
					<text class="loading-text">{{ loading ? '加载中...' : '下拉加载更多' }}</text>
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
		<tab-bar :current="2"></tab-bar>
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
				currentCategory: 0,
				loading: false,
				categories: [
					{ name: '全部', id: 'all' },
					{ name: '热门', id: 'hot' },
					{ name: '美食', id: 'food' },
					{ name: '学习', id: 'study' },
					{ name: '活动', id: 'event' },
					{ name: '交友', id: 'social' },
					{ name: '二手', id: 'secondhand' }
				],
				postList: [
					{
						id: 1,
						username: '陈同学',
						avatar: '/static/images/avatars/user1.png',
						badge: '学霸',
						time: '10分钟前',
						title: '图书馆自习的最佳位置推荐',
						content: '经过一个学期的探索，我发现了图书馆里几个最适合自习的位置，采光好、安静、有插座，分享给大家...',
						category: '学习',
						views: 253,
						comments: 12,
						likes: 45,
						images: [
							'/static/images/posts/library1.png',
							'/static/images/posts/library2.png'
						]
					},
					{
						id: 2,
						username: '李同学',
						avatar: '/static/images/avatars/user2.png',
						badge: '美食达人',
						time: '1小时前',
						title: '校门口新开的川菜馆试吃报告',
						content: '昨天和朋友一起去校门口新开的川菜馆试吃，点了水煮鱼、麻婆豆腐和宫保鸡丁，性价比很高，味道正宗！推荐大家去尝尝...',
						category: '美食',
						views: 568,
						comments: 32,
						likes: 97,
						images: [
							'/static/images/posts/food1.png',
							'/static/images/posts/food2.png',
							'/static/images/posts/food3.png',
							'/static/images/posts/food4.png'
						]
					},
					{
						id: 3,
						username: '王同学',
						avatar: '/static/images/avatars/user3.png',
						time: '2小时前',
						title: '周末有人一起组队参加校园马拉松吗？',
						content: '下周六有校园马拉松活动，有没有同学一起组队参加？我已经报名了，希望找几个志同道合的伙伴一起训练一下...',
						category: '活动',
						views: 321,
						comments: 28,
						likes: 54,
						images: []
					}
				]
			}
		},
		methods: {
			selectCategory(index) {
				this.currentCategory = index;
				// 这里可以根据分类加载不同的帖子
				// TODO: 加载对应分类的帖子
				uni.showToast({
					title: '切换到' + this.categories[index].name,
					icon: 'none'
				});
			},
			viewPostDetail(id) {
				uni.navigateTo({
					url: `/pages/forum/detail?id=${id}`
				});
			},
			goToCreatePost() {
				uni.navigateTo({
					url: '/pages/forum/create'
				});
			},
			loadMorePosts() {
				// 加载更多帖子的逻辑
				this.loading = true;
				setTimeout(() => {
					// 模拟加载数据
					this.loading = false;
					// 此处可以添加更多的帖子数据
				}, 1500);
			},
			onPullDownRefresh() {
				// 下拉刷新
				setTimeout(() => {
					uni.stopPullDownRefresh();
				}, 1500);
			},
			onReachBottom() {
				// 上拉加载更多
				this.loadMorePosts();
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
	
	.header {
		padding: 20rpx 30rpx;
	}
	
	.search-input-wrapper {
		display: flex;
		align-items: center;
		background: #fff;
		border-radius: 30rpx;
		padding: 0 20rpx;
		border: 1rpx solid var(--light-cream);
		box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05);
		background-image: url('/static/decoration/paper-subtle.png');
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
	
	/* 分类样式 */
	.categories {
		padding: 0 30rpx;
		margin-bottom: 20rpx;
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
		color: var(--accent-gold);
		border: 1rpx solid var(--light-cream);
		position: relative;
		overflow: hidden;
		box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
	}
	
	.category-item.active {
		background-color: var(--primary-red);
		color: #fff;
		border-color: var(--primary-red);
	}
	
	/* 帖子列表样式 */
	.forum-content {
		padding: 20rpx 30rpx;
	}
	
	.post-list {
		display: flex;
		flex-direction: column;
		gap: 30rpx;
	}
	
	.post-item {
		background-color: #fff;
		border-radius: 16rpx;
		padding: 20rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
		position: relative;
		border-left: 6rpx solid var(--light-cream);
		overflow: hidden;
		background-image: url('/static/decoration/paper-subtle.png');
	}
	
	.post-decoration {
		position: absolute;
		top: 0;
		right: 0;
		width: 60rpx;
		height: 60rpx;
		background-image: url('/static/decoration/corner-decoration.png');
		background-size: contain;
		background-repeat: no-repeat;
		opacity: 0.1;
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
		border: 2rpx solid rgba(140, 120, 83, 0.3);
	}
	
	.user-info {
		display: flex;
		flex-direction: column;
	}
	
	.post-username {
		font-size: 28rpx;
		color: var(--text-brown);
		font-weight: bold;
		font-family: "KaiTi", "FangSong";
	}
	
	.user-badge {
		font-size: 20rpx;
		color: #fff;
		background-color: var(--accent-gold);
		padding: 4rpx 8rpx;
		border-radius: 6rpx;
		margin-top: 4rpx;
		max-width: fit-content;
	}
	
	.post-time {
		font-size: 24rpx;
		color: #999;
	}
	
	.post-title {
		font-size: 32rpx;
		font-weight: bold;
		color: var(--text-brown);
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
		gap: 10rpx;
		margin-bottom: 16rpx;
		position: relative;
	}
	
	.post-image {
		width: 200rpx;
		height: 200rpx;
		border-radius: 8rpx;
		border: 1rpx solid rgba(224, 201, 209, 0.5);
	}
	
	.image-count {
		position: absolute;
		right: 10rpx;
		bottom: 10rpx;
		background-color: rgba(0, 0, 0, 0.5);
		color: #fff;
		font-size: 24rpx;
		padding: 4rpx 10rpx;
		border-radius: 20rpx;
	}
	
	.post-category {
		margin-bottom: 16rpx;
	}
	
	.category-tag {
		font-size: 24rpx;
		color: var(--primary-red);
		background-color: rgba(138, 51, 36, 0.1);
		padding: 4rpx 16rpx;
		border-radius: 20rpx;
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
	
	.icon-action {
		width: 28rpx;
		height: 28rpx;
		margin-right: 4rpx;
	}
	
	/* 加载更多 */
	.load-more {
		padding: 30rpx 0;
		text-align: center;
	}
	
	.load-more-content {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.loading-icon {
		width: 40rpx;
		height: 40rpx;
		margin-right: 10rpx;
	}
	
	.loading-text {
		font-size: 28rpx;
		color: #999;
	}
	
	.rotating {
		animation: rotate 1.5s infinite linear;
	}
	
	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
	
	/* 悬浮发帖按钮 */
	.floating-button {
		position: fixed;
		right: 40rpx;
		bottom: 160rpx;
		width: 100rpx;
		height: 100rpx;
		background-color: var(--primary-red);
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		box-shadow: 0 4rpx 16rpx rgba(138, 51, 36, 0.4);
		z-index: 10;
		border: 4rpx solid rgba(255, 255, 255, 0.6);
	}
	
	.floating-button-icon {
		width: 50rpx;
		height: 50rpx;
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