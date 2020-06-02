<template>
  <!-- 入退管理 -->
  <div id="entryAndExit-page" class="container-fluid" >
    <div class="tab" v-show="!importPage">
       <el-tabs v-model="activeName" type="card" @tab-click='handleClick'>
        <el-tab-pane label="入住管理" name="WAIT_CHECK_IN"></el-tab-pane>
        <el-tab-pane label="退宿管理" name="CHECK_IN"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="row text-center" v-show="!importPage">
      <v-table  :url="`${url}`" multiple='true' @afterChecked='afterChecked' pagesize="10" idField="id" :columns="columns" :order="true"  :search="true">
        <div slot="btn-group" role="group">
        <div class="btn-group pull-left">
            <div class="batch-options" v-if="tableCheckedList.length > 0">
              <span class="pull-left">已选择{{tableCheckedList.length}}项，其中可操作的有{{tableCheckedList.length}}项</span>
              <button  type="button" @click="submit" class="btn btn-bgColor-style clearBtnBorder">{{activeName=='WAIT_CHECK_IN'?'入住':'退宿'}}</button>      
            </div>
          </div>
        <div slot="btn-group" class="btn-group pull-right" role="group">
          <!-- <button v-show="activeName=='WAIT_CHECK_IN'" type="button" class="btn btn-bgColor-style clearBtnBorder" @click="entry()">{{translate.batchEntry}}</button>
          <button v-show="activeName=='CHECK_IN'"  type="button" class="btn btn-bgColor-style clearBtnBorder" @click="exit()">{{translate.batchExit}}</button> -->
        </div>
        </div>
      </v-table>
    </div>
    <v-import
    v-bind="importParams"
    @backParentPage="importPage = false"
    v-show="importPage"
    >
    </v-import>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { sAjax, translation, createTime} from '../../assets/utils/utils.js'
  export default {
    created: function () {
      var la = localStorage.getItem('lang')
      var that = this
      if (translation(la)) {
        this.lang = la
      }
      sAjax({
        url: '/api/apartment/inandout/getSelectOption',
        dataType: 'json',
        type: 'get',
        success: (data) => {
          if (data.state) {
            var result = data.data.option
            this.options.college = result.college || []
            this.options.grade = result.grade || []
            this.options.educationLevel = result.educationLevel || []
            this.options.checkInStatus = result.checkInStatus || [] 
            this.options.paymentStatus = result.paymentStatus || []
            this._initColumns()
          } else {
            this.toast(data.message)
          }
        }
      })
    },
    data: function () {
      return {
        tableCheckedList: [],
        activeName: 'WAIT_CHECK_IN',
        columns: [],
        url: '/table-data/apartment/inandout/allRecord?status=WAIT_CHECK_IN',
        importPage: false,
        importParams: {
          parentPageTitle: '',
          downloadTemplateUrl: '',
          downloadErrorTemplateUrl: '',
          checkTemplateUrl: '',
          templateName: '',
          importBtnType: null
        },
        options:{
          college: [],
          grade: [],
          educationLevel: [],
          checkInStatus: [],
          paymentStatus: []
        },
        timeStamp: null,
        lang: 'zh-cn'
      }
    },
    computed: {
      translate: function () {
        return translation(this.lang).entryAndEexit
      }
    },
    methods: {
      afterChecked(rows) {
        this.tableCheckedList = rows
      },
      submit() {
        let url
        let idList = []
        for(let i = 0;i< this.tableCheckedList.length;i++) {
          idList.push(this.tableCheckedList[i].studentId)
        }
        if(this.activeName == 'WAIT_CHECK_IN') {
          url = '/api/apartment/inandout/singleIn'  //批量入住接口
        }else {
          url = '/api/apartment/inandout/singleOut'
        }
        sAjax({
          url: url,
          type: 'post',
          data: {
            studentIds: idList
          },
          success: (data) => {
            if(data.state) {
              this.$toast('操作成功')
              this.tableCheckedList = []
              this.url = '/table-data/apartment/inandout/allRecord?status=' + this.activeName + '&ts=' + new Date().getTime()
            }else {
              this.$toast('操作失败')
            }
          }
        })
      },
       handleClick(tab, event) {
        //切换tableUrl
        this.tableCheckedList = []
        this.url = '/table-data/apartment/inandout/allRecord?status=' + this.activeName
      },
      _initColumns: function () {
        this.columns = [
            {
            id: 'name',
            title: this.translate.name,
            className: 'text-left',
            width: 70,
            hidden: false,
            search: {
              type: 'input',
              data: {
                autoFocus: true,
                placeholder: this.translate.namePlaceholder
              }
            }
          },
          
          {
            id: 'studentId',
            title: this.translate.studentId,
            className: 'text-left',
            width: 120,
            hidden: false,
            search: {
              type: 'input',
              data: {
                autoFocus: true,
                placeholder: this.translate.studentIdPlaceholder
              }
            }
          },
        
         {
            id: 'account',
            title: this.translate.account,
            className: 'text-left',
            width: 120,
            hidden: false,
            search: {
              type: 'input',
              data: {
                autoFocus: true,
                placeholder: this.translate.accountIdPlaceholder
              }
            }
          },

          {
            id: 'college',
            title: this.translate.college,
            className: 'text-left',
            width: 100,
            hidden: false,
            search: {
              type: 'multiSelect',
              data: {
                options: this.options.college,
                optionsLabel: 'name',
                optionsValue: 'code'
              }
            }
          },

          {
            id: 'educationLevel',
            title: this.translate.educationLevel,
            className: 'text-left',
            width: 80,
            hidden: false,
            search: {
              type: 'multiSelect',
              data: {
                options: this.options.educationLevel,
                optionsLabel: 'name',
                optionsValue: 'code'
              }
            }
          },

          {
            id: 'grade',
            title: this.translate.grade,
            className: 'text-left',
            width: 60,
            hidden: false,
            search: {
              type: 'multiSelect',
              data: {
                options: this.options.grade,
                optionsLabel: 'name',
                optionsValue: 'code'
              }
            }
          },

          {
            id: 'paymentStatus',
            title: this.translate.paymentStatus,
            className: 'text-left',
            width: 80,
            hidden: false,
            search: {
              type: 'multiSelect',
              data: {
                options: this.options.paymentStatus,
                optionsLabel: 'name',
                optionsValue: 'code'
              }
            }
          },

          {
            id: 'dormitory',
            title: this.translate.dormitory,
            className: 'text-left',
            width: 300,
            hidden: false,
            formatter: (record) => {
              var campusText = record.dormitory.campus ? record.dormitory.campus + "校区" : ''
              return campusText + record.dormitory.zone + record.dormitory.buildName + ' ' + record.dormitory.room + "室" + record.dormitory.bed + "号床"
            }
          },

          {
            id: 'checkInStatus',
            title: this.translate.checkInStatus,
            className: 'text-left',
            width: 80,
            hidden: false,
            search: {
              type: 'select',
              data: {
                options: this.options.checkInStatus,
                optionsLabel: 'name',
                optionsValue: 'code'
              }
            }
          },
          
          {
            id: 'opt',
            title: this.translate.opt,
            className: 'text-left',
            width: 60,
            hidden: false,
            formatter: (record) => {
            if(record.checkInStatus == "已入住"){
              return [{
              tag: 'a',
              text: this.translate.leaveDormitory,
              className: 'opt-btn',
              callback: (record, index) =>  {
                if (confirm(this.translate.leaveDormitoryConfirmTip)) {
                  sAjax({
                    url: '/api/apartment/inandout/singleOut/' + record.studentId,
                    dataType: 'json',
                    type: 'post',
                    success: (data) => {
                      if (data.state) {
                        this.checkInStatus = "已退宿"
                        this.timeStamp = createTime()
                        this.$toast('退宿成功!')
                      } 
                      else {
                        this.$toast(data.message)
                      }
                    }
                  })
                }
              }
            }]
            }
            else{
              return [{
              tag: 'a',
              text: this.translate.entryDormitory,
              className: 'opt-btn',
              callback: (record, index) =>  {
                if (confirm(this.translate.entryDormitoryConfirmTip)) {
                  sAjax({
                    url: '/api/apartment/inandout/singleIn/' + record.studentId,
                    dataType: 'json',
                    type: 'post',
                    success: (data) => {
                      if (data.state) {
                        this.checkInStatus = "已入住"
                        this.timeStamp = createTime()
                        this.$toast('入住成功!')
                      } 
                      else {
                        that.$toast(data.message)
                      }
                    }
                  })
                }
              }
            }]
            }
          }
          }
        ]
      },
      entry: function () {
        this.importPage = true
        this.importParams.parentPageTitle = this.translate.tableName
        this.importParams.templateName = this.translate.batchEntry
        this.importParams.downloadTemplateUrl = '/apartment/inandout/batchIn/template'
        this.importParams.checkTemplateUrl = '/apartment/inandout/batchIn/excel'
        this.importParams.downloadErrorTemplateUrl = '/apartment/inandout/batchIn/error'
        this.importParams.importBtnType = [{
          url: '/apartment/inandout/batchIn',
          method: 'post',
          isShowBtn: true,
          name: this.translate.overlayImport,
          success: (data) => {
            if (data.state) {
              this._refreshTable()
            }
          }
        }]
      },
      
      exit: function () {
        this.importPage = true
        this.importParams.parentPageTitle = this.translate.tableName
        this.importParams.templateName = this.translate.batchExit
        this.importParams.downloadTemplateUrl = '/apartment/inandout/batchOut/template'
        this.importParams.checkTemplateUrl = '/apartment/inandout/batchOut/excel'
        this.importParams.downloadErrorTemplateUrl = '/apartment/inandout/batchOut/error'
        this.importParams.importBtnType = [{
          url: '/apartment/inandout/batchOut',
          method: 'post',
          isShowBtn: true,
          name: this.translate.overlayImport,
          success: (data) => {
            if (data.state) {
              this._refreshTable()
            }
          }
        }]
      },
      _refreshTable: function () {
        this.timeStamp = createTime()
      }
    }
  }
</script>

<style lang="less">
@import url("../../assets/common.less");
#entryAndExit-page {
  .tab {
    margin-right: -15px;
    margin-left: -15px;
    margin-bottom: 20px;
    .el-tabs__header {
      margin: 0;
      border-bottom:none;
    }
    .el-tabs--card>.el-tabs__header .el-tabs__nav {
      background: #fff;
    }
    .el-tabs__item.is-active {
      color: #298df7;
    }
  }
  .pull-left {
     line-height:  34px;
    .batch-options {
      display: flex;
      button {
        margin-left: 20px;
        align-items: center;
      }
    }
  }
}
</style>
