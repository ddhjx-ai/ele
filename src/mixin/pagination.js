let pagination = {
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      pageSizes: [2, 5, 10, 20]
    };
  },
  created() {},
  mounted() {},
  methods: {
    handleSizeChange(val){
      this.tableConfig.requestParams.data.pageSize = val
      this.getTableData()
    }, 
    handleCurrentChange(val) {
      this.tableConfig.requestParams.data.pageNumber = val
      this.getTableData()
    }
  }
};

export default pagination;
