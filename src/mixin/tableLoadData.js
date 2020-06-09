import { requestUrl } from "@/api/requestURL";
import { loadTableData } from "@/api/common";
let tableLoadData = {
  data() {},
  created() {},
  mounted() {
    this.getTableData();
  },
  methods: {
    getTableData() {
      let requestJson = this.tableConfig.requestParams;
      let requestData = {
        url: requestUrl[requestJson.url],
        method: requestJson.method,
        data: requestJson.data
      };
      loadTableData(requestData)
        .then(response => {
          let responseData = response.data.data;
          this.tableData = responseData

          this.total = response.data.total
        })
        .catch(error => {});
    }
  }
};

export default tableLoadData;
