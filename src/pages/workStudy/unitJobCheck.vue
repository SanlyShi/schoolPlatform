<template>
  <div id="unitJobCheck" class="container-fluid" v-if="curRouter === 'unitJobCheck'">
    <div class="row text-center" style="position: relative;">
      <v-table ref="jobTabel" 
        :url="checkTabId?`${checkUrl}?nodeId=${checkTabId}&nodeType=${checkType}&timeStamp=${timeStamp}`:''"
        pagesize="10" 
        idField="id"
        :order="true" 
        :multiple="allowBatchOperation" 
        :search="false" 
        :columnsControl="true" 
        :columns="columns" 
        @afterChecked="_afterChecked">
        <div slot="btn-group" role="group">
          <div class="btn-group pull-left">
            <div class="batch-options" v-if="tableCheckedList.length > 0">
              <span class="pull-left">已选择{{tableCheckedList.length}}项，其中可操作的有{{tableCheckedIds.length}}项</span>
              <div class="pull-left" style="margin-left:20px">
                <button type="button" class="btn btn-bgColor-style table-btn clearBtnBorder" @click="checkOpt('pass',tableCheckedIds)">通过</button>
                <button type="button" class="btn btn-bgColor-style   table-btn clearBtnBorder" @click="checkOpt('unpass',tableCheckedIds)">不通过</button>
              </div>
            </div>
            <v-select :value="checkTabId" :options="checkTabs"  optionsLabel="name" optionsValue="id" @afterSelected="changeCheckTab" v-else></v-select>
          </div>
          <div class="btn-group pull-right">
            <button type="button" class="btn btn-bgColor-style table-btn clearBtnBorder" @click="_exportFile">导出</button>
          </div>
        </div>
      </v-table>
    </div>
    <v-modal :show="showExportModal">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
          导出字段配置
        </h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="field-list">
          <div class="field-item"
            :class="{
              active: exportFieldList.indexOf(field.id)>=0
            }"
            v-for="(field, i) in columns" :key="i" @click="_checkField(field)" v-if="field.id !== 'opt'">
            <i class="maticon pull-left" v-html="icons(exportFieldList.indexOf(field.id)>=0?'check_box':'check_box_outline_blank')"></i>
            <span>{{field.title}}</span>
          </div>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="showExportModal = false">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder">开始导出</button>
      </div>
    </v-modal>
     <v-modal :show="showUnpassOpinionModal" width="500">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
          确定不通过该申请吗？
        </h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="form-group">
          <textarea cols="24" rows="5" placeholder="请输入不通过的意见" class="unpass-modal-textarea"  maxlength="600" v-model="opinion"></textarea>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="showUnpassOpinionModal = false">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder"  @click="submitUnpassOpinion">确定</button>
      </div>
    </v-modal>
  </div>
  <jobDeclare  :jobFormInfo="jobFormInfo" :optParameter="optParameter" :newJobDeclareData="jobDeclareData" :jobParameter="jobParameter" @back="_backJobCheck" @unpass="_unpass" @pass="_pass" @revoke="_revoke" v-else>

  </jobDeclare>
</template>

<script>
  import Vue from 'vue'
  import { sAjax, translation, createTime } from '../../assets/utils/utils.js'
  import jobDeclare from './jobDeclare.vue'
  Vue.component('jobDeclare', jobDeclare)
  export default {
    created: function () {
      var la = localStorage.getItem('lang')
      var that = this
      if (translation(la)) {
        this.lang = la
      }
      this.isTodifficultStudentData = [{ id: 'true', text: '是' }, { id: 'false', text: '否' }]
      this.canApplyData = [{ id: 'true', text: '是' }, { id: 'false', text: '否' }]
      sAjax({
        url: '/api/pwps/workflow/runtime/position/nodes',
        dataType: 'json',
        type: 'get',
        success: (data) => {
          if (data.state) {
            if (data.data) {
              data.data.forEach((ele, index) => {
                if (ele.type === 'SCHOOL') {
                  this.checkTabs.push({
                    id: ele.id,
                    name: '全校岗位审核',
                    type: ele.type,
                    allowBatchOperation: ele.allowBatchOperation,
                    allowReject: ele.allowReject
                  })
                } else if (ele.type === 'COLLEGE') {
                  this.checkTabs.push({
                    id: ele.id,
                    name: '本院岗位审核',
                    type: ele.type,
                    allowBatchOperation: ele.allowBatchOperation,
                    allowReject: ele.allowReject
                  })
                } else {
                  this.checkTabs.push({
                    id: ele.id,
                    name: '本单位岗位审核',
                    type: ele.type,
                    allowBatchOperation: ele.allowBatchOperation,
                    allowReject: ele.allowReject
                  })
                }
              })
              this.checkTabId = this.checkTabs[0].id
              this.checkType = this.checkTabs[0].type
              this.allowBatchOperation = this.checkTabs[0].allowBatchOperation
              this.allowReject = this.checkTabs[0].allowReject
            }
          } else {
            this.$toast(data.message)
          }
        }
      })
      sAjax({
        url: '/api/pwps/workflow/runtime/position/search/options',
        dataType: 'json',
        type: 'get',
        success: (data) => {
          if (data.state) {
            if (data.data) {
              this.columns = [{
                id: 'unitName',
                title: '单位名称',
                className: 'text-left',
                hidden: false,
                search: {
                  type: 'input',
                  data: {
                    placeholer: '',
                    autoFocus: true
                  }
                },
                formatter: (record) => {
                  return record.unit.name
                }
              }, {
                id: 'unitLevel',
                title: '所属级别',
                className: 'text-left',
                hidden: false,
                width: 80,
                formatter: (record) => {
                  return record.unit.level === 'SCHOOL' ? '校级' : '院级'
                },
                search: {
                  type: 'select',
                  data: {
                    options: data.data.unitLevel,
                    optionsLabel: 'text',
                    optionsValue: 'id'
                  }
                }
              }, {
                id: 'positionName',
                title: '岗位名称',
                className: 'text-left',
                hidden: false,
                search: {
                  type: 'input',
                  data: {
                    placeholer: '',
                    autoFocus: true
                  }
                },
                formatter: (record) => {
                  return record.position.positionName
                }
              }, {
                id: 'year',
                title: '学年',
                className: 'text-left',
                hidden: false,
                width: 100,
                formatter: function (record) {
                  return record.position.schoolYear&&record.position.schoolYear.name
                },
                search: {
                  type: 'select',
                  data: {
                    url: '/api/pwps/positions/all/schoolYears',
                    optionsLabel: 'name',
                    optionsValue: 'id'
                  }
                }
              }, {
                id: 'masterName',
                title: '用工单位经办人姓名',
                className: 'text-left',
                hidden: false,
                search: {
                  type: 'input',
                  data: {
                    placeholer: '',
                    autoFocus: true
                  }
                },
                formatter: function (record) {
                  return record.position.manager&&record.position.manager.name
                }
              }, {
                id: 'masterUserNo',
                title: '用工单位经办人工号',
                className: 'text-left',
                hidden: false,
                search: {
                  type: 'input',
                  data: {
                    placeholer: '',
                    autoFocus: true
                  }
                },
                formatter: (record) => {
                  return record.position.manager&&record.position.manager.userNo
                }
              }, {
                id: 'auditStatus',
                title: '审核状态',
                className: 'text-left',
                hidden: false,
                width: 100,
                formatter: (record) => {
                  return record.statusLabel
                },
                search: {
                  type: 'select',
                  data: {
                    options: data.data.auditStatus,
                    optionsLabel: 'text',
                    optionsValue: 'id'
                  }
                }
              }, {
                id: 'positionType',
                title: '岗位类型',
                className: 'text-left',
                hidden: true,
                formatter: (record) => {
                  var label = ''
                  this.positionTypeData.forEach((ele, index) => {
                    if (ele.value === record.position.positionType) {
                      label = ele.label
                    }
                  })
                  return label
                },
                search: {
                  type: 'select',
                  data: {
                    url: '/api/system/dicts?dictType=岗位类型',
                    optionsLabel: 'label',
                    optionsValue: 'value'
                  }
                }
              }, {
                id: 'personCount',
                title: '岗位人数',
                className: 'text-left',
                hidden: true,
                formatter: (record) => {
                  return record.position.personCount
                }
              }, {
                id: 'userIncumbencyCount',
                title: '在岗人数',
                className: 'text-left',
                hidden: true,
                formatter: (record) => {
                  return record.position.userIncumbencyCount
                }
              }, {
                id: 'rewardStandard',
                title: '薪酬标准',
                className: 'text-right',
                hidden: true,
                formatter: (record) => {
                  return record.position.rewardStandard
                }
              }, {
                id: 'salaryCapMonth',
                title: '月工资上限',
                className: 'text-right',
                hidden: true,
                formatter: (record) => {
                  return record.position.salaryCapMonth
                }
              }, {
                id: 'isToDifficultyStudent',
                title: '针对困难生',
                className: 'text-left',
                hidden: true,
                formatter: function (record) {
                  return record.position.isToDifficultyStudent ? '是' : '否'
                },
                search: {
                  type: 'select',
                  data: {
                    options: this.isTodifficultStudentData,
                    optionsLabel: 'text',
                    optionsValue: 'id'
                  }
                }
              }, {
                id: 'canApply',
                title: '允许学生申请',
                className: 'text-left',
                hidden: true,
                formatter: function (record) {
                  return record.position.canApply ? '是' : '否'
                },
                search: {
                  type: 'select',
                  data: {
                    options: this.isTodifficultStudentData,
                    optionsLabel: 'text',
                    optionsValue: 'id'
                  }
                }
              }, {
                id: 'address',
                title: '工作地点',
                className: 'text-left',
                hidden: true,
                search: {
                  type: 'input',
                  data: {
                    placeholer: '',
                    autoFocus: true
                  }
                },
                formatter: function (record) {
                  return record.position.address
                }
              }, {
                id: 'workingTime',
                title: '工作时段',
                className: 'text-left',
                hidden: true,
                search: {
                  type: 'input',
                  data: {
                    placeholer: '',
                    autoFocus: true
                  }
                },
                formatter: function (record) {
                  return record.position.workingTime
                }
              }, {
                id: 'jobStartTime',
                title: '工作开始时间',
                className: 'text-left',
                hidden: true,
                formatter: function (record) {
                  return record.position.jobStartTime.split(' 00:00:00')[0]
                }
              }, {
                id: 'jobEndTime',
                title: '工作结束时间',
                className: 'text-left',
                hidden: true,
                formatter: function (record) {
                  return record.position.jobEndTime.split(' 00:00:00')[0]
                }
              }, {
                id: 'applyStartTime',
                title: '申请开始时间',
                className: 'text-left',
                hidden: true,
                formatter: function (record) {
                  return record.position.applyStartTime.split(' 00:00:00')[0]
                }
              }, {
                id: 'applyEndTime',
                title: '申请结束时间',
                className: 'text-left',
                hidden: true,
                formatter: function (record) {
                  return record.position.applyEndTime.split(' 00:00:00')[0]
                }
              }, {
                id: 'opt',
                className: 'text-center',
                title: '操作',
                width: '130px',
                hidden: false,
                formatter: (recordItem) => {
                  var viewJosn = {
                    tag: 'a',
                    text: '查看',
                    className: 'opt-btn',
                    callback: (record, index) => {
                      this.showJobModal = true
                      this.optParameter = {
                        isCheck: true,
                        optsType: recordItem.currentNodeStatus === 'TODO' ? 'check' : 'revoke',
                        canCancel: false,
                        canResubmit: false,
                        canRevoke: record.canRevoke,
                        isShowLog: true
                      }
                      this.jobParameter = {
                        positionId: record.id,
                        isView: true,
                        unitName: record.position.unit.name
                      }
                      this.jobDeclareData = {
                        unitId: record.position.unit.id,
                        managerId: record.position.manager.userId,
                        userNo: record.position.manager.userNo,
                        userName: record.position.manager.name,
                        positionType: record.position.positionType,
                        positionName: record.position.positionName,
                        address: record.position.address,
                        rewardStandard: record.position.rewardStandard, //报酬标准
                        jobStartTime: record.position.jobStartTime.split(' 00:00:00')[0],
                        jobEndTime: record.position.jobEndTime.split(' 00:00:00')[0],
                        applyStartTime: record.position.applyStartTime.split(' 00:00:00')[0],
                        applyEndTime: record.position.applyEndTime.split(' 00:00:00')[0],
                        schoolYearId: record.position.schoolYear.id,
                        contact: record.position.contact,
                        personCount: record.position.personCount, //岗位人数
                        workingTime: record.position.workingTime, //工作时段
                        salaryCapMonth: record.position.salaryCapMonth, //月工资上限
                        totalWork: record.position.totalWork, //岗位总工时上限
                        isToDifficultyStudent: record.position.isToDifficultyStudent, //只针对困难生
                        canApply: record.position.canApply, //允许学生请求
                        description: record.position.description,
                        positionRequire: record.position.positionRequire,
                        remark: record.position.remark,
                        campus: record.position.campus
                      }
                      this.currentNodeStatus = record.currentNodeStatus
                      this.positionId = record.id
                      this.curRouter = 'jobDeclarePage'
                    }
                  }

                  if (recordItem.currentNodeStatus === 'TODO') {
                    var opts = [viewJosn, {
                      tag: 'a',
                      text: '通过',
                      className: 'opt-btn',
                      callback: (record, index) => {
                        this.checkOpt('pass', [record.id])
                      }
                    }, {
                        tag: 'a',
                        text: '不通过',
                        className: 'opt-btn',
                        callback: (record, index) => {
                          this.checkOpt('unpass', [record.id])
                        }
                      }]
                    // if (this.allowReject) {
                    //   opts.push({
                    //     tag: 'a',
                    //     text: '驳回',
                    //     className: 'opt-btn',
                    //     hidden: false,
                    //     callback: (record, index) => {

                    //     }
                    //   })
                    // }
                    return opts
                  } else {
                    var opts = [viewJosn]
                    return opts
                  }
                }
              }]
            }
          } else {
            this.$toast(data.message)
          }
        }
      })
      sAjax({
        url: '/api/system/dicts',
        dataType: 'json',
        type: 'get',
        data: {
          dictType: '校区'
        },
        success: (data) => {
          if (data.state) {
            this.schoolData = data.data
          } else {
            this.$toast(data.message)
          }
        }
      })
      sAjax({
        url: '/api/system/dicts',
        dataType: 'json',
        type: 'get',
        data: {
          dictType: '岗位类型'
        },
        success: (data) => {
          if (data.state) {
            this.positionTypeData = data.data
          } else {
            this.$toast(data.message)
          }
        }
      })

    },
    data: function () {
      return {
        collegeOptions: [],
        currentCollegeId: '',
        columns: [],
        checkUrl: '/table-data/pwps/workflow/runtime/position/instances',
        showJobModal: false,
        isTodifficultStudentData: [],
        canApplyData: [],
        jobDeclareData: {
          unitId: '',
          managerId: '',
          userNo: '',
          userName: '',
          positionType: '',
          positionName: '',
          address: '',
          rewardStandard: '', //报酬标准
          jobStartTime: '',
          jobEndTime: '',
          applyStartTime: '',
          applyEndTime: '',
          schoolYearId: '',
          contact: '',
          personCount: '', //岗位人数
          workingTime: '', //工作时段
          salaryCapMonth: '', //月工资上限
          isToDifficultyStudent: '', //只针对困难生
          canApply: '', //允许学生请求
          description: '',
          positionRequire: '',
          remark: '',
          campus: '',
          unitName: ''
        },
        isView: true,
        tableCheckedList: [],
        positionTypeData: [],
        schoolData: [],
        colleges: [],
        allowReject: '',
        allowBatchOperation: '',
        checkTabs: [],
        checkTabId: '',
        checkType: '',
        checkStatus: {
          SUCCESS: '通过',
          FAILED: '不通过',
          PENDING: '审核中',
          CANCELED: '申请者取消'
        },
        showExportModal: false,
        exportFieldList: [],
        exportIds: [],
        currentNodeStatus: '',
        positionId: '',
        showUnpassOpinionModal: false,
        unpassIds: [],
        opinion: '',
        timeStamp: '',
        curRouter: 'unitJobCheck',
        newJobDeclareData: {},
        jobFormInfo: {
          unitId: '',
          managerId: '',
          userNo: '',
          userName: ''
        },
        optParameter: {
          isCheck: false,
          optsType: '',
          canCancel: false,
          canResubmit: false,
          canRevoke: false,
          isShowLog: false
        },
        jobParameter: {
          positionId: '',
          isView: false,
          unitName: ''
        },
        lang: 'zh-cn'
      }
    },
    computed: {
      translate: function () {
        return translation(this.lang).schoolRoleManage
      },
      tableCheckedIds: function () {
        var arr = []
        this.tableCheckedList.forEach((record) => {
          if (record.currentNodeStatus === 'TODO') {
            arr.push(record.id)
          }
        })
        return arr
      }
    },
    methods: {
      _backJobCheck: function () {
        this.curRouter = 'unitJobCheck'
      },
      _unpass: function (data) {
        this.unpassIds = []
        this.unpassIds.push(this.positionId)
        this.opinion = data.opinion
        this.submitUnpassOpinion()
      },
      _pass: function (jobData) {
        if (window.confirm('确定通过吗？')) {
          sAjax({
            url: '/api/pwps/workflow/runtime/position/instances/success',
            type: 'post',
            data: {
              ids: [this.positionId],
              position: {
                rewardStandard: jobData.rewardStandard,
                salaryCapMonth: jobData.salaryCapMonth,
                personCount: jobData.personCount,
                isToDifficultyStudent: jobData.isToDifficultyStudent,
                canApply: jobData.canApply,
                applyStartTime: jobData.applyStartTime,
                applyEndTime: jobData.applyEndTime,
              }
            },
            success: (data) => {
              if (data.state) {
                this.timeStamp = createTime()
                this.tableCheckedList = []
                this.curRouter = 'unitJobCheck'
                this.$toast('操作成功')
              } else {
                this.$toast(data.message)
              }
            }
          })
        }
      },
      _revoke: function () {
        if (window.confirm('确定撤回吗？')) {
          sAjax({
            url: '/api/pwps/workflow/runtime/position/instances/' + this.positionId + '/revoke',
            type: 'post',
            success: (data) => {
              if (data.state) {
                this.timeStamp = createTime()
                this.$toast('撤回成功')
                this.curRouter = 'unitJobCheck'
              } else {
                this.$toast(data.message)
              }
            }
          })
        }
      },
      _checkField: function (field) {
        var index = this.exportFieldList.indexOf(field.id)
        if (index >= 0) {
          this.exportFieldList.splice(index, 1)
        } else {
          this.exportFieldList.push(field.id)
        }
      },
      changeCheckTab: function (data) {
        this.checkTabId = data.value
        this.checkTabs.forEach((ele, index) => {
          if (ele.id === this.checkTabId) {
            this.allowBatchOperation = ele.allowBatchOperation
            this.allowReject = ele.allowReject
            this.checkType = ele.type
          }
        })
      },
      _exportFile: function () {
        this.tableCheckedList.forEach((ele, index) => {
          this.exportIds.push(ele.id)
        })
        var searchData = this.$refs.jobTabel.tableSearchFields
        var searchText = ''
        for (var i in searchData) {
          if (!searchData[i]) {
            searchText += '&' + i + '=' + ''
          } else {
            searchText += '&' + i + '=' + searchData[i]
          }
        }
        this.$waiting.show()
        sAjax({
          url: '/api/pwps/workflow/runtime/position/instances/export?nodeId=' + this.checkTabId + '&nodeType=' + this.checkType + '&ids=' + this.exportIds + searchText,
          type: 'get',
          success: (data) => {
            if (data.state) {
              window.location.href = '/downloads/pwps/workflow/runtime/download?key=' + data.data
            } else {
              this.$toast(data.message)
            }

          }
        }).always(() => {
          this.$waiting.close()
        })
      },
      checkOpt: function (optType, ids) {
        if (ids.length === 0) {
          this.$toast('当前没有可操作的数据')
          return
        }
        if (optType === 'pass') {
          if (window.confirm('确定通过吗？')) {
            sAjax({
              url: '/api/pwps/workflow/runtime/position/instances/success',
              type: 'post',
              data: {
                ids: ids
              },
              success: (data) => {
                if (data.state) {
                  this.timeStamp = createTime()
                  this.tableCheckedList = []
                  this.curRouter = 'unitJobCheck'
                  this.$toast('操作成功')
                } else {
                  this.$toast(data.message)
                }
              }
            })
          }
        } else {
          this.showUnpassOpinionModal = true
          this.unpassIds = []
          this.unpassIds = ids
          this.opinion = ''
        }

      },
      submitUnpassOpinion: function () {
        if (!this.opinion) {
          return this.$toast('请输入不通过的意见')
        }
        sAjax({
          url: '/api/pwps/workflow/runtime/position/instances/failed',
          type: 'post',
          data: {
            ids: this.unpassIds,
            opinion: this.opinion
          },
          success: (data) => {
            if (data.state) {
              this.timeStamp = createTime()
              this.showUnpassOpinionModal = false
              this.curRouter = 'unitJobCheck'
              this.tableCheckedList = []
              this.$toast('操作成功')
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      _afterChecked: function (checkedRecords) {
        this.tableCheckedList = checkedRecords
      }
    }
  }
</script>
<style lang="less">
@import url("../../assets/common.less");
#unitJobCheck {
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
  .batch-options {
    width: 500px;
    transition: all 0.1s ease;
    span {
      line-height: 32px;
    }
    &.active {
      top: 0;
    }
  }
  .field-list {
    padding: 10px 0;
    user-select: none;
    .field-item {
      display: inline-block;
      margin: 5px 10px;
      color: #999;
      cursor: pointer;
      span {
        display: inline-block;
        margin-left: 4px;
        line-height: 26px;
      }
      &.active {
        color: #303133;
      }
    }
  }
  .modal-body {
    .search-select {
      width: 220px;
      margin: 0 0 0 18px;
    }
    .star {
      color: red;
    }
    .datepicker-group .btn-block {
      width: auto;
    }
    .datepicker-group .form-control[readonly] {
      background: #ffffff;
    }
    .time-picker {
      margin-left: 18px;
      display: inline-block;
      .form-control.v-datepicker-input {
        border-radius: 0;
        border-top: 0 solid #ffffff;
        border-left: 0 solid #ffffff;
        border-right: 0 solid #ffffff;
        border-bottom: 2px solid #e0e0e0;
        box-shadow: inset 0 0px 0px rgba(0, 0, 0, 0.075);
        padding: 0;
        width: 220px !important;
      }
    }
    .one-words-difference-margin {
      margin-left: 13px;
    }
    .two-words-difference-margin {
      margin-left: 28px;
    }
    .three-words-difference-margin {
      margin-left: 41px;
    }
    .four-words-difference-margin {
      margin-left: 55px;
    }
    .other-words-difference-margin {
      margin-left: 83px;
    }
    .unit-name-label {
      margin-left: 17px;
    }
    .textarea-label {
      vertical-align: top;
    }
    .modal-textarea {
      width: 81%;
      resize: none;
      margin-left: 18px;
      padding: 5px;
      border: 2px solid #e0e0e0;
      outline: none;
      &:disabled {
        cursor: not-allowed;
      }
    }
    .unpass-modal-textarea {
      width: 100%;
      resize: none;
      margin-top: 10px;
      padding: 5px;
      border: 0 solid #e0e0e0;
      outline: none;
    }
    .marginTop25px {
      margin-top: 25px;
    }
    .radio-group {
      width: 90%;
      margin-bottom: 18px;
      .radio-area {
        display: inline-block;
        div {
          display: inline-block;
          margin-left: 22px;
        }
      }
    }
  }
}
</style>
