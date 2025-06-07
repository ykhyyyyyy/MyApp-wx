<template>
	<view class="container">
		<!-- 使用自定义导航栏组件 -->
		<custom-nav-bar title="探店寻宝" subtitle="美食与商店探索" :show-back="true"></custom-nav-bar>
		
		<!-- 添加明显的返回按钮 -->
		<view class="back-button" @click="goBack">
			<text class="back-arrow">←</text>
			<text class="back-text">返回</text>
		</view>
		
		<view class="header">
			<view class="search-box">
				<view class="search-input-wrapper">
					<image src="https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg" class="search-icon"></image>
					<input class="search-input" type="text" placeholder="搜索店铺或美食" v-model="searchText" @confirm="searchShops" />
				</view>
			</view>
		</view>
		
		<!-- 分类标签 -->
		<view class="categories">
			<scroll-view scroll-x class="categories-scroll" show-scrollbar="false">
				<view 
					v-for="(category, index) in categories" 
					:key="index"
					class="category-item" 
					:class="{ active: selectedCategory === category }"
					@click="selectCategory(category)"
				>
					<text>{{category}}</text>
				</view>
			</scroll-view>
		</view>
		
		<!-- 推荐店铺 -->
		<view class="section">
			<view class="section-header">
				<image class="section-title-decoration" src="https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg" mode="aspectFit"></image>
				<text class="section-title">精选推荐</text>
				<image class="section-title-decoration" src="https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg" mode="aspectFit"></image>
			</view>
			
			<view class="featured-shops">
				<scroll-view scroll-x class="featured-scroll" show-scrollbar="false">
					<view class="featured-shop-card" v-for="(shop, index) in featuredShops" :key="index" @click="viewShopDetail(shop.id)">
						<image class="featured-shop-image" :src="shop.image" mode="aspectFill"></image>
						<view class="featured-shop-info">
							<text class="featured-shop-name">{{shop.name}}</text>
							<view class="featured-shop-rating">
								<text class="rating-score">{{shop.rating}}</text>
								<view class="rating-stars">
									<text v-for="n in 5" :key="n" class="star" :class="{ active: n <= Math.floor(shop.rating) }">★</text>
								</view>
							</view>
							<text class="featured-shop-desc">{{shop.description}}</text>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		
		<!-- 探店列表 -->
		<view class="section">
			<view class="section-header">
				<image class="section-title-decoration" src="https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg" mode="aspectFit"></image>
				<text class="section-title">探店评论</text>
				<image class="section-title-decoration" src="https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg" mode="aspectFit"></image>
			</view>
			
			<!-- 显示加载中状态 -->
			<view v-if="loading && reviews.length === 0" class="loading-container">
				<view class="loading-spinner"></view>
				<text class="loading-text">加载中...</text>
			</view>
			
			<!-- 显示无数据状态 -->
			<view v-else-if="reviews.length === 0" class="empty-container">
				<text class="empty-text">暂无探店数据</text>
			</view>
			
			<!-- 探店列表 -->
			<view v-else class="review-list">
				<view class="review-card" v-for="(review, index) in reviews" :key="review.id || index" @click="viewReviewDetail(review.id)">
					<view class="review-header">
						<view class="review-user">
							<image :src="review.userAvatar || 'https://ykhyyy.oss-cn-beijing.aliyuncs.com/MyApp/userAvatar/default-avatar.png'" class="review-avatar"></image>
							<text class="review-username">{{review.username || '匿名用户'}}</text>
						</view>
						<text class="review-time">{{review.createTime ? new Date(review.createTime).toLocaleString() : '未知时间'}}</text>
					</view>
					
					<text class="review-shop-name">{{review.shopName || '未知店铺'}}</text>
					<text class="review-title">{{review.title || '无标题'}}</text>
					<text class="review-content">{{review.content || '无内容'}}</text>
					
					<view class="review-images" v-if="review.images">
						<image 
							v-for="(img, imgIndex) in review.images.split(',')" 
							:key="imgIndex" 
							:src="img" 
							mode="aspectFill" 
							class="review-image"
						></image>
					</view>
					
					<view class="review-rating">
						<text class="rating-score">{{review.rating || 0}}</text>
						<view class="rating-stars">
							<text v-for="n in 5" :key="n" class="star" :class="{ active: n <= Math.floor(review.rating || 0) }">★</text>
						</view>
					</view>
					
					<view class="review-footer">
						<view class="review-action">
							<image src="https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg" class="icon-action"></image>
							<text>{{review.views || 0}} 浏览</text>
						</view>
						<view class="review-action">
							<image src="https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg" class="icon-action"></image>
							<text>{{review.comments || 0}} 评论</text>
						</view>
						<view class="review-action">
							<image src="https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg" class="icon-action"></image>
							<text>{{review.likes || 0}} 点赞</text>
						</view>
					</view>
				</view>
				
				<!-- 加载更多 -->
				<view v-if="hasMore" class="load-more" @click="loadMore">
					<text v-if="!loading">加载更多</text>
					<view v-else class="loading-spinner small"></view>
				</view>
				<view v-else class="no-more">
					<text>没有更多内容了</text>
				</view>
			</view>
		</view>
		
		<!-- AI助手组件 -->
		<ai-assistant></ai-assistant>
	</view>
</template>

<script>
	import AiAssistant from '@/components/AiAssistant.vue';
	import CustomNavBar from '@/components/CustomNavBar.vue';
	import config from '@/config/index.js';
	
	export default {
		components: {
			AiAssistant,
			CustomNavBar
		},
		data() {
			return {
				loading: false,
				currentPage: 1,
				pageSize: 10,
				totalItems: 0,
				reviews: [],
				selectedCategory: '全部',
				categories: ['全部', '美食', '咖啡', '甜品', '文创', '书店'],
				searchText: '',
				// 仅作为初始化的数据，实际会从API加载
				featuredShops: [
					{
						id: '1',
						name: '古韵斋茶艺馆',
						image: 'https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg',
						rating: 4.8,
						description: '传统中国茶文化体验馆，提供正宗茶艺表演和高品质茶叶'
					},
					{
						id: '2',
						name: '墨香书斋',
						image: 'https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg',
						rating: 4.7,
						description: '古色古香的独立书店，提供安静的阅读环境和特色文创产品'
					},
					{
						id: '3',
						name: '竹里馆',
						image: 'https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg',
						rating: 4.6,
						description: '中式素食餐厅，环境雅致，菜品精美，适合小聚'
					}
				],
				shops: [] // 这会被API数据替换
			}
		},
		computed: {
			hasMore() {
				return this.reviews.length < this.totalItems;
			}
		},
		onLoad() {
			// 页面加载时获取数据
			this.loadShopReviews();
		},
		methods: {
			// 加载探店评论数据
			loadShopReviews(refresh = true) {
				if (refresh) {
					this.currentPage = 1;
					this.reviews = [];
				}
				
				this.loading = true;
				
				// 构建查询参数
				const params = {
					current: this.currentPage,
					size: this.pageSize
				};
				
				// 如果选择了特定分类且不是"全部"，添加筛选条件
				if (this.selectedCategory !== '全部') {
					params.category = this.selectedCategory;
				}
				
				// 发起API请求
				uni.request({
					url: `${config.BaseUrl}/api/shop/review/page`,
					method: 'GET',
					data: params,
					header: {
						'content-type': 'application/json'
					},
					success: (res) => {
						console.log('获取探店数据成功:', res.data);
						if (res.data && res.data.code === 1) {
							const data = res.data.data;
							// 合并数据
							if (refresh) {
								this.reviews = data.records || [];
							} else {
								this.reviews = [...this.reviews, ...(data.records || [])];
							}
							this.totalItems = data.total;
							this.currentPage = data.current;
						} else {
							uni.showToast({
								title: '获取数据失败',
								icon: 'none'
							});
						}
					},
					fail: (err) => {
						console.error('请求失败:', err);
						uni.showToast({
							title: '网络请求失败',
							icon: 'none'
						});
					},
					complete: () => {
						this.loading = false;
						// 停止下拉刷新状态
						uni.stopPullDownRefresh();
					}
				});
			},
			
			// 加载更多数据
			loadMore() {
				if (!this.loading && this.hasMore) {
					this.currentPage++;
					this.loadShopReviews(false);
				}
			},
			
			// 搜索店铺
			searchShops() {
				// 使用搜索文本重新加载数据
				this.loadShopReviews();
			},
			
			// 切换分类
			selectCategory(category) {
				this.selectedCategory = category;
				// 切换分类后重新加载数据
				this.loadShopReviews();
			},
			
			// 查看探店详情
			viewShopDetail(id) {
				uni.navigateTo({
					url: `/pages/shops/detail/index?id=${id}`
				});
			},
			
			// 查看探店评论详情
			viewReviewDetail(id) {
				uni.navigateTo({
					url: `/pages/explore/detail/index?id=${id}`
				});
			},
			
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
			},
			
			// 下拉刷新
			onPullDownRefresh() {
				this.loadShopReviews();
			},
			
			// 上拉加载更多
			onReachBottom() {
				this.loadMore();
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
		padding: 30rpx;
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
	
	.section {
		margin: 0 30rpx 30rpx;
		background-color: #fff;
		border-radius: 15rpx;
		padding: 30rpx;
		box-shadow: 0 4rpx 8rpx rgba(0,0,0,0.05);
		border: 1rpx solid #e0c9d1;
	}
	
	.section-header {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 20rpx;
		padding-bottom: 20rpx;
		border-bottom: 1rpx solid #f0f0f0;
	}
	
	.section-title-decoration {
		width: 24rpx;
		height: 24rpx;
		margin: 0 10rpx;
	}
	
	.section-title {
		font-family: "FangSong", serif;
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
	}
	
	.featured-shops {
		margin: 0 -30rpx;
	}
	
	.featured-scroll {
		padding: 0 30rpx;
	}
	
	.featured-shop-card {
		display: inline-block;
		width: 500rpx;
		margin-right: 20rpx;
		background-color: #fff;
		border-radius: 15rpx;
		overflow: hidden;
		box-shadow: 0 4rpx 8rpx rgba(0,0,0,0.1);
		border: 1rpx solid #e0c9d1;
	}
	
	.featured-shop-image {
		width: 100%;
		height: 280rpx;
	}
	
	.featured-shop-info {
		padding: 20rpx;
	}
	
	.featured-shop-name {
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 10rpx;
		font-family: "FangSong", serif;
	}
	
	.featured-shop-rating {
		display: flex;
		align-items: center;
		margin-bottom: 10rpx;
	}
	
	.featured-shop-desc {
		font-size: 24rpx;
		color: #666;
		line-height: 1.5;
	}
	
	/* 探店列表样式 */
	.review-list {
		margin-top: 20rpx;
	}
	
	.review-card {
		background-color: #fff;
		border-radius: 10rpx;
		padding: 20rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 6rpx rgba(0,0,0,0.05);
		border: 1rpx solid #f0f0f0;
	}
	
	.review-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 15rpx;
	}
	
	.review-user {
		display: flex;
		align-items: center;
	}
	
	.review-avatar {
		width: 60rpx;
		height: 60rpx;
		border-radius: 30rpx;
		margin-right: 10rpx;
	}
	
	.review-username {
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
	}
	
	.review-time {
		font-size: 24rpx;
		color: #999;
	}
	
	.review-shop-name {
		font-size: 28rpx;
		color: #7EC4CF;
		margin-bottom: 10rpx;
		display: block;
	}
	
	.review-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 10rpx;
		display: block;
	}
	
	.review-content {
		font-size: 28rpx;
		color: #666;
		line-height: 1.6;
		margin-bottom: 15rpx;
		display: block;
	}
	
	.review-images {
		display: flex;
		flex-wrap: wrap;
		gap: 10rpx;
		margin-bottom: 15rpx;
	}
	
	.review-image {
		width: 200rpx;
		height: 200rpx;
		border-radius: 8rpx;
	}
	
	.review-rating {
		display: flex;
		align-items: center;
		margin-bottom: 15rpx;
	}
	
	.review-footer {
		display: flex;
		justify-content: space-between;
		border-top: 1rpx solid #f0f0f0;
		padding-top: 15rpx;
	}
	
	.review-action {
		display: flex;
		align-items: center;
	}
	
	.icon-action {
		width: 28rpx;
		height: 28rpx;
		margin-right: 6rpx;
	}
	
	/* 加载状态 */
	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 40rpx 0;
	}
	
	.loading-spinner {
		width: 60rpx;
		height: 60rpx;
		border: 6rpx solid #f3f3f3;
		border-top: 6rpx solid #7EC4CF;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-bottom: 20rpx;
	}
	
	.loading-spinner.small {
		width: 40rpx;
		height: 40rpx;
		border-width: 4rpx;
	}
	
	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}
	
	.loading-text {
		font-size: 28rpx;
		color: #999;
	}
	
	.empty-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 60rpx 0;
	}
	
	.empty-text {
		font-size: 28rpx;
		color: #999;
	}
	
	.load-more, .no-more {
		text-align: center;
		padding: 20rpx 0;
		font-size: 26rpx;
		color: #999;
	}
	
	.shop-list {
		margin-top: 20rpx;
	}
	
	.shop-card {
		display: flex;
		margin-bottom: 20rpx;
		background-color: #fff;
		border-radius: 10rpx;
		overflow: hidden;
		box-shadow: 0 2rpx 6rpx rgba(0,0,0,0.05);
		border: 1rpx solid #f0f0f0;
	}
	
	.shop-image {
		width: 200rpx;
		height: 200rpx;
	}
	
	.shop-info {
		flex: 1;
		padding: 15rpx;
	}
	
	.shop-header-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10rpx;
	}
	
	.shop-name {
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
		font-family: "FangSong", serif;
	}
	
	.shop-badges {
		display: flex;
	}
	
	.shop-badge {
		font-size: 20rpx;
		padding: 2rpx 8rpx;
		border-radius: 4rpx;
		margin-left: 10rpx;
	}
	
	.shop-badge.official {
		background-color: rgba(126, 196, 207, 0.1);
		color: #7EC4CF;
		border: 1rpx solid #7EC4CF;
	}
	
	.shop-badge.new {
		background-color: rgba(138, 51, 36, 0.1);
		color: #8A3324;
		border: 1rpx solid #8A3324;
	}
	
	.shop-rating-row {
		display: flex;
		align-items: center;
		margin-bottom: 10rpx;
	}
	
	.rating-score {
		font-size: 26rpx;
		color: #FF9500;
		font-weight: bold;
		margin-right: 8rpx;
	}
	
	.rating-stars {
		display: flex;
		margin-right: 8rpx;
	}
	
	.star {
		color: #DDDDDD;
		font-size: 24rpx;
	}
	
	.star.active {
		color: #FF9500;
	}
	
	.rating-count {
		font-size: 22rpx;
		color: #999;
	}
	
	.shop-tags {
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 10rpx;
	}
	
	.shop-tag {
		font-size: 22rpx;
		color: #666;
		background-color: #f8f8f8;
		padding: 4rpx 12rpx;
		border-radius: 4rpx;
		margin-right: 10rpx;
		margin-bottom: 6rpx;
	}
	
	.shop-location {
		display: flex;
		align-items: center;
		font-size: 22rpx;
		color: #999;
	}
	
	.location-icon {
		width: 24rpx;
		height: 24rpx;
		margin-right: 6rpx;
	}
	
	.distance {
		margin-left: auto;
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