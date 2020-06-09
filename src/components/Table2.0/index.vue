<template>
  <div>
    <el-table border :data="tableData" style="width: 100%">
      <el-table-column v-if="tableConfig.selection" type="selection" width="55"></el-table-column>

      <template v-for="item in tableConfig.tHead">
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
    <el-pagination
      v-if="tableConfig.pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
import tableLoadData from '@/mixin/tableLoadData'
import pagination from '@/mixin/pagination'
export default {
  name: "tableCom",
  mixins: [tableLoadData,pagination],
  data() {
    return{
      tableData: [],
      tableConfig: {}
    }
  },
  methods: {

  },
  created() {
    this.tableConfig = { ...this.config }
  },
  props: {
    config: {
      type: Object,
      default: () =>({})
    }
  },
};
</script>

<style>
</style>