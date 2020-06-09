<template>
  <div>
    <div class="overflow-h">
      <el-row :gutter="10">
        <el-col :span="6">
          <el-select v-model="data.provinceValue" @change="provinceChange">
            <el-option
              v-for="item in data.provinceList"
              :key="item.PROVINCE_CODE"
              :value="item.PROVINCE_CODE"
              :label="item.PROVINCE_NAME"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select v-model="data.cityValue" @change="cityChange">
            <el-option
              v-for="item in data.cityList"
              :key="item.CITY_CODE"
              :value="item.CITY_CODE"
              :label="item.CITY_NAME"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select v-model="data.areaValue" @change="countyChange">
            <el-option
              v-for="item in data.countyList"
              :key="item.AREA_CODE"
              :value="item.AREA_CODE"
              :label="item.AREA_NAME"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select v-model="data.streetValue" @change="streetChange">
            <el-option
              v-for="item in data.streetList"
              :key="item.STREET_CODE"
              :value="item.STREET_CODE"
              :label="item.STREET_NAME"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getCityPicker } from "@/api/common";
import { reactive,watch } from "@vue/composition-api";
export default {
  name: "CityPicker",
  props: {
    cityPickerData: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, { rootn, emit }) {
    const data = reactive({
      provinceList: [],
      cityList: [],
      countyList: [],
      streetList: [],
      provinceValue: "",
      cityValue: "",
      areaValue: "",
      streetValue: ""
    });

    const result = reactive({
      provinceValue: "",
      cityValue: "",
      areaValue: "",
      streetValue: ""
    });

    // 发送请求，获取省份列表
    const getProvince = () => {
      getCityPicker({
        type: "province"
      }).then(res => {
        data.provinceList = res.data.data;
      });
    };
    getProvince();

    // 选择省份,获取城市列表
    const provinceChange = val => {
      resetValue({ type: "city" });
      getCityPicker({
        type: "city",
        province_code: val
      }).then(res => {
        data.cityList = res.data.data;
      });
    };

    // 选择城市，获取区县列表
    const cityChange = val => {
      resetValue({ type: "county" });
      getCityPicker({
        type: "area",
        city_code: val
      }).then(res => {
        console.log(res);
        data.countyList = res.data.data;
      });
    };

    const countyChange = val => {
      resetValue({ type: "street" });
      getCityPicker({
        type: "street",
        area_code: val
      }).then(res => {
        console.log(res);
        data.streetList = res.data.data;
      });
    };

    const streetChange = val => {
      resetValue({type:''});
    };

    // 重置选项
    const resetValue = params => {
      const valueJson = {
        city: ["cityValue", "areaValue", "streetValue"],
        county: ["areaValue", "streetValue"],
        street: ["streetValue"]
      };

      const value = valueJson[params.type];

      if (value) {
        value.forEach(item => {
          data[item] = "";
        });
      }

      getResult();
    };

    // 获取最后选择的结果
    const getResult = () => {
      for (let key in result) {
        result[key] = data[key];
      }
    };

    watch([
      ()=>result.provinceValue,
      ()=>result.cityValue,
      ()=>result.areaValue,
      ()=>result.streetValue,
    ], ([provinceValue,cityValue,areaValue,streetValue])=>{
      emit("update:cityPickerData", result)
    })

    return {
      data,

      provinceChange,
      cityChange,
      countyChange,
      streetChange
    };
  }
};
</script>

<style>
</style>