<template>
  <div>
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="类型：">
        <el-select v-model="form.categoryId" placeholder="请选择">
          <el-option
            v-for="item in data.options"
            :key="item.id"
            :label="item.category_name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="新闻标题：">
        <el-input type="text" v-model="form.title" style="width:220px;" />
      </el-form-item>

      <el-form-item label="缩略图：">
        <UploadImg :imgUrl.sync="form.imageUrl"/>
      </el-form-item>

      <el-form-item label="发布日期：">
        <el-date-picker v-model="form.createDate" type="date" placeholder="选择日期" disabled></el-date-picker>
      </el-form-item>

      <el-form-item label="详细内容：">
        <quillEditor v-model="form.content" ref="myQuillEditor" :options="data.editorOption" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submit" :loading="data.submitLoading">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { GetList, EditInfo } from "@/api/news";
import { reactive, ref, onMounted, onActivated, onDeactivated } from "@vue/composition-api";
import { timestampToTime } from "@/utils/common";
import { common } from "@/api/common.js";
import UploadImg from "@/components/uploading"
import { quillEditor } from "vue-quill-editor"; // 调用富文本编辑器
import "quill/dist/quill.snow.css";
export default {
  name: "infoDetail",
  components: {
    quillEditor,
    UploadImg
  },
  setup(props, { root }) {
    const { getInfoCategory } = common();
    const data = reactive({
      id: root.$store.getters["infoDetail/infoId"],
      options: [],
      editorOption: {},
      submitLoading: false,
      uploadKey: {
        token: "",
        key: ""
      }
    });
    const form = reactive({
      categoryId: "",
      title: "",
      createDate: "",
      content: "",
      imageUrl: ""
    });

    // 保存，
    const submit = () => {
      data.submitLoading = true;
      let params = {
        id: data.id,
        categoryId: form.categoryId,
        title: form.title,
        content: form.content,
        imgUrl: form.imageUrl
      };
      if (form.title === "") {
        return root.$message.error("标题不能为空");
      }
      EditInfo(params)
        .then(res => {
          if (res.resCode === 0) {
            root.$router.back();
            root.$message.success("修改成功");
            data.submitLoading = false;
          }
        })
        .catch(error => {
          data.submitLoading = false;
        });
    };

    // 获取当前id的信息
    const getInfo = () => {
      let params = {
        pageNumber: 1,
        pageSize: 1,
        id: data.id
      };
      GetList(params).then(res => {
        let data = res.data.data[0];
        form.categoryId = data.categoryId;
        form.title = data.title;
        form.createDate = timestampToTime(data.createDate);
        form.content = data.content;
        form.imageUrl = data.imgUrl
      });
    };

    // 生命周期
    onMounted(() => {
      getInfoCategory().then(res => {
        data.options = res.data;
      });
    });

    onActivated(() => {
      data.id = root.$store.getters["infoDetail/infoId"]
      getInfo();
    })

    onDeactivated(() => {
      
    })

    return {
      data,
      form,

      submit
    };
  }
};
</script>

<style scoped lang="scss">

</style>