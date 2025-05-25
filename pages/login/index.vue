<template>
	<view class="container">
		<!-- Custom navigation bar with back button -->
		<custom-nav-bar title="用户登录" subtitle="登录您的账号" :show-back="true"></custom-nav-bar>
		
		<view class="login-content">
			<view class="login-header">
				<image src="/static/decoration/login-header.png" mode="aspectFit" class="login-header-image"></image>
				<text class="login-title">欢迎回来</text>
				<text class="login-subtitle">登录后即可使用AI助手等完整功能</text>
			</view>
			
			<view class="login-form">
				<view class="form-item">
					<text class="form-label">用户名</text>
					<input class="form-input" v-model="username" placeholder="请输入用户名/手机号/邮箱" />
				</view>
				
				<view class="form-item">
					<text class="form-label">密码</text>
					<input class="form-input" v-model="password" type="password" placeholder="请输入密码" />
				</view>
				
				<view class="form-options">
					<label class="checkbox">
						<checkbox :checked="rememberMe" @tap="rememberMe = !rememberMe" />
						<text>记住我</text>
					</label>
					<text class="forgot-password" @tap="forgotPassword">忘记密码？</text>
				</view>
				
				<button class="login-btn" @tap="handleLogin" :loading="isLoading">登录</button>
				
				<view class="register-link">
					<text>还没有账号？</text>
					<text class="link" @tap="goToRegister">立即注册</text>
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
			username: '',
			password: '',
			rememberMe: false,
			isLoading: false
		}
	},
	methods: {
		// 处理登录请求
		handleLogin() {
			if (!this.username.trim()) {
				uni.showToast({
					title: '请输入用户名',
					icon: 'none'
				});
				return;
			}
			
			if (!this.password) {
				uni.showToast({
					title: '请输入密码',
					icon: 'none'
				});
				return;
			}
			
			this.isLoading = true;
			
			// 构建登录请求数据
			const loginData = {
				username: this.username,
				password: this.password
			};
			
			// 发起登录请求
			this.$api.post('/api/auth/login', loginData)
				.then(res => {
					if (res.token) {
						// 保存token
						uni.setStorageSync('token', res.token);
						
						if (this.rememberMe) {
							// 如果选择了记住我，可以保存用户名等信息
							uni.setStorageSync('remembered_username', this.username);
						} else {
							uni.removeStorageSync('remembered_username');
						}
						
						// 显示成功消息
						uni.showToast({
							title: '登录成功',
							icon: 'success'
						});
						
						// 登录成功后返回上一页
						setTimeout(() => {
							uni.navigateBack();
						}, 1500);
					} else {
						uni.showToast({
							title: '登录失败，请重试',
							icon: 'none'
						});
					}
				})
				.catch(err => {
					console.error('Login failed:', err);
					let errorMsg = '登录失败，请重试';
					
					if (err.data && err.data.message) {
						errorMsg = err.data.message;
					}
					
					uni.showToast({
						title: errorMsg,
						icon: 'none'
					});
				})
				.finally(() => {
					this.isLoading = false;
				});
		},
		
		// 前往注册页面
		goToRegister() {
			uni.navigateTo({
				url: '/pages/register/index'
			});
		},
		
		// 忘记密码
		forgotPassword() {
			uni.navigateTo({
				url: '/pages/forgot-password/index'
			});
		}
	},
	onShow() {
		// 检查是否有记住的用户名
		const rememberedUsername = uni.getStorageSync('remembered_username');
		if (rememberedUsername) {
			this.username = rememberedUsername;
			this.rememberMe = true;
		}
	}
}
</script>

<style>
.container {
	background-color: #F8F3E6;
	min-height: 100vh;
	background-image: url('/static/decoration/paper-texture.png');
}

.login-content {
	padding: 30rpx;
}

.login-header {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 60rpx;
}

.login-header-image {
	width: 150rpx;
	height: 150rpx;
	margin-bottom: 30rpx;
}

.login-title {
	font-size: 40rpx;
	font-weight: bold;
	color: #333;
	font-family: "FangSong", serif;
	margin-bottom: 10rpx;
}

.login-subtitle {
	font-size: 26rpx;
	color: #666;
}

.login-form {
	background-color: #FFFFFF;
	border-radius: 20rpx;
	padding: 40rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	border: 1rpx solid rgba(224, 201, 209, 0.5);
}

.form-item {
	margin-bottom: 30rpx;
}

.form-label {
	display: block;
	font-size: 28rpx;
	color: #8C7853;
	margin-bottom: 10rpx;
}

.form-input {
	width: 100%;
	height: 90rpx;
	background-color: #f8f8f8;
	border-radius: 10rpx;
	padding: 0 20rpx;
	font-size: 28rpx;
	color: #333;
	border: 1rpx solid #D7C9AA;
}

.form-options {
	display: flex;
	justify-content: space-between;
	margin-bottom: 40rpx;
}

.checkbox {
	display: flex;
	align-items: center;
	font-size: 26rpx;
	color: #666;
}

.checkbox checkbox {
	transform: scale(0.8);
	margin-right: 10rpx;
}

.forgot-password {
	font-size: 26rpx;
	color: #7EC4CF;
}

.login-btn {
	height: 90rpx;
	background-color: #8A3324;
	color: #fff;
	border-radius: 45rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 32rpx;
	margin: 40rpx 0;
	box-shadow: 0 6rpx 10rpx rgba(138, 51, 36, 0.3);
	font-family: "FangSong", serif;
}

.register-link {
	text-align: center;
	font-size: 26rpx;
	color: #666;
}

.link {
	color: #7EC4CF;
	margin-left: 10rpx;
}
</style> 