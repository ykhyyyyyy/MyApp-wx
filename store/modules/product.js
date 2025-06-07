// 商品功能模块
import api from '@/utils/request';

export default {
  namespaced: true,
  
  state: {
    productList: [], // 商品列表
    currentProduct: null, // 当前查看的商品
    categoryList: [], // 商品分类列表
    currentCategory: null, // 当前查看的分类
    isLoading: false,
    pagination: {
      current: 1,
      size: 10,
      total: 0
    }
  },
  
  getters: {
    // 获取商品列表
    getProductList: state => state.productList,
    
    // 获取当前商品
    getCurrentProduct: state => state.currentProduct,
    
    // 获取商品分类列表
    getCategoryList: state => state.categoryList,
    
    // 获取当前分类
    getCurrentCategory: state => state.currentCategory,
    
    // 加载状态
    isLoading: state => state.isLoading,
    
    // 分页信息
    pagination: state => state.pagination
  },
  
  mutations: {
    // 设置商品列表
    SET_PRODUCT_LIST(state, list) {
      state.productList = list;
    },
    
    // 设置当前商品
    SET_CURRENT_PRODUCT(state, product) {
      state.currentProduct = product;
    },
    
    // 设置商品分类列表
    SET_CATEGORY_LIST(state, list) {
      state.categoryList = list;
    },
    
    // 设置当前分类
    SET_CURRENT_CATEGORY(state, category) {
      state.currentCategory = category;
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
    // 获取店铺商品详情
    async getProductDetail({ commit }, id) {
      commit('SET_LOADING', true);
      try {
        const response = await api.get(`/api/shop-product/${id}`);
        
        if (response && response.code === 1 && response.data) {
          commit('SET_CURRENT_PRODUCT', response.data);
        } else if (response && !response.code) {
          commit('SET_CURRENT_PRODUCT', response);
        }
        
        return response;
      } catch (error) {
        console.error('Error fetching product detail:', error);
        commit('SET_CURRENT_PRODUCT', null);
        return Promise.reject(error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // 分页查询店铺商品
    async getProductPage({ commit }, { current = 1, size = 10, shopId = null, categoryId = null }) {
      commit('SET_LOADING', true);
      try {
        let url = `/api/shop-product/page?current=${current}&size=${size}`;
        if (shopId) {
          url += `&shopId=${shopId}`;
        }
        if (categoryId) {
          url += `&categoryId=${categoryId}`;
        }
        
        const response = await api.get(url);
        
        if (response && response.code === 1 && response.data) {
          commit('SET_PRODUCT_LIST', response.data.records || []);
          commit('SET_PAGINATION', {
            current: response.data.current,
            size: response.data.size,
            total: response.data.total
          });
        } else if (response && response.records) {
          commit('SET_PRODUCT_LIST', response.records);
          commit('SET_PAGINATION', {
            current: response.current,
            size: response.size,
            total: response.total
          });
        } else {
          console.error('Unexpected product page response format:', response);
          commit('SET_PRODUCT_LIST', []);
        }
        
        return response;
      } catch (error) {
        console.error('Error fetching product page:', error);
        commit('SET_PRODUCT_LIST', []);
        return Promise.reject(error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // 获取商品分类详情
    async getCategoryDetail({ commit }, id) {
      commit('SET_LOADING', true);
      try {
        const response = await api.get(`/api/shop-product-category/${id}`);
        
        if (response && response.code === 1 && response.data) {
          commit('SET_CURRENT_CATEGORY', response.data);
        } else if (response && !response.code) {
          commit('SET_CURRENT_CATEGORY', response);
        }
        
        return response;
      } catch (error) {
        console.error('Error fetching category detail:', error);
        commit('SET_CURRENT_CATEGORY', null);
        return Promise.reject(error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // 分页查询商品分类
    async getCategoryPage({ commit }, { current = 1, size = 10, shopId = null }) {
      commit('SET_LOADING', true);
      try {
        let url = `/api/shop-product-category/page?current=${current}&size=${size}`;
        if (shopId) {
          url += `&shopId=${shopId}`;
        }
        
        const response = await api.get(url);
        
        if (response && response.code === 1 && response.data) {
          commit('SET_CATEGORY_LIST', response.data.records || []);
          commit('SET_PAGINATION', {
            current: response.data.current,
            size: response.data.size,
            total: response.data.total
          });
        } else if (response && response.records) {
          commit('SET_CATEGORY_LIST', response.records);
          commit('SET_PAGINATION', {
            current: response.current,
            size: response.size,
            total: response.total
          });
        } else {
          console.error('Unexpected category page response format:', response);
          commit('SET_CATEGORY_LIST', []);
        }
        
        return response;
      } catch (error) {
        console.error('Error fetching category page:', error);
        commit('SET_CATEGORY_LIST', []);
        return Promise.reject(error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // 获取店铺的所有商品分类
    async getShopCategories({ commit }, shopId) {
      commit('SET_LOADING', true);
      try {
        const response = await api.get(`/api/shop-product-category/shop/${shopId}`);
        
        if (response && response.code === 1 && Array.isArray(response.data)) {
          commit('SET_CATEGORY_LIST', response.data);
        } else if (Array.isArray(response)) {
          commit('SET_CATEGORY_LIST', response);
        } else {
          console.error('Unexpected shop categories response format:', response);
          commit('SET_CATEGORY_LIST', []);
        }
        
        return response;
      } catch (error) {
        console.error('Error fetching shop categories:', error);
        commit('SET_CATEGORY_LIST', []);
        return Promise.reject(error);
      } finally {
        commit('SET_LOADING', false);
      }
    }
  }
} 