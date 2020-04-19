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

// 注册