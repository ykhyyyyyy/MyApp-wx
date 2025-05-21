// User module
export default {
  namespaced: true,
  
  state: {
    userInfo: null,
    isLoggedIn: false,
    token: '',
  },
  
  getters: {
    // Check if user is logged in
    isAuthenticated: state => !!state.token,
    
    // Get user display name or default
    displayName: state => state.userInfo ? state.userInfo.username : '游客'
  },
  
  mutations: {
    // Set user info
    SET_USER_INFO(state, userInfo) {
      state.userInfo = userInfo;
      state.isLoggedIn = !!userInfo;
    },
    
    // Set token
    SET_TOKEN(state, token) {
      state.token = token;
    },
    
    // Clear user session
    LOGOUT(state) {
      state.userInfo = null;
      state.isLoggedIn = false;
      state.token = '';
    }
  },
  
  actions: {
    // Login action
    async login({ commit }, credentials) {
      try {
        // Mock API call - replace with real login API
        // const response = await api.login(credentials);
        const mockResponse = {
          token: 'mock-token-12345',
          userInfo: {
            id: 1,
            username: '测试用户',
            avatar: '/static/avatars/user1.png'
          }
        };
        
        // Save to state
        commit('SET_TOKEN', mockResponse.token);
        commit('SET_USER_INFO', mockResponse.userInfo);
        
        // Save to storage for persistence
        uni.setStorageSync('token', mockResponse.token);
        uni.setStorageSync('userInfo', JSON.stringify(mockResponse.userInfo));
        
        return Promise.resolve(mockResponse);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    
    // Load user from storage (e.g., on app start)
    loadUserFromStorage({ commit }) {
      const token = uni.getStorageSync('token');
      const userInfo = uni.getStorageSync('userInfo');
      
      if (token) {
        commit('SET_TOKEN', token);
      }
      
      if (userInfo) {
        try {
          commit('SET_USER_INFO', JSON.parse(userInfo));
        } catch (e) {
          console.error('Failed to parse stored user info');
        }
      }
    },
    
    // Logout action
    logout({ commit }) {
      commit('LOGOUT');
      uni.removeStorageSync('token');
      uni.removeStorageSync('userInfo');
    }
  }
} 