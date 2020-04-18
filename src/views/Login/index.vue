<template>
  <div id="login">
    <div class="login-wrap">
      <ul class="menu-tab">
        <li
          v-for="(item,index) in menuTab"
          :key="item.id"
          :class="{'current': index === currentIndex}"
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
          <el-input type="password" minlength="6" maxlength="20" v-model="ruleForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="passwords" class="item-form" v-if="passShow">
          <label>重复密码</label>
          <el-input type="password" minlength="6" maxlength="20" v-model="ruleForm.passwords" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="code" class="item-form">
          <label>验证码</label>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-input minlength="6" maxlength="6" v-model.number="ruleForm.code"></el-input>
            </el-col>
            <el-col :span="12">
              <el-button type="success" class="block">获取验证码</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" v-if="passShow" @click="submitForm('ruleForm')" class="block login-btn">注册</el-button>
          <el-button type="danger" v-else @click="submitForm('ruleForm')" class="block login-btn">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {validateEmail,validatePass,validateVCode} from '@/utils/validate.js'
export default { 
  data() {
    var validateUsername = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error("邮箱不能为空"));
      } else if(validateEmail(value)){
        return callback(new Error("请输入正确的邮箱"));
      }else {
        callback()
      }
    };
    var validatePassword = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("请输入密码"));
      } else if(validatePass(value)){
        return callback(new Error("密码不正确"));
      } else {
        callback()
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.password) {
        return callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    var checkCode = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("验证码不能为空"));
      } else if(validateVCode(value)) {
        return callback(new Error("验证码格式有误"));
      } else {
        callback()
      }
    }
    return {
      passShow: false,
      ruleForm: {
        username: "",
        password: "",
        passwords: '',
        code: ""
      },
      rules: {
        username: [{ validator: validateUsername, trigger: "blur" }],
        password: [{ validator: validatePassword, trigger: "blur" }],
        passwords: [{ validator: validatePass2, trigger: "blur" }],
        code: [{ validator: checkCode, trigger: "blur" }]
      },
      currentIndex: 0,
      menuTab: [
        {
          id: 1,
          txt: "登录"
        },
        {
          id: 2,
          txt: "注册"
        }
      ]
    };
  },
  methods: {
    toggleMenu(i) {
      this.currentIndex = i;
      this.passShow = i === 1 ? true : false
      // this.ruleForm = {}
      this.$refs['ruleForm'].resetFields();
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
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
