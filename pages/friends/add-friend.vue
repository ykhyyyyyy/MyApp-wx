<template>
	<view class="container">
		<!-- 使用自定义导航栏 -->
		<custom-nav-bar title="添加好友" :show-back="true"></custom-nav-bar>
		
		<!-- 搜索区域 -->
		<view class="search-section">
			<view class="search-box">
				<view class="search-input-wrapper">
					<image src="/static/icons/search.png" class="search-icon"></image>
					<input class="search-input" v-model="searchKeyword" type="text" placeholder="输入用户ID或昵称搜索" @confirm="searchUser" />
				</view>
				<button class="search-button" @click="searchUser">搜索</button>
			</view>
			<text class="search-tip">提示：您可以通过用户ID或昵称查找好友</text>
		</view>
		
		<!-- 搜索结果 -->
		<view class="search-result" v-if="searchResult">
			<!-- 用户信息卡片 -->
			<view class="user-card">
				<image class="user-avatar" :src="searchResult.avatar || defaultAvatar"></image>
				<view class="user-info">
					<text class="user-name">{{searchResult.name}}</text>
					<text class="user-id">ID: {{searchResult.id}}</text>
					<text class="user-signature">{{searchResult.signature || '这个人很懒，什么都没写'}}</text>
				</view>
				<view class="action-buttons">
					<button class="add-button" @click="addFriend" :disabled="isFriend || isAdding">
						<text v-if="isFriend">已是好友</text>
						<text v-else-if="isAdding">添加中...</text>
						<text v-else>添加好友</text>
					</button>
				</view>
			</view>
		</view>
		
		<!-- 可能认识的人 -->
		<view class="maybe-know-section" v-if="maybeKnowList.length > 0">
			<view class="section-header">
				<image class="section-title-decoration" src="/static/decoration/title-left.png" mode="aspectFit"></image>
				<text class="section-title">可能认识的人</text>
				<image class="section-title-decoration" src="/static/decoration/title-right.png" mode="aspectFit"></image>
			</view>
			
			<view class="maybe-know-list">
				<view class="maybe-know-item" v-for="(user, index) in maybeKnowList" :key="index">
					<image class="maybe-avatar" :src="user.avatar || defaultAvatar"></image>
					<view class="maybe-info">
						<text class="maybe-name">{{user.name}}</text>
						<text class="maybe-common" v-if="user.commonFriends">{{user.commonFriends}}个共同好友</text>
					</view>
					<button class="maybe-add-btn" @click="addFriendById(user.id)">添加</button>
				</view>
			</view>
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
			searchKeyword: '',
			searchResult: null,
			isFriend: false,
			isAdding: false,
			defaultAvatar: 'https://ykhyyy.oss-cn-beijing.aliyuncs.com/MyApp/userAvatar/default-avatar.png'
		}
	},
	computed: {
		...mapState('friend', ['maybeKnowList'])
	},
	onLoad() {
		// 加载可能认识的人
		this.getMaybeKnow(1);
	},
	methods: {
		...mapActions('friend', ['addFriend', 'checkFriendRelation', 'getMaybeKnow']),
		
		// 搜索用户
		searchUser() {
			if (!this.searchKeyword.trim()) {
				uni.showToast({
					title: '请输入搜索内容',
					icon: 'none'
				});
				return;
			}
			
			// 显示加载中
			uni.showLoading({
				title: '搜索中...'
			});
			
			// 这里应该调用后端接口搜索用户
			// 模拟搜索结果
			setTimeout(() => {
				uni.hideLoading();
				
				// 模拟搜索结果，实际应该从后端获取
				this.searchResult = {
					id: 10,
					name: '搜索用户',
					avatar: this.defaultAvatar,
					signature: '这是一个搜索到的用户'
				};
				
				// 检查是否已经是好友
				this.checkFriendStatus(1, this.searchResult.id);
			}, 500);
		},
		
		// 检查好友关系
		checkFriendStatus(userId, friendId) {
			this.checkFriendRelation({ userId, friendId }).then(res => {
				this.isFriend = res && res.data === true;
			}).catch(() => {
				this.isFriend = false;
			});
		},
		
		// 添加搜索结果为好友
		addFriend() {
			if (!this.searchResult || this.isFriend || this.isAdding) return;
			
			this.isAdding = true;
			
			// 调用添加好友接口
			this.addFriend({
				userId: 1, // 当前用户ID
				friendId: this.searchResult.id
			}).then(res => {
				if (res && res.code === 1) {
					uni.showToast({
						title: '好友请求已发送',
						icon: 'success'
					});
					
					// 更新状态
					this.isFriend = true;
				} else {
					uni.showToast({
						title: res.msg || '添加失败',
						icon: 'none'
					});
				}
			}).catch(err => {
				uni.showToast({
					title: '添加失败',
					icon: 'none'
				});
				console.error('添加好友失败:', err);
			}).finally(() => {
				this.isAdding = false;
			});
		},
		
		// 添加推荐好友
		addFriendById(friendId) {
			if (!friendId) return;
			
			uni.showLoading({
				title: '处理中...'
			});
			
			// 调用添加好友接口
			this.addFriend({
				userId: 1, // 当前用户ID
				friendId: friendId
			}).then(res => {
				if (res && res.code === 1) {
					uni.showToast({
						title: '好友请求已发送',
						icon: 'success'
					});
					
					// 刷新可能认识的人列表
					this.getMaybeKnow(1);
				} else {
					uni.showToast({
						title: res.msg || '添加失败',
						icon: 'none'
					});
				}
			}).catch(err => {
				uni.showToast({
					title: '添加失败',
					icon: 'none'
				});
				console.error('添加好友失败:', err);
			}).finally(() => {
				uni.hideLoading();
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

/* 搜索区域 */
.search-section {
	padding: 30rpx;
	background-color: rgba(255, 255, 255, 0.7);
	border-bottom: 1px solid #e0c9d1;
}

.search-box {
	display: flex;
	align-items: center;
}

.search-input-wrapper {
	flex: 1;
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

.search-button {
	margin-left: 20rpx;
	background-color: #8A3324;
	color: white;
	font-size: 28rpx;
	padding: 0 30rpx;
	height: 70rpx;
	line-height: 70rpx;
	border-radius: 35rpx;
	font-family: "FangSong", serif;
}

.search-tip {
	font-size: 24rpx;
	color: #999;
	margin-top: 10rpx;
	font-family: "SimSun", serif;
}

/* 搜索结果 */
.search-result {
	padding: 30rpx;
}

.user-card {
	display: flex;
	align-items: center;
	background-color: #FFFFFF;
	border-radius: 20rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	border: 1rpx solid rgba(224, 201, 209, 0.5);
	background-image: url('/static/decoration/paper-subtle.png');
}

.user-avatar {
	width: 120rpx;
	height: 120rpx;
	border-radius: 60rpx;
	margin-right: 30rpx;
	border: 2rpx solid rgba(126, 196, 207, 0.3);
}

.user-info {
	flex: 1;
}

.user-name {
	font-size: 36rpx;
	color: #333;
	font-weight: bold;
	margin-bottom: 10rpx;
	font-family: "KaiTi", "FangSong";
}

.user-id {
	font-size: 24rpx;
	color: #666;
	margin-bottom: 10rpx;
	font-family: "SimSun", serif;
}

.user-signature {
	font-size: 26rpx;
	color: #666;
	font-family: "SimSun", serif;
}

.action-buttons {
	margin-left: 20rpx;
}

.add-button {
	background-color: #8A3324;
	color: white;
	font-size: 28rpx;
	padding: 0 30rpx;
	height: 70rpx;
	line-height: 70rpx;
	border-radius: 35rpx;
	font-family: "FangSong", serif;
}

.add-button[disabled] {
	background-color: #ccc;
	color: #fff;
}

/* 可能认识的人 */
.maybe-know-section {
	margin: 30rpx;
	background-color: #FFFFFF;
	border-radius: 20rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	border: 1rpx solid rgba(224, 201, 209, 0.5);
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

.maybe-know-list {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.maybe-know-item {
	display: flex;
	align-items: center;
	padding: 20rpx;
	background-image: url('/static/decoration/paper-subtle.png');
	border-radius: 16rpx;
	box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
	border-left: 4rpx solid #8A3324;
}

.maybe-avatar {
	width: 80rpx;
	height: 80rpx;
	border-radius: 40rpx;
	margin-right: 20rpx;
	border: 2rpx solid rgba(138, 51, 36, 0.3);
}

.maybe-info {
	flex: 1;
}

.maybe-name {
	font-size: 30rpx;
	color: #333;
	font-weight: bold;
	font-family: "KaiTi", "FangSong";
	margin-bottom: 6rpx;
}

.maybe-common {
	font-size: 24rpx;
	color: #666;
	font-family: "SimSun", serif;
}

.maybe-add-btn {
	background-color: #7EC4CF;
	color: white;
	font-size: 24rpx;
	padding: 10rpx 20rpx;
	border-radius: 30rpx;
	line-height: 1;
	font-family: "KaiTi", "FangSong";
	border: none;
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