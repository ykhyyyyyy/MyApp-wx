<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// Load user data from storage if available
			this.$store.dispatch('user/loadUserFromStorage')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	
	/* 全局变量 - 中国风颜色主题 */
	page {
		/* 传统中国红 - 主色调 */
		--primary-red: #8A3324;
		/* 米色纸张 - 背景色 */
		--bg-paper: #F8F3E6;
		/* 暗金黄色 - 次要颜色 */
		--accent-gold: #8C7853;
		/* 温暖奶白色 - 浅色元素 */
		--light-cream: #E0C9D1;
		/* 深棕色 - 文字颜色 */
		--text-brown: #4A3520;
		
		/* 设置全局背景色 */
		background-color: var(--bg-paper);
	}
	
	/* 修复底部安全区域，为自定义TabBar预留空间 */
	.page-content-with-tabbar {
		padding-bottom: 120rpx; /* 与TabBar高度一致 */
		min-height: calc(100vh - 120rpx);
	}
	
	/* 常用中国风样式类 */
	.chinese-border {
		border: 2rpx solid var(--accent-gold);
		box-shadow: 0 0 10rpx rgba(140, 120, 83, 0.3);
	}
	
	.chinese-gradient {
		background-image: linear-gradient(to right, var(--primary-red), var(--light-cream), var(--primary-red));
	}
	
	/* 标题文字中国风样式 */
	.chinese-title {
		font-weight: bold;
		color: var(--primary-red);
		text-shadow: 1px 1px 2px rgba(228, 172, 182, 0.3);
		letter-spacing: 2px;
	}
	
	/* 按钮中国风样式 */
	.chinese-button {
		background-color: var(--primary-red);
		color: var(--bg-paper);
		border-radius: 8rpx;
		padding: 15rpx 30rpx;
		font-weight: 500;
		box-shadow: 0 4rpx 8rpx rgba(138, 51, 36, 0.3);
	}
</style>
