<template>
	<view class="container">
		<!-- 使用自定义导航栏组件 -->
		<custom-nav-bar title="写探店" subtitle="分享你的体验" :show-back="true"></custom-nav-bar>
		
		<!-- 添加明显的返回按钮 -->
		<view class="back-button" @click="goBack">
			<text class="back-arrow">←</text>
			<text class="back-text">返回</text>
		</view>
		
		<view class="form-card">
			<view class="form-header">
				<text class="form-title">{{shopName}}的探店体验</text>
			</view>
			
			<!-- 评分区域 -->
			<view class="rating-section">
				<text class="section-label">你的评分</text>
				<view class="rating-stars">
					<text 
						v-for="n in 5" 
						:key="n" 
						class="star" 
						:class="{ active: n <= rating }"
						@click="setRating(n)">★</text>
				</view>
				<text class="rating-text">{{rating}}分</text>
			</view>
			
			<!-- 标题输入 -->
			<view class="input-section">
				<text class="section-label">标题</text>
				<input class="input-field" type="text" v-model="title" placeholder="添加一个标题（选填）" />
			</view>
			
			<!-- 内容输入 -->
			<view class="input-section">
				<text class="section-label">内容</text>
				<textarea class="textarea-field" v-model="content" placeholder="分享你的探店体验..." />
			</view>
			
			<!-- 图片上传 -->
			<view class="input-section">
				<text class="section-label">上传图片</text>
				<view class="image-upload">
					<view 
						v-for="(img, index) in images" 
						:key="index"
						class="image-preview-container">
						<image :src="img" mode="aspectFill" class="image-preview"></image>
						<text class="delete-image" @click="deleteImage(index)">×</text>
					</view>
					<view class="upload-button" @click="chooseImage" v-if="images.length < 9">
						<text class="upload-icon">+</text>
					</view>
				</view>
			</view>
			
			<!-- 提交按钮 -->
			<view class="submit-section">
				<button class="submit-btn" @click="submitReview">发布探店</button>
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
				shopId: null,
				shopName: '',
				rating: 5,
				title: '',
				content: '',
				images: []
			}
		},
		onLoad(options) {
			console.log('创建探店页面参数:', JSON.stringify(options));
			this.shopId = options.shopId;
			this.shopName = decodeURIComponent(options.shopName || '');
			
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
		},
		methods: {
			// 设置评分
			setRating(value) {
				this.rating = value;
			},
			
			// 选择图片
			chooseImage() {
				uni.chooseImage({
					count: 9 - this.images.length,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: (res) => {
						this.images = [...this.images, ...res.tempFilePaths];
					}
				});
			},
			
			// 删除图片
			deleteImage(index) {
				this.images.splice(index, 1);
			},
			
			// 提交探店
			submitReview() {
				if (!this.content.trim()) {
					uni.showToast({
						title: '请填写探店内容',
						icon: 'none'
					});
					return;
				}
				
				// 显示加载中
				uni.showLoading({
					title: '提交中...'
				});
				
				// 先上传图片（模拟）
				setTimeout(() => {
					// 模拟图片上传成功
					const uploadedImages = this.images.map(img => img);
					
					// 构建评价数据
					const reviewData = {
						shopId: this.shopId,
						userId: 1, // 模拟用户ID
						rating: this.rating,
						title: this.title,
						content: this.content,
						images: JSON.stringify(uploadedImages)
					};
					
					// 发送到后端API
					uni.request({
						url: `${config.BaseUrl}/api/shop/review`,
						method: 'POST',
						data: reviewData,
						header: {
							'content-type': 'application/json'
						},
						success: (res) => {
							console.log('提交探店成功:', JSON.stringify(res.data));
							if (res.data && res.data.code === 1) {
								uni.showToast({
									title: '发布成功',
									icon: 'success'
								});
								// 发布成功后返回探店列表页
								setTimeout(() => {
									uni.navigateBack();
								}, 1500);
							} else {
								console.error('提交探店API返回错误:', JSON.stringify(res.data));
								uni.showToast({
									title: '发布失败',
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
							uni.hideLoading();
						}
					});
				}, 1000);
			},
			
			goBack() {
				uni.navigateBack({
					delta: 1,
					fail: () => {
						// 如果没有上一页，返回探店列表
						uni.navigateTo({
							url: `/pages/mall/shops/reviews?id=${this.shopId}&name=${encodeURIComponent(this.shopName)}`
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
	
	.form-card {
		margin: 30rpx;
		background-color: #fff;
		border-radius: 15rpx;
		padding: 30rpx;
		box-shadow: 0 4rpx 8rpx rgba(0,0,0,0.05);
		border: 1rpx solid #e0c9d1;
	}
	
	.form-header {
		text-align: center;
		margin-bottom: 30rpx;
		padding-bottom: 20rpx;
		border-bottom: 1rpx solid #f0f0f0;
	}
	
	.form-title {
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
		font-family: "FangSong", serif;
	}
	
	.section-label {
		font-size: 28rpx;
		color: #333;
		margin-bottom: 15rpx;
		display: block;
	}
	
	.rating-section {
		margin-bottom: 30rpx;
	}
	
	.rating-stars {
		display: flex;
		margin: 15rpx 0;
	}
	
	.star {
		color: #DDDDDD;
		font-size: 50rpx;
		margin-right: 15rpx;
	}
	
	.star.active {
		color: #FF9500;
	}
	
	.rating-text {
		font-size: 28rpx;
		color: #FF9500;
		margin-top: 10rpx;
	}
	
	.input-section {
		margin-bottom: 30rpx;
	}
	
	.input-field {
		width: 100%;
		background-color: #f9f9f9;
		border: 1rpx solid #e0e0e0;
		border-radius: 10rpx;
		padding: 20rpx;
		font-size: 28rpx;
	}
	
	.textarea-field {
		width: 100%;
		height: 200rpx;
		background-color: #f9f9f9;
		border: 1rpx solid #e0e0e0;
		border-radius: 10rpx;
		padding: 20rpx;
		font-size: 28rpx;
	}
	
	.image-upload {
		display: flex;
		flex-wrap: wrap;
		margin: 0 -10rpx;
	}
	
	.image-preview-container {
		width: calc(33.33% - 20rpx);
		margin: 10rpx;
		height: 200rpx;
		position: relative;
	}
	
	.image-preview {
		width: 100%;
		height: 100%;
		border-radius: 10rpx;
	}
	
	.delete-image {
		position: absolute;
		top: -10rpx;
		right: -10rpx;
		width: 40rpx;
		height: 40rpx;
		background-color: rgba(0, 0, 0, 0.5);
		color: #fff;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24rpx;
	}
	
	.upload-button {
		width: calc(33.33% - 20rpx);
		margin: 10rpx;
		height: 200rpx;
		background-color: #f9f9f9;
		border: 1rpx dashed #ccc;
		border-radius: 10rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.upload-icon {
		font-size: 60rpx;
		color: #ccc;
	}
	
	.submit-section {
		margin-top: 40rpx;
	}
	
	.submit-btn {
		width: 100%;
		background-color: #8A3324;
		color: #fff;
		border: none;
		border-radius: 15rpx;
		padding: 20rpx 0;
		font-size: 32rpx;
		font-weight: bold;
		font-family: "FangSong", serif;
	}
</style> 