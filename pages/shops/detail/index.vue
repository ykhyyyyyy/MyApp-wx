<template>
	<view class="container">
		<!-- 使用自定义导航栏，设置showBack为true -->
		<custom-nav-bar title="店铺详情" subtitle="Shop Detail" :show-back="true"></custom-nav-bar>
		
		<view class="shop-detail">
			<!-- 店铺头部信息 -->
			<view class="shop-header">
				<image class="shop-banner" :src="shop.banner" mode="aspectFill"></image>
				<view class="shop-info-box">
					<image class="shop-logo" :src="shop.logo" mode="aspectFill"></image>
					<view class="shop-info">
						<text class="shop-name">{{shop.name}}</text>
						<view class="shop-rating">
							<text class="rating-score">{{shop.rating}}</text>
							<view class="rating-stars">
								<text v-for="n in 5" :key="n" class="star" :class="{ active: n <= Math.floor(shop.rating) }">★</text>
							</view>
							<text class="rating-count">{{shop.ratingCount}}条评价</text>
						</view>
						<view class="shop-badges">
							<text v-if="shop.isOfficial" class="badge official">官方认证</text>
							<text v-if="shop.isRecommended" class="badge recommended">推荐店铺</text>
						</view>
					</view>
				</view>
				
				<view class="shop-action-bar">
					<view class="action-item" @click="followShop">
						<image class="action-icon" :src="shop.followed ? '/static/icons/heart-filled.png' : '/static/icons/heart.png'"></image>
						<text>{{shop.followed ? '已关注' : '关注'}}</text>
					</view>
					<view class="action-item" @click="shareShop">
						<image class="action-icon" src="/static/icons/share.png"></image>
						<text>分享</text>
					</view>
				</view>
			</view>
			
			<!-- 店铺介绍 -->
			<view class="shop-section">
				<view class="section-header">
					<image class="section-title-decoration" src="/static/decoration/title-left.png" mode="aspectFit"></image>
					<text class="section-title">店铺介绍</text>
					<image class="section-title-decoration" src="/static/decoration/title-right.png" mode="aspectFit"></image>
				</view>
				<text class="shop-description">{{shop.description}}</text>
			</view>
			
			<!-- 商品列表 -->
			<view class="shop-section">
				<view class="section-header">
					<image class="section-title-decoration" src="/static/decoration/title-left.png" mode="aspectFit"></image>
					<text class="section-title">精选商品</text>
					<image class="section-title-decoration" src="/static/decoration/title-right.png" mode="aspectFit"></image>
				</view>
				
				<view class="product-list">
					<view class="product-card" v-for="(product, index) in shop.products" :key="index" @click="viewProduct(product)">
						<image class="product-image" :src="product.image" mode="aspectFill"></image>
						<text class="product-name">{{product.name}}</text>
						<text class="product-price">¥{{product.price}}</text>
					</view>
				</view>
				
				<view class="more-btn-container">
					<button class="more-btn" @click="viewAllProducts">查看全部商品</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import CustomNavBar from '@/components/CustomNavBar.vue';

export default {
	components: {
		CustomNavBar
	},
	data() {
		return {
			shopId: '',
			shop: {
				name: '古韵斋茶艺馆',
				logo: 'https://ykhyyy.oss-cn-beijing.aliyuncs.com/MyApp/userAvatar/default-avatar.png',
				banner: 'https://ykhyyy.oss-cn-beijing.aliyuncs.com/MyApp/userAvatar/default-avatar.png',
				rating: 4.8,
				ratingCount: 256,
				isOfficial: true,
				isRecommended: true,
				followed: false,
				description: '古韵斋成立于2008年，专注于传统中国茶文化的传承与推广，提供优质的茶叶与茶具，并定期举办茶艺表演和茶文化讲座。店内环境古色古香，处处彰显中国传统文化的魅力。',
				products: [
					{
						id: '1',
						name: '特级龙井茶',
						image: 'https://ykhyyy.oss-cn-beijing.aliyuncs.com/MyApp/userAvatar/default-avatar.png',
						price: '198.00'
					},
					{
						id: '2',
						name: '紫砂壶套装',
						image: 'https://ykhyyy.oss-cn-beijing.aliyuncs.com/MyApp/userAvatar/default-avatar.png',
						price: '388.00'
					},
					{
						id: '3',
						name: '大红袍茶叶',
						image: 'https://ykhyyy.oss-cn-beijing.aliyuncs.com/MyApp/userAvatar/default-avatar.png',
						price: '268.00'
					},
					{
						id: '4',
						name: '青花瓷茶具套装',
						image: 'https://ykhyyy.oss-cn-beijing.aliyuncs.com/MyApp/userAvatar/default-avatar.png',
						price: '499.00'
					}
				]
			}
		};
	},
	onLoad(options) {
		if (options.id) {
			this.shopId = options.id;
			this.loadShopDetails();
		}
	},
	methods: {
		// 加载店铺详情
		loadShopDetails() {
			// 实际应用中应该从API获取数据
			console.log(`Loading shop details for ID: ${this.shopId}`);
			// 这里使用的是示例数据，实际情况应该调用API获取
		},
		
		// 关注/取消关注店铺
		followShop() {
			this.shop.followed = !this.shop.followed;
			
			uni.showToast({
				title: this.shop.followed ? '已关注店铺' : '已取消关注',
				icon: 'success'
			});
		},
		
		// 分享店铺
		shareShop() {
			uni.showShareMenu({
				withShareTicket: true,
				menus: ['shareAppMessage', 'shareTimeline']
			});
		},
		
		// 查看商品详情
		viewProduct(product) {
			uni.navigateTo({
				url: `/pages/product/detail/index?id=${product.id}`
			});
		},
		
		// 查看全部商品
		viewAllProducts() {
			uni.navigateTo({
				url: `/pages/shops/products/index?id=${this.shopId}`
			});
		}
	}
}
</script>

<style>
.container {
	background-color: #F8F7F2;
	min-height: 100vh;
	background-image: url('/static/decoration/paper-texture.png');
	background-repeat: repeat;
}

.shop-detail {
	padding-bottom: 30rpx;
}

.shop-header {
	background-color: #FFFFFF;
	border-bottom: 1rpx solid rgba(224, 201, 209, 0.3);
	margin-bottom: 20rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.shop-banner {
	width: 100%;
	height: 300rpx;
}

.shop-info-box {
	display: flex;
	padding: 20rpx 30rpx;
	position: relative;
	margin-top: -50rpx;
}

.shop-logo {
	width: 120rpx;
	height: 120rpx;
	border-radius: 60rpx;
	border: 4rpx solid #FFFFFF;
	background-color: #FFFFFF;
	margin-right: 20rpx;
}

.shop-info {
	flex: 1;
	padding-top: 20rpx;
}

.shop-name {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 10rpx;
	font-family: "FangSong", serif;
}

.shop-rating {
	display: flex;
	align-items: center;
	margin-bottom: 10rpx;
}

.rating-score {
	font-size: 28rpx;
	color: #FF9500;
	font-weight: bold;
	margin-right: 10rpx;
}

.rating-stars {
	display: flex;
	margin-right: 10rpx;
}

.star {
	color: #DDDDDD;
	font-size: 28rpx;
}

.star.active {
	color: #FF9500;
}

.rating-count {
	font-size: 24rpx;
	color: #999;
}

.shop-badges {
	display: flex;
	margin-top: 10rpx;
}

.badge {
	font-size: 22rpx;
	padding: 4rpx 12rpx;
	border-radius: 4rpx;
	margin-right: 10rpx;
}

.badge.official {
	background-color: rgba(126, 196, 207, 0.1);
	color: #7EC4CF;
	border: 1rpx solid #7EC4CF;
}

.badge.recommended {
	background-color: rgba(138, 51, 36, 0.1);
	color: #8A3324;
	border: 1rpx solid #8A3324;
}

.shop-action-bar {
	display: flex;
	padding: 20rpx 0;
	border-top: 1rpx solid #F0F0F0;
}

.action-item {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.action-icon {
	width: 40rpx;
	height: 40rpx;
	margin-bottom: 10rpx;
}

.action-item text {
	font-size: 24rpx;
	color: #666;
}

.shop-section {
	background-color: #FFFFFF;
	margin: 0 20rpx 20rpx;
	border-radius: 10rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	border: 1rpx solid rgba(224, 201, 209, 0.3);
}

.section-header {
	display: flex;
	justify-content: center;
	align-items: center;
	margin-bottom: 20rpx;
	border-bottom: 1rpx solid #F0F0F0;
	padding-bottom: 16rpx;
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
	letter-spacing: 4rpx;
}

.shop-description {
	font-size: 28rpx;
	color: #666;
	line-height: 1.6;
	text-indent: 2em;
	font-family: "SimSun", serif;
}

.product-list {
	display: flex;
	flex-wrap: wrap;
	margin: 0 -10rpx;
}

.product-card {
	width: calc(50% - 20rpx);
	margin: 10rpx;
	background-color: #FFFFFF;
	border-radius: 8rpx;
	overflow: hidden;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
	border: 1rpx solid rgba(224, 201, 209, 0.2);
}

.product-image {
	width: 100%;
	height: 240rpx;
}

.product-name {
	font-size: 28rpx;
	color: #333;
	padding: 10rpx 15rpx;
	font-family: "FangSong", serif;
}

.product-price {
	font-size: 30rpx;
	color: #8A3324;
	font-weight: bold;
	padding: 0 15rpx 15rpx;
}

.more-btn-container {
	text-align: center;
	margin-top: 30rpx;
}

.more-btn {
	background-color: transparent;
	color: #7EC4CF;
	font-size: 28rpx;
	border: 1rpx solid #7EC4CF;
	border-radius: 30rpx;
	width: 60%;
	font-family: "KaiTi", "FangSong";
}
</style> 