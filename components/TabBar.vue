<template>
    <view class="custom-tabbar">
        <!-- 背景纹理 -->
        <view class="tabbar-bg"></view>
        
        <!-- 主体内容 -->
        <view class="tabbar-content">
            <view 
                v-for="(item, index) in tabItems" 
                :key="index" 
                class="tab-item" 
                :class="{ 'active': currentTab === index }"
                @click="switchTab(index, item.path)"
            >
                <view class="item-icon-wrapper" :class="{ 'active-icon': currentTab === index }">
                    <image :src="currentTab === index ? item.selectedIconPath : item.iconPath" class="tab-icon"></image>
                </view>
                <text class="tab-text" :class="{ 'active-text': currentTab === index }">{{ item.text }}</text>
                <!-- 中国传统的红色印章效果，仅在激活时显示 -->
                <view class="seal" v-if="currentTab === index"></view>
            </view>
            
            <!-- 中间凸起按钮位置（如需要）-->
            <!-- <view class="center-button" @click="handleCenterButton">
                <image src="/static/tabbar/center-icon.png" class="center-icon"></image>
            </view> -->
        </view>
        
        <!-- 顶部装饰 - 中国风纹饰 -->
        <view class="tabbar-decoration"></view>
    </view>
</template>

<script>
export default {
    name: 'TabBar',
    data() {
        return {
            // 默认选中首页
            currentTab: 0,
            // 导航项配置
            tabItems: [
                {
                    text: '首页',
                    path: '/pages/index/index',
                    iconPath: '/static/tabbar/home.png',
                    selectedIconPath: '/static/tabbar/home-active.png'
                },
                {
                    text: '探店',
                    path: '/pages/explore/index',
                    iconPath: '/static/tabbar/explore.png',
                    selectedIconPath: '/static/tabbar/explore-active.png'
                },
                {
                    text: '论坛',
                    path: '/pages/forum/index',
                    iconPath: '/static/tabbar/forum.png',
                    selectedIconPath: '/static/tabbar/forum-active.png'
                },
                {
                    text: '商城',
                    path: '/pages/mall/index',
                    iconPath: '/static/tabbar/mall.png',
                    selectedIconPath: '/static/tabbar/mall-active.png'
                },
                {
                    text: '我的',
                    path: '/pages/user/index',
                    iconPath: '/static/tabbar/user.png',
                    selectedIconPath: '/static/tabbar/user-active.png'
                }
            ]
        };
    },
    methods: {
        // 切换标签页
        switchTab(index, path) {
            if (this.currentTab !== index) {
                this.currentTab = index;
                uni.switchTab({
                    url: path
                });
            }
        },
        
        // 设置当前激活标签（外部调用）
        setActiveTab(index) {
            this.currentTab = index;
        },
        
        // 可选：中心按钮特殊处理
        handleCenterButton() {
            // 自定义处理，例如打开特殊页面或模态框
            uni.navigateTo({
                url: '/pages/ai/index'
            });
        }
    },
    // 监听页面路由变化，自动设置激活标签
    mounted() {
        // 获取当前页面路由
        const pages = getCurrentPages();
        const currentPage = pages[pages.length - 1];
        const currentPath = `/${currentPage.route}`;
        
        // 找到匹配的标签并设置为激活
        const foundIndex = this.tabItems.findIndex(item => item.path === currentPath);
        if (foundIndex !== -1) {
            this.currentTab = foundIndex;
        }
    }
};
</script>

<style>
.custom-tabbar {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 120rpx; /* 足够高度容纳内容和装饰 */
    z-index: 999;
}

.tabbar-bg {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #F8F3E6; /* 米色底色 */
    background-image: url('/static/decoration/paper-texture.png'); /* 纸张纹理背景 */
}

.tabbar-decoration {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 8rpx;
    background-image: linear-gradient(to right, #8A3324, #E0C9D1, #8A3324, #E0C9D1, #8A3324); /* 传统红褐色和奶白色的渐变 */
    opacity: 0.8;
    box-shadow: 0 -2rpx 6rpx rgba(138, 51, 36, 0.15);
}

.tabbar-content {
    position: relative;
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 100%;
    padding-bottom: env(safe-area-inset-bottom); /* 适配全面屏底部安全区域 */
}

.tab-item {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    padding-top: 10rpx;
}

.item-icon-wrapper {
    width: 56rpx;
    height: 56rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    transition: all 0.3s;
}

.item-icon-wrapper.active-icon {
    transform: translateY(-8rpx) scale(1.1);
}

.tab-icon {
    width: 48rpx;
    height: 48rpx;
}

.tab-text {
    font-size: 24rpx;
    color: #8C7853; /* 土黄色 */
    margin-top: 4rpx;
    font-weight: 500;
}

.active-text {
    color: #8A3324; /* 传统中国红 */
    font-weight: bold;
}

/* 印章效果 - 中国传统元素 */
.seal {
    position: absolute;
    bottom: 5rpx;
    width: 25rpx;
    height: 25rpx;
    background-image: url('/static/tabbar/seal.png'); /* 小型印章装饰 */
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    opacity: 0.8;
}

/* 可选：中心凸起按钮 */
.center-button {
    position: absolute;
    width: 100rpx;
    height: 100rpx;
    background: radial-gradient(circle, #8A3324, #A05544);
    border-radius: 50%;
    top: -30rpx;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.2);
    border: 4rpx solid #E0C9D1;
}

.center-icon {
    width: 60rpx;
    height: 60rpx;
}

/* 为每个标签添加古典中国风图案装饰 */
.tab-item::before {
    content: '';
    position: absolute;
    top: 4rpx;
    width: 30rpx;
    height: 10rpx;
    opacity: 0;
    background-image: url('/static/decoration/chinese-knot.png'); /* 中国结装饰 */
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    transition: opacity 0.3s;
}

.tab-item.active::before {
    opacity: 0.7;
}
</style> 