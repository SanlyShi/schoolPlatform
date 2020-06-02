<template>
  <div id="jobApply" v-if="curRouter === 'jobApplyList'">
    <div class="tab-div">
      <div
        class="tab"
        :class="!isApplyRecordPage ? 'active' : ''"
        title="岗位申请"
        @click="isApplyRecordPage = false"
      >岗位申请</div>
      <div
        class="tab"
        :class="isApplyRecordPage ? 'active' : ''"
        title="申请记录"
        @click="isApplyRecordPage = true"
      >申请记录</div>
    </div>
    <div class="container-fluid row text-center" v-if="!isApplyRecordPage">
      <v-table
        :url="schoolYearDefault?`${jobApplyUrl}?schoolYear=${schoolYearDefault}&timeStamp=${timeStamp}`:''"
        pagesize="10"
        idField="id"
        :columns="columns"
        :multiple="false"
        :order="true"
        :search="false"
      >
        <div slot="btn-group" role="group">
          <div class="btn-group pull-left">
            <v-select
              :value="schoolYearDefault"
              :options="schoolYearData"
              optionsLabel="name"
              optionsValue="id"
              @afterSelected="schoolYearSelected"
            ></v-select>
          </div>
          <div class="btn-group pull-right">
            <!-- <button
              type="button"
              class="btn table-btn clearBtnBorder"
              @click="isApplyRecordPage = true"
            >切换到申请记录</button> -->
          </div>
        </div>
      </v-table>
    </div>
    <div class="container-fluid row" v-else>
      <v-table
        :url="`${applyRecordUrl}?timeStamp=${timeStamp}`"
        pagesize="10"
        idField="id"
        :columns="applyRecordColumns"
        :multiple="false"
        :order="true"
        :search="false"
      >
        <div slot="btn-group" role="group">
          <div class="btn-group pull-right">
            <!-- <button
              type="button"
              class="btn table-btn clearBtnBorder"
              @click="isApplyRecordPage = false"
            >切换到岗位申请列表</button> -->
          </div>
        </div>
      </v-table>
    </div>
  </div>
  <jobApplyForm
    @back="_back"
    formType="applicationRecord"
    :isApply="isApply"
    @revoke="_revoke"
    @resubimt="_resubimt"
    @cancelApplication="_cancelApplication"
    :formDetail="applicationFormDetail"
    v-else
  ></jobApplyForm>
</template>

<script>
  import Vue from 'vue'
  import { translation, sAjax, createTime } from '../../assets/utils/utils.js'
  import jobApplyForm from './jobApplyForm.vue'
  Vue.component('jobApplyForm', jobApplyForm)
  export default {
    data: function () {
      return {
        jobApplyUrl: '/table-data/pwps/positions/page/canApplyPositions',
        columns: [],
        curRoute: '',
        schoolYearDefault: '',
        schoolYearData: [],
        positionTypeData: [],
        applyRecordUrl: '/table-data/pwps/workflow/runtime/applications/histories',
        timeStamp: '',
        applyRecordColumns: [],
        isApplyRecordPage: false,
        curRouter: 'jobApplyList',
        applicationFormDetail: {},
        applicationId: '',
        isApply: false,
        lang: 'zh-cn',
        statusList: [
          {value: "PENDING", label: "已申请"},
          {value: "FULL", label: "人员已满"},
          {value: "NOT_START", label: "未开始"},
          {value: "AlREADY_END", label: "已过期"},
          {value: "CAN_APPLY", label: "正在招募"},
        ]
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
      sAjax({
        url: '/api/pwps/positions/all/schoolYears',
        dataType: 'json',
        type: 'get',
        success: (data) => {
          if (data.state) {
            if (data.data) {
              this.schoolYearData = data.data
              this.schoolYearDefault = data.data[0].id
              this.url = '?schoolYear=' + this.schoolYearDefault
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
      this.curRoute = 'jobListPage'
      this.columns = [{
        id: 'positionName',
        title: '岗位名称',
        className: 'text-left',
        hidden: false,
        width: 100,
        search: {
          type: 'input',
          data: {
            placeholer: '',
            autoFocus: true
          }
        },
        formatter: (record) => {
          return record.position && record.position.positionName
        }
      }, {
        id: 'positionType',
        title: '岗位类型',
        className: 'text-left',
        hidden: false,
        width: 100,
        formatter: (record) => {
          if (record.position) {
            var label = ''
            this.positionTypeData.forEach((ele, index) => {
              if (ele.value === record.position.positionType) {
                label = ele.label
              }
            })
            return label
          }
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
        id: 'unitId',
        title: '单位名称',
        className: 'text-left',
        hidden: false,
        width: 100,
        search: {
          type: 'select',
          data: {
            url: '/api/pwps/units/all',
            optionsLabel: 'name',
            optionsValue: 'id'
          }
        },
        formatter: (record) => {
          return record.position && record.position.unit && record.position.unit.name
        }
      }, {
        id: 'address',
        title: '地点',
        className: 'text-left',
        hidden: false,
        width: 100,
        formatter: (record) => {
          return record.position && record.position.address
        }
      }, {
        id: 'rewardStandard',
        title: '薪酬标准(元/小时)',
        className: 'text-center',
        width: 150,
        hidden: false,
        formatter: (record) => {
          return record.position && record.position.rewardStandard
        }
      }, {
        id: 'positionRequire',
        title: '岗位要求',
        className: 'text-left',
        width: 100,
        hidden: false,
        formatter: (record) => {
          return record.position && record.position.positionRequire
        }
      }, {
        id: 'createTime',
        title: '发布时间',
        width: 150,
        className: 'text-left',
        hidden: false,
        formatter: (record) => {
          return record.position && record.position.createTime
        }
      }, {
        id: 'positionStatus',
        title: '当前状态',
        width: 150,
        className: 'text-left',
        hidden: false,
        search: {
          type: 'select',
          data: {
            options: this.statusList,
            optionsLabel: "label",
            optionsValue: "value",
          }
        },
        formatter: (recordItem) => {
          let status = ""
          this.statusList.map(item => {
            if(item.value == recordItem.position.positionStatus) {
              status = item.label
            }
          })
          return status;
        }
      }, {
        id: 'opt',
        title: '操作',
        className: 'text-left',
        width: 130,
        hidden: false,
        formatter: (recordItem) => {
          // if(!recordItem.position)return'';
          // var isFull = parseInt(recordItem.position.userIncumbencyCount) >= parseInt(recordItem.position.personCount)
          // if (!recordItem.hasOnTheJob && !recordItem.hasApplied) {
            return [{
              tag: 'a',
              text: '查看',
              className: 'opt-btn',
              callback: (record, index) => {
                // if (!isFull) {
                  this.$emit('addBread', {
                    route: '/workStudy/jobDetail?positionId=' + record.position.id,
                    title: record.position.positionName,
                    data: record.position,
                    lastRoute: {
                      route: '/workStudy/jobApply',
                      title: ''
                    }
                  })
                // } else {
                //   this.$toast('人员已满，不可报名！')
                // }
              }
            }]
          // }
        }
      }]
      this.applyRecordColumns = [{
        id: 'year',
        title: '学年',
        className: 'text-left',
        hidden: false,
        width: 100,
        formatter: function (record) {
          if (record.applicationFormVO) {
            return record.applicationFormVO.position.schoolYear.name
          }
        },
        search: {
          type: 'select',
          data: {
            url: '/api/pwps/positions/options/schoolYears',
            optionsLabel: 'name',
            optionsValue: 'id'
          }
        }
      }, {
        id: 'positionName',
        title: '岗位名称',
        className: 'text-left',
        hidden: false,
        search: {
          type: 'select',
          data: {
            options: [],
            optionsLabel: 'name',
            optionsValue: 'id'
          }
        },
        formatter: (record) => {
          if (record.applicationFormVO) {
            return record.applicationFormVO.position.positionName
          }
        }
      }, {
        id: 'positionType',
        title: '岗位类型',
        className: 'text-left',
        width: 100,
        hidden: false,
        formatter: (record) => {
          if (record.applicationFormVO) {
            var label = ''
            this.positionTypeData.forEach((ele, index) => {
              if (ele.value === record.applicationFormVO.position.positionType) {
                label = ele.label
              }
            })
            return label
          }
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
        id: 'unitId',
        title: '单位名称',
        className: 'text-left',
        hidden: false,
        width: 130,
        search: {
          type: 'select',
          data: {
            url: '/api/pwps/units/all',
            optionsLabel: 'name',
            optionsValue: 'id'
          }
        },
        formatter: (record) => {
          if (record.applicationFormVO) {
            return record.applicationFormVO.position.unit.name
          }
        }
      }, {
        id: 'createTime',
        title: '申请时间',
        width: 140,
        className: 'text-left',
        hidden: false
      }, {
        id: 'statusLabel',
        title: '审核状态',
        width: 180,
        className: 'text-left',
        hidden: false,
        formatter: (record) => {
          if (record.applicationFormVO) {
            return record.applicationFormVO.statusLabel
          }
        }
      }, {
        id: 'opinion',
        title: '审核意见',
        className: 'text-left',
        width: 200,
        hidden: false,
      }, {
        id: 'opt',
        title: '操作',
        className: 'text-left',
        width: 130,
        hidden: false,
        formatter: (recordItem) => {
          var opts = [{
            tag: 'a',
            text: '查看',
            className: 'opt-btn',
            callback: (record, index) => {
              this.curRouter = 'jobApplyForm'
              this.applicationId = record.id
              if (record.canResubmit) {
                this.isApply = true
              } else {
                this.isApply = false
              }
              this.applicationFormDetail = {
                createTime: record.createTime,
                form: record.applicationFormVO,
                formId: record.id,
                isShowLog: true,
                isToDifficultyStudent: record.applicationFormVO && record.applicationFormVO.position ? record.applicationFormVO.position.isToDifficultyStudent : false,
                opts: {
                  canCancel: record.canCancel,
                  canResubmit: record.canResubmit,
                  canRevoke: record.canRevoke
                }
              }
            }
          }]
          return opts
        }
      }]
    },
    methods: {
      schoolYearSelected: function (obj) {
        this.schoolYearDefault = obj.value
      },
      _back: function () {
        this.curRouter = 'jobApplyList'
      },
      _revoke: function () {
        if (window.confirm('确定撤回吗？')) {
          sAjax({
            url: '/api/pwps/workflow/runtime/applications/' + this.applicationId + '/revoke',
            type: 'post',
            success: (data) => {
              if (data.state) {
                this.timeStamp = createTime()
                this.curRouter = 'jobApplyList'
                this.$toast('撤回成功')
              } else {
                this.$toast(data.message)
              }
            }
          })
        }
      },
      _resubimt: function (data) {
        if (window.confirm('确定重新提交吗？')) {
          sAjax({
            url: '/api/pwps/workflow/runtime/applications/' + this.applicationId + '/resubmit',
            type: 'post',
            data: data,
            success: (data) => {
              if (data.state) {
                this.timeStamp = createTime()
                this.curRouter = 'jobApplyList'
                this.$toast('重新提交成功')
              } else {
                this.$toast(data.message)
              }
            }
          })
        }
      },
      _cancelApplication: function () {
        if (window.confirm('确定取消申请吗？')) {
          sAjax({
            url: '/api/pwps/workflow/runtime/applications/' + this.applicationId + '/canceled',
            type: 'post',
            success: (data) => {
              if (data.state) {
                this.timeStamp = createTime()
                this.curRouter = 'jobApplyList'
                this.$toast('操作成功')
              } else {
                this.$toast(data.message)
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
#jobApply {
  background: #fff;
  .tab-div {
    position: relative;
    height: 40px;
    padding-right: 15px;
    background: white;
    white-space: nowrap;
    border-bottom: 1px solid #f0f0f0;
    .v-select {
      width: 160px;
    }
    .apply-container {
      position: absolute;
      right: 0;
    }
    .tab-list {
      position: relative;
      .gm-scroll-view {
        padding-right: 200px;
      }
    }
    .tab {
      display: inline-block;
      // max-width: 200px;
      width: 150px;
      padding: 0 20px;
      font-size: 13px;
      color: rgba(0, 0, 0, 0.54);
      line-height: 40px;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      border-bottom: 2px solid transparent;
      cursor: pointer;
      transition: all 0.2s ease-out;
      vertical-align: top;
      &.tab-node {
        line-height: 20px;
        p {
          margin: 0;
          text-align: left;
        }
      }
      &:hover,
      &.active {
        color: #298df7;
        border-bottom: 2px solid #298df7;

        height: 40px;
      }
      margin-right: -4px;
    }
  }
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
}
</style>
