<template>
	<view class="container">
		<!-- 自定义中国风导航栏 -->
		<view class="custom-nav">
			<image class="nav-bg" src="/static/images/nav-proxy.png" mode="aspectFill"></image>
			<view class="nav-content">
				<text class="nav-title">代取速递</text>
				<text class="nav-subtitle">校园速递服务</text>
			</view>
		</view>
		
		<view class="header">
			<view class="search-box">
				<view class="search-input-wrapper">
					<image src="/static/icons/search.png" class="search-icon"></image>
					<input class="search-input" type="text" placeholder="搜索快递服务" />
				</view>
			</view>
		</view>
		
		<!-- 服务类型选择 -->
		<view class="service-types">
			<view class="service-item active">
				<image src="/static/icons/express.png" class="service-icon"></image>
				<text class="service-text">快递代取</text>
			</view>
			<view class="service-item">
				<image src="/static/icons/food.png" class="service-icon"></image>
				<text class="service-text">餐食代买</text>
			</view>
			<view class="service-item">
				<image src="/static/icons/grocery.png" class="service-icon"></image>
				<text class="service-text">物品代购</text>
			</view>
		</view>
		
		<!-- 快递表单 -->
		<view class="express-form">
			<view class="form-title">
				<image src="/static/decoration/title-decoration.png" class="title-decoration"></image>
				<text>填写快递信息</text>
			</view>
			
			<view class="form-item">
				<text class="form-label">快递公司</text>
				<picker class="form-input" value="0" range-key="name" range="{{expressCompanies}}">
					<view class="picker-text">请选择快递公司</view>
				</picker>
			</view>
			
			<view class="form-item">
				<text class="form-label">取件码</text>
				<input class="form-input" placeholder="请输入取件码" />
			</view>
			
			<view class="form-item">
				<text class="form-label">收件地址</text>
				<input class="form-input" placeholder="宿舍楼/教学楼/办公楼" />
			</view>
			
			<view class="form-item">
				<text class="form-label">联系方式</text>
				<input class="form-input" placeholder="请输入手机号码" />
			</view>
			
			<view class="form-item">
				<text class="form-label">备注说明</text>
				<textarea class="form-textarea" placeholder="备注信息（选填）" />
			</view>
			
			<view class="submit-btn">
				<text>提交代取申请</text>
			</view>
		</view>
		
		<!-- 代取说明 -->
		<view class="proxy-info">
			<view class="info-title">服务说明</view>
			<view class="info-item">
				<text class="info-dot">•</text>
				<text class="info-text">服务时间：周一至周日 10:00-20:00</text>
			</view>
			<view class="info-item">
				<text class="info-dot">•</text>
				<text class="info-text">收费标准：校内快递 3元/件</text>
			</view>
			<view class="info-item">
				<text class="info-dot">•</text>
				<text class="info-text">服务范围：仅限校内各快递点</text>
			</view>
		</view>
		
		<!-- AI助手组件 -->
		<ai-assistant></ai-assistant>
	</view>
</template>

<script>
	import AiAssistant from '@/components/AiAssistant.vue';
	
	export default {
		components: {
			AiAssistant
		},
		data() {
			return {
				expressCompanies: [
					{ name: '顺丰速运', id: 'sf' },
					{ name: '中通快递', id: 'zto' },
					{ name: '圆通速递', id: 'yto' },
					{ name: '韵达快递', id: 'yd' },
					{ name: '申通快递', id: 'sto' },
					{ name: '京东物流', id: 'jd' },
					{ name: '邮政快递', id: 'ems' }
				]
			}
		},
		methods: {
			
		}
	}
</script>

<style>
	.container {
		background-color: #F8F3E6; /* 宣纸色 */
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
		color: #333;
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
		border: 1rpx solid #D7C9AA; /* 淡竹色 */
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
	
	/* 服务类型 */
	.service-types {
		display: flex;
		justify-content: space-around;
		padding: 30rpx;
		margin: 0 30rpx 30rpx;
		background-color: #fff;
		border-radius: 20rpx;
		box-shadow: 0 4rpx 8rpx rgba(0,0,0,0.05);
		border: 1rpx solid #D7C9AA; /* 淡竹色 */
	}
	
	.service-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 20rpx;
		border-radius: 10rpx;
	}
	
	.service-item.active {
		background-color: rgba(138, 51, 36, 0.1); /* 朱砂红透明 */
		border: 2rpx solid #8A3324; /* 朱砂红 */
	}
	
	.service-icon {
		width: 80rpx;
		height: 80rpx;
		margin-bottom: 10rpx;
	}
	
	.service-text {
		font-size: 28rpx;
		color: #333;
		font-family: "KaiTi", "FangSong";
	}
	
	/* 表单样式 */
	.express-form {
		margin: 0 30rpx 30rpx;
		padding: 30rpx;
		background-color: #fff;
		border-radius: 20rpx;
		box-shadow: 0 4rpx 8rpx rgba(0,0,0,0.05);
		border: 1rpx solid #D7C9AA; /* 淡竹色 */
	}
	
	.form-title {
		display: flex;
		align-items: center;
		margin-bottom: 30rpx;
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
		font-family: "FangSong", serif;
	}
	
	.title-decoration {
		width: 40rpx;
		height: 40rpx;
		margin-right: 10rpx;
	}
	
	.form-item {
		margin-bottom: 20rpx;
	}
	
	.form-label {
		display: block;
		font-size: 28rpx;
		color: #8C7853; /* 古铜色 */
		margin-bottom: 10rpx;
	}
	
	.form-input {
		width: 100%;
		height: 80rpx;
		background-color: #f8f8f8;
		border-radius: 10rpx;
		padding: 0 20rpx;
		font-size: 28rpx;
		color: #333;
		border: 1rpx solid #D7C9AA; /* 淡竹色 */
	}
	
	.picker-text {
		height: 80rpx;
		line-height: 80rpx;
		color: #999;
	}
	
	.form-textarea {
		width: 100%;
		height: 160rpx;
		background-color: #f8f8f8;
		border-radius: 10rpx;
		padding: 20rpx;
		font-size: 28rpx;
		color: #333;
		border: 1rpx solid #D7C9AA; /* 淡竹色 */
	}
	
	.submit-btn {
		height: 90rpx;
		background-color: #8A3324; /* 朱砂红 */
		color: #fff;
		border-radius: 45rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 32rpx;
		margin-top: 40rpx;
		box-shadow: 0 6rpx 10rpx rgba(138, 51, 36, 0.3);
		font-family: "FangSong", serif;
	}
	
	/* 服务说明 */
	.proxy-info {
		margin: 0 30rpx 30rpx;
		padding: 30rpx;
		background-color: #fff;
		border-radius: 20rpx;
		box-shadow: 0 4rpx 8rpx rgba(0,0,0,0.05);
		border: 1rpx solid #D7C9AA; /* 淡竹色 */
	}
	
	.info-title {
		font-size: 30rpx;
		color: #333;
		margin-bottom: 16rpx;
		font-weight: bold;
		font-family: "FangSong", serif;
	}
	
	.info-item {
		display: flex;
		margin-bottom: 10rpx;
	}
	
	.info-dot {
		color: #8A3324; /* 朱砂红 */
		margin-right: 10rpx;
		font-weight: bold;
	}
	
	.info-text {
		font-size: 26rpx;
		color: #8C7853; /* 古铜色 */
		line-height: 1.5;
	}
</style> 