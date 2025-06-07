<template>
  <view class="container">
    <custom-nav-bar title="我的订单" :show-back="false"></custom-nav-bar>
    <scroll-view scroll-y class="order-list" @scrolltolower="loadMore">
      <view v-if="isLoading && orders.length===0" class="loading"><uni-load-more status="loading" content-text="加载中..."></uni-load-more></view>
      <view v-else-if="orders.length===0" class="empty">暂无订单</view>
      <view v-else>
        <view class="order-item" v-for="order in orders" :key="order.id" @click="goToDetail(order.id)">
          <view class="order-title">订单号：{{order.id}}</view>
          <view class="order-info">
            <text>金额：¥{{order.totalAmount}}</text>
            <text>状态：{{getStatusText(order.status)}}</text>
          </view>
        </view>
      </view>
      <uni-load-more v-if="isLoading && orders.length>0" status="loading" content-text="加载中..."></uni-load-more>
      <uni-load-more v-if="!hasMore && orders.length>0" status="noMore" content-text="没有更多了"></uni-load-more>
    </scroll-view>
  </view>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import CustomNavBar from '@/components/CustomNavBar.vue';
export default {
  components: { CustomNavBar },
  data() { return { page:1, size:10, hasMore:true, userId:1 }; },
  computed: {
    ...mapState('order', ['orderList','isLoading','pagination']),
    orders() { return this.orderList; }
  },
  methods: {
    ...mapActions('order', ['getOrderPage']),
    async loadOrders(reset=false) {
      if (reset) { this.page=1; this.hasMore=true; }
      if (!this.hasMore) return;
      await this.getOrderPage({userId:this.userId,current:this.page,size:this.size});
      if (this.pagination && this.pagination.total<=this.orders.length) {
        this.hasMore=false;
      } else {
        this.page++;
      }
    },
    loadMore() { this.loadOrders(); },
    goToDetail(id) { uni.navigateTo({url:`/pages/order/detail?id=${id}`}); },
    getStatusText(status) {
      switch(status){
        case 0: return '待支付';
        case 1: return '已支付';
        case 2: return '已完成';
        case 3: return '已取消';
        default: return status;
      }
    }
  },
  onLoad() { this.loadOrders(true); },
  onPullDownRefresh() { this.loadOrders(true).then(()=>uni.stopPullDownRefresh()); }
}
</script>
<style>
.container{min-height:100vh;background:#f5f5f5;}
.order-list{height:80vh;overflow-y:auto;}
.order-item{background:#fff;margin:20rpx 0;border-radius:12rpx;padding:30rpx;box-shadow:0 2rpx 8rpx rgba(0,0,0,0.04);}
.order-title{font-size:30rpx;font-weight:bold;color:#333;margin-bottom:10rpx;}
.order-info{font-size:26rpx;color:#666;display:flex;justify-content:space-between;}
.loading,.empty{text-align:center;color:#999;padding:100rpx 0;}
</style> 