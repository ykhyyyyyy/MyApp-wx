// 优惠券功能模块
import api from '@/utils/request';

export default {
  namespaced: true,
  
  state: {
    coupons: [], // 用户的优惠券列表
    currentCoupon: null, // 当前查看的优惠券
    isLoading: false
  },
  
  getters: {
    // 获取所有优惠券
    getAllCoupons: state => state.coupons,
    
    // 获取当前优惠券
    getCurrentCoupon: state => state.currentCoupon,
    
    // 加载状态
    isLoading: state => state.isLoading
  },
  
  mutations: {
    // 设置优惠券列表
    SET_COUPONS(state, coupons) {
      state.coupons = coupons;
    },
    
    // 设置当前优惠券
    SET_CURRENT_COUPON(state, coupon) {
      state.currentCoupon = coupon;
    },
    
    // 添加优惠券
    ADD_COUPON(state, coupon) {
      state.coupons.push(coupon);
    },
    
    // 设置加载状态
    SET_LOADING(state, isLoading) {
      state.isLoading = isLoading;
    }
  },
  
  actions: {
    // 秒杀优惠券
    async speedKillCoupon({ commit }, { userId, couponId }) {
      commit('SET_LOADING', true);
      try {
        const response = await api.post('/api/coupon/speedKill', {
          userId,
          couponId
        });
        
        if (response && response.code === 1 && response.data) {
          // 如果秒杀成功，添加到优惠券列表
          commit('ADD_COUPON', response.data);
        }
        
        return response;
      } catch (error) {
        console.error('Error speed killing coupon:', error);
        return Promise.reject(error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // 获取优惠券详情
    async getCouponDetail({ commit }, couponId) {
      commit('SET_LOADING', true);
      try {
        const response = await api.get(`/api/coupon/${couponId}`);
        
        if (response && response.code === 1 && response.data) {
          commit('SET_CURRENT_COUPON', response.data);
        } else if (response && !response.code) {
          // 直接返回数据的情况
          commit('SET_CURRENT_COUPON', response);
        }
        
        return response;
      } catch (error) {
        console.error('Error fetching coupon detail:', error);
        commit('SET_CURRENT_COUPON', null);
        return Promise.reject(error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // 获取用户的所有优惠券
    async getUserCoupons({ commit }, userId) {
      commit('SET_LOADING', true);
      try {
        const response = await api.get(`/api/coupon/user/${userId}`);
        
        if (response && response.code === 1 && Array.isArray(response.data)) {
          commit('SET_COUPONS', response.data);
        } else if (Array.isArray(response)) {
          commit('SET_COUPONS', response);
        } else {
          console.error('Unexpected coupons response format:', response);
          commit('SET_COUPONS', []);
        }
        
        return response;
      } catch (error) {
        console.error('Error fetching user coupons:', error);
        commit('SET_COUPONS', []);
        return Promise.reject(error);
      } finally {
        commit('SET_LOADING', false);
      }
    }
  }
} 