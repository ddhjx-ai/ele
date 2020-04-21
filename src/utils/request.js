import axios from 'axios'
import {  Message } from 'element-ui'

// 创建axios
// API地址： http://www.web-jshtml.cn/productApi
const server = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 10000
})

// 添加请求拦截器
server.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
server.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  const data = response.data
  if(data.resCode !== 0) {
    Message.error(data.message)
    return Promise.reject(response.data)
  }
  return data;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});

export default server