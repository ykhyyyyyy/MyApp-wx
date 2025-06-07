<template>
	<view class="container">
		<!-- 使用自定义导航栏 -->
		<custom-nav-bar title="我的好友" :show-back="false"></custom-nav-bar>
		
		<!-- 搜索框 -->
		<view class="header">
			<view class="search-box">
				<view class="search-input-wrapper">
					<image src="/static/icons/search.png" class="search-icon"></image>
					<input class="search-input" type="text" placeholder="搜索好友" />
				</view>
			</view>
		</view>
		
		<!-- 好友列表 -->
		<view class="friends-section">
			<!-- 装饰标题 -->
			<view class="section-header">
				<image class="section-title-decoration" src="/static/decoration/title-left.png" mode="aspectFit"></image>
				<text class="section-title">我的好友</text>
				<image class="section-title-decoration" src="/static/decoration/title-right.png" mode="aspectFit"></image>
			</view>
			
			<view class="friends-list">
				<view class="friend-item" v-for="(friend, index) in friendsList" :key="index" @click="viewFriendDetail(friend.id)">
					<image :src="friend.avatar" class="friend-avatar"></image>
					<view class="friend-info">
						<view class="friend-name-row">
							<text class="friend-name">{{friend.name}}</text>
							<text class="friend-status" :class="friend.online ? 'online' : ''">{{friend.online ? '在线' : '离线'}}</text>
						</view>
						<text class="friend-signature">{{friend.signature}}</text>
					</view>
					<view class="friend-actions">
						<button class="btn-message" @click.stop="sendMessage(friend.id)">发消息</button>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 添加好友按钮 - 更新图标和点击事件 -->
		<view class="add-friend" @click="goToAddFriend">
			<text class="add-icon-text">+</text>
		</view>
		
		<!-- 页脚装饰元素 -->
		<view class="footer-decoration">
			<image src="/static/decoration/footer-pattern.png" mode="aspectFit" class="footer-image"></image>
		</view>
	</view>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import CustomNavBar from '@/components/CustomNavBar.vue';

export default {
	components: {
		CustomNavBar
	},
	data() {
		return {
			friendsList: [
				{
					id: '1',
					name: '张三',
					avatar: 'https://ykhyyy.oss-cn-beijing.aliyuncs.com/MyApp/userAvatar/default-avatar.png',
					signature: '明月几时有，把酒问青天',
					online: true
				},
				{
					id: '2',
					name: '李四',
					avatar: 'https://ykhyyy.oss-cn-beijing.aliyuncs.com/MyApp/userAvatar/default-avatar.png',
					signature: '人生得意须尽欢，莫使金樽空对月',
					online: true
				},
				{
					id: '3',
					name: '王五',
					avatar: 'https://ykhyyy.oss-cn-beijing.aliyuncs.com/MyApp/userAvatar/default-avatar.png',
					signature: '床前明月光，疑是地上霜',
					online: false
				},
				{
					id: '4',
					name: '赵六',
					avatar: 'https://ykhyyy.oss-cn-beijing.aliyuncs.com/MyApp/userAvatar/default-avatar.png',
					signature: '不知天上宫阙，今夕是何年',
					online: false
				}
			]
		}
	},
	computed: {
		...mapState('friend', ['friendList','friendRequests','maybeKnowList','isLoading']),
		friends() { return this.friendList; },
		requests() { return this.friendRequests; },
		maybeList() { return this.maybeKnowList; }
	},
	onLoad() {
		this.loadAll();
	},
	methods: {
		...mapActions('friend', ['getFriendList','getFriendRequests','getMaybeKnow','addFriend','updateFriendStatus','deleteFriend']),
		loadAll() {
			this.getFriendList({userId:1});
			this.getFriendRequests({userId:1});
			this.getMaybeKnow(1);
		},
		addNewFriend(friendId) { 
			this.addFriend({userId:1,friendId}).then(()=>this.loadAll()); 
		},
		updateStatus(id,status) { 
			this.updateFriendStatus({id,status}).then(()=>this.loadAll()); 
		},
		removeFriend(id) { 
			this.deleteFriend(id).then(()=>this.loadAll()); 
		},
		viewFriendDetail(id) {
			uni.navigateTo({
				url: `/pages/friends/detail?id=${id}`
			});
		},
		sendMessage(id) {
			uni.navigateTo({
				url: `/pages/messages/chat/index?id=${id}`
			});
		},
		// 添加新方法 - 跳转到添加好友页面
		goToAddFriend() {
			uni.navigateTo({
				url: '/pages/friends/add-friend'
			});
		}
	}
}
</script>

<style>
.container {
	background-color: #F8F7F2; /* 淡奶油色背景 */
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
	box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05);
	background-image: url('/static/decoration/paper-subtle.png');
}

.search-icon {
	width: 36rpx;
	height: 36rpx;
	margin-right: 10rpx;
}

.search-input {
	flex: 1;
	height: 70rpx;
	font-size: 28rpx;
	font-family: "FangSong", serif;
}

/* 好友列表部分 */
.friends-section {
	margin: 30rpx;
	background-color: #FFFFFF;
	border-radius: 20rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	border: 1rpx solid rgba(224, 201, 209, 0.5); /* 浅色边框 */
}

.section-header {
	display: flex;
	justify-content: center;
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

.friends-list {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.friend-item {
	display: flex;
	align-items: center;
	padding: 20rpx;
	background-image: url('/static/decoration/paper-subtle.png');
	border-radius: 16rpx;
	box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
	border-left: 4rpx solid #7EC4CF; /* 主色调青色 */
}

.friend-avatar {
	width: 100rpx;
	height: 100rpx;
	border-radius: 50rpx;
	margin-right: 20rpx;
	border: 2rpx solid rgba(126, 196, 207, 0.3);
}

.friend-info {
	flex: 1;
}

.friend-name-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10rpx;
}

.friend-name {
	font-size: 32rpx;
	color: #333;
	font-weight: bold;
	font-family: "KaiTi", "FangSong";
}

.friend-status {
	font-size: 24rpx;
	color: #999;
	background-color: #f0f0f0;
	padding: 4rpx 12rpx;
	border-radius: 20rpx;
	font-family: "SimSun", serif;
}

.friend-status.online {
	background-color: rgba(126, 196, 207, 0.2);
	color: #7EC4CF;
}

.friend-signature {
	font-size: 26rpx;
	color: #666;
	font-family: "SimSun", serif;
}

.friend-actions {
	margin-left: 10rpx;
}

.btn-message {
	background-color: #7EC4CF;
	color: white;
	font-size: 24rpx;
	padding: 10rpx 20rpx;
	border-radius: 30rpx;
	line-height: 1;
	font-family: "KaiTi", "FangSong";
	border: none;
}

/* 添加好友按钮 - 更新样式 */
.add-friend {
	position: fixed;
	right: 40rpx;
	bottom: 120rpx;
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	background-color: #8A3324;
	display: flex;
	justify-content: center;
	align-items: center;
	box-shadow: 0 4rpx 10rpx rgba(138, 51, 36, 0.3);
	z-index: 99;
}

.add-icon-text {
	color: white;
	font-size: 60rpx;
	font-weight: bold;
	line-height: 1;
}

/* 页脚装饰 */
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