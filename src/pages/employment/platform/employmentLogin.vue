<template>
  <div>
    <div class="header">
      <em-header :title="title">
        <em-user slot='top-nav' :pageType='pageType'>
        </em-user>
      </em-header>
    </div>
    <div class="content">
      <div class="employment-login" :style="{backgroundImage:'url('+require('../../../../static/image/employment/background.png')+')'}">
        <div class="login-content">
          <el-radio-group v-model="roleType" class="radio-content" @change="groupChange">
            <el-radio label="student">学生登录</el-radio>
            <el-radio label="teacher">教师登录</el-radio>
            <el-radio label="company">单位登录</el-radio>
          </el-radio-group>
          <div v-if="(roleType === 'student' || roleType === 'teacher') && !clickIxyLogin">
            <div class="uia-btn">
              <el-button type="primary" round @click="schoolLogin" v-if="cas">统一身份认证接口</el-button>
              <el-button type="primary" round @click="ixyLoginClick" v-if="ixyLogin">学生工作平台登录</el-button>
            </div>
          </div>
          <div v-else-if="roleType === 'company'">
            <div class="login-form">
              
              <el-form ref="formLogin" :model="formLogin" :rules="ruleLogin">
                <el-form-item prop="username">
                  <el-input  @keyup.enter.native="companyLogin" v-model="formLogin.username" placeholder="请输入帐号"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input @keyup.enter.native="companyLogin" v-model="formLogin.password" type="password" placeholder="请输入密码"></el-input>
                </el-form-item>
              </el-form>
            </div>
            <div class="link">
              <div class="link-left">
                <span>还没有单位帐号？去</span>
                <span class="link-btn" @click="toRegister">注册</span>
              </div>
              <div class="link-right">
                <span class="link-btn" @click="toForgetPsd">忘记密码？</span>
              </div>
            </div>
            <div id="c1"></div>
            <div class="loginBtn">
              <!-- <input type="button" @keyup.enter="companyLogin" value='登录' /> -->
              <el-button type="primary" @click="companyLogin">登录</el-button>
            </div>
            <div class="errorMsg" v-show="disabled">您已被管理员拉入黑名单,若需申诉,请点击<a @click="checkReason">&lt;查看原因&gt;</a></div>
            <!-- <div class="tip" v-if="isBlacklisted && formLogin.loginType === 'corporation'">
              <span class="text-red">您已被管理员拉入黑名单，若需申诉，请点击</span>
              <span class="link-btn" @click="viewReason">&lt;查看原因&gt;</span>
            </div> -->
          </div>
          <div v-if="clickIxyLogin && roleType !== 'company'">
            <div class="login-form">
              <el-form ref="formLogin" :model="formLoginIxy" :rules="ruleLogin">
                <el-form-item prop="username">
                  <el-input v-model="formLoginIxy.username" placeholder="请输入帐号"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input v-model="formLoginIxy.password" type="password" placeholder="请输入密码"></el-input>
                </el-form-item>
              </el-form>
            </div>
            <div>
              <el-button type="primary" round @click="ixySubmit">登录</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 账号禁用原因 -->
    <el-dialog
        :visible.sync="dialogVisible"
        class="error_dialog" 
        width="500px"
        center>
        <p class="errorTips"><span>原因:</span><i :title="disabled_reason.reason">{{disabled_reason.reason}}</i></p>
        <p><span>时间：</span><i>{{disabled_reason.createTime}}</i></p>
      </el-dialog>
  </div>
</template>
<script>
import { sAjax } from '../../../assets/utils/utils';
import EmHeader from '../../../components/em_components/EmHeader';
import EmUser from '../../../components/em_components/EmUser';
import crypto from "crypto";

export default {
  name: 'employmentLogin',
  components: { EmHeader, EmUser },
  data() {
    return {
      schoolId:"",
      ixyLogin:false,
      cas:false,
      clickIxyLogin:false,
      title: {
        name: '就业管理系统',
        url: 'employmentPlatform'
      },
      pageType: 2,
      formLogin: {
        username: "",
        password: ""
      },
      formLoginIxy: {
        username: "",
        password: ""
      },
      roleType: 'student',
      ruleLogin: {
        username: [{
          required: true,
          message: "请输入帐号",
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: "请输入密码",
          trigger: 'blur'
        }]
      },
      isBlacklisted: false,
      reason: {
        content: '123',
        date: '2019.04.22'
      },
      disabled:false,//登录状态
      disabled_userId: '',//被禁用的userId
      dialogVisible: false,
      disabled_reason: {},

    }
  },
  created(){
    this.schoolId = this.$route.params.schoolId
    sAjax({
        type: 'get',
        url: '/system/config?sys=employment',
        success: (data) => {
          if (data.state) {
            // console.log(data.cas)
            // window.location.href = data.data.cas
            this.cas = data.data.cas;
            this.ixyLogin = data.data.ixyLogin
          } else {
            this.$message.error('error')
          }
        }
      })
  },
  methods: {
    toRegister() {
      this.$router.push('/employment/register');
    },
    toForgetPsd() {
      this.$router.push('/employment/forget');
    },
    ixyLoginClick(){
      this.clickIxyLogin = true
    },
    groupChange(){
      this.clickIxyLogin = false
    },
    schoolLogin() {
      window.location.href = this.cas
    },
    ixySubmit(){
      
      var that  =this
      let loginUrl = `/users/certifications`
      let userNo = this.formLoginIxy.username
      let password = crypto.createHash('md5').update(this.formLoginIxy.password).digest('hex')
       sAjax({
          url: loginUrl,
          type: 'post',
          data: {
            userNo: userNo,
            password: password
          },
          success: function (data) {
            that.closeWaiting()
            if (data.state) {
              location.href = "/employment"
            } else {
              that.$toast(data.message)
            }
          },
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Authorization",
            "Authorization": 'schoolId=' + that.schoolId
          }
        }).always(()=>{
          this.$waiting.close()
        })
    },
    companyLogin_ajax(token) {
      let password = this.formLogin.password
        this.disabled = false
        sAjax({
          type: 'post',
          url: '/employment/certifications/loginCheck',
          data: {
            userMail: this.formLogin.username,
            userPassword: crypto.createHash("md5").update(password).digest("hex"),
            token: token
          },
          // WAIT_PERFECT,   //待完善
          // CONFIRMED,      //已确认
          // DEACTIVATED,     //已停用
          // DISABLED;       //已禁用
          success: (data) => {
            if (data.state) {
              if(data.data.userStatus ==  'DISABLED') {
                this.disabled = true
                this.disabled_userId = data.data.id
                return this.$message.error('该账号已被禁用')
              }
              this.$router.push('/employment/index')
            } else {
              this.$message.error(data.message)
            }
          }
        })
      
    },
    companyLogin() {
      this.$refs.formLogin.validate((valid) => {
        if (!valid) {
          this.$message.error('账号或密码不能为空');
          return;
        }
        var myCaptcha = _dx.Captcha(document.getElementById('c1'), {
        appId: '5c7bafe274b534f13ec3b614135a362e', //appId，在控制台中“应用管理”或“应用配置”模块获取
        style:'inline',
        width:360,
        success:  (token) => {
          this.companyLogin_ajax(token) //登录请求
        }
      })
      });
      
      
    },
    checkReason() {
      let url = '/api/employment/blackList/getByMail?userId='+ this.disabled_userId
      sAjax({
        url: url,
        type: 'get',
        success: (data) => {
          if(data.state) {
            this.disabled_reason = data.data
            this.dialogVisible = true
          }
        }
      })
    },
    viewReason() {
      let that = this;
      const h = this.$createElement;
      that.$alert(
        '<div style="height: 32px; line-height: 32px;"><span>原因：</span><span style="color: #F36D6D">' + that.reason.content + '</span></div>'
        + '<div style="height: 32px; line-height: 32px;"><span>时间：</span><span>' + that.reason.date + '</span></div>',
        '',
        {
          confirmButtonText: '关闭',
          dangerouslyUseHTMLString: true
        }
      );
    }
  }
}
</script>
<style lang="less">
#c1 {
  margin-bottom: 20px;
}
.error_dialog {
  p{
    color: #999999;
    span {
       padding-right: 15px;
    }
    i,span {
      display: inline-block;
      vertical-align: middle;
    }
    i {
      font-style: normal;
      max-width: 300px;
      text-overflow: ellipsis;
      overflow: hidden;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      display: -webkit-box;
    }
  }
  p.errorTips {
    i {
      color: #F36D6D
    }
  }
}
.loginBtn  {
  margin-top: 25px;
  button {
    width: 200px;
    height: 50px;
    padding: 0;
    text-align: center;
    line-height: 50px;
    font-size: 16px;
    background: #4898FF;
    box-shadow:0px 4px 16px 0px rgba(149,195,255,1);
    border-radius:24px;
  }
 
}
</style>

<style lang="less" scoped>
.employment-login {
  height: calc(100vh - 64px);
  min-height: 500px;
  width: 100%;
  min-width: 1200px;
  background-repeat: no-repeat;
  background-size: 100% auto;
  background-color: rgb(220, 235, 254);
  .login-content {
    position: absolute;
    top: 290px;
    left: 56%;
    width: 360px;
    text-align: center;
  }
}
.errorMsg {
  color: #F36D6D;
  margin-top: 25px;
  a {
    text-decoration: none;
    cursor: pointer;
    color: #3E92FE;
  }
}
.radio-content {
  margin-bottom: 32px;
}

.link {
  height: 36px;
  &:after {
    display: block;
    content: "";
    line-height: 0;
    visibility: hidden;
    clear: both;
  }
}
.link-left {
  float: left;
  span {
    vertical-align: middle;
    color: #CECECE;
  }
  .link-btn {
    color: #3e92fe;
    cursor: pointer;
  }
}
.link-right {
  float: right;
  span {
    vertical-align: middle;
    color: #3e92fe;
    cursor: pointer;
  }
}
.uia-btn {
  height: 100px;
  line-height: 100px;
}

.tip {
  margin-top: 20px;
  text-align: left;
}
.text-red {
  color: #f36d6d;
}
</style>
