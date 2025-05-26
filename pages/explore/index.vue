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
					<input class="search-input" type="text" placeholder="搜索店铺或美食" />
				</view>
			</view>
		</view>
		
		<!-- 分类标签 -->
		<view class="categories">
			<scroll-view scroll-x class="categories-scroll" show-scrollbar="false">
				<view class="category-item active">
					<text>全部</text>
				</view>
				<view class="category-item">
					<text>美食</text>
				</view>
				<view class="category-item">
					<text>咖啡</text>
				</view>
				<view class="category-item">
					<text>甜品</text>
				</view>
				<view class="category-item">
					<text>文创</text>
				</view>
				<view class="category-item">
					<text>书店</text>
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
		
		<!-- 店铺列表 -->
		<view class="section">
			<view class="section-header">
				<image class="section-title-decoration" src="https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg" mode="aspectFit"></image>
				<text class="section-title">附近店铺</text>
				<image class="section-title-decoration" src="https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg" mode="aspectFit"></image>
			</view>
			
			<view class="shop-list">
				<view class="shop-card" v-for="(shop, index) in shops" :key="index" @click="viewShopDetail(shop.id)">
					<image class="shop-image" :src="shop.image" mode="aspectFill"></image>
					<view class="shop-info">
						<view class="shop-header-row">
							<text class="shop-name">{{shop.name}}</text>
							<view class="shop-badges">
								<text v-if="shop.isOfficial" class="shop-badge official">官方</text>
								<text v-if="shop.isNew" class="shop-badge new">新店</text>
							</view>
						</view>
						<view class="shop-rating-row">
							<text class="rating-score">{{shop.rating}}</text>
							<view class="rating-stars">
								<text v-for="n in 5" :key="n" class="star" :class="{ active: n <= Math.floor(shop.rating) }">★</text>
							</view>
							<text class="rating-count">{{shop.ratingCount}}条评价</text>
						</view>
						<view class="shop-tags">
							<text class="shop-tag" v-for="(tag, tagIndex) in shop.tags" :key="tagIndex">{{tag}}</text>
						</view>
						<view class="shop-location">
							<image class="location-icon" src="https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg"></image>
							<text class="location-text">{{shop.location}}</text>
							<text class="distance">{{shop.distance}}</text>
						</view>
					</view>
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
	
	export default {
		components: {
			AiAssistant,
			CustomNavBar
		},
		data() {
			return {
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
				shops: [
					{
						id: '4',
						name: '江南小厨',
						image: 'https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg',
						rating: 4.5,
						ratingCount: 328,
						isOfficial: true,
						isNew: false,
						tags: ['江浙菜', '家常菜', '性价比高'],
						location: '校园东门50米',
						distance: '350m'
					},
					{
						id: '5',
						name: '清风书院',
						image: 'https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg',
						rating: 4.7,
						ratingCount: 156,
						isOfficial: false,
						isNew: true,
						tags: ['文艺', '安静', '咖啡'],
						location: '图书馆西侧',
						distance: '120m'
					},
					{
						id: '6',
						name: '甜蜜时光',
						image: 'https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg',
						rating: 4.4,
						ratingCount: 287,
						isOfficial: false,
						isNew: false,
						tags: ['甜品', '下午茶', '约会'],
						location: '学生中心一楼',
						distance: '80m'
					},
					{
						id: '7',
						name: '川味小馆',
						image: 'https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg',
						rating: 4.6,
						ratingCount: 412,
						isOfficial: true,
						isNew: false,
						tags: ['川菜', '麻辣', '小吃'],
						location: '校园南门对面',
						distance: '450m'
					}
				]
			}
		},
		methods: {
			viewShopDetail(id) {
				uni.navigateTo({
					url: `/pages/shops/detail/index?id=${id}`
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