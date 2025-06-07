<template>
	<view class="container">
		<!-- 使用自定义导航栏，设置showBack为true -->
		<custom-nav-bar :title="chatTitle" subtitle="聊天详情" :show-back="true"></custom-nav-bar>
		
		<view class="chat-container">
			<scroll-view scroll-y="true" class="chat-list" :scroll-top="scrollTop" @scrolltoupper="loadMoreMessages">
				<!-- 加载更多提示 -->
				<view v-if="isLoadingMore" class="loading-more">
					<text>加载更多消息...</text>
				</view>
				
				<!-- 聊天消息列表 -->
				<view class="chat-item" v-for="(msg, index) in messages" :key="index" :class="{ 'self': msg.isSelf }">
					<view v-if="!msg.isSelf" class="avatar-container">
						<image class="avatar" :src="friendAvatar"></image>
					</view>
					
					<view class="message-content" :class="{ 'self-message': msg.isSelf, 'revoked': msg.isRevoked === 1 }">
						<text v-if="msg.isRevoked === 1" class="revoked-text">消息已撤回</text>
						<text v-else class="message-text">{{msg.content}}</text>
						<text class="message-time">{{formatTime(msg.sendTime)}}</text>
						
						<!-- 消息操作菜单 - 仅显示自己发的消息且未撤回的 -->
						<view v-if="msg.isSelf && msg.isRevoked !== 1" class="message-actions">
							<text @click="revokeMessage(msg)" class="action-item">撤回</text>
							<text @click="deleteMessage(msg)" class="action-item">删除</text>
						</view>
					</view>
					
					<view v-if="msg.isSelf" class="avatar-container">
						<image class="avatar" src="https://ykhyyy.oss-cn-beijing.aliyuncs.com/MyApp/userAvatar/default-avatar.png"></image>
					</view>
				</view>
				
				<!-- 空消息提示 -->
				<view v-if="messages.length === 0" class="empty-messages">
					<text>暂无消息，开始聊天吧</text>
				</view>
			</scroll-view>
			
			<view class="input-area">
				<input type="text" class="message-input" v-model="inputMessage" placeholder="输入消息..." confirm-type="send" @confirm="sendMessage" />
				<view class="send-btn" @click="sendMessage">发送</view>
			</view>
		</view>
	</view>
</template>

<script>
import CustomNavBar from '@/components/CustomNavBar.vue';
import config from '@/config/index.js';

export default {
	components: {
		CustomNavBar
	},
	data() {
		return {
			friendId: '',
			friendName: '对方',
			friendAvatar: 'https://ykhyyy.oss-cn-beijing.aliyuncs.com/MyApp/userAvatar/default-avatar.png',
			messages: [],
			inputMessage: '',
			scrollTop: 0,
			isLoadingMore: false,
			currentUserId: 1, // 当前用户ID，实际项目中应该从登录信息获取
			currentPage: 1,
			pageSize: 20,
			hasMore: true,
			// WebSocket连接
			socket: null
		}
	},
	computed: {
		chatTitle() {
			return this.friendName || '聊天';
		}
	},
	onLoad(options) {
		console.log('聊天页面参数:', options);
		if (options.id) {
			this.friendId = options.id;
		}
		if (options.name) {
			this.friendName = options.name;
		}
		
		// 加载聊天记录
		this.loadChatHistory();
		
		// 初始化WebSocket (可选实现)
		// this.initWebSocket();
	},
	onUnload() {
		// 关闭WebSocket连接
		if (this.socket) {
			this.socket.close();
		}
	},
	methods: {
		// 加载聊天记录
		loadChatHistory(refresh = true) {
			if (refresh) {
				this.currentPage = 1;
				this.messages = [];
				this.hasMore = true;
			}
			
			if (!this.hasMore) return;
			
			uni.showLoading({
				title: '加载中...'
			});
			
			uni.request({
				url: `${config.BaseUrl}/api/friend/chat/message/list`,
				method: 'GET',
				data: {
					senderId: this.currentUserId,
					receiverId: this.friendId,
					page: this.currentPage,
					pageSize: this.pageSize
				},
				header: {
					'content-type': 'application/json'
				},
				success: (res) => {
					console.log('获取聊天记录成功:', res.data);
					if (res.data && res.data.code === 1) {
						const records = res.data.data || [];
						
						// 处理消息数据
						const formattedMessages = records.map(msg => ({
							id: msg.id,
							content: msg.content,
							sendTime: msg.sendTime,
							isSelf: msg.senderId === this.currentUserId,
							isRead: msg.isRead,
							isRevoked: msg.isRevoked
						}));
						
						if (refresh) {
							this.messages = formattedMessages;
						} else {
							this.messages = [...formattedMessages, ...this.messages];
						}
						
						// 判断是否还有更多消息
						this.hasMore = records.length === this.pageSize;
						
						// 第一次加载完成后，滚动到底部
						if (refresh) {
							this.$nextTick(() => {
								this.scrollToBottom();
							});
						}
						
						// 标记收到的消息为已读
						this.markMessagesAsRead();
					} else {
						uni.showToast({
							title: '获取聊天记录失败',
							icon: 'none'
						});
					}
				},
				fail: (err) => {
					console.error('获取聊天记录失败:', err);
					uni.showToast({
						title: '网络请求失败',
						icon: 'none'
					});
				},
				complete: () => {
					uni.hideLoading();
				}
			});
		},
		
		// 发送消息
		sendMessage() {
			if (!this.inputMessage.trim()) return;
			
			const messageData = {
				senderId: this.currentUserId,
				receiverId: this.friendId,
				content: this.inputMessage,
				sendTime: new Date().toISOString(),
				isRead: 0,
				isRevoked: 0
			};
			
			// 先添加到本地列表，提高用户体验
			const tempMessage = {
				...messageData,
				isSelf: true,
				id: 'temp_' + Date.now() // 临时ID
			};
			
			this.messages.push(tempMessage);
			this.inputMessage = '';
			
			// 滚动到底部
			this.$nextTick(() => {
				this.scrollToBottom();
			});
			
			// 发送到服务器
			uni.request({
				url: `${config.BaseUrl}/api/friend/chat/message/send`,
				method: 'POST',
				data: messageData,
				header: {
					'content-type': 'application/json'
				},
				success: (res) => {
					console.log('发送消息成功:', res.data);
					if (res.data && res.data.code === 1) {
						// 用服务器返回的消息ID替换临时ID
						const serverMessage = res.data.data;
						const index = this.messages.findIndex(m => m === tempMessage);
						if (index !== -1) {
							this.$set(this.messages, index, {
								...tempMessage,
								id: serverMessage.id
							});
						}
					} else {
						uni.showToast({
							title: '发送失败',
							icon: 'none'
						});
						// 标记消息为发送失败
						const index = this.messages.findIndex(m => m === tempMessage);
						if (index !== -1) {
							this.$set(this.messages, index, {
								...tempMessage,
								sendFailed: true
							});
						}
					}
				},
				fail: (err) => {
					console.error('发送消息失败:', err);
					uni.showToast({
						title: '网络请求失败',
						icon: 'none'
					});
					// 标记消息为发送失败
					const index = this.messages.findIndex(m => m === tempMessage);
					if (index !== -1) {
						this.$set(this.messages, index, {
							...tempMessage,
							sendFailed: true
						});
					}
				}
			});
		},
		
		// 加载更多历史消息
		loadMoreMessages() {
			if (!this.hasMore || this.isLoadingMore) return;
			
			this.isLoadingMore = true;
			this.currentPage++;
			
			uni.request({
				url: `${config.BaseUrl}/api/friend/chat/message/list`,
				method: 'GET',
				data: {
					senderId: this.currentUserId,
					receiverId: this.friendId,
					page: this.currentPage,
					pageSize: this.pageSize
				},
				header: {
					'content-type': 'application/json'
				},
				success: (res) => {
					console.log('加载更多消息成功:', res.data);
					if (res.data && res.data.code === 1) {
						const records = res.data.data || [];
						
						// 处理消息数据
						const formattedMessages = records.map(msg => ({
							id: msg.id,
							content: msg.content,
							sendTime: msg.sendTime,
							isSelf: msg.senderId === this.currentUserId,
							isRead: msg.isRead,
							isRevoked: msg.isRevoked
						}));
						
						// 在列表前面添加历史消息
						this.messages = [...formattedMessages, ...this.messages];
						
						// 判断是否还有更多消息
						this.hasMore = records.length === this.pageSize;
					} else {
						uni.showToast({
							title: '获取历史消息失败',
							icon: 'none'
						});
					}
				},
				fail: (err) => {
					console.error('获取历史消息失败:', err);
					uni.showToast({
						title: '网络请求失败',
						icon: 'none'
					});
				},
				complete: () => {
					this.isLoadingMore = false;
				}
			});
		},
		
		// 标记消息为已读
		markMessagesAsRead() {
			// 找出所有未读的非自己发送的消息
			const unreadMessages = this.messages.filter(msg => !msg.isSelf && msg.isRead === 0);
			
			unreadMessages.forEach(msg => {
				uni.request({
					url: `${config.BaseUrl}/api/friend/chat/message/read/${msg.id}`,
					method: 'PUT',
					success: (res) => {
						if (res.data && res.data.code === 1) {
							// 更新本地消息状态
							const index = this.messages.findIndex(m => m.id === msg.id);
							if (index !== -1) {
								this.messages[index].isRead = 1;
							}
						}
					}
				});
			});
		},
		
		// 撤回消息
		revokeMessage(msg) {
			if (!msg || !msg.id || msg.id.toString().startsWith('temp_')) return;
			
			uni.showModal({
				title: '提示',
				content: '确定要撤回这条消息吗？',
				success: (res) => {
					if (res.confirm) {
						uni.request({
							url: `${config.BaseUrl}/api/friend/chat/message/revoke/${msg.id}`,
							method: 'PUT',
							success: (res) => {
								if (res.data && res.data.code === 1) {
									// 更新本地消息状态
									const index = this.messages.findIndex(m => m.id === msg.id);
									if (index !== -1) {
										this.$set(this.messages, index, {
											...this.messages[index],
											isRevoked: 1
										});
									}
									
									uni.showToast({
										title: '已撤回',
										icon: 'success'
									});
								} else {
									uni.showToast({
										title: '撤回失败',
										icon: 'none'
									});
								}
							},
							fail: () => {
								uni.showToast({
									title: '网络请求失败',
									icon: 'none'
								});
							}
						});
					}
				}
			});
		},
		
		// 删除消息
		deleteMessage(msg) {
			if (!msg || !msg.id || msg.id.toString().startsWith('temp_')) return;
			
			uni.showModal({
				title: '提示',
				content: '确定要删除这条消息吗？',
				success: (res) => {
					if (res.confirm) {
						uni.request({
							url: `${config.BaseUrl}/api/friend/chat/message/${msg.id}`,
							method: 'DELETE',
							success: (res) => {
								if (res.data && res.data.code === 1) {
									// 从本地列表中移除
									const index = this.messages.findIndex(m => m.id === msg.id);
									if (index !== -1) {
										this.messages.splice(index, 1);
									}
									
									uni.showToast({
										title: '已删除',
										icon: 'success'
									});
								} else {
									uni.showToast({
										title: '删除失败',
										icon: 'none'
									});
								}
							},
							fail: () => {
								uni.showToast({
									title: '网络请求失败',
									icon: 'none'
								});
							}
						});
					}
				}
			});
		},
		
		// 滚动到底部
		scrollToBottom() {
			// 这个值需要根据消息列表的高度动态设置
			// 这里使用一个足够大的值，让scroll-view滚动到底部
			this.scrollTop = 9999;
		},
		
		// 格式化时间
		formatTime(timestamp) {
			if (!timestamp) return '';
			
			const date = new Date(timestamp);
			const now = new Date();
			const diffDays = Math.floor((now - date) / (24 * 60 * 60 * 1000));
			
			const hours = date.getHours().toString().padStart(2, '0');
			const minutes = date.getMinutes().toString().padStart(2, '0');
			const timeStr = `${hours}:${minutes}`;
			
			// 今天的消息只显示时间
			if (diffDays === 0) {
				return timeStr;
			} 
			// 昨天的消息
			else if (diffDays === 1) {
				return `昨天 ${timeStr}`;
			} 
			// 一周内的消息
			else if (diffDays < 7) {
				const days = ['日', '一', '二', '三', '四', '五', '六'];
				return `周${days[date.getDay()]} ${timeStr}`;
			}
			// 更早的消息
			else {
				const month = (date.getMonth() + 1).toString().padStart(2, '0');
				const day = date.getDate().toString().padStart(2, '0');
				return `${month}-${day} ${timeStr}`;
			}
		},
		
		// 初始化WebSocket (可选实现)
		initWebSocket() {
			// 如果后端支持WebSocket，可以实现这部分
			// const wsUrl = `ws://${config.BaseUrl.replace('http://', '')}/ws/chat?userId=${this.currentUserId}`;
			// this.socket = new WebSocket(wsUrl);
			
			// this.socket.onopen = () => {
			//     console.log('WebSocket连接已打开');
			// };
			
			// this.socket.onmessage = (event) => {
			//     const message = JSON.parse(event.data);
			//     // 如果是当前聊天的消息，添加到列表
			//     if (message.senderId === this.friendId) {
			//         this.messages.push({
			//             ...message,
			//             isSelf: false
			//         });
			//         this.scrollToBottom();
			//         this.markMessagesAsRead();
			//     }
			// };
			
			// this.socket.onerror = (error) => {
			//     console.error('WebSocket错误:', error);
			// };
			
			// this.socket.onclose = () => {
			//     console.log('WebSocket连接已关闭');
			// };
		}
	}
}
</script>

<style>
.container {
	background-color: #F8F7F2;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
}

.chat-container {
	flex: 1;
	display: flex;
	flex-direction: column;
	background-image: url('/static/decoration/paper-texture.png');
	background-repeat: repeat;
	padding-bottom: 120rpx; /* 为输入框留出空间 */
}

.chat-list {
	flex: 1;
	padding: 20rpx;
}

.loading-more {
	text-align: center;
	padding: 20rpx 0;
}

.loading-more text {
	font-size: 24rpx;
	color: #999;
}

.chat-item {
	display: flex;
	margin-bottom: 30rpx;
	align-items: flex-start;
}

.chat-item.self {
	flex-direction: row-reverse;
}

.avatar-container {
	width: 80rpx;
	height: 80rpx;
	margin: 0 20rpx;
}

.avatar {
	width: 80rpx;
	height: 80rpx;
	border-radius: 40rpx;
	border: 2rpx solid rgba(126, 196, 207, 0.3);
}

.message-content {
	max-width: 60%;
	background-color: #FFF;
	border-radius: 20rpx;
	padding: 20rpx;
	position: relative;
	box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
	border: 1rpx solid rgba(224, 201, 209, 0.3);
}

.message-content::before {
	content: "";
	position: absolute;
	left: -16rpx;
	top: 20rpx;
	border-width: 8rpx;
	border-style: solid;
	border-color: transparent #FFF transparent transparent;
}

.self-message {
	background-color: #7EC4CF;
	color: #FFF;
}

.self-message::before {
	left: auto;
	right: -16rpx;
	border-color: transparent transparent transparent #7EC4CF;
}

.revoked {
	background-color: #f0f0f0;
	color: #999;
}

.self-message.revoked {
	background-color: #A0C9CF;
	color: rgba(255, 255, 255, 0.7);
}

.revoked-text {
	font-style: italic;
	font-size: 28rpx;
}

.message-text {
	font-size: 30rpx;
	line-height: 1.5;
	word-break: break-word;
	font-family: "SimSun", serif;
}

.message-time {
	font-size: 22rpx;
	color: #999;
	margin-top: 10rpx;
	display: block;
	text-align: right;
}

.self-message .message-time {
	color: rgba(255, 255, 255, 0.7);
}

/* 消息操作菜单 */
.message-actions {
	position: absolute;
	right: 0;
	top: -60rpx;
	background-color: rgba(0, 0, 0, 0.7);
	border-radius: 10rpx;
	padding: 10rpx;
	display: none;
}

.message-content:active .message-actions {
	display: flex;
}

.message-content:hover .message-actions {
	display: flex;
}

.action-item {
	color: #fff;
	font-size: 24rpx;
	padding: 0 10rpx;
}

.action-item:not(:last-child) {
	border-right: 1rpx solid rgba(255, 255, 255, 0.3);
}

/* 空消息提示 */
.empty-messages {
	text-align: center;
	padding: 100rpx 0;
}

.empty-messages text {
	font-size: 28rpx;
	color: #999;
}

.input-area {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	background-color: #FFF;
	padding: 20rpx;
	display: flex;
	align-items: center;
	border-top: 1rpx solid #f0f0f0;
	box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
	box-sizing: border-box;
}

.message-input {
	flex: 1;
	height: 80rpx;
	background-color: #f5f5f5;
	border-radius: 40rpx;
	padding: 0 30rpx;
	font-size: 28rpx;
	font-family: "SimSun", serif;
}

.send-btn {
	width: 120rpx;
	height: 80rpx;
	background-color: #7EC4CF;
	border-radius: 40rpx;
	color: #FFF;
	font-size: 28rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-left: 20rpx;
	font-family: "KaiTi", "FangSong";
}
</style> 