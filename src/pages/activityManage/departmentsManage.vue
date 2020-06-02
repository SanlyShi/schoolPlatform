<template>
  <div id="organization-manage" class="container-fluid" v-if="!isImportPage">
    <div class="row text-center" v-if="pageSign === 'organizationList'">
      <v-table ref="organizationTable" :title="listTitle" :url="listUrl" pagesize="10" idField="id" :columns="listColumns" :multiple="false" :order="true" :search="false">
        <div slot="btn-group" role="group">
          <div class="btn-group college-select pull-left" v-if="organizationType === 'college'">
            <v-select
              :options="collegeOptions"
              :value="defaultCode"
              options-value="code"
              options-label="name"
              close-on-select justify
              @afterSelected="_changeCollege">
            </v-select>
          </div>
          <div class="btn-group pull-right ">
            <button type="button" class="btn batch-add-btn btn-bgColor-style clearBtnBorder" @click="_export">{{translate.export}}</button>
            <button type="button" class="btn batch-add-btn btn-bgColor-style clearBtnBorder" @click="_batchAdd">{{translate.batchAddOrganization}}</button>
            <button type="button" class="btn add-organization btn-bgColor-style clearBtnBorder" @click="_showAddOrganizationModal"><i class="maticon pull-left" v-html="icons('add')">add</i>{{translate.add}}{{translate.organization}}</button>
          </div>
        </div>
      </v-table>
    </div>
    <div class="row" v-else-if="pageSign === 'member'">
      <div class="back-parent-page" >
        <button type="button" class="btn back-btn clearBtnBorder" @click="_backParentPage">
          <i class="maticon back-icon-btn" v-html="icons('arrow_back')">arrow_back</i><span class="nav-title">{{parentPageTitle}}</span>
        </button>
      </div>
      <v-table ref="memberTable" :title="memberTitle" :url="memberUrl" pagesize="10" idField="id" :columns="memberColumns" :multiple="false" :order="true" :search="false">
        <div slot="btn-group" class="btn-group pull-right " role="group">
          <button type="button" class="btn batch-add-btn btn-bgColor-style clearBtnBorder" @click="_batchAddMember">{{translate.batch}}{{translate.add}}{{translate.member}}</button>
          <button type="button" class="btn add-organization btn-bgColor-style clearBtnBorder" @click="_showAddMemberModal"><i class="maticon pull-left" v-html="icons('add')">add</i>{{translate.add}}{{translate.member}}</button>
        </div>
      </v-table>
    </div>
    <div class="row" v-else>
      <div class="back-parent-page" >
        <button type="button" class="btn back-btn clearBtnBorder" @click="_backParentPage">
          <i class="maticon back-icon-btn" v-html="icons('arrow_back')">arrow_back</i><span class="nav-title">{{parentPageTitle}}</span>
        </button>
      </div>
      <v-table ref="positionTable" :title="positionTitle" :url="positionUrl" pagesize="10" idField="id" :columns="positionColumns" :multiple="false" :order="true" :search="false">
        <div slot="btn-group" class="btn-group pull-right " role="group">
          <button type="button" class="btn batch-add-btn btn-bgColor-style clearBtnBorder" @click="_batchAddPosition">{{translate.batch}}{{translate.add}}{{translate.position}}</button>
          <button type="button" class="btn add-organization btn-bgColor-style clearBtnBorder" @click="_showAddPositionModal"><i class="maticon pull-left" v-html="icons('add')">add</i>{{translate.add}}{{translate.position}}</button>
        </div>
      </v-table>
    </div>
    <v-modal :show="showAddOrganizationModal" effect="fade" width="446" class="organization-modal">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
          {{listModalType}}{{translate.organization}}
        </h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="form-group">
          <input  type="text" class="form-control search-input organization-input" :placeholder="translate.namePlaceholder" maxlength="50" v-model="organization.orgName">
        </div>
        <div class="form-group">
          <input  type="text" class="form-control search-input organization-input" :placeholder="translate.instructorPlaceholder" v-model="organization.userNo">
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="showAddOrganizationModal = false">{{translate.cancel}}</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="_changeOrganization">{{translate.confirm}}</button>
      </div>
    </v-modal>
    <v-modal :show="showAddMemberModal" effect="fade" width="446" class="organization-modal">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
          {{translate.add}}{{translate.member}}
        </h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="form-group">
          <input  type="text" class="form-control search-input organization-input" :placeholder="translate.enter + translate.userNo" v-model="memberUserNo">
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="showAddMemberModal = false">{{translate.cancel}}</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="_checkMemberUserNo">{{translate.confirm}}</button>
      </div>
    </v-modal>
     <v-modal :show="showAddPositionModal" effect="fade" width="446" class="organization-modal">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
          {{positionModalType}}{{translate.position}}{{translate.info}}
        </h5>
      </div>
      <div slot="modal-body" class="modal-body position-info-body">
        <div class="form-group">
          <input  type="text" class="form-control search-input organization-input" :placeholder="translate.enter + translate.userNo" v-model="positionUserNo">
        </div>
        <div class="form-group">
          <input  type="text" class="form-control search-input organization-input" :placeholder="translate.enter + translate.position" v-model="positionName">
        </div>
        <div class="form-group">
          <v-datepicker ref="startTime" class="btn-block time-picker" :format="yyyy-MM-dd" :placeholder="translate.startTime" :clearButton="false" :showTime="false" @daySelected="_startTimeSelected"></v-datepicker>
        </div>
        <div class="form-group">
          <v-datepicker ref="endTime" class="btn-block time-picker" :format="yyyy-MM-dd" :placeholder="translate.endTime" :clearButton="false" :showTime="false" @daySelected="_endTimeSelected"></v-datepicker>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="showAddPositionModal = false">{{translate.cancel}}</button>
        <button type="button" class="btn submit-btn clearBtnBorder"  @click="_changePosition">{{translate.confirm}}</button>
      </div>
    </v-modal>
  </div>
  <v-import v-bind="importDutyParams"  @backParentPage="backToDutyList" v-else-if="importDutyParams.show"></v-import>
  <v-import v-bind="importParams"  @backParentPage="backParentPage" v-else></v-import>
</template>

<script>
  import Vue from 'vue'
  import { sAjax, translation } from '../../assets/utils/utils.js'

  export default {
    props: {
      data: {
        default: null
      }
    },
    created: function () {
      var la = localStorage.getItem('lang')
      var that = this
      if (translation(la)) {
        this.lang = la
      }
      this.organizationType = this.data.data.id
      if (this.organizationType === 'college') {
        this.listTitle = ''
        this.importParams.parentPageTitle = this.translate.collegeTitle
        this.newOrganizationType = 'COLLEGE'
        sAjax({
          url: '/api/currentUser/role/manageColleges?roleId=22',
          dataType: 'json',
          type: 'get',
          success: (data) => {
            if (data.state) {
              if (data.data.length > 0) {
                this.collegeOptions = data.data
                this.defaultCode = data.data[0].code
                this.collegeName = data.data[0].name
              }
            } else {
              this.$toast(data.message)
            }
          }
        })
      } else {
        this.listTitle = ''
        this.importParams.parentPageTitle = this.translate.schoolTitle
        this.newOrganizationType = 'SCHOOL'
      }
      this.listColumns = [{
        id: 'name',
        title: this.translate.name,
        className: 'text-left',
        hidden: false,
        search: {
          type: 'input',
          data: {
            placeholder: ''
          }
        }
      }, {
        id: 'instructorName',
        title: this.translate.instructor,
        className: 'text-left',
        hidden: false
      },
      {
        id: 'opt',
        title: this.translate.opt,
        className: 'text-center',
        width: '230px',
        hidden: false,
        formatter: function (obj) {
          return [{
            tag: 'a',
            text: that.translate.organization + that.translate.member,
            className: 'opt-btn',
            callback: function (record, index) {
              that.pageSign = 'member'
              that.organizationId = record.id
              that.memberTitle = that.translate.member + that.translate.table
              that.parentPageTitle = record.name
              that.memberUrl = '/table-data/sc/organizations/' + record.id + '/members'
            }
          }, {
            tag: 'a',
            text: that.translate.position,
            className: 'opt-btn',
            callback: function (record, index) {
              that.pageSign = 'position'
              that.organizationId = record.id
              that.positionTitle = that.translate.position + that.translate.table
              that.parentPageTitle = record.name
              that.importDutyParams.parentPageTitle = record.name + '职务列表'
              that.positionUrl = '/table-data/sc/organizations/' + record.id + '/duties'
              that.positionBaseUrl = '/table-data/sc/organizations/' + record.id + '/duties'
            }
          }, {
            tag: 'a',
            text: that.translate.edit,
            className: 'opt-btn',
            callback: function (record, index) {
              that.showAddOrganizationModal = true
              that.listModalType = that.translate.edit
              that.organization = {
                orgName: record.name,
                userNo: record.instructorNo
              }
              that.organizationId = record.id
            }
          }, {
            tag: 'a',
            text: obj.enable ? that.translate.dsable : that.translate.enable,
            className: 'opt-btn',
            callback: function (record, index) {
              sAjax({
                url: '/api/sc/organizations/' + record.id + '/availability',
                dataType: 'json',
                type: 'post',
                data: {
                  enable: obj.enable ? false : true
                },
                success: function (data) {
                  if (data.state) {
                    that.$toast(that.translate.optTips)
                    that.timestamp = new Date().getTime()
                  } else {
                    that.$toast(data.message)
                  }
                }
              })
            }
          }]
        }
      }]
      this.memberColumns = [{
        id: 'name',
        title: this.translate.studentName,
        className: 'text-left',
        hidden: false,
        search: {
          type: 'input',
          data: {
            placeholder: ''
          }
        }
      }, {
        id: 'userNo',
        title: this.translate.userNo,
        className: 'text-left',
        hidden: false,
        search: {
          type: 'input',
          data: {
            placeholder: ''
          }
        }
      }, {
        id: 'collegeName',
        title: this.translate.college,
        className: 'text-left',
        hidden: false,
      }, {
        id: 'opt',
        title: this.translate.opt,
        className: 'text-center',
        width: '230px',
        hidden: false,
        formatter: function (obj) {
          return [{
            tag: 'a',
            text: that.translate.delete,
            className: 'opt-btn',
            callback: function (record, index) {
              if (confirm(that.translate.memberRemoveConfirmTip)) {
                sAjax({
                  url: '/api/sc/organizations/' + record.organizationId + '/members/' + record.userId,
                  dataType: 'json',
                  type: 'post',
                  success: (data) => {
                    if (data.state) {
                      that.$toast(that.translate.memberRemoveSuccessTip)
                      that.memberUrl = that.memberUrl + '?timestamp=' + new Date().getTime()
                    } else {
                      that.$toast(that.translate.memberRemoveFailedTip + ':' + data.message)
                    }
                  }
                })
              }
            }
          }]
        }
      }]
      this.positionColumns = [{
        id: 'userName',
        title: this.translate.studentName,
        className: 'text-left',
        hidden: false,
        search: {
          type: 'input',
          data: {
            placeholder: ''
          }
        }
      }, {
        id: 'userNo',
        title: this.translate.userNo,
        className: 'text-left',
        hidden: false,
        search: {
          type: 'input',
          data: {
            placeholder: ''
          }
        }
      }, {
        id: 'dutyName',
        title: this.translate.position,
        className: 'text-left',
        hidden: false,
        search: {
          type: 'input',
          data: {
            placeholder: ''
          }
        }
      }, {
        id: 'fromDate',
        title: this.translate.startTime,
        className: 'text-left',
        hidden: false
      }, {
        id: 'toDate',
        title: this.translate.endTime,
        className: 'text-left',
        hidden: false
      }, {
        id: 'opt',
        title: this.translate.opt,
        className: 'text-center',
        width: '230px',
        hidden: false,
        formatter: function (obj) {
          return [{
            tag: 'a',
            text: that.translate.edit,
            className: 'opt-btn',
            callback: function (record, index) {
              that.showAddPositionModal = true
              that.positionModalType = that.translate.edit
              that.positionUserId = record.userId
              that.positionUserNo = record.userNo
              that.positionName = record.dutyName
              that.$refs.startTime.value = record.fromDate
              that.$refs.endTime.value = record.toDate
              that.positionId = record.id
              that.organizationId = record.organizationId
            }
          }, {
            tag: 'a',
            text: that.translate.delete,
            className: 'opt-btn',
            callback: function (record, index) {
              if (confirm(that.translate.positionRemoveConfirmTip)) {
                sAjax({
                  url: '/api/sc/organizations/' + record.organizationId + '/deleteDuties/' + record.id,
                  dataType: 'json',
                  type: 'post',
                  success: (data) => {
                    if (data.state) {
                      that.$toast(that.translate.memberRemoveSuccessTip)
                      that.positionUrl = that.positionBaseUrl + '?timestamp=' + new Date().getTime()
                    } else {
                      that.$toast(that.translate.memberRemoveFailedTip + ':' + data.message)
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
        listColumns: [],
        memberColumns: [],
        positionColumns: [],
        memberUrl: '',
        positionBaseUrl: '',
        positionUrl: '',
        organizationType: '',
        newOrganizationType: '',
        listTitle: '',
        memberTitle: '',
        positionTitle: '',
        isImportPage: false,
        collegeOptions: [],
        defaultCode: '',
        collegeName: '',
        timestamp: '',
        positionUserNo: '',
        positionName: '',
        positionUserId: '',
        positionId: null,
        showAddOrganizationModal: false,
        showAddMemberModal: false,
        showAddPositionModal: false,
        listModalType: '',
        positionModalType: '',
        organization: {
          orgName: '',
          userNo: ''
        },
        organizationId: null,
        memberUserNo: null,
        memberUserId: null,
        importBtnType: [],
        checkTemplateUrl: '',
        importParams: {
          parentPageTitle: '',
          downloadTemplateUrl: '',
          downloadErrorTemplateUrl: '',
          checkTemplateUrl: '',
          templateName: '',
          importBtnType: null
        },
        importDutyParams: {
          show: false,
          parentPageTitle: '',
          downloadTemplateUrl: '',
          downloadErrorTemplateUrl: '',
          checkTemplateUrl: '',
          templateName: '',
          importBtnType: null
        },
        pageSign: 'organizationList',
        parentPageTitle: '',
        lang: 'zh-cn'
      }
    },
    computed: {
      translate: function () {
        return translation(this.lang).organizationManage
      },
      listUrl: function () {
        if (this.organizationType === 'college') {
          if (this.defaultCode) {
            return '/table-data/sc/organizations?type=' + this.newOrganizationType + '&collegeCode=' + this.defaultCode + '&timestamp=' + this.timestamp
          }
        } else {
          return '/table-data/sc/organizations?type=' + this.newOrganizationType + '&timestamp=' + this.timestamp
        }
      }
    },
    methods: {
      _changeCollege: function (obj) {
        this.defaultCode = obj.value
        this.collegeName = obj.target.selected
      },
      _export: function () {
        var orgName = this.$refs.organizationTable.tableSearchFields.name ? this.$refs.organizationTable.tableSearchFields.name : ''
        sAjax({
          url: '/api/sc/organizations/export/key?name=' + orgName + '&type=' + this.newOrganizationType + '&collegeCode=' + this.defaultCode,
          dataType: 'json',
          type: 'get',
          success: (data) => {
            if (data.state) {
              var fileName = ''
              if (this.organizationType === 'college') {
                fileName = this.collegeName + '组织管理列表'
              } else {
                fileName = '校级组织管理列表'
              }
              window.location.href = '/downloads/sc/organizations/export/excel?key=' + data.data.key + '&fileName=' + fileName
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      _batchAdd: function () {
        this.importParams.downloadTemplateUrl = '/sc/organizations/import/template'
        this.importParams.downloadErrorTemplateUrl = '/sc/organizations/import/error'
        this.importParams.templateName = '组织批量新增模板.xlsx'
        this.importParams.importBtnType = [{
          name: this.translate.incrementImport,
          url: '/sc/organizations/import',
          method: 'post',
          isShowBtn: true,
          success: (data) => {
            if (data.state) {
              this.timestamp = new Date().getTime()
            }
          }
        }]
        this.importParams.checkTemplateUrl = '/sc/organizations/import/check?type=' + this.newOrganizationType + '&collegeCode=' + this.defaultCode
        this.isImportPage = true
      },
      _batchAddMember: function () {
        this.importParams.downloadTemplateUrl = '/sc/organizations/' + this.organizationId + '/members/batch/import/template'
        this.importParams.downloadErrorTemplateUrl = '/sc/organizations/' + this.organizationId + '/members/batch/import/error'
        this.importParams.templateName = '批量新增组织成员模板.xlsx'
        this.importParams.importBtnType = [{
          name: this.translate.incrementImport,
          url: '/sc/organizations/' + this.organizationId + '/members/batch/import',
          method: 'post',
          isShowBtn: true,
          success: (data) => {
            if (data.state) {
              this.memberUrl = this.memberUrl + '?timestamp=' + new Date().getTime()
            }
          }
        }]
        this.importParams.checkTemplateUrl = '/sc/organizations/' + this.organizationId + '/members/batch/import/check'
        this.isImportPage = true
      },
      _showAddOrganizationModal: function () {
        this.showAddOrganizationModal = true
        this.listModalType = this.translate.add
        this.organization = {
          orgName: '',
          userNo: ''
        }
      },
      _showAddMemberModal: function () {
        this.showAddMemberModal = true
        this.memberUserNo = ''
      },
      _showAddPositionModal: function () {
        this.showAddPositionModal = true
        this.positionModalType = this.translate.add
        this.positionUserNo = ''
        this.positionName = ''
        this.$refs.startTime.value = ''
        this.$refs.endTime.value = ''
      },
      _batchAddPosition: function () {
        this.importDutyParams.downloadTemplateUrl = '/sc/organizations/duties/import-template'
        this.importDutyParams.downloadErrorTemplateUrl = '/sc/organizations/' + this.organizationId + '/members/batch/import/error'
        this.importDutyParams.templateName = '批量新增组织职务模板.xlsx'
        this.importDutyParams.importBtnType = [{
          name: this.translate.incrementImport,
          url: '/sc/organizations/duties/import',
          method: 'post',
          isShowBtn: true,
          success: (data) => {
            if (data.state) {
              this.positionUrl = this.positionBaseUrl + '?timestamp=' + new Date().getTime()
            }
          }
        }]
        this.importDutyParams.checkTemplateUrl = '/sc/organizations/' + this.organizationId + '/duties/import-check'
        this.importDutyParams.show = true
        this.isImportPage = true
      },
      backToDutyList: function () {
        this.importDutyParams.show = false
        this.isImportPage = false
      },
      backParentPage: function () {
        this.isImportPage = false
      },
      _changeOrganization: function () {
        if (!this.organization.orgName) {
          this.$toast(this.translate.orgNameTips)
          return false
        }
        if (!this.organization.userNo) {
          this.$toast(this.translate.orgInstructorNoTips)
          return false
        }
        sAjax({
          url: '/api/users/' + this.organization.userNo,
          dataType: 'json',
          type: 'get',
          success: (data) => {
            if (data.state) {
              this.positionUserId = data.data.userId
              if (this.listModalType === this.translate.add) {
                this._addOrganization()
              } else if (this.listModalType === this.translate.edit) {
                this._editOrganization()
              }
            } else {
              if (data.code === '50003' || data.code === '10001' || data.code === '50001') {
                this.$toast('学工号不存在')
              } else {
                this.$toast(data.message)
              }
            }
          }
        })
      },
      _changePosition: function () {
        if (!this.positionName) {
          this.$toast('职务不能为空')
          return false
        }
        if (!this.positionUserNo) {
          this.$toast('学号不能为空')
          return false
        }
        if (!this.$refs.startTime.value) {
          this.$toast('任职开始时间不能为空')
          return false
        }
        if (!this.$refs.endTime.value) {
          this.$toast('任职结束时间不能为空')
          return false
        }
        sAjax({
          url: '/api/users/' + this.positionUserNo,
          dataType: 'json',
          type: 'get',
          success: (data) => {
            if (data.state) {
              this.positionUserId = data.data.userId
              if (this.positionModalType === this.translate.add) {
                this._addPosition()
              } else if (this.positionModalType === this.translate.edit) {
                this._editPosition()
              }
            } else {
              if (data.code === '50003' || data.code === '10001' || data.code === '50001') {
                this.$toast('学工号不存在')
              } else {
                this.$toast(data.message)
              }
            }
          }
        })

      },
      _addPosition: function () {
        sAjax({
          url: '/api/sc/organizations/' + this.organizationId + '/duties',
          dataType: 'json',
          type: 'post',
          data: {
            dutyName: this.positionName,
            userId: this.positionUserId,
            fromDate: this.$refs.startTime.value,
            toDate: this.$refs.endTime.value
          },
          success: (data) => {
            if (data.state) {
              this.$toast(this.translate.optTips)
              this.showAddPositionModal = false
              this.positionUrl = this.positionUrl + '?timestamp=' + new Date().getTime()
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      _editPosition: function () {
        sAjax({
          url: '/api/sc/organizations/' + this.organizationId + '/duties/' + this.positionId,
          dataType: 'json',
          type: 'post',
          data: {
            dutyName: this.positionName,
            userId: this.positionUserId,
            fromDate: this.$refs.startTime.value,
            toDate: this.$refs.endTime.value
          },
          success: (data) => {
            if (data.state) {
              this.$toast(this.translate.optTips)
              this.showAddPositionModal = false
              this.positionUrl = this.positionUrl + '?timestamp=' + new Date().getTime()
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      _addOrganization: function () {
        sAjax({
          url: '/api/sc/organizations',
          dataType: 'json',
          type: 'post',
          data: {
            name: this.organization.orgName,
            userNo: this.organization.userNo,
            type: this.newOrganizationType,
            collegeCode: this.defaultCode
          },
          success: (data) => {
            if (data.state) {
              this.$toast(this.translate.optTips)
              this.showAddOrganizationModal = false
              this.timestamp = new Date().getTime()
            } else {
              if (data.code === '50003') {
                this.$toast('组织名称已存在')
              } else {
                this.$toast(data.message)
              }
            }
          }
        })
      },
      _editOrganization: function () {
        sAjax({
          url: '/api/sc/organizations/' + this.organizationId,
          dataType: 'json',
          type: 'post',
          data: {
            name: this.organization.orgName,
            userNo: this.organization.userNo
          },
          success: (data) => {
            if (data.state) {
              this.$toast(this.translate.optTips)
              this.showAddOrganizationModal = false
              this.timestamp = new Date().getTime()
            } else {
              if (data.code === '50003') {
                this.$toast('组织名称已存在')
              } else {
                this.$toast(data.message)
              }
            }
          }
        })
      },
      _backParentPage: function () {
        this.pageSign = 'organizationList'
      },
      _checkMemberUserNo: function () {
        if (!this.memberUserNo) {
          this.$toast(this.translate.userNoExistedTip)
          return false
        }
        sAjax({
          url: '/api/sc/organizations/' + this.organizationId + '/members/' + this.memberUserNo + '/existence',
          dataType: 'json',
          type: 'get',
          success: (data) => {
            if (data.state) {
              this._addMember(data.data.userId)
            } else {
              if (data.code === '50003' || data.code === '10001' || data.code === '50001') {
                this.$toast('学号不存在')
              } else {
                this.$toast(data.message)
              }
            }
          }
        })
      },
      _addMember: function (memberUserId) {
        sAjax({
          url: '/api/sc/organizations/' + this.organizationId + '/members',
          dataType: 'json',
          type: 'post',
          data: {
            userId: memberUserId
          },
          success: (data) => {
            if (data.state) {
              this.$toast(this.translate.optTips)
              this.showAddMemberModal = false
              this.memberUrl = this.memberUrl + '?timestamp=' + new Date().getTime()
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      _startTimeSelected: function (data) {
        if (this.$refs.endTime.value) {
          var timeString = new Date(data.value).getTime() - new Date(this.$refs.endTime.value).getTime()
          if (timeString > 0) {
            this.$toast('开始时间要在结束时间之前')
            this.$refs.startTime.value = ''
            return false
          } else {
            this.$refs.startTime.value = data.value
          }
        } else {
          this.$refs.startTime.value = data.value
        }
      },
      _endTimeSelected: function (data) {
        if (this.$refs.startTime.value) {
          var timeString = new Date(data.value).getTime() - new Date(this.$refs.startTime.value).getTime()
          if (timeString < 0) {
            this.$toast('结束时间要在开始时间之后')
            this.$refs.endTime.value = ''
            return false
          } else {
            this.$refs.endTime.value = data.value
          }
        } else {
          this.$refs.endTime.value = data.value
        }
      }
    }
  }
</script>
<style lang="less">
@import url("../../assets/common.less");
#organization-manage {
  .back-parent-page {
    margin-bottom: 10px;
    .back-btn {
      padding: 0;
      background: transparent;
    }
    .back-icon-btn {
      font-size: 20px;
      color: rgba(0, 0, 0, 0.54);
      line-height: 20px;
      cursor: pointer;
      vertical-align: middle;
    }
    .nav-title {
      font-size: 13px;
      color: rgba(0, 0, 0, 0.54);
      line-height: 13px;
      margin: 5px 0 0 8px;
      font-weight: 500;
      vertical-align: middle;
    }
  }

  .college-select {
    margin-left: -11px;
    .btn-group .form-control.dropdown-toggle {
      border: none;
      box-shadow: none;
      font-size: 16px;
    }
  }
  .btn-group > .add-organization:last-child:not(:first-child) {
    border-radius: 4px;
  }
  .add-organization {
    font-size: 13px;
    color: #298df7;
    font-weight: 500;
    margin-right: 12px;
     &:hover{
      color: #16a4ff;
    }
    i {
      font-size: 18px;
      color: #298df7;
      margin-right: 3px;
      margin-top: -2px;
       &:hover{
      color: #16a4ff;
    }
    }
  }
  .export-btn,
  .batch-add-btn {
    font-size: 13px;
    color: #298df7;
    &:hover{
      color: #16a4ff;
    }
  }
  .batch-add-btn {
    margin-right: 13px;
  }
  .organization-modal {
    .modal-title {
      margin-left: 10px;
      font-size: 16px;
      color: rgba(0, 0, 0, 0.87);
      padding: 6px 0;
    }
    .modal-body {
      padding: 15px 15px 0;
      &.position-info-body {
        height: 230px;
      }
      
      .form-group {
        margin-bottom: 15px;
      }
      .organization-input {
        height: 56px;
        padding-left: 24px;
        font-size: 13px;
        color: rgba(0, 0, 0, 0.86);
        border-bottom: 1px solid #e0e0e0;
        &:focus {
          border-color: #298df7;
          box-shadow: none;
          -webkit-box-shadow: none;
        }
      }
    }
    .modal-footer {
      border-top: 0 solid #ffffff;
    }
  }
}
</style>

