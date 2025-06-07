<template>
	<view class="container">
		<custom-nav-bar title="代取任务" subtitle="代取服务" :show-back="false"></custom-nav-bar>
		
		<view class="header">
			<view class="search-box">
				<view class="search-input-wrapper">
					<image src="https://ykhyyy.oss-cn-beijing.aliyuncs.com/ht.jpg" class="search-icon"></image>
					<input class="search-input" type="text" v-model="searchText" placeholder="搜索任务" @confirm="searchTasks" />
				</view>
			</view>
			<view class="header-actions">
				<button class="publish-btn" @click="goToCreate">发布新任务</button>
			</view>
		</view>
		
		<view class="task-types">
			<view class="task-type-item" 
				  v-for="(type, index) in taskTypes" 
				  :key="index" 
				  :class="{ active: selectedType === type.value }"
				  @click="selectType(type.value)">
				<text class="task-type-text">{{type.label}}</text>
			</view>
		</view>
		
		<!-- 显示加载中状态 -->
		<view v-if="isLoading && tasks.length === 0" class="loading-container">
			<view class="loading-spinner"></view>
			<text class="loading-text">加载中...</text>
		</view>
		
		<!-- 显示无数据状态 -->
		<view v-else-if="tasks.length === 0" class="empty-container">
			<text class="empty-text">暂无任务</text>
		</view>
		
		<!-- 任务列表 -->
		<scroll-view v-else scroll-y class="task-list" @scrolltolower="loadMore">
			<view class="task-item" v-for="task in tasks" :key="task.id" @click="goToDetail(task.id)">
				<view class="task-header">
					<view class="task-type-badge" :class="getBadgeClass(task.taskType)">{{ getTypeText(task.taskType) }}</view>
					<view class="task-price">悬赏: <text class="price-amount">¥{{ task.price }}</text></view>
				</view>
				
				<view class="task-route">
					<view class="task-pickup">
						<text class="location-icon pickup">取</text>
						<text class="location-text">{{ task.pickupAddress }}</text>
					</view>
					<view class="route-arrow">↓</view>
					<view class="task-delivery">
						<text class="location-icon delivery">送</text>
						<text class="location-text">{{ task.deliveryAddress }}</text>
					</view>
				</view>
				
				<view class="task-footer">
					<text class="task-publisher">发布者: {{ task.publisherName || '匿名用户' }}</text>
					<text class="task-time">{{ formatDate(task.createdAt) }}</text>
				</view>
			</view>
			
			<!-- 加载更多 -->
			<view v-if="hasMore" class="load-more" @click="loadMore">
				<text v-if="!isLoading">加载更多</text>
				<view v-else class="loading-spinner small"></view>
			</view>
			<view v-else class="no-more">
				<text>没有更多任务了</text>
			</view>
		</scroll-view>
		
		<!-- AI助手组件 -->
		<ai-assistant></ai-assistant>
	</view>
</template>

<script>
	import { mapState, mapActions } from 'vuex';
	import CustomNavBar from '@/components/CustomNavBar.vue';
	import AiAssistant from '@/components/AiAssistant.vue';
	
	export default {
		components: {
			CustomNavBar,
			AiAssistant
		},
		data() {
			return {
				page: 1,
				size: 10,
				hasMore: true,
				searchText: '',
				selectedType: '',
				taskTypes: [
					{ label: '全部', value: '' },
					{ label: '快递代取', value: 'EXPRESS' },
					{ label: '外卖代取', value: 'TAKEOUT' },
					{ label: '文件代送', value: 'DOCUMENT' },
					{ label: '其他', value: 'OTHER' }
				]
			};
		},
		computed: {
			...mapState('express', ['expressList', 'isLoading', 'pagination']),
			tasks() { return this.expressList; }
		},
		methods: {
			...mapActions('express', ['getExpressPage']),
			async loadTasks(reset = false) {
				if (reset) {
					this.page = 1;
					this.hasMore = true;
				}
				if (!this.hasMore) return;
				
				// 构建查询参数
				const params = {
					current: this.page,
					size: this.size
				};
				
				// 添加类型筛选
				if (this.selectedType) {
					params.taskType = this.selectedType;
				}
				
				// 添加搜索关键词
				if (this.searchText) {
					params.keyword = this.searchText;
				}
				
				await this.getExpressPage(params);
				
				if (this.pagination && this.pagination.total <= this.tasks.length) {
					this.hasMore = false;
				} else {
					this.page++;
				}
			},
			loadMore() { 
				this.loadTasks(); 
			},
			goToDetail(id) { 
				uni.navigateTo({ url: `/pages/proxy/detail?id=${id}` }); 
			},
			goToCreate() { 
				uni.navigateTo({ url: '/pages/proxy/create' }); 
			},
			getTypeText(type) {
				switch(type) {
					case 'EXPRESS': return '快递代取';
					case 'TAKEOUT': return '外卖代取';
					case 'DOCUMENT': return '文件代送';
					case 'OTHER': return '其他';
					default: return type;
				}
			},
			getBadgeClass(type) {
				switch(type) {
					case 'EXPRESS': return 'express';
					case 'TAKEOUT': return 'takeout';
					case 'DOCUMENT': return 'document';
					case 'OTHER': return 'other';
					default: return '';
				}
			},
			formatDate(dateStr) {
				if (!dateStr) return '';
				const d = new Date(dateStr);
				return `${d.getMonth()+1}-${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2,'0')}`;
			},
			selectType(type) {
				this.selectedType = type;
				this.loadTasks(true);
			},
			searchTasks() {
				this.loadTasks(true);
			}
		},
		onLoad() { 
			this.loadTasks(true); 
		},
		onPullDownRefresh() { 
			this.loadTasks(true).then(() => uni.stopPullDownRefresh()); 
		}
	}
</script>

<style>
	.container {
		background-color: #F8F7F2;
		min-height: 100vh;
	}
	
	.header {
		padding: 20rpx 30rpx;
	}
	
	.search-box {
		margin-bottom: 20rpx;
	}
	
	.search-input-wrapper {
		display: flex;
		align-items: center;
		background: #fff;
		border-radius: 30rpx;
		padding: 0 20rpx;
		border: 1rpx solid #e0c9d1;
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
	
	.header-actions {
		display: flex;
		justify-content: flex-end;
	}
	
	.publish-btn {
		background: #8A3324;
		color: #fff;
		border-radius: 30rpx;
		padding: 12rpx 40rpx;
		font-size: 28rpx;
		box-shadow: 0 4rpx 8rpx rgba(138, 51, 36, 0.2);
		border: none;
	}
	
	.task-types {
		display: flex;
		overflow-x: auto;
		white-space: nowrap;
		padding: 0 30rpx 20rpx;
		margin-bottom: 20rpx;
	}
	
	.task-type-item {
		display: inline-block;
		padding: 10rpx 30rpx;
		margin-right: 20rpx;
		background: #fff;
		border-radius: 30rpx;
		border: 1rpx solid #e0c9d1;
	}
	
	.task-type-item.active {
		background: rgba(138, 51, 36, 0.1);
		border-color: #8A3324;
	}
	
	.task-type-text {
		font-size: 26rpx;
		color: #666;
	}
	
	.task-type-item.active .task-type-text {
		color: #8A3324;
		font-weight: bold;
	}
	
	/* 加载状态 */
	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 60rpx 0;
	}
	
	.loading-spinner {
		width: 60rpx;
		height: 60rpx;
		border: 6rpx solid #f3f3f3;
		border-top: 6rpx solid #7EC4CF;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-bottom: 20rpx;
	}
	
	.loading-spinner.small {
		width: 40rpx;
		height: 40rpx;
		border-width: 4rpx;
	}
	
	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}
	
	.loading-text {
		font-size: 28rpx;
		color: #999;
	}
	
	.empty-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 80rpx 0;
	}
	
	.empty-text {
		font-size: 28rpx;
		color: #999;
	}
	
	/* 任务列表 */
	.task-list {
		height: calc(100vh - 400rpx);
		padding: 0 30rpx;
	}
	
	.task-item {
		background: #fff;
		margin-bottom: 30rpx;
		border-radius: 15rpx;
		padding: 30rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
		border: 1rpx solid #e0c9d1;
	}
	
	.task-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
		padding-bottom: 15rpx;
		border-bottom: 1rpx solid #f0f0f0;
	}
	
	.task-type-badge {
		font-size: 22rpx;
		padding: 4rpx 16rpx;
		border-radius: 20rpx;
	}
	
	.task-type-badge.express {
		background-color: rgba(126, 196, 207, 0.1);
		color: #7EC4CF;
		border: 1rpx solid #7EC4CF;
	}
	
	.task-type-badge.takeout {
		background-color: rgba(255, 149, 0, 0.1);
		color: #FF9500;
		border: 1rpx solid #FF9500;
	}
	
	.task-type-badge.document {
		background-color: rgba(138, 51, 36, 0.1);
		color: #8A3324;
		border: 1rpx solid #8A3324;
	}
	
	.task-type-badge.other {
		background-color: rgba(102, 102, 102, 0.1);
		color: #666;
		border: 1rpx solid #666;
	}
	
	.task-price {
		font-size: 26rpx;
		color: #666;
	}
	
	.price-amount {
		font-weight: bold;
		color: #FF6B6B;
		font-size: 32rpx;
	}
	
	.task-route {
		margin-bottom: 20rpx;
	}
	
	.task-pickup, .task-delivery {
		display: flex;
		align-items: center;
		margin-bottom: 10rpx;
	}
	
	.location-icon {
		width: 40rpx;
		height: 40rpx;
		border-radius: 20rpx;
		text-align: center;
		line-height: 40rpx;
		font-size: 24rpx;
		margin-right: 15rpx;
		color: #fff;
	}
	
	.location-icon.pickup {
		background-color: #7EC4CF;
	}
	
	.location-icon.delivery {
		background-color: #FF9500;
	}
	
	.location-text {
		font-size: 28rpx;
		color: #333;
		flex: 1;
	}
	
	.route-arrow {
		text-align: center;
		font-size: 24rpx;
		color: #999;
		margin: 5rpx 0 5rpx 20rpx;
	}
	
	.task-footer {
		display: flex;
		justify-content: space-between;
		font-size: 24rpx;
		color: #999;
		padding-top: 15rpx;
		border-top: 1rpx solid #f0f0f0;
	}
	
	.load-more, .no-more {
		text-align: center;
		padding: 30rpx 0;
		font-size: 26rpx;
		color: #999;
	}
</style> 