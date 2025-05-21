import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// Import modules
import user from './modules/user'
// import posts from './modules/posts'

export default new Vuex.Store({
  state: {
    // Global state
    bannerList: [
      { image: '/static/images/banner1.png' },
      { image: '/static/images/banner2.png' },
      { image: '/static/images/banner3.png' }
    ],
    quickAccessList: [
      { name: '探店', icon: '/static/icons/explore.png', path: './explore/index' },
      { name: '论坛', icon: '/static/icons/forum.png', path: './forum/index' },
      { name: '商城', icon: '/static/icons/shop.png', path: './mall/index' },
      { name: '代取', icon: '/static/icons/express.png', path: './proxy/index' },
      { name: 'AI助手', icon: '/static/icons/ai.png', path: './ai/index' }
    ],
    postList: [
      {
        id: 1,
        username: '青竹书院11',
        avatar: '/static/avatars/user1.png',
        time: '10分钟前',
        title: '校内最值得打卡的五家美食店铺',
        content: '经过一个月的探店，终于整理出了校内最值得打卡的五家店铺，每一家都有其独特的风味...',
        images: ['/static/posts/food1.png', '/static/posts/food2.png'],
        views: 128,
        comments: 32,
        likes: 64
      },
      {
        id: 2,
        username: '墨客飘香',
        avatar: '/static/avatars/user2.png',
        time: '1小时前',
        title: '传统文化讲座回顾',
        content: '今天的传统文化讲座干货满满，特别是关于汉服的部分，分享一些笔记和现场照片...',
        images: ['/static/posts/culture1.png'],
        views: 86,
        comments: 15,
        likes: 42
      }
    ],
    shopList: [
      {
        id: 1,
        name: '悦读书坊',
        image: '/static/shops/bookstore.png',
        rating: 4.8
      },
      {
        id: 2,
        name: '墨香茶馆',
        image: '/static/shops/teahouse.png',
        rating: 4.9
      },
      {
        id: 3,
        name: '锦绣服坊',
        image: '/static/shops/clothing.png',
        rating: 4.7
      },
      {
        id: 4,
        name: '淳风小厨',
        image: '/static/shops/restaurant.png',
        rating: 4.6
      }
    ]
  },
  getters: {
    // Global getters
  },
  mutations: {
    // Mutations to update state
  },
  actions: {
    // Actions to perform async operations
  },
  modules: {
    // Add your modules here
    user
    // posts
  }
}) 