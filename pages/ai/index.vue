<template>
	<view class="container">
		<!-- Custom navigation bar with back button -->
		<custom-nav-bar title="AI助手" subtitle="智能问答" :show-back="true"></custom-nav-bar>
		
		<!-- Sidebar for chat history (hidden by default) -->
		<view class="chat-sidebar" :class="{ 'sidebar-open': showSidebar }">
			<view class="sidebar-header">
				<text class="sidebar-title">会话历史</text>
				<view class="sidebar-close" @click="toggleSidebar">
					<text class="close-icon">×</text>
				</view>
			</view>
			
			<view class="chat-history-list">
				<view v-if="loadingHistory" class="loading-message">
					<view class="loading-dots">
						<view class="dot"></view>
						<view class="dot"></view>
						<view class="dot"></view>
					</view>
				</view>
				
				<view v-else-if="chatHistory.length === 0" class="empty-history">
					<text>暂无历史会话</text>
				</view>
				
				<view 
					v-else 
					v-for="(session, index) in chatHistory" 
					:key="session.id" 
					class="history-item"
					@click="selectSession(session)"
					:class="{ 'active-session': currentSession && currentSession.id === session.id }"
				>
					<view class="history-title-row">
						<text class="history-title">会话 {{ index + 1 }}</text>
					</view>
					<view class="history-date-row">
						<text class="history-date">{{ formatDate(session.createdAt) }}</text>
					</view>
				</view>
			</view>
			
			<view class="new-chat" @click="startNewChat">
				<text class="new-chat-text">新建会话</text>
			</view>
		</view>
		
		<!-- Main chat interface -->
		<view class="main-content">
			<view class="ai-content" :class="{ 'with-sidebar': showSidebar }">
				<!-- History button moved outside of chat container -->
				<view class="header-actions">
					<view class="history-btn" @click="toggleSidebar">
						<image src="/static/icons/history.png" class="history-icon"></image>
						<text class="history-text">历史记录</text>
					</view>
			</view>
			
			<view class="chat-container">
					<!-- Removed chat header with history button -->
					<scroll-view 
						scroll-y 
						class="chat-messages" 
						:scroll-top="scrollTop"
						:scroll-with-animation="true"
						@scrolltoupper="loadMoreMessages"
						ref="chatScroll"
						enable-flex="true"
					>
						<view class="messages-wrapper">
							<!-- 使用本地消息列表渲染消息 -->
							<view class="message-container" 
								v-for="(message, index) in localMessageList" 
								:key="'msg-' + index" 
								:class="{'user-container': message.role === 'user', 'ai-container': message.role === 'ai'}"
							>
								<view class="message" 
									:class="message.role === 'user' ? 'user' : 'ai'"
								>
									<image 
										v-if="message.role === 'ai'"
										src="/static/avatars/ai-avatar.png" 
										class="message-avatar"
									></image>
									<view class="message-content">
										<text class="message-text">{{ message.content }}</text>
									</view>
								</view>
							</view>
							
							<!-- 完整响应显示：仅当有内容且不在流式输出中时显示 -->
							<view v-if="completedResponse && !isStreaming" class="message-container ai-container">
					<view class="message ai">
						<image src="/static/avatars/ai-avatar.png" class="message-avatar"></image>
						<view class="message-content">
										<text class="message-text">{{ completedResponse }}</text>
									</view>
						</view>
					</view>
					
							<!-- 流式显示：只在流式输出过程中显示 -->
							<view v-if="isStreaming && streamingContent" class="message-container ai-container">
								<view class="message ai">
									<image src="/static/avatars/ai-avatar.png" class="message-avatar"></image>
						<view class="message-content">
										<text class="message-text">{{ streamingContent }}</text>
										<view class="cursor"></view>
									</view>
						</view>
					</view>
					
							<!-- Loading indicator while waiting for response -->
							<view v-if="isLoading && !isStreaming" class="message-container ai-container">
					<view class="message ai">
						<image src="/static/avatars/ai-avatar.png" class="message-avatar"></image>
						<view class="message-content">
										<view class="loading-dots">
											<view class="dot"></view>
											<view class="dot"></view>
											<view class="dot"></view>
										</view>
									</view>
								</view>
							</view>
					</view>
				</scroll-view>
				
				<view class="chat-input-area">
						<input 
							type="text" 
							class="chat-input" 
							placeholder="请输入您的问题..." 
							v-model="userInput"
							@confirm="sendMessage"
							:disabled="isStreaming || isLoading"
						/>
						<button 
							class="send-btn" 
							@click="sendMessage" 
							:disabled="isStreaming || isLoading || !userInput.trim()"
						>发送</button>
					</view>
				</view>
			</view>
		</view>
		
		<!-- Overlay for mobile -->
		<view class="sidebar-overlay" v-if="showSidebar" @click="toggleSidebar"></view>
	</view>
</template>

<script>
import CustomNavBar from '@/components/CustomNavBar.vue';

export default {
	components: {
		CustomNavBar
	},
	data() {
		// 生成一个初始会话ID
		const initialChatId = 'initial-' + Date.now();
		
		return {
			messages: [], // 清空默认消息，由localMessageList替代
			localMessageList: [ // 新增本地消息列表
				{
					role: 'ai',
					content: '您好，我是校园AI助手，有什么可以帮助您的吗？'
				}
			],
			userInput: '',
			isLoading: false,
			isStreaming: false,
			streamingContent: '', // 仅用于流式显示过程
			completedResponse: '', // 新增：存储完整的最终响应
			streamingChunks: [],
			scrollTop: 0,
			userId: 1, // 默认用户ID，实际中应从登录状态获取
			chatId: initialChatId, // 使用初始生成的会话ID
			showSidebar: false, // 控制侧边栏显示
			chatHistory: [], // 用户的历史会话
			loadingHistory: false, // 历史记录加载状态
			currentSession: null, // 当前选中的会话
			hasLoadedMessages: false, // 标记是否已经加载过消息
			streamEndTimer: null, // 用于流式传输结束检测的定时器
			lastStreamLength: 0 // 用于流式传输结束检测的最后内容长度
		}
	},
	watch: {
		chatId: {
			handler(newId, oldId) {
				if (newId !== oldId) {
					this.loadMessagesFromStorage();
				}
			},
			immediate: true
		}
	},
	methods: {
		// 发送消息到API (流式响应)
		sendMessage() {
			// 验证输入不为空
			if (!this.userInput.trim() || this.isStreaming || this.isLoading) return;
			
			// 存储当前输入
			const userQuestion = this.userInput.trim();
			
			// 添加用户消息到本地消息列表
			const userMessage = {
				role: 'user',
				content: userQuestion
			};
			this.localMessageList.push(userMessage);
			
			// 清空输入框并显示加载状态
			this.userInput = '';
			this.isLoading = true;
			
			// 保存用户消息到本地存储
			this.saveMessagesToStorage();
			
			// 滚动到底部
			this.scrollToBottom();
			
			// 准备发送的数据
			const chatData = {
				userId: this.userId,
				input: userQuestion,
				chatId: this.chatId
			};
			
			// 设置流式传输结束监听器
			this.setupStreamEndDetection();
			
			// 发送流式请求
			this.streamChatRequest(chatData, userQuestion);
		},
		
		// 设置流式传输结束监听
		setupStreamEndDetection() {
			// 清除可能存在的定时器
			if (this.streamEndTimer) {
				clearTimeout(this.streamEndTimer);
			}
			
			// 创建检查函数
			const checkStreamEnd = () => {
				// 清除定时器
				this.streamEndTimer = null;
				
				// 如果仍在流式状态，但流内容长度超过3秒未变化，判定为结束
				if (this.isStreaming && this.lastStreamLength === this.streamingContent.length) {
					console.log('[AI Chat] 检测到流式传输结束（内容长度未变化）');
					this.handleStreamEnd();
				} 
				// 如果流还在继续
				else if (this.isStreaming) {
					// 更新最后内容长度
					this.lastStreamLength = this.streamingContent.length;
					// 继续检查
					this.streamEndTimer = setTimeout(checkStreamEnd, 3000);
				}
			};
			
			// 初始化最后内容长度
			this.lastStreamLength = 0;
			
			// 启动检查
			this.streamEndTimer = setTimeout(checkStreamEnd, 3000);
		},
		
		// 流式请求处理
		streamChatRequest(chatData, userQuestion) {
			// 获取配置和请求URL
			const config = this.$config;
			const url = config.BaseUrl + '/api/ai/stream/chat';
			
			// 获取认证头
			const authHeader = config.getAuthHeader();
			
			// 设置请求状态
			this.isLoading = true;
			this.isStreaming = false;
			
			// 清空所有内容
			this.streamingContent = '';
			this.completedResponse = '';
			this.streamingChunks = [];
			
			console.log('[AI Chat] 开始发送请求:', url);

			// 使用uni.request发送请求
			const requestTask = uni.request({
				url: url,
				data: chatData,
				method: 'POST',
				header: {
					'Content-Type': 'application/json',
					...authHeader
				},
				responseType: 'text',
				enableChunked: true,
				success: (res) => {
					if (res.data) {
						console.log('[AI Chat] 请求成功，接收到完整响应');
						// 处理完整响应
						this.handleCompleteResponse(res.data);
					} else {
						console.log('[AI Chat] 请求成功，但没有完整响应，可能通过chunk接收');
						// 如果没有收到数据且没有任何流内容，可能API未返回
						if (!this.streamingContent) {
							setTimeout(() => {
								if (!this.streamingContent && !this.completedResponse) {
									this.isLoading = false;
									this.isStreaming = false;
									this.completedResponse = '抱歉，AI没有返回任何内容，请重试。';
									this.addCompletedResponseToMessages();
								}
							}, 3000); // 等待3秒，给流式响应一个机会
						}
					}
				},
				fail: (err) => {
					console.error('[AI Chat] 请求失败:', err);
					this.isStreaming = false;
					this.isLoading = false;
					this.completedResponse = '网络请求失败，请检查网络连接后重试。';
					this.addCompletedResponseToMessages();
				},
				complete: () => {
					console.log('[AI Chat] 请求完成');
				}
			});
			
			// 监听数据分块接收事件
			if (requestTask && requestTask.onChunkReceived) {
				requestTask.onChunkReceived((response) => {
					try {
						// 首次收到数据时，启动流式状态
						if (!this.isStreaming) {
							this.isStreaming = true;
							this.isLoading = false;
							console.log('[AI Chat] 开始接收流式数据');
						}
						
						// 处理数据块
						let chunk = '';
						if (typeof response.data === 'string') {
							chunk = response.data;
						} else if (response.data instanceof ArrayBuffer) {
							const decoder = new TextDecoder('utf-8');
							chunk = decoder.decode(response.data);
						}
						
						if (chunk) {
							this.handleStreamChunk(chunk);
						}
					} catch (error) {
						console.error('[AI Chat] 处理数据块错误:', error);
					}
				});
			} else {
				// 不支持流式，使用标准请求
				console.warn('[AI Chat] 平台不支持流式数据，使用标准请求');
				
				this.$api.post('/api/ai/stream/chat', chatData)
					.then(response => {
						console.log('[AI Chat] 标准请求成功');
						this.handleCompleteResponse(response);
					})
					.catch(error => {
						console.error('[AI Chat] 标准请求失败:', error);
						this.isStreaming = false;
						this.isLoading = false;
						this.completedResponse = '网络请求失败，请检查网络连接后重试。';
						this.addCompletedResponseToMessages();
					});
			}
		},
		
		// 处理流数据块
		handleStreamChunk(chunk) {
			if (chunk) {
				// 添加数据块，更新流式内容
				this.streamingChunks.push(chunk);
				this.streamingContent = this.streamingChunks.join('');
				
				if (this.streamingChunks.length % 5 === 0) {
					console.log('[AI Chat] 已接收数据块:', this.streamingChunks.length);
				}
				
				// 滚动到底部
				this.scrollToBottom();
			}
		},
		
		// 流式传输完成（所有数据块接收完毕）
		handleStreamEnd() {
			console.log('[AI Chat] 流式传输完成');
			
			// 状态重置
			this.isStreaming = false;
			
			// 将最终的流式内容保存到完整响应
			if (this.streamingContent) {
				this.completedResponse = this.streamingContent;
			}
			
			// 清空流式内容
			this.streamingContent = '';
			
			// 添加完整响应到消息列表
			this.addCompletedResponseToMessages();
			
			// 确保正常显示
			this.$nextTick(() => {
				this.scrollToBottom();
			});
		},
		
		// 处理完整响应（非流式或API直接返回）
		handleCompleteResponse(responseData) {
			console.log('[AI Chat] 处理完整响应');
			
			// 状态重置
			this.isStreaming = false;
			this.isLoading = false;
			
			// 解析响应
			let content = '';
			
			if (typeof responseData === 'string') {
				content = responseData;
			} else {
				try {
					content = JSON.stringify(responseData);
				} catch (e) {
					content = '接收到无效响应';
					console.error('[AI Chat] 无法解析响应:', e);
				}
			}
			
			// 设置完整响应
			this.completedResponse = content;
			
			// 添加到消息列表
			this.addCompletedResponseToMessages();
			
			// 确保正常显示
			this.$nextTick(() => {
				this.scrollToBottom();
			});
		},
		
		// 将完整响应添加到消息列表
		addCompletedResponseToMessages() {
			if (!this.completedResponse) {
				console.warn('[AI Chat] 没有完整响应可添加');
				return;
			}
			
			console.log('[AI Chat] 添加完整响应到消息列表，长度:', this.completedResponse.length);
			
			// 添加到消息列表
			this.localMessageList.push({
				role: 'ai',
				content: this.completedResponse
			});
			
			// 保存消息
			this.saveMessagesToStorage();
			
			// 重置完整响应，因为已经添加到消息列表了
			this.completedResponse = '';
		},
		
		// 滚动聊天区域到底部
		scrollToBottom() {
			this.$nextTick(() => {
				const query = uni.createSelectorQuery().in(this);
				query.select('.chat-messages').boundingClientRect(data => {
					if (data) {
						this.scrollTop = data.height * 2; // 确保滚动到底部
					}
				}).exec();
			});
		},
		
		// 加载更多历史消息（向上滚动时）
		loadMoreMessages() {
			// 这里可以实现加载历史消息的逻辑
			// 如果需要分页加载历史消息，可以调用获取历史消息的API
		},
		
		// 切换侧边栏显示状态
		toggleSidebar() {
			this.showSidebar = !this.showSidebar;
			
			// 打开侧边栏时获取历史记录
			if (this.showSidebar && this.chatHistory.length === 0) {
				this.fetchChatHistory();
			}
		},
		
		// 获取用户的聊天历史
		fetchChatHistory() {
			this.loadingHistory = true;
			
			this.$api.get(`/api/ai/history?userId=${this.userId}`)
				.then(response => {
					// Handle the specific API response format
					if (response && response.code === 1 && Array.isArray(response.data)) {
						this.chatHistory = response.data;
					} else if (Array.isArray(response)) {
						this.chatHistory = response;
					} else {
						console.error('Unexpected history response format:', response);
						this.chatHistory = [];
					}

					// Sort chat history by updatedAt (newest first)
					this.chatHistory.sort((a, b) => {
						return new Date(b.updatedAt) - new Date(a.updatedAt);
					});
				})
				.catch(error => {
					console.error('Error fetching chat history:', error);
					uni.showToast({
						title: '获取历史记录失败',
						icon: 'none'
					});
					this.chatHistory = [];
				})
				.finally(() => {
					this.loadingHistory = false;
				});
		},
		
		// 格式化日期，处理会话历史的显示日期
		formatDate(dateString) {
			if (!dateString) return '';
			
			const date = new Date(dateString);
			const now = new Date();
			const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
			const yesterday = new Date(today);
			yesterday.setDate(yesterday.getDate() - 1);
			
			// 检查是否是今天
			if (date >= today) {
				return '今天 ' + this.formatTime(date);
			}
			// 检查是否是昨天
			else if (date >= yesterday && date < today) {
				return '昨天 ' + this.formatTime(date);
			}
			// 否则显示完整日期
			else {
				return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${this.formatTime(date)}`;
			}
		},
		
		// 格式化时间部分
		formatTime(date) {
			return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
		},
		
		// 选择历史会话
		selectSession(session) {
			// 更新当前会话和会话ID
			this.currentSession = session;
			this.chatId = session.id;
			
			// 清空当前消息并显示加载状态
			this.localMessageList = [];
			this.isLoading = true;
			
			// 关闭侧边栏
			this.showSidebar = false;
			
			// 获取会话的聊天记录
			this.fetchSessionMessages(session.id);
		},
		
		// 获取会话的聊天记录
		fetchSessionMessages(chatSessionId) {
			this.$api.get(`/api/ai/history/message?chatSessionId=${chatSessionId}`)
				.then(response => {
					// 处理响应数据
					if (response && response.code === 1 && Array.isArray(response.data)) {
						// 转换聊天记录格式并加载到本地消息列表
						this.localMessageList = this.formatChatMessages(response.data);
					} else if (Array.isArray(response)) {
						this.localMessageList = this.formatChatMessages(response);
					} else {
						// 如果没有有效的消息数据，显示默认消息
						this.localMessageList = [{
							role: 'ai',
							content: `已切换到会话 ${this.formatDate(this.currentSession.createdAt)}。没有找到历史消息。`
						}];
						console.error('接收到意外的消息历史格式:', response);
					}
					
					// 加载后保存到本地存储
					this.saveMessagesToStorage();
				})
				.catch(error => {
					console.error('获取聊天消息失败:', error);
					// 显示错误消息
					this.localMessageList = [{
						role: 'ai',
						content: '加载历史消息失败，请重试。'
					}];
					
					uni.showToast({
						title: '获取聊天记录失败',
						icon: 'none'
					});
					
					// 即使加载失败也保存到本地存储
					this.saveMessagesToStorage();
				})
				.finally(() => {
					// 结束加载状态
					this.isLoading = false;
					
					// 滚动到底部
					this.$nextTick(() => {
						this.scrollToBottom();
					});
				});
		},
		
		// 格式化聊天记录数据
		formatChatMessages(messages) {
			if (!messages || !messages.length) {
				return [{
					role: 'ai',
					content: `已切换到会话 ${this.formatDate(this.currentSession.createdAt)}。没有找到历史消息。`
				}];
			}
			
			// 按时间排序，确保消息按顺序显示
			// API可能不返回时间，所以以数组顺序为准
			const sortedMessages = [...messages];
			
			// 转换为应用内消息格式
			const formattedMessages = sortedMessages.map(msg => {
				// 根据API返回的role字段确定消息角色
				// API返回"USER"表示用户消息，"ASSISTANT"表示AI消息
				let role = 'ai';
				if (msg.role === 'USER') {
					role = 'user';
				}
				
				return {
					role: role,
					content: msg.content || ''
				};
			});

			// 确保经过格式化的消息被正确返回
			console.log('[AI Chat] 已格式化消息数量:', formattedMessages.length);
			return formattedMessages;
		},
		
		// 开始新会话
		startNewChat() {
			// 清除当前会话
			this.currentSession = null;
			
			// 生成新的会话ID - 在实际应用中，这应该由后端生成
			// 这里使用时间戳 + 随机数作为临时ID
			const timestamp = new Date().getTime();
			const random = Math.floor(Math.random() * 1000);
			this.chatId = timestamp + random;
			
			// 清空本地消息列表
			this.localMessageList = [
				{
					role: 'ai',
					content: '已开始新会话，有什么可以帮助您的？'
				}
			];
			
			// 保存初始消息到本地存储
			this.saveMessagesToStorage();
			
			// 关闭侧边栏
			this.showSidebar = false;
			
			// 滚动到底部
			this.$nextTick(() => {
				this.scrollToBottom();
			});
		},
		
		// 计算会话持续时间
		getDuration(startDate, endDate) {
			const start = new Date(startDate);
			const end = new Date(endDate);
			const diffMs = end - start;
			
			// 如果小于1分钟
			if (diffMs < 60000) {
				return '短会话';
			}
			
			const diffMins = Math.floor(diffMs / 60000);
			const hours = Math.floor(diffMins / 60);
			const mins = diffMins % 60;
			
			if (hours > 0) {
				return `${hours}小时${mins > 0 ? mins + '分钟' : ''}`;
			} else {
				return `${mins}分钟`;
			}
		},
		
		// 保存消息到本地存储
		saveMessagesToStorage() {
			try {
				if (!Array.isArray(this.localMessageList) || this.localMessageList.length === 0) {
					console.warn('[AI Chat] 没有消息可保存');
					return;
				}
				
				// 只保存当前会话的消息
				const storageKey = `chat_messages_${this.chatId}`;
				const jsonMessages = JSON.stringify(this.localMessageList);
				
				console.log('[AI Chat] 正在保存消息, chatId:', this.chatId, '数量:', this.localMessageList.length);
				
				// 保存到本地存储
				uni.setStorageSync(storageKey, jsonMessages);
				
				// 同步到messages数组，确保两个数组保持一致
				this.messages = [...this.localMessageList];
				
				// 立即保存
				uni.setStorage({
					key: storageKey,
					data: jsonMessages,
					success: () => {
						console.log('[AI Chat] 消息保存成功');
					},
					fail: (err) => {
						console.error('[AI Chat] 消息保存失败:', err);
					}
				});
			} catch (e) {
				console.error('[AI Chat] 保存消息失败:', e);
			}
		},
		
		// 从本地存储加载消息
		loadMessagesFromStorage() {
			try {
				const storageKey = `chat_messages_${this.chatId}`;
				const storedMessages = uni.getStorageSync(storageKey);
				
				console.log('[AI Chat] 正在加载消息, chatId:', this.chatId);
				
				if (storedMessages) {
					const parsedMessages = JSON.parse(storedMessages);
					if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
						console.log('[AI Chat] 已加载消息数量:', parsedMessages.length);
						// 更新本地消息列表而不是messages
						this.localMessageList = parsedMessages;
						// 复制一份到messages以兼容其他可能的引用
						this.messages = [...parsedMessages];
						this.hasLoadedMessages = true;
						return;
					}
				}
				
				// 如果没有找到存储的消息并且还没有加载过
				if (!this.hasLoadedMessages) {
					console.log('[AI Chat] 未找到存储的消息，使用默认欢迎消息');
					// 使用默认欢迎消息
					const defaultMessage = {
						role: 'ai',
						content: '您好，我是校园AI助手，有什么可以帮助您的吗？'
					};
					this.localMessageList = [defaultMessage];
					this.messages = [defaultMessage]; // 同步到messages
					// 标记为已加载
					this.hasLoadedMessages = true;
					// 保存默认消息
					this.saveMessagesToStorage();
				}
			} catch (e) {
				console.error('[AI Chat] 加载消息失败:', e);
				// 出错时使用默认消息
				const defaultMessage = {
					role: 'ai',
					content: '您好，我是校园AI助手，有什么可以帮助您的吗？'
				};
				this.localMessageList = [defaultMessage];
				this.messages = [defaultMessage];
			}
		},
		
		// 确保流状态完全关闭
		ensureStreamingClosed() {
			// 直接设置状态，绕过锁机制
			this.isStreaming = false;
			this.isLoading = false;
			this.streamingContent = '';
			this.streamingChunks = [];
		}
	},
	mounted() {
		console.log('[AI Chat] 组件挂载，准备初始化...');
		
		// 初始加载消息
		this.loadMessagesFromStorage();
		
		// 滚动到底部
		this.$nextTick(() => {
			this.scrollToBottom();
		});
		
		// 监听页面返回事件
		uni.$on('beforeRouteEnter', () => {
			console.log('[AI Chat] 页面返回，重新加载消息');
			this.loadMessagesFromStorage();
		});
		
		// 添加调试信息
		console.log('[AI Chat] 组件挂载完成, chatId:', this.chatId, '消息数量:', this.localMessageList.length);
	},
	beforeDestroy() {
		// 移除事件监听
		uni.$off('beforeRouteEnter');
		uni.$off('ai_messages_updated');
		
		// 清除定时器
		if (this.streamEndTimer) {
			clearTimeout(this.streamEndTimer);
			this.streamEndTimer = null;
		}
		
		// 清理状态
		this.isStreaming = false;
		this.isLoading = false;
	}
}
</script>

<style>
.container {
	background-color: #F8F3E6;
	height: 100vh; /* Fixed height instead of min-height */
	background-image: url('/static/decoration/paper-texture.png');
	position: relative;
	overflow: hidden; /* Prevent overall page scrolling */
	display: flex;
	flex-direction: column;
}

.main-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	overflow: hidden; /* Prevent content overflow */
}

.ai-content {
	padding: 30rpx;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	transition: all 0.3s ease;
	flex: 1;
	justify-content: flex-start; /* Align to top instead of center */
	overflow: hidden; /* Prevent scrolling in this container */
}

.ai-content.with-sidebar {
	padding-left: 350rpx;
}

.header-actions {
	display: flex;
	justify-content: flex-start;
	margin-bottom: 15rpx;
}

.history-btn {
	display: flex;
	align-items: center;
	background-color: #F0F0F0;
	padding: 10rpx 20rpx;
	border-radius: 30rpx;
	font-size: 24rpx;
	color: #666;
}

.history-icon {
	width: 32rpx;
	height: 32rpx;
	margin-right: 8rpx;
}

.history-text {
	font-size: 28rpx;
}

.chat-container {
	background-color: #FFFFFF;
	border-radius: 20rpx;
	padding: 20rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	border: 1rpx solid rgba(224, 201, 209, 0.5);
	display: flex;
	flex-direction: column;
	height: 85vh; /* Increase height to 85% */
	max-height: 85vh;
	margin: 2vh auto 5vh auto; /* Reduced top margin, kept bottom margin */
	width: 100%;
	overflow: hidden; /* Ensure content doesn't overflow */
}

.chat-messages {
	flex: 1;
	margin-bottom: 20rpx;
	overflow-y: scroll; /* Use scroll instead of auto */
	position: relative;
	-webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
}

.messages-wrapper {
	display: flex;
	flex-direction: column;
	min-height: 100%;
	padding-bottom: 20rpx;
	padding-top: 30rpx; /* 增加顶部距离 */
}

.message-container {
	width: 100%;
	display: flex;
	margin-bottom: 20rpx;
	box-sizing: border-box;
}

.user-container {
	justify-content: flex-end;
	padding-right: 20rpx; /* Add right padding for user messages */
}

.ai-container {
	justify-content: flex-start;
	padding-left: 0; /* Ensure no padding on the left */
}

.message {
	display: flex;
	max-width: 80%;
	align-items: flex-start;
}

.message-avatar {
	width: 80rpx;
	height: 80rpx;
	border-radius: 40rpx;
	border: 2rpx solid #E0C9D1;
	flex-shrink: 0;
	margin-right: 20rpx;
}

.message-content {
	padding: 20rpx;
	border-radius: 16rpx;
	position: relative;
	word-break: break-word;
}

/* Message bubble styles */
.ai .message-content {
	background-color: #EEE9E1;
	border-top-left-radius: 4rpx; /* 尖角效果 */
}

/* Make sure ai messages have avatar on left, content on right */
.ai {
	flex-direction: row;
}

/* Make sure user messages are right-aligned without avatar */
.user {
	justify-content: flex-end;
}

.user .message-content {
	background-color: #D6E4C9;
	border-top-right-radius: 4rpx; /* 尖角效果 */
}

.message-text {
	font-size: 28rpx;
	line-height: 1.5;
	color: #333;
}

.chat-input-area {
	display: flex;
	border-top: 1rpx solid #F0F0F0;
	padding-top: 20rpx;
	padding-bottom: 10rpx;
	background-color: #FFFFFF;
	flex-shrink: 0; /* Prevent input area from shrinking */
}

.chat-input {
	flex: 1;
	height: 80rpx;
	background-color: #F8F8F8;
	border-radius: 40rpx;
	padding: 0 30rpx;
	font-size: 28rpx;
}

.chat-input[disabled] {
	background-color: #F0F0F0;
	color: #999;
}

.send-btn {
	width: 120rpx;
	height: 80rpx;
	background-color: #7EC4CF;
	color: #FFFFFF;
	border-radius: 40rpx;
	margin-left: 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28rpx;
}

.send-btn[disabled] {
	background-color: #CCCCCC;
}

/* 侧边栏样式 */
.chat-sidebar {
	position: fixed;
	left: -320rpx;
	top: 0;
	width: 320rpx;
	height: 100vh;
	background-color: #FFFFFF;
	box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.1);
	z-index: 999;
	transition: all 0.3s ease;
	display: flex;
	flex-direction: column;
	padding-top: env(safe-area-inset-top); /* Support for devices with notches */
}

.sidebar-open {
	left: 0;
}

.sidebar-header {
	padding: 30rpx 20rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-bottom: 1rpx solid #EEEEEE;
}

.sidebar-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.sidebar-close {
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.close-icon {
	font-size: 40rpx;
	color: #666;
}

.chat-history-list {
	flex: 1;
	padding: 20rpx;
	overflow-y: auto;
}

.history-item {
	padding: 20rpx;
	border-bottom: 1rpx solid #F0F0F0;
	cursor: pointer;
}

.history-item:active, .history-item.active-session {
	background-color: #F5F5F5;
}

.history-title-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 6rpx;
}

.history-title {
	font-size: 28rpx;
	color: #333;
	font-weight: 500;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	flex: 1;
}

.history-date-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.history-date {
	font-size: 24rpx;
	color: #999;
}

.new-chat {
	padding: 20rpx;
	background-color: #8A3324;
	color: #FFFFFF;
	text-align: center;
	cursor: pointer;
}

.new-chat-text {
	font-size: 28rpx;
}

.empty-history, .loading-message {
	padding: 40rpx 0;
	text-align: center;
	color: #999;
	font-size: 28rpx;
}

/* 移动端的遮罩 */
.sidebar-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.3);
	z-index: 998;
}

/* Loading animation */
.loading-dots {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 30rpx;
}

.dot {
	width: 10rpx;
	height: 10rpx;
	background-color: #666;
	border-radius: 50%;
	margin: 0 5rpx;
	animation: dot-flashing 1s infinite alternate;
}

.dot:nth-child(2) {
	animation-delay: 0.2s;
}

.dot:nth-child(3) {
	animation-delay: 0.4s;
}

@keyframes dot-flashing {
	0% {
		opacity: 0.2;
	}
	100% {
		opacity: 1;
	}
}

/* Cursor animation for streaming text */
.cursor {
	display: inline-block;
	width: 8rpx;
	height: 24rpx;
	background-color: #333;
	margin-left: 4rpx;
	vertical-align: middle;
	animation: cursor-blink 0.8s infinite;
}

@keyframes cursor-blink {
	0%, 100% {
		opacity: 0;
	}
	50% {
		opacity: 1;
	}
}

/* 适配小屏幕设备 */
@media screen and (max-width: 768px) {
	.ai-content.with-sidebar {
		padding-left: 30rpx;
	}
}

/* Responsive adjustments */
@media screen and (max-height: 700px) {
	.chat-container {
		height: 75vh;
		max-height: 75vh;
		margin: 3vh auto;
	}
	
	.chat-messages {
		height: calc(75vh - 140rpx);
	}
}
</style> 