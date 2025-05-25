<template>
	<view class="container page-content-with-tabbar">
		<!-- 自定义中国风导航栏 -->
		<view class="custom-nav">
			<image class="nav-bg" src="/static/images/nav-mall.png" mode="aspectFill"></image>
			<view class="nav-content">
				<text class="nav-title">锦绣商阁</text>
				<text class="nav-subtitle">校园精品汇</text>
			</view>
		</view>
		
		<view class="header">
			<view class="search-box">
				<view class="search-input-wrapper">
					<image src="/static/icons/search.png" class="search-icon"></image>
					<input class="search-input" type="text" placeholder="搜索商品" />
				</view>
			</view>
		</view>
		
		<view class="banner">
			<image class="banner-decoration left" src="/static/decoration/chinese-knot-left.png" mode="aspectFit"></image>
			<swiper circular autoplay interval="3000" indicator-dots indicator-color="rgba(255,255,255,0.6)" indicator-active-color="var(--primary-red)" class="mall-swiper">
				<swiper-item v-for="(item, index) in banners" :key="index">
					<image :src="item.image" mode="aspectFill" class="banner-image"></image>
				</swiper-item>
			</swiper>
			<image class="banner-decoration right" src="/static/decoration/chinese-knot-right.png" mode="aspectFit"></image>
		</view>
		
		<!-- 分类入口 - 添加了云纹背景和装饰元素 -->
		<view class="categories chinese-border">
			<image class="cloud-pattern" src="/static/decoration/cloud-pattern.png" mode="aspectFill"></image>
			<view class="category-item" v-for="(item, index) in categories" :key="index" @tap="selectCategory(item.id)">
				<image :src="item.icon" class="category-icon"></image>
				<text class="category-text">{{item.name}}</text>
			</view>
		</view>
		
		<!-- 优惠活动 -->
		<view class="promo-section">
			<view class="section-header">
				<image class="section-title-decoration" src="/static/decoration/title-left.png" mode="aspectFit"></image>
				<text class="section-title">限时特惠</text>
				<image class="section-title-decoration" src="/static/decoration/title-right.png" mode="aspectFit"></image>
				<view class="section-more" @tap="viewMorePromo">
					<text>更多特惠</text>
					<image src="/static/icons/arrow-right.png" class="icon-arrow"></image>
				</view>
			</view>
			
			<scroll-view scroll-x class="promo-scroll" show-scrollbar="false">
				<view class="promo-item" v-for="(item, index) in promoProducts" :key="index" @tap="viewProduct(item.id)">
					<image :src="item.image" class="promo-image" mode="aspectFill"></image>
					<view class="promo-tag" v-if="item.discount">{{item.discount}}</view>
					<view class="promo-info">
						<text class="promo-title">{{item.name}}</text>
						<view class="promo-price-row">
							<text class="promo-price">¥{{item.price}}</text>
							<text class="promo-original" v-if="item.originalPrice">¥{{item.originalPrice}}</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		
		<!-- 商品推荐 -->
		<view class="product-section">
			<view class="section-header">
				<image class="section-title-decoration" src="/static/decoration/title-left.png" mode="aspectFit"></image>
				<text class="section-title">热门商品</text>
				<image class="section-title-decoration" src="/static/decoration/title-right.png" mode="aspectFit"></image>
				<view class="section-more" @tap="viewMoreProducts">
					<text>查看更多</text>
					<image src="/static/icons/arrow-right.png" class="icon-arrow"></image>
				</view>
			</view>
			
			<view class="product-grid">
				<view class="product-item" v-for="(product, index) in products" :key="index" @tap="viewProduct(product.id)">
					<image :src="product.image" class="product-image" mode="aspectFill"></image>
					<view class="product-info">
						<text class="product-title">{{product.name}}</text>
						<view class="product-shop" v-if="product.shop">
							<text class="shop-name">{{product.shop}}</text>
						</view>
						<view class="product-price-row">
							<text class="product-price">¥{{product.price}}</text>
							<text class="product-sales">{{product.sales}}人已购</text>
						</view>
					</view>
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
		<tab-bar :current="3"></tab-bar>
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
				banners: [
					{ image: '/static/images/mall-banner1.png' },
					{ image: '/static/images/mall-banner2.png' }
				],
				categories: [
					{ id: 'food', name: '美食', icon: '/static/icons/cat-food.png' },
					{ id: 'books', name: '书籍', icon: '/static/icons/cat-book.png' },
					{ id: 'clothing', name: '服饰', icon: '/static/icons/cat-clothing.png' },
					{ id: 'digital', name: '数码', icon: '/static/icons/cat-digital.png' }
				],
				promoProducts: [
					{
						id: 1,
						name: '定制校园文化T恤',
						price: '49.9',
						originalPrice: '89.9',
						discount: '5.5折',
						image: '/static/images/products/tshirt.png'
					},
					{
						id: 2,
						name: '学生专享笔记本电脑',
						price: '4299',
						originalPrice: '5299',
						discount: '8.1折',
						image: '/static/images/products/laptop.png'
					},
					{
						id: 3,
						name: '考研辅导书套装',
						price: '128',
						originalPrice: '198',
						discount: '6.5折',
						image: '/static/images/products/books.png'
					}
				],
				products: [
					{
						id: 101,
						name: '校园风格手帐本',
						price: '29.9',
						shop: '文具小铺',
						sales: 432,
						image: '/static/images/products/notebook.png'
					},
					{
						id: 102,
						name: '无线蓝牙耳机',
						price: '129',
						shop: '数码之家',
						sales: 1253,
						image: '/static/images/products/earphones.png'
					},
					{
						id: 103,
						name: '校园主题保温杯',
						price: '59.9',
						shop: '生活良品',
						sales: 876,
						image: '/static/images/products/cup.png'
					},
					{
						id: 104,
						name: '复古风书签套装',
						price: '19.9',
						shop: '文具小铺',
						sales: 325,
						image: '/static/images/products/bookmark.png'
					}
				]
			}
		},
		methods: {
			selectCategory(id) {
				uni.showToast({
					title: '选择了' + id + '分类',
					icon: 'none'
				});
			},
			viewProduct(id) {
				uni.navigateTo({
					url: `/pages/mall/product?id=${id}`
				});
			},
			viewMorePromo() {
				uni.navigateTo({
					url: '/pages/mall/promo'
				});
			},
			viewMoreProducts() {
				uni.navigateTo({
					url: '/pages/mall/list'
				});
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
	
	/* Banner样式 - 添加了中国结装饰 */
	.banner {
		margin: 0 30rpx 30rpx;
		position: relative;
	}
	
	.banner-decoration {
		position: absolute;
		width: 40rpx;
		height: 80rpx;
		top: -10rpx;
		z-index: 2;
	}
	
	.banner-decoration.left {
		left: -10rpx;
	}
	
	.banner-decoration.right {
		right: -10rpx;
	}
	
	.mall-swiper {
		height: 300rpx;
		border-radius: 15rpx;
		overflow: hidden;
		box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.1);
	}
	
	.banner-image {
		width: 100%;
		height: 100%;
	}
	
	/* 分类样式 - 加入云纹和边框 */
	.categories {
		position: relative;
		display: flex;
		justify-content: space-between;
		margin: 0 30rpx 40rpx;
		padding: 30rpx 20rpx;
		background-color: rgba(255, 255, 255, 0.8);
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
	
	.category-item {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 25%;
		z-index: 2;
	}
	
	.category-icon {
		width: 80rpx;
		height: 80rpx;
		margin-bottom: 10rpx;
		background-color: rgba(255, 255, 255, 0.8);
		border-radius: 50%;
		padding: 10rpx;
	}
	
	.category-text {
		font-size: 26rpx;
		color: var(--text-brown);
		font-family: "KaiTi", "FangSong";
	}
	
	/* 部分标题样式 */
	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
		padding: 0 30rpx 16rpx;
		border-bottom: 2rpx solid rgba(224, 201, 209, 0.5);
	}
	
	.section-title-decoration {
		width: 24rpx;
		height: 24rpx;
		margin: 0 10rpx;
	}
	
	.section-title {
		font-family: "FangSong", serif;
		font-size: 32rpx;
		color: var(--text-brown);
		font-weight: bold;
		position: relative;
	}
	
	.section-more {
		display: flex;
		align-items: center;
		font-size: 24rpx;
		color: var(--accent-gold);
	}
	
	.icon-arrow {
		width: 28rpx;
		height: 28rpx;
		margin-left: 6rpx;
	}
	
	/* 优惠活动样式 */
	.promo-section {
		margin-bottom: 30rpx;
		background-color: #FFFFFF;
		padding: 20rpx 0;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	}
	
	.promo-scroll {
		white-space: nowrap;
		padding: 0 30rpx;
	}
	
	.promo-item {
		display: inline-block;
		width: 250rpx;
		margin-right: 20rpx;
		background-color: #FFFFFF;
		border-radius: 12rpx;
		overflow: hidden;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
		position: relative;
	}
	
	.promo-image {
		width: 250rpx;
		height: 250rpx;
	}
	
	.promo-tag {
		position: absolute;
		top: 10rpx;
		right: 10rpx;
		background-color: var(--primary-red);
		color: #FFFFFF;
		font-size: 20rpx;
		padding: 4rpx 12rpx;
		border-radius: 20rpx;
	}
	
	.promo-info {
		padding: 10rpx;
	}
	
	.promo-title {
		font-size: 24rpx;
		color: var(--text-brown);
		display: block;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-family: "SimSun", serif;
	}
	
	.promo-price-row {
		display: flex;
		align-items: center;
		margin-top: 6rpx;
	}
	
	.promo-price {
		font-size: 28rpx;
		color: var(--primary-red);
		font-weight: bold;
	}
	
	.promo-original {
		font-size: 24rpx;
		color: #999;
		text-decoration: line-through;
		margin-left: 10rpx;
	}
	
	/* 商品列表样式 */
	.product-section {
		background-color: #FFFFFF;
		padding: 20rpx 0;
		margin-bottom: 30rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	}
	
	.product-grid {
		display: flex;
		flex-wrap: wrap;
		padding: 0 20rpx;
	}
	
	.product-item {
		width: calc(50% - 20rpx);
		margin: 10rpx;
		background-color: #FFFFFF;
		border-radius: 12rpx;
		overflow: hidden;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
		position: relative;
	}
	
	.product-image {
		width: 100%;
		height: 320rpx;
	}
	
	.product-info {
		padding: 16rpx;
	}
	
	.product-title {
		font-size: 28rpx;
		color: var(--text-brown);
		display: block;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-family: "KaiTi", "FangSong";
	}
	
	.product-shop {
		margin-top: 6rpx;
	}
	
	.shop-name {
		font-size: 24rpx;
		color: #999;
	}
	
	.product-price-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 10rpx;
	}
	
	.product-price {
		font-size: 30rpx;
		color: var(--primary-red);
		font-weight: bold;
	}
	
	.product-sales {
		font-size: 22rpx;
		color: #999;
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