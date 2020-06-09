<template>
  <div>
    <el-select v-model="data.selectVal" placeholder="请选择">
      <el-option
        v-for="item in data.options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
import { reactive, onMounted } from "@vue/composition-api";
export default {
  name: "selectCom",
  props: {
    config: {
      type: Array,
      default: ()=>[]
    }
  },
  setup(props, { root }) {
    const data = reactive({
      selectVal: "",
      contentValue: "",
      options: [
        { value: "name", label: "姓名" },
        { value: "phone", label: "手机号" },
        { value: "email", label: "邮箱" }
      ]
    });

    // 初始化下拉
    let initSelect = ()=> {
      props.config.forEach(item => {
        
      })
    }

    onMounted(() => {
initSelect()
    })

    return {
      data
    };
  }
};
</script>

<style>
</style>