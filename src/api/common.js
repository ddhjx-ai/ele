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