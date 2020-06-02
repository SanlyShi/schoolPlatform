<template >
  <div>
    <div id="classManage-page" class="container-fluid"  v-show="!importPage">
      <div class="row text-center class-list-page">
        <v-table ref="studentTable"  :title="translate.tableName" :url="`${url}?timeStamp=${timeStamp}`" pagesize="10" idField="id" :columns="columns" :order="true" :search="true"  >
        </v-table>
      </div>
      <div class="batch-member-page" v-if="isShowStudentListPage">
        <v-payStudentList  :batchid="batchid" :schoolYear="schoolYear" :batchName="batchName"  @backClassList="backClassList"></v-payStudentList>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { sAjax, translation ,createTime } from '../../assets/utils/utils.js'
  import VpayStudentList from '../../pages/apartment/payStudentList.vue'
  Vue.component('v-payStudentList', VpayStudentList)
  export default {
    created: function () {
      var la = localStorage.getItem('lang')
      var that = this
      if (translation(la)) {
        this.lang = la
      }
      sAjax({
        url: '/api/apartment/payment/batch/getOption',
        dataType: 'json',
        type: 'get',
        success: (data) => {
          if (data.state) {
            var result = data.data.option
            this.options.addSchoolYear = result.addSchoolYear || []
            this.options.searchSchoolYear = result.searchSchoolYear || []
            this._initColumnsOfSearch()
          } else {
            this.toast(data.message)
          }
        }
      })
    },
    data: function () {
      return {
        columns: [],
        url: '/table-data/apartment/payment/listBatch',
        isManagePage: 'pay',
        isShowStudentListPage: false,
        payList: {
          id: '',
          batchName: '',
          schoolYear: '',
        },
        options:{
          addSchoolYear:[],
          searchSchoolYear:[]
        },
        timeStamp: null,
        lang: 'zh-cn'
      }
    },
    computed: {
      translate: function () {
        return translation(this.lang).pay
      },
    },
    methods: {
      _initColumnsOfSearch: function () {
        this.columns = [
          {
            id: 'batchName',
            title: this.translate.batchName,
            className: 'text-left',
            width: 450,
            hidden: false,
            search: {
              type: 'input',
              data: {
                autoFocus: true,
                placeholder: this.translate.batchNamePlaceholder
              }
            }
          },
          {
            id: 'schoolYear',
            title: this.translate.schoolYear,
            className: 'text-left',
            width: 140,
            hidden: false,
            search: {
              type: 'multiSelect',
              data: {
                options: this.options.searchSchoolYear,
                optionsLabel: 'name',
                optionsValue: 'code'
              }
            }
          },
          {
            id: 'id',
            title: this.translate.id,
            className: 'text-left',
            width: 80,
            hidden: true,
          },
          {
            id: 'opt',
            title: this.translate.opt,
            className: 'text-center',
            width: 250,
            hidden: false,
            formatter: (record) =>  {
              return [{
                tag: 'a',
                text: this.translate.studentList,
                className: 'opt-btn',
                callback: (record, index) => {
                  this.isManagePage = 'memberList'
                  this.isShowStudentListPage = true
                  this.batchid = record.id
                  this.schoolYear = record.schoolYear
                  this.batchName = record.batchName
                  this.$emit('showPathNav', record.id)
                }
              },{
                tag: 'a',
                text: this.translate.export,
                className: 'opt-btn',
                callback: (record, index) => {
                  window.location.href = '/downloads/apartment/payment/batchRecord/export/' + record.id
                }   
              }]
            }
          }
        ]
      },
      backClassList: function () {
        this.isManagePage = 'pay'
        this.isShowStudentListPage = false
        this.$emit('hidePathNav')
      },
     _refreshTable: function () {
        this.timeStamp = createTime()
      },
    }
  }
</script>

<style lang="less">
@import url("../../assets/common.less");
#classManage-page {
  position: relative;
  .batch-member-page {
    z-index: 100;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    width: 100%;
    height: 105%;
    background: rgb(245, 245, 245);
  }
  .input-label {
    width: 135px;
    text-align: right;
  }
  .form-control[readonly] {
    background: #fff;
  }
}
</style>
