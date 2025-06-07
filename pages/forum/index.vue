<template>
	<view class="container">
		<!-- 使用自定义导航栏组件 -->
		<custom-nav-bar title="论坛" subtitle="Community" :show-back="false" :show-seal="true"></custom-nav-bar>
		
		<!-- 搜索栏 -->
		<view class="search-section">
			<view class="search-input-wrapper">
				<text class="iconfont icon-search search-icon"></text>
				<input type="text" v-model="searchText" class="search-input" placeholder="搜索帖子..." @confirm="handleSearch" />
			</view>
			<button class="publish-btn" @click="goToCreate">发帖</button>
		</view>
		
		<!-- 分类选择 -->
		<scroll-view scroll-x class="categories-scroll">
			<view class="category-item" :class="{ active: !activeCategory }" @click="selectCategory('')">全部</view>
			<view class="category-item" 
				v-for="(category, index) in categories" 
				:key="index"
				:class="{ active: activeCategory === category }"
				@click="selectCategory(category)">
				{{ category }}
			</view>
		</scroll-view>
		
		<!-- 热门帖子区域 -->
		<view class="hot-section">
			<view class="section-header">
				<text class="section-title">热门推荐</text>
				<text class="section-more">查看更多</text>
			</view>
			<scroll-view scroll-x class="hot-list">
				<view class="hot-item" v-for="hot in hotPosts" :key="hot.id" @click="hot && hot.id ? goToDetail(hot.id) : null">
					<view class="hot-banner"></view>
					<view class="hot-content">
						<text class="hot-item-title">{{hot.title}}</text>
						<text class="hot-desc" v-if="hot.content">{{hot.content.substring(0, 30)}}{{hot.content.length > 30 ? '...' : ''}}</text>
						<view class="hot-meta">
							<text class="hot-user">{{hot.username || '匿名用户'}}</text>
							<text class="hot-views">{{hot.views || 0}}浏览</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		
		<!-- 帖子列表 -->
		<view class="post-section">
			<view class="section-header">
				<text class="section-title">最新帖子</text>
				<view class="sort-actions">
					<text class="sort-item" :class="{ active: !orderByHot }" @click="toggleSort(false)">最新</text>
					<text class="sort-divider">|</text>
					<text class="sort-item" :class="{ active: orderByHot }" @click="toggleSort(true)">最热</text>
				</view>
			</view>
			
			<scroll-view scroll-y class="post-list" @scrolltolower="loadMore" refresher-enabled @refresherrefresh="onRefresh" :refresher-triggered="refreshing">
				<view v-if="isLoading && posts.length===0" class="loading">
					<uni-load-more status="loading" content-text="加载中..."></uni-load-more>
				</view>
				<view v-else-if="posts.length===0" class="empty">
					<image src="/static/images/empty-posts.png" mode="aspectFit" class="empty-image"></image>
					<text class="empty-text">暂无帖子</text>
				</view>
				<view v-else>
					<view class="post-item" v-for="post in posts" :key="post.id" @click="post && post.id ? goToDetail(post.id) : null">
						<view class="post-header">
							<text class="post-title">{{post.title}}</text>
							<text v-if="post.category" class="post-tag">{{post.category}}</text>
						</view>
						<text class="post-content">{{post.content}}</text>
						<view class="post-footer">
							<view class="post-author">
								<image class="author-avatar" :src="post.avatar || '/static/images/default-avatar.png'" mode="aspectFill"></image>
								<text class="author-name">{{post.username || '匿名用户'}}</text>
							</view>
							<view class="post-stats">
								<view class="stat-item">
									<text class="iconfont icon-message"></text>
									<text>{{post.comments || 0}}</text>
								</view>
								<view class="stat-item">
									<text class="iconfont icon-view"></text>
									<text>{{post.views || 0}}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<uni-load-more v-if="isLoading && posts.length>0" status="loading" content-text="加载中..."></uni-load-more>
				<uni-load-more v-if="!hasMore && posts.length>0" status="noMore" content-text="没有更多了"></uni-load-more>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import { mapState, mapActions } from 'vuex';
	import CustomNavBar from '@/components/CustomNavBar.vue';
	
	export default {
		components: {
			CustomNavBar
		},
		data() {
			return {
				page: 1,
				size: 10,
				hasMore: true,
				searchText: '',
				activeCategory: '',
				orderByHot: false,
				refreshing: false,
				categories: ['校园生活', '学习交流', '兴趣爱好', '求助互助', '闲聊灌水']
			}
		},
		computed: {
			...mapState('post', ['postList', 'hotPosts', 'isLoading', 'pagination']),
			posts() {
				return this.postList;
			}
		},
		methods: {
			...mapActions('post', ['getHotPosts', 'getPostPage', 'searchPosts']),
			async loadPosts(reset = false) {
				if (reset) {
					this.page = 1;
					this.hasMore = true;
				}
				
				if (!this.hasMore) return;
				
				// 如果有搜索条件或分类，则使用搜索API
				if (this.searchText || this.activeCategory) {
					await this.searchPosts({
						text: this.searchText,
						category: this.activeCategory,
						page: this.page,
						pageSize: this.size,
						orderByHot: this.orderByHot
					});
				} else {
					// 否则使用普通分页API
					await this.getPostPage({ 
						current: this.page, 
						size: this.size 
					});
				}
				
				if (this.pagination && this.pagination.total <= this.posts.length) {
					this.hasMore = false;
				} else {
					this.page++;
				}
			},
			loadMore() {
				this.loadPosts();
			},
			goToDetail(id) {
				if (!id) {
					console.error('Cannot navigate to post detail: Missing post ID');
					uni.showToast({
						title: '帖子ID无效',
						icon: 'none'
					});
					return;
				}
				uni.navigateTo({ url: `/pages/forum/detail/index?id=${id}` });
			},
			goToCreate() {
				uni.navigateTo({ url: '/pages/forum/create' });
			},
			async handleSearch() {
				await this.loadPosts(true);
			},
			async selectCategory(category) {
				this.activeCategory = category;
				await this.loadPosts(true);
			},
			async toggleSort(isHot) {
				this.orderByHot = isHot;
				await this.loadPosts(true);
			},
			async onRefresh() {
				this.refreshing = true;
				await this.loadPosts(true);
				this.refreshing = false;
				uni.stopPullDownRefresh();
			}
		},
		onLoad() {
			this.getHotPosts();
			this.loadPosts(true);
		},
		onPullDownRefresh() {
			this.loadPosts(true).then(() => uni.stopPullDownRefresh());
		}
	}
</script>

<style>
	.container {
		background-color: #F8F7F2;
		min-height: 100vh;
	}
	
	/* 搜索区域 */
	.search-section {
		padding: 20rpx 30rpx;
		display: flex;
		align-items: center;
	}
	
	.search-input-wrapper {
		flex: 1;
		display: flex;
		align-items: center;
		background: #fff;
		border-radius: 30rpx;
		padding: 0 20rpx;
		border: 1rpx solid #D7C9AA;
		margin-right: 20rpx;
	}
	
	.search-icon {
		font-size: 32rpx;
		color: #8A6642;
		margin-right: 10rpx;
	}
	
	.search-input {
		flex: 1;
		border: none;
		background: transparent;
		font-size: 28rpx;
		color: #333;
		padding: 12rpx 0;
		outline: none;
	}
	
	/* 分类滚动区 */
	.categories-scroll {
		white-space: nowrap;
		padding: 0 30rpx 20rpx;
	}
	
	.category-item {
		display: inline-block;
		padding: 10rpx 30rpx;
		margin-right: 15rpx;
		background-color: #fff;
		border-radius: 30rpx;
		font-size: 26rpx;
		color: #666;
		border: 1rpx solid #D7C9AA;
	}
	
	.category-item.active {
		background-color: #8A3324;
		color: #fff;
		border-color: #8A3324;
	}
	
	/* 发布按钮 */
	.publish-btn {
		background: #8A3324;
		color: #fff;
		border-radius: 30rpx;
		padding: 0 30rpx;
		height: 70rpx;
		line-height: 70rpx;
		font-size: 28rpx;
		margin: 0;
	}
	
	/* 区块标题样式 */
	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 30rpx 20rpx;
	}
	
	.section-title {
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
		position: relative;
		padding-left: 20rpx;
		font-family: "FangSong", serif;
	}
	
	.section-title::before {
		content: "";
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		width: 8rpx;
		background-color: #8A3324;
		border-radius: 4rpx;
	}
	
	.section-more {
		font-size: 24rpx;
		color: #8A6642;
	}
	
	.sort-actions {
		display: flex;
		align-items: center;
	}
	
	.sort-item {
		font-size: 26rpx;
		color: #999;
		padding: 0 10rpx;
	}
	
	.sort-item.active {
		color: #8A3324;
		font-weight: bold;
	}
	
	.sort-divider {
		color: #ccc;
		font-size: 24rpx;
	}
	
	/* 热门帖子区域 */
	.hot-section {
		padding: 30rpx 0 10rpx;
		background-color: #fff;
		margin-bottom: 20rpx;
		border-radius: 15rpx 15rpx 0 0;
	}
	
	.hot-list {
		white-space: nowrap;
		padding: 0 0 20rpx 30rpx;
	}
	
	.hot-item {
		display: inline-block;
		width: 400rpx;
		background: #fff;
		border-radius: 12rpx;
		margin-right: 20rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
		border: 1rpx solid #F0EAE0;
		overflow: hidden;
	}
	
	.hot-banner {
		height: 160rpx;
		background: linear-gradient(to right, #9E2B25, #8A3324);
	}
	
	.hot-content {
		padding: 20rpx;
	}
	
	.hot-item-title {
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
		display: block;
		white-space: normal;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
	}
	
	.hot-desc {
		font-size: 24rpx;
		color: #666;
		margin: 10rpx 0;
		white-space: normal;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		height: 72rpx;
	}
	
	.hot-meta {
		display: flex;
		justify-content: space-between;
		margin-top: 10rpx;
	}
	
	.hot-user {
		font-size: 22rpx;
		color: #8A6642;
	}
	
	.hot-views {
		font-size: 22rpx;
		color: #999;
	}
	
	/* 帖子列表区域 */
	.post-section {
		padding: 30rpx 0 0;
		flex: 1;
		display: flex;
		flex-direction: column;
	}
	
	.post-list {
		flex: 1;
		height: 65vh;
		padding: 0 30rpx;
	}
	
	.post-item {
		background: #fff;
		margin-bottom: 20rpx;
		border-radius: 12rpx;
		padding: 30rpx;
		box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
		border: 1rpx solid #F0EAE0;
	}
	
	.post-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
	}
	
	.post-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		flex: 1;
		margin-right: 20rpx;
	}
	
	.post-tag {
		font-size: 22rpx;
		color: #8A3324;
		background-color: rgba(138, 51, 36, 0.1);
		padding: 4rpx 12rpx;
		border-radius: 20rpx;
		white-space: nowrap;
	}
	
	.post-content {
		font-size: 28rpx;
		color: #666;
		margin: 16rpx 0;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	
	.post-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 20rpx;
	}
	
	.post-author {
		display: flex;
		align-items: center;
	}
	
	.author-avatar {
		width: 50rpx;
		height: 50rpx;
		border-radius: 25rpx;
		margin-right: 10rpx;
		background-color: #eee;
	}
	
	.author-name {
		font-size: 24rpx;
		color: #8A6642;
	}
	
	.post-stats {
		display: flex;
	}
	
	.stat-item {
		display: flex;
		align-items: center;
		margin-left: 20rpx;
		font-size: 24rpx;
		color: #999;
	}
	
	.stat-item text {
		margin-left: 6rpx;
	}
	
	/* 空状态和加载 */
	.loading,
	.empty {
		text-align: center;
		color: #999;
		padding: 100rpx 0;
	}
	
	.empty-image {
		width: 200rpx;
		height: 200rpx;
		margin-bottom: 20rpx;
	}
	
	.empty-text {
		font-size: 28rpx;
		color: #999;
	}
</style> 