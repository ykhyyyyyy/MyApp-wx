<template>
	<view class="container">
		<!-- 使用自定义导航栏组件 -->
		<custom-nav-bar title="探店详情" subtitle="Review Detail" :show-back="true"></custom-nav-bar>
		
		<!-- 添加返回按钮 -->
		<view class="back-button" @click="goBack">
			<text class="back-arrow">←</text>
			<text class="back-text">返回</text>
		</view>
		
		<!-- 加载中状态 -->
		<view v-if="loading && !review" class="loading-container">
			<view class="loading-spinner"></view>
			<text class="loading-text">加载中...</text>
		</view>
		
		<!-- 无数据状态 -->
		<view v-else-if="!review" class="empty-container">
			<text class="empty-text">未找到该探店评论</text>
			<button class="return-button" @click="goBack">返回上一页</button>
		</view>
		
		<!-- 探店详情内容 -->
		<view v-else class="content-container">
			<!-- 探店详情 -->
			<view class="review-detail">
				<view class="review-header">
					<view class="review-user">
						<image :src="review.userAvatar || 'https://ykhyyy.oss-cn-beijing.aliyuncs.com/MyApp/userAvatar/default-avatar.png'" class="review-avatar"></image>
						<view class="user-info">
							<text class="review-username">{{review.username || '匿名用户'}}</text>
							<text class="review-time">{{formatDate(review.createTime)}}</text>
						</view>
					</view>
					<view class="review-rating">
						<text class="rating-score">{{review.rating || 0}}</text>
						<view class="rating-stars">
							<text v-for="n in 5" :key="n" class="star" :class="{ active: n <= Math.floor(review.rating || 0) }">★</text>
						</view>
					</view>
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
						@click="previewImage(img, review.images.split(','))"
					></image>
				</view>
				
				<view class="review-stats">
					<view class="stat-item">
						<image src="https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg" class="icon-stat"></image>
						<text>{{review.views || 0}} 浏览</text>
					</view>
					<view class="stat-item">
						<image src="https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg" class="icon-stat"></image>
						<text>{{review.comments || 0}} 评论</text>
					</view>
					<view class="stat-item" @click="likeReview">
						<image src="https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg" class="icon-stat"></image>
						<text>{{review.likes || 0}} 点赞</text>
					</view>
				</view>
			</view>
			
			<!-- 评论区分割线 -->
			<view class="divider">
				<view class="divider-line"></view>
				<text class="divider-text">评论区</text>
				<view class="divider-line"></view>
			</view>
			
			<!-- 评论列表 -->
			<view class="comments-section">
				<view v-if="loadingComments" class="loading-container small">
					<view class="loading-spinner small"></view>
					<text class="loading-text">加载评论中...</text>
				</view>
				
				<view v-else-if="comments.length === 0" class="empty-comments">
					<text class="empty-text">暂无评论，快来发表第一条评论吧</text>
				</view>
				
				<view v-else class="comment-list">
					<view class="comment-item" v-for="(comment, index) in comments" :key="comment.id || index">
						<view class="comment-header">
							<view class="comment-user">
								<image :src="comment.userAvatar || 'https://ykhyyy.oss-cn-beijing.aliyuncs.com/MyApp/userAvatar/default-avatar.png'" class="comment-avatar"></image>
								<view class="comment-user-info">
									<text class="comment-username">{{comment.username || '匿名用户'}}</text>
									<text class="comment-time">{{formatDate(comment.createTime)}}</text>
								</view>
							</view>
						</view>
						<text class="comment-content">{{comment.content}}</text>
					</view>
				</view>
			</view>
			
			<!-- 评论输入框 -->
			<view class="comment-input-container">
				<input 
					class="comment-input" 
					type="text" 
					v-model="newComment" 
					placeholder="写下你的评论..." 
					confirm-type="send"
					@confirm="submitComment"
				/>
				<button class="submit-button" @click="submitComment" :disabled="!newComment.trim()">发送</button>
			</view>
		</view>
	</view>
</template>

<script>
	import CustomNavBar from '@/components/CustomNavBar.vue';
	import config from '@/config/index.js';
	
	export default {
		components: {
			CustomNavBar
		},
		data() {
			return {
				id: null,
				loading: true,
				loadingComments: true,
				review: null,
				comments: [],
				newComment: ''
			}
		},
		onLoad(options) {
			// 获取传递过来的参数
			this.id = options.id;
			console.log('探店评论ID:', this.id);
			
			if (!this.id) {
				uni.showToast({
					title: '参数错误',
					icon: 'none'
				});
				return;
			}
			
			// 加载探店详情
			this.loadReviewDetail();
			
			// 加载评论列表
			this.loadComments();
		},
		methods: {
			// 加载探店详情
			loadReviewDetail() {
				this.loading = true;
				
				uni.request({
					url: `${config.BaseUrl}/api/shop/review/${this.id}`,
					method: 'GET',
					header: {
						'content-type': 'application/json'
					},
					success: (res) => {
						console.log('获取探店详情成功:', res.data);
						if (res.data && res.data.code === 1) {
							this.review = res.data.data;
						} else {
							uni.showToast({
								title: '获取详情失败',
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
			
			// 加载评论列表
			loadComments() {
				this.loadingComments = true;
				
				uni.request({
					url: `${config.BaseUrl}/api/shop/review/comment/review/${this.id}`,
					method: 'GET',
					header: {
						'content-type': 'application/json'
					},
					success: (res) => {
						console.log('获取评论列表成功:', res.data);
						if (res.data && res.data.code === 1) {
							this.comments = res.data.data || [];
						} else {
							uni.showToast({
								title: '获取评论失败',
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
						this.loadingComments = false;
					}
				});
			},
			
			// 提交评论
			submitComment() {
				if (!this.newComment.trim()) {
					return;
				}
				
				// 检查用户是否登录
				if (!this.$store.state.user || !this.$store.state.user.userInfo) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					return;
				}
				
				const userId = this.$store.state.user.userInfo.userId;
				
				const commentData = {
					reviewId: this.id,
					userId: userId,
					content: this.newComment.trim()
				};
				
				uni.showLoading({
					title: '提交中...'
				});
				
				uni.request({
					url: `${config.BaseUrl}/api/shop/review/comment`,
					method: 'POST',
					data: commentData,
					header: {
						'content-type': 'application/json'
					},
					success: (res) => {
						console.log('评论提交成功:', res.data);
						if (res.data && res.data.code === 1) {
							// 清空输入框
							this.newComment = '';
							
							// 重新加载评论列表
							this.loadComments();
							
							uni.showToast({
								title: '评论成功',
								icon: 'success'
							});
						} else {
							uni.showToast({
								title: res.data?.message || '评论失败',
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
					}
				});
			},
			
			// 点赞
			likeReview() {
				uni.showToast({
					title: '点赞功能开发中',
					icon: 'none'
				});
			},
			
			// 图片预览
			previewImage(current, urls) {
				uni.previewImage({
					current: current,
					urls: urls
				});
			},
			
			// 返回上一页
			goBack() {
				uni.navigateBack({
					delta: 1,
					fail: () => {
						// 如果无法返回上一页，则返回到探店列表页
						uni.navigateTo({
							url: '/pages/explore/index'
						});
					}
				});
			},
			
			// 格式化日期
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
		background-color: #F8F7F2;
		min-height: 100vh;
		padding-bottom: 120rpx; /* 为底部评论输入框留出空间 */
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
	
	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 100rpx 0;
	}
	
	.loading-container.small {
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
		padding: 100rpx 30rpx;
	}
	
	.empty-text {
		font-size: 28rpx;
		color: #999;
		margin-bottom: 30rpx;
	}
	
	.return-button {
		background-color: #7EC4CF;
		color: #fff;
		font-size: 28rpx;
		padding: 12rpx 30rpx;
		border-radius: 30rpx;
	}
	
	.content-container {
		padding: 30rpx;
	}
	
	.review-detail {
		background-color: #fff;
		border-radius: 15rpx;
		padding: 30rpx;
		margin-bottom: 30rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
		border: 1rpx solid #e0c9d1;
	}
	
	.review-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
	}
	
	.review-user {
		display: flex;
		align-items: center;
	}
	
	.review-avatar {
		width: 80rpx;
		height: 80rpx;
		border-radius: 40rpx;
		margin-right: 15rpx;
		border: 2rpx solid #e0c9d1;
	}
	
	.user-info {
		display: flex;
		flex-direction: column;
	}
	
	.review-username {
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 4rpx;
	}
	
	.review-time {
		font-size: 24rpx;
		color: #999;
	}
	
	.review-rating {
		display: flex;
		align-items: center;
	}
	
	.rating-score {
		font-size: 32rpx;
		color: #FF9500;
		font-weight: bold;
		margin-right: 10rpx;
	}
	
	.rating-stars {
		display: flex;
	}
	
	.star {
		color: #DDDDDD;
		font-size: 30rpx;
	}
	
	.star.active {
		color: #FF9500;
	}
	
	.review-shop-name {
		font-size: 30rpx;
		color: #7EC4CF;
		margin-bottom: 15rpx;
		display: block;
		font-weight: bold;
	}
	
	.review-title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 15rpx;
		display: block;
		font-family: "FangSong", serif;
	}
	
	.review-content {
		font-size: 30rpx;
		color: #333;
		line-height: 1.8;
		margin-bottom: 20rpx;
		display: block;
		text-align: justify;
	}
	
	.review-images {
		display: flex;
		flex-wrap: wrap;
		gap: 15rpx;
		margin-bottom: 20rpx;
	}
	
	.review-image {
		width: 210rpx;
		height: 210rpx;
		border-radius: 10rpx;
		border: 1rpx solid #f0f0f0;
	}
	
	.review-stats {
		display: flex;
		justify-content: flex-end;
		gap: 30rpx;
		margin-top: 20rpx;
		border-top: 1rpx solid #f0f0f0;
		padding-top: 20rpx;
	}
	
	.stat-item {
		display: flex;
		align-items: center;
		font-size: 26rpx;
		color: #666;
		padding: 8rpx 15rpx;
		border-radius: 30rpx;
		background-color: #f8f8f8;
	}
	
	.icon-stat {
		width: 30rpx;
		height: 30rpx;
		margin-right: 8rpx;
	}
	
	.divider {
		display: flex;
		align-items: center;
		margin: 30rpx 0;
	}
	
	.divider-line {
		flex: 1;
		height: 2rpx;
		background-color: #e0e0e0;
	}
	
	.divider-text {
		padding: 0 20rpx;
		font-size: 28rpx;
		color: #999;
		font-family: "FangSong", serif;
	}
	
	.comments-section {
		background-color: #fff;
		border-radius: 15rpx;
		padding: 30rpx;
		margin-bottom: 30rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
		border: 1rpx solid #e0c9d1;
	}
	
	.empty-comments {
		display: flex;
		justify-content: center;
		padding: 30rpx 0;
	}
	
	.comment-list {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}
	
	.comment-item {
		padding: 15rpx 0;
		border-bottom: 1rpx solid #f0f0f0;
	}
	
	.comment-item:last-child {
		border-bottom: none;
	}
	
	.comment-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10rpx;
	}
	
	.comment-user {
		display: flex;
		align-items: center;
	}
	
	.comment-avatar {
		width: 60rpx;
		height: 60rpx;
		border-radius: 30rpx;
		margin-right: 10rpx;
	}
	
	.comment-user-info {
		display: flex;
		flex-direction: column;
	}
	
	.comment-username {
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
	}
	
	.comment-time {
		font-size: 22rpx;
		color: #999;
	}
	
	.comment-content {
		font-size: 28rpx;
		color: #333;
		line-height: 1.6;
		padding-left: 70rpx;
	}
	
	.comment-input-container {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		align-items: center;
		padding: 20rpx 30rpx;
		background-color: #fff;
		border-top: 1rpx solid #e0e0e0;
		box-shadow: 0 -4rpx 10rpx rgba(0, 0, 0, 0.05);
	}
	
	.comment-input {
		flex: 1;
		background-color: #f5f5f5;
		border-radius: 30rpx;
		padding: 15rpx 20rpx;
		font-size: 28rpx;
		border: 1rpx solid #e0e0e0;
	}
	
	.submit-button {
		margin-left: 15rpx;
		background-color: #7EC4CF;
		color: #fff;
		font-size: 28rpx;
		padding: 10rpx 25rpx;
		border-radius: 30rpx;
		border: none;
	}
	
	.submit-button[disabled] {
		background-color: #ccc;
		color: #fff;
	}
</style> 