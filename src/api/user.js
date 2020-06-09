import request from '@/utils/request'

// 角色列表
export function getRoleList(data = {}){
  return request({
    method: 'post',
    url: '/role/',
    data
  })
}

// 系统列表
export function getSystemList(data = {}){
  return request({
    method: 'post',
    url: '/system/',
    data
  })
}

// 新增用户  	/user/add/
export function userAdd(data = {}){
  return request({
    method: 'post',
    url: '/user/add/',
    data
  })
}

// 删除用户 	/user/delete/
export function userDelete(data = {}){
  return request({
    method: 'post',
    url: '/user/delete/',
    data
  })
}

// 用户禁用 /user/actives/
export function userActives(data = {}){
  return request({
    method: 'post',
    url: '/user/actives/',
    data
  })
}

// 编辑用户  	/user/edit/
export function userEdit(data = {}){
  return request({
    method: 'post',
    url: '/user/edit/',
    data
  })
}

// 按钮列表
export function permButton(data = {}){
  return request({
    method: 'post',
    url: '/permButton/',
    data
  })
}