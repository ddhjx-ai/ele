<template>
  <div>
    <el-row :gutter="16">
      <el-col :span="20">
        <div class="label-wrap">
          <label>关键字：</label>
          <div class="warp-content">
            <el-row :gutter="16">
              <el-col :span="3">
                <el-select v-model="data.selectVal" placeholder="请选择">
                  <el-option
                    v-for="item in data.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :span="6">
                <el-input v-model="data.contentValue" placeholder="请输入内容"></el-input>
              </el-col>
              <el-col :span="4">
                <el-button type="danger">搜索</el-button>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
      <el-col :span="4">
        <el-button type="danger" class="pull-right" @click="addUser">新增用户</el-button>
      </el-col>
    </el-row>

    <div class="black-space-30"></div>
    <tableCom ref="userTable" :config="data.tableConfig" :tableRow.sync="data.tableRow">
      <template v-slot:status="slotData">
        <el-switch @change="handleSwitch(slotData)" active-color="#13ce66" active-value="2"
    inactive-value="1" v-model="slotData.data.status" inactive-color="#ff4949"></el-switch>
        <!-- {{slotData.data.status}} -->
      </template>
      <template v-slot:operation="slotData">
        <el-button type="danger" size="small" @click="remove(slotData.data)">删除</el-button>
        <el-button type="success" size="small" @click="update(slotData.data)">编辑</el-button>
      </template>
      <template v-slot:tableFooterLeft>
        <el-button @click="batchDel()">批量删除</el-button>
      </template>
    </tableCom>
    <addCom :flag.sync="data.dialogAdd" :addTitle="data.addTitle" :editData="data.editData" @refreshTabel="refreshTabel"></addCom>
  </div>
</template>

<script>
import {userDelete,userActives} from '@/api/user'
import addCom from './dialog/add'
import { reactive } from "@vue/composition-api";
import tableCom from "@/components/Table";
import {global} from '@/utils/global3.0'
export default {
  name: "userIndex",
  components: {
    tableCom,
    addCom
  },
  setup(props, { root, refs }) {
    const {confirm} = global()
    const data = reactive({
      addTitle: '新增',
      tableRow: {},
      dialogAdd: false,
      selectVal: "",
      contentValue: "",
      options: [
        { value: "name", label: "姓名" },
        { value: "phone", label: "手机号" },
        { value: "email", label: "邮箱" }
      ],
      tableConfig: {
        tHead: [
          {
            label: "邮箱/用户名",
            prop: "username"
          },
          {
            label: "真实姓名",
            prop: "truename"
          },
          {
            label: "手机号",
            prop: "phone"
          },
          {
            label: "地址",
            prop: "region"
          },
          {
            label: "角色",
            prop: "role"
          },
          {
            label: "禁用状态",
            prop: "status",
            columnType: "slot",
            slotName: "status"
          },
          {
            label: '操作',
            columnType: "slot",
            slotName: "operation"
          }
        ],
        selection: true,
        // 请求接口
        requestParams:{
          url: 'getUserList',
          method: 'post',
          data: {
            pageNumber: 1,
            pageSize: 10
          }
        },
        pagination: true
      },
      editData: {}
    });

    // 单个删除
    let remove = (row) => {
      data.tableRow.id = [row.id]
      confirm({
        content: '确认删除勾选用户',
        tip: '警告',
        fn: userDeleted
      })
    }

    // 编辑
    let update = (item) => {
      data.dialogAdd = true
      data.editData = {...item}
      data.addTitle = '编辑'
    }

    const addUser = () => {
      data.dialogAdd= true
      data.editData = {}
      data.addTitle = '新增'
    }

    // 批量删除
    let batchDel = () => {
      let id = data.tableRow.id
      if(!id || id.length === 0) {
        return root.$message('请勾选需要删除的用户')
      }
      confirm({
        content: '确认删除勾选用户',
        tip: '警告',
        fn: userDeleted
      })
    }

    const userDeleted = () => {
      userDelete({id:data.tableRow.id}).then(res => {
        root.$message.success('删除成功')
        refreshTabel()
      })
    }

    const refreshTabel = () => {
      refs.userTable.refreshTabel()
    }

    const handleSwitch = (slotData) => {
      let params = {
        id: slotData.data.id,
        status: slotData.data.status
      }
      userActives(params).then(res => {

      })
    }

    return {
      data,

      remove,
      update,
      batchDel,
      refreshTabel,
      handleSwitch,
      addUser
    };
  }
};
</script>

<style lang="scss" scoped>
@import "../../styles/config.scss";
.label-wrap {
  @include labelDom(left, 60, 40);
}
</style>