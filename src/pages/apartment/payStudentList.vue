<template>
    <div id="payStudentList-page" v-if="isParentPage">
      <div class="back-parent-page" >
        <button type="button" class="btn back-btn clearBtnBorder" @click="_backClassList">
          <i class="maticon back-icon-btn" v-html="icons('arrow_back')">arrow_back</i><span class="nav-title">{{translate.parentPage}}</span>
        </button>
      </div>
      <div class="row text-center">
        <v-table  :title="this.batchName + ' - ' + translate.tableName" :url="`${url}?timeStamp=${timeStamp}`" pagesize="10" idField="id" :columns="columns" :order="true" :search="true">
        </v-table>
      </div>
      <v-modal :show="showEditModal" effect="fade" width="500">
        <div slot="modal-header" class="modal-header">
          <h5 class="modal-title">
            {{translate.edit}}
          </h5>
        </div>
        <div slot="modal-body" class="modal-body">
          <div class="form-group">
            <label class="input-label">{{translate.isGreenChannel}}: </label>
            <v-select class="btn-block form-select-style" :disabled="(studentList.paymentStatus === 1 || studentList.paymentStatus === 3 || studentList.paymentStatus === 4)?true:false" :value="studentList.isGreenChannel" :options="options.isGreenChannel" options-value="code" options-label="name" @afterSelected="isGreenChannelSelected" search close-on-select ></v-select>
          </div>
          <div class="form-group">
            <label class="input-label modal-input-label">{{translate.remark}}: </label>
            <textarea cols="24" rows="5" class="modal-textarea-style" maxlength="600" v-model="studentList.remark"></textarea>
          </div>
        </div>
        <div slot="modal-footer" class="modal-footer">
          <button type="button" class="btn cancel-btn clearBtnBorder" @click="_cancelEdit">{{translate.cancel}}</button>
          <button type="button" class="btn submit-btn clearBtnBorder" @click="_edit">{{translate.sure}}</button>
        </div>
      </v-modal>
    </div>
</template>

<script>
  import Vue from 'vue'
  import { sAjax, translation, createTime } from '../../assets/utils/utils.js'
  export default {
    props: {
      batchid: {
        default: null
      },
      schoolYear:{
        default: null
      },
      batchName:{
        default: null
      }
    },
    created: function () {
      var la = localStorage.getItem('lang')
      var that = this
      if (translation(la)) {
        this.lang = la
      }
      sAjax({
        url: '/api/apartment/payment/batchRecord/getOption',
        dataType: 'json',
        type: 'get',
        success: (data) => {
          if (data.state) {
            var result = data.data.option
            this.options.college = result.college || []
            this.options.grade = result.grade || []
            this.options.educationLevel = result.educationLevel || []
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
        columns: [],
        url: '/table-data/apartment/payment/batchRecord/listRecord/' + this.batchid,
        studentList: {
          studentId: '',
          paymentStatus: '',
          isGreenChannel: '',
          remark: ''
        },
        options: {
          college: [],
          grade: [],
          educationLevel: [],
          paymentStatus: [],
          isGreenChannel:[{ name: '是', code: '1' },{ name: '否', code: '0' }]
        },
        isGreenChannel:{
          true:'是',
          false:'否'
        },
        payStudentList: {},
        showEditModal: false,
        isParentPage: true,
        timeStamp: null,
        lang: 'zh-cn'
      }
    },
    computed: {
      translate: function () {
        return translation(this.lang).payStudentList
      },      
    },
    methods: {
      _initColumns: function () {
        this.columns = [
          {
            id: 'schoolYear',
            title: this.translate.schoolYear,
            className: 'text-left',
            width: 60,
            hidden: false,
            formatter: (record) =>  {
              return record.schoolYear = this.schoolYear              
            }
          },
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
                placeholder: this.translate.studentNamePlaceholder
              }
            },
            formatter: function (record, index) {
              return record.name
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
                placeholder: this.translate.accountPlaceholder
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
              type: 'select',
              data: {
                options: this.options.paymentStatus,
                optionsLabel: 'name',
                optionsValue: 'code'
              }
            }
          },
          {
            id: 'isGreenChannel',
            title: this.translate.isGreenChannel,
            className: 'text-left',
            width: 80,
            hidden: false,
            search: {
              type: 'select',
              data: {
                options: this.options.isGreenChannel,
                optionsLabel: 'name',
                optionsValue: 'code'
              }
            },
            formatter: (record) => {
              return this.isGreenChannel[record.isGreenChannel]
        }
          },
          {
            id: 'remark',
            title: this.translate.remark,
            className: 'text-left',
            width: 120,
            hidden: false,
          },
          {
            id: 'opt',
            title: this.translate.opt,
            className: 'text-left',
            hidden: false,
            formatter: (record) =>  {
              return [{
                tag: 'a',
                text: this.translate.edit,
                className: 'opt-btn',
                callback:(record, index) => {
                  this.showEditModal = true
                  this.studentList.studentId = record.studentId
                  this.studentList.remark = record.remark
                  var paymentStatus = {
                    '已缴费': 1,
                    '未缴费': 2,
                    '免缴费': 3,
                    '生源地/校园地贷款': 4
                  }
                  this.studentList.paymentStatus = paymentStatus[record.paymentStatus]
                  this.studentList.isGreenChannel = record.isGreenChannel ? '1' : '0'
                }
              }]
            }
          }
        ]
      },
      isGreenChannelSelected: function (obj) {
        this.studentList.isGreenChannel = obj.value
      },
      _backClassList: function () {
        this.$emit('backClassList', 'classManage')
      },
      _edit: function(){
        sAjax({
          url: '/api/apartment/payment/batchRecord/edit/' + this.batchid,
          type: 'post',
          data : {
            studentId: this.studentList.studentId,
            isGreenChannel: this.studentList.isGreenChannel,
            remark: this.studentList.remark
          },
          success: (data) => {
            if (data.state) {
              this.showEditBatchModal = false
              this._refreshTable()
              this.$toast('编辑成功！')
              this.showEditModal = false
              this.forbidReClick = false
            } else {
              this.$toast('编辑失败！请选择是否绿色通道！')
            }
          }
        })
      },
      _cancelEdit: function(){
        this.showEditModal = false
      },
     _refreshTable: function () {
        this.timeStamp = createTime()
      },
    }
  }
</script>

<style lang="less">
@import url("../../assets/common.less");
.import-page {
  background: rgb(245, 245, 245);
  position: absolute;
  height: 100%;
  top: 10px;
  left: 0;
  right: 25px;
}
#payStudentList-page {
  .modal-input-label {
    vertical-align: top;
  }
  .modal-textarea-style {
    width: 220px;
    resize: none;
    padding: 5px;
    border: 1px solid #d9d9d9;
    border-radius: 3px;
    outline: none;
    background: #fff;
  }
  .opt-btn {
    border-radius: 3px;
    margin-right: 5px;
    font-size: 13px;
    color: rgba(0, 0, 0, 0.54);
  }
  .back-parent-page {
    margin: 0 -15px 0px -15px;
    background: rgb(245, 245, 245);
    padding: 12px 15px;
  }
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
</style>
