// AI功能模块
import api from '@/utils/request';

export default {
  namespaced: true,
  
  state: {
    chatSessions: [], // 用户的所有会话
    currentSessionMessages: [], // 当前会话的消息列表
    isLoading: false
  },
  
  getters: {
    // 获取所有会话
    getAllSessions: state => state.chatSessions,
    
    // 获取当前会话消息
    getCurrentMessages: state => state.currentSessionMessages,
    
    // 加载状态
    isLoading: state => state.isLoading
  },
  
  mutations: {
    // 设置会话列表
    SET_CHAT_SESSIONS(state, sessions) {
      state.chatSessions = sessions;
    },
    
    // 设置当前会话消息
    SET_CURRENT_MESSAGES(state, messages) {
      state.currentSessionMessages = messages;
    },
    
    // 添加消息到当前会话
    ADD_MESSAGE(state, message) {
      state.currentSessionMessages.push(message);
    },
    
    // 设置加载状态
    SET_LOADING(state, isLoading) {
      state.isLoading = isLoading;
    }
  },
  
  actions: {
    // 获取用户的所有会话
    async fetchChatHistory({ commit }, userId) {
      commit('SET_LOADING', true);
      try {
        const response = await api.get(`/api/ai/history?userId=${userId}`);
        if (response && response.code === 1 && Array.isArray(response.data)) {
          commit('SET_CHAT_SESSIONS', response.data);
        } else if (Array.isArray(response)) {
          commit('SET_CHAT_SESSIONS', response);
        } else {
          console.error('Unexpected history response format:', response);
          commit('SET_CHAT_SESSIONS', []);
        }
        return response;
      } catch (error) {
        console.error('Error fetching chat history:', error);
        commit('SET_CHAT_SESSIONS', []);
        return Promise.reject(error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // 获取会话内的聊天记录
    async fetchSessionMessages({ commit }, chatSessionId) {
      commit('SET_LOADING', true);
      try {
        const response = await api.get(`/api/ai/history/message?chatSessionId=${chatSessionId}`);
        if (response && response.code === 1 && Array.isArray(response.data)) {
          commit('SET_CURRENT_MESSAGES', response.data);
        } else if (Array.isArray(response)) {
          commit('SET_CURRENT_MESSAGES', response);
        } else {
          console.error('Unexpected messages response format:', response);
          commit('SET_CURRENT_MESSAGES', []);
        }
        return response;
      } catch (error) {
        console.error('Error fetching session messages:', error);
        commit('SET_CURRENT_MESSAGES', []);
        return Promise.reject(error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // 发送聊天消息（非流式）
    async sendChatMessage({ commit }, { userId, input, chatId }) {
      try {
        // 添加用户消息到本地
        commit('ADD_MESSAGE', {
          role: 'USER',
          content: input
        });
        
        // 发送请求
        const response = await api.post('/api/ai/chat', {
          userId,
          input,
          chatId
        });
        
        // 添加AI回复到本地
        if (response && response.content) {
          commit('ADD_MESSAGE', {
            role: 'ASSISTANT',
            content: response.content
          });
        }
        
        return response;
      } catch (error) {
        console.error('Error sending chat message:', error);
        return Promise.reject(error);
      }
    },
    
    // 智能商品推荐
    async getShopRecommendations({ commit }, { userId, products }) {
      try {
        const response = await api.post(`/api/ai/openFeign/shopRecommend/${userId}`, products);
        return response;
      } catch (error) {
        console.error('Error getting shop recommendations:', error);
        return Promise.reject(error);
      }
    }
  }
} 