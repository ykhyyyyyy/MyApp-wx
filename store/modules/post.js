// 帖子功能模块
import api from '@/utils/request';

export default {
  namespaced: true,
  
  state: {
    postList: [], // 帖子列表
    currentPost: null, // 当前查看的帖子
    hotPosts: [], // 热门帖子
    postComments: [], // 帖子评论
    isLoading: false,
    pagination: {
      current: 1,
      size: 10,
      total: 0
    }
  },
  
  getters: {
    // 获取帖子列表
    getPostList: state => state.postList,
    
    // 获取当前帖子
    getCurrentPost: state => state.currentPost,
    
    // 获取热门帖子
    getHotPosts: state => state.hotPosts,
    
    // 获取帖子评论
    getPostComments: state => state.postComments,
    
    // 加载状态
    isLoading: state => state.isLoading,
    
    // 分页信息
    pagination: state => state.pagination
  },
  
  mutations: {
    // 设置帖子列表
    SET_POST_LIST(state, list) {
      state.postList = list;
    },
    
    // 设置当前帖子
    SET_CURRENT_POST(state, post) {
      state.currentPost = post;
    },
    
    // 设置热门帖子
    SET_HOT_POSTS(state, posts) {
      state.hotPosts = posts;
    },
    
    // 设置帖子评论
    SET_POST_COMMENTS(state, comments) {
      state.postComments = comments;
    },
    
    // 添加帖子
    ADD_POST(state, post) {
      state.postList.unshift(post);
    },
    
    // 更新帖子
    UPDATE_POST(state, post) {
      const index = state.postList.findIndex(item => item.id === post.id);
      if (index !== -1) {
        state.postList.splice(index, 1, post);
      }
      if (state.currentPost && state.currentPost.id === post.id) {
        state.currentPost = post;
      }
    },
    
    // 删除帖子
    DELETE_POST(state, id) {
      state.postList = state.postList.filter(item => item.id !== id);
      if (state.currentPost && state.currentPost.id === id) {
        state.currentPost = null;
      }
    },
    
    // 添加评论
    ADD_COMMENT(state, comment) {
      state.postComments.unshift(comment);
    },
    
    // 删除评论
    DELETE_COMMENT(state, id) {
      state.postComments = state.postComments.filter(item => item.id !== id);
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
    // 创建帖子
    async createPost({ commit }, postData) {
      commit('SET_LOADING', true);
      try {
        const response = await api.post('/api/post', postData);
        
        if (response && response.code === 1 && response.data) {
          commit('ADD_POST', response.data);
        } else if (response && !response.code) {
          commit('ADD_POST', response);
        }
        
        return response;
      } catch (error) {
        console.error('Error creating post:', error);
        return Promise.reject(error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // 获取帖子详情
    async getPostDetail({ commit }, id) {
      commit('SET_LOADING', true);
      try {
        const response = await api.get(`/api/post/${id}`);
        
        if (response && response.code === 1 && response.data) {
          commit('SET_CURRENT_POST', response.data);
        } else if (response && !response.code) {
          commit('SET_CURRENT_POST', response);
        }
        
        return response;
      } catch (error) {
        console.error('Error fetching post detail:', error);
        commit('SET_CURRENT_POST', null);
        return Promise.reject(error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // 更新帖子信息
    async updatePost({ commit }, { id, data }) {
      commit('SET_LOADING', true);
      try {
        const response = await api.put(`/api/post/${id}`, data);
        
        if (response && response.code === 1 && response.data) {
          commit('UPDATE_POST', response.data);
        } else if (response && !response.code) {
          commit('UPDATE_POST', response);
        }
        
        return response;
      } catch (error) {
        console.error('Error updating post:', error);
        return Promise.reject(error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // 获取热门帖子
    async getHotPosts({ commit }) {
      commit('SET_LOADING', true);
      try {
        console.log('Fetching hot posts...');
        const response = await api.get('/api/post/hot');
        console.log('Hot posts API response:', response);
        
        if (response && response.code === 1 && Array.isArray(response.data)) {
          console.log('Using response.data for hot posts');
          commit('SET_HOT_POSTS', response.data);
        } else if (Array.isArray(response)) {
          console.log('Using direct response array for hot posts');
          commit('SET_HOT_POSTS', response);
        } else {
          console.error('Unexpected hot posts response format:', response);
          
          // Try to find array data in response
          if (response && typeof response === 'object') {
            const keys = Object.keys(response);
            console.log('Response keys:', keys);
            
            // Check for records property which is common in pagination responses
            if (response.records && Array.isArray(response.records)) {
              console.log('Found records array in response');
              commit('SET_HOT_POSTS', response.records);
              return response;
            }
            
            // Look for any array property in the response
            for (const key of keys) {
              if (Array.isArray(response[key])) {
                console.log(`Found array in response at key ${key}`);
                commit('SET_HOT_POSTS', response[key]);
                return response;
              }
            }
          }
          
          commit('SET_HOT_POSTS', []);
        }
        
        return response;
      } catch (error) {
        console.error('Error fetching hot posts:', error);
        commit('SET_HOT_POSTS', []);
        return Promise.reject(error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // 分页查询帖子
    async getPostPage({ commit }, { current = 1, size = 10, userId = null }) {
      commit('SET_LOADING', true);
      try {
        let url = `/api/post/page?current=${current}&size=${size}`;
        if (userId) {
          url += `&userId=${userId}`;
        }
        
        const response = await api.get(url);
        
        if (response && response.code === 1 && response.data) {
          commit('SET_POST_LIST', response.data.records || []);
          commit('SET_PAGINATION', {
            current: response.data.current,
            size: response.data.size,
            total: response.data.total
          });
        } else if (response && response.records) {
          commit('SET_POST_LIST', response.records);
          commit('SET_PAGINATION', {
            current: response.current,
            size: response.size,
            total: response.total
          });
        } else {
          console.error('Unexpected posts page response format:', response);
          commit('SET_POST_LIST', []);
        }
        
        return response;
      } catch (error) {
        console.error('Error fetching posts page:', error);
        commit('SET_POST_LIST', []);
        return Promise.reject(error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // 搜索帖子
    async searchPosts({ commit }, { text, category, gteTime, lteTime, page = 1, pageSize = 10, orderByHot = false }) {
      commit('SET_LOADING', true);
      try {
        let url = `/api/post/search?page=${page}&pageSize=${pageSize}&orderByHot=${orderByHot}`;
        
        if (text) url += `&text=${encodeURIComponent(text)}`;
        if (category) url += `&category=${encodeURIComponent(category)}`;
        if (gteTime) url += `&gteTime=${encodeURIComponent(gteTime)}`;
        if (lteTime) url += `&lteTime=${encodeURIComponent(lteTime)}`;
        
        const response = await api.get(url);
        
        if (response && response.code === 1 && response.data) {
          commit('SET_POST_LIST', response.data.records || []);
          if (response.data.current) {
            commit('SET_PAGINATION', {
              current: response.data.current,
              size: response.data.size,
              total: response.data.total
            });
          }
        } else if (response && response.records) {
          commit('SET_POST_LIST', response.records);
        } else {
          console.error('Unexpected search posts response format:', response);
          commit('SET_POST_LIST', []);
        }
        
        return response;
      } catch (error) {
        console.error('Error searching posts:', error);
        commit('SET_POST_LIST', []);
        return Promise.reject(error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // 删除帖子
    async deletePost({ commit }, id) {
      commit('SET_LOADING', true);
      try {
        const response = await api.delete(`/api/post/${id}`);
        
        if (response && (response.code === 1 || response.success)) {
          commit('DELETE_POST', id);
        }
        
        return response;
      } catch (error) {
        console.error('Error deleting post:', error);
        return Promise.reject(error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // 创建帖子评论
    async createComment({ commit }, commentData) {
      commit('SET_LOADING', true);
      try {
        const response = await api.post('/api/post-comment', commentData);
        
        if (response && response.code === 1 && response.data) {
          commit('ADD_COMMENT', response.data);
        } else if (response && !response.code) {
          commit('ADD_COMMENT', response);
        }
        
        return response;
      } catch (error) {
        console.error('Error creating comment:', error);
        return Promise.reject(error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // 删除帖子评论
    async deleteComment({ commit }, id) {
      commit('SET_LOADING', true);
      try {
        const response = await api.delete(`/api/post-comment/${id}`);
        
        if (response && (response.code === 1 || response.success)) {
          commit('DELETE_COMMENT', id);
        }
        
        return response;
      } catch (error) {
        console.error('Error deleting comment:', error);
        return Promise.reject(error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // 分页查询帖子评论
    async getCommentPage({ commit }, { current = 1, size = 10, postId = null }) {
      commit('SET_LOADING', true);
      try {
        let url = `/api/post-comment/page?current=${current}&size=${size}`;
        if (postId) {
          url += `&postId=${postId}`;
        }
        
        const response = await api.get(url);
        
        if (response && response.code === 1 && response.data) {
          commit('SET_POST_COMMENTS', response.data.records || []);
          commit('SET_PAGINATION', {
            current: response.data.current,
            size: response.data.size,
            total: response.data.total
          });
        } else if (response && response.records) {
          commit('SET_POST_COMMENTS', response.records);
          commit('SET_PAGINATION', {
            current: response.current,
            size: response.size,
            total: response.total
          });
        } else {
          console.error('Unexpected comment page response format:', response);
          commit('SET_POST_COMMENTS', []);
        }
        
        return response;
      } catch (error) {
        console.error('Error fetching comment page:', error);
        commit('SET_POST_COMMENTS', []);
        return Promise.reject(error);
      } finally {
        commit('SET_LOADING', false);
      }
    }
  }
} 