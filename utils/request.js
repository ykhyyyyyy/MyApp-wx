/**
 * 请求工具类 - 直接使用uni.request
 */
import config from '@/config';

export default {
  // GET请求
  get(url, data = {}, options = {}) {
    return new Promise((resolve, reject) => {
      // 合并认证头
      const authHeader = config.getAuthHeader();
      const header = { ...config.headers, ...authHeader, ...options.header };
      
      uni.request({
        url: config.BaseUrl + url,
        data,
        method: 'GET',
        header,
        timeout: config.timeout,
        ...options,
        success: (res) => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(res.data);
          } else {
            reject(res);
          }
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  },
  
  // POST请求
  post(url, data = {}, options = {}) {
    return new Promise((resolve, reject) => {
      // 合并认证头
      const authHeader = config.getAuthHeader();
      const header = { ...config.headers, ...authHeader, ...options.header };
      
      uni.request({
        url: config.BaseUrl + url,
        data,
        method: 'POST',
        header,
        timeout: config.timeout,
        ...options,
        success: (res) => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(res.data);
          } else {
            reject(res);
          }
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  },
  
  // PUT请求
  put(url, data = {}, options = {}) {
    return new Promise((resolve, reject) => {
      // 合并认证头
      const authHeader = config.getAuthHeader();
      const header = { ...config.headers, ...authHeader, ...options.header };
      
      uni.request({
        url: config.BaseUrl + url,
        data,
        method: 'PUT',
        header,
        timeout: config.timeout,
        ...options,
        success: (res) => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(res.data);
          } else {
            reject(res);
          }
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  },
  
  // DELETE请求
  delete(url, data = {}, options = {}) {
    return new Promise((resolve, reject) => {
      // 合并认证头
      const authHeader = config.getAuthHeader();
      const header = { ...config.headers, ...authHeader, ...options.header };
      
      uni.request({
        url: config.BaseUrl + url,
        data,
        method: 'DELETE',
        header,
        timeout: config.timeout,
        ...options,
        success: (res) => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(res.data);
          } else {
            reject(res);
          }
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  }
}; 