<template>
  <div>
    <el-dialog
      :title="$attrs.addTitle"
      width="650px"
      @open="openDialog"
      :visible.sync="data.dialogFormVisible"
      @close="dialogClose"
    >
      <el-form :model="data.form" ref="form" :rules="data.rules">
        <el-form-item label="用户名:" :label-width="formLabelWidth" prop="username">
          <el-input v-model="data.form.username" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="密码:" :label-width="formLabelWidth" prop="password">
          <el-input v-model="data.form.password" placeholder="请输入密码" type="password"></el-input>
        </el-form-item>
        <el-form-item label="姓名:" prop="truename" :label-width="formLabelWidth">
          <el-input v-model="data.form.truename" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="手机号:" :label-width="formLabelWidth" prop="phone">
          <el-input v-model="data.form.phone" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="地区:" :label-width="formLabelWidth" prop="region">
          <CityPicker :cityPickerData.sync="data.cityPickerData"></CityPicker>
        </el-form-item>
        <el-form-item label="是否启用:" :label-width="formLabelWidth" prop="status">
          <el-radio v-model="data.form.status" label="1">禁用</el-radio>
          <el-radio v-model="data.form.status" label="2">启用</el-radio>
        </el-form-item>
        <el-form-item label="系统:" :label-width="formLabelWidth" prop="role">
          <el-checkbox-group v-model="data.form.role">
            <el-checkbox
              v-for="item in data.getRoleList"
              :key="item.role"
              :label="item.role"
            >{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="按钮:" :label-width="formLabelWidth">
          <template v-if="data.btnPerm.length">
            <div v-for="item in data.btnPerm" :key="item.name">
              <h4>{{item.name}}</h4>
              <template v-if="item.perm && item.perm.length">
                <el-checkbox-group v-model="data.form.btnPerm">
                  <el-checkbox
                    v-for="button in item.perm"
                    :key="button.value"
                    :label="button.value"
                  >{{button.name}}</el-checkbox>
                </el-checkbox-group>
              </template>
            </div>
          </template>
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
import sha1 from "js-sha1";
import CityPicker from "@/components/CityPicker";
import { AddInfo } from "@/api/news";
import {
  getRoleList,
  userAdd,
  userEdit,
  getSystemList,
  permButton
} from "@/api/user";
import { validateEmail, validatePass } from "@/utils/validate.js";
import {
  reactive,
  ref,
  watchEffect,
  watch,
  onMounted,
  onBeforeMount
} from "@vue/composition-api";
export default {
  name: "dialogInfo",
  components: {
    CityPicker
  },
  props: {
    flag: {
      type: Boolean,
      default: false
    },
    category: {
      type: Array,
      default: () => []
    },
    editData: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, { emit, root, refs }) {
    // 验证相关的函数
    let validateUsername = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("邮箱不能为空"));
      } else if (validateEmail(value)) {
        return callback(new Error("请输入正确的邮箱"));
      } else {
        callback();
      }
    };
    /**
     * 业务逻辑
     * 1、编辑状态：
     *    需要检验：data.form.id存在并且，密码不为空时
     *    不需要检验：data.form.id存在并且，密码为空时
     *
     * 2、添加状态
     *    需要检验：data.form.id不存在
     */
    let validatePassword = (rule, value, callback) => {
      if (data.form.id && !value) {
        callback();
      }
      if ((data.form.id && value) || !data.form.id) {
        if (value === "") {
          return callback(new Error("请输入密码"));
        } else if (validatePass(value)) {
          return callback(new Error("密码不正确"));
        } else {
          callback();
        }
      }
    };
    // const dialogFormVisible = ref(false);
    const formLabelWidth = ref("90px");
    const data = reactive({
      dialogFormVisible: false,
      // 获取地区数据
      cityPickerData: {},
      options: [],
      form: {
        username: "",
        truename: "",
        password: "",
        phone: "",
        region: "",
        status: "1",
        role: [],
        btnPerm: []
      },
      getRoleList: [],
      btnPerm: [],
      submitLoading: false,
      rules: {
        username: [
          { required: true, validator: validateUsername, trigger: "blur" }
        ],
        password: [
          { required: true, validator: validatePassword, trigger: "blur" }
        ],
        role: [{ required: true, message: "请选择角色", trigger: "change" }]
      }
    });

    const dialogClose = () => {
      data.dialogFormVisible = false;
      resetFields();
      // 如果回调的时候不需要处理其他逻辑，只是传递一个参数时，可以直接使用修饰器
      emit("update:flag", false);
    };

    const resetFields = () => {
      refs.form.resetFields();
    };

    // 弹窗打开时的回调
    const openDialog = () => {
      getRole();
      let editData = props.editData;
      // id存在则是在编辑
      if (props.editData.id) {
        editData.role = editData.role ? editData.role.split(",") : []; // 数组
        editData.btnPerm = editData.btnPerm ? editData.btnPerm.split(",") : []; // 数组
        for (let key in editData) {
          data.form[key] = editData[key];
        }
      } else {
        data.form.id && delete data.form.id;
      }
    };

    const cancelsubmit = () => {
      data.dialogFormVisible = false;
      resetFields();
    };

    const submit = () => {
      refs.form.validate(valid => {
        if (valid) {
          data.submitLoading = true;
          data.form.region = data.cityPickerData;
          let requestData = JSON.parse(JSON.stringify(data.form));
          requestData.password = requestData.password;
          requestData.role = requestData.role.join();
          requestData.btnPerm = requestData.btnPerm.join()

          // 添加状态，需要密码，并且加密
          // 编辑状态：值存在，需要密码，并加密；否则删除
          if (data.form.id) {
            if (requestData.password) {
              requestData.password = sha1(requestData.password);
            } else {
              delete requestData.password;
            }
            userEditFun(requestData);
          } else {
            requestData.password = sha1(requestData.password);
            userAddFun(requestData);
          }
        } else {
          return false;
        }
      });
    };

    const userAddFun = item => {
      userAdd(item)
        .then(res => {
          root.$message.success("添加成功");
          data.submitLoading = false;
          resetFields();
          data.cityPickerData = {};
          data.dialogFormVisible = false;
          emit("refreshTabel");
        })
        .catch(err => {
          data.submitLoading = false;
          resetFields();
          data.cityPickerData = {};
          data.dialogFormVisible = false;
        });
    };
    const userEditFun = item => {
      userEdit(item)
        .then(res => {
          root.$message.success("添加成功");
          data.submitLoading = false;
          resetFields();
          data.cityPickerData = {};
          data.dialogFormVisible = false;
          emit("refreshTabel");
        })
        .catch(err => {
          data.submitLoading = false;
          resetFields();
          data.cityPickerData = {};
          data.dialogFormVisible = false;
        });
    };

    // 请求系统列表
    /* const getRole = () => {
      getSystemList().then(res => {
        data.getRoleList = res.data;
      });
    }; */
    // 请求角色列表
    const getRole = () => {
      // 如果角色列表已经存在数据，就不用每次发送请求
      if(data.btnPerm.length && data.getRoleList.length) return
      getRoleList().then(res => {
        data.getRoleList = res.data;
      });
      permButton().then(res => {
        data.btnPerm = res.data;
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