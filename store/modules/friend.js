// 好友功能模块
import api from '@/utils/request';

export default {
  namespaced: true,
  
  state: {
    friendList: [], // 好友列表
    friendRequests: [], // 好友申请列表
    maybeKnowList: [], // 可能认识的人列表
    isLoading: false,
    pagination: {
      current: 1,
      size: 10,
      total: 0
    }
  },
  
  getters: {
    // 获取好友列表
    getFriendList: state => state.friendList,
    
    // 获取好友申请列表
    getFriendRequests: state => state.friendRequests,
    
    // 获取可能认识的人列表
    getMaybeKnowList: state => state.maybeKnowList,
    
    // 加载状态
    isLoading: state => state.isLoading,
    
    // 分页信息
    pagination: state => state.pagination
  },
  
  mutations: {
    // 设置好友列表
    SET_FRIEND_LIST(state, list) {
      state.friendList = list;
    },
    
    // 设置好友申请列表
    SET_FRIEND_REQUESTS(state, list) {
      state.friendRequests = list;
    },
    
    // 设置可能认识的人列表
    SET_MAYBE_KNOW_LIST(state, list) {
      state.maybeKnowList = list;
    },
    
    // 添加好友
    ADD_FRIEND(state, friend) {
      state.friendList.unshift(friend);
    },
    
    // 更新好友关系状态
    UPDATE_FRIEND_STATUS(state, { id, status }) {
      // 更新好友列表中的状态
      const friendIndex = state.friendList.findIndex(item => item.id === id);
      if (friendIndex !== -1) {
        state.friendList[friendIndex].status = status;
      }
      
      // 更新好友申请列表中的状态
      const requestIndex = state.friendRequests.findIndex(item => item.id === id);
      if (requestIndex !== -1) {
        state.friendRequests[requestIndex].status = status;
        
        // 如果已同意，从申请列表移除
        if (status === 1) {
          state.friendRequests.splice(requestIndex, 1);
        }
      }
    },
    
    // 删除好友
    DELETE_FRIEND(state, id) {
      state.friendList = state.friendList.filter(item => item.id !== id);
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
    // 添加好友关系
    async addFriend({ commit }, { userId, friendId }) {
      commit('SET_LOADING', true);
      try {
        const response = await api.post('/api/friend/relation/add', {
          userId,
          friendId
        });
        
        if (response && response.code === 1 && response.data) {
          commit('ADD_FRIEND', response.data);
        } else if (response && !response.code) {
          commit('ADD_FRIEND', response);
        }
        
        return response;
      } catch (error) {
        console.error('Error adding friend:', error);
        return Promise.reject(error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // 获取用户的好友列表
    async getFriendList({ commit }, { userId, status = null, page = 1, pageSize = 10 }) {
      commit('SET_LOADING', true);
      try {
        let url = `/api/friend/relation/list/${userId}?page=${page}&pageSize=${pageSize}`;
        if (status !== null) {
          url += `&status=${status}`;
        }
        
        const response = await api.get(url);
        
        if (response && response.code === 1 && response.data) {
          commit('SET_FRIEND_LIST', response.data.records || response.data);
          if (response.data.current) {
            commit('SET_PAGINATION', {
              current: response.data.current,
              size: response.data.size,
              total: response.data.total
            });
          }
        } else if (Array.isArray(response)) {
          commit('SET_FRIEND_LIST', response);
        } else {
          console.error('Unexpected friend list response format:', response);
          commit('SET_FRIEND_LIST', []);
        }
        
        return response;
      } catch (error) {
        console.error('Error fetching friend list:', error);
        commit('SET_FRIEND_LIST', []);
        return Promise.reject(error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // 获取好友申请列表
    async getFriendRequests({ commit }, { userId, page = 1, pageSize = 10 }) {
      commit('SET_LOADING', true);
      try {
        const url = `/api/friend/relation/requests/${userId}?page=${page}&pageSize=${pageSize}`;
        
        const response = await api.get(url);
        
        if (response && response.code === 1 && response.data) {
          commit('SET_FRIEND_REQUESTS', response.data.records || response.data);
          if (response.data.current) {
            commit('SET_PAGINATION', {
              current: response.data.current,
              size: response.data.size,
              total: response.data.total
            });
          }
        } else if (Array.isArray(response)) {
          commit('SET_FRIEND_REQUESTS', response);
        } else {
          console.error('Unexpected friend requests response format:', response);
          commit('SET_FRIEND_REQUESTS', []);
        }
        
        return response;
      } catch (error) {
        console.error('Error fetching friend requests:', error);
        commit('SET_FRIEND_REQUESTS', []);
        return Promise.reject(error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // 更新好友关系状态
    async updateFriendStatus({ commit }, { id, status }) {
      commit('SET_LOADING', true);
      try {
        const response = await api.put(`/api/friend/relation/status/${id}`, { status });
        
        if (response && (response.code === 1 || response.success)) {
          commit('UPDATE_FRIEND_STATUS', { id, status });
        }
        
        return response;
      } catch (error) {
        console.error('Error updating friend status:', error);
        return Promise.reject(error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // 删除好友关系
    async deleteFriend({ commit }, id) {
      commit('SET_LOADING', true);
      try {
        const response = await api.delete(`/api/friend/relation/${id}`);
        
        if (response && (response.code === 1 || response.success)) {
          commit('DELETE_FRIEND', id);
        }
        
        return response;
      } catch (error) {
        console.error('Error deleting friend:', error);
        return Promise.reject(error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // 检查是否为好友关系
    async checkFriendRelation({ commit }, { userId, friendId }) {
      try {
        const response = await api.get(`/api/friend/relation/check?userId=${userId}&friendId=${friendId}`);
        return response;
      } catch (error) {
        console.error('Error checking friend relation:', error);
        return Promise.reject(error);
      }
    },
    
    // 可能认识的人
    async getMaybeKnow({ commit }, userId) {
      commit('SET_LOADING', true);
      try {
        const response = await api.get(`/api/friend/relation/maybeKnow?userId=${userId}`);
        
        if (response && response.code === 1 && Array.isArray(response.data)) {
          commit('SET_MAYBE_KNOW_LIST', response.data);
        } else if (Array.isArray(response)) {
          commit('SET_MAYBE_KNOW_LIST', response);
        } else {
          console.error('Unexpected maybe know response format:', response);
          commit('SET_MAYBE_KNOW_LIST', []);
        }
        
        return response;
      } catch (error) {
        console.error('Error fetching maybe know list:', error);
        commit('SET_MAYBE_KNOW_LIST', []);
        return Promise.reject(error);
      } finally {
        commit('SET_LOADING', false);
      }
    }
  }
} 