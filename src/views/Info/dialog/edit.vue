<template>
  <div>
    <el-dialog
      title="修改"
      width="580px"
      @open="openDialog"
      :visible.sync="data.dialogFormVisible"
      @close="dialogClose"
    >
      <el-form :model="data.form" ref="form" :rules="data.rules">
        <el-form-item label="类型:" :label-width="formLabelWidth" prop="category">
          <el-select v-model="data.form.categoryId" placeholder="请选择活动区域">
            <el-option
              :label="item.category_name"
              :value="item.id"
              v-for="item in data.options"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题:" prop="title" :label-width="formLabelWidth">
          <el-input v-model="data.form.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="概况:" :label-width="formLabelWidth" prop="content">
          <el-input type="textarea" v-model="data.form.content" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelsubmit">取 消</el-button>
        <el-button type="danger" :loading="data.submitLoading" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { AddInfo,EditInfo } from "@/api/news";
import {
  reactive,
  ref,
  watchEffect,
  onMounted
} from "@vue/composition-api";
export default {
  name: "dialogInfo",
  props: {
    flag: {
      type: Boolean,
      default: false
    },
    category: {
      type: Array,
      default: () => []
    },
    sendData: {
      type: Object,
      default: ()=>({})
    }
  },
  setup(props, { emit, root, refs }) {
    // const dialogFormVisible = ref(false);
    const formLabelWidth = ref("70px");
    const data = reactive({
      dialogFormVisible: false,
      options: [],
      form: {
        categoryId: "",
        title: "",
        content: ""
      },
      submitLoading: false,
      rules: {
        categoryId: [
          { required: true, message: "请选择类型", trigger: "change" }
        ],
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        content: [
          { required: true, message: "请输入概况内容", trigger: "blur" }
        ]
      }
    });

    const resetFields = () => {
      refs.form.resetFields()
    }
    const dialogClose = () => {
      data.dialogFormVisible = false;
      // 如果回调的时候不需要处理其他逻辑，只是传递一个参数时，可以直接使用修饰器
      emit("update:flag", false);
    };
    const openDialog = () => {
      let currentData = props.sendData.data
      data.form.title = currentData.title
      data.form.categoryId = currentData.categoryId
      data.options = props.category;
      console.log(data.options)
    };
    const cancelsubmit = () => {
      data.dialogFormVisible = false;
      resetFields()
    }
    const submit = () => {
      if(data.form.categoryId === '') {
        return root.$message.error('请选择类型')
      }
      if(data.form.title === '') {
        return root.$message.error('请输入标题')
      }
      if(data.form.content === '') {
        return root.$message.error('请输入概况内容')
      }
      let editData = {
        ...data.form,
        id: props.sendData.data.id
      } 
      data.submitLoading = true;
      EditInfo(editData)
        .then(res => {
          if (res.resCode === 0) {
            root.$message.success(res.message);
            data.dialogFormVisible = false;
            resetFields()
            emit('getList')
          }
          data.submitLoading = false;
        })
        .catch(err => {
          resetFields()
          emit('getList')
          data.submitLoading = false;
        });
    };

    // watch
    watchEffect(() => (data.dialogFormVisible = props.flag));

    return {
      formLabelWidth,
      data,

      dialogClose,
      openDialog,
      submit,
      cancelsubmit
    };
  }
};
</script>

<style>
</style>