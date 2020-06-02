<template>

  <div id="accountInfo">
    <div class="info" v-if="changeType=='none'">
      <div class="top">
        <h1>账号信息</h1>
      </div>
      <div class="content">
          <ul class="infoList">
            <li class="clearfix"><p><span>邮箱:</span>{{emailFilter}}</p><a @click="changeInfo('mail')">更换邮箱</a></li>
            <li class="clearfix"><p><span>上次登录时间:</span>{{curUserInfo.lastLoginTime}}</p><a @click="changeInfo('password')">重置密码</a></li>
          </ul>
      </div>
    </div>
    <!-- 重置邮箱 -->
    <div id="mail" v-if="changeType=='mail'">
       <!-- 更换邮箱 -->

       <!-- 邮箱步骤一 -->
      <div class="changeMail" v-if='mail_step == 1'> 
        <div class="top">
          <h1>更改邮箱</h1>
        </div>
        <div class="content">
          
          <div class="validate">
            <p class="title" style="text-align: left;"><span>为了保证您账号的安全,需要进行安全验证,你当前的邮箱是<i>{{curUserInfo.email.replace(curUserInfo.email.substring(3,7), "****")}}</i></span></p>
            <div class="form clearfix">
              <el-form :model="codeForm" ref="codeForm" :rules="codeRules" class="changeMailForm">
                <el-form-item 
                prop="code"
                >
                  <el-input v-model="codeForm.code" placeholder="请输入验证码"></el-input>
                </el-form-item>
              </el-form>
              <a @click="sendCode('toMail')" ref="sendCode">发送验证码</a>
            </div>
          </div>
          <el-button type="primary" @click="toMail_step2">下一步</el-button>
        </div>
      </div>

      <!-- 更换邮箱 验证码-->

       <!-- 邮箱步骤二 -->
      <div class="changeMail" v-if='mail_step == 2'>
        <div class="top">
          <h1>更改邮箱</h1>
        </div>
        <div class="content">
          <div class="validate">
            <div class="form clearfix">
              <el-form :model="mailForm" ref="mailForm" :rules='mailFormRules' class="clearfix">
                <el-form-item  prop="mail">
                  <el-input v-model="mailForm.mail" placeholder="请输入新邮箱"></el-input>
                </el-form-item>
                <el-form-item prop="code" class="changeMail_code">
                  <el-input v-model="mailForm.code" placeholder="请输入验证码"></el-input>
                </el-form-item>
                <a @click="sendCode('toNewMail')" ref="sendCode" style="margin-top: 15px;">发送验证码</a>
              </el-form>
              <p class="tip"><i>*</i>您可以使用 此邮箱登录或找回密码,请勿随意泄露邮箱地址，以免被不法分子利用</p>
            </div>
          </div>
          <el-button type="primary" @click="toMail_step3">下一步</el-button>
        </div>
      </div>
    </div>
   
    <!-- 重置密码 -->
    <div id="password" v-if="changeType=='password'">
      <div class="changePassword">
        <div class="top">
          <h1>重置密码</h1>
        </div>
        <div class="content" v-if="password_step == 1">
          <p class="title"><span>激活邮件已发送至您的邮箱</span><i>{{curUserInfo.email.replace(curUserInfo.email.substring(3,7), "****")}}</i></p>
          <a class="missed" @click="missed">没有收到?</a>
          <el-button type="primary" class="repeat" ref="sendCode" @click="changeInfo('password')">重新发送</el-button>
        </div>
        <!-- 设置新密码 -->
        <!-- <div class="content" v-if="password_step == 2">
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
        </div> -->
      </div>
    </div>
  </div>
</template>
<script>
import { sAjax } from '../../../assets/utils/utils';
export default {
  name: 'accountinfo',
  // props:['userInfo'],
  data() {
    let checkCode = (rule, value, callback) => {  //验证码格式验证
          if(isNaN(value) || value.length != 4) {
            callback(new Error('请输入4位数字'));
        }else {
          callback();
        }
      };
     
    return {
      curUserInfo:{},//当前用户对象信息
      changeType:'none',//更换邮箱或者更改密码
      mail: '',//邮箱绑定，
      mail_step: 1,
      password_step: 1,
      changemail: '',
      code: '',
      isSendCode: false,//是否已经点击了发送验证码
      validateCode: '',//4位数验证码
      validateKey:'',//验证返回的一段字符
      codeForm: {
        code:''
      },
      codeRules: { //验证码验证规则
        code:[{validator:checkCode,trigger:'change'}]
      },
      mailForm: {
        mail:'',
        code:'',
      },
      mailFormRules: {
        mail: [{ required: true, message: '请输入邮箱地址', trigger: 'blur' },
               { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }],
        code:[{validator:checkCode,trigger:'change'}]
      },
     
      counting:false,
      emailFilter:'',
    }
  },
  methods: {
    changeInfo(type) {  //重置邮箱或者修改密码
      console.log(type)
      if(type == 'password') {
        let url = '/api/employment/certifications/passwordResetConfirm'
        sAjax({
          url: url,
          type: 'post',
          data: {userMail: this.curUserInfo.email,confirmUrl:'employment/resetPassword'},
          success: (data) => {
            if(data.state) {
              this.changeType = type
              this.$message.success('邮件发送成功,请注意查收')
            }else {
              this.$message.error(data.message)
            }
          }
        })
      }else {
        this.changeType = type
      }
    },
    sendCode(type) {  //发送邮箱验证码倒计时
      if(type != 'toMail') {
        if(!this.mailForm.mail) {
          return this.$message.error('请先输入新邮箱')
        }
      }
      if(this.counting) return false
      let dom = this.$refs.sendCode
      let count = 60
      let data = {}
      let url = ''
      this.counting = true   
      let codeInterval = setInterval(() => {
        if(count != 0) {
          dom.innerHTML = count + 's'
          count-- 
        }else {
          this.counting = false
          dom.innerHTML = '重新发送'
          clearInterval(codeInterval)
        }
      }, 1000);
      if(type == 'toMail') {
        if(this.counting)
        // data = {userMail: this.curUserInfo.email}
        // url = '/api/employment/certifications/sendVerificationCodeToOldMail'
        this.toOldMail()
      }else {
        // data = {userMail: this.curUserInfo.email}
        // url = '/api/employment/certifications/sendVerificationCodeToNewMail'
        this.toNewMAil()
      }
      
    },
    toOldMail() {
      let url = '/api/employment/certifications/sendVerificationCodeToOldMail'
      sAjax({
        url: url,
        type:'post',
        data: {userMail: this.curUserInfo.email},
        success: (info) => {
           if(info.state) {
              this.validateCode = info.data.verificationCode
              this.validateKey = info.data.dataKey
              this.counting = false
              this.$message.success('验证码发送成功,请注意查收')
            }else {
              this.$message.error("验证码发送失败,请稍后再试")
            }
        }
      })
    },
    toNewMAil() {
      let url = '/api/employment/certifications/sendVerificationCodeToNewMail'
      sAjax({
        url: url,
        type:'post',
        data: {userMail: this.mailForm.mail},
        success: (info) => {
           if(info.state) {
              this.validateCode = info.data.verificationCode
              this.validateKey = info.data.dataKey
              this.counting = false
              this.$message.success('验证码发送成功,请注意查收')
            }else {
              this.$message.error(info.message)
            }
        }
      })
    },
    toMail_step2() { //重置邮箱下一步按钮(验证原邮箱)
    this.$refs.codeForm.validate((valid) => {
        if(valid) {
          if(!this.validateKey) {
            return this.$message.error('验证码过期,请重新发送验证码')
          }
           let url = '/api/employment/certifications/verificationCodeCheck'
           sAjax({
             url: url,
             type:'post',
             data: {dataKey: this.validateKey,inputVerificationCode: this.codeForm.code,userMail:this.curUserInfo.email},
             success:(info) => {
               if(info.state) {
                 this.mail_step = 2
               }else {
                 this.$message.error(info.message)
               }
             }
           })
          // if(this.codeForm.code == this.validateCode) {
               
          // }else {
          //   this.$message.error('验证码输入错误,请确认后重新输入')
          // }
        }
      })
    },
    toMail_step3() {//重置邮箱下一步按钮(验证新邮箱)
      this.$refs.mailForm.validate((valid) => {
        if(valid) {
          let url = '/api/employment/certifications/verificationCodeCheck'
          sAjax({
            url: url,
            type:'post',
            data: {dataKey: this.validateKey,inputVerificationCode: this.mailForm.code,changeMail:true,userMail: this.mailForm.mail,oldMail:this.curUserInfo.email},
            success: (data) => {
              if(data.state) {
                this.$message.success('邮箱换绑成功!')
                this.mailForm.code = ''
                this.mailForm.mail = ''
                this.codeForm.code = ''

              }else {
                this.$message.error('邮箱换绑失败,请重新换绑')
              }
              this.changeCallBack()
            }
          })
        }
      })
    },
    changeCallBack() {  //操作成功后
      this.changeType = 'none'
      this.mail_step = 1
      this.password_step = 1
      this.getUser()
    },
    sendRepeat() {
      // this.password_step = 2
    },
    
    getUser() {
      let url = '/api/employment/user/getUser'
      sAjax({
        url: url,
        type:'get',
        success: (data) => {
          if(data.state) {
            this.curUserInfo = data.data
            this.emailFilter = data.data.email.replace(data.data.email.substring(3,7), "****")
          }else {
            this.$message.error('获取用户信息失败')
          }
        }
      })
    }
  },
  created() {
    this.getUser()
  },
  mounted() {
    
  }
}
</script>
<style lang="less">
.changePassword {
  .form {
    .el-form {
     display: inline-block;
    }
    .el-form-item__content {
      width: 400px;
    }
    .el-form-item__label {
      color: #000;
    }
  }
}
</style>

<style lang="less" scoped>
#accountInfo {
  padding-left: 20px;
  .content {
    min-height: 320px;
    padding: 50px 30px 0 30px; 
    .infoList {
      a {
        color: #3E92FE;
        font-weight: bold;
        cursor: pointer;
      }
    }
    li {
      font-size: 14px;
      margin-bottom: 25px;
      list-style-type: none;
      p {
        display: inline-block;
        font-weight: bold;
        float: left;
        line-height: 1;
        span {
          color: #B8B8B8;
          min-width: 100px;
          text-align: right;
          padding-right: 10px;
          font-weight: bold;
          display: inline-block;
        }
      }
      a {
        float: right;
      }
    }
  }
  .changeMail,.changePassword {
    text-align: center;                                           
    .validate {
      width: 550px;
      margin: 0 auto;
      .el-form.changeMailForm {
        float: left;
        display: inline-block;
        width: 390px;
        margin-right: 10px;
        margin-bottom: 20px;
      }
      
      .el-input:nth-child(2) {
        margin-bottom: 0;
      }
      .el-input.mailUrl {
        width: 100%;
      }
      a {
        border: 1px solid #3E92FE;
        display: inline-block;
        color: #3E92FE;
        cursor: pointer;
        width:150px;
        height:40px;
        line-height: 40px;
        border-radius:4px;
        box-sizing: border-box;
      }
    }
    .title {
      margin-bottom: 30px;
      span {
        color: #B9B9B9;
      }
      i {color: #000;font-weight: bold;}
    }
    button {
      width: 150px;
      margin-top: 50px;
    }
    button.repeat {
      margin-top: 0;
      width: 200px;
    }
    button.success {
      margin-top: 30px;
    }
    a.missed {
      display: block;
      color: #979797;
      margin: 50px 0 20px 0;
    }
    .changeMail_code {
      width: 350px;
      margin-top: 15px;
      float: left;
      margin-bottom: 0;
    }
    .changeMail_code.is-error {
      margin-bottom: 22px;
    }
  }
  p.tip {
    font-size: 12px;
    text-align: left;
    color: #B9B9B9;
    margin-top: 8px;
    i {
      color: #D25050;
    }
  }
}
#password {
  .form {
    text-align: center;
  }
}
</style>

