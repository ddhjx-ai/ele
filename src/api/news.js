import request from '@/utils/request'
// 一级分类添加
export const AddFirstCategory = function(data) {
  return request({
    method: 'post',
    url: '/news/addFirstCategory/',
    data
  })
}

// 获取分类 /news/getCategoryAll/ 
export const GetCategoryAll = function(data) {
  return request({
    method: 'post',
    url: '/news/getCategoryAll/',
    data
  })
}

// 删除分类 /news/deleteCategory/
export const DeleteCategory = function(data) {
  return request({
    method: 'post',
    url: '/news/deleteCategory/',
    data
  })
}

// 修改分类  	/news/editCategory/
export const EditCategory = function(data) {
  return request({
    method: 'post',
    url: '/news/editCategory/',
    data
  })
}

// 新增信息
export const AddInfo = function(data = {}) {
  return request({
    method: 'post',
    url: '/news/add/',
    data
  })
}

// 获取列表 /news/getList/
export const GetList = function(data = {}) {
  return request({
    method: 'post',
    url: '/news/getList/',
    data
  })
}

// 删除信息  	/news/deleteInfo/
export const DeleteInfo = function(data = {}) {
  return request({
    method: 'post',
    url: '/news/deleteInfo/',
    data
  })
}

// 修改信息 /news/editInfo/
export const EditInfo = function(data = {}) {
  return request({
    method: 'post',
    url: '/news/editInfo/',
    data
  })
}

// 添加子级  	/news/addChildrenCategory/
export const AddChildrenCategory = function(data = {}) {
  return request({
    method: 'post',
    url: '/news/addChildrenCategory/',
    data
  })
}