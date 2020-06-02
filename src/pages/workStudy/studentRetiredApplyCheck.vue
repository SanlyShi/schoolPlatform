<template>
  <div class="job-retired-check" v-if="curRouter === 'studentJobApplyCheckList'">
    <div>
      <v-table
        ref="jobTable"
        :url="checkTabId?`${retiredCheckUrl}?nodeId=${checkTabId}&nodeType=${checkType}&timeStamp=${timeStamp}`:''"
        :columns="columns"
        pagesize="10"
        idField="id"
        :multiple="true"
        :order="true" 
        :search="false"
        :columnsControl="true"
        @afterChecked="_tableChecked">
        <div slot="btn-group" role="group" >
          <div class="btn-group pull-left">
            <div class="batch-options" v-if="tableCheckedList.length > 0">
              <span class="pull-left">已选择{{tableCheckedList.length}}项，其中可操作的有{{tableCheckedIds.length}}项</span>
              <div class="pull-left" style="margin-left:20px">
                <button type="button" class="btn btn-bgColor-style clearBtnBorder" @click="checkOpt('pass',tableCheckedIds)">通过</button>
                <button type="button" class="btn btn-bgColor-style clearBtnBorder" @click="checkOpt('unpass',tableCheckedIds)">不通过</button>
              </div>
            </div>
            <v-select :value="checkTabId" :options="checkTabs"  optionsLabel="name" optionsValue="id" @afterSelected="changeCheckTab" v-else></v-select>
          </div>
          <div class="btn-group pull-right">
            <button type="button" class="btn  btn-bgColor-style add clearBtnBorder" @click="_export">导出</button>
          </div>
        </div>
      </v-table>
    </div>
    <v-modal :show="exportModalShow">
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
        <button type="button" class="btn" @click="exportModalShow = false">取消</button>
        <button type="button" class="btn">开始导出</button>
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
          <textarea cols="24" rows="5" placeholder="请输入不通过的意见" class="modal-textarea"  maxlength="600" v-model="opinion"></textarea>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="showUnpassOpinionModal = false">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder"  @click="submitUnpassOpinion">确定</button>
      </div>
    </v-modal>
  </div>
  <jobApplyForm @back="_back" formType="check" @pass="_pass" @unpass="_unpass" @revoke="_revoke" :isApply="false" :formDetail="applicationFormDetail" v-else></jobApplyForm>
</template>

<script>
  import Vue from 'vue'
  import { sAjax, translation, createTime } from '../../assets/utils/utils'
  import jobApplyForm from './jobApplyForm.vue'
  Vue.component('jobApplyForm', jobApplyForm)
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
        url: '/api/pwps/workflow/runtime/positions/out/nodes',
        dataType: 'json',
        type: 'get',
        success: (data) => {
          if (data.state) {
            if (data.data) {
              data.data.forEach((ele, index) => {
                if (ele.type === 'SCHOOL') {
                  this.checkTabs.push({
                    id: ele.id,
                    name: '全校退岗申请审核',
                    type: ele.type,
                    allowBatchOperation: ele.allowBatchOperation,
                    allowReject: ele.allowReject
                  })
                } else if (ele.type === 'COLLEGE') {
                  this.checkTabs.push({
                    id: ele.id,
                    name: '本院退岗申请审核',
                    type: ele.type,
                    allowBatchOperation: ele.allowBatchOperation,
                    allowReject: ele.allowReject
                  })
                } else {
                  this.checkTabs.push({
                    id: ele.id,
                    name: '本单位退岗申请审核',
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
        url: '/api/pwps/workflow/runtime/applications/search/options',
        dataType: 'json',
        type: 'get',
        success: (data) => {
          if (data.state) {
            if (data.data) {
              this.columns = [{
                id: 'year',
                title: '学年',
                className: 'text-left',
                hidden: false,
                width: 100,
                formatter: function (record) {
                  return record.outPositionForm.position.schoolYear.name
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
                id: 'userName',
                title: '姓名',
                className: 'text-left',
                hidden: false,
                width: 80,
                search: {
                  type: 'input',
                  data: {
                    placeholer: '',
                    autoFocus: true
                  }
                },
                formatter: (record) => {
                  return record.outPositionForm.name
                }
              }, {
                id: 'userNo',
                title: '学号',
                className: 'text-left',
                hidden: false,
                width: 120,
                search: {
                  type: 'input',
                  data: {
                    placeholer: '',
                    autoFocus: true
                  }
                },
                formatter: function (record) {
                  return record.outPositionForm.userNo
                }
              }, {
                id: 'contact',
                title: '联系方式',
                className: 'text-left',
                hidden: false,
                width: 120,
                search: {
                  type: 'input',
                  data: {
                    placeholer: '',
                    autoFocus: true
                  }
                },
                formatter: function (record) {
                  return record.outPositionForm.contact
                }
              }, {
                id: 'collegeCode',
                title: '学院',
                className: 'text-left',
                width: 120,
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
                  return record.outPositionForm.collegeName
                }
              }, {
                id: 'positionName',
                title: '岗位名称',
                className: 'text-left',
                hidden: false,
                width: 80,
                search: {
                  type: 'input',
                  data: {
                    placeholer: '',
                    autoFocus: true
                  }
                },
                formatter: (record) => {
                  return record.outPositionForm.position.positionName
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
                id: 'grade',
                title: '年级',
                className: 'text-left',
                hidden: true,
                width: 50,
                formatter: (record) => {
                  return record.outPositionForm.grade
                }
              }, {
                id: 'sex',
                title: '性别',
                width: 40,
                className: 'text-left',
                hidden: true,
                formatter: (record) => {
                  return record.outPositionForm.sex
                }
              }, {
                id: 'educationLevel',
                title: '培养层次',
                className: 'text-left',
                hidden: true,
                width: 80,
                formatter: (record) => {
                  return record.outPositionForm.educationLevel
                }
              }, {
                id: 'politicalStatus',
                title: '政治面貌',
                className: 'text-left',
                hidden: true,
                width: 80,
                formatter: (record) => {
                  return record.outPositionForm.politicalStatus
                }
              }, {
                id: 'className',
                title: '班级',
                className: 'text-left',
                hidden: true,
                width: 80,
                formatter: (record) => {
                  return record.outPositionForm.className
                }
              }, {
                id: 'isDifficultyStudent',
                title: '是否困难生',
                className: 'text-left',
                hidden: true,
                width: 100,
                formatter: (record) => {
                  return record.outPositionForm.isDifficultyStudent ? '是' : '否'
                }
              }, {
                id: 'reason',
                title: '退岗理由',
                className: 'text-left',
                hidden: true,
                width: 120,
                formatter: (record) => {
                  return record.outPositionForm.reason
                }
              }, {
                id: 'remark',
                title: '备注',
                className: 'text-left',
                hidden: true,
                width: 100,
                formatter: (record) => {
                  return record.outPositionForm.remark
                }
              }, {
                id: 'opt',
                className: 'text-left',
                title: '操作',
                width: 130,
                hidden: false,
                formatter: (recordItem) => {
                  var opts = [{
                    tag: 'a',
                    text: '查看',
                    className: 'opt-btn',
                    callback: (record, index) => {
                      this.curRouter = 'jobApplyForm'
                      this.positionId = record.id
                      this.applicationFormDetail = {
                        createTime: record.createTime,
                        form: record.outPositionForm,
                        status: record.currentNodeStatus,
                        formId: record.id,
                        isShowLog: true,
                        opts: {
                          canCancel: false,
                          canResubmit: false,
                          canRevoke: record.canRevoke
                        }
                      }
                    }
                  }]
                  if (recordItem.currentNodeStatus === 'TODO') {
                    opts.push({
                      tag: 'a',
                      text: '通过',
                      className: 'opt-btn',
                      callback: (record, index) => {
                        this.checkOpt('pass', [record.id])
                      }
                    })
                    opts.push({
                      tag: 'a',
                      text: '不通过',
                      className: 'opt-btn',
                      callback: (record, index) => {
                        this.checkOpt('unpass', [record.id])
                      }
                    })
                  }
                  if (recordItem.canRevoke) {
                    opts.push({
                      tag: 'a',
                      text: '撤回',
                      className: 'opt-btn',
                      callback: (record, index) => {
                        this.positionId = record.id
                        this._revoke()
                      }
                    })
                  }
                  return opts
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
        retiredCheckUrl: '/table-data/pwps/workflow/runtime/positions/out/instances',
        exportModalShow: false,
        columns: [],
        manageTableUrl: '',
        exportFieldList: [],
        tableCheckedList: [],
        allowReject: '',
        allowBatchOperation: '',
        checkTabs: [],
        checkTabId: '',
        checkType: '',
        applicationFormDetail: {},
        curRouter: 'studentJobApplyCheckList',
        timeStamp: '',
        positionId: '',
        showUnpassOpinionModal: false,
        unpassIds: [],
        opinion: ''
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
      _back: function () {
        this.curRouter = 'studentJobApplyCheckList'
      },
      _pass: function () {
        this.checkOpt('pass', [this.positionId])
      },
      _unpass: function (data) {
        this.unpassIds = []
        this.unpassIds.push(this.positionId)
        this.opinion = data.opinion
        this.submitUnpassOpinion()

      },
      _revoke: function () {
        if (window.confirm('确定撤回吗？')) {
          sAjax({
            url: '/api/pwps/workflow/runtime/positions/out/instances/' + this.positionId + '/revoke',
            type: 'post',
            success: (data) => {
              if (data.state) {
                this.timeStamp = createTime()
                this.curRouter = 'studentJobApplyCheckList'
                this.$toast('撤回成功')
              } else {
                this.$toast(data.message)
              }
            }
          })
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
      _checkField: function (field) {
        var index = this.exportFieldList.indexOf(field.id)
        if (index >= 0) {
          this.exportFieldList.splice(index, 1)
        } else {
          this.exportFieldList.push(field.id)
        }
      },
      _tableChecked: function (recordArr) {
        this.tableCheckedList = recordArr
      },
      checkOpt: function (optType, ids) {
        if (ids.length === 0) {
          this.$toast('当前没有可操作的数据')
          return
        }
        if (optType === 'pass') {
          if (window.confirm('确定通过吗？')) {
            sAjax({
              url: '/api/pwps/workflow/runtime/positions/out/instances/success',
              type: 'post',
              data: {
                ids: ids
              },
              success: (data) => {
                if (data.state) {
                  this.timeStamp = createTime()
                  this.$toast('操作成功')
                  this.tableCheckedList = []
                  this.curRouter = 'studentJobApplyCheckList'
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
          url: '/api/pwps/workflow/runtime/positions/out/instances/failed',
          type: 'post',
          data: {
            ids: this.unpassIds,
            opinion: this.opinion
          },
          success: (data) => {
            if (data.state) {
              this.timeStamp = createTime()
              this.showUnpassOpinionModal = false
              this.$toast('操作成功')
              this.tableCheckedList = []
              this.curRouter = 'studentJobApplyCheckList'
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      _export: function () {
        var exportIds = []
        this.tableCheckedList.forEach((ele, index) => {
          exportIds.push(ele.id)
        })
        var searchData = this.$refs.jobTable.tableSearchFields
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
          url: '/api/pwps/workflow/runtime/positions/out/instances/export?nodeId=' + this.checkTabId + '&nodeType=' + this.checkType + '&ids=' + exportIds + searchText,
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
      }
    }
  }
</script>
<style lang="less">
.job-retired-check {
  .btn {
    border: none;
    box-shadow: none;
    outline: none;
    background: transparent;
  }
  .modal-body {
    padding: 0 12px;
    .table-container {
      box-shadow: none;
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
  .table-options-container {
    position: relative;
    overflow: hidden;
  }
  .modal-textarea {
    width: 100%;
    resize: none;
    margin-top: 10px;
    padding: 5px;
    border: 0 solid #e0e0e0;
    outline: none;
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
}
</style>

