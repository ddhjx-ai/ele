import { GetCategoryAll } from "@/api/news";

export function common() {
  // 获取一级分类列表
  const getInfoCategory = () => {
    return GetCategoryAll({})
  }

  return {
    getInfoCategory
  }
}