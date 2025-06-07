<template>
	<view class="container">
		<!-- 使用自定义导航栏组件 -->
		<custom-nav-bar title="店铺详情" subtitle="店铺商品" :show-back="true"></custom-nav-bar>
		
		<!-- 添加明显的返回按钮 -->
		<view class="back-button" @click="goBack">
			<text class="back-arrow">←</text>
			<text class="back-text">返回</text>
		</view>
		
		<!-- 显示加载中状态 -->
		<view v-if="loading && !shop" class="loading-container">
			<view class="loading-spinner"></view>
			<text class="loading-text">加载中...</text>
		</view>
		
		<!-- 显示无数据状态 -->
		<view v-else-if="!shop" class="empty-container">
			<text class="empty-text">未找到店铺</text>
		</view>
		
		<!-- 店铺详情内容 -->
		<block v-else>
			<!-- 店铺信息 -->
			<view class="shop-info-card">
				<view class="shop-header">
					<image class="shop-logo" :src="shop.avatar || shop.logo || 'https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg'" mode="aspectFill"></image>
					<view class="shop-details">
						<view class="shop-name-row">
							<text class="shop-name">{{ shop.name }}</text>
							<view class="shop-badges">
								<text v-if="shop.isOfficial" class="shop-badge official">官方</text>
								<text v-if="shop.isNew" class="shop-badge new">新店</text>
							</view>
						</view>
						<view class="shop-rating">
							<text class="rating-score">{{ shop.rating || '5.0' }}</text>
							<view class="rating-stars">
								<text v-for="n in 5" :key="n" class="star" :class="{ active: n <= Math.floor(shop.rating || 5) }">★</text>
							</view>
							<text class="rating-count">{{ shop.ratingCount || 0 }}条评价</text>
						</view>
						<text class="shop-description">{{ shop.description || '暂无描述' }}</text>
					</view>
				</view>
			</view>
			
			<!-- 功能选项卡 -->
			<view class="shop-tabs">
				<view class="shop-tab-item" @click="goToShopReviews">
					<view class="tab-icon">🔍</view>
					<text class="tab-text">探店</text>
				</view>
				<view class="shop-tab-item" @click="showCoupons = true">
					<view class="tab-icon">🎟️</view>
					<text class="tab-text">优惠券</text>
					<view v-if="coupons.length > 0" class="tab-badge">{{coupons.length}}</view>
				</view>
				<view class="shop-tab-item active">
					<view class="tab-icon">🛍️</view>
					<text class="tab-text">商品</text>
				</view>
				<view class="shop-tab-item">
					<view class="tab-icon">🏪</view>
					<text class="tab-text">店铺</text>
				</view>
			</view>
			
			<!-- 优惠券弹窗 -->
			<view class="coupon-popup" v-if="showCoupons">
				<view class="coupon-popup-mask" @click="showCoupons = false"></view>
				<view class="coupon-popup-content">
					<view class="coupon-popup-header">
						<text class="coupon-popup-title">店铺优惠券</text>
						<text class="coupon-popup-close" @click="showCoupons = false">×</text>
					</view>
					
					<scroll-view scroll-y class="coupon-list">
						<view v-if="loadingCoupons" class="loading-container small">
							<view class="loading-spinner small"></view>
							<text class="loading-text">加载优惠券...</text>
						</view>
						
						<view v-else-if="coupons.length === 0" class="empty-container small">
							<text class="empty-text">暂无优惠券</text>
						</view>
						
						<view v-else class="coupon-items">
							<view 
								v-for="(coupon, index) in coupons" 
								:key="coupon.id || index" 
								class="coupon-item"
								:class="{'coupon-speedkill': coupon.type === 'SPEED_KILL', 'coupon-disabled': isCouponDisabled(coupon)}">
								<view class="coupon-left">
									<view class="coupon-value">
										<text class="coupon-currency" v-if="coupon.type !== 'DISCOUNT'">¥</text>
										<text class="coupon-amount">{{formatCouponValue(coupon)}}</text>
										<text class="coupon-unit" v-if="coupon.type === 'DISCOUNT'">折</text>
									</view>
									<text class="coupon-condition" v-if="coupon.minAmount && coupon.minAmount > 0">满{{coupon.minAmount}}元可用</text>
								</view>
								
								<view class="coupon-middle">
									<text class="coupon-name">{{coupon.name || '店铺优惠券'}}</text>
									<text class="coupon-desc">{{coupon.description || '购物可用'}}</text>
									<text class="coupon-time">{{formatCouponTime(coupon)}}</text>
									<text class="coupon-tag" v-if="coupon.type === 'SPEED_KILL'">秒杀</text>
									<text class="coupon-tag" v-else-if="coupon.type === 'DISCOUNT'">折扣券</text>
									<text class="coupon-tag" v-else>满减券</text>
								</view>
								
								<view class="coupon-right">
									<button 
										class="coupon-btn" 
										:disabled="isCouponDisabled(coupon) || coupon.userClaimed"
										@click="claimCoupon(coupon)">
										<text v-if="coupon.userClaimed">已领取</text>
										<text v-else-if="coupon.type === 'SPEED_KILL' && !isCouponDisabled(coupon)">立即抢</text>
										<text v-else-if="isCouponDisabled(coupon)">已结束</text>
										<text v-else>立即领</text>
									</button>
									<text class="coupon-limit" v-if="coupon.totalCount && coupon.totalCount > 0">剩余: {{coupon.totalCount - (coupon.usedCount || 0)}}</text>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
			
			<!-- 商品搜索 -->
			<view class="search-box">
				<view class="search-input-wrapper">
					<image src="https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg" class="search-icon"></image>
					<input class="search-input" type="text" v-model="searchText" placeholder="搜索店内商品" @confirm="searchProducts" />
				</view>
			</view>
			
			<!-- 左右布局区域 -->
			<view class="content-layout">
				<!-- 左侧分类列表 -->
				<scroll-view scroll-y class="category-sidebar">
					<view v-if="loadingCategories" class="loading-container small">
						<view class="loading-spinner small"></view>
						<text class="loading-text">加载分类...</text>
					</view>
					
					<view v-else-if="categories.length === 0" class="empty-container small">
						<text class="empty-text">暂无分类</text>
					</view>
					
					<view v-else class="category-list">
						<view 
							v-for="(category, index) in categories" 
							:key="category.id || index" 
							class="category-item" 
							:class="{ active: selectedCategoryId === category.id }"
							@click="selectCategory(category.id)">
							<text class="category-name">{{ category.name }}</text>
						</view>
					</view>
				</scroll-view>
				
				<!-- 右侧商品展示区 -->
				<scroll-view scroll-y class="product-area" @scrolltolower="loadMore">
					<!-- 商品列表 -->
					<view v-if="loadingProducts && products.length === 0" class="loading-container">
						<view class="loading-spinner"></view>
						<text class="loading-text">加载商品中...</text>
					</view>
					
					<view v-else-if="products.length === 0" class="empty-container">
						<text class="empty-text">暂无商品</text>
					</view>
					
					<view v-else class="products-grid">
						<view 
							class="product-card" 
							v-for="(product, index) in products" 
							:key="product.id || index" 
							@click="viewProductDetail(product.id)">
							<image 
								class="product-image" 
								:src="product.image || 'https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg'" 
								mode="aspectFill"></image>
							<view class="product-info">
								<text class="product-name">{{ product.name }}</text>
								<view class="product-price-row">
									<text class="product-price">¥{{ product.price || '0.00' }}</text>
									<text class="product-sold">已售{{ product.sales || 0 }}件</text>
								</view>
							</view>
							<!-- 添加商品按钮 -->
							<view @click.stop class="add-to-cart-wrapper">
								<view class="add-to-cart" @click.stop="addToCart(index)">
									<text class="add-icon">+</text>
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
						<text>没有更多商品了</text>
					</view>
				</scroll-view>
			</view>
			
			<!-- 购物车底部栏 -->
			<view class="cart-bar" v-if="cartItems.length > 0">
				<view class="cart-info">
					<view class="cart-icon-wrapper" @click="showCartDetail = !showCartDetail">
						<view class="cart-icon">🛒</view>
						<view class="cart-count">{{getTotalCount}}</view>
					</view>
					<view class="cart-total">
						<text class="total-label">合计:</text>
						<text class="total-price">¥{{getTotalPrice}}</text>
					</view>
				</view>
				<button class="checkout-btn" @click="checkout">去结算</button>
			</view>
			
			<!-- 购物车详情弹窗 -->
			<view class="cart-detail-popup" v-if="showCartDetail && cartItems.length > 0">
				<view class="cart-detail-content">
					<view class="cart-detail-header">
						<text class="cart-detail-title">购物车</text>
						<text class="cart-detail-clear" @click="clearCart">清空</text>
					</view>
					<scroll-view scroll-y class="cart-detail-list">
						<view class="cart-item" v-for="(item, index) in cartItems" :key="index">
							<image class="cart-item-image" :src="item.image || 'https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg'" mode="aspectFill"></image>
							<view class="cart-item-info">
								<text class="cart-item-name">{{item.name}}</text>
								<text class="cart-item-price">¥{{item.price}}</text>
							</view>
							<view class="cart-item-controls">
								<view class="quantity-btn minus" @click="decreaseQuantity(index)">-</view>
								<text class="quantity-text">{{item.quantity}}</text>
								<view class="quantity-btn plus" @click="increaseQuantity(index)">+</view>
							</view>
						</view>
					</scroll-view>
				</view>
				<view class="cart-detail-mask" @click="showCartDetail = false"></view>
			</view>
		</block>
		
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
				id: null,
				loading: false,
				loadingProducts: false,
				loadingCategories: false,
				loadingMore: false,
				loadingCoupons: false,
				shop: null,
				products: [],
				searchText: '',
				selectedCategoryId: null,
				currentPage: 1,
				pageSize: 10,
				totalItems: 0,
				categories: [],
				coupons: [],
				showCoupons: false,
				userId: 1, // 当前用户ID，实际应该从全局状态或本地存储获取
				cartItems: [], // 购物车商品
				showCartDetail: false, // 显示购物车详情
				_preventNavigation: false // 防止导航
			}
		},
		computed: {
			hasMore() {
				return this.products.length < this.totalItems;
			},
			// 计算购物车总价
			getTotalPrice() {
				let total = 0;
				this.cartItems.forEach(item => {
					total += item.price * item.quantity;
				});
				return total.toFixed(2);
			},
			// 计算购物车商品总数
			getTotalCount() {
				let count = 0;
				this.cartItems.forEach(item => {
					count += item.quantity;
				});
				return count;
			}
		},
		onLoad(options) {
			console.log('店铺详情页参数:', JSON.stringify(options));
			this.id = options.id;
			
			if (!this.id) {
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
			
			console.log('加载店铺ID:', this.id);
			this.loadShopDetails();
			this.loadProductCategories();
			this.loadProducts(true);
			this.loadShopCoupons();
		},
		methods: {
			// 加载店铺详情
			loadShopDetails() {
				this.loading = true;
				console.log('请求店铺详情API:', `${config.BaseUrl}/api/shop/${this.id}`);
				
				uni.request({
					url: `${config.BaseUrl}/api/shop/${this.id}`,
					method: 'GET',
					header: {
						'content-type': 'application/json'
					},
					success: (res) => {
						console.log('获取店铺详情成功:', JSON.stringify(res.data));
						if (res.data && res.data.code === 1) {
							const shopData = res.data.data;
							
							console.log('处理前的店铺数据:', JSON.stringify(shopData));
							
							// 添加isNew和isOfficial标识
							if (shopData) {
								// 如果创建时间在30天内，标记为新店
								if (shopData.createdTime) {
									const createDate = new Date(shopData.createdTime);
									const now = new Date();
									const diffTime = Math.abs(now - createDate);
									const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
									shopData.isNew = diffDays <= 30;
								}
								
								// 设置默认评分为5.0
								if (!shopData.rating) {
									shopData.rating = 5.0;
								}
								
								// 根据店铺类型标记是否为官方店铺
								shopData.isOfficial = shopData.type === 'official';
								
								console.log('处理后的店铺数据:', JSON.stringify(shopData));
							} else {
								console.error('返回的店铺数据为空');
							}
							
							this.shop = shopData;
						} else {
							console.error('获取店铺详情API返回错误:', JSON.stringify(res.data));
							uni.showToast({
								title: '获取店铺详情失败',
								icon: 'none'
							});
						}
					},
					fail: (err) => {
						console.error('店铺详情请求失败:', JSON.stringify(err));
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
			
			// 加载商品分类
			loadProductCategories() {
				this.loadingCategories = true;
				
				uni.request({
					url: `${config.BaseUrl}/api/shop/product/category/shop/${this.id}`,
					method: 'GET',
					header: {
						'content-type': 'application/json'
					},
					success: (res) => {
						console.log('获取商品分类成功:', JSON.stringify(res.data));
						if (res.data && res.data.code === 1) {
							const categoriesData = res.data.data || [];
							// 添加全部分类选项
							const allCategory = { id: null, name: '全部商品' };
							this.categories = [allCategory, ...categoriesData];
						} else {
							console.error('获取商品分类API返回错误:', JSON.stringify(res.data));
						}
					},
					fail: (err) => {
						console.error('获取商品分类请求失败:', JSON.stringify(err));
					},
					complete: () => {
						this.loadingCategories = false;
					}
				});
			},
			
			// 加载商品
			loadProducts(refresh = true) {
				if (refresh) {
					this.currentPage = 1;
					this.loadingProducts = true;
					this.products = [];
				} else {
					this.loadingMore = true;
				}
				
				// 构建查询参数
				const params = {
					shopId: this.id,
					current: this.currentPage,
					size: this.pageSize
				};
				
				// 如果有分类筛选
				if (this.selectedCategoryId) {
					params.categoryId = this.selectedCategoryId;
				}
				
				// 如果有搜索关键词
				if (this.searchText) {
					params.keyword = this.searchText;
				}
				
				console.log('请求商品列表参数:', params);
				
				uni.request({
					url: `${config.BaseUrl}/api/shop/product/page`,
					method: 'GET',
					data: params,
					header: {
						'content-type': 'application/json'
					},
					success: (res) => {
						console.log('获取商品成功:', JSON.stringify(res.data));
						if (res.data && res.data.code === 1) {
							const data = res.data.data;
							
							if (refresh) {
								this.products = data.records || [];
							} else {
								this.products = [...this.products, ...(data.records || [])];
							}
							
							this.totalItems = data.total;
							this.currentPage = data.current;
							
							console.log(`已加载${this.products.length}个商品，总共${this.totalItems}个`);
						} else {
							console.error('获取商品API返回错误:', JSON.stringify(res.data));
							uni.showToast({
								title: '获取商品失败',
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
						this.loadingProducts = false;
						this.loadingMore = false;
					}
				});
			},
			
			// 选择分类
			selectCategory(categoryId) {
				this.selectedCategoryId = categoryId;
				this.searchText = '';
				this.loadProducts(true);
			},
			
			// 搜索商品
			searchProducts() {
				this.loadProducts(true);
			},
			
			// 加载更多
			loadMore() {
				if (!this.loadingMore && this.hasMore) {
					this.currentPage++;
					this.loadProducts(false);
				}
			},
			
			// 查看商品详情
			viewProductDetail(id) {
				// 确保不是从添加购物车按钮触发的
				if (this._preventNavigation) {
					console.log('阻止商品详情页导航');
					this._preventNavigation = false;
					return;
				}
				
				if (!id) {
					uni.showToast({
						title: '商品ID无效',
						icon: 'none'
					});
					return;
				}
				
				uni.navigateTo({
					url: `/pages/mall/goods-detail?id=${id}`
				});
			},
			
			// 跳转到店铺探店页面
			goToShopReviews() {
				if (!this.id) {
					uni.showToast({
						title: '店铺ID无效',
						icon: 'none'
					});
					return;
				}
				
				console.log('跳转到店铺探店页面，店铺ID:', this.id);
				uni.navigateTo({
					url: `/pages/mall/shops/reviews?id=${this.id}&name=${encodeURIComponent(this.shop.name || '未命名店铺')}`,
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
						// If there's no page to go back to, navigate to mall index
						uni.navigateTo({
							url: '/pages/mall/index'
						});
					}
				});
			},
			
			// 加载店铺优惠券
			loadShopCoupons() {
				this.loadingCoupons = true;
				
				uni.request({
					url: `${config.BaseUrl}/api/coupon/page`,
					method: 'GET',
					data: {
						shopId: this.id,
						current: 1,
						size: 50
					},
					header: {
						'content-type': 'application/json'
					},
					success: (res) => {
						console.log('获取店铺优惠券成功:', JSON.stringify(res.data));
						if (res.data && res.data.code === 1) {
							const couponsData = res.data.data.records || [];
							
							// 检查用户是否已领取此优惠券
							this.checkUserCoupons(couponsData);
							
							this.coupons = couponsData;
						} else {
							console.error('获取店铺优惠券API返回错误:', JSON.stringify(res.data));
							uni.showToast({
								title: '获取店铺优惠券失败',
								icon: 'none'
							});
						}
					},
					fail: (err) => {
						console.error('获取店铺优惠券请求失败:', JSON.stringify(err));
						uni.showToast({
							title: '网络请求失败',
							icon: 'none'
						});
					},
					complete: () => {
						this.loadingCoupons = false;
					}
				});
			},
			
			// 检查用户是否已领取优惠券
			checkUserCoupons(coupons) {
				// 这里应调用后端接口检查用户已领取的优惠券
				// 实际项目中应该有相应的API
				// 这里简单模拟一下，随机标记一些优惠券为已领取
				return coupons.map(coupon => {
					// 确保每个优惠券对象有必要的属性
					coupon.userClaimed = Math.random() > 0.7;
					coupon.value = coupon.value || 0;
					coupon.discountValue = coupon.discountValue || 0;
					coupon.minAmount = coupon.minAmount || 0;
					coupon.totalCount = coupon.totalCount || 0;
					coupon.usedCount = coupon.usedCount || 0;
					return coupon;
				});
			},
			
			// 领取优惠券
			claimCoupon(coupon) {
				if (coupon.userClaimed || this.isCouponDisabled(coupon)) {
					return;
				}
				
				// 显示确认对话框
				uni.showModal({
					title: '领取优惠券',
					content: `确定要领取"${coupon.name || '店铺优惠券'}"吗？`,
					success: (res) => {
						if (res.confirm) {
							// 根据优惠券类型调用不同API
							if (coupon.type === 'SPEED_KILL') {
								this.speedKillCoupon(coupon);
							} else {
								this.normalClaimCoupon(coupon);
							}
						}
					}
				});
			},
			
			// 普通领取优惠券
			normalClaimCoupon(coupon) {
				uni.showLoading({
					title: '领取中...'
				});
				
				// 这里应调用相应的领取优惠券API
				// 模拟请求成功
				setTimeout(() => {
					uni.hideLoading();
					
					// 标记为已领取
					const index = this.coupons.findIndex(c => c.id === coupon.id);
					if (index !== -1) {
						this.$set(this.coupons[index], 'userClaimed', true);
						// 减少可用数量
						if (this.coupons[index].totalCount > 0) {
							this.$set(this.coupons[index], 'usedCount', (this.coupons[index].usedCount || 0) + 1);
						}
					}
					
					uni.showToast({
						title: '领取成功',
						icon: 'success'
					});
				}, 1000);
			},
			
			// 秒杀优惠券
			speedKillCoupon(coupon) {
				uni.showLoading({
					title: '抢购中...'
				});
				
				// 调用秒杀API
				uni.request({
					url: `${config.BaseUrl}/api/coupon/speedKill`,
					method: 'POST',
					data: {
						userId: this.userId,
						couponId: coupon.id
					},
					header: {
						'content-type': 'application/json'
					},
					success: (res) => {
						console.log('秒杀优惠券结果:', JSON.stringify(res.data));
						if (res.data && res.data.code === 1) {
							// 标记为已领取
							const index = this.coupons.findIndex(c => c.id === coupon.id);
							if (index !== -1) {
								this.$set(this.coupons[index], 'userClaimed', true);
								// 减少可用数量
								if (this.coupons[index].totalCount > 0) {
									this.$set(this.coupons[index], 'usedCount', (this.coupons[index].usedCount || 0) + 1);
								}
							}
							
							uni.showToast({
								title: '抢购成功',
								icon: 'success'
							});
						} else {
							uni.showToast({
								title: res.data.msg || '抢购失败',
								icon: 'none'
							});
						}
					},
					fail: (err) => {
						console.error('秒杀请求失败:', JSON.stringify(err));
						uni.showToast({
							title: '网络请求失败',
							icon: 'none'
						});
					},
					complete: () => {
						uni.hideLoading();
					}
				});
			},
			
			// 格式化优惠券值
			formatCouponValue(coupon) {
				if (!coupon) return '0';
				
				if (coupon.type === 'DISCOUNT') {
					// 折扣券，显示折扣值
					return coupon.discountValue ? (coupon.discountValue * 10).toFixed(1) : '0.0';
				} else {
					// 满减券和其他类型，显示减免金额
					return coupon.value ? coupon.value.toFixed(0) : '0';
				}
			},
			
			// 格式化优惠券有效期
			formatCouponTime(coupon) {
				if (!coupon) return '';
				
				const startTime = coupon.startTime ? new Date(coupon.startTime) : new Date();
				const endTime = coupon.endTime ? new Date(coupon.endTime) : null;
				
				if (!endTime) return '长期有效';
				
				const formatDate = (date) => {
					const year = date.getFullYear();
					const month = (date.getMonth() + 1).toString().padStart(2, '0');
					const day = date.getDate().toString().padStart(2, '0');
					return `${year}-${month}-${day}`;
				};
				
				return `${formatDate(startTime)} 至 ${formatDate(endTime)}`;
			},
			
			// 判断优惠券是否已过期或未开始
			isCouponDisabled(coupon) {
				if (!coupon) return true;
				
				const now = new Date();
				const startTime = coupon.startTime ? new Date(coupon.startTime) : null;
				const endTime = coupon.endTime ? new Date(coupon.endTime) : null;
				
				// 如果已经用完
				if (coupon.totalCount && coupon.totalCount > 0 && (coupon.usedCount || 0) >= coupon.totalCount) {
					return true;
				}
				
				// 检查时间
				if (startTime && now < startTime) {
					return true; // 未开始
				}
				
				if (endTime && now > endTime) {
					return true; // 已过期
				}
				
				return false;
			},
			
			// 添加商品到购物车
			addToCart(index) {
				// 设置标志防止导航
				this._preventNavigation = true;
				
				// 确保index有效
				if (typeof index !== 'number' || index < 0 || index >= this.products.length) {
					console.error('添加购物车错误: 商品索引无效', index);
					uni.showToast({
						title: '添加失败，商品索引无效',
						icon: 'none'
					});
					return;
				}
				
				// 获取产品对象
				const product = this.products[index];
				
				// 确保product对象存在
				if (!product || typeof product !== 'object') {
					console.error('添加购物车错误: 产品对象无效', product);
					uni.showToast({
						title: '添加失败，商品信息不完整',
						icon: 'none'
					});
					return;
				}
				
				// 检查商品ID是否存在
				if (!product.id) {
					console.error('添加购物车错误: 产品ID无效', product);
					uni.showToast({
						title: '添加失败，商品ID无效',
						icon: 'none'
					});
					return;
				}
				
				console.log('添加商品到购物车:', product.id, product.name);
				
				// 检查商品是否已在购物车中
				const existingItemIndex = this.cartItems.findIndex(item => item.id === product.id);
				
				if (existingItemIndex !== -1) {
					// 如果商品已存在，增加数量
					this.cartItems[existingItemIndex].quantity += 1;
				} else {
					// 如果商品不存在，添加到购物车
					this.cartItems.push({
						id: product.id,
						name: product.name || '未命名商品',
						price: product.price || 0,
						image: product.image || 'https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg',
						quantity: 1
					});
				}
				
				// 显示提示
				uni.showToast({
					title: '已添加到购物车',
					icon: 'success'
				});
				
				// 防止事件冒泡到父元素
				return false;
			},
			
			// 增加商品数量
			increaseQuantity(index) {
				this.cartItems[index].quantity += 1;
			},
			
			// 减少商品数量
			decreaseQuantity(index) {
				if (this.cartItems[index].quantity > 1) {
					this.cartItems[index].quantity -= 1;
				} else {
					// 如果数量为1，询问是否移除
					uni.showModal({
						title: '提示',
						content: '是否从购物车中移除该商品？',
						success: (res) => {
							if (res.confirm) {
								this.cartItems.splice(index, 1);
							}
						}
					});
				}
			},
			
			// 清空购物车
			clearCart() {
				uni.showModal({
					title: '提示',
					content: '确定要清空购物车吗？',
					success: (res) => {
						if (res.confirm) {
							this.cartItems = [];
							this.showCartDetail = false;
						}
					}
				});
			},
			
			// 结算
			checkout() {
				if (this.cartItems.length === 0) {
					uni.showToast({
						title: '购物车为空',
						icon: 'none'
					});
					return;
				}
				
				// 计算订单总金额
				const totalAmount = parseFloat(this.getTotalPrice);
				
				// 当前时间
				const currentTime = new Date().toISOString();
				
				// 构建符合后端API期望的订单格式
				const orderData = {
					order: {
						id: null,           // 显式设置ID为null，让后端生成
						userId: this.userId || 1,
						shopId: this.id || 1,
						couponId: null,     // null表示不使用优惠券
						totalAmount: totalAmount || 0,
						payAmount: totalAmount || 0,
						status: 1,          // 1表示待支付
						createTime: currentTime,
						payTime: null,      // 支付时间为空
						cancelTime: null    // 取消时间为空
					},
					orderItems: this.cartItems.map(item => ({
						id: null,           // 显式设置ID为null，让后端生成
						orderId: null,      // 订单ID为空，由后端关联
						shopId: this.id || 1,
						productId: item.id,
						productName: item.name || "未命名商品",
						quantity: item.quantity || 1,
						price: parseFloat(item.price) || 0,
						totalPrice: parseFloat((item.price * item.quantity).toFixed(2)) || 0
					}))
				};
				
				console.log('提交订单:', JSON.stringify(orderData));
				
				// 显示加载中
				uni.showLoading({
					title: '提交订单中...'
				});
				
				// 调用订单创建API
				uni.request({
					url: `${config.BaseUrl}/api/shop/order/create`,
					method: 'POST',
					data: orderData,
					header: {
						'content-type': 'application/json',
						...config.getAuthHeader()
					},
					success: (res) => {
						console.log('创建订单结果:', JSON.stringify(res.data));
						if (res.data && res.data.code === 1) {
							const orderResult = res.data.data;
							
							// 清空购物车
							this.cartItems = [];
							this.showCartDetail = false;
							
							// 提示成功
							uni.showToast({
								title: '订单创建成功',
								icon: 'success'
							});
							
							// 跳转到订单详情页面
							setTimeout(() => {
								const orderId = orderResult && (orderResult.id || orderResult.orderId);
								if (orderId) {
									console.log('正在跳转到订单详情页面, orderId:', orderId);
									
									// 尝试使用新路径导航
									uni.navigateTo({
										url: `/pages/order/detail?id=${orderId}`,
										success: () => {
											console.log('成功导航到订单详情页面');
										},
										fail: (err) => {
											console.error('导航到订单详情页面失败:', err);
											
											// 尝试备用路径
											uni.navigateTo({
												url: `/pages/mall/order/detail?id=${orderId}`,
												fail: (backupErr) => {
													console.error('导航到备用订单详情页面也失败:', backupErr);
													
													// 如果都失败了，至少显示成功提示
													uni.showToast({
														title: '订单创建成功',
														icon: 'success',
														duration: 2000
													});
													
													// 将订单ID复制到剪贴板
													uni.setClipboardData({
														data: orderId.toString(),
														success: () => {
															setTimeout(() => {
																uni.showToast({
																	title: '订单号已复制',
																	icon: 'none'
																});
															}, 2000);
														}
													});
												}
											});
										}
									});
								} else {
									console.error('未返回订单ID:', orderResult);
									uni.showToast({
										title: '订单创建成功，但无法查看详情',
										icon: 'none'
									});
								}
							}, 1500);
						} else {
							console.error('订单创建失败:', res.data);
							uni.showToast({
								title: res.data?.msg || '创建订单失败',
								icon: 'none'
							});
						}
					},
					fail: (err) => {
						console.error('创建订单请求失败:', JSON.stringify(err));
						uni.showToast({
							title: '网络请求失败',
							icon: 'none'
						});
					},
					complete: () => {
						uni.hideLoading();
					}
				});
			}
		},
		// 下拉刷新
		onPullDownRefresh() {
			Promise.all([
				this.loadShopDetails(),
				this.loadProductCategories(),
				this.loadProducts(true)
			]).finally(() => {
				uni.stopPullDownRefresh();
			});
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
	
	/* 加载状态 */
	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 60rpx 0;
	}
	
	.loading-container.small {
		padding: 30rpx 0;
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
	
	.empty-container.small {
		padding: 40rpx 0;
	}
	
	.empty-text {
		font-size: 28rpx;
		color: #999;
	}
	
	/* 店铺信息 */
	.shop-info-card {
		margin: 30rpx;
		background-color: #fff;
		border-radius: 15rpx;
		padding: 30rpx;
		box-shadow: 0 4rpx 8rpx rgba(0,0,0,0.05);
		border: 1rpx solid #e0c9d1;
	}
	
	.shop-header {
		display: flex;
	}
	
	.shop-logo {
		width: 120rpx;
		height: 120rpx;
		border-radius: 15rpx;
		margin-right: 20rpx;
		border: 1rpx solid #f0f0f0;
	}
	
	.shop-details {
		flex: 1;
	}
	
	.shop-name-row {
		display: flex;
		align-items: center;
		margin-bottom: 10rpx;
	}
	
	.shop-name {
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
		font-family: "FangSong", serif;
		margin-right: 10rpx;
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
	
	.shop-rating {
		display: flex;
		align-items: center;
		margin-bottom: 10rpx;
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
	
	.shop-description {
		font-size: 24rpx;
		color: #666;
		line-height: 1.5;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}
	
	/* 搜索框 */
	.search-box {
		padding: 0 30rpx 20rpx;
	}
	
	.search-input-wrapper {
		display: flex;
		align-items: center;
		background: #fff;
		border-radius: 30rpx;
		padding: 0 20rpx;
		border: 1rpx solid #e0c9d1;
		box-shadow: 0 2rpx 6rpx rgba(0,0,0,0.05);
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
	
	/* 左右布局区域 */
	.content-layout {
		display: flex;
		height: calc(100vh - 480rpx); /* 调整高度以适应新的顶部布局 */
		margin: 0 30rpx 30rpx;
	}
	
	/* 左侧分类侧边栏 */
	.category-sidebar {
		width: 200rpx;
		background-color: #fff;
		border-radius: 15rpx 0 0 15rpx;
		box-shadow: 0 4rpx 8rpx rgba(0,0,0,0.05);
		border: 1rpx solid #e0c9d1;
		border-right: none;
	}
	
	.category-list {
		display: flex;
		flex-direction: column;
	}
	
	.category-item {
		padding: 30rpx 20rpx;
		text-align: center;
		border-bottom: 1rpx solid #f0f0f0;
	}
	
	.category-item.active {
		background-color: rgba(138, 51, 36, 0.1);
		border-left: 4rpx solid #8A3324;
	}
	
	.category-name {
		font-size: 26rpx;
		color: #666;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	
	.category-item.active .category-name {
		color: #8A3324;
		font-weight: bold;
	}
	
	/* 右侧商品区域 */
	.product-area {
		flex: 1;
		background-color: #fff;
		border-radius: 0 15rpx 15rpx 0;
		box-shadow: 0 4rpx 8rpx rgba(0,0,0,0.05);
		border: 1rpx solid #e0c9d1;
		padding: 20rpx;
	}
	
	/* 商品列表 */
	.products-grid {
		display: flex;
		flex-wrap: wrap;
		margin: 0 -10rpx;
	}
	
	.product-card {
		width: calc(100% - 20rpx);
		margin: 10rpx;
		background-color: #fff;
		border-radius: 10rpx;
		overflow: hidden;
		box-shadow: 0 2rpx 6rpx rgba(0,0,0,0.05);
		border: 1rpx solid #f0f0f0;
		position: relative;
		display: flex;
		flex-direction: row;
		padding: 15rpx;
		height: 180rpx;
	}
	
	.product-image {
		width: 150rpx;
		height: 150rpx;
		border-radius: 8rpx;
		flex-shrink: 0;
	}
	
	.product-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 0 15rpx;
		overflow: hidden;
	}
	
	.product-name {
		font-size: 28rpx;
		color: #333;
		font-weight: bold;
		margin-bottom: 10rpx;
		font-family: "FangSong", serif;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}
	
	.product-price-row {
		display: flex;
		flex-direction: column;
	}
	
	.product-price {
		font-size: 32rpx;
		color: #FF5722;
		font-weight: bold;
		margin-bottom: 6rpx;
	}
	
	.product-sold {
		font-size: 22rpx;
		color: #999;
	}
	
	.load-more, .no-more {
		text-align: center;
		padding: 30rpx 0;
		font-size: 26rpx;
		color: #999;
	}
	
	/* 店铺操作按钮 */
	.shop-actions {
		display: none;
	}
	
	.explore-btn, .coupon-btn {
		display: none;
	}
	
	/* 店铺操作按钮 - 移除此部分 */
	.shop-actions {
		display: none;
	}
	
	.explore-btn, .coupon-btn {
		display: none;
	}
	
	/* 店铺信息 */
	.shop-info-card {
		margin: 30rpx;
		background-color: #fff;
		border-radius: 15rpx;
		padding: 30rpx;
		box-shadow: 0 4rpx 8rpx rgba(0,0,0,0.05);
		border: 1rpx solid #e0c9d1;
	}
	
	/* 功能选项卡 */
	.shop-tabs {
		display: flex;
		justify-content: space-around;
		background: #fff;
		margin: 0 30rpx 30rpx;
		padding: 20rpx 0;
		border-radius: 15rpx;
		box-shadow: 0 4rpx 8rpx rgba(0,0,0,0.05);
		border: 1rpx solid #e0c9d1;
	}
	
	.shop-tab-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		padding: 15rpx 0;
		flex: 1;
	}
	
	.shop-tab-item.active {
		color: #8A3324;
		font-weight: bold;
	}
	
	.shop-tab-item.active::after {
		content: '';
		position: absolute;
		bottom: -10rpx;
		left: 30%;
		width: 40%;
		height: 6rpx;
		background-color: #8A3324;
		border-radius: 3rpx;
	}
	
	.tab-icon {
		font-size: 40rpx;
		margin-bottom: 10rpx;
	}
	
	.tab-text {
		font-size: 24rpx;
		font-family: "FangSong", serif;
	}
	
	.tab-badge {
		position: absolute;
		top: 0;
		right: 20%;
		background-color: #FF5722;
		color: white;
		font-size: 20rpx;
		width: 32rpx;
		height: 32rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	/* 优惠券弹窗 */
	.coupon-popup {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1000;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.coupon-popup-mask {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
	}
	
	.coupon-popup-content {
		position: relative;
		width: 92%;
		max-height: 85%;
		background-color: #fff;
		border-radius: 20rpx;
		overflow: hidden;
		z-index: 1001;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: column;
	}
	
	.coupon-popup-header {
		padding: 30rpx;
		background: linear-gradient(135deg, #8A3324, #7EC4CF);
		color: white;
		border-bottom: 1rpx solid #f0f0f0;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.coupon-popup-title {
		font-size: 32rpx;
		font-weight: bold;
		color: white;
		font-family: "FangSong", serif;
	}
	
	.coupon-popup-close {
		font-size: 40rpx;
		color: white;
		padding: 10rpx;
	}
	
	.coupon-list {
		flex: 1;
		max-height: 800rpx;
	}
	
	.coupon-items {
		padding: 20rpx;
	}
	
	/* 优惠券样式 */
	.coupon-item {
		display: flex;
		margin-bottom: 20rpx;
		height: 200rpx;
		background: linear-gradient(90deg, #FFF8F3, #FFF);
		border-radius: 10rpx;
		overflow: hidden;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
		position: relative;
	}
	
	.coupon-item::before {
		content: '';
		position: absolute;
		left: 25%;
		top: -8rpx;
		width: 16rpx;
		height: 16rpx;
		border-radius: 50%;
		background-color: #F8F7F2;
	}
	
	.coupon-item::after {
		content: '';
		position: absolute;
		left: 25%;
		bottom: -8rpx;
		width: 16rpx;
		height: 16rpx;
		border-radius: 50%;
		background-color: #F8F7F2;
	}
	
	.coupon-left {
		width: 25%;
		background-color: #8A3324;
		color: #FFF;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 0 10rpx;
		position: relative;
	}
	
	.coupon-left::before {
		content: '';
		position: absolute;
		right: -10rpx;
		top: 20rpx;
		bottom: 20rpx;
		width: 1rpx;
		background: repeating-linear-gradient(to bottom, #FFF, #FFF 6rpx, transparent 6rpx, transparent 12rpx);
	}
	
	.coupon-value {
		display: flex;
		align-items: baseline;
	}
	
	.coupon-currency {
		font-size: 28rpx;
	}
	
	.coupon-amount {
		font-size: 50rpx;
		font-weight: bold;
		line-height: 1;
	}
	
	.coupon-unit {
		font-size: 24rpx;
		margin-left: 4rpx;
	}
	
	.coupon-condition {
		font-size: 20rpx;
		margin-top: 10rpx;
		text-align: center;
		opacity: 0.8;
	}
	
	.coupon-middle {
		flex: 1;
		padding: 20rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		position: relative;
	}
	
	.coupon-name {
		font-size: 30rpx;
		color: #333;
		font-weight: bold;
		margin-bottom: 10rpx;
		font-family: "FangSong", serif;
	}
	
	.coupon-desc {
		font-size: 24rpx;
		color: #666;
		margin-bottom: 10rpx;
	}
	
	.coupon-time {
		font-size: 22rpx;
		color: #999;
	}
	
	.coupon-tag {
		position: absolute;
		top: 20rpx;
		right: 20rpx;
		font-size: 20rpx;
		color: #8A3324;
		border: 1rpx solid #8A3324;
		padding: 2rpx 10rpx;
		border-radius: 20rpx;
		background-color: rgba(138, 51, 36, 0.05);
	}
	
	.coupon-right {
		width: 25%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 0 10rpx;
	}
	
	.coupon-btn {
		background-color: #8A3324;
		color: #FFF;
		font-size: 24rpx;
		width: 120rpx;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		border-radius: 30rpx;
		margin-bottom: 10rpx;
	}
	
	.coupon-btn[disabled] {
		background-color: #ccc;
		color: #fff;
	}
	
	.coupon-limit {
		font-size: 20rpx;
		color: #999;
	}
	
	/* 秒杀优惠券样式 */
	.coupon-speedkill .coupon-left {
		background-color: #FF5722;
	}
	
	.coupon-speedkill .coupon-tag {
		color: #FF5722;
		border-color: #FF5722;
		background-color: rgba(255, 87, 34, 0.05);
	}
	
	.coupon-speedkill .coupon-btn {
		background-color: #FF5722;
		animation: pulse 1.5s infinite;
	}
	
	@keyframes pulse {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.05);
		}
		100% {
			transform: scale(1);
		}
	}
	
	/* 禁用优惠券样式 */
	.coupon-disabled {
		opacity: 0.6;
	}
	
	.coupon-disabled .coupon-left {
		background-color: #999;
	}
	
	/* 添加商品按钮 */
	.add-to-cart-wrapper {
		position: absolute;
		right: 15rpx;
		bottom: 15rpx;
		z-index: 10;
	}
	
	.add-to-cart {
		width: 50rpx;
		height: 50rpx;
		border-radius: 25rpx;
		background-color: #8A3324;
		color: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
		box-shadow: 0 2rpx 6rpx rgba(0,0,0,0.2);
	}
	
	.add-icon {
		font-size: 30rpx;
		font-weight: bold;
	}
	
	/* 购物车底部栏 */
	.cart-bar {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 100rpx;
		background-color: #fff;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 30rpx;
		box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05);
		z-index: 100;
	}
	
	.cart-info {
		display: flex;
		align-items: center;
	}
	
	.cart-icon-wrapper {
		position: relative;
		margin-right: 20rpx;
	}
	
	.cart-icon {
		font-size: 50rpx;
	}
	
	.cart-count {
		position: absolute;
		top: -10rpx;
		right: -10rpx;
		background-color: #FF5722;
		color: white;
		font-size: 20rpx;
		min-width: 32rpx;
		height: 32rpx;
		border-radius: 16rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0 6rpx;
	}
	
	.cart-total {
		display: flex;
		align-items: baseline;
	}
	
	.total-label {
		font-size: 28rpx;
		color: #666;
		margin-right: 10rpx;
	}
	
	.total-price {
		font-size: 36rpx;
		font-weight: bold;
		color: #FF5722;
	}
	
	.checkout-btn {
		background-color: #8A3324;
		color: white;
		font-size: 28rpx;
		padding: 0 40rpx;
		height: 70rpx;
		line-height: 70rpx;
		border-radius: 35rpx;
		font-family: "FangSong", serif;
	}
	
	/* 购物车详情弹窗 */
	.cart-detail-popup {
		position: fixed;
		bottom: 100rpx;
		left: 0;
		width: 100%;
		height: calc(100% - 100rpx);
		z-index: 99;
	}
	
	.cart-detail-mask {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
	}
	
	.cart-detail-content {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		max-height: 70%;
		background-color: #fff;
		border-radius: 20rpx 20rpx 0 0;
		overflow: hidden;
		z-index: 100;
		box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.1);
	}
	
	.cart-detail-header {
		padding: 30rpx;
		border-bottom: 1rpx solid #f0f0f0;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.cart-detail-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		font-family: "FangSong", serif;
	}
	
	.cart-detail-clear {
		font-size: 26rpx;
		color: #999;
		padding: 6rpx 16rpx;
		border: 1rpx solid #eee;
		border-radius: 30rpx;
	}
	
	.cart-detail-list {
		max-height: 600rpx;
		padding: 20rpx;
	}
	
	.cart-item {
		display: flex;
		align-items: center;
		padding: 20rpx;
		border-bottom: 1rpx solid #f5f5f5;
	}
	
	.cart-item-image {
		width: 120rpx;
		height: 120rpx;
		border-radius: 10rpx;
		margin-right: 20rpx;
	}
	
	.cart-item-info {
		flex: 1;
	}
	
	.cart-item-name {
		font-size: 28rpx;
		color: #333;
		margin-bottom: 10rpx;
		font-family: "FangSong", serif;
	}
	
	.cart-item-price {
		font-size: 32rpx;
		color: #FF5722;
		font-weight: bold;
	}
	
	.cart-item-controls {
		display: flex;
		align-items: center;
	}
	
	.quantity-btn {
		width: 50rpx;
		height: 50rpx;
		border-radius: 25rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 28rpx;
		font-weight: bold;
	}
	
	.quantity-btn.minus {
		background-color: #f5f5f5;
		color: #666;
	}
	
	.quantity-btn.plus {
		background-color: #8A3324;
		color: white;
	}
	
	.quantity-text {
		width: 60rpx;
		text-align: center;
		font-size: 28rpx;
	}
</style> 