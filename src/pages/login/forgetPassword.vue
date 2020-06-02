<template>
  <div class="reset-cover">
    <div class="logincontent" @click.stop v-if="passwordTypeValue === 'email'">
      <div class="container-fluid">
        <h4>找回密码</h4>
        <div class="form-group" v-if="showUserNo">
          <label for>账号</label>
          <div class="userNo-input">
            <input
              class="login-input form-control"
              :class="!validData.numberETip?'':'error'"
              type="text"
              autocomplete="off"
              v-model="resetPassword.numberE"
              placeholder="请输入学号"
              :disabled='userNoDisabled '
              @change="_check('numberE')"
            >
            <button class="btn btn-primary" @click="_reqEmail">确定</button>
          </div>
          <p v-if="!validData.numberE">{{validData.numberETip}}</p>
        </div>
        <div class="form-group email-form-group" v-if="showEmailBtn">
          <div class="email-text">
            <div>您的邮箱：{{emailCode}}</div>
          </div>
          <button class="btn btn-primary" @click="_reqEmailCode">发送验证码</button><br/>
          <p class="email-success-tip" v-if="ifEmailSend">邮箱验证码已发送至您的邮箱，请您查收。</p>
        </div>
        <div class="reset-email-from" v-if="ifEmailSend">
          <div class="form-group" v-if="showUserNo">
            <label for>邮箱验证码</label>
            <input
              class="login-input form-control"
              :class="!validData.emailCodeTip?'':'error'"
              type="text"
              autocomplete="off"
              v-model="resetPassword.emailCode"
              placeholder="请输入验证码"
            >
            <p v-if="!validData.emailCode">{{validData.emailCodeTip}}</p>
          </div>
          <div class="form-group">
            <label for>新的密码</label>
            <input
              class="login-input form-control"
              :class="!validData.passwordTip?'':'error'"
              autocomplete="off"
              v-model="resetPassword.password"
              placeholder="8-25位，必须包含数字和字母"
              @change="_check('password')"
            >
            <p v-if="!validData.password">{{validData.passwordTip}}</p>
          </div>
          <div class="form-group" v-if="pwdStrong.length">
            <span class="pwd-red"></span><span class="pwd-yellow" v-show="pwdStrong.length > 1"></span><span class="pwd-green" v-show="pwdStrong.length > 2"></span>
            <i>{{pwdStrong.length==1?'弱':pwdStrong.length==2?'中':'强'}}</i>
          </div>
          <div class="form-group">
            <!-- <label for>确认密码</label> -->
            <input
              class="login-input form-control"
              :class="!validData.surepwTip?'':'error'"
              autocomplete="off"
              v-model="resetPassword.surepw"
              placeholder="再次填写新密码"
              @change="_check('surepw')"
            >
            <p v-if="!validData.surepw">{{validData.surepwTip}}</p>
          </div>
        </div>
        <button class="btn login-btn" @click="_closeReset">取消重置</button>
        <div class="emailResetPw" v-if="ifEmailSend">
          <button
            class="btn login-btn"
            @click="_reqToResetTwo"
            v-if="validData.password&&validData.surepw"
          >重置密码</button>
          <button class="btn login-btn" disabled v-else>重置密码</button>
        </div>
      </div>
    </div>
    <div class="logincontent" @click.stop v-else>
      <div class="container-fluid">
        <h4>找回密码</h4>
        <div class="form-group" v-if="showUserNo">
          <label for>账号</label>
          <input
            class="login-input form-control"
            :class="!validData.numberETip?'':'error'"
            type="text"
            autocomplete="off"
            v-model="resetPassword.numberE"
            placeholder="请输入学号"
            :disabled='userNoDisabled '
            @change="_check('numberE')"
          >
          <p v-if="!validData.numberE">{{validData.numberETip}}</p>
        </div>
        <div class="form-group" v-if="showIdCard">
          <label for>身份证号</label>
          <input
            class="login-input form-control"
            :class="!validData.idNoTip?'':'error'"
            type="text"
            autocomplete="off"
            v-model="resetPassword.idNo"
            placeholder="请输入身份证号"
            @change="_check('idNo')"
          >
          <p v-if="!validData.idNo">{{validData.idNoTip}}</p>
        </div>
        <div class="form-group" v-if="showOldPassword">
          <label for>旧密码</label>
          <input
            class="login-input form-control"
            :class="!validData.oldPasswordTip?'':'error'"
            type="text"
            autocomplete="off"
            v-model="resetPassword.oldPassword"
            placeholder="请输入旧密码"
            @change="_check('oldPassword')"
          >
          <p v-if="!validData.idNo">{{validData.oldPasswordTip}}</p>
        </div>
        <div class="form-group">
          <label for>新的密码</label>
          <input
            class="login-input form-control"
            :class="!validData.passwordTip?'':'error'"
            autocomplete="off"
            v-model="resetPassword.password"
            placeholder="8-25位，必须包含数字和字母"
            @change="_check('password')"
          >
          <p v-if="!validData.password">{{validData.passwordTip}}</p>
        </div>
        <div class="form-group" v-if="pwdStrong.length">
          <span class="pwd-red"></span><span class="pwd-yellow" v-show="pwdStrong.length > 1"></span><span class="pwd-green" v-show="pwdStrong.length > 2"></span>
          <i>{{pwdStrong.length==1?'弱':pwdStrong.length==2?'中':'强'}}</i>
        </div>
        <div class="form-group">
          <!-- <label for>确认密码</label> -->
          <input
            class="login-input form-control"
            :class="!validData.surepwTip?'':'error'"
            autocomplete="off"
            v-model="resetPassword.surepw"
            placeholder="再次填写新密码"
            @change="_check('surepw')"
          >
          <p v-if="!validData.surepw">{{validData.surepwTip}}</p>
        </div>
        <button class="btn login-btn" @click="_closeReset">取消重置</button>
        <button
          class="btn login-btn"
          @click="_reqToReset"
          v-if="validData.password&&validData.surepw"
        >重置密码</button>
        <button class="btn login-btn" disabled v-else>重置密码</button>
      </div>
    </div>
    <div id="c1"></div>
  </div>
</template>
<script>
  import { sAjax } from '../../assets/utils/utils';
  import crypto from 'crypto'
  export default {
    props: {
      number: '',
      showIdCard: {
        type: Boolean,
        default: true
      },
      showUserNo: {
        type: Boolean,
        default: true
      },
      showOldPassword: {
        type: Boolean,
        default: false
      },
      userNoDisabled: {
        type: Boolean,
        default: false
      },
      passwordTypeValue: 'idCard'
    },
    data: function () {
      return {
        demo_4: null,
        numberE:'',
        pwdStrong: [],//密码包含的强度 （low/mid/high 1个表示low 2个mid 3个high
        resetPassword: {},
        validData: {
          numberE: false,
          idNo: false,
          oldPassword: false,
          password: false,
          surepw: false,
          numberETip: '',
          idNoTip: '',
          passwordTip: '',
          surepwTip: '',
          oldPasswordTip: '',
          emailCode: false,
          emailCodeTip: ''
        },
        showEmailBtn: false,
        emailCode: '',
        ifEmailSend: false,
      }
    },
    mounted(){
      this.numberE = this.number
      // console.log(this.numberE)
      this._resetPassword()
      this._reqResetPasswordWay() 
    },
    methods: {
      _resetPassword: function () {
        this.resetPassword.show = true
        this.resetPassword.numberE = this.numberE
        this.resetPassword.idNo = ''
        this.resetPassword.oldPassword = ''
        this.resetPassword.password = ''
        this.resetPassword.surepw = ''
        this.numberE && (this.validData.numberE = true)
      },
      _check: function (field) {
        if (field === 'numberE') {
          if (!this.resetPassword.numberE) {
            this.validData.numberE = false
            this.validData.numberETip = '账号不能为空'
          } else {
            this.validData.numberE = true
            this.validData.numberETip = ''
          }
        } else if (field === 'idNo') {
          var reg = (/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/ || /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/)
          if (!this.resetPassword.idNo) {
            this.validData.idNo = false
            this.validData.idNoTip = '身份证号不能为空'
          } else if (!reg.test(this.resetPassword.idNo)) {
            this.validData.idNo = false
            this.validData.idNoTip = '身份证号格式不正确'
          } else {
            this.validData.idNo = true
            this.validData.idNoTip = ''
          }
        } else if (field === 'password') {
          var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
          var reg = new RegExp(/^(?![^a-zA-Z]+$)(?!\D+$)/);
            
          if (!this.resetPassword.password) {
            this.validData.password = false
            this.validData.passwordTip = '密码不能为空'
            this.pwdStrong = []
            return false
          } 
          let pwdLength = this.resetPassword.password.length //密码长度
          if (!reg.test(this.resetPassword.password)||pwdLength<8) { //先判断是否包含数字+字母
            this.validData.password = false
            this.validData.passwordTip = '密码格式不正确，必须包含数字和字母的8-25位字符串'
            this.pwdStrong = []
            return false
          } else {
            if(!pattern.test(this.resetPassword.password)) {  //未包含特殊字符
              this.pwdStrong = ['low']
              if(pwdLength >= 14) {
                 this.pwdStrong = ['low','mid']
              }
            }else {  //包含特殊字符
              if(pwdLength >= 14) {
                this.pwdStrong = ['low','mid','high']
              }else {
                this.pwdStrong = ['low','mid']
              }
            }
          }
           this.validData.password = true        
           this.validData.passwordTip = ''
        } else if (field === 'surepw') {
          if (this.resetPassword.password !== this.resetPassword.surepw) {
            this.validData.surepw = false
            this.validData.surepwTip = '确认密码有误'
          } else {
            this.validData.surepw = true
            this.validData.surepwTip = ''
          }
        }else if(field === 'oldPassword') {
            if (!this.resetPassword.oldPassword) {
              this.validData.oldPassword = false
              this.validData.oldPasswordTip = '旧密码不能为空'
              return false
            } else {
              this.validData.oldPassword = true
              this.validData.oldPasswordTip = ''
            }
        }
      },
      _closeReset: function () {
        this.$emit('close')
      },
      _reqToReset: function () {
        if(this.showUserNo){
          if(!this.validData.numberE) {
            return false
          }
        }
        if(this.showOldPassword) {
          if(!this.validData.oldPassword) {
            return false
          }
        }
        if(this.showIdCard) {
          if(!this.validData.idNo) {
             return false
          }
        }
        this.demo_4 = _dx.Captcha(document.getElementById('c1'), {
          appId: '5c7bafe274b534f13ec3b614135a362e',
          style: 'popup',
          success:  (token) => {
            let resetAccountVO
            let url
            let password = crypto.createHash('md5').update(this.resetPassword.password).digest('hex')
            if(this.showIdCard) {
              url = '/api/users/certifications/update'
               resetAccountVO =  {
                userNo: this.resetPassword.numberE,
                password: password,
                idCardNo: this.resetPassword.idNo
              }
            }else {
              let oldPassword = crypto.createHash('md5').update(this.resetPassword.oldPassword).digest('hex')
              let accountType = ''
              url = '/api/account/modifyMyPassword'
              if(this.showUserNo) {  //非新生
                accountType = 'uniform'
              }else {
                accountType = 'freshman'
              }
               resetAccountVO =  {
                accountType: accountType,
                newPassword: password,
                oldPassword: oldPassword
              }
            }
            
            sAjax({
              url: url,
              type: 'post',
              data: resetAccountVO,
              success: (data) => {
                if (data.state) {
                  this._closeReset()
                  this.resetPassword.show = false
                  this.$toast('重置成功！')
                } else {
                  this.$toast(data.message)
                }
              }
            }).always(() => {
            this.demo_4.hide()
            // this.$waiting.close()
          })
          }
        })
        this.demo_4.show()
        
      },
      _reqResetPasswordWay: function() {
        //获取当前密码重置的方式
        sAjax({
          url: '/api/account/config/resetPasswordWay',
          type: 'get',
          data: {a: 1},
          success: (data) => {
            if (data.state) {
              this.passwordTypeValue = data.data.resetPasswordWay
              this.showPasswordModal = false
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      _reqEmail: function() {
        if(this.showUserNo){
          if(!this.validData.numberE) {
            return false
          }
        }
        sAjax({
          url: '/api/users/certifications/indistinctEmail',
          type: 'get',
          data: {userNo: this.resetPassword.numberE},
          success: (data) => {
            if (data.state) {
              this.emailCode = data.data
              this.showEmailBtn = true
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      _reqEmailCode: function() {
        if(this.showUserNo){
          if(!this.validData.numberE) {
            return false
          }
        }
        sAjax({
          url: '/api/users/certifications/resetPassword/sendMailCode',
          type: 'post',
          data: {userNo: this.resetPassword.numberE},
          success: (data) => {
            if (data.state) {
              this.ifEmailSend = true
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      _reqToResetTwo: function() {
        if(!this.validData.numberE) {
          return false
        }
        this.demo_5 = _dx.Captcha(document.getElementById('c1'), {
          appId: '5c7bafe274b534f13ec3b614135a362e',
          style: 'popup',
          success:  (token) => {
            
            // 判断邮箱验证码
            sAjax({
              url: '/api/users/certifications/resetPassword/judgeMailCode',
              type: 'post',
              data: {mailCode: this.resetPassword.emailCode,userNo: this.resetPassword.numberE},
              success: (data) => {
                if (data.state) {
                  let password = crypto.createHash('md5').update(this.resetPassword.password).digest('hex')
                  // 重置密码
                  sAjax({
                    url: '/api/users/certifications/resetPassword/byEmail',
                    type: 'post',
                    data: {mailCode: this.resetPassword.emailCode,newPassword:password,userNo: this.resetPassword.numberE},
                    success: (data) => {
                      if (data.state) {
                        this._closeReset()
                        this.resetPassword.show = false
                        this.$toast('重置成功！')
                      } else {
                        this.$toast(data.message)
                      }
                    }
                  })
                } else {
                  this.$toast(data.message)
                }
              }
            }).always(() => {
              this.demo_5.hide()
              // this.$waiting.close()
            })
          }
        })
        this.demo_5.show()
        
      }
    }
  }
</script>
<style lang="less">
@import url("../../assets/common.less");
@logincontentWidth: 600px;
@logincontentHeight: 554px;
.reset-cover {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2500;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.36);
  .logincontent {
    #c1 {
      z-index: 3500;
    }
    position: absolute;
    left: 50%;
    top: 40%;
    width: @logincontentWidth;
    height: @logincontentHeight;
    padding: 20px 10px;
    margin-top: -@logincontentHeight / 2;
    margin-left: -@logincontentWidth / 2;
    background: @frontColor;
    border-radius: 3px;
    -webkit-box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
      0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
      0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
    .form-group {
      margin-bottom: 18px;
      p {
        float: left;
        margin: 0;
        color: orangered;
        font-size: 13px;
      }
      i {
          display: inline-block;
          margin-left: 20px;
          font-style: normal;
          vertical-align: middle;
        }
       & > span {
         vertical-align: middle;
         display: inline-block;
         width: 70px;
         height: 15px;
        }
        span.pwd-red {
          background: #EA3105;
        }
        span.pwd-yellow {
          background: #FD8500;
        }
        span.pwd-green {
          background: #5DB949;
        }
        .userNo-input {
          display: flex;
          input {
            flex: 1;
          }
        }
    }
    .email-form-group {
      display: flex;
      align-items: center;
      padding: 20px;
      flex-wrap: wrap;
      background-color: rgba(247, 230, 204, 0.99);
      .email-text {
        flex: 1;
      }
      .email-success-tip {
        width: 100%;
        color: #0000FF;
      }
    }
    .emailResetPw {
      display: inline-block;
    }
  }
  .login-input {
    padding: 9px 16px;
    margin-right: 10px;
    font-size: 13px;
    color: #90a4ae;
    background: #eceff1;
    border: none;
    // box-shadow: none;
    outline: none;
    border-radius: 4px;
    box-shadow: 0 0 0 1000px #eceff1 inset;
    &.error {
      border: 1px solid orangered;
    }
  }
  .btn {
    padding: 8px 12px;
    font-size: 13px;
    border-radius: 4px;
    &.login-btn {
      color: #ffffff;
      background: #455a64;
    }
    &.primary-btn {
      color: #ffffff;
      background: #298df7;
    }
  }
}
@media screen and (max-width: 601px) {
  .reset-cover {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2500;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.36);
    .logincontent {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      padding: 20px 10px;
      margin-top: 0;
      margin-left: 0;
      background: @frontColor;
      border-radius: 3px;
      -webkit-box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
        0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
        0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
      .form-group {
        margin-bottom: 18px;
        p {
          float: left;
          margin: 0;
          color: orangered;
          font-size: 13px;
        }
        
      }
    }
    .login-input {
      padding: 9px 16px;
      margin-right: 10px;
      font-size: 13px;
      color: #90a4ae;
      background: #eceff1;
      border: none;
      // box-shadow: none;
      outline: none;
      border-radius: 4px;
      box-shadow: 0 0 0 1000px #eceff1 inset;
      &.error {
        border: 1px solid orangered;
      }
    }
    .btn {
      padding: 8px 12px;
      font-size: 13px;
      border-radius: 4px;
      &.login-btn {
        color: #ffffff;
        background: #455a64;
      }
      &.primary-btn {
        color: #ffffff;
        background: #298df7;
      }
    }
  }
}
</style>
