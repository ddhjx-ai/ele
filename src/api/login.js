import request from '@/utils/request.js'
// 获取验证码
export const getCode = function(data) {
  return request({
    method: 'post',
    url: '/getSms/',
    data
  })
}

// 获取用户角色

// 登录
export function Login(data) {
  return request({
    method: 'post',
    url: '/login/',
    data
  })
}

// 退出
export function Logout(data={}) {
  return request({
    method: 'post',
    url: '/logout/',
    data
  })
}

// 注册
export function Register(data) {
  return request({
    method: 'post',
    url: '/register/',
    data
  })
}

// 用户角色 /userRole/
export function UserRole(data) {
  return request({
    method: 'post',
    url: '/userRole/',
    data
  })
}