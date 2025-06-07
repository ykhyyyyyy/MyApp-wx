<template>
	<view class="container">
		<!-- 使用自定义导航栏组件 -->
		<custom-nav-bar title="探店详情" subtitle="查看体验" :show-back="true"></custom-nav-bar>
		
		<!-- 添加明显的返回按钮 -->
		<view class="back-button" @click="goBack">
			<text class="back-arrow">←</text>
			<text class="back-text">返回</text>
		</view>
		
		<!-- 显示加载中状态 -->
		<view v-if="loading" class="loading-container">
			<view class="loading-spinner"></view>
			<text class="loading-text">加载中...</text>
		</view>
		
		<!-- 显示无数据状态 -->
		<view v-else-if="!review" class="empty-container">
			<text class="empty-text">未找到探店内容</text>
		</view>
		
		<!-- 探店详情内容 -->
		<view v-else class="review-detail">
			<view class="review-card">
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
						v-for="(img, imgIndex) in review.images" 
						:key="imgIndex" 
						:src="img" 
						mode="aspectFill" 
						class="review-image-large" 
						@click="previewImage(review.images, imgIndex)"></image>
				</view>
				
				<view class="review-footer">
					<view class="action-btn" @click="likeReview()">
						<text class="action-icon" :class="{ active: review.isLiked }">👍</text>
						<text class="action-count">{{review.likeCount || 0}}</text>
					</view>
					<view class="action-btn" @click="toggleCommentInput">
						<text class="action-icon">💬</text>
						<text class="action-count">{{review.commentCount || 0}}</text>
					</view>
					<view class="action-btn" @click="shareReview()">
						<text class="action-icon">🔗</text>
						<text class="action-text">分享</text>
					</view>
				</view>
			</view>
			
			<!-- 评论列表 -->
			<view class="comments-section">
				<view class="section-title">
					<text class="title-text">全部评论 ({{comments.length}})</text>
				</view>
				
				<view v-if="comments.length === 0" class="empty-comments">
					<text class="empty-text">暂无评论，快来发表第一条评论吧</text>
				</view>
				
				<view v-else class="comments-list">
					<view class="comment-item" v-for="(comment, index) in comments" :key="index">
						<view class="comment-header">
							<image class="comment-avatar" :src="comment.userAvatar || 'https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg'" mode="aspectFill"></image>
							<view class="comment-user-info">
								<text class="comment-user-name">{{comment.userName || '匿名用户'}}</text>
								<text class="comment-time">{{formatDate(comment.createTime)}}</text>
							</view>
						</view>
						<view class="comment-content">
							<text class="comment-text">{{comment.content}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 评论输入框 -->
		<view class="comment-input-container" v-if="showCommentInput">
			<input 
				class="comment-input" 
				type="text" 
				v-model="commentText" 
				placeholder="说点什么..." 
				focus 
				@blur="onInputBlur"
				@confirm="submitComment" />
			<view class="comment-submit" @click="submitComment">发送</view>
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
				id: null,
				loading: false,
				review: null,
				comments: [],
				showCommentInput: false,
				commentText: ''
			}
		},
		onLoad(options) {
			console.log('探店详情页参数:', JSON.stringify(options));
			this.id = options.id;
			
			if (!this.id) {
				console.error('未获取到探店ID');
				uni.showToast({
					title: '探店ID无效',
					icon: 'none'
				});
				setTimeout(() => {
					this.goBack();
				}, 1500);
				return;
			}
			
			// 如果需要显示评论输入框
			if (options.showComment === 'true') {
				this.showCommentInput = true;
			}
			
			console.log('加载探店详情，ID:', this.id);
			this.loadReviewDetail();
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
						console.log('获取探店详情成功:', JSON.stringify(res.data));
						if (res.data && res.data.code === 1) {
							const reviewData = res.data.data;
							
							// 处理图片数组
							if (typeof reviewData.images === 'string' && reviewData.images) {
								try {
									reviewData.images = JSON.parse(reviewData.images);
								} catch (e) {
									console.error('解析图片JSON失败:', e);
									reviewData.images = [];
								}
							} else if (!reviewData.images) {
								reviewData.images = [];
							}
							
							// 添加点赞状态（模拟）
							reviewData.isLiked = false;
							
							this.review = reviewData;
						} else {
							console.error('获取探店详情API返回错误:', JSON.stringify(res.data));
							uni.showToast({
								title: '获取探店详情失败',
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
					}
				});
			},
			
			// 加载评论
			loadComments() {
				// 这里应该调用评论API，但目前使用模拟数据
				this.comments = [
					{
						id: 1,
						userId: 1,
						userName: '用户A',
						userAvatar: 'https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg',
						content: '这家店真的很不错，下次还会去！',
						createTime: new Date(Date.now() - 3600000).toISOString()
					},
					{
						id: 2,
						userId: 2,
						userName: '用户B',
						userAvatar: 'https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg',
						content: '价格实惠，服务态度也很好',
						createTime: new Date(Date.now() - 86400000).toISOString()
					}
				];
			},
			
			// 点赞探店
			likeReview() {
				if (!this.review) return;
				
				// 这里应该调用点赞API，这里只做模拟
				this.review.isLiked = !this.review.isLiked;
				
				if (this.review.isLiked) {
					this.review.likeCount = (this.review.likeCount || 0) + 1;
				} else if (this.review.likeCount > 0) {
					this.review.likeCount -= 1;
				}
				
				uni.showToast({
					title: this.review.isLiked ? '点赞成功' : '已取消点赞',
					icon: 'none'
				});
			},
			
			// 分享探店
			shareReview() {
				uni.showShareMenu({
					withShareTicket: true
				});
			},
			
			// 显示评论输入框
			toggleCommentInput() {
				this.showCommentInput = !this.showCommentInput;
			},
			
			// 输入框失去焦点
			onInputBlur() {
				// 留一点延迟，以便可能的点击提交按钮生效
				setTimeout(() => {
					if (this.commentText.trim() === '') {
						this.showCommentInput = false;
					}
				}, 200);
			},
			
			// 提交评论
			submitComment() {
				if (!this.commentText.trim()) {
					uni.showToast({
						title: '请输入评论内容',
						icon: 'none'
					});
					return;
				}
				
				// 模拟提交评论
				const newComment = {
					id: this.comments.length + 1,
					userId: 3,
					userName: '当前用户',
					userAvatar: 'https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg',
					content: this.commentText,
					createTime: new Date().toISOString()
				};
				
				this.comments.unshift(newComment);
				this.commentText = '';
				this.showCommentInput = false;
				
				// 更新评论数
				if (this.review) {
					this.review.commentCount = (this.review.commentCount || 0) + 1;
				}
				
				uni.showToast({
					title: '评论成功',
					icon: 'success'
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
						// 如果没有上一页，返回探店列表
						uni.switchTab({
							url: '/pages/mall/index'
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
	
	/* 探店详情 */
	.review-detail {
		padding: 30rpx;
		padding-bottom: 120rpx;
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
		flex-wrap: wrap;
		margin: 0 -10rpx 20rpx;
	}
	
	.review-image-large {
		width: calc(33.33% - 20rpx);
		height: 200rpx;
		margin: 10rpx;
		border-radius: 8rpx;
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
	
	/* 评论区域 */
	.comments-section {
		background-color: #fff;
		border-radius: 15rpx;
		padding: 30rpx;
		box-shadow: 0 4rpx 8rpx rgba(0,0,0,0.05);
		border: 1rpx solid #e0c9d1;
	}
	
	.section-title {
		margin-bottom: 20rpx;
		padding-bottom: 15rpx;
		border-bottom: 1rpx solid #f0f0f0;
	}
	
	.title-text {
		font-size: 30rpx;
		color: #333;
		font-weight: bold;
		font-family: "FangSong", serif;
	}
	
	.empty-comments {
		padding: 30rpx 0;
		text-align: center;
	}
	
	.comment-item {
		margin-bottom: 20rpx;
		padding-bottom: 20rpx;
		border-bottom: 1rpx solid #f0f0f0;
	}
	
	.comment-header {
		display: flex;
		align-items: center;
		margin-bottom: 10rpx;
	}
	
	.comment-avatar {
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		margin-right: 15rpx;
	}
	
	.comment-user-info {
		flex: 1;
	}
	
	.comment-user-name {
		font-size: 26rpx;
		color: #333;
		font-weight: bold;
		margin-bottom: 5rpx;
		display: block;
	}
	
	.comment-time {
		font-size: 22rpx;
		color: #999;
	}
	
	.comment-content {
		padding-left: 75rpx;
	}
	
	.comment-text {
		font-size: 26rpx;
		color: #666;
		line-height: 1.5;
	}
	
	/* 评论输入框 */
	.comment-input-container {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 20rpx 30rpx;
		background-color: #fff;
		display: flex;
		align-items: center;
		box-shadow: 0 -2rpx 6rpx rgba(0,0,0,0.05);
		z-index: 100;
	}
	
	.comment-input {
		flex: 1;
		height: 70rpx;
		background-color: #f5f5f5;
		border-radius: 35rpx;
		padding: 0 30rpx;
		font-size: 28rpx;
	}
	
	.comment-submit {
		padding: 0 30rpx;
		height: 70rpx;
		line-height: 70rpx;
		color: #8A3324;
		font-size: 28rpx;
		font-weight: bold;
	}
</style> 