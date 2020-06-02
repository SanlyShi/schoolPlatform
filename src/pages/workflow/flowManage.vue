<template>
  <div id="flow-page" class="container-fluid">
    <div class="row text-center">
      <v-table  :title="translate.flowTable" :url="url" pagesize="10" idField="id" :columns="columns" :multiple="false">
        <div slot="btn-group" class="btn-group pull-right" role="group">
          <button type="button" class="btn add" @click="addModal()">{{translate.addNew}}</button>
        </div>
      </v-table>
    </div>

    <!-- 模态框（Modal） -->
    <v-modal :show="showAddModal" effect="fade" width="274">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
          {{modalType}}{{translate.form}}
      </h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <input type="hidden" id="formId" v-model="newFlow.id">
        <div class="form-group">
          <input id="formName" type="text" class="form-control name-input" v-model="newFlow.name">
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn btn-style-2" @click="showAddModal = false">{{translate.cancel}}</button>
        <button type="button" class="btn btn-style-1" @click="changeRole">{{translate.confirm}}</button>
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
      this.columns = [
        {
          id: 'name',
          title: this.translate.flowName,
          className: 'text-left',
          hidden: false,
          search: {
            type: 'input',
            data: {
              autoFocus: true,
              placeholder: this.translate.formNamePlaceholder
            }
          }
        }, {
          id: 'id',
          title: '#',
          width: 60,
          className: 'text-center',
          hidden: false
        },
        {
          id: 'opt',
          // title: this.translate.opt,
          className: 'text-right',
          width: '300px',
          hidden: false,
          formatter: function () {
            return [{
              tag: 'a',
              text: that.translate.edit,
              className: 'opt-btn',
              callback: function (record, index) {
                that.flow = record
                that.newFlow.id = record.id
                that.newFlow.name = record.name
                that.modalType = that.translate.edit
                that.showAddModal = true
              }
            }, {
              tag: 'a',
              text: that.translate.remove,
              className: 'opt-btn',
              callback: function (record, index) {
                sAjax({
                  url: '/api/permission/roles/' + record.id,
                  dataType: 'json',
                  type: 'post',
                  success: function (data) {
                    if (confirm(that.translate.removeConfirmTip)) {
                      if (data.state) {
                        that.url = '/table-data/permission/roles?timestamp=' + new Date().getTime()
                      } else {
                        that.$toast(that.translate.removeFailedTip + ':' + data.message)
                      }
                    }
                  }
                })
              }
            }]
          }
        }]
    },
    data: function () {
      return {
        columns: [],
        url: '/table-data/permission/roles',
        showAddModal: false,
        flow: {},
        newFlow: {},
        treeItems: [],
        modalType: '',
        treeUrl: '',
        showBindUserGroupModal: false,
        lang: 'zh-cn'
      }
    },
    computed: {
      translate: function () {
        return translation(this.lang).flowManage
      }
    },
    methods: {
      editFlow: function () {
        var that = this
        sAjax({
          url: '/api/permission/roles/' + this.newFlow.id,
          dataType: 'json',
          data: {
            name: this.newFlow.name
          },
          type: 'patch',
          success: function (data) {
            if (data.state) {
              that.flow.id = that.newFlow.id
              that.flow.name = that.newFlow.name
              that.showAddModal = false
              // that.$toast(that.translate.editSuccessTip)
            } else {
              that.$toast(that.translate.editSuccessTip + ':' + data.message)
            }
          }
        })
      },
      addModal: function () {
        this.newFlow = {}
        this.modalType = this.translate.addNew
        this.showAddModal = true
      },
      addFlow: function () {
        var that = this
        sAjax({
          url: '/api/permission/roles',
          dataType: 'json',
          data: {
            name: this.newFlow.name
          },
          type: 'post',
          success: function (data) {
            if (data.state) {
              that.url = '/table-data/permission/roles?timestamp=' + new Date().getTime()
              that.showAddModal = false
              // that.$toast(that.translate.addSuccessTip)
            } else {
              that.$toast(that.translate.addFailedTip + ':' + data.message)
            }
          }
        })
      },
      changeRole: function () {
        if (this.modalType === this.translate.addNew) {
          this.addFlow()
        } else if (this.modalType === this.translate.edit) {
          this.editFlow()
        }
      }
    }
  }
</script>
<style lang="less">
@import url("../../assets/common.less");
#flow-page {
  .opt-btn {
    border-radius: 3px;
    margin-right: 5px;
  }
  .add {
    background: @-90ThemeColor;
    border: none;
    border-radius: 100px;
  }
}
</style>
