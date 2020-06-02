<template>
  <div id="collegeImport-page" class="container-fluid" v-if="isParentPage">
    <div id="tabs-container" class="row">
      <div class="info-title">学籍信息导入</div>
      <div class="tabs">
        <div class="tab" v-for="(orgType, key) in [tabs.college, tabs.dept, tabs.major]" :key="key"
         :class=" curTab === tabs[orgType] ? 'active' : ''" @click="selectTab(tabs[orgType])">
          {{ tabsNames[orgType] }}
        </div>

        <!-- <div class="common-actions">
          <button type="button" class="btn btn-bgColor-style clearBtnBorder" @click="importCollege()">{{translate.import}}</button>
        </div> -->
      </div>
    </div>
    <div class="row text-center">

      <v-table 
       :url="url.table[curTab]+'?timestamp='+timestamp" 
       pagesize="15" 
       idField="id" 
       :columns="columns[curTab]" 
       :multiple="false" 
       :order="true" 
       :search="true" 
      >
        <div slot="btn-group" role="group" class="table-options-container">
          <div v-if="curTab !== 'dept'" class="btn-group pull-right">
            <button type="button" class="btn btn-bgColor-style clearBtnBorder " @click="showAddModal = true; modalType='add';">新增</button>
            <button type="button" class="btn btn-bgColor-style clearBtnBorder " @click="_export">导出</button>
          </div>
          <div v-else class="btn-group pull-right">
            <button type="button" class="btn btn-bgColor-style clearBtnBorder" @click="importCollege()">{{translate.import}}</button>
          </div>
        </div>
      </v-table>
    </div>
    
    <v-modal :show="showAddModal" effect="fade" width="420">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
          新增
        </h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <button type="button" class="btn submit-btn clearBtnBorder" @click="_showAddModal" style="width:380px;text-align:center">单条增加</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="importCollege()" style="width:380px;text-align:center;margin-top:20px;">批量导入</button>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="showAddModal = false">取消</button>
      </div>
    </v-modal>
    <v-modal  :show="showEditModal" effect="fade" width="420">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
            {{modalType == 'add' ? '新增' : '编辑'}}{{tabsNames[curTab]}}
        </h5>
      </div>
      <div slot="modal-body" class="modal-body" style="overflow: inherit;">
        <div class="form-group box_flex">
          <div class="label require"><span>{{tabsNames[curTab]}}名称:</span></div>
          <div>
            <input type="text" class="form-control search-input" oninput="value=value.replace(/^ +| +$/g,'')" v-model="addParams[curTab][paramsName[curTab].name]" :placeholder="'请输入不重复的'+tabsNames[curTab]+'名称'" @blur="blurName">
            <div class="errMsg">{{errorMsg.name}}</div>
          </div>
        </div>
        <div class="form-group box_flex">
          <div class="label require"><span>{{tabsNames[curTab]}}代码:</span></div>
          <div>
            <input type="text" class="form-control search-input" oninput="value=value.replace(/[^\d]/g,'')" v-model="addParams[curTab][paramsName[curTab].code]" :placeholder="'请输入不重复的'+tabsNames[curTab]+'代码'" @blur="blurCode">
            <div class="errMsg">{{errorMsg.code}}</div>
          </div>
        </div>
        <div v-if="curTab=='major'" class="form-group box_flex">
          <div class="label"><span>所属学院:</span></div>
          <v-select :options="this.collegeList" options-value="value" options-label="label" close-on-select justify v-model="addParams[curTab][paramsName[curTab].collegeCode]" @afterSelected="afterSelected"></v-select>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="showEditModal = false">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="_save">保存</button>
      </div>
    </v-modal>
  </div>
  <v-import v-bind="importParams" @backParentPage="backParentPage" v-else></v-import>
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
      this.selectTab(this.tabs.college)
      this.columns.college = [{
        id: 'name',
        title: this.translate.college,
        className: 'text-left',
        hidden: false,
        search: {
          type: 'input',
          data: {
            placeholder: '搜索学院'
          }
        }
      }, {
        id: 'code',
        title: this.translate.collegeCode,
        className: 'text-left',
        hidden: false,
        search: {
          type: 'input',
          data: {
            placeholder: '搜索学院代码'
          }
        }
      }, {
        id: 'opt',
        title: this.translate.opt,
        className: 'text-left',
        width: '220px',
        hidden: false,
        formatter: function () {
          return [{
            tag: 'a',
            text: that.translate.edit,
            className: 'opt-btn',
            callback: function (record, index) {
              that._showEditModal(record, index)
            }
          }, {
            tag: 'a',
            text: that.translate.remove,
            className: 'opt-btn',
            callback: function (record, index) {
              that._deleteData(record, index)
            }
          }]
        }
      }]

      this.columns.dept = [{
        id: 'departmentName',
        title: '系别名称',
        className: 'text-left',
        hidden: false,
        search: {
          type: 'input',
          data: {
            placeholder: '搜索系别'
          }
        }
      }, {
        id: 'departmentCode',
        title: '系别代码',
        className: 'text-left',
        hidden: false,
        search: {
          type: 'input',
          data: {
            placeholder: '搜索系别代码'
          }
        }
      }]

      this.columns.major = [{
        id: 'majorName',
        title: '专业名称',
        className: 'text-left',
        hidden: false,
        search: {
          type: 'input',
          data: {
            placeholder: '搜索专业'
          }
        }
      }, {
        id: 'majorCode',
        title: '专业代码',
        className: 'text-left',
        hidden: false,
        search: {
          type: 'input',
          data: {
            placeholder: '搜索专业代码'
          }
        }
      }, {
        id: 'collegeCode',
        title: '所属学院',
        className: 'text-left',
        hidden: false,
        search: {
          type: 'select',
          data: {
            options: this.collegeList,
            optionsLabel: 'label',
            optionsValue: 'value'
          }
        },
        formatter: (record, index) => {
          let label = ""
          this.collegeList.map(item => {
            if(item.value == record.collegeCode) {
              label = item.label
            }
          })
          return label;
        }
      }, {
        id: 'opt',
        title: this.translate.opt,
        className: 'text-left',
        width: '220px',
        hidden: false,
        formatter: function () {
          return [{
            tag: 'a',
            text: that.translate.edit,
            className: 'opt-btn',
            callback: function (record, index) {
              that._showEditModal(record, index)
            }
          }, {
            tag: 'a',
            text: that.translate.remove,
            className: 'opt-btn',
            callback: function (record, index) {
              that._deleteData(record, index)
            }
          }]
        }
      }]

      this.importParams.parentPageTitle = this.translate.importTableName
      // this.importParams.importBtnType = [{
      //   name: this.translate.incrementImport,
      //   url: '/colleges/updateExcel',
      //   method: 'post',
      //   isShowBtn: true,
      //   success: (data) => {
      //     if (data.state) {
      //       this.timestamp = new Date().getTime()
      //     }
      //   }
      // }]
    },
    data: function () {
      return {
        curTab: '',
        tabs: {
          college: 'college',
          dept: 'dept',
          major: 'major'
        },
        tabsNames: {
          college: '学院',
          dept: '系别',
          major: '专业'
        },
        columns: {
          college: [],
          dept: [],
          major: []
        },
        collegeList: [],
        url: {
          table: {
            college: '/table-data/colleges/pages',
            dept: '/table-data/units/department/pages',
            major: '/table-data/system/major/pages',
          },
          add: {
            college: '/api/colleges/addOneCollege',
            dept: '',
            major: '/api/system/major/addOneMajor',
          },
          edit: {
            college: '',
            dept: '',
            major: '/api/system/major/editMajor',
          },
          delete: {
            college: '/api/colleges/deleteCollege',
            dept: '',
            major: '/api/system/major/deleteMajor',
          },
          export: {
            college: '/downloads/colleges/exportExcel',
            dept: '',
            major: '/downloads/system/major/exportExcel',
          },
          downloadTemplateUrl: {
            college: '/colleges/collegeExcelTemplate',
            dept: '/colleges/excelTemplates',
            major: '/system/major/excelTemplates'
          },
          checkTemplateUrl: {
            college: '/colleges/importCollegeExcel',
            dept: '/colleges/excel',
            major: '/system/major/importMajorExcel'
          },
          import: {
            college: '/colleges/updateCollegeExcel',
            dept: '/colleges/updateExcel',
            major: '/system/major/updateMajorExcel'
          }
        },
        timestamp: '',
        importParams: {
          parentPageTitle: '',
          downloadTemplateUrl: '/colleges/excelTemplates',
          downloadErrorTemplateUrl: '/colleges/errExcel',
          checkTemplateUrl: '/colleges/excel',
          templateName: `学院导入模板.xlsx`,
          importBtnType: null
        },
        addParams: {
          college: {
            name: '',
            code: '',
          },
          dept: {
            name: '',
            code: '',
          },
          major: {
            majorName: '',
            majorCode: '',
            // collegeName: '',
            collegeCode: '',
          },
        },
        paramsName: {
          college: {
            name: 'name',
            code: 'code',
          },
          dept: {
            name: 'name',
            code: 'code',
          },
          major: {
            name: 'majorName',
            code: 'majorCode',
            collegeCode: 'collegeCode',
            // collegeName: 'collegeName',
          },
        },
        errorMsg: {
          name: '',
          code: '',
        },
        modalType: 'add',
        showAddModal: false,
        showEditModal: false,
        showBatchSetModal: false,
        options: [],
        college: {},
        newCollege: {
          userIdErrorMsg: '',
          userName: '',
          nameErrorMsg: ''
        },
        isDisabled: {
          add: true,
          batchSet: true
        },
        showErrorMsg: false,
        checkResult: '',
        isParentPage: true,
        lang: 'zh-cn'
      }
    },
    computed: {
      translate: function () {
        return translation(this.lang).collegeManage
      }
    },
    methods: {
      afterSelected: function(val) {
      },
      blurName: function () {
        if(this.addParams[this.curTab][this.paramsName[this.curTab].name]) {
          this.errorMsg.name = ''
        } else {
          this.errorMsg.name = `请输入${this.tabsNames[this.curTab]}名称`
        }
      },
      blurCode: function () {
        if(this.addParams[this.curTab][this.paramsName[this.curTab].code]) {
          this.errorMsg.code = ''
        } else {
          this.errorMsg.code = `请输入${this.tabsNames[this.curTab]}代码`
        }
      },
      importCollege: function () {
        this.isParentPage = false
        this.showAddModal = false
        this.importParams.checkTemplateUrl = this.url.checkTemplateUrl[this.curTab]
        this.importParams.downloadTemplateUrl = this.url.downloadTemplateUrl[this.curTab]
        this.importParams.templateName = `${this.tabsNames[this.curTab]}导入模板.xlsx`
        this.importParams.importBtnType = [{
          name: this.translate.incrementImport,
          url: this.url.import[this.curTab],
          method: 'post',
          isShowBtn: true,
          success: (data) => {
            if (data.state) {
              this.timestamp = new Date().getTime()
            }
          }
        }]
      },
      backParentPage: function () {
        this.isParentPage = true
        this.showAddModal = false
      },
      _showEditModal: function (record, index) {
        let that = this
        that.modalType = 'edit'
        that.college = record
        that.addParams[that.curTab].id = record.id
        that.addParams[that.curTab][that.paramsName[that.curTab].name] = record[that.paramsName[that.curTab].name]
        that.addParams[that.curTab][that.paramsName[that.curTab].code] = record[that.paramsName[that.curTab].code]
        if(that.curTab == "major") {
          // that.addParams[that.curTab][that.paramsName[that.curTab].collegeName] = record[that.paramsName[that.curTab].collegeName]
          that.addParams[that.curTab][that.paramsName[that.curTab].collegeCode] = record[that.paramsName[that.curTab].collegeCode]
        }
        this.errorMsg.name = ''
        this.errorMsg.code = ''
        // if (confirm(that.translate.editConfirmText)) {
          that.showEditModal = true
        // }
      },
      _deleteData: function (record, index) {
        let that = this
        if (confirm(`您确定要删除该${this.tabsNames[this.curTab]}`)) {
          let url = `/api/colleges/${record.id}/delete`
          if(this.curTab == 'major') {
            url = `/api/system/major/${record.id}/delete`
          }
          sAjax({
            url: url,
            dataType: 'json',
            type: 'post',
            success: function (data) {
              if (data.state) {
                that.timestamp = new Date().getTime()
                that.$toast('删除成功')
              } else {
                that.$toast(data.message)
              }
            }
          })
        }
      },
      _showAddModal: function () {
        let that = this;
        this.showEditModal = true;
        this.showAddModal = false;
        that.addParams[that.curTab].id = null
        that.addParams[that.curTab][that.paramsName[that.curTab].name] = ''
        that.addParams[that.curTab][that.paramsName[that.curTab].code] = ''
        if(that.curTab == "major") {
          // that.addParams[that.curTab][that.paramsName[that.curTab].collegeName] = ''
          that.addParams[that.curTab][that.paramsName[that.curTab].collegeCode] = ''
        }
        this.errorMsg.name = ''
        this.errorMsg.code = ''
      },
      _export: function () {
        location.href = this.url.export[this.curTab]
      },
      _save: function () {
        var that = this
        if (!this.addParams[that.curTab][that.paramsName[that.curTab].name]) {
          this.errorMsg.name = `请输入${this.tabsNames[this.curTab]}名称`
          return false
        } else {
          this.errorMsg.name = ''
        }
        if (!this.addParams[that.curTab][that.paramsName[that.curTab].code]) {
          this.errorMsg.code = `请输入${this.tabsNames[this.curTab]}代码`
          return false
        } else {
          this.errorMsg.code = ''
        }
        let url = this.url[this.modalType][this.curTab]
        if(this.modalType == 'edit' && this.curTab == 'college') {
          url = `/api/${this.curTab}s/${this.addParams[this.curTab].id}`
        } else if(this.modalType == 'edit' && this.curTab == 'major') {
          url = `/api/system/${this.curTab}/${this.addParams[this.curTab].id}/editMajor`
        }
        sAjax({
          url: url,
          dataType: 'json',
          data: this.addParams[this.curTab],
          type: 'post',
          success: function (data) {
            if (data.state) {
              that.timestamp = new Date().getTime()
              that.showEditModal = false
              
              that.$toast('操作成功')
            } else {
              that.$toast(data.message)
            }
          }
        })
      },
      selectTab: function (tab) {
        this.curTab = tab
        let that = this
        if(this.curTab == 'major') {
          sAjax({
            url: '/api/colleges/getAllCollegeCode',
            dataType: 'json',
            type: 'get',
            success: function (data) {
              if (data.state) {
                that.collegeList = data.data
                that.columns.major[2].search.data.options = that.collegeList
              } else {
                that.$toast(data.message)
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
#collegeImport-page {
  .add-principal-group .btn-block {
    width: auto;
  }
  .add-principal-group {
    padding-left: 10px;
  }
  .modal-header {
    padding-left: 25px;
  }
  .errorMsg {
    margin: 10px 0 0 71px;
    color: red;
  }
  .edit-errorMsg {
    margin: 10px 0 0 55px;
    color: red;
  }
  .name-text {
    width: 50px;
    text-align: right;
  }
  .search-group {
    margin: 5px 0 10px 43px;
  }
  .name-input {
    border-radius: 0;
    border-top: 0 solid #ffffff;
    border-left: 0 solid #ffffff;
    border-right: 0 solid #ffffff;
    border-bottom: 2px solid #e0e0e0;
    box-shadow: inset 0 0px 0px rgba(0, 0, 0, 0.075);
    padding: 0;
  }
  .form-control[readonly] {
    background: #fff;
  }
  .search-input-group {
    margin: 5px 0 0 43px;
  }
  .search-collegeName {
    background: #ffffff;
    border: 0 solid #ffffff;
  }
  .form-group {
    margin-right: 20px;
    .label {
      width: 120px;
      font-size: 14px;
      color: #666;
      text-align: right;
      padding: 11px 12px 0;
    }
    .v-select,
    .form-control,
    .v-datepicker,
    .ditection {
      width: 220px;
      &.long-input {
        width: 600px;
      }
    }
    .errMsg {
      width: 200px;
      font-size: 12px;
      color: red;
      padding: 8px 0;
    }
  }
  .tabs {
    height: 40px;
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
      }

  }
  .info-title {
        font-size: 16px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.67);
        letter-spacing: 0;
        line-height: 16px;
        padding: 24px 40px 10px;
      }

  .table-container .table-title th.table-title-container {
    padding-top: 12px;
  }
}

#tabs-container {
  background: white;
  margin-bottom: 5px;
  -webkit-box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
  border-radius: 2px;
  position: relative;
  .common-actions {
    position: absolute;
    top: 24px;
    right: 24px;
    button {
      &:active,
      &:hover {
        
      }
    }
  }

}
</style>
