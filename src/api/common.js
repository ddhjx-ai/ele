import { GetCategoryAll } from "@/api/news";
import request from '@/utils/request.js'

export function common() {
  // 获取一级分类列表
  const getInfoCategory = () => {
    return GetCategoryAll({})
  }

  return {
    getInfoCategory
  }
}


// 获取七牛云token  	/uploadImgToken/
export function QinuiToken(data = {}){
  return request({
    method: 'post',
    url: '/uploadImgToken/',
    data
  })
}

// 请求列表组件
/**
 * 
 * @param {*} data 
 */
export function loadTableData(data = {}){
  return request({
    method: data.method || 'get',
    url: data.url,
    data: data.data || {}
  })
}

// 获取省份  	/cityPicker/
export function getCityPicker(data = {}){
  return request({
    method: 'post',
    url: '/cityPicker/',
    data
  })
}