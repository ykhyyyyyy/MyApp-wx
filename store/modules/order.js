// 订单功能模块
import api from '@/utils/request';

export default {
  namespaced: true,
  
  state: {
    orderList: [], // 订单列表
    currentOrder: null, // 当前查看的订单
    isLoading: false,
    pagination: {
      current: 1,
      size: 10,
      total: 0
    }
  },
  
  getters: {
    // 获取订单列表
    getOrderList: state => state.orderList,
    
    // 获取当前订单
    getCurrentOrder: state => state.currentOrder,
    
    // 加载状态
    isLoading: state => state.isLoading,
    
    // 分页信息
    pagination: state => state.pagination
  },
  
  mutations: {
    // 设置订单列表
    SET_ORDER_LIST(state, list) {
      state.orderList = list;
    },
    
    // 设置当前订单
    SET_CURRENT_ORDER(state, order) {
      state.currentOrder = order;
    },
    
    // 添加订单
    ADD_ORDER(state, order) {
      state.orderList.unshift(order);
    },
    
    // 更新订单
    UPDATE_ORDER(state, order) {
      const index = state.orderList.findIndex(item => item.id === order.id);
      if (index !== -1) {
        state.orderList.splice(index, 1, order);
      }
      if (state.currentOrder && state.currentOrder.id === order.id) {
        state.currentOrder = order;
      }
    },
    
    // 设置加载状态
    SET_LOADING(state, isLoading) {
      state.isLoading = isLoading;
    },
    
    // 设置分页信息
    SET_PAGINATION(state, pagination) {
      state.pagination = { ...state.pagination, ...pagination };
    }
  },
  
  actions: {
    // 创建订单
    async createOrder({ commit }, orderData) {
      commit('SET_LOADING', true);
      try {
        const response = await api.post('/api/order/create', orderData);
        
        if (response && response.code === 1 && response.data) {
          commit('ADD_ORDER', response.data);
        } else if (response && !response.code) {
          commit('ADD_ORDER', response);
        }
        
        return response;
      } catch (error) {
        console.error('Error creating order:', error);
        return Promise.reject(error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // 获取订单详情
    async getOrderDetail({ commit }, { orderId, userId }) {
      commit('SET_LOADING', true);
      try {
        const response = await api.get(`/api/order/detail?orderId=${orderId}&userId=${userId}`);
        
        if (response && response.code === 1 && response.data) {
          commit('SET_CURRENT_ORDER', response.data);
        } else if (response && !response.code) {
          commit('SET_CURRENT_ORDER', response);
        }
        
        return response;
      } catch (error) {
        console.error('Error fetching order detail:', error);
        commit('SET_CURRENT_ORDER', null);
        return Promise.reject(error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // 获取用户所有订单
    async getUserOrders({ commit }, userId) {
      commit('SET_LOADING', true);
      try {
        const response = await api.get(`/api/order/user/${userId}`);
        
        if (response && response.code === 1 && Array.isArray(response.data)) {
          commit('SET_ORDER_LIST', response.data);
        } else if (Array.isArray(response)) {
          commit('SET_ORDER_LIST', response);
        } else {
          console.error('Unexpected user orders response format:', response);
          commit('SET_ORDER_LIST', []);
        }
        
        return response;
      } catch (error) {
        console.error('Error fetching user orders:', error);
        commit('SET_ORDER_LIST', []);
        return Promise.reject(error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // 分页查询用户订单
    async getUserOrdersPage({ commit }, { userId, current = 1, size = 10, status = null }) {
      commit('SET_LOADING', true);
      try {
        let url = `/api/order/user/${userId}/page?current=${current}&size=${size}`;
        if (status !== null) {
          url += `&status=${status}`;
        }
        
        const response = await api.get(url);
        
        if (response && response.code === 1 && response.data) {
          commit('SET_ORDER_LIST', response.data.records || []);
          commit('SET_PAGINATION', {
            current: response.data.current,
            size: response.data.size,
            total: response.data.total
          });
        } else if (response && response.records) {
          commit('SET_ORDER_LIST', response.records);
          commit('SET_PAGINATION', {
            current: response.current,
            size: response.size,
            total: response.total
          });
        } else {
          console.error('Unexpected user orders page response format:', response);
          commit('SET_ORDER_LIST', []);
        }
        
        return response;
      } catch (error) {
        console.error('Error fetching user orders page:', error);
        commit('SET_ORDER_LIST', []);
        return Promise.reject(error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // 取消订单
    async cancelOrder({ commit }, { userId, orderId }) {
      commit('SET_LOADING', true);
      try {
        const response = await api.put(`/api/order/${userId}/${orderId}/cancel`);
        
        if (response && (response.code === 1 || response.success)) {
          // 如果成功，更新订单状态
          const updatedOrder = { ...state.currentOrder, status: 'CANCELED' };
          commit('UPDATE_ORDER', updatedOrder);
        }
        
        return response;
      } catch (error) {
        console.error('Error canceling order:', error);
        return Promise.reject(error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // 支付订单
    async payOrder({ commit }, { userId, orderId }) {
      commit('SET_LOADING', true);
      try {
        const response = await api.put(`/api/order/${userId}/${orderId}/pay`);
        
        if (response && (response.code === 1 || response.success)) {
          // 如果成功，更新订单状态
          const updatedOrder = { ...state.currentOrder, status: 'PAID' };
          commit('UPDATE_ORDER', updatedOrder);
        }
        
        return response;
      } catch (error) {
        console.error('Error paying order:', error);
        return Promise.reject(error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // 完成订单
    async completeOrder({ commit }, { userId, orderId }) {
      commit('SET_LOADING', true);
      try {
        const response = await api.put(`/api/order/${userId}/${orderId}/complete`);
        
        if (response && (response.code === 1 || response.success)) {
          // 如果成功，更新订单状态
          const updatedOrder = { ...state.currentOrder, status: 'COMPLETED' };
          commit('UPDATE_ORDER', updatedOrder);
        }
        
        return response;
      } catch (error) {
        console.error('Error completing order:', error);
        return Promise.reject(error);
      } finally {
        commit('SET_LOADING', false);
      }
    }
  }
} 