<template>
  <div>
    <el-upload
      class="avatar-uploader"
      action="http://up.qiniup.com"
      :data="data.uploadKey"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
    >
      <img v-if="data.image" :src="data.image" class="avatar" />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script>
import { reactive, ref, watch, onMounted } from "@vue/composition-api";
import { QinuiToken } from "@/api/common";
export default {
  name: "uploadImg",
  props: {
    imgUrl: {
      type: String,
      default: ""
    }
  },
  setup(props, { root,emit }) {
    const data = reactive({
      image: '',
      uploadKey: {
        token: "",
        key: ""
      }
    });
    // 图片上传配置
    const uploadImgConfig = reactive({
      accesskey: "QB09HFIH7RvTnTVB1ln1pWMN-5wo1GIEUR8ATbFc",
      secretkey: "jQDpOpJtyHuHCBktCGtIp8bIfA0x0GAH5B_qpIkl",
      buckety: "testemo"
    });

    const handleAvatarSuccess = (res, file) => {
      console.log(res);
      data.image = `http://q9c9rw6rl.bkt.clouddn.com/${encodeURI(res.key)}`
      emit("update:imgUrl", data.image);
    };
    const beforeAvatarUpload = file => {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        root.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        root.$message.error("上传头像图片大小不能超过 2MB!");
      }
      // 文件名转码
      let suffix = file.name;
      let key = encodeURI(`${suffix}`);
      data.uploadKey.key = key;
      return isJPG && isLt2M;
    };

    /**
     * 获取七牛云token
     */
    const getQiniuToKen = () => {
      let requestData = {
        accesskey: uploadImgConfig.accesskey,
        secretkey: uploadImgConfig.secretkey,
        buckety: uploadImgConfig.buckety
      };
      QinuiToken(requestData).then(response => {
        data.uploadKey.token = response.data.token;
      });
    };

    onMounted(() => {
      getQiniuToKen();
    });
    watch(
      () => props.imgUrl,
      value => {
        data.image = value;
      }
    );

    return {
      handleAvatarSuccess,
      beforeAvatarUpload,

      data
    };
  }
};
</script>

<style scoped lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  border: 1px dotted;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>