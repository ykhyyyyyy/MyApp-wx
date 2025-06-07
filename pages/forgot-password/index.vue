<template>
	<view class="container">
		<!-- 使用自定义导航栏，设置showBack为true -->
		<custom-nav-bar title="找回密码" subtitle="Password Reset" :show-back="true"></custom-nav-bar>
		
		<view class="content">
			<view class="header">
				<image src="/static/decoration/title-decoration.png" mode="aspectFit" class="header-image"></image>
				<text class="title">找回密码</text>
				<text class="subtitle">请填写以下信息验证身份</text>
			</view>
			
			<view class="form-wrapper">
				<view class="step-indicator">
					<view class="step" :class="{active: step >= 1, completed: step > 1}">
						<text class="step-num">1</text>
						<text class="step-text">验证手机</text>
					</view>
					<view class="step-line" :class="{active: step > 1}"></view>
					<view class="step" :class="{active: step >= 2, completed: step > 2}">
						<text class="step-num">2</text>
						<text class="step-text">重设密码</text>
					</view>
					<view class="step-line" :class="{active: step > 2}"></view>
					<view class="step" :class="{active: step >= 3}">
						<text class="step-num">3</text>
						<text class="step-text">完成</text>
					</view>
				</view>
				
				<!-- 第一步：验证手机号 -->
				<view v-if="step === 1" class="step-content">
					<view class="form-item">
						<text class="form-label">手机号码</text>
						<input class="form-input" v-model="phoneNumber" type="number" placeholder="请输入注册手机号" maxlength="11" />
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
					
					<button class="submit-btn" @click="verifyPhone" :disabled="!canVerifyPhone">下一步</button>
				</view>
				
				<!-- 第二步：设置新密码 -->
				<view v-if="step === 2" class="step-content">
					<view class="form-item">
						<text class="form-label">新密码</text>
						<input class="form-input" v-model="newPassword" type="password" placeholder="请输入新密码" />
					</view>
					
					<view class="form-item">
						<text class="form-label">确认密码</text>
						<input class="form-input" v-model="confirmPassword" type="password" placeholder="请再次输入新密码" />
					</view>
					
					<button class="submit-btn" @click="resetPassword" :disabled="!canResetPassword">提交</button>
				</view>
				
				<!-- 第三步：完成 -->
				<view v-if="step === 3" class="step-content">
					<view class="success-message">
						<image src="/static/icons/order-completed.png" class="success-icon"></image>
						<text class="success-text">密码重置成功</text>
						<text class="success-tip">您的密码已经重置成功，请使用新密码登录</text>
					</view>
					
					<button class="submit-btn" @click="goToLogin">立即登录</button>
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
			step: 1,
			phoneNumber: '',
			verificationCode: '',
			newPassword: '',
			confirmPassword: '',
			countdown: 0,
			countdownTimer: null
		}
	},
	computed: {
		canVerifyPhone() {
			return this.phoneNumber && this.phoneNumber.length === 11 && this.verificationCode;
		},
		canResetPassword() {
			return this.newPassword && this.confirmPassword && (this.newPassword === this.confirmPassword);
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
		
		// 验证手机号
		verifyPhone() {
			if (!this.canVerifyPhone) {
				uni.showToast({
					title: '请填写完整信息',
					icon: 'none'
				});
				return;
			}
			
			// 这里应该调用验证手机号和验证码的API
			// 验证成功后进入下一步
			uni.showToast({
				title: '验证成功',
				icon: 'success',
				duration: 1500
			});
			
			setTimeout(() => {
				this.step = 2;
			}, 1500);
		},
		
		// 重置密码
		resetPassword() {
			if (!this.canResetPassword) {
				uni.showToast({
					title: '请填写完整信息',
					icon: 'none'
				});
				return;
			}
			
			if (this.newPassword !== this.confirmPassword) {
				uni.showToast({
					title: '两次密码输入不一致',
					icon: 'none'
				});
				return;
			}
			
			// 这里应该调用重置密码的API
			uni.showToast({
				title: '密码重置成功',
				icon: 'success',
				duration: 1500
			});
			
			setTimeout(() => {
				this.step = 3;
			}, 1500);
		},
		
		// 前往登录页面
		goToLogin() {
			uni.redirectTo({
				url: '/pages/login/index'
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

.content {
	padding: 30rpx;
}

.header {
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

.title {
	font-size: 40rpx;
	font-weight: bold;
	color: #333;
	font-family: "FangSong", serif;
	margin-bottom: 10rpx;
}

.subtitle {
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

.step-indicator {
	display: flex;
	justify-content: center;
	align-items: center;
	margin-bottom: 40rpx;
	padding: 20rpx 0;
}

.step {
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
	z-index: 1;
}

.step-num {
	width: 50rpx;
	height: 50rpx;
	border-radius: 25rpx;
	background-color: #F0F0F0;
	color: #999;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 28rpx;
	font-weight: bold;
	margin-bottom: 10rpx;
}

.step-text {
	font-size: 24rpx;
	color: #999;
	white-space: nowrap;
}

.step.active .step-num {
	background-color: #7EC4CF;
	color: #FFF;
}

.step.active .step-text {
	color: #7EC4CF;
}

.step.completed .step-num {
	background-color: #7EC4CF;
	color: #FFF;
}

.step.completed .step-num::after {
	content: "✓";
}

.step-line {
	height: 2rpx;
	flex: 1;
	background-color: #F0F0F0;
	margin: 0 15rpx;
	position: relative;
	top: -15rpx;
}

.step-line.active {
	background-color: #7EC4CF;
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

.submit-btn {
	background-color: #7EC4CF;
	color: #FFFFFF;
	height: 90rpx;
	line-height: 90rpx;
	font-size: 32rpx;
	border-radius: 45rpx;
	margin-top: 30rpx;
	font-family: "KaiTi", "FangSong";
}

.submit-btn[disabled] {
	background-color: #CCCCCC;
	color: #FFFFFF;
}

.success-message {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 40rpx 0;
}

.success-icon {
	width: 100rpx;
	height: 100rpx;
	margin-bottom: 30rpx;
}

.success-text {
	font-size: 36rpx;
	color: #333;
	font-weight: bold;
	margin-bottom: 20rpx;
	font-family: "FangSong", serif;
}

.success-tip {
	font-size: 28rpx;
	color: #666;
	text-align: center;
	font-family: "SimSun", serif;
	line-height: 1.5;
}
</style> 