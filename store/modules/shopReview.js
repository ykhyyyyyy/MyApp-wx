// 探店功能模块
import api from '@/utils/request';

export default {
  namespaced: true,
  
  state: {
    reviewList: [], // 探店列表
    currentReview: null, // 当前查看的探店
    reviewComments: [], // 探店评论
    isLoading: false,
    pagination: {
      current: 1,
      size: 10,
      total: 0
    }
  },
  
  getters: {
    // 获取探店列表
    getReviewList: state => state.reviewList,
    
    // 获取当前探店
    getCurrentReview: state => state.currentReview,
    
    // 获取探店评论
    getReviewComments: state => state.reviewComments,
    
    // 加载状态
    isLoading: state => state.isLoading,
    
    // 分页信息
    pagination: state => state.pagination
  },
  
  mutations: {
    // 设置探店列表
    SET_REVIEW_LIST(state, list) {
      state.reviewList = list;
    },
    
    // 设置当前探店
    SET_CURRENT_REVIEW(state, review) {
      state.currentReview = review;
    },
    
    // 设置探店评论
    SET_REVIEW_COMMENTS(state, comments) {
      state.reviewComments = comments;
    },
    
    // 添加探店
    ADD_REVIEW(state, review) {
      state.reviewList.unshift(review);
    },
    
    // 更新探店
    UPDATE_REVIEW(state, review) {
      const index = state.reviewList.findIndex(item => item.id === review.id);
      if (index !== -1) {
        state.reviewList.splice(index, 1, review);
      }
      if (state.currentReview && state.currentReview.id === review.id) {
        state.currentReview = review;
      }
    },
    
    // 删除探店
    DELETE_REVIEW(state, id) {
      state.reviewList = state.reviewList.filter(item => item.id !== id);
      if (state.currentReview && state.currentReview.id === id) {
        state.currentReview = null;
      }
    },
    
    // 添加评论
    ADD_COMMENT(state, comment) {
      state.reviewComments.unshift(comment);
    },
    
    // 删除评论
    DELETE_COMMENT(state, id) {
      state.reviewComments = state.reviewComments.filter(item => item.id !== id);
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
    // 创建探店
    async createReview({ commit }, reviewData) {
      commit('SET_LOADING', true);
      try {
        const response = await api.post('/api/shop-review', reviewData);
        
        if (response && response.code === 1 && response.data) {
          commit('ADD_REVIEW', response.data);
        } else if (response && !response.code) {
          commit('ADD_REVIEW', response);
        }
        
        return response;
      } catch (error) {
        console.error('Error creating shop review:', error);
        return Promise.reject(error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // 获取探店详情
    async getReviewDetail({ commit }, id) {
      commit('SET_LOADING', true);
      try {
        const response = await api.get(`/api/shop-review/${id}`);
        
        if (response && response.code === 1 && response.data) {
          commit('SET_CURRENT_REVIEW', response.data);
        } else if (response && !response.code) {
          commit('SET_CURRENT_REVIEW', response);
        }
        
        return response;
      } catch (error) {
        console.error('Error fetching shop review detail:', error);
        commit('SET_CURRENT_REVIEW', null);
        return Promise.reject(error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // 更新探店信息
    async updateReview({ commit }, { id, data }) {
      commit('SET_LOADING', true);
      try {
        const response = await api.put(`/api/shop-review/${id}`, data);
        
        if (response && response.code === 1 && response.data) {
          commit('UPDATE_REVIEW', response.data);
        } else if (response && !response.code) {
          commit('UPDATE_REVIEW', response);
        }
        
        return response;
      } catch (error) {
        console.error('Error updating shop review:', error);
        return Promise.reject(error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // 删除探店
    async deleteReview({ commit }, id) {
      commit('SET_LOADING', true);
      try {
        const response = await api.delete(`/api/shop-review/${id}`);
        
        if (response && (response.code === 1 || response.success)) {
          commit('DELETE_REVIEW', id);
        }
        
        return response;
      } catch (error) {
        console.error('Error deleting shop review:', error);
        return Promise.reject(error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // 分页查询探店
    async getReviewPage({ commit }, { current = 1, size = 10, shopId = null, userId = null }) {
      commit('SET_LOADING', true);
      try {
        let url = `/api/shop-review/page?current=${current}&size=${size}`;
        if (shopId) {
          url += `&shopId=${shopId}`;
        }
        if (userId) {
          url += `&userId=${userId}`;
        }
        
        const response = await api.get(url);
        
        if (response && response.code === 1 && response.data) {
          commit('SET_REVIEW_LIST', response.data.records || []);
          commit('SET_PAGINATION', {
            current: response.data.current,
            size: response.data.size,
            total: response.data.total
          });
        } else if (response && response.records) {
          commit('SET_REVIEW_LIST', response.records);
          commit('SET_PAGINATION', {
            current: response.current,
            size: response.size,
            total: response.total
          });
        } else {
          console.error('Unexpected review page response format:', response);
          commit('SET_REVIEW_LIST', []);
        }
        
        return response;
      } catch (error) {
        console.error('Error fetching review page:', error);
        commit('SET_REVIEW_LIST', []);
        return Promise.reject(error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // 创建探店评论
    async createComment({ commit }, commentData) {
      commit('SET_LOADING', true);
      try {
        const response = await api.post('/api/shop-review-comment', commentData);
        
        if (response && response.code === 1 && response.data) {
          commit('ADD_COMMENT', response.data);
        } else if (response && !response.code) {
          commit('ADD_COMMENT', response);
        }
        
        return response;
      } catch (error) {
        console.error('Error creating shop review comment:', error);
        return Promise.reject(error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // 删除探店评论
    async deleteComment({ commit }, id) {
      commit('SET_LOADING', true);
      try {
        const response = await api.delete(`/api/shop-review-comment/${id}`);
        
        if (response && (response.code === 1 || response.success)) {
          commit('DELETE_COMMENT', id);
        }
        
        return response;
      } catch (error) {
        console.error('Error deleting shop review comment:', error);
        return Promise.reject(error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // 分页查询探店评论
    async getCommentPage({ commit }, { current = 1, size = 10, reviewId = null, userId = null }) {
      commit('SET_LOADING', true);
      try {
        let url = `/api/shop-review-comment/page?current=${current}&size=${size}`;
        if (reviewId) {
          url += `&reviewId=${reviewId}`;
        }
        if (userId) {
          url += `&userId=${userId}`;
        }
        
        const response = await api.get(url);
        
        if (response && response.code === 1 && response.data) {
          commit('SET_REVIEW_COMMENTS', response.data.records || []);
          commit('SET_PAGINATION', {
            current: response.data.current,
            size: response.data.size,
            total: response.data.total
          });
        } else if (response && response.records) {
          commit('SET_REVIEW_COMMENTS', response.records);
          commit('SET_PAGINATION', {
            current: response.current,
            size: response.size,
            total: response.total
          });
        } else {
          console.error('Unexpected comment page response format:', response);
          commit('SET_REVIEW_COMMENTS', []);
        }
        
        return response;
      } catch (error) {
        console.error('Error fetching comment page:', error);
        commit('SET_REVIEW_COMMENTS', []);
        return Promise.reject(error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // 获取探店的所有评论
    async getReviewComments({ commit }, reviewId) {
      commit('SET_LOADING', true);
      try {
        const response = await api.get(`/api/shop-review-comment/review/${reviewId}`);
        
        if (response && response.code === 1 && Array.isArray(response.data)) {
          commit('SET_REVIEW_COMMENTS', response.data);
        } else if (Array.isArray(response)) {
          commit('SET_REVIEW_COMMENTS', response);
        } else {
          console.error('Unexpected review comments response format:', response);
          commit('SET_REVIEW_COMMENTS', []);
        }
        
        return response;
      } catch (error) {
        console.error('Error fetching review comments:', error);
        commit('SET_REVIEW_COMMENTS', []);
        return Promise.reject(error);
      } finally {
        commit('SET_LOADING', false);
      }
    }
  }
} 