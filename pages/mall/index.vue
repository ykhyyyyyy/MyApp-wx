<template>
	<view class="container">
		<!-- 使用自定义导航栏组件 -->
		<custom-nav-bar title="锦绣商阁" subtitle="校园精品汇" :show-back="true"></custom-nav-bar>
		
		<!-- 添加明显的返回按钮 -->
		<view class="back-button" @click="goBack">
			<text class="back-arrow">←</text>
			<text class="back-text">返回</text>
		</view>
		
		<view class="header">
			<view class="search-box">
				<view class="search-input-wrapper">
					<image src="https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg" class="search-icon"></image>
					<input class="search-input" type="text" v-model="searchText" placeholder="搜索店铺" @confirm="searchShops" />
				</view>
			</view>
		</view>
		
		<view class="banner">
			<swiper circular autoplay interval="3000" indicator-dots class="mall-swiper">
				<swiper-item>
					<image src="https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg" mode="aspectFill" class="banner-image"></image>
				</swiper-item>
				<swiper-item>
					<image src="https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg" mode="aspectFill" class="banner-image"></image>
				</swiper-item>
			</swiper>
		</view>
		
		<view class="categories">
			<view class="category-item" v-for="(category, index) in categories" :key="index" @click="selectCategory(category.id)">
				<image :src="category.icon" class="category-icon"></image>
				<text class="category-text">{{category.name}}</text>
			</view>
		</view>
		
		<!-- 显示加载中状态 -->
		<view v-if="loading" class="loading-container">
			<view class="loading-spinner"></view>
			<text class="loading-text">加载中...</text>
		</view>
		
		<!-- 显示无数据状态 -->
		<view v-else-if="shops.length === 0 && !loading" class="empty-container">
			<text class="empty-text">暂无店铺数据</text>
		</view>
		
		<!-- 店铺展示区域 -->
		<view v-else>
			<!-- 所有店铺 -->
			<view class="section">
				<view class="section-header">
					<image class="section-title-decoration" src="https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg" mode="aspectFit"></image>
					<text class="section-title">{{ selectedCategoryName ? selectedCategoryName : '精品店铺' }}</text>
					<image class="section-title-decoration" src="https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg" mode="aspectFit"></image>
				</view>
				
				<view class="shop-list">
					<view class="shop-card-horizontal" v-for="(shop, index) in shops" :key="shop.id || index" @click="viewShopDetail(shop, index)">
						<image class="shop-image-small" :src="shop.avatar || shop.logo || 'https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg'" mode="aspectFill" @click.stop="directNavigate(shop.id)"></image>
						<view class="shop-info-horizontal">
							<view class="shop-header">
								<text class="shop-name" @click.stop="directNavigate(shop.id)">{{shop.name || '未命名店铺'}}</text>
								<view class="shop-badges">
									<text v-if="shop.isOfficial" class="shop-badge official">官方</text>
									<text v-if="shop.isNew" class="shop-badge new">新店</text>
								</view>
							</view>
							
							<view class="shop-description">
								<text class="description-text">{{shop.description || '暂无描述'}}</text>
							</view>
							
							<view class="shop-footer">
								<view class="shop-rating">
									<text class="rating-score">{{shop.rating || '5.0'}}</text>
									<view class="rating-stars">
										<text v-for="n in 5" :key="n" class="star" :class="{ active: n <= Math.floor(shop.rating || 5) }">★</text>
									</view>
									<text class="rating-count">{{shop.ratingCount || 0}}条评价</text>
								</view>
								<text class="shop-enter" @click.stop="directNavigate(shop.id)">进店 ></text>
							</view>
						</view>
					</view>
				</view>
				
				<!-- 加载更多 -->
				<view v-if="hasMore" class="load-more" @click="loadMore">
					<text v-if="!loadingMore">加载更多</text>
					<view v-else class="loading-spinner small"></view>
				</view>
				<view v-else class="no-more">
					<text>没有更多店铺了</text>
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
				loadingMore: false,
				searchText: '',
				currentPage: 1,
				pageSize: 10,
				totalItems: 0,
				selectedCategoryId: null,
				selectedCategoryName: '',
				shops: [],
			
			}
		},
		computed: {
			hasMore() {
				return this.shops.length < this.totalItems;
			}
		},
		onLoad() {
			// 页面加载时获取数据
			this.loadShops();
		},
		methods: {
			// 加载店铺数据
			loadShops(refresh = true) {
				if (refresh) {
					this.currentPage = 1;
					this.loading = true;
					this.shops = [];
				} else {
					this.loadingMore = true;
				}
				
				// 构建查询参数
				const params = {
					current: this.currentPage,
					size: this.pageSize
				};
				
				// 如果选择了分类，添加分类ID
				if (this.selectedCategoryId) {
					params.categoryId = this.selectedCategoryId;
				}
				
				// 发起API请求
				uni.request({
					url: `${config.BaseUrl}/api/shop/page`,
					method: 'GET',
					data: params,
					header: {
						'content-type': 'application/json'
					},
					success: (res) => {
						console.log('获取店铺数据响应:', JSON.stringify(res.data));
						if (res.data && res.data.code === 1 && res.data.data) {
							const data = res.data.data;
							
							// 处理店铺数据
							const shopList = data.records || [];
							console.log(`获取到${shopList.length}个店铺`);
							
							// 为每个店铺添加isNew和isOfficial标识
							shopList.forEach((shop, index) => {
								console.log(`店铺 ${index + 1}:`, JSON.stringify(shop));
								
								// 如果创建时间在30天内，标记为新店
								if (shop.createdTime) {
									const createDate = new Date(shop.createdTime);
									const now = new Date();
									const diffTime = Math.abs(now - createDate);
									const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
									shop.isNew = diffDays <= 30;
								}
								
								// 设置默认评分为5.0
								if (!shop.rating) {
									shop.rating = 5.0;
								}
								
								// 根据店铺类型标记是否为官方店铺
								shop.isOfficial = shop.type === 'official';
							});
							
							// 合并数据
							if (refresh) {
								this.shops = shopList;
							} else {
								this.shops = [...this.shops, ...shopList];
							}
							
							this.totalItems = data.total || 0;
							this.currentPage = data.current || 1;
							
							console.log(`已加载${this.shops.length}个店铺，总共${this.totalItems}个`);
						} else {
							console.error('获取店铺数据失败:', res.data);
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
						this.loadingMore = false;
					}
				});
			},
			
			// 搜索店铺
			searchShops() {
				if (!this.searchText.trim()) {
					// 如果搜索框为空，重置搜索条件并加载所有店铺
					this.selectedCategoryId = null;
					this.selectedCategoryName = '';
					this.loadShops();
					return;
				}
				
				this.loading = true;
				this.shops = [];
				
				uni.request({
					url: `${config.BaseUrl}/api/shop/search`,
					method: 'GET',
					data: {
						name: this.searchText,
						page: 1,
						pageSize: 20
					},
					header: {
						'content-type': 'application/json'
					},
					success: (res) => {
						console.log('搜索店铺成功:', res.data);
						if (res.data && res.data.code === 1) {
							const data = res.data.data;
							
							// 处理店铺数据
							const shopList = data.records || [];
							
							// 为每个店铺添加isNew和isOfficial标识
							shopList.forEach(shop => {
								// 如果创建时间在30天内，标记为新店
								if (shop.createdTime) {
									const createDate = new Date(shop.createdTime);
									const now = new Date();
									const diffTime = Math.abs(now - createDate);
									const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
									shop.isNew = diffDays <= 30;
								}
								
								// 根据店铺类型标记是否为官方店铺
								shop.isOfficial = shop.type === 'official';
							});
							
							this.shops = shopList;
							this.totalItems = data.total || this.shops.length;
							
							// 更新标题
							this.selectedCategoryName = `"${this.searchText}" 的搜索结果`;
						} else {
							uni.showToast({
								title: '搜索失败',
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
					}
				});
			},
			
			// 选择分类
			selectCategory(categoryId) {
				// 如果点击的是已选中的分类，则取消选择
				if (this.selectedCategoryId === categoryId) {
					this.selectedCategoryId = null;
					this.selectedCategoryName = '';
				} else {
					this.selectedCategoryId = categoryId;
					// 设置分类名称
					const category = this.categories.find(c => c.id === categoryId);
					this.selectedCategoryName = category ? category.name : '';
				}
				
				// 重置搜索文本
				this.searchText = '';
				
				// 重新加载店铺
				this.loadShops();
			},
			
			// 加载更多
			loadMore() {
				if (!this.loadingMore && this.hasMore) {
					this.currentPage++;
					this.loadShops(false);
				}
			},
			
			// 查看店铺详情
			viewShopDetail(shop, index) {
				console.log('全部店铺列表:', JSON.stringify(this.shops));
				console.log('点击的索引:', index);
				console.log('店铺信息:', shop ? JSON.stringify(shop) : 'undefined');
				
				if (!shop) {
					// 尝试从shops数组中获取对应索引的店铺
					if (index !== undefined && this.shops && this.shops.length > index) {
						shop = this.shops[index];
						console.log('从数组重新获取的店铺:', JSON.stringify(shop));
					} else {
						uni.showToast({
							title: '店铺信息无效',
							icon: 'none'
						});
						return;
					}
				}
				
				// 检查ID是否存在
				const shopId = shop.id;
				
				if (!shopId) {
					console.error('店铺ID不存在:', shop);
					uni.showToast({
						title: '店铺ID无效',
						icon: 'none'
					});
					return;
				}
				
				console.log('导航到店铺详情，ID:', shopId);
				uni.navigateTo({
					url: `/pages/mall/shops/detail?id=${shopId}`,
					fail: (err) => {
						console.error('导航失败:', err);
						uni.showToast({
							title: '跳转失败',
							icon: 'none'
						});
					}
				});
			},
			
			// 直接导航到店铺详情页面（使用ID直接导航）
			directNavigate(id) {
				if (!id) {
					console.error('直接导航：ID无效');
					uni.showToast({
						title: '店铺ID无效',
						icon: 'none'
					});
					return;
				}
				
				console.log('直接导航到店铺，ID:', id);
				uni.navigateTo({
					url: `/pages/mall/shops/detail?id=${id}`,
					fail: (err) => {
						console.error('导航失败:', err);
						uni.showToast({
							title: '跳转失败',
							icon: 'none'
						});
					}
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
			}
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.loadShops();
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
	
	.shop-grid {
		display: flex;
		flex-wrap: wrap;
		margin: 0 -10rpx;
	}
	
	.shop-card {
		width: calc(50% - 20rpx);
		margin: 10rpx;
		background-color: #fff;
		border-radius: 10rpx;
		overflow: hidden;
		box-shadow: 0 2rpx 6rpx rgba(0,0,0,0.05);
		border: 1rpx solid #f0f0f0;
	}
	
	.shop-image {
		width: 100%;
		height: 150rpx;
	}
	
	.shop-info {
		padding: 15rpx;
	}
	
	.shop-list {
		display: flex;
		flex-direction: column;
	}
	
	.shop-card-horizontal {
		display: flex;
		margin-bottom: 20rpx;
		background-color: #fff;
		border-radius: 10rpx;
		box-shadow: 0 2rpx 6rpx rgba(0,0,0,0.05);
		border: 1rpx solid #f0f0f0;
		overflow: hidden;
	}
	
	.shop-image-small {
		width: 180rpx;
		height: 180rpx;
		flex-shrink: 0;
	}
	
	.shop-info-horizontal {
		flex: 1;
		padding: 15rpx;
		display: flex;
		flex-direction: column;
	}
	
	.shop-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 10rpx;
	}
	
	.shop-name {
		font-size: 28rpx;
		color: #333;
		font-family: "FangSong", serif;
		font-weight: bold;
	}
	
	.shop-badges {
		display: flex;
	}
	
	.shop-badge {
		font-size: 20rpx;
		padding: 2rpx 8rpx;
		border-radius: 6rpx;
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
	
	.shop-description {
		flex: 1;
		margin-bottom: 10rpx;
	}
	
	.description-text {
		font-size: 24rpx;
		color: #666;
		line-height: 1.5;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}
	
	.shop-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.shop-rating {
		display: flex;
		align-items: center;
	}
	
	.rating-score {
		font-size: 24rpx;
		color: #FF9500;
		font-weight: bold;
		margin-right: 6rpx;
	}
	
	.rating-stars {
		display: flex;
		margin-right: 6rpx;
	}
	
	.star {
		color: #DDDDDD;
		font-size: 24rpx;
	}
	
	.star.active {
		color: #FF9500;
	}
	
	.rating-count {
		font-size: 20rpx;
		color: #999;
	}
	
	.shop-enter {
		font-size: 24rpx;
		color: #7EC4CF;
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
	}
	
	.load-more, .no-more {
		text-align: center;
		padding: 30rpx 0;
		font-size: 26rpx;
		color: #999;
	}
</style> 