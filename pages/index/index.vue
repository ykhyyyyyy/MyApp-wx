<template>
	<view class="container">
		<!-- Use the custom navigation bar component with back button disabled -->
		<custom-nav-bar title="校园益友" subtitle="Campus Friend" :show-back="false"></custom-nav-bar>

		<!-- Header with Chinese-style design -->
		<view class="header">
			<view class="search-box">
				<view class="search-input-wrapper">
					<image src="/static/icons/search.png" class="search-icon"></image>
					<input class="search-input" type="text" placeholder="搜索帖子、店铺或商品" />
				</view>
			</view>
		</view>
		
		<!-- Banner carousel with scroll decoration -->
		<view class="banner-wrapper">
			<image class="scroll-left" src="/static/decoration/scroll-left.png" mode="aspectFit"></image>
			<swiper class="banner" circular autoplay interval="3000" indicator-dots>
				<swiper-item v-for="(item, index) in bannerList" :key="index">
					<image :src="item.image" mode="aspectFill" style="width:100%;height:100%"></image>
				</swiper-item>
			</swiper>
			<image class="scroll-right" src="/static/decoration/scroll-right.png" mode="aspectFit"></image>
		</view>
		
		<!-- Quick access icons 添加云纹背景 -->
		<view class="quick-access">
			<image class="cloud-pattern" src="/static/decoration/cloud-pattern.png" mode="aspectFill"></image>
			<view class="quick-item" v-for="(item, index) in quickAccessList" :key="index" @click="navigateTo(item.path)">
				<image :src="item.icon" mode="aspectFit" class="quick-item-icon"></image>
				<text class="quick-item-text">{{item.name}}</text>
			</view>
		</view>
		
		<!-- Post section -->
		<view class="section post-section">
			<!-- 添加装饰标题 -->
			<view class="section-header">
				<image class="section-title-decoration" src="/static/decoration/title-left.png" mode="aspectFit"></image>
				<text class="section-title">热门帖子</text>
				<image class="section-title-decoration" src="/static/decoration/title-right.png" mode="aspectFit"></image>
				<view class="section-more" @click="navigateTo('./forum/index')">
					<text>查看更多</text>
					<image src="/static/icons/arrow-right.png" class="icon-arrow"></image>
				</view>
			</view>
			
			<!-- Post list -->
			<view class="post-list">
				<view v-if="hotPosts.length === 0" class="empty-posts">
					<text>暂无热门帖子</text>
				</view>
				<view class="post-item" v-for="(post, index) in debugHotPosts" :key="post.id || index" @click="post && post.id ? viewPostDetail(post.id) : null">
					<view class="post-header">
						<view class="post-user">
							<image :src="post.avatar || '/static/images/default-avatar.png'" class="post-avatar"></image>
							<text class="post-username">{{post.username || '匿名用户'}}</text>
						</view>
						<text class="post-time">{{formatDate(post.createTime)}}</text>
					</view>
					<text class="post-title">{{post.title || '无标题'}}</text>
					<text class="post-content">{{post.content || '无内容'}}</text>
					<view class="post-images" v-if="post.images && post.images.length">
						<image 
							v-for="(img, imgIndex) in post.images.split(',')" 
							:key="imgIndex" 
							:src="img" 
							mode="aspectFill" 
							class="post-image"
						></image>
					</view>
					<view class="post-footer">
						<view class="post-action">
							<image src="/static/icons/eye.png" class="icon-action"></image>
							<text>{{post.views || 0}}</text>
						</view>
						<view class="post-action">
							<image src="/static/icons/comment.png" class="icon-action"></image>
							<text>{{post.comments || 0}}</text>
						</view>
						<view class="post-action">
							<image src="/static/icons/like.png" class="icon-action"></image>
							<text>{{post.likes || 0}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 页脚装饰元素 -->
		<view class="footer-decoration">
			<image src="/static/decoration/footer-pattern.png" mode="aspectFit" class="footer-image"></image>
		</view>
		
		<!-- AI助手组件 -->
		<ai-assistant></ai-assistant>
	</view>
</template>

<script>
import AiAssistant from '@/components/AiAssistant.vue';
import CustomNavBar from '@/components/CustomNavBar.vue';
import { mapState, mapMutations, mapActions } from 'vuex';
import config from '@/config/index.js';

export default {
	components: {
		AiAssistant,
		CustomNavBar
	},
	data() {
		return {
			title: '校园益友',
			loading: false
		}
	},
	computed: {
		...mapState(['bannerList', 'quickAccessList', 'shopList']),
		...mapState('post', ['hotPosts']),
		userInfo() {
			return this.$store.state.user.userInfo;
		},
		debugHotPosts() {
			console.log('Hot posts in computed:', this.hotPosts);
			return this.hotPosts;
		}
	},
	onLoad() {
		// 检查登录状态
		this.checkLoginStatus();
	},
	methods: {
		...mapMutations({
			setUserInfo: 'user/SET_USER_INFO',
			setToken: 'user/SET_TOKEN'
		}),
		...mapActions('post', ['getHotPosts']),
		
		// 检查登录状态
		checkLoginStatus() {
			// 如果已经登录，则不需要重新登录
			if (this.userInfo && this.userInfo.token) {
				console.log('用户已登录');
				this.fetchPageData();
				return;
			}
			
			// 未登录，调用微信登录
			this.wxLogin();
		},
		
		// 微信登录
		wxLogin() {
			this.loading = true;
			
			// 显示加载提示
			uni.showLoading({
				title: '登录中...'
			});
			
			// 调用微信登录接口获取code
			uni.login({
				provider: 'weixin',
				success: (loginRes) => {
					console.log('微信登录成功，获取到code:', loginRes.code);
					if (loginRes.code) {
						// 获取到code后调用后端登录接口
						this.loginWithCode(loginRes.code);
					} else {
						uni.hideLoading();
						uni.showToast({
							title: '微信登录失败',
							icon: 'none'
						});
						this.loading = false;
					}
				},
				fail: (err) => {
					uni.hideLoading();
					console.error('微信登录失败:', err);
					uni.showToast({
						title: '微信登录失败',
						icon: 'none'
					});
					this.loading = false;
				}
			});
		},
		
		// 使用code调用后端登录接口
		loginWithCode(code) {
			console.log('开始调用后端登录接口，code:', code);
			
			uni.request({
				url: `${config.BaseUrl}/api/user/wxlogin`, // 使用配置文件中的BaseUrl
				method: 'POST',
				data: code, // 直接传递code字符串
				header: {
					'content-type': 'application/json'
				},
				success: (res) => {
					console.log('登录请求响应:', res);
					if (res.data && res.data.code === 1) {
						// 登录成功，获取响应数据
						const responseData = res.data.data;
						console.log('登录成功, 响应数据:', responseData);
						
						// 保存用户信息到Vuex，传入完整的responseData以便在store中处理嵌套结构
						this.setUserInfo(responseData);
						
						// 同时保存token到store
						this.setToken(responseData.token);
						
						// 将token设置为全局请求头
						if (responseData.token) {
							// 设置全局请求头
							uni.addInterceptor('request', {
								invoke(args) {
									// 添加token到请求头
									args.header = args.header || {};
									args.header['Authorization'] = `Bearer ${responseData.token}`;
									return args;
								}
							});
							
							// 同时将token保存到本地存储，以便下次启动时使用
							uni.setStorageSync('token', responseData.token);
							uni.setStorageSync('userInfo', JSON.stringify(responseData));
							
							console.log('已设置全局请求头Authorization:', `Bearer ${responseData.token}`);
						}
						
						// 登录成功后连接WebSocket服务器
						this.connectWebSocket();
						
						// 登录成功后加载页面数据
						this.fetchPageData();
						
						uni.showToast({
							title: '登录成功',
							icon: 'success'
						});
					} else {
						// 登录失败
						console.error('登录失败:', res.data);
						uni.showToast({
							title: res.data?.message || '登录失败',
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
					uni.hideLoading();
					this.loading = false;
				}
			});
		},
		
		// 获取页面所需的数据
		fetchPageData() {
			// 获取热门帖子数据
			this.getHotPosts();
		},
		
		// 连接WebSocket服务器
		connectWebSocket() {
			// 打印完整的Vuex状态用于调试
			console.log('Vuex state:', this.$store.state);
			console.log('User module state:', this.$store.state.user);
			
			// 确保有用户ID
			console.log('当前用户信息:', this.userInfo);
			
			// 先尝试从用户对象中获取userId
			let userId = this.userInfo?.userId;
			
			// 如果没有找到userId，则检查是否有嵌套的user对象
			if (!userId && this.userInfo?.user) {
				userId = this.userInfo.user.userId;
				console.log('从嵌套user对象中获取userId:', userId);
			}
			
			if (!userId) {
				console.error('无法连接WebSocket：缺少用户ID');
				console.error('用户信息对象:', JSON.stringify(this.userInfo));
				return;
			}
			
			console.log('使用用户ID连接WebSocket:', userId);
			const wsUrl = `ws://127.0.0.1:8070/ws/user/${userId}`;
			
			console.log('开始连接WebSocket服务器:', wsUrl);
			
			// 创建WebSocket连接
			this.socketTask = uni.connectSocket({
				url: wsUrl,
				success: () => {
					console.log('WebSocket连接成功创建');
				},
				fail: (err) => {
					console.error('WebSocket连接创建失败:', err);
				}
			});
			
			// 监听WebSocket连接打开
			uni.onSocketOpen((res) => {
				console.log('WebSocket连接已打开:', res);
			});
			
			// 监听WebSocket错误
			uni.onSocketError((err) => {
				console.error('WebSocket连接错误:', err);
			});
			
			// 监听WebSocket消息
			uni.onSocketMessage((res) => {
				console.log('收到WebSocket消息:', res.data);
				// 在这里处理收到的消息
			});
			
			// 监听WebSocket关闭
			uni.onSocketClose((res) => {
				console.log('WebSocket连接已关闭:', res);
			});
		},
		
		navigateTo(path) {
			// Ensure path has the correct format
			if (path.startsWith('./')) {
				// Convert relative path to absolute path for index page
				const absolutePath = `/pages${path.substring(1)}`;
				uni.navigateTo({
					url: absolutePath
				});
			} else {
				// Use the path as-is if it already has the correct format
				uni.navigateTo({
					url: path
				});
			}
		},
		viewPostDetail(id) {
			console.log('Attempting to view post detail with ID:', id);
			
			if (!id) {
				console.error('Cannot navigate to post detail: Missing post ID');
				uni.showToast({
					title: '帖子ID无效',
					icon: 'none'
				});
				return;
			}
			
			// Instead of using detail route, use detail/index route
			uni.navigateTo({
				url: `/pages/forum/detail/index?id=${id}`
			});
		},
		viewShopDetail(id) {
			uni.navigateTo({
				url: `/pages/shops/detail?id=${id}`
			});
		},
		formatDate(timestamp) {
			if (!timestamp) return '未知时间';
			
			try {
				const date = new Date(timestamp);
				
				// 检查日期是否有效
				if (isNaN(date.getTime())) return '未知时间';
				
				const now = new Date();
				const diff = now - date; // 毫秒差
				
				// 如果是今天发布的
				if (date.toDateString() === now.toDateString()) {
					const hours = date.getHours();
					const minutes = date.getMinutes();
					return `今天 ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
				}
				
				// 如果是昨天发布的
				const yesterday = new Date(now);
				yesterday.setDate(now.getDate() - 1);
				if (date.toDateString() === yesterday.toDateString()) {
					return '昨天';
				}
				
				// 如果是最近7天发布的
				if (diff < 7 * 24 * 60 * 60 * 1000) {
					const days = Math.floor(diff / (24 * 60 * 60 * 1000));
					return `${days}天前`;
				}
				
				// 其他情况显示完整日期
				return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
			} catch (err) {
				console.error('日期格式化错误:', err);
				return '未知时间';
			}
		}
	}
}
</script>

<style>
	.container {
		background-color: #F8F7F2; /* Light cream background */
		min-height: 100vh;
		background-image: url('/static/decoration/paper-texture.png');
		background-repeat: repeat;
	}
	
	.header {
		padding: 20rpx 30rpx;
	}
	
	.search-box {
		width: 100%;
	}
	
	.search-input-wrapper {
		display: flex;
		align-items: center;
		background: #fff;
		border-radius: 30rpx;
		padding: 0 20rpx;
		border: 1rpx solid #e0c9d1;
		/* 添加卷轴样式边框 */
		box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05);
		background-image: url('/static/decoration/paper-subtle.png');
	}
	
	/* Banner styling with scroll decoration */
	.banner-wrapper {
		position: relative;
		padding: 20rpx 30rpx;
	}
	
	.banner {
		border-radius: 20rpx;
		overflow: hidden;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
		height: 300rpx;
		z-index: 1;
	}
	
	.scroll-left, .scroll-right {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		width: 60rpx;
		height: 180rpx;
		z-index: 2;
	}
	
	.scroll-left {
		left: 10rpx;
	}
	
	.scroll-right {
		right: 10rpx;
	}
	
	/* Quick access icons with cloud pattern */
	.quick-access {
		position: relative;
		display: flex;
		justify-content: space-around;
		padding: 30rpx;
		background-color: #FFFFFF;
		margin: 20rpx 30rpx;
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
	
	.quick-item {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		z-index: 2;
	}
	
	.quick-item-icon {
		width: 80rpx;
		height: 80rpx;
		margin-bottom: 10rpx;
	}
	
	.quick-item-text {
		font-size: 26rpx;
		color: #333;
		font-family: "KaiTi", "FangSong"; /* 使用楷体 */
	}
	
	/* Section styling */
	.section {
		margin: 30rpx;
		background-color: #FFFFFF;
		border-radius: 20rpx;
		padding: 30rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
		border: 1rpx solid rgba(224, 201, 209, 0.5); /* 浅色边框 */
	}
	
	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
		border-bottom: 2rpx solid #F0F0F0;
		padding-bottom: 16rpx;
		position: relative;
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
		position: relative;
		letter-spacing: 4rpx;
	}
	
	.section-title::before {
		content: "";
		position: absolute;
		left: -15rpx;
		top: 50%;
		height: 30rpx;
		width: 8rpx;
		background-color: #7EC4CF; /* Main cyan color */
		border-radius: 4rpx;
		transform: translateY(-50%);
	}
	
	.section-more {
		display: flex;
		align-items: center;
		font-size: 24rpx;
		color: #7EC4CF;
	}
	
	/* Post styling with more Chinese elements */
	.post-list {
		display: flex;
		flex-direction: column;
		gap: 30rpx;
	}
	
	.post-item {
		background-color: #FFFFFF;
		border-radius: 16rpx;
		padding: 20rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
		border-left: 6rpx solid #E0C9D1; /* Secondary color */
		position: relative;
		background-image: url('/static/decoration/paper-subtle.png');
		background-repeat: repeat;
	}
	
	.post-item::after {
		content: "";
		position: absolute;
		right: 20rpx;
		bottom: 20rpx;
		width: 60rpx;
		height: 60rpx;
		background-image: url('/static/decoration/corner-decoration.png');
		background-size: contain;
		background-repeat: no-repeat;
		opacity: 0.15;
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
		border: 2rpx solid rgba(126, 196, 207, 0.3);
	}
	
	.post-username {
		font-size: 28rpx;
		color: #333;
		font-weight: bold;
		font-family: "KaiTi", "FangSong";
	}
	
	.post-time {
		font-size: 24rpx;
		color: #999;
	}
	
	.post-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
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
		flex-wrap: wrap;
		gap: 10rpx;
		margin-bottom: 16rpx;
	}
	
	.post-image {
		width: 220rpx;
		height: 220rpx;
		border-radius: 10rpx;
		border: 2rpx solid rgba(224, 201, 209, 0.3);
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
	
	/* Shop styling */
	.shop-scroll {
		white-space: nowrap;
		margin: 0 -30rpx;
		padding: 0 30rpx;
	}
	
	.shop-item {
		display: inline-block;
		width: 240rpx;
		margin-right: 20rpx;
		background-color: #FFF;
		border-radius: 16rpx;
		overflow: hidden;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
		border: 1rpx solid rgba(224, 201, 209, 0.3);
	}
	
	.shop-image {
		width: 240rpx;
		height: 180rpx;
	}
	
	.shop-name {
		display: block;
		font-size: 28rpx;
		color: #333;
		font-weight: bold;
		margin: 10rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-family: "KaiTi", "FangSong";
	}
	
	.shop-rating {
		display: flex;
		align-items: center;
		gap: 6rpx;
		margin: 0 10rpx 10rpx 10rpx;
		font-size: 24rpx;
		color: #666;
	}
	
	/* Rice paper background texture */
	.post-section, .shop-section {
		/* Temporarily removing the background image until assets are available */
		/* background-image: url('../../static/textures/rice-paper.png'); */
		background-color: rgba(255, 255, 255, 0.9);
		border: 1px solid rgba(126, 196, 207, 0.2); /* Light border with main color */
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
		font-family: "SimSun", serif;
	}
	
	.icon-arrow {
		width: 28rpx;
		height: 28rpx;
		margin-left: 6rpx;
	}
	
	.icon-action {
		width: 28rpx;
		height: 28rpx;
		margin-right: 4rpx;
	}
	
	.icon-star {
		width: 24rpx;
		height: 24rpx;
		margin-right: 4rpx;
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
	
	.empty-posts {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 60rpx 0;
		color: #999;
		font-size: 28rpx;
		font-family: "FangSong", serif;
	}
</style>
