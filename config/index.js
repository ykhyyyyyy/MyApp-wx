/**
 * 全局配置文件
 */

// API请求基础路径
const BaseUrl = 'http://172.20.10.3:8079';

// 固定的认证令牌
const FIXED_TOKEN = 'eyJhbGciOiJIUzM4NCJ9.eyJ1c2VySWQiOjEsImV4cCI6MTc0ODUyMzQ3OX0.cAVl0m4KnJFWRkV-Z9qylW03H_VJqyhzYIByHROtliLpfPk4QQg0FZ8_GcOMUFiP';

// 获取存储的token
const getToken = () => {
  // 使用固定的token，而不是从存储获取
  return FIXED_TOKEN;
};

// 导出配置
export default {
  BaseUrl,
  // 可以在这里添加其他全局配置项
  timeout: 10000, // 请求超时时间（毫秒）
  headers: {
    'Content-Type': 'application/json'
  },
  // 获取认证头
  getAuthHeader() {
    const token = getToken();
    return token ? { 'Authorization': 'Bearer ' + token } : {};
  }
}; 