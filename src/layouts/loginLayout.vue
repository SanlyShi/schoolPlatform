<template>
  <div id="loginLayout" class="container-fluid login">
    <div class="bg_img" :style="imgStyle">
    </div>
    <div class="schoolInfo">
      <p class="text-muted">{{websiteName}}</p>
      <span class="text-muted-english">{{websiteNameEn}}</span>
    </div>
    <div class="contentBox">
      <div class="opacity">
      <div  :class="['schoolTxt',showText?'hideText':'']" >
        <!-- <h1>学校简介</h1> -->
        <pre v-html="content"></pre>
      </div>
      </div>
      
      <div class="loginTab" v-if="!loginWay">
          <i @click="showText = !showText" :class="['switch',showText?'active':'']"></i>
          <h1>Hi，请先选择登录方式</h1>
          <div class="buttonBox">
            <button class="btn primary-btn"  @click="loginWay = 'normal'" v-if="ixyLogin">学生工作平台</button>
            <button class="btn primary-btn"  @click="login(cas)" v-if="cas">统一身份认证</button>
            <button class="btn primary-btn"  @click="login(yiban)" v-if="yiban">易班授权{{loginType}}</button>
            <button class="btn primary-btn" style="margin-top: 35px;"   @click="loginWay = 'freshman'" v-if="freshmenLogin">学校新生{{loginType}}</button>
          </div>
          
      </div>
      <div class="loginBox" v-if="loginWay">
        <i @click="showText = !showText" :class="['switch',showText?'active':'']"></i>
        <!-- <div class="back-wrap">
            <i class="maticon back-icon" v-html="icons('arrow_back')" @click="loginWay = ''">arrow_back</i>
          </div> -->
        <div class="loginPart">
          <h1><span>{{loginWay == 'freshman'?'Hi，欢迎使用新生登录':'Hi，欢迎登录学生工作平台'}}</span></h1>
        <div class="loginForm">
          <div class="account">
            <input type="text" v-model="number" placeholder="账号" @keyup="_keyUp">
            <i :class="{'hasModel': number.length}"></i>
            <!-- <el-tooltip :offset="10" class="item" effect="dark" :content="tips" placement="bottom"> -->
              <!-- <em class="help"></em>   -->
            <!-- </el-tooltip> -->
            
          </div>
          <div class="password">
            <input type="password"  v-model="password" placeholder="密码" @keyup="_keyUp">
            <i :class="{'hasModel': password.length}"></i>
            
            <!-- <el-tooltip :offset="10" class="item" effect="dark" content="初始密码为身份证后6位" placement="bottom"> -->
              <!-- <em class="help"></em>   -->
            <!-- </el-tooltip> -->
          </div>

          <div :class="['loginBtn',password&&number?'success':'']">
            <el-button @click="login(null)">登   录</el-button>
          </div>
          <p class="forget" ><span v-if="loginWay =='normal'" @click="forget = true">忘记密码?</span>
            <el-tooltip class="item" effect="dark" :content="tips" placement="bottom">
              <em class="help"></em>
            </el-tooltip>
          </p>
          <div class="checkType">
            <span @click="login(yiban)" v-if="yiban">易班授权{{loginType}}</span>
            <el-divider direction="vertical" v-if="yiban"></el-divider>
            <span v-if="loginWay != 'freshman'&&freshmenLogin" @click="loginWay = 'freshman'" >学校新生{{loginType}}</span>
            <el-divider direction="vertical" v-if="loginWay != 'freshman'&&freshmenLogin"></el-divider>
            <span @click="login(cas)" v-if="cas">统一身份认证</span>
            <el-divider direction="vertical" v-if="cas"></el-divider>
            <span v-if="loginWay != 'normal'&&ixyLogin" @click="loginWay = 'normal'">学生工作平台</span>
          </div>
        </div>
        </div>
        
      </div>
    </div>
    <div class="login-head">
      <div class="col-md-4 login-name" v-if="!forIdentification">
        <p class="text-muted">{{websiteName}}</p>
        <p class="text-muted-english">{{websiteNameEn}}</p>
      </div>
      <div class="col-md-4 login-name" v-else>
        <p class="text-muted">请选择认证方式</p>
      </div>
      <div v-if="imgUrl" class="login_img_wrap">
        <img :src="imgUrl" alt="">
        <div class="water">
          <div class="box">
            <img src="../../mobile_static/image/water1.png" class="translateX">
            <img src="../../mobile_static/image/water2.png" class="translateX2">
            <img src="../../mobile_static/image/water3.png" class="translateX3">
            <!-- <img src="../../mobile_static/image/water1.png" class="translateX_1">
            <img src="../../mobile_static/image/water2.png" class="translateX2_1">
            <img src="../../mobile_static/image/water3.png" class="translateX3_1"> -->
          </div>
        </div>
      </div>
      <div class="col-md-8 login-way">
        <div class="login-tab" v-if="!loginWay">
          <button class="btn freshman-btn"  @touchstart="" @touchend=""  @click="loginWay = 'freshman'" v-if="freshmenLogin">新生{{loginType}}</button>
          <button class="btn primary-btn"  @touchstart="" @touchend=""  @click="login(cas)" v-if="cas">统一身份认证</button>
          <button class="btn primary-btn"  @touchstart="" @touchend=""  @click="login(yiban)" v-if="yiban">易班授权{{loginType}}</button>
          <button class="btn primary-btn"  @touchstart="" @touchend=""  @click="loginWay = 'normal'" v-if="ixyLogin">学生工作平台{{loginType}}</button>
        </div>
        <div class="freshman-login" v-if="loginWay">
          <div class="back-wrap">
            <i class="maticon back-icon" v-html="icons('arrow_back')" @click="loginWay = ''">arrow_back</i>
          </div>
          <input class="login-input" type="text" autocomplete="off" v-model="number" placeholder="账号" @keyup="_keyUp">
          <!-- <p>{{number}}</p> -->
          <input class="login-input" type="password" autocomplete="off" v-model="password" placeholder="密码" @keyup="_keyUp"  @touchstart="" @touchend="">
          <button class="btn login-btn" @click="login(null)">{{loginType}}</button>
          <a class="password-forget" @click="forget = true" v-if="loginWay === 'normal'">找回密码</a>
          <div class="gray_wrap" v-if="loginWay==='freshman'">
            <pre v-for="(tip,index) in tips.split(' ').filter(o=>{return o})" :key="index" v-html="tip"></pre>
            <!-- <p>· 默认密码为身份证号 <span class="c666">后六位</span>；</p> -->
          </div>
        </div>
      </div>
    </div>
    <!-- <div id="loginTips" class="row tips" v-if="loginWay">
      <pre class="col-md-offset-8 col-md-4" v-html="tips"></pre>
    </div> -->
    <!-- <div class="content" :class="loginWay?'marginTop0':'marginTop82px'">
      <div class="col-md-4 text-container">
        <pre v-html="content"></pre>
        <p class="text-right">COPYRIGHT © 2018-2021
          <br />
          ALL RIGHTS RESERVED / {{version}}
        </p>
      </div>
    </div> -->
<div id="c2"></div>
    <!-- 登录滑块验证 -->
    <!-- <el-dialog
        title="登录验证"
      :visible.sync="showCheck"
      append-to-body
      custom-class='showCheckDialog'
      width="35%"
      >
      
    </el-dialog> -->
    <footer>
      COPYRIGHT © 2018-2021 ALL RIGHTS RESERVED / {{version}}
          
    </footer>
    <reset-password  :number="number" @close="forget = false" v-if="forget"></reset-password>
  </div>
</template>

<script>
import Vue from 'vue'
const appData = require('../../package.json');
import $ from 'jquery'
import crypto, { constants } from 'crypto'
import { sAjax } from '../assets/utils/utils.js'
import { getNowSchoolId } from '../assets/utils/vueGetSchoolId.js'
import resetPassword from '../pages/login/forgetPassword.vue'
Vue.component('reset-password', resetPassword)
export default {
  inject: {
    windowObj: {
      default: null
    }
  },
  props: {
  },
  created: function () {
    this.version = appData.version
    this.schoolId = getNowSchoolId(window.location.href)
    this.forIdentification = !!this.$route.query.identification
    
        

    let url = ''
    if (this.$route.query.sys === 'enroll') {
      url = '/system/config?sys=enroll'
    } else if (this.$route.query.sys === 'fts') {
      url = '/system/config?sys=fts'
    } else if (this.$route.query.sys === 'ca') {
      url = '/system/config?sys=ca'
    } else {
      url = '/system/config'
    }
    sAjax({
      url: url,
      async: false,
      success: (result) => {
        if (result.state) {
          this.websiteName = result.data && result.data.websiteName || 'i校园学工平台'
          this.websiteNameEn = result.data && result.data.websiteNameEn || 'iSchool Education Platform'
          this.cas = result.data && result.data.cas
          this.yiban = result.data && result.data.yiban
          this.ixyLogin = result.data && result.data.ixyLogin
          this.freshmenLogin = result.data && result.data.freshmenLogin
          document.title = this.websiteName
        } else {
          this.$toast(result.message)
        }
      }
    })
    sAjax({
      url: '/firstPage/info',
      type: 'get',
      success: (data) => {
        if (data.state) {
          this.imgUrl = data.data ? (this.imageUrlPrefix + data.data.background) : ''
          this.imgStyle = {
            backgroundImage: `url(${this.imgUrl})`,
            backgroundSize:'cover',
            backgroundRepeat: 'no-repeat'
          }
          this.content = (data.data && data.data.content) || ''
          if(!this.content) {
            this.showText = true
          }
          this.tips = (data.data && data.data.tips) || ''
        }
      },
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Authorization",
        "Authorization": `schoolId=${this.schoolId}`
      },
    })
  },
  data: function () {
    return {
      showText: false,
      imgStyle: null,
      demo_4: null,
      showCheck: false,
      version: '',
      schoolId: '',
      websiteName: '',
      websiteNameEn: '',
      cas: false,
      yiban: false,
      ixyLogin: false,
      freshmanLogin: false,
      forget: false,
      forIdentification: false,
      loginWay: '',
      number: '',
      password: '',
      imgUrl: '',
      content: '',
      tips: ''
    }
  },
  computed: {
    loginType: function () {
      return this.forIdentification ? '认证' : '登录'
    }
  },
  mounted: function () {
    sessionStorage.removeItem("bread")
    sessionStorage.removeItem("nowRoute")
    sessionStorage.removeItem("activeRoute")
    var that = this
    this._resize()
  },
  methods: {
    _resize: function () {
      var h = $('body').height() - 637
      if(h>0) {
        $('.contentBox').css({
          marginTop: h/2
        })
      }
      let height = 500 - $('.buttonBox').height()
      $('.buttonBox').css({
            top: height/2
      })
      // console.log($('body').height())
      // $('.img-container').height(h)
      // $('.text-container').height(h)
    },
    _judgeImgPos: function () {
      var imgWidth, imgHeight, containerWidth, containerHeight
      $('#previewImg').removeAttr('style')
      setTimeout(() => {
        imgWidth = $('#previewImg').width()
        imgHeight = $('#previewImg').height()
        containerWidth = $('.img-container').width()
        containerHeight = $('.img-container').height()
        if (imgWidth > imgHeight) {
          var ml = -(imgWidth * containerHeight / imgHeight - containerWidth) / 2
          if (ml > 0) {
            $('#previewImg').addClass('shadow')
          } else {
            $('.img-container').addClass('shadow')
          }
          $('#previewImg').css('height', '100%')
          $('#previewImg').css('margin-left', ml + 'px')
        } else {
          var mt = -(imgHeight * containerWidth / imgWidth - containerHeight) / 2
          if (mt > 0) {
            $('#previewImg').addClass('shadow')
          } else {
            $('.img-container').addClass('shadow')
          }
          $('#previewImg').css('width', '100%')
          $('#previewImg').css('margin-top', mt + 'px')
        }
      }, 10);
    },
    _keyUp: function (event) {
      if (event.keyCode === 13) {
        this.login()
      }
    },
    login: function (loginUrl) {
      sessionStorage.removeItem("bread")
      var that = this
      if (!this.loginWay || loginUrl) {
        location.href = loginUrl
        return
      }
      if (!this.number) {
        return this.$toast('请输入账号')
      }
      if (!this.password) {
        return this.$toast('请输入密码')
      }
      // this.$waiting.show({
      //   container: '.login'
      // })
      var password = ''
      var loginUrl = ''
      
      // 开启登录验证
      // this.showCheck = true
      // setTimeout(() => {
        this.demo_4 = _dx.Captcha(document.getElementById('c2'), {
        appId: '5c7bafe274b534f13ec3b614135a362e',
        style: 'popup',
        success:  (token) => {
          password = crypto.createHash('md5').update(this.password).digest('hex')
          let loginWay = undefined
          if (this.loginWay === 'freshman') { //新生登录
            loginUrl = `/certification/freshman`
            loginWay = 'freshman'
          } else {  //工作平台登录
            loginUrl = `/users/certifications`
            loginWay = 'workPlatform'
          }
          sAjax({
            url: loginUrl,
            type: 'post',
            data: {
              userNo: this.number,
              password: password,
              token: token,
              loginWay: loginWay
            },
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Headers": "Authorization",
              "Authorization": 'schoolId=' + that.schoolId
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
            this.demo_4.hide()
            // this.$waiting.close()
          })
        }
      })
      this.demo_4.show()
      
    }
  },
  watch: {
    windowObj: {
      deep: true,
      handler: function (val) {
        this._resize()
      }
    }
  }
}
</script>
<style lang="less">
@import url("../assets/common.less");
@import url("../media/css/tableSearch.css");
@import url("../media/css/common.css");
@import url("../media/css/preview.css");
@headerHeight: 104px;
@toggleWidth: 200px;
@breadContainerHeight: 55px;
@logincontentWidth: 600px;
@logincontentHeight: 480px;
@keyframes hideTxt {
  from {width:750px;}
  to {width:0;}
}
.water {
  display: none;
  .box {
    position: absolute;
    height: 1rem;
    left: 0;
    right: 0;
    bottom: 0;
  }

  img {
    width: 20rem!important;
    height: 1rem;
    position: absolute;
    bottom: 0;
    left: 0;
    &.translateX3,&.translateX3_1{
      height: .7rem;
    }
  }

  .translateX {
    animation: translateX 5s ease infinite alternate;
  }

  .translateX2 {
    animation: translateX 6s ease 1s infinite alternate;
  }

  .translateX3 {
    animation: translateX 7s ease 1.5s infinite alternate;
  }
  .translateX_1 {
    animation: translateX_1 5s ease infinite alternate;
  }

  .translateX2_1 {
    animation: translateX_1 6s ease 1s infinite alternate;
  }

  .translateX3_1 {
    animation: translateX_1 7s ease 1.5s infinite alternate;
  }

  .imgcommon {
    transform: translateX(-750px);
  }

  @keyframes translateX {
    from {
      transform: translateX(-10rem);
      -webkit-transform: rotate(-10rem);
    }

    to {
      transform: translateX(0);
      -webkit-transform: rotate(0);
    }
  }
  @keyframes translateX_1 {
    from {
      transform: translateX(-9.999rem);
      -webkit-transform: rotate(-9.999rem);
    }

    to {
      transform: translateX(0);
      -webkit-transform: rotate(0);
    }
  }
}
.login_img_wrap {
  display: none;
}
#loginLayout {
  position: initial;
  .schoolInfo {
    position: relative;
    z-index: 2000;
    width: 1200px;
    margin: 0 auto;
    margin-top: 70px;
    p.text-muted {
      font-size: 34px;
      color: #fff;
    }
    .text-muted-english {
      color: #fff;
      font-weight: normal;
    }
  }
}
.login {
  // position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 11;
  margin: 0;
  padding: 0;
  // padding: 52px 56px 12px;
  background: #fff;
  input:-webkit-autofill {
    color: #90a4ae;
  }
  #login-to-test,
  #login-by-yiban {
    margin-top: 20px;
  }
  .login-input {
    // display: block;
    padding: 9px 30px;
    // width: 60%;
    margin-right: 10px;
    font-size: 13px;
    color: #90a4ae;
    background: #eceff1;
    border: none;
    // box-shadow: none;
    outline: none;
    border-radius: 4px;
    box-shadow: 0 0 0 1000px #eceff1 inset;
    border-radius: 0;
    &.error {
      border: 1px solid orangered;
    }
  }
  .login-head {
    display: none;
    overflow: hidden;
    .login-name,
    .login-way {
      padding: 0;
    }
  }
  .tips {
    padding: 0;
    pre {
      font-size: 13px;
      color: red;
      background-color: #fff;
      white-space: pre-line;
      border: none;
      overflow: hidden;
      border: none;
      float: right;
      padding: 0 0 0 52px;
      // width: 450px;
    }
  }
  .text-muted {
    margin-bottom: 4px;
    font-weight: normal;
    font-size: 24px;
    color: rgba(0, 0, 0, 0.77);
  }
  .text-muted-english {
    font-size: 16px;
    color: rgba(0, 0, 0, 0.4);
  }
  .freshman-login,
  .login-tab {
    float: right;
    .back-wrap{
      display: inline;
    }
    .password-forget {
      float: right;
      margin: 17px 17px 0 10px;
      cursor: pointer;
    }
  }

  .back-icon {
    margin-right: 24px;
    line-height: 1;
    font-size: 24px;
    color: #78909c;
    cursor: pointer;
  }
  .back-wrap { 
    margin-top: 20px;
    padding-left: 20px;
    i {
      color:#0F8DE9;
    } 
  }
  .btn {
    padding: 8px 12px;
    font-size: 13px;
    border-radius: 4px;
    &.freshman-btn {
      margin-right: 12px;
      color: #455a64;
      background: #eceff1;
    }
    &.login-btn {
      color: #ffffff;
      background: #455a64;
    }
    &.primary-btn {
      color: #ffffff;
      background: #298df7;
    }
  }
  .marginTop82px {
    margin-top: 82px;
  }
  .marginTop0 {
    margin-top: 0 !important;
  }
  .shadow {
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
    border-radius: 4px;
  }
  .img-container {
    position: relative;
    padding: 0;
    background-position: center center;
    background-size: cover;
    overflow: hidden;
    border-radius: 8px;
    // img {
    //   overflow: hidden;
    // }
  }
  .text-container {
    position: relative;
    max-height: 740px;
    font-size: 13px;
    color: rgba(0, 0, 0, 0.63);
    letter-spacing: 0.3px;
    line-height: 24px;
    padding: 0 0 0 42px;
    overflow: visible;
    pre {
      // position: absolute;
      top: 0;
      bottom: 40px;
      white-space: pre-line;
      // background: #fff;
      overflow: auto;
      border: none;
    }
    p {
      position: absolute;
      bottom: 0;
      right: 0;
      margin: 0;
      font-size: 13px;
      color: rgba(0, 0, 0, 0.36);
      letter-spacing: 0;
      line-height: 22px;
    }
    *::-webkit-scrollbar {
      width: 5px;
      height: 3px;
      background-color: #d0d0d0;
    }

    /*定义滚动条轨道 内阴影+圆角*/
    *::-webkit-scrollbar-track {
      background-color: transparent;
    }

    /*定义滑块 内阴影+圆角*/
    *::-webkit-scrollbar-thumb {
      background-color: #e8eaf6;
    }
  }
  .loginTab {
    width: 420px;
    position: relative;
    margin-left: 782px;
    .buttonBox {
      position: absolute;
      left: 70px;
    }
    button {
      display: block;
      margin: 0 auto;
      margin-bottom: 44px;
      padding: 0;
      font-weight: normal!important;
      width: 280px;
      background:#298DF7;
      box-shadow:0px 4px 8px 0px rgba(60,155,255,0.25);
      border-radius:4px;
      height: 40px;
    }
    button:last-child {
      margin-bottom:0;
    }
  }
}
@media screen and (max-width: 600px) {
  .schoolInfo {
    display: none;
  }
  .login {
    .contentBox {
      display: none;
    }
    .bg_img {
      display: none;
    }
    .login-head {
      display: block;
    }
    .gray_wrap {
      display: block;
    }
    .login-name {
      display: none;
    }
    &.container-fluid {
      padding: 0;
    }
    .logincontent {
      position: relative;
      left: 0;
      top: 0;
      margin: 0;
      width: 100%;
      height: 100%;
      padding: 20px 10px;
      h4,
      p {
        text-align: center;
      }
    }
    .login-way {
      float: left;
      width: 100%;
      margin-top: 30px;
      overflow: hidden;
    }
    #loginTips {
      display: none;
    }
    #loginTips.row {
      margin: 0;
    }
    .tips {
      pre {
        width: 100%;
        margin-top: 10px;
        padding: 0;
      }
    }
    .freshman-login,
    .login-tab {
      // height: 300px;
      padding-bottom: 10px;
      text-align: center;
      width: 100%;
      .back-wrap{
        width:100%;height:36px;overflow:hidden;
        display: block;
      }
      .password-forget {
        float: right;
        margin: 17px 17px 0 10px;
      }
      .btn {
        width: 8rem;
        height: 1.1733rem;
        margin: 0.6667rem auto 0;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0rem 0.08rem 0.1333rem 0rem rgba(60, 155, 255, 0.18);
        border-radius: 0.5867rem;
        border: 1px solid rgba(41, 141, 247, 1);
        font-size: 0.4533rem;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: rgba(41, 141, 247, 1);
        padding: 0;
        outline: none;
        line-height: 1.1733rem;
        text-align: center;
        &.login-btn {
          background: rgba(60, 155, 255, 1);
          color: white;
        }
        &:active {
          background: #167CE8;
          color: white;
        }
      }
    }
    .back-icon {
      float: left;
      margin-left: 0.98rem;
    }
    .login-input {
      // display: block;
      width: 8rem;
      margin: 0.5333rem auto 0;
      height: 0.9067rem;
      line-height: 0.9067rem;
      font-size: 0.4rem;
      color: #000;
      border: none;
      background: none;
      // box-shadow: none;
      outline: none;
      border-bottom: 1px solid #c0c4cc;
      box-shadow: 0 0 0 1000px white inset;
      &.error {
        border-bottom: 1px solid orangered;
      }
    }
    .btn {
      width: 100%;
      margin-top: 20px;
    }
    .content {
      display: none;
    }
  }
  #login-to-test,
  #login-by-yiban {
    width: 100%;
  }
}
@media screen and (max-width: 992px) {
  .water{
    display: block;
  }
  .img-container {
    display: none;
  }
  .login_img_wrap {
    display: block;
    width: 100%;
    background:white;
    position: relative;
    img {
      width: 100%;
    }
  }
  .text-container {
    width: 100%;
  }
  .tips {
    pre {
      width: 478px;
      margin-top: 10px;
      padding: 0;
    }
  }
}
.gray_wrap {
  margin-top: 0.4rem;
  display: none;
  pre {
    //width: 60%;
    font-size: 0.2933rem;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(144, 147, 153, 1);
    line-height: 0.5067rem;
    background: none;
    border: none;
    margin: 0;
    padding: 0;
    width: 8rem;
    text-align: left;
    margin: 0 auto;
    .c666 {
      color: #666;
    }
  }
}
#c2 {
  z-index: 1900;
  margin: 0 auto;
  padding-bottom: 20px;
}
.dx_captcha_basic_link,.dx_captcha_clickword_link {
  display: none!important;
}
.bg_img {
  position: absolute;
  width:100%;
  height: 100%;
  left: 0;
  top: 0;
}
.contentBox {
  position: relative;
  border-radius: 2px;
  // top:50%;
  // margin-top: -230px;
  width:  1200px;
  overflow: hidden;
  margin: 0 auto;
  font-weight: normal;
  height: 460px;
  i.switch {
      position: absolute;
      display: block;
      width: 18px;
      left: -18px;
      top:50%;
      margin-top: -25px;
      height: 50px;
      background:url('../../static/image/icon_unfold@2x.png') no-repeat;
      background-size: contain;
      cursor: pointer;
    }
    i.switch.active {
      background:url('../../static/image/icon_unfold@2x(3).png') no-repeat;
      background-size: contain;
      left: 0;
    }
    i.switch:hover {
      opacity: .7;
    }
  & .schoolTxt, & .loginTab,& .loginBox {
    height: 460px;
    background: rgba(255, 255, 255, 0.6);
    border-radius:2px;
    h1 {
      font-size: 18px;
      color: #0F8DE9;
      font-weight:500;
      line-height:25px;
      text-align: center;
      padding: 30px 0 40px 0;
      margin: 0;
    }
    .back-wrap {
      margin: 0;
      padding-top: 30px;
    }
  }
  .opacity {
    overflow: hidden;
    width: 782px;
    position: absolute;
    height: 460px;
  }
  .schoolTxt {
    overflow-y: auto;
    width: 750px;
    padding: 20px 21px 13px 19px;
    // margin-right: 32px;
    position: absolute;
    // transition-duration:  1s;
    transition: left 0.4s cubic-bezier(0.61,-0.19, 0.7,-0.11);
    top: 0;
    left: 0;
    pre {
        white-space: pre-line;
        padding: 9px;
        color:#303133;
        overflow: auto;
        border: none;
        background: transparent;
    }
  }
  .schoolTxt.hideText {
    left: 782px;
    // padding: 0!important;
    // width: 0!important;
    // height: 0;
    overflow: hidden;
     h1 {
      //  display: none;
     }
  }
  .loginBox {
    width: 420px;
    position: relative;
    margin-left: 782px;
    .loginForm {
      padding: 0 70px 0 70px;
      &>div {
        width: 280px;
        height: 34px;
        background: #fff;
        border-radius:4px;
        position: relative;
        margin-bottom:24px;
        input {
          border: none;
          outline: none;
          width: 280px;
          height: 34px;
          line-height: 34px;
          padding: 0 40px;
          border-radius:4px;
          background: #fff;
        }
        i {
          position: absolute;
          top: 0;
          left: 10px;
          display: inline-block;
          width: 20px;
          height:20px;
          left: 12px;
          margin-top: 6px;
          
        }
        em {
          top: 0;
          position: absolute;
          display: inline-block;
          width: 18px;
          height: 18px;
          right: 12px;
          margin-top: 7px;
          background:url('../../static/image/icon_shuoming@2x.png') no-repeat;
          background-size: contain;
          cursor: pointer;
        }
        em:hover {
          background:url('../../static/image/icon_shuoming_hover@2x.png') no-repeat;
          background-size: contain;
        }
        }
        .loginBtn {
          height: 34px;
          background: transparent;
          margin-top: 50px;
          margin-bottom:14px;
          button {
            display: block;
            width: 100%;
            // letter-spacing:10px;
            padding: 0;
            height: 34px;
            line-height: 34px;
            text-align: center;
            color: #fff;
            font-size: 14px;
            font-weight: normal;
            border: none;
            background: rgba(41,141,247,0.6);
          } 
          
        }
        .loginBtn.success {
          button {
             background: rgba(41,141,247,1);
          }
        }
        p.forget {
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: #7286A2;
          margin-top: 12px;
          em {
            display: inline-block;
            width: 18px;
            height: 18px;
            background:url('../../static/image/icon_shuoming_hover@2x.png') no-repeat;
            background-size: contain;
            cursor: pointer;
          }
          //   em:hover {
          //   background:url('../../static/image/icon_shuoming_hover@2x.png') no-repeat;
          //   background-size: contain;
          // }
        }
        .checkType {
          background: transparent;
          width: 300px;
          display: flex;
          align-items: center;
          text-align: center;
          margin-top: 70px;
          height: 20px;
          .el-divider--vertical {
            height: 15px;
            background-color: #298DF7;
            opacity: .6;
            margin: 0 10px;
          }
          .el-divider--vertical:last-child {
            display: none;
          }
          span {
            cursor: pointer;
            flex:1;
            color: #298DF7;
            display: inline-block;
            line-height: 20px;
            text-align: center;
            // border-right: 0.5px solid #298DF7;
          }
          span:last-child {
            border: none;
          }
        }
      }
      .account {
        i {
          background: url('../../static/image/icon_login_username@2x.png') no-repeat;
          background-size: contain;
        }
        input:focus + i, input:active + i,i.hasModel{
          background: url('../../static/image/icon_login_username_ing@2x.png') no-repeat;
          background-size: contain;
        }
      }
      .password {
        i {
          background: url('../../static/image/icon_login_password@2x.png') no-repeat;
          background-size: contain;
        }
        input:focus + i, input:active + i,i.hasModel{
          background: url('../../static/image/icon_login_password_ing@2x.png') no-repeat;
          background-size: contain;
        }
      }
    }
}
footer {
  position: fixed;
  width: 100%;
  left: 0;
  bottom: 0;
  text-align: center;
  height: 32px;
  line-height: 32px;
  background:rgba(67,78,116,.6);
  color: #fff;
  font-weight: normal;
}
</style>
