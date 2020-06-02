<template>
  <div>
    <div class="header">
      <em-header :title="title">
        <em-user slot='top-nav' :pageType='pageType' :user="user">
        </em-user>
      </em-header>
    </div>
    <div class="content">
      <div class="forget-psd">
        <div class="title">
          {{stepList[curStep].title}}
        </div>
        <div class="main">

          <!-- 找回密码 -->
          <div v-if="curStep === 0">
            <el-form :model="formForgetPsd" ref="formForgetPsd" :rules="formForgetPsdRules">
              <el-form-item prop="email">
                <el-input v-model="formForgetPsd.email" @keyup.enter.native="submitEmail('formForgetPsd')" placeholder="请输入邮箱地址"></el-input>     
              </el-form-item>
              <el-form-item prop="email" style="display:none;">
                <el-input type='password' v-model="formForgetPsd.email" @keyup.enter.native="submitEmail('formForgetPsd')" placeholder="请输入邮箱地址"></el-input>     
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitEmail('formForgetPsd')">下一步</el-button>
              </el-form-item>
            </el-form>
          </div>

          <!-- 发送邮件 -->
          <div v-if="curStep === 1">
            <div class="message">
              <span class="text">已向绑定的邮箱</span>
              <span class="font-weight">{{starEncrypt(formForgetPsd.email)}}</span>
              <span class="text">重新发送了一份重置密码的邮件，请注意查收</span>
            </div>
            <div>
              <div class="no-receive">
                <span class="text">没有收到？</span>
              </div>
              <el-button type="primary" @click="resendEmail">重新发送</el-button>
            </div>
          </div>

          <!-- 重置密码 -->
          <div v-if="curStep === 2">
            <el-form ref="formNewPsd" :model="formNewPsd" :rules="formPsdRules" label-width="100px" label-position="right">
              <el-form-item label="新密码" prop="pass">
                <el-input v-model="formNewPsd.pass" type="password" placeholder="请输入新密码"></el-input>
              </el-form-item>
              <el-form-item label="确认新密码" prop="checkPass">
                <el-input v-model="formNewPsd.checkPass" type="password" placeholder="请再次输入新密码"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitNewPsd">确认密码</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import EmHeader from '../../../components/em_components/EmHeader';
import EmUser from '../../../components/em_components/EmUser';
import { sAjax } from '../../../assets/utils/utils';
import { stat } from 'fs';
export default {
  name: 'forgetPassword',
  components: { EmHeader, EmUser },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.formNewPsd.checkPass !== '') {
          this.$refs.formNewPsd.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.formNewPsd.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      title: {
        name: '就业管理系统',
        url: 'employmentPlatform'
      },
      pageType: 1,
      user: null,
      curStep: 0,
      stepList: [{
        title: '找回密码'
      }, {
        title: '发送邮件',
      }, {
        title: '重置密码'
      }],
      formForgetPsd: {
        email: ''
      },
      formForgetPsdRules: {
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ]
      },
      formNewPsd: {
        pass: '',
        checkPass: ''
      },
      formPsdRules: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ],
      }
    }
  },
  beforeCreate() {
    document.querySelector('body').setAttribute('style', "background:#fff");
  },
  beforeDestroy() {
    document.querySelector('body').removeAttribute('style');
  },
  created() {
    if (this.getUrlParam('schoolId') && this.getUrlParam('dataKey')) {
      this.curStep = 2;
    }
  },
  methods: {
    // 使用*加密
    starEncrypt(value) {
      let reg = /([@][^@]+)$/;
      let _value = value.replace(reg, "");// 获取@前
      var reg2 = /([^@]+)$/;
      var _value2 = value.match(reg2)[1];// 获取@后
      let start = "******";
      let result = start + _value2;
      switch (_value.length) {
        case 1:
        case 2:
        case 3:
        case 4:
          break;
        case 5:
        case 6:
        case 7:
          result = _value.substr(0, 1) + start + _value.substr(_value.length - 1, _value.length) + _value2;
          break;
        case 8:
        case 9:
        case 10:
          result = _value.substr(0, 2) + start + _value.substr(_value.length - 2, _value.length) + _value2;
          break;
        default:
          result = _value.substr(0, 3) + start + _value.substr(_value.length - 3, _value.length) + _value2;
          break;
      }
      return result
    },
    // 去url参数
    getUrlParam(name) {
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
      var result = window.location.search.substr(1).match(reg);
      return result ? decodeURIComponent(result[2]) : null;
    },
    // 重新发送
    resendEmail() {
      let that = this;
      sAjax({
        url: '/api/employment/certifications/passwordResetConfirm',
        type: 'post',
        data: {
          userMail: that.formForgetPsd.email,
          confirmUrl: 'employment/forget'
        },
        success: (data) => {
          if (data.state) {
            this.$message.success("邮件重新发送成功")
          } else {
            this.$message.error(data.message)
          }
        }
      });
    },
    // 下一步
    submitEmail(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let url = '/api/employment/certifications/passwordResetConfirm'
          sAjax({
            url: url,
            type: 'post',
            data: { userMail: this.formForgetPsd.email, confirmUrl: 'employment/forget' },
            success: (data) => {
              if (data.state) {
                this.$message.success("邮件发送成功")
                this.curStep = 1;
              } else {
                this.$message.error(data.message)
              }
            }
          })
        } else {
          return false;
        }
      });
    },
    // 确认密码
    submitNewPsd() {
      let that = this;
      this.$refs.formNewPsd.validate((valid) => {
        if (!valid) {
          return false;
        }
        else {
          sAjax({
            url: '/api/employment/certifications/passwordReset',
            type: 'post',
            data: {
              dataKey: this.getUrlParam("dataKey"),
              userPassword: that.formNewPsd.pass
            },
            success: (data) => {
              console.log(data)
              if (data.state) {
                this.$message.success('密码设置成功');
                this.$router.push('/default/login/employment')
              } else {
                this.$message.error(data.message);
              }
            }
          });
        }
      });
    }
  }
}
</script>
<style lang="less" scoped>
.forget-psd {
  background: #ffffff;
  .title {
    padding-top: 46px;
    margin-bottom: 56px;
    font-size: 18px;
    font-weight: 500;
    text-align: center;
  }
  .main {
    width: 600px;
    margin: auto;
    text-align: center;
    .message {
      margin-bottom: 56px;
    }
    .text {
      color: #979797;
    }
    .font-weight {
      font-weight: 500;
    }
    .no-receive {
      margin-bottom: 8px;
    }
  }
}
</style>
