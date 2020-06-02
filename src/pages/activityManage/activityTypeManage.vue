<template>
  <div class="activity-type-manage-page">
    <div class="activity-type-manage" v-show="miniRoutes === 'list'">
      <div class="content text-center">
        <v-table  ref="activityTypeTable" :title="translate.title" :url="url"  pagesize="10" idField="id" :columns="columns" :multiple="false" :order="true" :search="false">      
          <div slot="btn-group"  role="group">
            <div class="btn-group pull-right ">
              <button type="button" class="btn add-activityType btn-bgColor-style clearBtnBorder" @click="_showAddModal"><i class="maticon pull-left" v-html="icons('add')">add</i>{{translate.add}}{{translate.activityType}}</button>
            </div>
          </div>
        </v-table>
      </div>
      <v-modal :show="showAddModal" effect="fade" width="446" class="activityType-modal">
        <div slot="modal-header" class="modal-header">
          <h5 class="modal-title">
            {{modalType}}{{translate.activityType}}
          </h5>
        </div>
        <div slot="modal-body" class="modal-body">
          <div class="form-group">
            <input  type="text" class="form-control search-input activityType-input" :placeholder="translate.typeNamePlaceholder" maxlength="50" v-model="activityTypeName">
            <!-- <div class="set-process" @click="_setProcess">{{translate.setActivityReviewProcess}}</div> -->
          </div>
        </div>
        <div slot="modal-footer" class="modal-footer">
          <button type="button" class="btn cancel-btn clearBtnBorder" @click="showAddModal = false">{{translate.cancel}}</button>
          <button type="button" class="btn submit-btn clearBtnBorder" @click="_changeActivityType">{{translate.confirm}}</button>
        </div>
      </v-modal>
    </div>
    <FlowSetManage type="sc" :appName="activityTypeName" :appId="activityTypeId" :flowId="flowId" @back="_backToPage('list')" @submit="_saveFlowInfo" v-if="miniRoutes==='flowSetManage'&&activityTypeId"></FlowSetManage>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { sAjax, translation, createTime } from '../../assets/utils/utils.js'
  import flowSetManage from '../workflow/flowSetManage.vue'
  Vue.component('FlowSetManage', flowSetManage)
  export default {
    props: {

    },
    created: function () {
      var la = localStorage.getItem('lang')
      if (translation(la)) {
        this.lang = la
      }
      this.columns = [{
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
        id: 'opt',
        title: this.translate.opt,
        className: 'text-center',
        width: '210px',
        hidden: false,
        formatter: (record, index) => {
          return [{
            tag: 'a',
            text: this.translate.edit,
            className: 'opt-btn',
            callback: (record, index) => {
              this.activityTypeName = record.name
              this.flowId = record.flowId
              this.showAddModal = true
              this.modalType = this.translate.edit
              this.activityTypeId = record.id
            }
          }, {
            tag: 'a',
            text: this.translate.setActivityReviewProcess,
            className: 'opt-btn',
            callback: (record, index) => {
              this.flowId = record.flowId
              this.activityTypeName = record.name
              this.activityTypeId = record.id
              this.miniRoutes = 'flowSetManage'
              this.$emit('fullScreen', true)
            }
          }, {
            tag: 'a',
            text: this.translate.delete,
            className: 'opt-btn',
            callback: (record, index) => {
              if (confirm(this.translate.removeConfirmTip)) {
                sAjax({
                  url: '/api/sc/activities/types/' + record.id,
                  dataType: 'json',
                  type: 'post',
                  success: (data) => {
                    if (data.state) {
                      this.url = `${this.url.split('?')[0]}?timestamp=${createTime()}`
                    } else if (data.code == '30510') {
                      this.$toast('该定位已有活动，无法删除\n请下架活动后再进行删除操作')
                    } else {
                      this.$toast(this.translate.removeFailedTip + ':' + data.message)
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
        type: '',
        url: '/table-data/sc/activities/types/pages',
        activityTypeName: '',
        activityTypeId: '',
        showAddModal: false,
        modalType: '',
        isDisabled: true,
        flowId: '',
        miniRoutes: 'list',
        lang: 'zh-cn'
      }
    },
    computed: {
      translate: function () {
        return translation(this.lang).activityTypeManage
      }
    },
    watch: {

    },
    mounted: function () {

    },
    methods: {
      _showAddModal: function () {
        this.showAddModal = true
        this.modalType = this.translate.add
        this.activityTypeName = ''
      },
      _changeActivityType: function () {
        if (!this.activityTypeName) {
          this.$toast('分类名称不能为空')
          return false
        }
        if (this.modalType === this.translate.add) {
          this._addActivityType()
        } else if (this.modalType === this.translate.edit) {
          this._editActivityType()
        }

      },
      _addActivityType: function () {
        sAjax({
          url: '/api/sc/activities/types',
          dataType: 'json',
          type: 'post',
          data: {
            name: this.activityTypeName,
            flowId: this.flowId
          },
          success: (data) => {
            if (data.state) {
              this.showAddModal = false
              this.url = `${this.url.split('?')[0]}?timestamp=${createTime()}`
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      _editActivityType: function () {
        sAjax({
          url: '/api/sc/activities/types/' + this.activityTypeId + '/update',
          dataType: 'json',
          type: 'post',
          data: {
            name: this.activityTypeName
          },
          success: (data) => {
            if (data.state) {
              this.showAddModal = false
              this.url = `${this.url.split('?')[0]}?timestamp=${createTime()}`
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      _setProcess: function () {
        this.miniRoutes = 'flowSetMange'
      },
      _backToPage: function (page) {
        this.miniRoutes = page
        this.$emit('fullScreen', false)
      },
      _saveFlowInfo: function (obj) {
        var url = `/api/sc/activities/types/${this.activityTypeId}/flowSetting`
        sAjax({
          url: url,
          type: 'post',
          data: obj,
          success: (data) => {
            if (data.state) {
              this.$toast(this.translate.saveSuccessTip2, 0, 'check')
              // that.miniRoutes = 'appInfo'
              this._backToPage('list')
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

.activity-type-manage {
  height: 100%;
  overflow: auto;
  margin: 0 auto;
  .btn-group > .add-activityType:last-child:not(:first-child) {
    border-radius: 4px;
  }
  .add-activityType {
    font-size: 13px;
    line-height: 18px;
    background: #298df7;
    font-weight: 500;
    margin-right: 12px;
    i {
      font-size: 18px;
      color: #ffffff;
      margin-right: 3px;
      margin-top: -1px;
    }
  }
  .export-btn,
  .batch-add-btn {
    font-size: 13px;
    color: #298df7;
    margin-top: 2px;
  }
  .batch-add-btn {
    margin-right: 13px;
  }
  .activityType-modal {
    .modal-title {
      margin-left: 10px;
      font-size: 16px;
      color: rgba(0, 0, 0, 0.87);
      padding: 6px 0;
    }
    .modal-body {
      padding: 20px;
      .form-group {
        margin-bottom: 0;
      }
      .activityType-input {
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
      .set-process {
        height: 56px;
        padding-left: 24px;
        padding-top: 18px;
        font-size: 13px;
        color: #298df7;
        font-weight: 500;
        border-bottom: 1px solid #e0e0e0;
        cursor: pointer;
      }
    }
    .modal-footer {
      border-top: 1px solid #e5e5e5;
    }
  }
}
</style>
