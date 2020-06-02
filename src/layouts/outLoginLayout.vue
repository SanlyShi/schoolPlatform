<template>
  <div id="outLogin-page">
    <div class="form" v-if="!redirectApply && !forgetWord">
      <h3 style="margin-bottom:42px">网上报名</h3>
      <el-input class="pd" v-model="cardNumOrEmail" placeholder="请输入身份证号码或邮箱" clearable></el-input>
      <el-input class="pd" style="margin-top: 12px;" v-model="password" placeholder="请输入密码" show-password clearable></el-input>
      <button style="font-size: 17px;" class="btn submit pdB" @click="_login" :disabled="!cardNumOrEmail||!password">登录</button>
      <p class="pd ppd">
        <span @click="redirectApply = true" style="color:#298DF7">立即注册</span>&nbsp;&nbsp;|&nbsp;&nbsp;
        <span @click="toForget">忘记密码</span>
      </p>
    </div>
    <div class="form-apply" v-if="redirectApply">
      <p class="title">
        <i style="display:inline-block;position:absolute;left:16.5px" class="el-icon-arrow-left" @click="back"></i>
        <span class="de">新用户注册</span>
      </p>
      <p class="mes">请完善用户信息，才可正常使用</p>
      <el-form
        class="myform"
        label-position="top"
        :model="registerModel"
        :rules="rules"
        ref="ruleForm"
        @submit.native.prevent
        label-width="80px"
      >
        <el-form-item label="真实姓名" prop="realName">
          <el-input placeholder="请输入" v-model="registerModel.realName" clearable></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="idCardNumber">
          <el-input placeholder="请输入" class="idCard" v-model="registerModel.idCardNumber" clearable></el-input>
        </el-form-item>
        <!-- </el-form> -->
        <p class="mes">请填写邮箱用于登录</p>
        <!-- <el-form class="myform" label-position="top" :model="registerModel" :rules='rules' label-width="80px"> -->
        <el-form-item label="邮箱" prop="email">
          <el-input placeholder="请输入" v-model="registerModel.email" clearable></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="verifyNumer">
          <el-input placeholder="请输入" v-model="registerModel.verifyNumer" clearable>
           <template slot="append">
             <el-button
              class="code"
              type="primary"
              :disabled="registerText=='获取验证码'?false:true"
              @click="sendVerifyCode('register','registerText')"
            >{{registerText}}</el-button>
           </template>
          </el-input>
          <!-- <el-button
            class="verify-btn"
            type="primary"
            :disabled="registerText=='获取验证码'?false:true"
            @click="sendVerifyCode('password','registerText')"
          >{{registerText}}</el-button> -->
        </el-form-item>
        <el-form-item label="设置的登录密码" prop="setPassWord">
          <el-input placeholder="请输入" class="idCard" v-model="registerModel.setPassWord" clearable></el-input>
        </el-form-item>
        <!-- </el-form> -->
        <p class="mes">请完善用户信息，才可正常使用</p>
        <!-- <el-form class="myform" label-position="top" label-width="80px"> -->
        <el-form-item label="家庭地址" prop="address">
          <el-input placeholder="请输入" v-model="registerModel.address" clearable></el-input>
        </el-form-item>
        <el-form-item label="紧急联系人" prop="conectPerson">
          <el-input placeholder="请输入" v-model="registerModel.conectPerson" clearable></el-input>
        </el-form-item>
        <el-form-item label="关系">
          <el-input placeholder="请输入" v-model="registerModel.relationWithMe" clearable></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="connectPhone">
          <el-input placeholder="请输入" class="idCard" v-model="registerModel.connectPhone" clearable></el-input>
        </el-form-item>
      <!-- </el-form> -->
      <p class="mes">在校信息填写</p>
      <!-- <el-form class="myform" label-position="top" label-width="80px" @submit.native.prevent> -->
        <el-form-item label="所在中学" prop="everSchool">
          <el-input placeholder="请输入" v-model="registerModel.everSchool" clearable></el-input>
        </el-form-item>
        <!-- <el-form-item label="成绩排名">
          <el-input placeholder="请输入" v-model="registerModel.ranking" clearable></el-input>
        </el-form-item>
        <el-form-item label="荣誉信息">
          <el-input
            placeholder="请输入"
            v-for="(item,index) in honourList"
            :key="index"
            v-model="honourList[index]"
            clearable
          ></el-input>
          <i class="el-icon-circle-plus-outline" @click="addnewItem"></i>
        </el-form-item> -->
        <button class="btn save pdB" @click="applyTo">注册</button>
      </el-form>
    </div>
    <div class="form-missword" v-if="forgetWord">
      <p class="title">
        <i class="el-icon-arrow-left" @click="turnBack"></i>
        <span class="de">设置新密码</span>
      </p>
      <el-input
        v-if="!sendCodeBool"
        class="pd"
        v-model="forgetNum"
        placeholder="请输入身份证号码或邮箱"
        clearable
      ></el-input>
      <el-input
        v-if="!sendCodeBool"
        class="pd"
        v-model="forgetVerifyNumer"
        placeholder="请输入验证码"
      ></el-input>

      <el-input v-if="sendCodeBool" class="pd" v-model="newPassWord" placeholder="输入新密码" clearable></el-input>
      <el-input
        v-if="sendCodeBool"
        class="pd"
        v-model="repeatNewPassWord"
        placeholder="再次输入新密码"
        show-password
      ></el-input>

      <el-button
        v-if="!sendCodeBool"
        class="verify-btn"
        type="primary"
        :disabled="resetText=='获取验证码'?false:true"
        @click="sendVerifyCode('resetPassword','resetText')"
      >{{resetText}}</el-button>
      <button class="btn submit pdB" v-if="!sendCodeBool" @click="next">下一步</button>
      <!-- <p class="pd ppd" v-if="!sendCodeBool">验证码将发送至您的邮箱，请注意查收</p> -->

      <button class="btn submit pdB" v-if="sendCodeBool" @click="finishNewWord">完成</button>
      <p class="pd ppd" v-if="sendCodeBool">新密码应不少于8位，且不可与之前设置过得密码重复。</p>
    </div>
    <div class="bottom" v-if="!redirectApply && !forgetWord">
      <img src="../assets/img/outLogin-bottom.png" alt />
    </div>
  </div>
</template>
<script>
import { sAjax } from '../assets/utils/utils';
import crypto, { constants } from 'crypto'
export default {
  data() {
    const checkPhone = (rule, value, callback) => {
      var isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/; //手机号码
      var isMob = /^0?1[3|4|5|8][0-9]\d{8}$/; // 座机格
      if (!value) {
        return callback(new Error("请输入联系方式"));
      }
      if (!isMob.test(value) && !isPhone.test(value)) {
        return callback(new Error("请输入正确的手机号码或者电话号码"));
      }
      callback();
    };
    const checkLength = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入正确的18位身份证号码"));
      }
      if (value.length != 18 || isNaN(value)) {
        return callback(new Error("请输入正确的18位身份证号码"));
      }
      callback();
    };
    const checkPassword = (rule, value, callback) => {
      let pwdRegex = new RegExp("(?=.*[0-9])(?=.*[a-zA-Z])");
      let pws = /^[0-9a-zA-Z]+$/g
      if (!value) {
        return callback(new Error("请输入密码"));
      }
      if (value.length < 8) {
        return callback(new Error("请输入8位以上密码"));
      }
      if (!pwdRegex.test(value)) {
        return callback(new Error("密码由数字与字母组合"));
      }
      if (!pws.test(value)) {
        return callback(new Error("密码由数字与字母组合"));
      }
      callback();
    };
    return {
      curStep: 'login',//当前步骤（login,forget,setPwd)
      registerModel: {
        cardNumOrEmail: "",
        password: "",
        realName: "",
        idCardNumber: "",
        email: "",
        verifyNumer: "",
        setPassWord: "",
        address: "",
        conectPerson: "",
        relationWithMe: "",
        connectPhone: "",
        everSchool: "",
        ranking: ""
      },
      userName:"",
      mailCode: '',
      rules: {
        cardNumOrEmail: [{ required: true }],
        realName: [
          { required: true, message: "请输入您的真实姓名", trigger: "blur" }
        ],
        idCardNumber: [
          { required: true, validator: checkLength, trigger: "blur" }
        ],
        email: [
          {
            required: true,
            type: "email",
            message: "请输入正确的邮箱格式",
            trigger: "blur"
          }
        ],
        verifyNumer: [
          { required: true, message: "请输入验证码", trigger: "blur" }
        ],
        everSchool: [
          { required: true, message: "请输入所在中学", trigger: "blur" }
        ],
        setPassWord: [
          { required: true, validator: checkPassword, trigger: "blur" }
        ],
        conectPerson: [
          { required: true,message: "请输入紧急联系人", trigger: "blur" }
        ],
        address: [
          { required: true,message: "请输入家庭地址", trigger: "blur" }
        ],
        connectPhone: [
          {
            required: true,
            validator: checkPhone,
            trigger: "blur"
          }
        ]
      },
      cardNumOrEmail: "",
      password: "",
      realName: "",
      idCardNumber: "",
      email: "",
      verifyNumer: "",
      setPassWord: "",
      address: "",
      conectPerson: "",
      relationWithMe: "",
      connectPhone: "",
      everSchool: "",
      ranking: "",
      forgetNum: "",
      forgetVerifyNumer: "",
      redirectApply: false,
      forgetWord: false,
      honourList: ["荣誉信息1", "荣誉信息2"],
      registerText: "获取验证码",
      resetText: '获取验证码',
      sendCodeBool: false,
      newPassWord: "",
      repeatNewPassWord: ""
    };
  },
  methods: {
    toForget() {
      this.forgetWord = true;
      this.curStep='forget';
    },
    _login(){

      var that =this
      let password = ''
      // password = this.password
      password = crypto.createHash('md5').update(this.password).digest('hex')
      sAjax({
        url: '/certification/outLogin',
        type: 'post',
        data: {
          userNo: this.cardNumOrEmail,
          password: password
        },
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Authorization",
          "Authorization": 'schoolId=' + this.$route.params.schoolId
        },
        success: function (data) {
          // that.closeWaiting()
          if (data.state) {
            location.href = data.data.redirect
          } else {
            that.$toast(data.message)
          }
          // html.replace(/class="ql-align-center"/gi, 'style="text-align:center"')
        },

      }).always(() => {
        // this.$waiting.close()
      })
    },
    turnBack() {
      if(this.curStep == 'setPwd') {
        this.sendCodeBool=false
        this.curStep = 'forget'
      }else {
        this.forgetWord = false;
        this.redirectApply = false
      }
    },
    back() {
        this.redirectApply = false
        this.forgetWord = false

    },
    addnewItem() {
      this.honourList.push("");
    },
    sendVerifyCode(type,textName) {
      let mail = ''
      if(type == 'register') {
        if(!this.registerModel.email) {
          return  this.$toast('请先输入邮箱')
        }
        mail = this.registerModel.email
      }
      if(type == 'resetPassword') {
        if(!this.forgetNum) {
          return this.$toast('请先输入邮箱')
        }
        mail = this.forgetNum
      }

      let url =`/api/archives/account/${type}/mailVerification`
      let mailVerificationInputDTO = {
        userNoOrEmail: mail
      }
      sAjax({
        url: url,
        type: 'post',
        data: mailVerificationInputDTO,
        success: (data) => {
          if(data.state) {
             this.$toast('验证码已发至邮箱')
             this[textName] = 60 + "s";
              let time = 60;
              var that = this;
              let m = setInterval(() => {
                time = time - 1;
                this[textName] = time + "s";
                if (time == 0) {
                  this[textName] = "获取验证码";
                  clearInterval(m);
                }
              }, 1000);
          }else {
            this.$toast(data.message)
          }
        }
      })

    },
    next() {
      if(!this.forgetNum) {
        return this.$toast('请输入身份证或邮箱')
      }
      if(!this.forgetVerifyNumer) {
        return this.$toast('请输入验证码')
      }

      let url = '/api/archives/account/judgeResetPasswordMailCode'
      let resetPasswordVO = {
        emailOrUserNo: this.forgetNum,
        mailCode: this.forgetVerifyNumer
      }
      sAjax({
        url: url,
        type: 'post',
        data:  resetPasswordVO,
        success: (data) => {
          if(data.state) {
            this.userName = this.forgetNum
            this.mailCode = this.forgetVerifyNumer
            this.forgetNum = ''
            this.forgetVerifyNumer = ''
            this.curStep = 'setPwd'
            this.sendCodeBool = true;
          }else {
            this.$toast(data.message)
          }
        }

      })

    },
    finishNewWord() {
      let pwdRegex = new RegExp("(?=.*[0-9])(?=.*[a-zA-Z])");
      let pws = /^[0-9a-zA-Z]+$/g
      if(!this.newPassWord) return this.$toast('请输入新密码')
      if(!this.repeatNewPassWord) return this.$toast('请再次输入新密码')
      if(this.newPassWord.length<8) return this.$toast('新密码应不小于8位')
      if(!pws.test(this.newPassWord) || !pwdRegex.test(this.newPassWord)) return this.$toast('密码由数字与字母组合')
      if(this.newPassWord !== this.repeatNewPassWord) return this.$toast('2次输入的密码不一致')
      let  url = '/api/archives/account/resetPassword'
      let pw = crypto.createHash('md5').update(this.newPassWord).digest('hex')
      let accountDTO = {
        newPassword: pw,
        mailCode: this.mailCode,
        emailOrUserNo: this.userName
      }
      sAjax({
        url: url,
        data: accountDTO,
        type: 'post',
        success: (data) => {
          if(data.state) {
            this.$toast('重置成功！')
            this.forgetWord = false;
            this.sendCodeBool = false;
            this.newPassWord = '';
            this.password = '';
            this.repeatNewPassWord = ''
          }else {
             this.$toast(data.message)
          }
        }
      })

    },
    applyTo() {
      this.$refs.ruleForm.validate((vali) => {
        if(vali) {
          let data = this.registerModel;
          let obj = {
            name: data.realName,
            idCard: data.idCardNumber,
            homeAddress: data.address,
            familyContact: data.conectPerson,
            familyTel: data.connectPhone,
            school: data.everSchool,
            email: data.email,
            password: data.setPassWord,
            verificationCode: data.verifyNumer
          }
          let url = '/api/archives/account/register'
          sAjax({
            url: url,
            type: 'post',
            data: obj,
            success: (info) => {
              if(info.state) {
                this.$toast('注册成功！');
                this.$refs.ruleForm.resetFields();
                this.$refs.ruleForm.clearValidate();
                this.redirectApply = false;
              }else {
                 this.$toast(info.message);
              }
            }
          })
        }
      })
    }
  },
};
</script>
<style lang="less" >
#outLogin-page {
  // position: absolute;
  width: 100%;
  left: 0;
  top: 0;
  height: 100%;
  background: #ffffff;
  .verify-btn {
      position: absolute;
      right: 40px;
      top: 52px;
    }
  .form-missword {
    position: absolute;
    .title {
      position: fixed;
      z-index: 100;
      top: 0;
      left: 0;
      width: 100%;
      background: #ffffff;
      padding: 14px 10px;
      text-align: center;
      i {
        font-size: 22px;
        float: left;
      }
      .de {
        display: inline-block;
        margin-left: -22px;
      }
    }
    padding: 0 1rem 0 1rem;
    margin: 2.8rem 0 0 0;
    width: 10rem;
    h3 {
      font-weight: bold;
    }

    .submit {
      padding: 8px;
      width: 100% !important;
      background: #4091ff !important;
      color: #fff !important;
    }
    .pd {
      margin: 8px 0 0 0;
    }
    .pdB {
      margin: 45px 0 0 0;
    }
    .el-input {
      input {
        border-radius: 0;
        border-left: none;
        border-top: none;
        border-right: none;
        padding-left: 0;
      }
    }
    .ppd {
      text-align: center;
      font-size: 12px;
      color: #909399;
      //   span:hover {
      //     color: #4091ff;
      //   }
    }
  }
  .form {
    padding: 0 1rem 0 1rem;
    margin: 2.8rem 0 0 0;
    width: 10rem;
    h3 {
      font-weight: bold;
    }
    .submit {
      padding: 12px 8px;
      width: 100% !important;
      background: #4091ff !important;
      color: #fff !important;
    }
    .pd {
      margin: 8px 0 0 0;
    }
    .pdB {
      margin: 45px 0;
    }
    .el-input {
      input {
        border-radius: 0;
        border-left: none;
        border-top: none;
        border-right: none;
        padding-left: 0;
      }
    }
    .ppd {
      text-align: center;
      color: #909399;
      span:hover {
        color: #4091ff;
      }
    }
  }
  .form-apply {
    background: #fff;
    height: 100%;
    .save {
      padding: 8px;
      width: 100% !important;
      background: #4091ff !important;
      color: #fff !important;
    }
    .pdB {
      margin: 45px 0;
    }
    margin-top: 52px;
    padding: 0 0.4rem 0 0.4rem;
    font-size: 17px;
    p {
      margin: 0;
    }
    .title {
      position: fixed;
      z-index: 100;
      top: 0;
      left: 0;
      width: 100%;
      background: #ffffff;
      padding: 14px 0;
      text-align: center;
      i {
        font-size: 22px;
        float: left;
      }
      .de {
        display: inline-block;
        margin-left: -22px;
      }
    }
    .mes {
      margin-left: -0.4rem;
      margin-right: -0.4rem;
      padding: 10px 0 10px 0.4rem;
      background: #f4f5f7;
      color: #909399;
      font-size: 14px;
    }
    .myform {
      .el-form-item {
        margin-bottom: 0;
        // border-bottom: solid 1px #f4f5f7;
        margin-top: 10px;
        .el-form-item__label {
          font-weight: normal;
          padding: 0;
          margin: 0;
          line-height: 12px;
          color: #909399;
        }
        .el-form-item__content {
          // height: 35px;
          .el-input {
            height: 35px;
            input {
              border-radius: 0;
              border-left: none;
              border-top: none;
              border-right: none;
              padding-left: 0;
              height: 35px;
              border-color: #F4F5F7 !important
            }
          }
        }
        .idCard {
          input {
            border-radius: 0;
            border: none;
            padding-left: 0;
            height: 35px;
          }
        }
      }
    }
    .el-form-item__error {
      padding-top: 0;
      position: inherit;
    }
  }
  .logo {
    position: absolute;
    bottom: 3.41rem;
    height: 0.8rem;
    width: 10rem;
    text-align: center;
    img {
      height: 100%;
      width: 3.44rem;
    }
  }
  .bottom {
    z-index:1;
    width: 10rem;
    // position: absolute;
    // bottom: 0;
    // z-index: -2;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .el-input-group__append {
    width: 2.1333rem;
    height: 0.72rem;
    border-radius:0.0533rem;
    border:1px solid rgba(41,141,247,1);
    box-sizing: border-box;
    text-align: center;
  }
  button.code {
    background: #fff;
    color: #419DFF;
    padding: 0;
    width: 2.1333rem;
    height: 0.72rem;
    border: none;
  }
  .el-button--primary.is-plain:focus, .el-button--primary.is-plain:hover {
    background: #fff;

  }
}
</style>
