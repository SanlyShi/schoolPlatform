<template>
  <v-import v-bind="importParams" @backParentPage="importUsers = false" v-if="importUsers">
  </v-import>
  <div id="freshmanManage-page" class="container-fluid" v-else>
    <div class="row text-center">
      <v-table :title="translate.tableTitle" :url="url" pagesize="10" idField="id" :columns="columns" :multiple="false" :order="true" :search="true">
        <div slot="btn-group" class="btn-group pull-right" role="group">
          <button type="button" class="btn add clearBtnBorder" @click="resetPasswordWay">密码设置</button>
          <button type="button" class="btn add clearBtnBorder" @click="importUsers = true">{{translate.import}}</button>
        </div>
      </v-table>
    </div>
    <v-modal :show="showEditModal" effect="fade" width="500">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">编辑</h5>
      </div>
      <!-- 新建选项 -->
      <div slot="modal-body" class="modal-body">
          <div class="form-group class-committee-group">
            <label class="classCommittee-text">用户名:</label>
            <input type="text" class="optionInput" disabled="true" v-model="nowUserName">
          </div>
          <div class="form-group class-committee-group">
            <label class="classCommittee-text">账号状态:</label>
            <v-select style="width:70%;"  :options="statusList" v-model="nowUserStatus" options-value="id" options-label="name" ></v-select>
          </div>
          <div class="setBtn" v-show="!showPwd">
            <span @click="showPwd = true">修改密码</span>
          </div>
          <div class="setPassword" v-if="showPwd">
              <div class="form-group class-committee-group">
                <label class="classCommittee-text">新的密码:</label>
                <input type="text" class="optionInput" @change="_check('password')" placeholder="8-25位，必须包含数字和字母" :class="!valiError?'':'error'" v-model="password">
                <p v-if="valiError">{{passwordTip}}</p>
              </div>
              <div class="form-group class-committee-group pwdStrong" v-if="pwdStrong.length">
                <span class="pwd-red"></span><span class="pwd-yellow" v-show="pwdStrong.length > 1"></span><span class="pwd-green" v-show="pwdStrong.length > 2"></span>
                <em>{{pwdStrong.length==1?'弱':pwdStrong.length==2?'中':'强'}}</em>
              </div>
              <div class="form-group class-committee-group">
                <label class="classCommittee-text">再次确认密码:</label>
                <input type="text" class="optionInput" :class="!valiErrorSure?'':'error'" @change="_check('passwordConfirm')" v-model="passwordConfirm">
                <p v-if="valiErrorSure">{{surepwTip}}</p>
              </div>
            </div>
          
          <div class="modal-body-content">
          </div>
        </div>
      <!-- 模态框的“取消”和“提交” -->
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="cancle">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="submit">确定</button>
      </div>
    </v-modal>
    <!-- 修改密码方式弹框 -->
    <v-modal :show="showPasswordModal" effect="fade" width="500">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">密码设置</h5>
      </div>
      <!-- 新建选项 -->
      <div slot="modal-body" class="modal-body">
        <div class="form-group class-committee-group">
          <label class="classCommittee-text password-text">忘记密码设置</label>
        </div>
        <div class="form-group class-committee-group">
          <label class="classCommittee-text password-text">账号验证:</label>
          <label class="radio-inline">
            <input class="radio-input" type="radio" name="passwordTypeValue" value="idCard" v-model="passwordTypeValue" checked> 身份证
          </label>
          <label class="radio-inline">
            <input class="radio-input" type="radio" name="passwordTypeValue" value="email" v-model="passwordTypeValue"> 邮箱
          </label>
        </div>
        <div class="tip-text">使用邮箱验证，若用户未填写邮箱数据在，则无法自行重置密码</div>
      </div>
      <!-- 模态框的“取消”和“提交” -->
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="showPasswordModal = false">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="passwordModalSubmit">确定</button>
      </div>
    </v-modal>
  </div>
</template>

<script>
import Vue from 'vue'
import { sAjax, translation } from '../../assets/utils/utils.js'
import crypto from 'crypto'
export default {
  data: function () {
    return {
      userInfo: '',
      showPwd: false,
      valiError: false,
      valiErrorSure: false,
      passwordTip: '',
      surepwTip: '',
      pwdStrong: [],//密码包含的强度 （low/mid/high 1个表示low 2个mid 3个high
      statusOption: [{
        id: true,
        name: '禁用'
      }, {
        id: false,
        name: '开启'
      }],
      statusList: [{
        id: 1,
        name: '禁用'
      }, {
        id: 2,
        name: '开启'
      }],
      nowUserStatus: '',
      nowUserName: "",
      passwordConfirm: '',
      password: '',
      showEditModal: false,
      columns: [],
      baseUrl: '/table-data/users/certifications',
      ts: new Date(),
      lang: 'zh-cn',
      importUsers: false,
      importParams: {
        parentPageTitle: '',
        downloadTemplateUrl: '',
        downloadErrorTemplateUrl: '',
        checkTemplateUrl: '',
        templateName: '',
        importBtnType: null
      },
      showPasswordModal: false,
      passwordTypeValue: 'idCard',
    }
  },
  computed: {
    translate: function () {
      return translation(this.lang).userCertification
    },
    url: function () {
      return `${this.baseUrl}?ts=${this.ts}`
    }
  },
  created: function () {
    var that = this
    var la = localStorage.getItem('lang')
    if (translation(la)) {
      this.lang = la
    }
    this.columns = [{
      id: 'userNo',
      title: this.translate.account,
      className: 'text-left',
      hidden: false,
      search: {
        type: 'input',
        data: {
          autoFocus: true
        }
      }
    }, 
    // {
    //   id: 'password',
    //   title: this.translate.password,
    //   className: 'text-left',
    //   hidden: false
    // },
    {
        id: 'disabled',
        title: '状态',
        className: 'text-left',
        hidden: false,
        search: {
        type: 'select',
        data: {
          options: this.statusOption,
          optionsLabel: 'name',
          optionsValue: 'id'
        }
        
      },
        formatter: function (record, index) {
          if (record.disable) {
            return '禁用'
          } else {
            return '开启'
          }
        }
      }, 
    {
      id: "opt",
      className: "text-center",
      title: "操作",
      width: 120,
      hidden: false,
      formatter: function (re) {
        // var  that =this
        var jie = {
            tag: "a",
            // 编辑
            text: "编辑",
            className: "opt-btn",
            // 点击编辑将该字段数据显示到modal中
            callback: function (record, index) {
              that.showEditModal = true
              that.nowUserName = record.userNo
              that.userInfo = record
              if(record.disable){
                that.nowUserStatus = 1
              }
              else{
                that.nowUserStatus = 2
              }
              // that.nowUserStatus  =record.disable
              // var thss = that
              // sAjax({
              //   url: `/api/users/certifications/forbidden/${record.userNo}`,
              //   dataType: "json",
              //   type: 'post',
              //   success: data => {
              //     if(data.state){
              //       that.$toast("禁用成功")
              //     }
              //     else{
              //       that.$toast(data.message)
              //     }
              //   }
              // });
            }
          }
          // var jin = {
          //   tag: "a",
          //   // 编辑
          //   text: "解禁",
          //   className: "opt-btn",
          //   // 点击编辑将该字段数据显示到modal中
          //   callback: function (record, index) {
          //     sAjax({
          //       url: `/api/users/certifications/unForbidden/${record.userNo}`,
          //       dataType: "json",
          //       type: 'post',
          //       success: data => {
          //         if(data.state){
          //           that.$toast("解禁成功")
          //         }
          //         else{
          //           that.$toast(data.message)
          //         }
          //       }
          //     });
          //   }
          // }
          
          var arr = []
          // if(re.disable){
            // arr.push(jin)
          // }
          // else{
            arr.push(jie)
          // }
          return arr
      }
    }
    ]
    this.importParams = {
      parentPageTitle: this.translate.tableTitle,
      downloadTemplateUrl: '/users/certifications/import/template',
      downloadErrorTemplateUrl: '/users/certifications/import/error',
      checkTemplateUrl: '/users/certifications/import/check',
      templateName: this.translate.templateExcelName,
      importBtnType: [{
        name: this.translate.overrideImport,
        url: '/users/certifications/import',
        method: 'post',
        isShowBtn: true,
        success: (data) => {
          if (data.state) {
            this.ts = new Date()
          }
        }
      }]
    }
  },
  methods: {
    resetPasswordWay() {
      //获取当前密码重置的方式
      sAjax({
        url: '/api/account/config/resetPasswordWay',
        type: 'get',
        data: {a: 1},
        success: (data) => {
          console.log(data);
          if (data.state) {
            this.passwordTypeValue = data.data.resetPasswordWay
            this.showPasswordModal = true
          } else {
            this.$toast(data.message)
          }
        }
      })
    },
    passwordModalSubmit() {
      // 修改密码重置的方式
      sAjax({
        url: '/api/account/config/resetPasswordWay',
        type: 'post',
        data: {resetPasswordWay: this.passwordTypeValue},
        success: (data) => {
          if (data.state) {
            this.$toast('设置成功！')
            this.showPasswordModal = false
          } else {
            this.$toast(data.message)
          }
        }
      })
    },
    cancle() {
      this.showPwd = false
      this.passwordConfirm = ''
      this.password = ''
      this.pwdStrong = []
      this.valiErrorSure = false
      this.valiError = false
      this.showEditModal = false
    },
    _afterSelectStatus(o) {
      console.log(o.value)
    },
    _check(type) {
      if(type == 'password') {
      var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
          var reg = new RegExp(/^(?![^a-zA-Z]+$)(?!\D+$)/);
          if (!this.password) {
            this.valiError = true
            this.passwordTip = '密码不能为空'
            this.pwdStrong = []
            return false
          } 
          let pwdLength = this.password.length //密码长度
          if (!reg.test(this.password)||pwdLength<8) { //先判断是否包含数字+字母
            this.valiError = true
            this.passwordTip = '密码格式不正确，必须包含数字和字母的8-25位字符串'
            this.pwdStrong = []
            return false
          } else {
            if(!pattern.test(this.password)) {  //未包含特殊字符
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
          if(this.passwordConfirm){
            this._check('passwordConfirm')
          }
           this.valiError = false        
           this.passwordTip = ''

      }else {
        if (this.password !== this.passwordConfirm) {
            this.valiErrorSure = true
            this.surepwTip = '密码不一致'
          } else {
            this. valiErrorSure= false
            this.surepwTip = ''
          }
      }
    },
    submit() {
      if(this.showPwd) { //显示修改密码
        this._check('password')
        this._check('passwordConfirm')
        if(this.valiError || this.valiErrorSure){
          return false
        }
      }
      
      if(this.nowUserStatus == 2){
             sAjax({
                url: `/api/users/certifications/unForbidden/${this.nowUserName}`,
                dataType: "json",
                type: 'post',
                success: data => {
                  if(data.state){
                    // this.$toast("编辑成功")
                    this.ts = new Date()
                  }
                  else{
                    this.$toast(data.message)
                  }
                }
              });

      }
      else if(this.nowUserStatus == 1){
         sAjax({
                url: `/api/users/certifications/forbidden/${this.nowUserName}`,
                dataType: "json",
                type: 'post',
                success: data => {
                  if(data.state){
                    // this.$toast("编辑成功")
                    this.ts = new Date()
                  }
                  else{
                    this.$toast(data.message)
                    return false
                  }
                }
              });   
      }
      if(this.showPwd) { //显示修改密码
        let url = '/api/account/modifyPassword'
        let password = crypto.createHash('md5').update(this.password).digest('hex')
        let modifyAccountVo = {
          accountType: 'uniform',
          newPassword: password,
          oldPassword: this.userInfo.password,
          userId: this.userInfo.userId,
          userNo: this.userInfo.userNo
        }
        sAjax({
          url: url,
          type: 'post',
          data: modifyAccountVo,
          success: (data) => {
            if(data.state) {
              this.$toast("编辑成功")
              this.showEditModal = false
              this.password = ''
              this.passwordConfirm = ''
              this.pwdStrong = []
            }else {
              return false
              this.$toast(data.message)
            }
          }
        })
      }else {
        this.$toast("编辑成功")
      }

      this.showEditModal = false

    }
  }
}
</script>
<style lang="less">
@import url("../../assets/common.less");

#freshmanManage-page {
  .add {
    background: #ffffff;
    border: none;
  }
  .search-input-group {
    margin: 5px 0 10px 18px;
  }
  .btn-style {
    border-radius: 4px;
    font-size: 13px;
    color: #298df7;
    font-weight: 500;
    padding: 10px 16px;
    margin-right: 12px;
  }
  .class-committee-group {
    label {
      display: inline-block;
      width: 120px;
      text-align: left;
    }
    input {
      width: 70%;
      outline: none;
    }
    input.error {
      border: 1px solid orangered;
    }
    p {
      margin: 0;
      padding-left: 120px;
      color: orangered;
      font-size: 13px;
    }
    em {
          display: inline-block;
          margin-left: 20px;
          font-style: normal;
          vertical-align: middle;
        }
       & >span {
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
    .radio-input {
      width: auto;
    }
    .password-text {
      width: 100px;
      margin: 0 20px 0 0;
      text-align: right;
    }
  }
  .class-committee-group.pwdStrong {
    padding-left: 120px;
  }
  .setBtn {
    
    span {
      color: #16a4ff;
      display: block;
      width: 70%;
      margin-left: 120px;
      text-align: right;
      cursor: pointer;

    }
  }
  .tip-text {
    margin: 40px 0 0 10px;
    font-size: 12px;
  }
}
</style>
