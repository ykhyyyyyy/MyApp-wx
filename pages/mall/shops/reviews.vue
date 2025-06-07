<template>
	<view class="container">
		<!-- 使用自定义导航栏组件 -->
		<custom-nav-bar :title="'探店 - ' + shopName" subtitle="探店评价" :show-back="true"></custom-nav-bar>
		
		<!-- 添加明显的返回按钮 -->
		<view class="back-button" @click="goBack">
			<text class="back-arrow">←</text>
			<text class="back-text">返回</text>
		</view>
		
		<!-- 顶部信息 -->
		<view class="header-info">
			<text class="header-title">{{shopName}}的探店内容</text>
			<text class="header-subtitle">共{{totalItems}}条探店体验</text>
		</view>
		
		<!-- 筛选选项 -->
		<view class="filter-options">
			<view class="filter-item" :class="{ active: sortType === 'latest' }" @click="setSort('latest')">
				<text class="filter-text">最新</text>
			</view>
			<view class="filter-item" :class="{ active: sortType === 'popular' }" @click="setSort('popular')">
				<text class="filter-text">热门</text>
			</view>
			<view class="filter-item" :class="{ active: sortType === 'rating' }" @click="setSort('rating')">
				<text class="filter-text">好评</text>
			</view>
		</view>
		
		<!-- 显示加载中状态 -->
		<view v-if="loading && reviews.length === 0" class="loading-container">
			<view class="loading-spinner"></view>
			<text class="loading-text">加载中...</text>
		</view>
		
		<!-- 显示无数据状态 -->
		<view v-else-if="reviews.length === 0" class="empty-container">
			<text class="empty-text">暂无探店内容</text>
			<button class="add-review-btn" @click="createReview">写探店</button>
		</view>
		
		<!-- 探店列表 -->
		<view v-else class="reviews-list">
			<view class="review-card" v-for="(review, index) in reviews" :key="review.id || index" @click="viewReviewDetail(review.id)">
				<view class="review-header">
					<view class="user-info">
						<image class="user-avatar" :src="review.userAvatar || 'https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg'" mode="aspectFill"></image>
						<view class="user-details">
							<text class="user-name">{{review.userName || '匿名用户'}}</text>
							<view class="review-rating">
								<text v-for="n in 5" :key="n" class="star" :class="{ active: n <= Math.floor(review.rating || 0) }">★</text>
								<text class="rating-text">{{review.rating || 0}}分</text>
							</view>
						</view>
					</view>
					<text class="review-time">{{formatDate(review.createTime)}}</text>
				</view>
				
				<view class="review-content">
					<text class="review-title">{{review.title || '探店体验'}}</text>
					<text class="review-text">{{review.content || '暂无内容'}}</text>
				</view>
				
				<view v-if="review.images && review.images.length > 0" class="review-images">
					<image 
						v-for="(img, imgIndex) in review.images.slice(0, 3)" 
						:key="imgIndex" 
						:src="img" 
						mode="aspectFill" 
						class="review-image" 
						@click.stop="previewImage(review.images, imgIndex)"></image>
					<view v-if="review.images.length > 3" class="image-count">+{{review.images.length - 3}}</view>
				</view>
				
				<view class="review-footer">
					<view class="action-btn" @click.stop="likeReview(review, index)">
						<text class="action-icon" :class="{ active: review.isLiked }">👍</text>
						<text class="action-count">{{review.likeCount || 0}}</text>
					</view>
					<view class="action-btn" @click.stop="commentReview(review.id)">
						<text class="action-icon">💬</text>
						<text class="action-count">{{review.commentCount || 0}}</text>
					</view>
					<view class="action-btn" @click.stop="shareReview(review.id)">
						<text class="action-icon">🔗</text>
						<text class="action-text">分享</text>
					</view>
				</view>
			</view>
			
			<!-- 加载更多 -->
			<view v-if="hasMore" class="load-more" @click="loadMore">
				<text v-if="!loadingMore">加载更多</text>
				<view v-else class="loading-spinner small"></view>
			</view>
			<view v-else class="no-more">
				<text>没有更多探店内容了</text>
			</view>
		</view>
		
		<!-- 添加探店按钮 -->
		<view class="add-review-floating" @click="createReview">
			<text class="add-review-icon">+</text>
			<text class="add-review-text">写探店</text>
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
				shopId: null,
				shopName: '',
				loading: false,
				loadingMore: false,
				currentPage: 1,
				pageSize: 10,
				totalItems: 0,
				reviews: [],
				sortType: 'latest' // 排序类型：latest(最新)、popular(热门)、rating(好评)
			}
		},
		computed: {
			hasMore() {
				return this.reviews.length < this.totalItems;
			}
		},
		onLoad(options) {
			console.log('探店页面参数:', JSON.stringify(options));
			this.shopId = options.id;
			this.shopName = decodeURIComponent(options.name || '');
			
			if (!this.shopId) {
				console.error('未获取到店铺ID');
				uni.showToast({
					title: '店铺ID无效',
					icon: 'none'
				});
				setTimeout(() => {
					this.goBack();
				}, 1500);
				return;
			}
			
			console.log('加载店铺探店，ID:', this.shopId);
			this.loadReviews();
		},
		methods: {
			// 加载探店评价
			loadReviews(refresh = true) {
				if (refresh) {
					this.currentPage = 1;
					this.loading = true;
					this.reviews = [];
				} else {
					this.loadingMore = true;
				}
				
				// 构建查询参数
				const params = {
					shopId: this.shopId,
					current: this.currentPage,
					size: this.pageSize
				};
				
				// 根据排序类型添加排序参数
				if (this.sortType === 'latest') {
					params.sortBy = 'createTime';
					params.sortOrder = 'desc';
				} else if (this.sortType === 'popular') {
					params.sortBy = 'likeCount';
					params.sortOrder = 'desc';
				} else if (this.sortType === 'rating') {
					params.sortBy = 'rating';
					params.sortOrder = 'desc';
				}
				
				console.log('请求探店列表参数:', params);
				
				uni.request({
					url: `${config.BaseUrl}/api/shop/review/page`,
					method: 'GET',
					data: params,
					header: {
						'content-type': 'application/json'
					},
					success: (res) => {
						console.log('获取探店成功:', JSON.stringify(res.data));
						if (res.data && res.data.code === 1) {
							const data = res.data.data;
							
							if (refresh) {
								this.reviews = data.records || [];
							} else {
								this.reviews = [...this.reviews, ...(data.records || [])];
							}
							
							this.totalItems = data.total || 0;
							this.currentPage = data.current || 1;
							
							// 处理每个评价的图片数组
							this.reviews.forEach(review => {
								// 如果images是字符串，尝试解析为数组
								if (typeof review.images === 'string' && review.images) {
									try {
										review.images = JSON.parse(review.images);
									} catch (e) {
										console.error('解析图片JSON失败:', e);
										review.images = [];
									}
								} else if (!review.images) {
									review.images = [];
								}
								
								// 为演示添加模拟点赞状态
								review.isLiked = false;
							});
							
							console.log(`已加载${this.reviews.length}条探店，总共${this.totalItems}条`);
						} else {
							console.error('获取探店API返回错误:', JSON.stringify(res.data));
							uni.showToast({
								title: '获取探店失败',
								icon: 'none'
							});
						}
					},
					fail: (err) => {
						console.error('请求失败:', JSON.stringify(err));
						uni.showToast({
							title: '网络请求失败',
							icon: 'none'
						});
					},
					complete: () => {
						this.loading = false;
						this.loadingMore = false;
					}
				});
			},
			
			// 设置排序类型
			setSort(sortType) {
				if (this.sortType === sortType) return;
				this.sortType = sortType;
				this.loadReviews();
			},
			
			// 加载更多
			loadMore() {
				if (!this.loadingMore && this.hasMore) {
					this.currentPage++;
					this.loadReviews(false);
				}
			},
			
			// 查看探店详情
			viewReviewDetail(id) {
				if (!id) {
					uni.showToast({
						title: '探店ID无效',
						icon: 'none'
					});
					return;
				}
				
				uni.navigateTo({
					url: `/pages/mall/shops/review-detail?id=${id}`
				});
			},
			
			// 点赞探店
			likeReview(review, index) {
				// 这里应该调用点赞API，这里只做模拟
				review.isLiked = !review.isLiked;
				
				if (review.isLiked) {
					review.likeCount = (review.likeCount || 0) + 1;
				} else if (review.likeCount > 0) {
					review.likeCount -= 1;
				}
				
				// 更新视图
				this.$set(this.reviews, index, review);
				
				uni.showToast({
					title: review.isLiked ? '点赞成功' : '已取消点赞',
					icon: 'none'
				});
			},
			
			// 评论探店
			commentReview(id) {
				uni.navigateTo({
					url: `/pages/mall/shops/review-detail?id=${id}&showComment=true`
				});
			},
			
			// 分享探店
			shareReview(id) {
				uni.showShareMenu({
					withShareTicket: true
				});
			},
			
			// 创建探店
			createReview() {
				uni.navigateTo({
					url: `/pages/mall/shops/create-review?shopId=${this.shopId}&shopName=${encodeURIComponent(this.shopName)}`
				});
			},
			
			// 预览图片
			previewImage(images, current) {
				uni.previewImage({
					urls: images,
					current: images[current]
				});
			},
			
			// 格式化日期
			formatDate(dateStr) {
				if (!dateStr) return '未知时间';
				
				const date = new Date(dateStr);
				const now = new Date();
				const diff = now - date;
				
				// 小于1分钟
				if (diff < 60 * 1000) {
					return '刚刚';
				}
				
				// 小于1小时
				if (diff < 60 * 60 * 1000) {
					return `${Math.floor(diff / (60 * 1000))}分钟前`;
				}
				
				// 小于1天
				if (diff < 24 * 60 * 60 * 1000) {
					return `${Math.floor(diff / (60 * 60 * 1000))}小时前`;
				}
				
				// 小于30天
				if (diff < 30 * 24 * 60 * 60 * 1000) {
					return `${Math.floor(diff / (24 * 60 * 60 * 1000))}天前`;
				}
				
				// 大于30天显示具体日期
				const year = date.getFullYear();
				const month = date.getMonth() + 1;
				const day = date.getDate();
				return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
			},
			
			goBack() {
				uni.navigateBack({
					delta: 1,
					fail: () => {
						// If there's no page to go back to, navigate to shop detail
						uni.navigateTo({
							url: `/pages/mall/shops/detail?id=${this.shopId}`
						});
					}
				});
			}
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.loadReviews();
			setTimeout(() => {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		
		// 上拉加载更多
		onReachBottom() {
			this.loadMore();
		}
	}
</script>

<style>
	.container {
		background-color: #F8F7F2;
		min-height: 100vh;
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
	
	/* 顶部信息 */
	.header-info {
		padding: 30rpx;
		text-align: center;
	}
	
	.header-title {
		font-size: 36rpx;
		color: #333;
		font-weight: bold;
		font-family: "FangSong", serif;
		margin-bottom: 10rpx;
	}
	
	.header-subtitle {
		font-size: 24rpx;
		color: #666;
	}
	
	/* 筛选选项 */
	.filter-options {
		display: flex;
		justify-content: center;
		padding: 0 30rpx 20rpx;
		margin-bottom: 20rpx;
	}
	
	.filter-item {
		padding: 10rpx 30rpx;
		margin: 0 10rpx;
		background: #fff;
		border-radius: 30rpx;
		border: 1rpx solid #e0c9d1;
	}
	
	.filter-item.active {
		background: rgba(138, 51, 36, 0.1);
		border-color: #8A3324;
	}
	
	.filter-text {
		font-size: 26rpx;
		color: #666;
	}
	
	.filter-item.active .filter-text {
		color: #8A3324;
		font-weight: bold;
	}
	
	/* 加载状态 */
	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 60rpx 0;
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
		margin-bottom: 10rpx;
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
		padding: 80rpx 0;
	}
	
	.empty-text {
		font-size: 28rpx;
		color: #999;
		margin-bottom: 30rpx;
	}
	
	.add-review-btn {
		background-color: #8A3324;
		color: #fff;
		border: none;
		border-radius: 30rpx;
		padding: 15rpx 30rpx;
		font-size: 28rpx;
		font-weight: bold;
		font-family: "FangSong", serif;
	}
	
	/* 探店列表 */
	.reviews-list {
		padding: 0 30rpx 120rpx;
	}
	
	.review-card {
		background-color: #fff;
		border-radius: 15rpx;
		padding: 30rpx;
		margin-bottom: 30rpx;
		box-shadow: 0 4rpx 8rpx rgba(0,0,0,0.05);
		border: 1rpx solid #e0c9d1;
	}
	
	.review-header {
		display: flex;
		justify-content: space-between;
		margin-bottom: 20rpx;
	}
	
	.user-info {
		display: flex;
		align-items: center;
	}
	
	.user-avatar {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		margin-right: 15rpx;
	}
	
	.user-details {
		display: flex;
		flex-direction: column;
	}
	
	.user-name {
		font-size: 28rpx;
		color: #333;
		font-weight: bold;
		margin-bottom: 5rpx;
	}
	
	.review-rating {
		display: flex;
		align-items: center;
	}
	
	.star {
		color: #DDDDDD;
		font-size: 24rpx;
	}
	
	.star.active {
		color: #FF9500;
	}
	
	.rating-text {
		font-size: 22rpx;
		color: #FF9500;
		margin-left: 10rpx;
	}
	
	.review-time {
		font-size: 24rpx;
		color: #999;
	}
	
	.review-content {
		margin-bottom: 20rpx;
	}
	
	.review-title {
		font-size: 30rpx;
		color: #333;
		font-weight: bold;
		margin-bottom: 10rpx;
		display: block;
	}
	
	.review-text {
		font-size: 28rpx;
		color: #666;
		line-height: 1.5;
	}
	
	.review-images {
		display: flex;
		margin-bottom: 20rpx;
		position: relative;
	}
	
	.review-image {
		width: 180rpx;
		height: 180rpx;
		margin-right: 10rpx;
		border-radius: 8rpx;
	}
	
	.image-count {
		position: absolute;
		right: 10rpx;
		bottom: 10rpx;
		background-color: rgba(0, 0, 0, 0.5);
		color: #fff;
		font-size: 24rpx;
		padding: 5rpx 10rpx;
		border-radius: 20rpx;
	}
	
	.review-footer {
		display: flex;
		border-top: 1rpx solid #f0f0f0;
		padding-top: 20rpx;
	}
	
	.action-btn {
		display: flex;
		align-items: center;
		margin-right: 30rpx;
	}
	
	.action-icon {
		font-size: 32rpx;
		margin-right: 10rpx;
		opacity: 0.7;
	}
	
	.action-icon.active {
		opacity: 1;
		color: #8A3324;
	}
	
	.action-count, .action-text {
		font-size: 24rpx;
		color: #999;
	}
	
	/* 浮动添加按钮 */
	.add-review-floating {
		position: fixed;
		right: 30rpx;
		bottom: 100rpx;
		background-color: #8A3324;
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 160rpx;
		height: 80rpx;
		border-radius: 40rpx;
		box-shadow: 0 4rpx 10rpx rgba(138, 51, 36, 0.3);
		z-index: 100;
	}
	
	.add-review-icon {
		font-size: 36rpx;
		margin-right: 10rpx;
	}
	
	.add-review-text {
		font-size: 28rpx;
		font-family: "FangSong", serif;
	}
	
	.load-more, .no-more {
		text-align: center;
		padding: 30rpx 0;
		font-size: 26rpx;
		color: #999;
	}
</style> 