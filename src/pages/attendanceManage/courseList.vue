<template>
  <div id="collegeRole-page" class="container-fluid">
    <div class="row text-center">
      <v-table :url="url" pagesize="10" idField="id" :order="true" :columns="columns">
        <div slot="btn-group" role="group">
          <div class="btn-group pull-left">
            <v-select :value="curYear" :options="yearOptions" optionsLabel="name" optionsValue="code" @afterSelected="changeYear"></v-select>
          </div>
          <div class="btn-group pull-right">
            <button type="button" class="btn exchange-dimension-btn clearBtnBorder">124124</button>
          </div>
        </div>
      </v-table>
    </div>

    <!-- 模态框（Modal） -->
    <v-modal :show="showModal" effect="fade" width="420">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
          d11111
        </h5>
      </div>
      <div slot="modal-body" class="modal-body">
        
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="showModal = false">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder">保存</button>
      </div>
    </v-modal>
  </div>
</template>

<script>
import Vue from 'vue'
import { request } from '../../assets/utils/utils.js'
export default {
  created: function () {
    this.initTable()
  },
  data: function () {
    return {
      url: '/api/ca/courses/options/schoolYears',
      columns: [],
      showModal:false
    }
  },
  methods: {
    initTable() {
      this.columns = [
        {
          id: "year",
          title: '年份',
          className: "text-left",
          hidden: false,
          search: {
            type: "select",
            data: {
              optionsLabel: 'label',
              optionsValue: 'value',
              url: '/api/archives/enroll/getListYear'
            }
          }
        },
        {
          id: "enrollmentModels",
          title: "录取方式",
          className: "text-left",
          hidden: false,
          search: {
            type: "input",
            data: {
              placeholder: ""
            }
          }
        }, {
          id: "opt",
          title: "操作",
          className: "text-center",
          width: "230px",
          formatter: function (obj) {
            return [
              {
                tag: "a",
                text: '查看',
                className: "opt-btn",
                callback: function (record, index) {
                  that.schedulingType = 'read'
                  that.examine(record);
                }
              }
            ];
          }
        }]
    },
    getYearList(){
        let url = '/ca/courses/options/schoolYears'
    }
  }
}
</script>
<style lang="less" scoped >
</style>
