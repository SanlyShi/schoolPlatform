<template>
  <div id="employment-unit-manage" class="container-fluid" v-if="!importEmploymentUnit">
    <div class="row text-center">
      <v-table :title="translate.tableName" :url="`${url}?timeStamp=${timeStamp}`" pagesize="10" idField="id" :columns="columns" :multiple="false" :order="true" :search="false">
        <div slot="btn-group" class="btn-group pull-right" role="group">
          <button type="button" class="btn btn-bgColor-style add clearBtnBorder" @click="importEmploymentUnit = true">{{translate.batch}}{{translate.newAdd}}{{translate.employmentUnit}}</button>
          <button type="button" class="btn btn-bgColor-style add clearBtnBorder" @click="showAddEmploymentUnitModal">{{translate.newAdd}}{{translate.employmentUnit}}</button>
        </div>
      </v-table>
    </div>
    <v-modal :show="showAddModal" effect="fade" width="478">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
            {{modalType}}{{translate.employmentUnit}}
        </h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="form-group">
          <label class="input-label">{{translate.unitName}}</label>
          <input type="text" :placeholder="translate.checkUserTip" class="form-control search-input modal-form-style" v-model="employmentUnit.name">
        </div>
        <div class="form-group">
          <label class="level-text">{{translate.level}}</label>
          <div class="radio-area">
            <div class="info-options">
              <span v-for="(col,k) in levelData" :key="k" @click="employmentUnit.level=col.id">
                <i class="maticon" :class="employmentUnit.level === col.id?'active':''" v-html="icons(employmentUnit.level === col.id?'radio_button_checked':'radio_button_unchecked')"></i>
                {{col.text}}
              </span>
            </div>
          </div>
        </div>
        <div class="form-group" v-if="employmentUnit.level === 'COLLEGE'">
          <label class="college-text">学院</label>
          <v-select class="btn-block search-select modal-form-style" :disabled="isEdit ? true : false" :value="employmentUnit.collegeCode" :options="collegeData" options-value="code" options-label="name" @afterSelected="collegeSelected" search close-on-select></v-select>
        </div>
        <div class="form-group">
          <label class="input-label" >经办人{{translate.userId}}</label>
          <input id="user-no" type="text"  class="form-control search-input modal-form-style"  @change="checkUser('principal', principal.userNo)" v-model="principal.userNo">
          <button type="button" class="btn check-btn clearBtnBorder" @click="checkUser('principal', principal.userNo)">{{translate.check}}</button>
          <p class="error-message">{{principal.errorMessage}}</p>
        </div>
        <div class="form-group">
          <label class="input-label" >经办人{{translate.userName}}</label>
          <input type="text" class="form-control search-input modal-form-style" disabled="disabled" v-model="principal.name">
          <button type="button" class="btn check-btn clearBtnBorder" @click="addNewUser('principal')">{{ translate.add}}</button>
        </div>
        <div class="user-list">
          <p class="" v-for="(com,cIndex) in employmentUnit.masterUsers" :key="cIndex">
            <span class="user-name">{{com.name}}</span> <i class="maticon pull-right remove-icon" v-html="icons('cancel')" @click="removeUser('principal' ,com.userId)">cancel</i>
          </p>
        </div>
        <div class="form-group">
          <label class="input-label" >{{translate.principal}}{{translate.userId}}</label>
          <input id="user-no" type="text"  class="form-control search-input modal-form-style"  @change="checkUser('manager', manager.userNo)" v-model="manager.userNo">
          <button type="button" class="btn check-btn clearBtnBorder" @click="checkUser('manager', manager.userNo)">{{translate.check}}</button>
          <p class="error-message">{{manager.errorMessage}}</p>
        </div>
        <div class="form-group">
          <label class="input-label" >{{translate.principal}}{{translate.userName}}</label>
          <input type="text" class="form-control search-input modal-form-style" disabled="disabled" v-model="manager.name">
          <button type="button" class="btn check-btn clearBtnBorder" @click="addNewUser('manager')">{{ translate.add}}</button>
        </div>
        <div class="user-list">
          <p class="" v-for="(com,cIndex) in employmentUnit.managerUsers" :key="cIndex">
            <span class="user-name">{{com.name}}</span> <i class="maticon pull-right remove-icon" v-html="icons('cancel')" @click="removeUser('manager' ,com.userId)">cancel</i>
          </p>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder"  @click="showAddModal = false">{{translate.cancel}}</button>
        <button type="button" class="btn submit-btn clearBtnBorder"  @click="changeRole">{{translate.confirm}}</button>
      </div>
    </v-modal>
  </div>
  <v-import
    v-bind="importParams"
    @backParentPage="importEmploymentUnit = false"
    v-else>
  </v-import>
  
</template>

<script>
  import Vue from 'vue'
  import { translation, sAjax, createTime } from '../../assets/utils/utils.js'

  export default {
    data: function () {
      return {
        url: '/table-data/pwps/units/page',
        timeStamp: '',
        columns: [],
        importEmploymentUnit: false,
        importParams: {
          parentPageTitle: '用工单位管理',
          downloadTemplateUrl: '/pwps/units/batch/template',
          downloadErrorTemplateUrl: '/pwps/units/batch/update/error',
          checkTemplateUrl: '/pwps/units/batch/excel',
          templateName: '批量新增用工单位',
          importBtnType: null
        },
        modalType: '',
        showAddModal: false,
        levelData: [],
        employmentUnit: {
          id: '',
          name: '',
          level: 'SCHOOL',
          managerUsers: [],
          masterUsers: [],
          collegeCode: ''
        },
        manager: {
          name: '',
          userNo: '',
          userId: '',
          errorMessage: '',
          isCheckUserId: false
        },
        principal: {
          name: '',
          userNo: '',
          userId: '',
          errorMessage: '',
          isCheckUserId: false
        },
        collegeData: [],
        isEdit: false,
        forbidReClick: false,
        lang: 'zh-cn'
      }
    },
    computed: {
      translate: function () {
        return translation(this.lang).employmentUnitManage
      }
    },
    created: function () {
      var la = localStorage.getItem('lang')
      if (translation(la)) {
        this.lang = la
      }
      this.levelData = [{ id: 'SCHOOL', text: '校级' }, { id: 'COLLEGE', text: '院级' }]
      this.importParams.importBtnType = [{
        url: '/pwps/units/batch/update',
        method: 'post',
        isShowBtn: true,
        name: this.translate.importBtnName,
        success: (data) => {
          if (data.state) {
            this._refreshTable()
            this.importEmploymentUnit = false
          }
        }
      }]
      sAjax({
        url: '/api/colleges',
        type: 'GET',
        success: (data) => {
          if (data.state) {
            this.collegeData = data.data
          } else {
            this.$toast(data.message)
          }
        }
      })
      this.columns = [{
        id: 'name',
        title: this.translate.unitName,
        className: 'text-left',
        width: 150,
        hidden: false,
        search: {
          type: 'input',
          data: {
            placeholer: '',
            autoFocus: true
          }
        }
      }, {
        id: 'level',
        title: this.translate.level,
        className: 'text-left',
        width: 120,
        hidden: false,
        search: {
          type: 'select',
          data: {
            options: this.levelData,
            optionsLabel: 'text',
            optionsValue: 'id'
          }
        },
        formatter: function (record) {
          return record.level === 'SCHOOL' ? '校级' : '院级'
        }
      }, {
        id: 'collegeCode',
        title: '学院',
        className: 'text-left',
        width: 100,
        hidden: false,
        search: {
          type: 'select',
          data: {
            url: `/api/colleges`,
            optionsLabel: 'name',
            optionsValue: 'code'
          }
        },
        formatter: function (record) {
          return record.collegeName
        }
      }, {
        id: 'masters',
        title: '用工单位经办人',
        className: 'text-left',
        width: 150,
        hidden: false,
        formatter: function (record) {
          if (!record.masterUsers) {
            return ''
          }
          var userString = ''
          record.masterUsers.forEach(function (e) {
            userString += '<span title=' + e.userNo + '>' + e.name + '</span>' + ','
          })
          return userString.substring(0, userString.length - 1)
        }
      }, {
        id: 'managers',
        title: '用工单位负责人',
        className: 'text-left',
        width: 120,
        hidden: false,
        formatter: function (record) {
          if (!record.managerUsers) {
            return ''
          }
          var userString = ''
          record.managerUsers.forEach(function (e) {
            userString += '<span title=' + e.userNo + '>' + e.name + '</span>' + ','
          })
          return userString.substring(0, userString.length - 1)
        }
      }, {
        id: 'opt',
        title: this.translate.opt,
        className: 'text-center',
        width: 130,
        hidden: false,
        formatter: (recordItem) => {
          return [{
            tag: 'a',
            text: this.translate.edit,
            className: 'opt-btn',
            callback: (record, index) => {
              this.modalType = this.translate.edit
              this.showAddModal = true
              this.isEdit = true
              let data = JSON.parse(JSON.stringify(record))
              this.employmentUnit = {
                id: data.id,
                name: data.name,
                level: data.level,
                managerUsers: data.managerUsers,
                masterUsers: data.masterUsers,
                collegeCode: data.collegeCode
              }
              this.manager = {
                name: '',
                userNo: '',
                userId: '',
                errorMessage: '',
                isCheckUserId: false
              },
                this.principal = {
                  name: '',
                  userNo: '',
                  userId: '',
                  errorMessage: '',
                  isCheckUserId: false
                }

            }
          }, {
            tag: 'a',
            text: recordItem.isForbidden ? '启用' : '禁用',
            className: 'opt-btn',
            callback: (record, index) => {
              if (!record.isForbidden) {
                if (window.confirm('确定要禁用此单位吗？禁用后此单位将无法提交岗位申报')) {
                  sAjax({
                    url: '/api/pwps/units/forbidden/' + record.id,
                    type: 'post',
                    success: (data) => {
                      if (data.state) {
                        this._refreshTable()
                        this.$toast('禁用成功！')
                      } else {
                        this.$toast(data.message)
                      }
                    }
                  })
                }
              } else {
                sAjax({
                  url: '/api/pwps/units/forbidden/relieve/' + record.id,
                  type: 'post',
                  success: (data) => {
                    if (data.state) {
                      this._refreshTable()
                      this.$toast('启用成功！')
                    } else {
                      this.$toast(data.message)
                    }
                  }
                })
              }
            }
          }]
        }
      }]
    },
    methods: {
      showAddEmploymentUnitModal: function () {
        this.showAddModal = true
        this.modalType = this.translate.newAdd
        this.isEdit = false
        this.forbidReClick = false
        this.employmentUnit = {
          id: '',
          name: '',
          level: 'SCHOOL',
          managerUsers: [],
          masterUsers: [],
          collegeCode: ''
        },
          this.manager = {
            name: '',
            userNo: '',
            userId: '',
            errorMessage: '',
            isCheckUserId: false
          },
          this.principal = {
            name: '',
            userNo: '',
            userId: '',
            errorMessage: '',
            isCheckUserId: false
          }
      },
      changeRole: function () {
        if (this.modalType === this.translate.newAdd) {
          this._addEmploymentUnit()
        } else if (this.modalType === this.translate.edit) {
          this._editEmploymentUnit()
        }
      },
      _addEmploymentUnit: function () {
        if (!this.employmentUnit.name) {
          this.$toast(this.translate.unitNameNoExistedTip)
          return
        }
        if (this.employmentUnit.level === 'COLLEGE') {
          if (!this.employmentUnit.collegeCode) {
            this.$toast('请选择学院')
            return
          }
        }
        if (this.employmentUnit.masterUsers.length == 0) {
          this.$toast('请添加用工单位经办人')
          return
        }
        if (this.employmentUnit.managerUsers.length == 0) {
          this.$toast('请添加用工单位负责人')
          return
        }
        if (this.forbidReClick) {
          return
        }
        this.forbidReClick = true
        sAjax({
          url: '/api/pwps/units',
          type: 'post',
          data: this.employmentUnit,
          success: (data) => {
            this.forbidReClick = false
            if (data.state) {
              this.showAddModal = false
              this._refreshTable()
              this.$toast('添加成功！')
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      _editEmploymentUnit: function () {
        if (!this.employmentUnit.name) {
          this.$toast(this.translate.unitNameNoExistedTip)
          return
        }
        if (this.employmentUnit.level === 'COLLEGE') {
          if (!this.employmentUnit.collegeCode) {
            this.$toast('请选择学院')
            return
          }
        }
        if (this.employmentUnit.masterUsers.length == 0) {
          this.$toast('请添加用工单位经办人')
          return
        }
        if (this.employmentUnit.managerUsers.length == 0) {
          this.$toast('请添加用工单位负责人')
          return
        }
        sAjax({
          url: '/api/pwps/units/update',
          type: 'post',
          data: this.employmentUnit,
          success: (data) => {
            if (data.state) {
              this.showAddModal = false
              this._refreshTable()
              this.$toast('保存成功！')
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      checkUser: function (type, userNo) {
        if (!userNo) {
          if (type === 'manager') {
            this.manager.errorMessage = this.translate.checkManagerUserIdTip
          } else {
            this.principal.errorMessage = this.translate.checkPrincipalUserIdTip
          }
          return
        }
        sAjax({
          url: '/api/users/' + userNo,
          type: 'GET',
          success: (data) => {
            if (data.state) {
              if (type === 'manager') {
                this.manager.userId = data.data.userId
                this.manager.name = data.data.name
                this.manager.errorMessage = ''
                this.manager.isCheckUserId = true
              } else {
                this.principal.userId = data.data.userId
                this.principal.name = data.data.name
                this.principal.errorMessage = ''
                this.principal.isCheckUserId = true
              }
            } else {
              if (type === 'manager') {
                this.manager.isCheckUserId = false
                this.manager.errorMessage = this.translate.userNoExistedTip
              } else {
                this.principal.isCheckUserId = false
                this.principal.errorMessage = this.translate.userNoExistedTip
              }
            }
          }
        })
      },
      addNewUser: function (type) {
        if (type === 'manager') {
          if (!this.manager.isCheckUserId) {
            this.manager.errorMessage = this.translate.addUserTip
            return
          }
          var mark = false
          if (this.employmentUnit.managerUsers.length > 0) {
            this.employmentUnit.managerUsers.forEach((ele, i) => {
              if (ele.userId === this.manager.userId) {
                mark = true
                this.$toast(this.translate.userEistedTip)
                return
              } else {
                mark = false
              }
            })
          }
          if (!mark) {
            this.employmentUnit.managerUsers.push({
              userId: this.manager.userId,
              name: this.manager.name
            })
          }
        } else {
          if (!this.principal.isCheckUserId) {
            this.principal.errorMessage = this.translate.addUserTip
            return
          }
          var mark = false
          if (this.employmentUnit.masterUsers.length > 0) {
            this.employmentUnit.masterUsers.forEach((ele, i) => {
              if (ele.userId === this.principal.userId) {
                mark = true
                this.$toast(this.translate.userEistedTip)
                return
              } else {
                mark = false
              }
            })
          }
          if (!mark) {
            this.employmentUnit.masterUsers.push({
              userId: this.principal.userId,
              name: this.principal.name
            })
          }
        }
      },
      removeUser: function (type, userId) {
        if (type === 'manager') {
          this.employmentUnit.managerUsers.forEach((ele, i) => {
            if (ele.userId === userId) {
              this.employmentUnit.managerUsers.splice(i, 1)
            }
          })
        } else {
          this.employmentUnit.masterUsers.forEach((ele, i) => {
            if (ele.userId === userId) {
              this.employmentUnit.masterUsers.splice(i, 1)
            }
          })
        }
      },
      collegeSelected: function (obj) {
        this.employmentUnit.collegeCode = obj.value
      },
      _refreshTable: function () {
        this.timeStamp = createTime()
      }
    }
  }
</script>
<style lang="less">
@import url("../../assets/common.less");
#employment-unit-manage {
  .add {
    background: #ffffff;
    border: none;
  }
  .level-text,.input-label,.college-text{
     width:80px;
     text-align: right;
    }
    .radio-area{
      margin-left:18px;
      position: relative;
      top:2px;
    }
  .unit-name-label {
    margin-left: 21px;
  }
  .remove-icon {
    color: rgba(0, 0, 0, 0.4);
    cursor: pointer;
    margin-top: -2px;
  }
  .user-list {
    max-height: 100px;
    overflow-y: auto;
    margin: 10px 50px 10px 92px;
  }
  .error-message {
    margin-left: 92px;
    margin-top: 5px;
    color: red;
  }
  .search-select {
    width: 220px;
    margin: 0 18px;
  }
}
</style>
