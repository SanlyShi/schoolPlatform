<template>
  <div id="department-page" class="container-fluid">
    <div class="row text-center">
      <v-table  :title="translate.tableName" :url="url" pagesize="10" idField="id" :columns="columns" :multiple="false" :order="true" :search="true">
        <div slot="btn-group" class="btn-group pull-right" role="group">
          <button type="button" class="btn btn-bgColor-style clearBtnBorder" @click="addModal()">{{translate.addNew}}{{translate.department}}</button>
        </div>
      </v-table>
    </div>

    <!-- 模态框（Modal） -->
    <v-modal :show="showAddModal" effect="fade" class="editDepartmentModal"  width="274">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
          {{modalType}}{{translate.department}}
      </h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="form-group">
          <input id="departmentName" type="text" class="form-control search-input" v-model="newDepartment.name" @keyup="_verifyLength" ref="count">
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="cancleModal">{{translate.cancel}}</button>
        <button type="button" class="btn submit-btn clearBtnBorder" :class="{disabled: isDisabled}" @click="changeRole(isDisabled)">{{translate.confirm}}</button>
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
        title: this.translate.departmentName,
        className: 'text-left',
        hidden: false,
        search: {
          type: 'input',
          data: {
            placeholder: this.translate.departmentNamePlaceholder
          }
        }
      },
      {
        id: 'opt',
        title: this.translate.opt,
        className: 'text-center',
        width: '130px',
        hidden: false,
        formatter: function () {
          return [{
            tag: 'a',
            text: that.translate.edit,
            className: 'opt-btn',
            callback: function (record, index) {
              that.department = record
              that.newDepartment.id = record.id
              that.newDepartment.name = record.name
              that.modalType = that.translate.edit
              that.showAddModal = true
            }
          }, {
            tag: 'a',
            text: that.translate.remove,
            className: 'opt-btn',
            callback: function (record, index) {
              if (confirm(that.translate.removeConfirmTip)) {
                sAjax({
                  url: '/api/department/' + record.id + "/delete",
                  dataType: 'json',
                  type: 'post',
                  success: function (data) {
                    if (data.state) {
                      that.url = '/table-data/department?timestamp=' + new Date().getTime()
                    } else {
                      that.$toast(that.translate.removeFailedTip + ':' + data.message)
                    }
                  }
                })
              }
            }
          }]
        }
      }]
    },
    data: function () {
      return {
        columns: [],
        url: '/table-data/department',
        showAddModal: false,
        department: {},
        newDepartment: {
          name: ''
        },
        modalType: '',
        isChange: false,
        isDisabled: false,
        lang: 'zh-cn'
      }
    },
    computed: {
      translate: function () {
        return translation(this.lang).departmentManage
      }
    },
    methods: {
      _verifyLength: function () {
        var chineseLen = 0
        var englishLen = 0
        var index = 0
        if (!this.newDepartment.name) {
          return false
        }
        this.isChange = true
        for (var i = 0; i < this.newDepartment.name.length; i++) {
          if (this.newDepartment.name.charCodeAt(i) > 127 || this.newDepartment.name.charCodeAt(i) === 94) {
            chineseLen++
          } else {
            englishLen += 0.5
          }
          if (parseInt(chineseLen + englishLen) === 25) {
            index = i
          }
        }
        if (parseInt(chineseLen + englishLen) > 25) {
          this.newDepartment.name = this.newDepartment.name.slice(0, index + 1)
        }
      },
      editDepartment: function () {
        var that = this
        that.isDisabled = true
        sAjax({
          url: '/api/department/' + this.newDepartment.id,
          dataType: 'json',
          data: {
            name: this.newDepartment.name
          },
          type: 'post',
          success: function (data) {
            that.isDisabled = false
            if (data.state) {
              that.department.id = that.newDepartment.id
              that.department.name = that.newDepartment.name
              that.showAddModal = false
              that.$toast(that.translate.editSuccessTip)
            } else {
              that.$toast(that.translate.editFailedTip + ':' + data.message)
            }
          }
        })
      },
      addModal: function () {
        this.newDepartment = {}
        this.modalType = this.translate.addNew
        this.showAddModal = true
      },
      addDepartment: function () {
        var that = this
        if (!this.newDepartment.name) {
          that.$toast('请输入部门名称')
        } else {
          that.isDisabled = true
          sAjax({
            url: '/api/department',
            dataType: 'json',
            data: {
              name: this.newDepartment.name
            },
            type: 'post',
            success: function (data) {
              that.isDisabled = false
              if (data.state) {
                that.url = '/table-data/department?timestamp=' + new Date().getTime()
                that.showAddModal = false
                that.$toast(that.translate.addSuccessTip)
              } else {
                that.$toast(that.translate.addFailedTip + ':' + data.message)
              }
            }
          })
        }
      },
      changeRole: function (isDisabled) {
        if (isDisabled) {
          return false
        } 
        if (this.modalType === this.translate.addNew) {
          this.addDepartment()
        } else if (this.modalType === this.translate.edit) {
          this.editDepartment()
        }
      },
      cancleModal: function () {
        if (this.isChange) {
          if (confirm(this.translate.cancelConfirmTip)) {
            this.showAddModal = false
          }
        } else {
          this.showAddModal = false
        }
      }
    }
  }
</script>
<style lang="less">
@import url("../../assets/common.less");

#department-page {
  .modal-header {
    border-bottom: 0 solid #ffffff;
  }
  .modal-footer {
    border-top: 0 solid #ffffff;
    padding: 15px;
  }
  .modal-body {
    padding: 20px 24px 5px ;
  }
  .search-input-group {
    margin: 5px 0 0 43px;
  }
}
</style>
