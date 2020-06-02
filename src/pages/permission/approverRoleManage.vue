<template>
  <div id="collegeRole-page" class="container-fluid">
    <div class="row text-center">
      <v-table :url="url" pagesize="10" idField="id" :order="true" :columns="columns" :multiple="false" :search="true">
        <div slot="btn-group" role="group">
          <div class="btn-group pull-left">
            <v-select class="dep-select" :value="currentDepartmentId" :options="departmentOptions"  optionsLabel="name" optionsValue="id" :search="false" @afterSelected="changeDepartment"></v-select>
          </div>
          <div class="btn-group pull-right">
            <button type="button" class="btn addRole-btn clearBtnBorder" @click="addRoleModal()">{{ translate.addButton }}</button>
          </div>
        </div>
      </v-table>
    </div>

    <!-- 模态框（Modal） -->
    <v-modal :show="showUserModal" effect="fade" width="420">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
          {{modalType}}{{translate.role}}
        </h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <input type="hidden" id="role-id" v-model="newDepartRole.id">
        <div class="form-group">
          <label class="input-label" >{{translate.level}}</label>
          <v-select class="btn-block search-select modal-form-style levels-select" :disabled="modalType === '编辑'?true:false" :value="newDepartRole.level?newDepartRole.level:'1'" :options="levelOptions" options-value="id" options-label="name" @afterSelected="changeLevel" search close-on-select></v-select>
        </div>
        <div class="form-group">
          <label class="input-label">{{translate.roleName}}</label>
          <input type="text" class="form-control search-input modal-form-style" v-model="newDepartRole.name" @keyup="_verifyLength">
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="cancelAddRole">{{translate.cancel}}</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="addRole">{{translate.submit}}</button>
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
      sAjax({
        url: '/api/currentUser/approverDepartment',
        dataType: 'json',
        type: 'get',
        success: function (result) {
          if (result.state) {
            if (result.data.length > 0) {
              that.departmentOptions = result.data
              that.currentDepartmentId = that.departmentOptions[0].id
              that.url = that.roleUrl + '?departmentId=' + that.currentDepartmentId
            } else {
              that.$toast(that.translate.noManageCollegeTip)
            }
          } else {
            that.$toast(result.message)
          }
        }
      })
      this.roleColumns = [{
        id: 'name',
        title: this.translate.roleName,
        className: 'text-left',
        hidden: false,
        width: 150,
        search: {
          type: 'input',
          autoFocus: true
        }
      },
      {
        id: 'level',
        title: this.translate.level,
        className: 'text-left',
        hidden: false,
        width: 150,
        search: {
          type: 'select',
          data: {
            options: this.levelOptions,
            optionsValue: 'id',
            optionsLabel: 'name'
          }
        },
        formatter: function (record) {
          var level = ''
          that.levelOptions.forEach(function (el) {
            if (record.level === el.id + '') {
              level = el.name
            }
          })
          return level
        }
      },
      {
        id: 'opt',
        title: this.translate.operation,
        className: 'text-center',
        width: 130,
        hidden: false,
        formatter: function () {
          return [{
            tag: 'a',
            text: that.translate.delete,
            className: 'opt-btn',
            callback: function (record, index) {
              if (confirm(that.translate.clearComfirmTip)) {
                sAjax({
                  url: '/api/approveRoles/' + record.id + '/delete',
                  dataType: 'json',
                  type: 'post',
                  success: function (data) {
                    if (data.state) {
                      that.url = that.roleUrl + '?time=' + new Date().getTime() + '&departmentId=' + that.currentDepartmentId
                    } else {
                      that.$toast(data.message)
                    }
                  }
                })
              }
            }
          }, {
            tag: 'a',
            text: that.translate.edit,
            className: 'opt-btn',
            callback: function (record, index) {
              that.newDepartRole.id = record.id
              that.newDepartRole.name = record.name
              that.newDepartRole.departmentId = that.currentDepartmentId
              that.newDepartRole.level = record.level
              that.showUserModal = true
              that.modalType = '编辑'
            }
          }]
        }
      }]
      this.columns = this.roleColumns
    },
    data: function () {
      return {
        departmentOptions: [],
        levelOptions: [{
          id: 'COLLEGE',
          name: '院级'
        }, {
          id: 'SCHOOL',
          name: '校级'
        }],
        currentDepartmentId: '',
        columns: [],
        roleColumns: [],
        userColumns: [],
        url: '',
        roleUrl: '/table-data/approveRoles/page',
        showUserModal: false,
        newDepartRole: {
          id: '',
          name: '',
          departmentId: 0,
          level: ''
        },
        modalType: '',
        lang: 'zh-cn',
      }
    },
    computed: {
      translate: function () {
        return translation(this.lang).approverRoleManage
      }
    },
    methods: {
      _verifyLength: function () {
        var chineseLen = 0
        var englishLen = 0
        var index = 0
        if (!this.newDepartRole.name) {
          return false
        }
        for (var i = 0; i < this.newDepartRole.name.length; i++) {
          if (this.newDepartRole.name.charCodeAt(i) > 127 || this.newDepartRole.name.charCodeAt(i) === 94) {
            chineseLen++
          } else {
            englishLen += 0.5
          }
          if (parseInt(chineseLen + englishLen) === 25) {
            index = i
          }
        }
        if (parseInt(chineseLen + englishLen) > 25) {
          this.newDepartRole.name = this.newDepartRole.name.slice(0, index + 1)
        }
      },
      changeDepartment: function (data) {
        this.currentDepartmentId = data.val
        this.url = this.roleUrl + '?time=' + new Date().getTime() + '&departmentId=' + this.currentDepartmentId
      },
      cancelAddRole: function () {
        this.newDepartRole = {
          id: '',
          name: '',
          departmentId: 0,
          level: 'SCHOOL'
        }
        this.showUserModal = false
      },
      addRoleModal: function () {
        this.newDepartRole = {
          id: '',
          name: '',
          departmentId: 0,
          level: ''
        }
        this.showUserModal = true
        this.modalType = '新增'
      },
      changeLevel: function (data) {
        this.newDepartRole.level = data.val
      },
      addRole: function () {
        var that = this
        if (!this.newDepartRole.name) {
          return that.$toast(this.translate.nameIsNull)
        }
        if (!this.newDepartRole.level) {
          return that.$toast(this.translate.levelIsNull)
        }
        that.newDepartRole.departmentId = that.currentDepartmentId
        if (this.newDepartRole.id) {
          if (!confirm(this.translate.editRoleConfirmTip)) {
            return false
          }
          sAjax({
            url: '/api/approveRoles/' + that.newDepartRole.id,
            dataType: 'json',
            data: that.newDepartRole,
            type: 'post',
            success: function (data) {
              if (data.state) {
                that.showUserModal = false
                that.url = that.roleUrl + '?time=' + new Date().getTime() + '&departmentId=' + that.currentDepartmentId
              } else {
                that.$toast(data.message)
              }
            }
          })
        } else {
          if (!confirm(this.translate.addRoleConfirmTip)) {
            return false
          }
          sAjax({
            url: '/api/approveRoles',
            dataType: 'json',
            data: that.newDepartRole,
            type: 'post',
            success: function (data) {
              if (data.state) {
                that.showUserModal = false
                that.url = that.roleUrl + '?time=' + new Date().getTime() + '&departmentId=' + that.currentDepartmentId
              } else {
                that.$toast(data.message)
              }
            }
          })
        }
      }
    }
  }
</script>
<style lang="less">
@import url("../../assets/common.less");
#collegeRole-page {
  .dropdown-toggle {
    box-shadow: none;
  }
  .addRole-btn {
    font-weight: 500;
    background: transparent;
    box-shadow: none;
    transition: all 0.2s ease;
    &:hover {
      color: #298df7;
    }
  }
  .modal-body {
    .user-no-input {
      width: 70%;
    }
  }
  .add {
    background: @-90ThemeColor;
    border: none;
    border-radius: 100px;
  }
  .search-input-group {
    margin: 5px 0 0 43px;
  }
  .levels-select .dropdown-menu {
    position: fixed;
    top: auto;
    left: auto;
  }
}
</style>
