<template>
	<view class="container">
		<!-- 使用自定义导航栏，设置showBack为true -->
		<custom-nav-bar title="注册账号" subtitle="新用户注册" :show-back="true"></custom-nav-bar>
		
		<view class="register-content">
			<view class="register-header">
				<image src="/static/decoration/title-decoration.png" mode="aspectFit" class="header-image"></image>
				<text class="register-title">欢迎加入</text>
				<text class="register-subtitle">填写以下信息完成注册</text>
			</view>
			
			<view class="form-wrapper">
				<view class="form-item">
					<text class="form-label">手机号码</text>
					<input class="form-input" v-model="phoneNumber" type="number" placeholder="请输入手机号码" maxlength="11" />
				</view>
				
				<view class="form-item verification-code">
					<text class="form-label">验证码</text>
					<view class="code-input-group">
						<input class="form-input" v-model="verificationCode" type="number" placeholder="请输入验证码" maxlength="6" />
						<button class="code-btn" :disabled="countdown > 0" @click="sendVerificationCode">
							{{ countdown > 0 ? `${countdown}秒后重发` : '获取验证码' }}
						</button>
					</view>
				</view>
				
				<view class="form-item">
					<text class="form-label">用户名</text>
					<input class="form-input" v-model="username" placeholder="请设置用户名" />
				</view>
				
				<view class="form-item">
					<text class="form-label">密码</text>
					<input class="form-input" v-model="password" type="password" placeholder="请设置密码" />
				</view>
				
				<view class="form-item">
					<text class="form-label">确认密码</text>
					<input class="form-input" v-model="confirmPassword" type="password" placeholder="请再次输入密码" />
				</view>
				
				<view class="agreement">
					<checkbox :checked="agreeTerms" @tap="agreeTerms = !agreeTerms" color="#7EC4CF" />
					<text class="agreement-text">我已阅读并同意<text class="link-text">《用户协议》</text>和<text class="link-text">《隐私政策》</text></text>
				</view>
				
				<button class="submit-btn" @click="register" :disabled="!isFormValid">注册</button>
				
				<view class="login-link">
					<text>已有账号？</text>
					<text class="link" @click="goToLogin">立即登录</text>
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
			phoneNumber: '',
			verificationCode: '',
			username: '',
			password: '',
			confirmPassword: '',
			agreeTerms: false,
			countdown: 0,
			countdownTimer: null
		}
	},
	computed: {
		isFormValid() {
			return this.phoneNumber && 
				this.phoneNumber.length === 11 && 
				this.verificationCode && 
				this.username && 
				this.password && 
				this.password === this.confirmPassword && 
				this.agreeTerms;
		}
	},
	onUnload() {
		// 清除计时器
		if (this.countdownTimer) {
			clearInterval(this.countdownTimer);
		}
	},
	methods: {
		// 发送验证码
		sendVerificationCode() {
			if (!this.phoneNumber || this.phoneNumber.length !== 11) {
				uni.showToast({
					title: '请输入正确的手机号码',
					icon: 'none'
				});
				return;
			}
			
			// 开始倒计时
			this.countdown = 60;
			this.countdownTimer = setInterval(() => {
				this.countdown--;
				if (this.countdown <= 0) {
					clearInterval(this.countdownTimer);
				}
			}, 1000);
			
			// 这里应该调用发送验证码的API
			uni.showToast({
				title: '验证码已发送',
				icon: 'success'
			});
		},
		
		// 注册
		register() {
			if (!this.isFormValid) {
				uni.showToast({
					title: '请完成所有必填项',
					icon: 'none'
				});
				return;
			}
			
			if (this.password !== this.confirmPassword) {
				uni.showToast({
					title: '两次密码输入不一致',
					icon: 'none'
				});
				return;
			}
			
			// 构建注册数据
			const registerData = {
				phoneNumber: this.phoneNumber,
				verificationCode: this.verificationCode,
				username: this.username,
				password: this.password
			};
			
			// 这里应该调用注册API
			console.log('Register data:', registerData);
			
			// 模拟注册成功
			uni.showToast({
				title: '注册成功',
				icon: 'success',
				duration: 2000
			});
			
			// 注册成功后跳转到登录页
			setTimeout(() => {
				uni.redirectTo({
					url: '/pages/login/index'
				});
			}, 2000);
		},
		
		// 前往登录页面
		goToLogin() {
			uni.navigateBack();
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

.register-content {
	padding: 30rpx;
}

.register-header {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 40rpx;
}

.header-image {
	width: 120rpx;
	height: 120rpx;
	margin-bottom: 20rpx;
}

.register-title {
	font-size: 40rpx;
	font-weight: bold;
	color: #333;
	font-family: "FangSong", serif;
	margin-bottom: 10rpx;
}

.register-subtitle {
	font-size: 26rpx;
	color: #666;
	font-family: "SimSun", serif;
}

.form-wrapper {
	background-color: #FFFFFF;
	border-radius: 20rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	border: 1rpx solid rgba(224, 201, 209, 0.3);
}

.form-item {
	margin-bottom: 25rpx;
}

.form-label {
	display: block;
	font-size: 28rpx;
	color: #333;
	margin-bottom: 10rpx;
	font-family: "KaiTi", "FangSong";
}

.form-input {
	width: 100%;
	height: 80rpx;
	background-color: #F8F8F8;
	border-radius: 8rpx;
	padding: 0 20rpx;
	font-size: 28rpx;
	box-sizing: border-box;
	border: 1rpx solid #EFEFEF;
}

.verification-code .code-input-group {
	display: flex;
	align-items: center;
}

.verification-code .form-input {
	flex: 1;
}

.code-btn {
	width: 200rpx;
	height: 80rpx;
	background-color: #7EC4CF;
	color: #FFF;
	font-size: 24rpx;
	border-radius: 8rpx;
	margin-left: 20rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	white-space: nowrap;
	padding: 0;
}

.code-btn[disabled] {
	background-color: #CCCCCC;
	color: #FFFFFF;
}

.agreement {
	display: flex;
	align-items: center;
	margin-bottom: 30rpx;
}

.agreement-text {
	font-size: 24rpx;
	color: #666;
	margin-left: 10rpx;
}

.link-text {
	color: #7EC4CF;
}

.submit-btn {
	background-color: #7EC4CF;
	color: #FFFFFF;
	height: 90rpx;
	line-height: 90rpx;
	font-size: 32rpx;
	border-radius: 45rpx;
	font-family: "KaiTi", "FangSong";
}

.submit-btn[disabled] {
	background-color: #CCCCCC;
	color: #FFFFFF;
}

.login-link {
	margin-top: 40rpx;
	text-align: center;
	font-size: 28rpx;
	color: #666;
}

.link {
	color: #7EC4CF;
	font-weight: bold;
}
</style> 