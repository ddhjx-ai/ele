<template>
  <div id="login">
    <div class="login-wrap">
      <ul class="menu-tab">
        <li
          v-for="(item,index) in menuTab"
          :key="item.id"
          :class="{'current': index == currentIndex}"
          @click="toggleMenu(index)"
        >{{ item.txt }}</li>
      </ul>

      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        class="login-form"
        size="medium"
      >
        <el-form-item prop="username" class="item-form">
          <label>邮箱</label>
          <el-input type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="password" class="item-form">
          <label>密码</label>
          <el-input
            type="password"
            minlength="6"
            maxlength="20"
            v-model="ruleForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item prop="passwords" class="item-form" v-if="passShow">
          <label>重复密码</label>
          <el-input
            type="password"
            minlength="6"
            maxlength="20"
            v-model="ruleForm.passwords"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item prop="code" class="item-form">
          <label>验证码</label>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-input minlength="6" maxlength="6" v-model="ruleForm.code"></el-input>
            </el-col>
            <el-col :span="12">
              <el-button
                type="success"
                class="block"
                :disabled="codeDisbale"
                @click="getCheckCode"
              >{{codeText}}</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <!-- <el-button
            type="danger"
            v-if="passShow"
            @click="submitForm('ruleForm')"
            class="block login-btn"
          >注册</el-button>-->
          <el-button
            type="danger"
            :disabled="isDisabled"
            @click="submitForm('ruleForm')"
            class="block login-btn"
          >{{currentIndex === 1 ? '注册' : '登录' }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// 加密
import sha1 from 'js-sha1';
import { getCode, Register,Login } from "@/api/login.js";
import { reactive, ref, isRef, onMounted } from "@vue/composition-api";
import {
  validateEmail,
  validatePass,
  validateVCode
} from "@/utils/validate.js";
export default {
  name: "login",
  setup(props, context) {
    // 这里放置data数据，生命周期，自定义的函数
    // context中有所以的vue实例属性
    const { attrs, slots, parent, root, emit, refs } = context;
    /* 
      attrs = this.$attrs
      emit = this.$emit
      listeners = this.$listeners
      parent = this.$parent
      refs = this.$refs
      root = this
    */
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
    let validatePassword = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("请输入密码"));
      } else if (validatePass(value)) {
        return callback(new Error("密码不正确"));
      } else {
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("请再次输入密码"));
      } else if (value !== ruleForm.password) {
        return callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    let checkCode = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("验证码不能为空"));
      } else if (validateVCode(value)) {
        return callback(new Error("验证码格式有误"));
      } else {
        callback();
      }
    };
    // 对象类型的数据都需要使用reactive()形式来进行声明
    const menuTab = reactive([
      { id: 1, txt: "登录" },
      { id: 2, txt: "注册" }
    ]);

    // 基础数据类型的声明,使用ref(),取值是需要通过currentIndex.value获取值
    // 修改是也是需要currentIndex.value = xxx 进行修改
    const currentIndex = ref(0);
    const passShow = ref(false);
    const isDisabled = ref(true);
    const codeDisbale = ref(false);
    const codeText = ref("获取验证码");
    const timer = ref(null);
    // 表单数据
    const ruleForm = reactive({
      username: "",
      password: "",
      passwords: "",
      code: ""
    });
    // 表单验证
    const rules = reactive({
      username: [{ validator: validateUsername, trigger: "blur" }],
      password: [{ validator: validatePassword, trigger: "blur" }],
      passwords: [{ validator: validatePass2, trigger: "blur" }],
      code: [{ validator: checkCode, trigger: "blur" }]
    });

    // 生命周期
    onMounted(() => {
      // login()
    });

    // 声明函数
    // 获取验证码
    const getCheckCode = () => {
      if (ruleForm.username === "") {
        return root.$message.error("邮箱不能为空");
      }
      if (validateEmail(ruleForm.username)) {
        return root.$message.error("邮箱格式有误，请重新输入");
      }
      let data = {
        username: ruleForm.username,
        module: currentIndex === 0 ? "login" : "register"
      };
      codeDisbale.value = true;
      codeText.value = "发送中...";

      setTimeout(() => {
        getCode(data).then(res => {
          if (res.resCode === 0) {
            root.$message.success("验证码已发送");
            isDisabled.value = false;
            // 开启定时器
            startTime();
          }
        });
      }, 2000);
    };
    const toggleMenu = i => {
      currentIndex.value = i;
      passShow.value = i === 1 ? true : false;
      refs["ruleForm"].resetFields();
      clearTimer()
    };
    // 提交表单
    const submitForm = formName => {
      // this.$refs[formName]   vue2.x写法
      refs[formName].validate(valid => {
        if (valid) {
          if(currentIndex.value === 1){
            register()
          }else{
            login()
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    };
    // 登录
    const login = () => {
      let data = {
        username: ruleForm.username,
        password: sha1(ruleForm.password),
        code: ruleForm.code
      };
      root.$store.dispatch('app/login',data).then(res => {
        root.$message.success("登录成功");
        root.$router.push({name: 'Console'})
      })
      /* Login(data).then(res => {
        root.$message.success("登录成功");
        root.$router.push({name: 'Console'})
      }); */
    };
    // 注册
    const register = () => {
      let data = {
        username: ruleForm.username,
        password: sha1(ruleForm.password),
        code: ruleForm.code
      };
      Register(data).then(res => {
        root.$message.success("注册成功");
        toggleMenu(0);
        clearTimer();
      });
    };
    // 倒计时函数
    const startTime = () => {
      let number = 60;
      codeText.value = `倒计时${number}秒`;
      timer.value = setInterval(() => {
        number--;
        if (number === 0) {
          codeText.value = `获取验证码`;
          codeDisbale.value = false;
          clearInterval(timer.value);
        } else {
          codeText.value = `倒计时${number}秒`;
        }
      }, 1000);
    };
    // 移除倒计时
    const clearTimer = () => {
      codeDisbale.value = false;
      codeText.value = "获取验证码";
      clearInterval(timer.value);
    };
    // 所有声明的函数和变量都需要暴露出去
    return {
      menuTab,
      currentIndex,
      isDisabled,
      codeDisbale,
      codeText,
      passShow,
      toggleMenu,
      submitForm,
      ruleForm,
      rules,
      getCheckCode
    };
  }
};
</script>

<style lang="scss" scoped>
#login {
  height: 100vh;
  background-color: #344a5f;
}
.login-wrap {
  width: 330px;
  margin: auto;
}
.menu-tab {
  text-align: center;
  li {
    display: inline-block;
    width: 88px;
    line-height: 36px;
    font-size: 14px;
    color: #fff;
    border-radius: 2px;
    cursor: pointer;
  }
  .current {
    background-color: rgba(0, 0, 0, 0.1);
  }
}
.login-form {
  margin-top: 29px;
  label {
    display: block;
    margin-bottom: 3px;
    font-size: 14px;
    color: #fff;
  }
  .item-form {
    margin-bottom: 16px !important;
  }
  .block {
    display: block;
    width: 100%;
  }
  .login-btn {
    margin-top: 19px;
  }
}
</style>
