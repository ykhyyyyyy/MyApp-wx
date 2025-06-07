// 聊天功能模块
import api from '@/utils/request';

export default {
  namespaced: true,
  
  state: {
    chatSessions: [], // 聊天会话列表
    currentSession: null, // 当前聊天会话
    chatMessages: [], // 当前会话的消息列表
    isLoading: false,
    pagination: {
      page: 1,
      pageSize: 20,
      total: 0
    }
  },
  
  getters: {
    // 获取所有聊天会话
    getAllSessions: state => state.chatSessions,
    
    // 获取当前会话
    getCurrentSession: state => state.currentSession,
    
    // 获取当前会话的消息列表
    getChatMessages: state => state.chatMessages,
    
    // 加载状态
    isLoading: state => state.isLoading,
    
    // 分页信息
    pagination: state => state.pagination
  },
  
  mutations: {
    // 设置聊天会话列表
    SET_CHAT_SESSIONS(state, sessions) {
      state.chatSessions = sessions;
    },
    
    // 设置当前会话
    SET_CURRENT_SESSION(state, session) {
      state.currentSession = session;
    },
    
    // 设置聊天消息列表
    SET_CHAT_MESSAGES(state, messages) {
      state.chatMessages = messages;
    },
    
    // 添加消息
    ADD_MESSAGE(state, message) {
      state.chatMessages.push(message);
    },
    
    // 添加或更新会话
    ADD_OR_UPDATE_SESSION(state, session) {
      const index = state.chatSessions.findIndex(item => item.id === session.id);
      if (index !== -1) {
        state.chatSessions.splice(index, 1, session);
      } else {
        state.chatSessions.unshift(session);
      }
    },
    
    // 更新会话未读消息数
    UPDATE_SESSION_UNREAD(state, { userId, friendId, count }) {
      const session = state.chatSessions.find(
        s => (s.userId === userId && s.friendId === friendId) || 
             (s.userId === friendId && s.friendId === userId)
      );
      
      if (session) {
        session.unreadCount = count;
      }
    },
    
    // 删除会话
    DELETE_SESSION(state, id) {
      state.chatSessions = state.chatSessions.filter(item => item.id !== id);
      if (state.currentSession && state.currentSession.id === id) {
        state.currentSession = null;
        state.chatMessages = [];
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
    // 发送消息
    async sendMessage({ commit }, messageData) {
      try {
        const response = await api.post('/api/friend/chat/message/send', messageData);
        
        if (response && response.code === 1 && response.data) {
          commit('ADD_MESSAGE', response.data);
        } else if (response && !response.code) {
          commit('ADD_MESSAGE', response);
        }
        
        return response;
      } catch (error) {
        console.error('Error sending message:', error);
        return Promise.reject(error);
      }
    },
    
    // 获取聊天记录
    async getChatMessages({ commit }, { senderId, receiverId, page = 1, pageSize = 20 }) {
      commit('SET_LOADING', true);
      try {
        const response = await api.get(
          `/api/friend/chat/message/list?senderId=${senderId}&receiverId=${receiverId}&page=${page}&pageSize=${pageSize}`
        );
        
        if (response && response.code === 1 && response.data) {
          commit('SET_CHAT_MESSAGES', response.data.records || response.data);
          if (response.data.current) {
            commit('SET_PAGINATION', {
              page: response.data.current,
              pageSize: response.data.size,
              total: response.data.total
            });
          }
        } else if (Array.isArray(response)) {
          commit('SET_CHAT_MESSAGES', response);
        } else {
          console.error('Unexpected chat messages response format:', response);
          commit('SET_CHAT_MESSAGES', []);
        }
        
        return response;
      } catch (error) {
        console.error('Error fetching chat messages:', error);
        commit('SET_CHAT_MESSAGES', []);
        return Promise.reject(error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // 创建或更新会话
    async saveSession({ commit }, sessionData) {
      try {
        const response = await api.post('/api/friend/chat/session/save', sessionData);
        
        if (response && response.code === 1 && response.data) {
          commit('ADD_OR_UPDATE_SESSION', response.data);
        } else if (response && !response.code) {
          commit('ADD_OR_UPDATE_SESSION', response);
        }
        
        return response;
      } catch (error) {
        console.error('Error saving session:', error);
        return Promise.reject(error);
      }
    },
    
    // 获取用户的所有会话列表
    async getUserSessions({ commit }, { userId, page = 1, pageSize = 20 }) {
      commit('SET_LOADING', true);
      try {
        const response = await api.get(
          `/api/friend/chat/session/list/${userId}?page=${page}&pageSize=${pageSize}`
        );
        
        if (response && response.code === 1 && response.data) {
          commit('SET_CHAT_SESSIONS', response.data.records || response.data);
          if (response.data.current) {
            commit('SET_PAGINATION', {
              page: response.data.current,
              pageSize: response.data.size,
              total: response.data.total
            });
          }
        } else if (Array.isArray(response)) {
          commit('SET_CHAT_SESSIONS', response);
        } else {
          console.error('Unexpected chat sessions response format:', response);
          commit('SET_CHAT_SESSIONS', []);
        }
        
        return response;
      } catch (error) {
        console.error('Error fetching user sessions:', error);
        commit('SET_CHAT_SESSIONS', []);
        return Promise.reject(error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // 获取单个会话
    async getSession({ commit }, id) {
      commit('SET_LOADING', true);
      try {
        const response = await api.get(`/api/friend/chat/session/${id}`);
        
        if (response && response.code === 1 && response.data) {
          commit('SET_CURRENT_SESSION', response.data);
        } else if (response && !response.code) {
          commit('SET_CURRENT_SESSION', response);
        }
        
        return response;
      } catch (error) {
        console.error('Error fetching session:', error);
        commit('SET_CURRENT_SESSION', null);
        return Promise.reject(error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // 更新未读消息数
    async updateUnreadCount({ commit }, { userId, friendId, count }) {
      try {
        const response = await api.put('/api/friend/chat/session/unread', {
          userId,
          friendId,
          count
        });
        
        if (response && (response.code === 1 || response.success)) {
          commit('UPDATE_SESSION_UNREAD', { userId, friendId, count });
        }
        
        return response;
      } catch (error) {
        console.error('Error updating unread count:', error);
        return Promise.reject(error);
      }
    },
    
    // 删除会话
    async deleteSession({ commit }, id) {
      commit('SET_LOADING', true);
      try {
        const response = await api.delete(`/api/friend/chat/session/${id}`);
        
        if (response && (response.code === 1 || response.success)) {
          commit('DELETE_SESSION', id);
        }
        
        return response;
      } catch (error) {
        console.error('Error deleting session:', error);
        return Promise.reject(error);
      } finally {
        commit('SET_LOADING', false);
      }
    }
  }
} 