<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" label-width="60px">
      <!-- <el-row :gutter="2">
      <el-col :span="5">-->
      <el-form-item label="类型:">
        <el-select v-model="categoryvalue" placeholder="请选择">
          <el-option
            v-for="item in options.data"
            :key="item.id"
            :label="item.category_name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- </el-col>
      <el-col :span="8">-->
      <el-form-item label="日期:">
        <el-date-picker
          v-model="dateVlaue"
          type="datetimerange"
          align="right"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd HH:mm:ss" 
        ></el-date-picker>
      </el-form-item>
      <!-- </el-col>
      <el-col :span="5">-->
      <el-form-item label="关键字:">
        <el-select v-model="searchKey" style="width:80px">
          <el-option
            v-for="item in searchOptions"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- </el-col>
      </el-row>-->
      <el-form-item>
        <el-input v-model="searchContent" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="search">搜索</el-button>
      </el-form-item>
      <el-form-item class="pull-right">
        <el-button type="danger" @click="dialogFormVisible = true">新增</el-button>
      </el-form-item>
    </el-form>

    <div class="black-space-30"></div>

    <!-- 表格数据 -->
    <el-table v-loading="loading" ref="multipleTable" @selection-change="handleSelectionChange" :data="tableData.data" style="width: 100%" border>
      <el-table-column type="selection" width="55" header-align="center" align="center"></el-table-column>
      <el-table-column
      type="index"
      width="50">
    </el-table-column>
      <el-table-column prop="title" label="标题" width="830" header-align="center" align="center"></el-table-column>
      <el-table-column prop="categoryId" label="类型" :formatter="toType" width="130" header-align="center" align="center"></el-table-column>
      <el-table-column prop="createDate" label="日期" :formatter="toDate" width="230" header-align="center" align="center"></el-table-column>
      <el-table-column prop="user" label="管理员" width="120" header-align="center" align="center"></el-table-column>
      <el-table-column label="操作" header-align="center" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="remove(scope.row)">删除</el-button>
          <el-button size="mini" type="danger" @click="edit(scope.row.id)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="black-space-30"></div>
    <!-- 分页 -->
    <el-row>
      <el-col :span="12">
        <el-button type="primary" @click="removeAll">批量删除</el-button>
      </el-col>
      <el-col :span="12">
        <el-pagination
          class="pull-right"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[5, 10]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageForm.total"
        ></el-pagination>
      </el-col>
    </el-row>

    <!-- 弹出框 -->
    <!-- 子组件使用修饰器时，可以直接修改父组件的数据 -->
    <infoDialog :flag.sync="dialogFormVisible" :category="options.data" @getList="getList"/>
    <editDialog :flag.sync="editFormVisible" :sendData="sendData" :category="options.data" @getList="getList"/>
  </div>
</template>

<script>
import { GetCategoryAll,GetList,DeleteInfo } from "@/api/news";
import {timestampToTime} from '@/utils/common'
import {global} from '@/utils/global3.0'
import {common} from '@/api/common.js'
import infoDialog from './dialog/info'
import editDialog from './dialog/edit'
import { reactive, ref, onMounted } from "@vue/composition-api";
export default {
  name: "infoIndex",
  components:{
    infoDialog,
    editDialog
  },
  setup(props,{root,refs}) {
    const {confirm} = global()
    const {getInfoCategory} = common()
    const options = reactive({
      data: []
    });
    const tableData = reactive({
      data: []
    });
    const searchOptions = reactive([
      { value: "id", label: "ID" },
      { value: "title", label: "标题" }
    ]);
    const pageForm = reactive({
      pageNumber: 1,
      pageSize: 10,
      total: 0
    })
    const currentId = reactive({
      data: []
    })
    const categoryvalue = ref("");
    const dateVlaue = ref("");
    const searchKey = ref(searchOptions[0].value);
    const searchContent = ref("");
    const dialogFormVisible = ref(false)
    const editFormVisible = ref(false)
    const loading = ref(false)
    const sendData = reactive({
      data: {}
    })

    // 函数
    const handleSizeChange = val => {
      pageForm.pageSize = val
      getList()
    };
    const handleCurrentChange = val => {
      pageForm.pageNumber = val
      getList()
    };

    // vue3.0使用
    const remove = (row) => {
      currentId.data = [row.id]
      console.log(row)
      confirm({
        content: '确认删除此信息,确认后无法恢复!',
        type: '警告',
        fn: confirmRemove,
        catchFn: cancelRemove
      })
    }
    const removeAll = ()=>{
      if(currentId.data.length === 0) return root.$message.error('请选择删除项')
      confirm({
        content: '确认删除选中信息,确认后无法恢复!',
        tips: '警告',
        fn: confirmRemove,
        catchFn: cancelRemove
      })
    }
    // bianji 
    const edit = (id) => {
      sendData.data = tableData.data.find(item => item.id === id)
      console.log(sendData.data)
      editFormVisible.value = true
    }

    // vue 2.x 使用方法
    /* const remove = id => {
      root.confirm({
        content: '确认删除此信息,确认后无法恢复!',
        type: 'success',
        id: '1111',
        fn: confirmRemove
      })
    }
    const removeAll = ()=>{
      root.confirm({
        content: '确认删除选中信息,确认后无法恢复!',
        tips: '警告',
        id: '222',
        fn: confirmRemove
      })
    } */
    const toDate = (row) => {
      return timestampToTime(row.createDate)
    }
    const toType = (row) => {
      if(options.data.length === 0) return
      let data = options.data.find(item => {
        return item.id === row.categoryId
      })
      return data.category_name
    }
    const confirmRemove = () => {
      DeleteInfo({
        id : currentId.data
      }).then(res => {
        if(res.resCode === 0) {
          getList()
          root.$message.success('删除成功')
          currentId.data = []
        }
      }).catch(() => {
        getList()
        currentId.data = []
        refs.multipleTable.clearSelection()
      })
    }
    const cancelRemove = () => {
      currentId.data = []
      refs.multipleTable.clearSelection()
    }
    const formatData = () => {
      let data = {}
      if(categoryvalue.value) {
        data.categoryId = categoryvalue.value
      }
      if(dateVlaue.value.length > 0){
        data.startTiem = dateVlaue.value[0]
        data.endTime = dateVlaue.value[1]
      }
      data[searchKey.value] = searchContent.value
      return data
    }
    const search = () => {
      pageForm.pageNumber = 1
      getList()
    }
    const getList = () => {
      let searchData = formatData()
      loading.value = true
      let data = {
        ...searchData,
        ...pageForm
      }
      GetList(data).then(res => {
        loading.value = false
        tableData.data = res.data.data
        pageForm.total = res.data.total
      })
    }
    const handleSelectionChange = (val) => {
      currentId.data = val.map(item => {
        return item.id
      })
    }
    /* const getCategoryAll = () => {
      GetCategoryAll({}).then(res => {
        console.log(res)
        options.data = res.data
      })
    } */

    // 生命周期
    onMounted(() => {
      getInfoCategory().then(res => {
        options.data = res.data
      })
      getList()
    })

    return {
      options,
      searchOptions,
      searchKey,
      searchContent,
      tableData,
      categoryvalue,
      dateVlaue,
      dialogFormVisible,
      editFormVisible,
      pageForm,
      loading,
      sendData,

      handleSizeChange,
      handleCurrentChange,
      remove,
      removeAll,
      toDate,
      toType,
      handleSelectionChange,
      getList,
      search,
      edit
    };
  }
};
</script>

<style>
</style>