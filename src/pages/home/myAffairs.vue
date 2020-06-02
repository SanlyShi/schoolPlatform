<template>
  <div id="myAffairs-page" >
    <div class="myAffairs-container container-fluid">
      <div class="row">
        <div class=" affairs-header myAffairs-header">
          <div class="header-container">
            <div class="affairs-title ">
              {{translate.myAffairs}}
            </div>
          </div>
          <div class="affairs-nav">
            <div class="affairs-tab" v-for="(item,i) in allAffairsTabs" :key="i" :class="{active:allIsSelect == item.id}" @click="AllAffairsChangeTab(item.id)">
              {{item.name}}
            </div>
          </div>
        </div>
        <div class="affairs-table">
          <div class="table-search">
            <div class="input-group search-group pull-left col-md-3 col-md-offset-1">
              <span class="input-group-addon search-name" >{{translate.startTime}}</span>
              <v-datepicker ref="datepicker" class="btn-block time-picker" v-model="definedSearch.startTime" :clearButton="true"></v-datepicker>
            </div>
            <div class="input-group search-group pull-left col-md-3 col-md-offset-1">
              <span class="input-group-addon search-name" >{{translate.endTime}}</span>
              <v-datepicker ref="datepicker" class="btn-block time-picker" v-model="definedSearch.endTime" :clearButton="true"></v-datepicker>
            </div>
          </div>
          <!-- <div  v-for="(item,i) in urlArray" :key="i"  v-show="allIsSelect == item.id">
             <v-table
              idField="id"
              :columns="columns"
              :url="item.url"
              pagesize="10"
              :order="true"
              :searchParams="definedSearch"
              :search="true" >
            </v-table>
          </div> -->
          <div v-if="allIsSelect === 'initiate'">
             <v-table
              idField="id"
              :columns="columns"
              url="/table-data/processEngine/myProcessInstances"
              pagesize="10"
              :order="true"
              :searchParams="definedSearch"
              :search="true" >
            </v-table>
          </div>
          <div v-else-if="allIsSelect === 'waitHandle'">
             <v-table
              idField="id"
              :columns="columns"
              url="/table-data/processEngine/tasks/todo"
              pagesize="10"
              :order="true"
              :searchParams="definedSearch"
              :search="true" >
            </v-table>
          </div>
          <div v-else-if="allIsSelect === 'transfer'">
             <v-table
              idField="id"
              :columns="columns"
              url="/table-data/processEngine/tasks/todo/transfer/page"
              pagesize="10"
              :order="true"
              :searchParams="definedSearch"
              :search="true" >
            </v-table>
          </div>
          <div v-else>
             <v-table
              idField="id"
              :columns="columns"
              url="/table-data/processEngine/processInstances/myCarbonCopy"
              pagesize="10"
              :order="true"
              :searchParams="definedSearch"
              :search="true" >
            </v-table>
          </div>
        </div>
      </div>
    </div>
    <div class="preview-container"
    v-if="preview">
      <preview :data="previewObj.formData.components"
        :title="previewObj.formData.name"
        :script="previewObj.formData.property.script"
        :authorities="previewObj.authorities"
        :defaultData="previewObj.recordData"
        :fileServer="uploadFile"
        :log="previewObj.log"
        @submit="_submit" @back="preview = false"></preview>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { sAjax, translation } from "../../assets/utils/utils.js";
  export default {
    props: {
      data: {
        default: null
      }
    },
    created: function () {
      var la = localStorage.getItem('lang')
      if (translation(la)) {
        this.lang = la
      }
      if(this.data){
        this.allIsSelect = this.data.data.tabId
      }
      else{
        this.allIsSelect = this.$route.params.thingsType
      }

      this.allAffairsTabs = [{ 'id': 'initiate', 'name': this.translate.myInitiate }, { 'id': 'waitHandle', 'name': this.translate.myWaitHandle }, { 'id': 'transfer', 'name': this.translate.transferToMe }, { 'id': 'copySend', 'name': this.translate.copySendToMe }]
      this.urlArray = [{ 'id': 'initiate', 'url': '/table-data/processEngine/myProcessInstances' }, { 'id': 'waitHandle', 'url': '/table-data/processEngine/tasks/todo' }, { 'id': 'transfer', 'url': '/table-data/processEngine/tasks/todo/transfer/page' }, { 'id': 'copySend', 'url': '/table-data/processEngine/processInstances/myCarbonCopy' }]
      this.columns = [{
        id: 'name',
        title: this.translate.searchName,
        className: 'text-left',
        hidden: false,
        search: {
          type: 'input',
          data: {
            placeholder: this.translate.myAffairPlaceholder,
            autoFocus: true
          }
        },
        formatter: (record, index) => {
          if (this.allIsSelect === 'initiate') {
            return this.translate.you + this.translate.of + record.businessName + this.translate[record.currentNode.category]
          } else {
            return record.applicant.name + this.translate.of + record.businessName + this.translate[record.currentNode.category]
          }
        }
      },
      {
        id: 'createTime',
        title: this.translate.updatedTime,
        className: 'text-left',
        hidden: false
      },
      {
        id: 'status',
        title: this.translate.status,
        className: 'text-left',
        hidden: false,
        formatter: (record, index) => {
          var msg = ''
          if (record.status.toLowerCase() === 'pending') {
            msg = this.resultMessageJson[record.lastAction] ? this.resultMessageJson[record.lastAction].replace("{{node}}", record.currentNode.name) : ''
          } else if (record.status.toLowerCase() === 'end') {
            msg = this.resultMessageJson[record.result.toLowerCase()] ? this.resultMessageJson[record.result.toLowerCase()].replace("{{node}}", record.currentNode.name) : ''
          }
          return msg
        }
      },
      {
        id: 'opt',
        className: 'text-center',
        title: this.translate.opt,
        width: '100px',
        hidden: false,
        formatter: () => {
          return [{
            tag: 'a',
            text: this.translate.check,
            className: 'opt-btn',
            callback: (record, index) => {
              this.JumpAffairsPage(record)
            }
          }]
        }
      }]
    },
    data: function () {
      return {
        columns: [],
        handleColumns: [],
        url: '',
        urlArray: [],
        allIsSelect: 'initiate',
        allAffairsTabs: [],
        curInstance: null,
        doNotClosePreview: ['countermand', 'carbonCopy'],
        needAdviceAuthority: ['reject', 'agree', 'disagree', 'carbonCopy', 'transfer'],
        resultMessageJson: {
          overtime: '申请在{{node}}节点超时',
          rescissory: '申请者取消申请',
          disable: '业务期停用，表单废弃',
          success: '申请已通过',
          fail: '申请在{{node}}节点不通过',
          end: '已结束',
          submit: '待{{node}}节点审核',
          agree: '待{{node}}节点审核',
          reject: '申请被驳回至{{node}}节点',
          countermand: '申请被撤回至{{node}}节点',
        },
        searchName: '',
        preview: false,
        previewObj: {
          formData: null,
          authorities: null,
          recordData: [],
          log: null,
          curBusinessId: '',
          appId: ''
        },

        definedSearch: {
          startTime: '',
          endTime: '',
          name: ''
        },
        conditions: [],
        quotasRows: [],
        lang: 'zh-cn'
      }
    },
    computed: {
      translate: function () {
        return translation(this.lang).mainPage
      }
    },
    methods: {
      AllAffairsChangeTab: function (obj) {
        this.allIsSelect = obj
      },
      // 进入表单页面
      JumpAffairsPage: function (obj) {
        this.$waiting.show()
        this.previewObj.curBusinessId = obj.businessId
        this.previewObj.appId = obj.appId
        this.curInstance = obj
        this._getLog(obj.id, (data) => {
          this.previewObj.log = data || null
        })
        this._getAuthorityData(obj.id, (data) => {
          this.previewObj.authorities = data || []
        })
        this._getFormLayout(obj.businessId, obj.currentNode.id, (data) => {
          this.previewObj.formData = data
          this.previewObj.formData.components.forEach((ele) => {
            Vue.set(ele, 'x', ele.location.left)
            Vue.set(ele, 'y', ele.location.top)
            Vue.set(ele, 'w', ele.size.width)
            Vue.set(ele, 'h', ele.size.height)
          })
          this._getInitData(obj.id, (data1) => {
            this.$waiting.close()
            this.previewObj.recordData = data1
            this.preview = true
          })
        })
      },
      // 获取初始数据
      _getInitData: function (instanceId, callback) {
        sAjax({
          url: '/api/processEngine/processInstances/' + instanceId,
          type: 'get',
          success: (data) => {
            if (data.state) {
              callback(data.data)
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      // 获取权限
      _getAuthorityData: function (instanceId, callback) {
        sAjax({
          url: '/api/processEngine/processInstances/' + instanceId + '/operations',
          type: 'get',
          success: (data) => {
            if (data.state) {
              callback(data.data)
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      // 获取日志
      _getLog: function (instanceId, callback) {
        sAjax({
          url: '/api/processEngine/processInstances/' + instanceId + '/handleLogs',
          type: 'get',
          success: (data) => {
            if (data.state) {
              callback(data.data)
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      // 获取表单布局
      _getFormLayout: function (businessId, nodeId, callback) {
        sAjax({
          url: '/api/processEngine/business/' + businessId + '/formRenderData?nodeId=' + nodeId,
          type: 'get',
          success: (data) => {
            if (data.state) {
              callback(data.data)
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      // 提交
      _submit: function (obj) {
        // console.log("点击了提交")
        // sessionStorage.setItem("statusRefresh",1)
        if (this.needAdviceAuthority.indexOf(obj.type) >= 0) {
          this.$prompt({
            tip: '确认' + obj.title + '?',
            placeholder: '请输入批复意见',
            callback: (res) => {
              if (res.type === 'ok') {
                
                
                this._submitAction(obj, res.text)
              }
            }
          })
        } else if (obj.type === 'cancel') {
          if (confirm('确认要放弃本申请吗？放弃后申请作废')) {
            this._submitAction(obj)
          }
        } else {
          if (confirm("确认" + obj.title + '?')) {
            this._submitAction(obj)
          }
        }
      },
      _submitAction: function (obj, msg) {
        var url = ''
        var params = {};
        if (obj.type === 'submit') {
          url = '/api/processEngine/processInstances'
        } else if (obj.type === 'transfer' || obj.type === 'carbonCopy') {
          url = '/api/processEngine/update/processInstances?action=' + obj.type + '&userId=' + obj.userId
        } else if (obj.type === 'save') {
          url = '/api/processEngine/business/' + this.previewObj.curBusinessId + '/formData/caches'
        } else {
          url = '/api/processEngine/update/processInstances?action=' + obj.type + (msg ? ('&message=' + msg) : '')
        }
        params = {
            id: this.previewObj.recordData ? this.previewObj.recordData.id : '',
            formData: obj.formData,
            variable: {
              appId: this.previewObj.appId,
              businessId: this.previewObj.curBusinessId
            }
          }
        if(url.indexOf('/api/processEngine/update/processInstances')!==-1){
          if(obj.record){
            params.applicant = obj.record.applicant
          }
          let newParams = {
            runtimeProcessInstancePO:params,
            appNodeQuotaTableList:this.quotasRows,
            conditions:this.conditions || []
          }
          params = newParams
        }
        
        sAjax({
          url: url,
          type: 'post',
          data: params,
          success: (data) => {
            if (data.state) {
              if (this.doNotClosePreview.indexOf(obj.type) >= 0) {
                this._getAuthorityData(this.curInstance.id, (data) => {
                  this.previewObj.authorities = data || []
                })
              } else {
                this.preview = false
              }
              if (obj.type === 'submit') {
                this.$toast('提交申请成功')
              } else {
                this.$toast('申请已' + obj.title)
              }
            } else {
              this.$toast(data.message)
            }
          }
        })
      }
    }
  }
</script>

<style lang="less">
@import url("../../assets/common.less");
#myAffairs-page {
  height: 100%;
  overflow: auto;
  .myAffairs-container {
    .affairs-header {
      position: relative;
      z-index: 1;
      height: 104px;
      background: #ffffff;
      box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
      border-radius: 2px;
      .affairs-title {
        font-size: 16px;
        color: rgba(0, 0, 0, 0.87);
        line-height: 16px;
        font-weight: 500;
        margin: 24px 0 0 24px;
        display: inline-block;
      }
      .affairs-nav {
        height: 40px;
        margin-top: 21px;
      }
      .affairs-tab {
        width: 100px;
        height: 40px;
        display: inline-block;
        text-align: center;
        font-size: 13px;
        color: rgba(0, 0, 0, 0.54);
        line-height: 13px;
        font-weight: 500;
        padding-top: 13px;
        margin-right: -5px;
        cursor: pointer;
      }
      .affairs-tab.active {
        
        color: #298df7;
        border-bottom: 2px solid #298df7;
        cursor: default;
      }
    }
    .affairs-table {
      margin-top: 6px;
    }
    .affairs-table table .table-header {
      display: none;
    }
    .table-search {
      background: #ffffff;
      margin-bottom: -6px;
      height: 60px;
      padding-top: 10px;
      box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
      border-radius: 2px;
    }
    .time-picker {
      .form-control.datepicker-input {
        border-radius: 0;
        border-top: 0 solid #ffffff;
        border-left: 0 solid #ffffff;
        border-right: 0 solid #ffffff;
        border-bottom: 2px solid #e0e0e0;
        box-shadow: inset 0 0px 0px rgba(0, 0, 0, 0.075);
        padding: 0;
      }
    }
    .search-group .form-control[readonly] {
      background: #ffffff;
    }
    .back-btn {
      padding: 0;
      background: transparent;
      margin-bottom: 20px;
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
