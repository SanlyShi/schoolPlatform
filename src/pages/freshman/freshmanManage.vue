<template>
  <v-import
    v-bind="importParams"
    @backParentPage="importStudents = false"
    v-if="importStudents">
  </v-import>
  <div id="freshmanManage-page" class="container-fluid" v-else>
    <div class="row text-center">
      <v-table  :title="translate.tableName" :url="url" pagesize="10" idField="id" :columns="columns" :order="true" :search="true">
        <div slot="btn-group" class="btn-group pull-right" role="group">
          <button type="button" class="btn add clearBtnBorder btn-style " @click="_studentIdBinding">{{translate.studentIdBinding}}</button>
          <button type="button" class="btn add clearBtnBorder btn-style" @click="_studentAccountImport">{{translate.add}}{{translate.freshmanAccount}}</button>
        </div>
      </v-table>
    </div>

      <v-modal :show="showEditModal" effect="fade" width="500">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">账号编辑</h5>
      </div>
    <!-- 新建选项 -->
    <div slot="modal-body" class="modal-body">
        <div class="form-group class-committee-group">
          <label class="classCommittee-text">新生账号:</label>
          <input type="text" disabled class="optionInput"  v-model="studentModel.freshNo">
        </div>
        <div class="form-group class-committee-group">
          <label class="classCommittee-text">学号:</label>
          <input type="text" disabled class="optionInput" v-model="studentModel.userNo">
        </div>
        <div class="form-group class-committee-group">
          <label class="classCommittee-text">新的密码:</label>
          <input type="text" class="optionInput" @blur="_check('password')" placeholder="8-25位，必须包含数字和字母" :class="!valiError?'':'error'" v-model="studentModel.password">
          <p v-if="studentModel.valiError">{{studentModel.passwordTip}}</p>
        </div>
        <div class="form-group class-committee-group pwdStrong" v-if="pwdStrong.length">
          <span class="pwd-red"></span><span class="pwd-yellow" v-show="pwdStrong.length > 1"></span><span class="pwd-green" v-show="pwdStrong.length > 2"></span>
          <em>{{pwdStrong.length==1?'弱':pwdStrong.length==2?'中':'强'}}</em>
        </div>
        <div class="form-group class-committee-group">
          <label class="classCommittee-text">再次确认密码:</label>
          <input type="text"  class="optionInput" :class="!valiErrorSure?'':'error'" @blur="_check('passwordConfirm')" v-model="studentModel.passwordConfirm">
          <p v-if="studentModel.valiErrorSure">{{studentModel.surepwTip}}</p>
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
  </div>
</template>

<script>
  import Vue from 'vue'
  import { sAjax, translation } from '../../assets/utils/utils.js'
  import crypto from 'crypto'
  export default {
    data: function () {
      return {
        pwdStrong: [],
        studentModel: {
          freshNo: '',
          userNo: '',
          password: '',
          passwordConfirm: '',
          valiError: '',
          valiErrorSure: '',
          passwordTip: '',
          surepwTip: '',
        },
        columns: [],
        baseUrl: '/table-data/document/students/freshman',
        ts: new Date(),
        definedSearch: {
          studentId: '',
          name: '',
          account: '',
        },
        showEditModal: false,
        modalType: '',
        lang: 'zh-cn',
        importStudents: false,
        importParams: {
          parentPageTitle: '',
          downloadTemplateUrl: '',
          downloadErrorTemplateUrl: '',
          checkTemplateUrl: '',
          templateName: '',
          importBtnType: null
        },
        importType: '',
        isDisabled: '',
        isChange: false,
        guideContent: '',
      }
    },
    computed: {
      translate: function () {
        return translation(this.lang).freshmanManage
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
        id: 'name',
        title: this.translate.name,
        className: 'text-left',
        hidden: false,
        search: {
          type: 'input'
        },
        formatter: function (record, index) {
          if (record.name) {
            return record.name
          } else {
            return '-'
          }
        }
      }, {
        id: 'account',
        title: this.translate.freshmanAccount,
        className: 'text-left',
        hidden: false,
        search: {
          type: 'input'
        },
        formatter: function (record, index) {
          if (record.account) {
            return record.account
          } else {
            return '-'
          }
        }
      }, {
        id: 'endTime',
        title: this.translate.endTime,
        className: 'text-left',
        hidden: false,
        formatter: function (record, index) {
          if (record.endTime) {
            return record.endTime
          } else {
            return '-'
          }
        }
      }, {
        id: 'studentId',
        title: this.translate.studentId,
        className: 'text-left',
        hidden: false,
        width: 150,
        search: {
          type: 'input',
          data: {
            autoFocus: true
          }
        },
        formatter: function (record, index) {
          if (record.studentId) {
            return record.studentId
          } else {
            return '-'
          }
        }
      },{
        id: "opt",
      className: "text-center",
      title: "操作",
      width: 120,
      hidden: false,
       formatter: (record) => {
          const opts = {
            edit: {
              tag: 'a',
              text: '编辑',
              callback: (record, index) => {
                this.showEditModal = true
                let {account,studentId,password,userId} = record
                  this.studentModel.freshNo = account
                  this.studentModel.userNo = studentId  
                  this.studentModel.oldPassword = password  
                  this.studentModel.userId = userId
              }
            },
          }
          return [opts.edit]
        }
      }]

    },
    methods: {
      cancle() {
         this.studentModel =  {
          freshNo: '',
          userNo: '',
          password: '',
          passwordConfirm: '',
          valiError: '',
          valiErrorSure: '',
          passwordTip: '',
          surepwTip: '',
          oldPassword: '',
          userId: '',
        }
        this.pwdStrong = []
        this.showEditModal = false
      },
      submit() {
        if(this.studentModel.valiError || this.studentModel.valiErrorSure) {
          return false
        }
        let url = '/api/account/modifyPassword'
         let password = crypto.createHash('md5').update(this.studentModel.password).digest('hex')
        let modifyAccountVO = {
          accountType: 'freshman',
          newPassword: password,
          oldPassword: this.studentModel.oldPassword,
          userId: this.studentModel.userId,
          userNo:  this.studentModel.userNo,
        }
        sAjax({
          url: url,
          type: 'post',
          data: modifyAccountVO,
          success: (data) => {
            if(data.state) {
              this.$toast("编辑成功")
              this.cancle()
            }else {
              this.$toast(data.message)
            }
          }
        })
      },
       _check(type) {
          let model = this.studentModel
          if(type == 'password') {
              
          var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
          var reg = new RegExp(/^(?![^a-zA-Z]+$)(?!\D+$)/);
          
          if (!model.password) {
            model.valiError = true
            model.passwordTip = '密码不能为空'
            this.pwdStrong = []
            return false
          } 
          let pwdLength = model.password.length //密码长度
          if (!reg.test(model.password)||pwdLength<8) { //先判断是否包含数字+字母
            model.valiError = true
            model.passwordTip = '密码格式不正确，必须包含数字和字母的8-25位字符串'
            this.pwdStrong = []
            return false
          } else {
            if(!pattern.test(model.password)) {  //未包含特殊字符
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
          if(model.passwordConfirm){
            this._check('passwordConfirm')
          }
           model.valiError = false        
           model.passwordTip = ''

      }else {
        if (!model.passwordConfirm) {
            model.valiError = true
            model.valiErrorSure = true
            model.surepwTip = '确认密码不能为空'
            return false
          }
        if (model.password !== model.passwordConfirm) {
            model.valiErrorSure = true
            model.surepwTip = '确认密码有误'
            return false
          } else {
            model. valiErrorSure= false
            model.surepwTip = ''
          }
      }
    },
      _studentIdBinding: function () {
        this.importStudents = true
        this.importType = 'studentIdBinding'
        this.importParams = {
          parentPageTitle: this.translate.tableName,
          downloadTemplateUrl: '/document/students/updateUserNoTemplates',
          downloadErrorTemplateUrl: '/document/students/errExcel',
          checkTemplateUrl: '/document/students/updateUserNoTemplates/check',
          templateName: this.translate.execlName,
          importBtnType: [{
            name: this.translate.overrideImport,
            url: '/document/students/updateUserNoExcel',
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
      _studentAccountImport: function () {
        this.importStudents = true
        this.importType = 'studentInfo'
        this.importParams = {
          parentPageTitle: this.translate.tableName,
          downloadTemplateUrl: '/document/students/importFreshmanTemplate',
          downloadErrorTemplateUrl: '/document/students/errExcel',
          checkTemplateUrl: '/document/students/freshman/templates/check',
          templateName: this.translate.freshmanInfoExeclName,
          importBtnType: [{
            name: this.translate.overrideImport,
            url: '/document/students/freshman/excel',
            method: 'post',
            isShowBtn: true,
            success: (data) => {
              if (data.state) {
                this.ts = new Date()
              }
            }
          }]
        }
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
  .modal-body {
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
       & .pwdStrong span {
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
  }
  .class-committee-group.pwdStrong {
    padding-left: 120px;
  }
}
</style>
