<template>
  <div class="parameter">
    <el-button type="danger" @click="addFirst">添加一级分类</el-button>
    <hr style="margin-left:-30px; margin-right:-30px;border:none;border-bottom:1px solid #e9e9e9" />
    <div>
      <el-row :gutter="30">
        <el-col :span="8">
          <div class="category-wrap">
            <div class="category" v-for="(firstItem) in category.data" :key="firstItem.id">
              <h4>
                <svg-icon icon-class="plus"></svg-icon>
                {{firstItem.category_name}}
                <div class="button-group">
                  <el-button type="danger" size="mini" round @click="editCategory(firstItem,1)">编辑</el-button>
                  <el-button type="success" size="mini" round>添加子级</el-button>
                  <el-button size="mini" round @click="removeCategory(firstItem.id)">删除</el-button>
                </div>
              </h4>
              <ul v-if="firstItem.children">
                <li v-for="secondItem in firstItem.children" :key="secondItem.id">
                  {{secondItem.category_name}}
                  <div class="button-group">
                    <el-button type="danger" size="mini" round>编辑</el-button>
                    <el-button size="mini" round>删除</el-button>
                  </div>
                </li>
              </ul>
            </div>
            
          </div>
        </el-col>
        <el-col :span="16">
          <h4 class="menu-title">一级分类编辑</h4>
          <el-form ref="categoryForm" :model="form" label-width="120px" style="width:410px;padding-top:25px">
            <el-form-item label="一级分类名称:" v-if="firstFlag">
              <el-input v-model="form.categoryName" :disabled="categoryNameFlag"></el-input>
            </el-form-item>
            <el-form-item label="二级分类名称:" v-if="secondFlag">
              <el-input v-model="form.secCategoryName" :disabled="secCategoryNameFlag"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="danger" @click="submit" :disabled="submitFLag">确定</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { AddFirstCategory,GetCategoryAll,DeleteCategory,EditCategory } from "@/api/news";
import {global} from '@/utils/global3.0'
import {common} from '@/api/common.js'
import { reactive, ref, onMounted } from "@vue/composition-api";
export default {
  name: "category",
  setup(props, { root,refs }) {
    // global
    const {confirm} = global()
    const {getInfoCategory} = common()
    // 变量
    const form = reactive({
      categoryName: "",
      secCategoryName: ""
    });
    const category = reactive({
      data: [],
      editFirstCategoryId : '',
      editSecondCategoryId : ''
    });
    const firstFlag = ref(true);
    const secondFlag = ref(true)
    const categoryNameFlag = ref(true)
    const secCategoryNameFlag = ref(true)
    const submitFLag = ref(true)
    const removeID = ref('')
    const submitType = ref(0)

    // 函数
    const submit = () => {
      if(submitType.value === 0) {
        addFirstCategory()
      }
      if(submitType.value === 1) {
        editFirstCategory()
      }
    };
    // 添加一级分类
    const addFirstCategory = () => {
      if (form.categoryName === "") {
        return root.$message.error("分类名称不能为空");
      }
      AddFirstCategory({
        categoryName: form.categoryName
      })
        .then(res => {
          if (res.resCode === 0) {
            root.$message.success(res.message);
            category.data.push(res.data)
          }
          form.categoryName = ''
        })
        .catch(err => {
          form.categoryName = ''
        })
    }
    // 编辑一级分类
    const editFirstCategory = () => {
      if (form.categoryName === "") {
        return root.$message.error("分类名称不能为空");
      }
      EditCategory({
        id : category.editFirstCategoryId,
        categoryName : form.categoryName
      }).then(res => {
        if(res.resCode === 0){
          root.$message.success('编辑成功')
          form.categoryName = ''
          getInfoCategory()
        }
      })
    }
    const addFirst = () => {
      submitType.value = 0
      form.categoryName = ''
      secondFlag.value = false;
      categoryNameFlag.value = false
      submitFLag.value = false
    };
    /* const getCategoryAll = () => {
      GetCategoryAll().then(res => {
        console.log(res)
        category.data = res.data
      })
    } */
    // 删除
    const removeCategory = (id) => {
      removeID.value = id
      confirm({
        content: '确认删除当前分类？',
        fn: confirmDel
      })
    }
    const confirmDel = () => {
      DeleteCategory({
        categoryId: removeID.value
      }).then(res => {
        if(res.resCode === 0){
          root.$message.success('删除成功')
          getInfoCategory()
        }
      })
    }
    // 编辑
    const editCategory = (item, level) => {
      submitType.value = level
      secondFlag.value = false
      firstFlag.value = true
      categoryNameFlag.value = false
      submitFLag.value = false
      form.categoryName = item.category_name
      category.editFirstCategoryId = item.id
    }

    // 生命周期
    onMounted(() => {
      getInfoCategory().then(res => {
        category.data = res.data
      })
    })

    return {
      form,
      firstFlag,
      secondFlag,
      category,
      categoryNameFlag,
      secCategoryNameFlag,
      submitFLag,

      submit,
      addFirst,
      removeCategory,
      editCategory
    };
  }
};
</script>

<style scoped lang="scss">
@import "../../styles/config.scss";
.category-wrap {
  div:first-child {
    &:before {
      top: 20px;
    }
  }
  div:last-child {
    &:before {
      bottom: 21px;
    }
  }
}
.menu-title {
  line-height: 44px;
  background: #f3f3f3;
  padding-left: 22px;
}
.category {
  line-height: 44px;
  position: relative;
  cursor: pointer;
  &::before {
    content: "";
    position: absolute;
    width: 32px;
    left: 22px;
    top: 0;
    bottom: 0;
    border-left: 1px dotted #000;
  }
  h4 {
    position: relative;
    padding-left: 40px;
    svg {
      position: absolute;
      left: 14px;
      top: 15px;
      background-color: #fff;
      font-size: 17px;
    }
  }
  li {
    position: relative;
    padding-left: 36px;
    margin-left: 24px;
    &::before {
      content: "";
      position: absolute;
      width: 32px;
      left: 0;
      top: 22px;
      border-bottom: 1px dotted #000;
    }
  }
  li,
  h4 {
    @include webkit(transition, all 0.3s ease 0s);
    &:hover {
      background: #f3f3f3;
      .button-group {
        display: block;
      }
    }
  }
}
.button-group {
  display: none;
  position: absolute;
  right: 6px;
  top: 0px;
  font-size: 12px;
  z-index: 10;
}
</style>