<template>

    <!-- <div class="content"> -->
        <!-- <em-header 
        :title="title">
        <em-user 
          slot='top-nav' 
          :pageType='pageType' 
          :user="userInfo">
        </em-user>
      </em-header> -->
        <div class="content">
        <div class="form">
        <el-form ref="passwordForm" :model="setPassword" :rules="password_rule" label-width="120px">
            <el-form-item label="新密码：" prop="pass">
            <el-input type="password" placeholder="请输入新密码" v-model="setPassword.pass" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认新密码：" prop="checkPass">
            <el-input type="password" placeholder="请再次输入新密码" v-model="setPassword.checkPass" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        </div>
        <el-button type="primary" class="success" @click="password_success">完成</el-button>
    </div>
    <!-- </div> -->
</template>
<script>
import { sAjax } from '../../../assets/utils/utils';
export default {
  data() {
     let validatorPsd = (rule, value, callback) => {
      const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,25}$/;
      if (!reg.test(value)) {
        return callback('密码必须包含数字和字母');
      }
      else {
        callback();
      }
    }
    let checkPassword = (rule, value, callback) => {
      //密码格式验证
      if (value != this.setPassword.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      setPassword: {
        pass: "",
        checkPass: ""
      },
      password_rule: {
        pass: [{
          required: true,
          message: "请输入密码",
          trigger: 'blur'
        }, {
          min: 6,
          max: 25,
          message: '只能输入6-25位密码'
        }, {
          validator: validatorPsd,
          trigger: 'blur'
        }],
        checkPass: [
          { required: true, message: "请再次输入密码" },
          { validator: checkPassword, trigger: ["blur", "change"] }
        ]
      },
      
    }
  },
  methods: {
      password_success() {
      this.$refs.passwordForm.validate((valid) => {
        if(valid) {
            let dataKey = this.$router.currentRoute.query.dataKey
            let url = '/api/employment/certifications/passwordReset'
            let msg = ''
            sAjax({
                url: url,
                data: {dataKey:dataKey,userPassword: this.setPassword.checkPass},
                type: 'post',
                success: (data) => {
                    if(data.state) {
                        msg = '密码重置成功,点击确定返回就业系统平台'
                    }else {
                        msg = '密码重置失败,点击确定返回就业系统平台' 
                    }
                    this.$alert(msg, '密码重置', {
                        confirmButtonText: '确定',
                        callback: action => {
                        this.$router.push('/employment/index')
                        }
                    });
                }
            })
        }
      })
    },
  },
  components: {
    // EmHeader,
    // EmUser
  }
};
</script>
<style lang="less" scoped>
.content {
    .form {
        width: 40%;
        margin: 30px auto;
    }
    text-align: center;
}
</style>


