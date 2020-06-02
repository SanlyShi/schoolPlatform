<template>
  <div class="activity-down" v-if="!showAdd&&!showImport">
    <div class="content text-center">
      <v-table  ref="activityDownTable" :title="translate.title" :url="url+timestamp"  pagesize="10" idField="id" :columns="columns" :multiple="false" :order="true" :search="false">      
        <div slot="btn-group" class="btn-group pull-right" role="group">
          <button
            class="btn btn-bgColor-style clearBtnBorder"
            @click="showImport=true"
          >批量导入</button>
          <button
            class="btn btn-bgColor-style clearBtnBorder"
            @click="showAdd = true"
          >发布活动</button>
        </div>
      </v-table>
    </div>
  </div>
  <v-import
    v-bind="importParams"
    @backParentPage="showImport = false"
    v-else-if="showImport">
  </v-import>
  <create-activity v-else @back="back"></create-activity>
</template>

<script>
  import Vue from 'vue'
  import { sAjax, translation } from '../../assets/utils/utils.js'
  import createActivity from './creatActivity'
  export default {
    props: {

    },
    components: {
      createActivity
    },
    created: function () {
      var la = localStorage.getItem('lang')
      var that = this
      if (translation(la)) {
        this.lang = la
      }
      this.columns = [{
        id: 'name',
        title: this.translate.activityName,
        className: 'text-left',
        hidden: false,
        search: {
          type: 'input',
          data: {
            placeholder: ''
          }
        }
      }, {
        id: 'activityStatus',
        title: this.translate.activityStatus,
        className: 'text-left',
        hidden: false,
        formatter: function (record) {
          switch (record.status) {
            case 'BEFORE_ACTIVITY_START':
              return '活动未开始'
              break;
            case 'ACTIVITY_ING':
              return '审核中'
              break;
            case 'AFTER_ACTIVITY_END':
              return '活动已结束'
              break;
          }
        }
      }, {
        id: 'auditStatus',
        title: this.translate.auditStatus,
        className: 'text-left',
        hidden: false,
        search: {
          type: 'multiSelect',
          data: {
            options: this.auditStatusList,
            optionsLabel: "label",
            optionsValue: "value"
          }
        },
        formatter: function (record) {
          switch (record.auditStatus) {
            case 'WAIT_PUBLISH':
              return '等待重新发布'
              break;
            case 'AUDIT_ING':
              return '审核中'
              break;
            case 'SUCCESS':
              return '已发布'
              break;
            case 'FAIL':
              return '审核不通过'
              break;
            case 'RESCISSORY':
              return '放弃发布'
              break;
            case 'REMOVED':
              return '已下架'
              break;
          }
        }
      }, {
        id: 'publisherName',
        title: this.translate.promulgator,
        className: 'text-left',
        hidden: false,
        formatter: function (record) {
          return record.publisher.name
        }
      }, {
        id: 'createTime',
        title: this.translate.publishTime,
        className: 'text-left',
        hidden: false
      }, {
        id: 'opt',
        title: this.translate.opt,
        className: 'text-left',
        hidden: false,
        formatter: function (record, index) {
          let controlList = []
          if(record.auditStatus == 'WAIT_PUBLISH'||record.auditStatus == 'AUDIT_ING') {
            controlList.push({
              tag: 'a',
              text: that.translate.show,
              className: 'opt-btn',
              callback: function (record, index) {
                that.$emit("addBread", {
                  route: "/app/flow?id=" + record.activityType.id + "&appType=activityAudit",
                  title: record.activityType.name,
                  appData: record.activityType,
                  entranceType: "activityAudit"
                });
              }
            })
          }
          if(record.auditStatus === 'SUCCESS') {
            controlList.push({
              tag: 'a',
              text: that.translate.down,
              className: 'opt-btn',
              callback: function (record, index) {
                if (record.auditStatus === 'SUCCESS' && record.status !== 'AFTER_ACTIVITY_END') {
                  if (confirm(that.translate.downTips)) {
                    sAjax({
                      url: '/api/sc/activities/' + record.id,
                      dataType: 'json',
                      type: 'post',
                      success: function (data) {
                        if (data.state) {
                          that.$toast(that.translate.deleteSuccessTip)
                          that.url = that.url + '&timestamp=' + new Date().getTime()
                        } else {
                          that.$toast(that.translate.deleteFailedTip + ':' + data.message)
                        }
                      }
                    })
                  }
                } else {
                  that.$toast('因该活动已结束，无法下架')
                }
              }
            })
          }
          let hasDeleteList = ['FAIL','RESCISSORY','REMOVED','WAIT_PUBLISH']
          if(hasDeleteList.indexOf(record.auditStatus) >= 0 ) {
            controlList.push({
              tag: 'a',
              text: '删除',
              className: 'opt-btn',
              callback: function (record, index) {
                  if (confirm('是否删除该活动')) {
                    sAjax({
                      url: '/api/sc/activities/delete/' + record.id,
                      dataType: 'json',
                      type: 'post',
                      success: function (data) {
                        if (data.state) {
                          that.$toast('删除成功')
                          that.url = that.url + '&timestamp=' + new Date().getTime()
                        } else {
                          that.$toast(data.message)
                        }
                      }
                    })
                  }
              }
            })
          }
          return controlList;
        }
      }]
      this.importParams.importBtnType = [{
        url: '/sc/activities/batchActivityTemplate',
        method: 'get',
        isShowBtn: true,
        name: '增量导入',
        success: (data) => {
          if (data.state) {
            this.timeStamp = new Date().getTime()
            this.showImport = false
          }
        }
      }]
    },
    data: function () {
      return {
        columns: [],
        // url: '/table-data/sc/activities/managements/pages?auditStatus=SUCCESS,REMOVED',
        url: '/table-data/sc/activities/managements/pages?timestamp=',
        timestamp: "",
        ActivityAuditStatus: [],
        lang: 'zh-cn',
        showAdd: false,
        auditStatusList: [
          {value: 'WAIT_PUBLISH', label: '等待重新发布'},
          {value: 'AUDIT_ING', label: '审核中'},
          {value: 'SUCCESS', label: '已发布'},
          {value: 'FAIL', label: '审核不通过'},
          {value: 'RESCISSORY', label: '放弃发布'},
          {value: 'REMOVED', label: '已下架'},
        ],
        showImport: false,
        importParams: {
          parentPageTitle: '活动管理',
          downloadTemplateUrl: '/sc/activities/getActivityImportTemplate',
          downloadErrorTemplateUrl: '/sc/activities/getActivityErrorTemplate',
          checkTemplateUrl: '/sc/activities/activityTemplate/excel',
          templateName: '批量新增活动管理',
          importBtnType: null
        },
      }
    },
    computed: {
      translate: function () {
        return translation(this.lang).activityDown
      }
    },
    methods: {
      back() {
        this.showAdd = false
        this.timestamp = new Date().getTime()
      }
    }
  }
</script>
<style lang="less">
@import url("../../assets/common.less");

.activity-down {
  margin: 0 auto;
  overflow-y: auto;
  .scroll {
    overflow: auto;
  }
}
</style>
