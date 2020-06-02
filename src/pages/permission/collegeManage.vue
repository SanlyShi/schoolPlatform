<template>
  <div id="collegeManage-page" class="container-fluid" v-if="isParentPage">
    <div class="row text-center">
      <v-table  :title="translate.tableName" :url="url" pagesize="10" idField="id" :columns="columns" :multiple="false" :order="true" :search="true">
      </v-table>
    </div>

    <!-- 模态框（Modal） -->
    <v-modal :show="showAddModal" effect="fade" width="450">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
            {{translate.set}}{{translate.principal}}
        </h5>
      </div>
      <div slot="modal-body" class="modal-body container-fluid" style="overflow: visible;">
        <div class="form-group add-principal-group">
           <label class="name-text">姓名(学工号):</label>
            <detect style="display:inline-block;vertical-align: middle;margin-left: 18px;" ref="searchVal" :searchVal='searchVal' url="/api/relClass/getUserSimpleInfo" keyword="nameOrNo" :placeholder="请输入学号或者姓名" @afterSelected="afterSelectAddPerson"></detect>
        </div>
        <!-- <div class="form-group add-principal-group">
         <label class="name-text">{{translate.userId}}:</label>
         <input class="form-control search-input modal-form-style" type="text" v-model="newCollege.userNo" :placeholder="translate.placeholder">
         <button type="button" class="btn check-btn clearBtnBorder" @click="checkUserId">{{translate.check}}</button>
         <div class="errorMsg" >{{newCollege.userIdErrorMsg}}</div>
        </div> -->
        <!-- <div class="form-group add-principal-group">
         <label class="name-text">{{translate.name}}:</label>
         <input class="form-control name-input modal-form-style" type="text" readonly="readonly" v-model="newCollege.userName">
       </div> -->
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="showAddModal = false">{{translate.cancel}}</button>
        <button type="button" class="btn submit-btn clearBtnBorder" :class="{disabled: isDisabled.add}" @click="addPrincipal(isDisabled.add)">{{translate.confirm}}</button>
      </div>
    </v-modal>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { sAjax, translation } from '../../assets/utils/utils.js'
  export default {
    created: function () {
      var la = localStorage.getItem('lang')
      var that = this
      if (translation(la)) {
        this.lang = la
      }
      this.columns = [{
        id: 'name',
        title: this.translate.college,
        className: 'text-left',
        hidden: false,
        search: {
          type: 'input',
          data: {
            placeholder: this.translate.collegeNamePlaceholder
          }
        }
      }, {
        id: 'principal',
        title: this.translate.principal,
        className: 'text-left',
        hidden: false,
        formatter: function (record, index) {
          if (record.personInCharge) {
            return record.personInCharge.name
          } else {
            return ''
          }
        }
      },
      {
        id: 'userNo',
        title: this.translate.userId,
        className: 'text-left',
        hidden: false,
        formatter: function (record, index) {
          if (record.personInCharge) {
            return record.personInCharge.userNo
          } else {
            return ''
          }
        }
      },
      {
        id: 'updateTime',
        title: this.translate.updatedTime,
        className: 'text-left',
        hidden: false
      },
      {
        id: 'opt',
        title: this.translate.opt,
        className: 'text-center',
        width: '220px',
        hidden: false,
        formatter: function () {
          return [{
            tag: 'a',
            text: that.translate.set + that.translate.principal,
            className: 'opt-btn',
            callback: function (record, index) {
              that.college = record
              that.newCollege = {
                userIdErrorMsg: '',
                userName: '',
                nameErrorMsg: ''
              }
              that.newCollege.collegeId = record.id
              that.searchVal = ''
              that.showAddModal = true
              that.isDisabled.add = true
            }
          }]
        }
      }]
      this.importBtnType = [
        {
          name: this.translate.overriteImport,
          url: '/colleges/updateExcel',
          isShowBtn: true
        },
        {
          name: this.translate.incrementImport,
          url: '',
          isShowBtn: false
        }
      ]
    },
    data: function () {
      return {
        searchVal:'',
        columns: [],
        url: '/table-data/colleges/pages',
        downloadUrl: '/colleges/excelTemplates',
        errorMessageUrl: '/colleges/errExcel',
        checkTemplateUrl: '/colleges/excel',
        templateName: '学院导入模板.xlsx',
        method: 'post',
        showAddModal: false,
        showEditModal: false,
        showBatchSetModal: false,
        options: [],
        college: {},
        newCollege: {
          userIdErrorMsg: '',
          userName: '',
          nameErrorMsg: ''
        },
        isDisabled: {
          add: true,
          batchSet: true
        },
        showErrorMsg: false,
        checkResult: '',
        isParentPage: true,
        lang: 'zh-cn'
      }
    },
    computed: {
      translate: function () {
        return translation(this.lang).collegeManage
      }
    },
    methods: {
      importCollege: function () {
        this.isParentPage = false
      },
      backParentPage: function () {
        this.isParentPage = true
      },
      addPrincipal: function (isDisabled) {
        if (isDisabled) {
          return false
        }
        var that = this
        sAjax({
          url: '/api/colleges/' + this.newCollege.collegeId + '/managers',
          dataType: 'json',
          data: {
            userId: this.newCollege.userId
          },
          type: 'post',
          success: function (data) {
            if (data.state) {
              that.url =
                '/table-data/colleges/pages?timestamp=' + new Date().getTime()
              that.showAddModal = false
              that.$toast(that.translate.setSuccessTip)
            } else {
              that.$toast(that.translate.setFailedTip + ':' + data.message)
            }
          }
        })
      },
      afterSelectAddPerson(o){
        this.newCollege.userName = o.name
              this.newCollege.userId = o.userId
              this.newCollege.userIdErrorMsg = ''
              this.isDisabled.add = false

              if (o.userNo) {
        this.searchVal = `${o.name}(${o.userNo})`
      }
      else if (o.roleId) {
        this.searchVal = `${o.name}`
      }
      else if (o.unitName) {
        this.searchVal = `${o.unitName}`
      }
      },
      checkUserId: function () {
        if (!this.newCollege.userNo) {
          this.newCollege.userIdErrorMsg = this.translate.placeholder
          this.isDisabled.add = true
          return false
        }
        var that = this
        sAjax({
          url: '/api/users/' + this.newCollege.userNo,
          dataType: 'json',
          type: 'get',
          success: function (data) {
            if (data.state) {
              that.newCollege.userName = data.data.name
              that.newCollege.userId = data.data.userId
              that.newCollege.userIdErrorMsg = ''
              that.isDisabled.add = false
            } else {
              that.newCollege.userIdErrorMsg = data.message
              that.newCollege.userName = ''
              that.isDisabled.add = true
            }
          }
        })
      }
    }
  }
</script>
<style lang="less">
@import url("../../assets/common.less");
#collegeManage-page {
  .add-principal-group .btn-block {
    width: auto;
  }
  .add-principal-group {
    padding-left: 10px;
  }
  .modal-header {
    padding-left: 25px;
  }
  .modal-body{
    max-height: 400px;
  }
  .errorMsg {
    margin: 10px 0 0 71px;
    color: red;
  }
  .edit-errorMsg {
    margin: 10px 0 0 55px;
    color: red;
  }
  .name-text {
    width: 90px;
    text-align: right;
  }
  .search-group {
    margin: 5px 0 10px 43px;
  }
  .name-input {
    border-radius: 0;
    border-top: 0 solid #ffffff;
    border-left: 0 solid #ffffff;
    border-right: 0 solid #ffffff;
    border-bottom: 2px solid #e0e0e0;
    box-shadow: inset 0 0px 0px rgba(0, 0, 0, 0.075);
    padding: 0;
  }
  .form-control[readonly] {
    background: #fff;
  }
  .search-input-group {
    margin: 5px 0 0 43px;
  }
  .search-collegeName {
    background: #ffffff;
    border: 0 solid #ffffff;
  }
}
</style>
