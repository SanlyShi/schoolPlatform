<!--  -->
<template>
  <div class="set-password">
    <el-form
      :model="passwordRuleForm"
      status-icon
      :rules="passwordRules"
      ref="passwordRuleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="密码" prop="pass">
        <el-input type="password" v-model="passwordRuleForm.pass" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="passwordRuleForm.checkPass" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('passwordRuleForm')">提交</el-button>
        <el-button @click="resetForm('passwordRuleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { sAjax } from "../../../assets/utils/utils.js";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.passwordRuleForm.checkPass !== "") {
          this.$refs.passwordRuleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.passwordRuleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      passwordRuleForm: {
        pass: "",
        checkPass: ""
      },
      passwordRules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },
  created() {
    let name,
      value,
      str = location.href,
      num = str.indexOf("?"); //取得整个地址栏
    str = str.substr(num + 1); //取得所有参数 stringvar.substr(start [, length ]
    let arr = str.split("&"); //各个参数放到数组里
    for (let i = 0; i < arr.length; i++) {
      num = arr[i].indexOf("=");
      if (num > 0) {
        name = arr[i].substring(0, num);
        value = arr[i].substr(num + 1);
        this[name] = value;
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          sAjax({
            url: "/api/employment/certifications/setPassword",
            type: "post",
            data: {
              dataKey: this.dataKey,
              userPassword: this.passwordRuleForm.pass
            },
            success: data => {
              if (data.state) {
                this.$toast("设置密码成功");
                this.resetForm("passwordRuleForm");
              } else {
                this.$toast(data.message);
              }
            }
          });
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
<style scoped>
.set-password {
  width: 500px;
  margin: 100px auto 0 auto;
}
</style>