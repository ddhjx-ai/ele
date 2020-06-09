<template>
  <div>
    <el-table border :data="data.tableData" @selection-change="tableSelectChange" style="width: 100%">
      <el-table-column v-if="data.tableConfig.selection" type="selection" width="55"></el-table-column>

      <template v-for="item in data.tableConfig.tHead">
        <el-table-column
          v-if="item.columnType === 'slot'"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
        >
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <slot :name="item.slotName" :data="scope.row"></slot>
          </template>
        </el-table-column>
        <el-table-column :key="item.prop" :prop="item.prop" :label="item.label" v-else></el-table-column>
      </template>
    </el-table>
    <div class="black-space-30"></div>
    <div class="table-footer">
      <el-row>
        <el-col :span="4">
          <slot name="tableFooterLeft"></slot>
        </el-col>
        <el-col :span="20">
          <el-pagination
          class="pull-right"
            v-if="data.tableConfig.pagination"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageData.currentPage"
            :page-sizes="pageData.pageSizes"
            :page-size="pageData.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageData.total"
          ></el-pagination>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { loadData } from "./tableLoadData";
import { paginationHook } from "./paginationHook";
import {
  onMounted,
  reactive,
  onBeforeMount,
  watch
} from "@vue/composition-api";
export default {
  name: "tableCom",
  props: {
    config: {
      type: Object,
      default: () => ({})
    },
    tableRow: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, { root, emit }) {
    // 加载数据
    const { tableData, tableLoadData } = loadData({ root });
    // 页码
    const {
      pageData,
      handleSizeChange,
      handleCurrentChange,
      totalCount
    } = paginationHook();
    const data = reactive({
      tableData: [],
      tableConfig: {}
    });

    // 勾选checkbox触发时
    const tableSelectChange = (val) => {
      let data = {
        id: val.map(item => item.id)
      }
      emit("update:tableRow",data)
    }

    // 刷新数据
    const refreshTabel = () => {
      tableLoadData(data.tableConfig.requestParams);
    }

    // 数据渲染
    watch(
      [() => tableData.item, () => tableData.total],
      ([tableData, total]) => {
        data.tableData = tableData;
        totalCount(total);
      }
    );
    // 页码监听
    watch(
      [() => pageData.currentPage, () => pageData.pageSize],
      ([currentPage, pageSize]) => {
        let requestData = { ...props.config.requestParams };
        if (requestData.data) {
          requestData.data.pageNumber = currentPage;
          requestData.data.pageSize = pageSize;
          tableLoadData(requestData);
        }
      }
    );

    onBeforeMount(() => {
      data.tableConfig = { ...props.config };
      tableLoadData(data.tableConfig.requestParams);
    });
    return {
      data,
      pageData,
      handleSizeChange,
      handleCurrentChange,
      totalCount,
      tableData,
      tableLoadData,
      
      refreshTabel,
      tableSelectChange
    };
  }
};
</script>

<style>
</style>