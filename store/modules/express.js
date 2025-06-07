// 代取任务功能模块
import api from '@/utils/request';

export default {
  namespaced: true,
  
  state: {
    expressList: [], // 快递订单列表
    currentExpress: null, // 当前查看的快递订单
    isLoading: false,
    pagination: {
      current: 1,
      size: 10,
      total: 0
    }
  },
  
  getters: {
    // 获取所有快递订单
    getAllExpress: state => state.expressList,
    
    // 获取当前快递订单
    getCurrentExpress: state => state.currentExpress,
    
    // 加载状态
    isLoading: state => state.isLoading,
    
    // 分页信息
    pagination: state => state.pagination
  },
  
  mutations: {
    // 设置快递订单列表
    SET_EXPRESS_LIST(state, list) {
      state.expressList = list;
    },
    
    // 设置当前快递订单
    SET_CURRENT_EXPRESS(state, express) {
      state.currentExpress = express;
    },
    
    // 添加快递订单
    ADD_EXPRESS(state, express) {
      state.expressList.unshift(express);
    },
    
    // 更新快递订单
    UPDATE_EXPRESS(state, express) {
      const index = state.expressList.findIndex(item => item.id === express.id);
      if (index !== -1) {
        state.expressList.splice(index, 1, express);
      }
      if (state.currentExpress && state.currentExpress.id === express.id) {
        state.currentExpress = express;
      }
    },
    
    // 删除快递订单
    DELETE_EXPRESS(state, id) {
      state.expressList = state.expressList.filter(item => item.id !== id);
      if (state.currentExpress && state.currentExpress.id === id) {
        state.currentExpress = null;
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
    // 创建快递订单
    async createExpress({ commit }, expressData) {
      commit('SET_LOADING', true);
      try {
        const response = await api.post('/api/express', expressData);
        
        if (response && response.code === 1 && response.data) {
          commit('ADD_EXPRESS', response.data);
        } else if (response && !response.code) {
          commit('ADD_EXPRESS', response);
        }
        
        return response;
      } catch (error) {
        console.error('Error creating express order:', error);
        return Promise.reject(error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // 获取快递订单详情
    async getExpressDetail({ commit }, id) {
      commit('SET_LOADING', true);
      try {
        const response = await api.get(`/api/express/${id}`);
        
        if (response && response.code === 1 && response.data) {
          commit('SET_CURRENT_EXPRESS', response.data);
        } else if (response && !response.code) {
          commit('SET_CURRENT_EXPRESS', response);
        }
        
        return response;
      } catch (error) {
        console.error('Error fetching express detail:', error);
        commit('SET_CURRENT_EXPRESS', null);
        return Promise.reject(error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // 更新快递订单信息
    async updateExpress({ commit }, { id, data }) {
      commit('SET_LOADING', true);
      try {
        const response = await api.put(`/api/express/${id}`, data);
        
        if (response && response.code === 1 && response.data) {
          commit('UPDATE_EXPRESS', response.data);
        } else if (response && !response.code) {
          commit('UPDATE_EXPRESS', response);
        }
        
        return response;
      } catch (error) {
        console.error('Error updating express order:', error);
        return Promise.reject(error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // 删除快递订单
    async deleteExpress({ commit }, id) {
      commit('SET_LOADING', true);
      try {
        const response = await api.delete(`/api/express/${id}`);
        
        if (response && (response.code === 1 || response.success)) {
          commit('DELETE_EXPRESS', id);
        }
        
        return response;
      } catch (error) {
        console.error('Error deleting express order:', error);
        return Promise.reject(error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // 分页查询快递订单
    async getExpressPage({ commit }, { current = 1, size = 10, userId = null }) {
      commit('SET_LOADING', true);
      try {
        let url = `/api/express/page?current=${current}&size=${size}`;
        if (userId) {
          url += `&userId=${userId}`;
        }
        
        const response = await api.get(url);
        
        if (response && response.code === 1 && response.data) {
          commit('SET_EXPRESS_LIST', response.data.records || []);
          commit('SET_PAGINATION', {
            current: response.data.current,
            size: response.data.size,
            total: response.data.total
          });
        } else if (response && response.records) {
          commit('SET_EXPRESS_LIST', response.records);
          commit('SET_PAGINATION', {
            current: response.current,
            size: response.size,
            total: response.total
          });
        } else {
          console.error('Unexpected express page response format:', response);
          commit('SET_EXPRESS_LIST', []);
        }
        
        return response;
      } catch (error) {
        console.error('Error fetching express page:', error);
        commit('SET_EXPRESS_LIST', []);
        return Promise.reject(error);
      } finally {
        commit('SET_LOADING', false);
      }
    }
  }
} 