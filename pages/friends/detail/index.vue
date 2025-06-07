<template>
	<view class="container">
		<!-- 使用自定义导航栏，设置showBack为true -->
		<custom-nav-bar title="好友详情" subtitle="Friend Details" :show-back="true"></custom-nav-bar>
		
		<view class="friend-detail">
			<view class="friend-header">
				<image class="friend-avatar" :src="friend.avatar" mode="aspectFill"></image>
				<view class="friend-info">
					<text class="friend-name">{{friend.name}}</text>
					<text class="friend-status" :class="friend.online ? 'online' : ''">{{friend.online ? '在线' : '离线'}}</text>
				</view>
			</view>
			
			<view class="info-section">
				<view class="info-item">
					<text class="label">个性签名</text>
					<text class="value">{{friend.signature}}</text>
				</view>
				
				<view class="info-item">
					<text class="label">所在地区</text>
					<text class="value">{{friend.location || '未设置'}}</text>
				</view>
				
				<view class="info-item">
					<text class="label">注册日期</text>
					<text class="value">{{friend.registerDate || '未知'}}</text>
				</view>
			</view>
			
			<view class="action-buttons">
				<button class="btn message-btn" @click="sendMessage">发送消息</button>
				<button class="btn delete-btn" @click="deleteFriend">删除好友</button>
			</view>
		</view>
		
		<!-- 页脚装饰元素 -->
		<view class="footer-decoration">
			<image src="/static/decoration/footer-pattern.png" mode="aspectFit" class="footer-image"></image>
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
			id: '',
			friend: {
				name: '加载中...',
				avatar: 'https://ykhyyy.oss-cn-beijing.aliyuncs.com/MyApp/userAvatar/default-avatar.png',
				signature: '加载中...',
				online: false,
				location: '',
				registerDate: ''
			}
		}
	},
	onLoad(options) {
		if (options.id) {
			this.id = options.id;
			this.loadFriendDetails();
		}
	},
	methods: {
		// 加载好友详细信息
		loadFriendDetails() {
			// 模拟加载数据
			// 实际应用中应该从API获取数据
			setTimeout(() => {
				this.friend = {
					id: this.id,
					name: '张三',
					avatar: 'https://ykhyyy.oss-cn-beijing.aliyuncs.com/MyApp/userAvatar/default-avatar.png',
					signature: '明月几时有，把酒问青天',
					online: true,
					location: '北京市',
					registerDate: '2023-01-15'
				};
			}, 500);
		},
		// 发送消息
		sendMessage() {
			uni.navigateTo({
				url: `/pages/messages/chat/index?id=${this.id}&name=${this.friend.name}`
			});
		},
		// 删除好友
		deleteFriend() {
			uni.showModal({
				title: '提示',
				content: `确定要删除好友"${this.friend.name}"吗？`,
				success: (res) => {
					if (res.confirm) {
						// 执行删除操作
						uni.showToast({
							title: '删除成功',
							icon: 'success',
							duration: 2000
						});
						
						// 返回上一页
						setTimeout(() => {
							uni.navigateBack();
						}, 2000);
					}
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
	background-image: url('/static/decoration/paper-texture.png');
	background-repeat: repeat;
}

.friend-detail {
	padding: 30rpx;
}

.friend-header {
	display: flex;
	align-items: center;
	background-color: #FFFFFF;
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 30rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	border: 1rpx solid rgba(224, 201, 209, 0.5);
}

.friend-avatar {
	width: 140rpx;
	height: 140rpx;
	border-radius: 70rpx;
	margin-right: 30rpx;
	border: 2rpx solid rgba(126, 196, 207, 0.3);
}

.friend-info {
	flex: 1;
}

.friend-name {
	font-size: 36rpx;
	color: #333;
	font-weight: bold;
	margin-bottom: 10rpx;
	font-family: "KaiTi", "FangSong";
}

.friend-status {
	display: inline-block;
	font-size: 24rpx;
	color: #999;
	background-color: #f0f0f0;
	padding: 4rpx 20rpx;
	border-radius: 30rpx;
}

.friend-status.online {
	background-color: rgba(126, 196, 207, 0.2);
	color: #7EC4CF;
}

.info-section {
	background-color: #FFFFFF;
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 30rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	border: 1rpx solid rgba(224, 201, 209, 0.5);
}

.info-item {
	border-bottom: 1rpx solid #f5f5f5;
	padding: 20rpx 0;
}

.info-item:last-child {
	border-bottom: none;
}

.label {
	font-size: 28rpx;
	color: #999;
	margin-bottom: 10rpx;
	display: block;
}

.value {
	font-size: 32rpx;
	color: #333;
	font-family: "SimSun", serif;
}

.action-buttons {
	margin-bottom: 30rpx;
}

.btn {
	width: 100%;
	margin-bottom: 20rpx;
	border-radius: 10rpx;
	padding: 20rpx 0;
	font-size: 32rpx;
	font-family: "KaiTi", "FangSong";
}

.message-btn {
	background-color: #7EC4CF;
	color: #fff;
}

.delete-btn {
	background-color: #f5f5f5;
	color: #8A3324;
}

.footer-decoration {
	margin-top: 60rpx;
	padding-bottom: 30rpx;
	display: flex;
	justify-content: center;
}

.footer-image {
	width: 400rpx;
	height: 60rpx;
}
</style> 