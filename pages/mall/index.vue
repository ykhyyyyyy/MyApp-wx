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
					<input class="search-input" type="text" placeholder="搜索商品" />
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
			<view class="category-item">
				<image src="https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg" class="category-icon"></image>
				<text class="category-text">美食</text>
			</view>
			<view class="category-item">
				<image src="https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg" class="category-icon"></image>
				<text class="category-text">书籍</text>
			</view>
			<view class="category-item">
				<image src="https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg" class="category-icon"></image>
				<text class="category-text">服饰</text>
			</view>
			<view class="category-item">
				<image src="https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg" class="category-icon"></image>
				<text class="category-text">数码</text>
			</view>
		</view>
		
		<!-- 推荐商品 -->
		<view class="section">
			<view class="section-header">
				<image class="section-title-decoration" src="https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg" mode="aspectFit"></image>
				<text class="section-title">精选推荐</text>
				<image class="section-title-decoration" src="https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg" mode="aspectFit"></image>
			</view>
			
			<view class="product-grid">
				<view class="product-card" v-for="(product, index) in recommendedProducts" :key="index">
					<image class="product-image" :src="product.image" mode="aspectFill"></image>
					<view class="product-info">
						<text class="product-name">{{product.name}}</text>
						<view class="product-price-row">
							<text class="product-price">¥{{product.price}}</text>
							<text class="product-sold">已售{{product.sold}}件</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 新品上架 -->
		<view class="section">
			<view class="section-header">
				<image class="section-title-decoration" src="https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg" mode="aspectFit"></image>
				<text class="section-title">新品上架</text>
				<image class="section-title-decoration" src="https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg" mode="aspectFit"></image>
			</view>
			
			<view class="product-grid">
				<view class="product-card" v-for="(product, index) in newProducts" :key="index">
					<image class="product-image" :src="product.image" mode="aspectFill"></image>
					<view class="product-info">
						<text class="product-name">{{product.name}}</text>
						<view class="product-price-row">
							<text class="product-price">¥{{product.price}}</text>
							<text class="product-sold">已售{{product.sold}}件</text>
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
				recommendedProducts: [
					{
						id: '1',
						name: '校徽纪念胸针',
						image: 'https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg',
						price: '39.00',
						sold: 128
					},
					{
						id: '2',
						name: '中国风笔记本套装',
						image: 'https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg',
						price: '58.00',
						sold: 95
					},
					{
						id: '3',
						name: '古风书签礼盒',
						image: 'https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg',
						price: '28.00',
						sold: 210
					},
					{
						id: '4',
						name: '校园文化衫',
						image: 'https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg',
						price: '89.00',
						sold: 156
					}
				],
				newProducts: [
					{
						id: '5',
						name: '复古风格帆布包',
						image: 'https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg',
						price: '99.00',
						sold: 45
					},
					{
						id: '6',
						name: '毕业纪念相册',
						image: 'https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg',
						price: '128.00',
						sold: 32
					},
					{
						id: '7',
						name: '中国风水杯',
						image: 'https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg',
						price: '68.00',
						sold: 78
					},
					{
						id: '8',
						name: '学院风羊毛围巾',
						image: 'https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg',
						price: '119.00',
						sold: 23
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
	
	.product-grid {
		display: flex;
		flex-wrap: wrap;
		margin: 0 -10rpx;
	}
	
	.product-card {
		width: calc(50% - 20rpx);
		margin: 10rpx;
		background-color: #fff;
		border-radius: 10rpx;
		overflow: hidden;
		box-shadow: 0 2rpx 6rpx rgba(0,0,0,0.05);
		border: 1rpx solid #f0f0f0;
	}
	
	.product-image {
		width: 100%;
		height: 220rpx;
	}
	
	.product-info {
		padding: 15rpx;
	}
	
	.product-name {
		font-size: 28rpx;
		color: #333;
		margin-bottom: 10rpx;
		font-family: "FangSong", serif;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	.product-price-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.product-price {
		font-size: 30rpx;
		color: #8A3324;
		font-weight: bold;
	}
	
	.product-sold {
		font-size: 22rpx;
		color: #999;
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