<template>
  <div id="accommodation-staff" class="container-fluid">
    <div class="row text-center">
      <ul id="myTab" class="nav nav-tabs relationClassManage-tab">
        <li :class="{active:isSelect == item.id}" v-for="(item, index) in tabs" :key="index" @click="changeTab(item)">
          <a>{{translate.peopleList[item.id]}}</a>
        </li>
      </ul>
    </div>
    <div class="content row">
      <div v-show="curRoute === 'allStaff'">
        <v-table
          :url="`${allStaffUrl}?timeStamp=${timeStamp}`"
          pagesize="10"
          idField="id"
          :columns="allColumns"
          :order="true"
          :columnsControl="true"
          :search="true"
          @columnExchanged="_columnExchanged"
          :key="1"
          ref="allStaffTable">
          <div slot="btn-group" class="btn-group pull-right" role="group">
            <button type="button" class="btn btn-bgColor-style clearBtnBorder" @click="_exportStaffList">{{translate.export}}</button>
            <button type="button" class="btn btn-bgColor-style clearBtnBorder" @click="curRoute = 'importPage'">批量修改</button>
          </div>
        </v-table>
      </div>
      <div v-show="curRoute === 'liveStaff'">
        <v-table
          :url="liveStaffUrl"
          pagesize="10"
          idField="id"
          :columns="liveStaffColumns"
          :order="true"
          :columnsControl="true"
          :search="true"
          @columnExchanged="_columnExchanged"
          :key="2"
          ref="liveStaffTable">
          <div slot="btn-group" class="btn-group pull-right" role="group">
            <button type="button" class="btn btn-bgColor-style clearBtnBorder"  @click="_exportStaffList">{{translate.export}}</button>
          </div>
        </v-table>
      </div>
      <div v-show="curRoute === 'importPage'">
        <v-import
          v-bind="importParams"
          @backParentPage="curRoute = 'allStaff'">
        </v-import>
      </div>
    </div>
    <v-modal :show="showEidtModal" effect="fade" width="400">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
            {{translate.edit}}
        </h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="form-group">
          <label class="input-label modal-label">{{translate.formFieldsLabel.expectedCheckInTime}}</label>
          <v-datepicker class="btn-block form-datepicker-style" :disabled="selectCheckInStatus === 'CHECK_IN'?true:false" :clearButton="false" :showTime="false" v-model="editTime.expectCheckInTime" @daySelected="_dateSelected($event, 'expectCheckInTime')"></v-datepicker>
        </div>
        <div class="form-group">
          <label class="input-label modal-label">{{translate.formFieldsLabel.expectedLeaveDormitoryTime}}</label>
          <v-datepicker class="btn-block form-datepicker-style" :clearButton="false" :showTime="false" v-model="editTime.expectRetirementTime" @daySelected="_dateSelected($event, 'expectRetirementTime')"></v-datepicker>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder"  @click="showEidtModal = false">{{translate.cancel}}</button>
        <button type="button" class="btn submit-btn clearBtnBorder"  @click="_sumbitEditTime">{{translate.confirm}}</button>
      </div>
    </v-modal>
     <v-modal :show="outputModalShow" effect="fade" width="550">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
          导出——字段选择
      </h5>
      </div>
      <div slot="modal-body" class="modal-body export-modal-body">
        <ul class="list-group">
          <li class="list-group-item field-item" :class="outputList.indexOf(field.fieldName)<0?'':'output-active'" @click="_changeOutputList(field)" v-for="(field,index) in formFields" :key="index">
            <i class="maticon" v-html="icons('check_box_outline_blank')" v-if="outputList.indexOf(field.fieldName)<0">check_box_outline_blank</i>
            <i class="maticon" v-html="icons('check_box')" v-else>check_box</i>
            <span>{{field.fieldTitle}}</span>
          </li>
        </ul>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="outputModalShow = false">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="_sureToOutput">确定</button>
      </div>
    </v-modal>
  </div>
</template>
<script>
  import Vue from 'vue'
  import $ from 'jquery'
  import { translation, sAjax, createTime } from '../../assets/utils/utils.js'
  export default {
     props: {
       account: {
         default: null
       }
    },
    created: function () {
      var la = localStorage.getItem('lang')
      if (translation(la)) {
        this.lang = la
      }
      var y = (new Date()).getFullYear()
      for (var i = y + 3; i > y - 10; i--) {
        this.searchSelectOptions.grade.push({
          value: i,
          label: i.toString()
        })
      }
      var fieldHiddenKey = 'fieldHiddenKey_' + (this.account && this.account.userId)
      var fieldHiddenValue = localStorage.getItem(fieldHiddenKey)
      if (fieldHiddenValue) {
        this.recordFieldHidden = JSON.parse(fieldHiddenValue)
      }
      this.importParams.parentPageTitle = this.translate.peopleList.allStaffUrl
      this.importParams.importBtnType = [{
        url: '/apartment/users/batch/update',
        method: 'post',
        isShowBtn: true,
        name: this.translate.overlayImport,
        success: (data) => {
          if (data.state) {
            this._refreshTable()
          }
        }
      }]
      this._getZonesData([])
      this._initColumns() 
      sAjax({
        url: '/api/apartment/users/exports/fields',
        type: 'get',
        success: (data) => {
          if (data.state) {
            this.formFields = data.data
            this.formFields.unshift({
              fieldName: 'allChoice',
              fieldTitle: '全选',
            })
          } else {
            this.$toast(data.message)
          }
        }
      })
      
    },
    data: function () {
      return {
        allStaffUrl: '/table-data/apartment/users/all/page',
        liveStaffUrl: '/table-data/apartment/users/checkIn/page',
        columns: [],
        liveStaffColumns: [],
        allColumns: [],
        isSelect: 'allStaff',
        isShowPathNav: false,
        subpageName: '',
        tabs: [{ id: 'allStaff', label: '全校人员列表' }, { id: 'liveStaff', label: '在住人员列表' }],
        showAddTypeModal: false,
        showAddModal: false,
        outputModalShow: false,
        curRoute: 'allStaff',
        addTypeData: [{ value: 'single', label: '单个新增' }, { value: 'batch', label: '批量新增'}],
        addType: 'single',
        importParams: {
          parentPageTitle: '',
          downloadTemplateUrl: '/apartment/users/batch/template',
          downloadErrorTemplateUrl: '/apartment/users/batch/error',
          checkTemplateUrl: '/apartment/users/batch/excel',
          templateName: '批量导入模板',
          importBtnType: null
        },
        campusData: [{ id: '1', text: '湖里' }, { id: '2', text: '思明' }],
        parkData: [{ id: '1', text: '湖里' }, { id: '2', text: '思明' }],
        searchSelectOptions: {
          peopleType: [{ id: 'student', text: '学生' }, { id: 'teacher', text: '老师' }, { id: 'OTHER', text: '其他' }],
          campusNames: [],
          zoneNames: [],
          buildings: [],
          checkInStatus: [{value: 'WAIT_CHECK_IN', label: '未入住'}, {value: 'CHECK_IN', label: '已入住'},{value:'IN_CHECK_IN: ',label:'入住确认中'},{value:'RETIREMENT: ',label:'退宿确认中'}, {value: 'RETIREMENT', label: '已退宿'}],
          paymentStatus: [{value: '1', label: '已缴费'}, {value: '2', label: '未缴费'}, {value: '3', label: '免缴费'}, {value: '4', label: '生源地/校园地贷款'}],
          grade: [],
          studyYears: [{value: 1, label: '1'}, {value: 2, label: '2'}, {value: 3, label: '3'}, {value: 4, label: '4'}]
        },
        checkInStatus: {
          WAIT_CHECK_IN: '未入住',
          IN_CHECK_IN: '入住确认中',
          IN_RETIREMENT: '退宿确认中',
          CHECK_IN: '已入住',
          RETIREMENT: '已退宿'
        },
        paymentStatus: {
          1: '已缴费',
          2: '未缴费',
          3: '免缴费',
          4: '生源地/校园地贷款'
        },
        isShowSearch: true,
        showEidtModal: false,
        editTime: {
          userId: '',
          expectCheckInTime: '',
          expectRetirementTime: ''
        },
        outputList: [],
        formFields: [],
        timeStamp: '',
        recordFieldHidden: {
          allStaff: {
            name: false,
            userNo: false,
            account: true,
            typeName: false,
            educationLevel: true,
            studyYears: true,
            sex: true,
            college: false,
            grade: true,
            instructorName: true,
            campus: false,
            zone: false,
            building: false,
            room: false,
            expectCheckInTime: true,
            relCheckInTime: true,
            expectRetirementTime: true,
            relRetirementTime: true,
            paymentStatus: true,
            checkInStatus: true,
            isGiveUp: true,
            phone: true,
            opt: false
          },
          liveStaff: {
            name: false,
            userNo: false,
            account: true,
            typeName: false,
            educationLevel: true,
            studyYears: true,
            sex: true,
            college: false,
            grade: true,
            instructorName: true,
            campus: false,
            zone: false,
            building: false,
            room: false,
            expectCheckInTime: true,
            relCheckInTime: true,
            expectRetirementTime: true,
            relRetirementTime: true,
            paymentStatus: true,
            checkInStatus: true,
            isGiveUp: true,
            phone: true,
            opt: false
          }
        },
        selectCheckInStatus: '',
        campusIds: [],
        zoneIds: [],
        lang: 'zh-cn'
      }
    },
    computed: {
      translate: function () {
        return translation(this.lang).accommodationStaff
      }
    },
    methods: {
      _initColumns: function () {
         this.columns = [{
          id: 'userNo',
          title: this.translate.userNo,
          width: 120,
          className: 'text-left',
          hidden: this.recordFieldHidden[this.isSelect]['userNo'],
          search: {
            type: 'input',
            data: {
              placeholer: '',
              autoFocus: false
            }
          }
        }, {
          id: 'account',
          title: this.translate.freshmanNo,
          width: 100,
          className: 'text-left',
          hidden: this.recordFieldHidden[this.isSelect]['account'],
          search: {
            type: 'input',
            data: {
              placeholer: '',
              autoFocus: false
            }
          }
        }, {
          id: 'name',
          title: this.translate.name,
          width: 120,
          className: 'text-left',
          hidden: this.recordFieldHidden[this.isSelect]['name'],
          search: {
            type: 'input',
            data: {
              placeholer: '',
              autoFocus: false
            }
          }
        }, {
          id: 'sex',
          title: '性别',
          width: 80,
          className: 'text-left',
          hidden: this.recordFieldHidden[this.isSelect]['sex'],
          search: {
            type: 'select',
            data: {
              url: '/api/apartment/dicts?typeName=性别',
              optionsLabel: 'label',
              optionsValue: 'value'
            }
          }
        }, {
          id: 'college',
          title: this.translate.college,
          width: 100,
          className: 'text-left',
          hidden: this.recordFieldHidden[this.isSelect]['college'],
          search: {
            type: 'multiSelect',
            data: {
              url: `/api/apartment/unit/list`,
              optionsLabel: 'name',
              optionsValue: 'code'
            }
          }
        }, {
          id: 'educationLevel',
          title: '培养层次',
          width: 80,
          className: 'text-left',
          hidden: this.recordFieldHidden[this.isSelect]['educationLevel'],
          search: {
            type: 'multiSelect',
            data: {
              url: '/api/apartment/dicts?typeName=培养层次',
              optionsLabel: 'label',
              optionsValue: 'value'
            }
          }
        }, {
          id: 'studyYears',
          title: this.translate.schoolSystem,
          width: 80,
          className: 'text-left',
          hidden: this.recordFieldHidden[this.isSelect]['studyYears'],
          search: {
            type: 'multiSelect',
            data: {
              options: this.searchSelectOptions.studyYears,
              optionsLabel: 'label',
              optionsValue: 'value'
            }
          }
        }, {
          id: 'grade',
          title: this.translate.grade,
          width: 100,
          className: 'text-left',
          hidden: this.recordFieldHidden[this.isSelect]['grade'],
          search: {
            type: 'multiSelect',
            data: {
              options: this.searchSelectOptions.grade,
              optionsLabel: 'label',
              optionsValue: 'value'
            }
          }
        }, {
          id: 'instructor',
          title: this.translate.instructor,
          width: 100,
          className: 'text-left',
          hidden: this.recordFieldHidden[this.isSelect]['instructorName'],
          search: {
            type: 'input',
            data: {
              placeholer: '',
              autoFocus: false
            }
          },
          formatter: (record) => {
            return record.instructorName
          }
        }, {
          id: 'userType',
          title: this.translate.peopleType,
          className: 'text-left',
          width: 100,
          hidden: this.recordFieldHidden[this.isSelect]['typeName'],
          search: {
            type: 'multiSelect',
            data: {
              options: this.searchSelectOptions.peopleType,
              optionsLabel: 'text',
              optionsValue: 'id'
            }
          },
          formatter: (record) =>{
            return record.typeName
          }
        }, {
          id: 'campus',
          title: this.translate.formFieldsLabel.campus,
          width: 100,
          className: 'text-left',
          hidden: this.recordFieldHidden[this.isSelect]['campus'],
          search: {
            type: 'multiSelect',
            data: {
              url: '/api/apartment/dicts?typeName=校区',
              optionsLabel: 'label',
              optionsValue: 'value',
              change: (obj) => {
                this.campusIds.splice(0, this.campusIds.length)
                if (obj.value.length > 0) {
                  this.campusIds = obj.value.split(',')
                }
                this._getZonesData()
              }
            }
          }
        }, {
          id: 'zone',
          title: this.translate.formFieldsLabel.park,
          width: 100,
          className: 'text-left',
          hidden: this.recordFieldHidden[this.isSelect]['zone'],
          search: {
            type: 'multiSelect',
            data: {
              options: this.searchSelectOptions.zoneNames,
              optionsLabel: 'label',
              optionsValue: 'value',
              change: (obj) => {
                this.zoneIds.splice(0, this.zoneIds.length)
                if (obj.value.length > 0) {
                  this.zoneIds = obj.value.split(',')
                }
                this._getBuildingsData()
              }
            }
          }
        }, {
          id: 'building',
          title: this.translate.formFieldsLabel.building,
          width: 100,
          className: 'text-left',
          hidden: this.recordFieldHidden[this.isSelect]['building'],
          search: {
            type: 'select',
            data: {
              options: this.searchSelectOptions.buildings,
              optionsLabel: 'label',
              optionsValue: 'value',
            }
          }
        }, {
          id: 'room',
          title: this.translate.formFieldsLabel.roomNumber,
          width: 100,
          className: 'text-left',
          hidden: this.recordFieldHidden[this.isSelect]['room']
        }, {
          id: 'expectCheckInTime',
          title: this.translate.formFieldsLabel.expectedCheckInTime,
          width: 100,
          className: 'text-left',
          hidden: this.recordFieldHidden[this.isSelect]['expectCheckInTime']
        }, {
          id: 'relCheckInTime',
          title: this.translate.formFieldsLabel.realCheckInTime,
          width: 100,
          className: 'text-left',
          hidden: this.recordFieldHidden[this.isSelect]['relCheckInTime']
        }, {
          id: 'expectRetirementTime',
          title: this.translate.formFieldsLabel.expectedLeaveDormitoryTime,
          width: 100,
          className: 'text-left',
          hidden: this.recordFieldHidden[this.isSelect]['expectRetirementTime']
        }, {
          id: 'relRetirementTime',
          title: this.translate.formFieldsLabel.realLeaveDormitoryTime,
          width: 100,
          className: 'text-left',
          hidden: this.recordFieldHidden[this.isSelect]['relRetirementTime']
        }, {
          id: 'paymentStatus',
          title: '缴费情况',
          width: 100,
          className: 'text-left',
          hidden: this.recordFieldHidden[this.isSelect]['paymentStatus'],
          search: {
            type: 'multiSelect',
            data: {
              options: this.searchSelectOptions.paymentStatus,
              optionsLabel: 'label',
              optionsValue: 'value'
            }
          },
          formatter: (record) => {
            if (record.paymentStatus) {
              return this.paymentStatus[record.paymentStatus]
            } else {
              return ''
            }
          }
        }]
        if (this.isSelect === 'allStaff') {
          this.columns.push({
            id: 'checkInStatus',
            title: '入住情况',
            width: 100,
            className: 'text-left',
            hidden: this.recordFieldHidden[this.isSelect]['checkInStatus'],
            search: {
              type: 'multiSelect',
              data: {
                options: this.searchSelectOptions.checkInStatus,
                optionsLabel: 'label',
                optionsValue: 'value'
              }
            },
            formatter: (record) => {
              return this.checkInStatus[record.checkInStatus]
            }
          })
        } else {
          this.columns.push({
            id: 'checkInStatus',
            title: '入住情况',
            width: 100,
            className: 'text-left',
            hidden: this.recordFieldHidden[this.isSelect]['checkInStatus'],
            formatter: (record) => {
              return this.checkInStatus[record.checkInStatus]
            }
          })
        }
        this.columns.push({
            id: 'isGiveUp',
            title: '是否放弃入住（是/否）',
            width: 150,
            className: 'text-left',
            hidden: this.recordFieldHidden[this.isSelect]['isGiveUp'],
            formatter: (record) => {
              return record.isGiveUp ? '是' : '否'
            }
          }, {
            id: 'phone',
            title: '电话',
            width: 100,
            className: 'text-left',
            hidden: this.recordFieldHidden[this.isSelect]['phone']
          }, {
          id: 'opt',
          title: this.translate.opt,
          className: 'text-centet',
          width: 130,
          hidden: this.recordFieldHidden[this.isSelect]['opt'],
          formatter: (recordItem) => {
            var opts = [{
              tag: 'a',
              text: this.translate.check,
              className: 'opt-btn',
              callback: (record, index) => {
                this.$emit('addBread', {
                  route: '/apartment/staffInfo?userId=' + record.userId,
                  title: record.name + '的信息',
                })
              }
            }]
            if (recordItem.checkInStatus !== 'RETIREMENT' && recordItem.building) {
              opts.unshift({
                tag: 'a',
                text: this.translate.edit,
                callback: (record, index) => {
                  this.showEidtModal = true
                  this.editTime =  {
                    userId: record.userId,
                    expectCheckInTime: record.expectCheckInTime,
                    expectRetirementTime: record.expectRetirementTime
                  }
                  this.selectCheckInStatus = record.checkInStatus
                }
              })
            }
            return opts
          }
        })
        if (this.isSelect === 'allStaff') {
          this.allColumns = this.columns
        } else {
          this.liveStaffColumns = this.columns
        }
      },
      changeTab: function (obj) {
        this.isSelect = obj.id
        this.curRoute = obj.id
        this._initColumns()
      },
      _columnExchanged: function (obj) {
        this.recordFieldHidden[this.isSelect][obj.id] = obj.hidden
        var fieldHiddenKey = 'fieldHiddenKey_' + (this.account && this.account.userId)
        var fieldHiddenValue = JSON.stringify(this.recordFieldHidden)
        localStorage.setItem(fieldHiddenKey, fieldHiddenValue)
      },
      _getZonesData: function () {
        sAjax({
          url: '/api/apartment/zones/getByCampuses?campusIds=' + this.campusIds,
          type: 'get',
          success: (data) => {
            if (data.state) {
              this.searchSelectOptions.zoneNames.splice(0, this.searchSelectOptions.zoneNames.length)
              if (data.data) {
                data.data.forEach((ele) => {
                  this.searchSelectOptions.zoneNames.push({
                    label: ele.name,
                    value: ele.zoneId
                  })
                })
              }
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      _getBuildingsData: function () {
        sAjax({
          url: '/api/apartment/buildings/getWithConditions?campusIds=' + this.campusIds + '&zoneIds=' + this.zoneIds,
          type: 'get',
          success: (data) => {
            if (data.state) {
              this.searchSelectOptions.buildings.splice(0, this.searchSelectOptions.buildings.length)
              if (data.data) {
                data.data.forEach((ele) => {
                  this.searchSelectOptions.buildings.push({
                    label: ele.name,
                    value: ele.buildingId
                  })
                })
              }
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      _sumbitEditTime: function () {
        this.editTime.expectCheckInTime = /\d{4}-\d{1,2}-\d{1,2}/g.exec(this.editTime.expectCheckInTime)[0]
        this.editTime.expectRetirementTime = /\d{4}-\d{1,2}-\d{1,2}/g.exec(this.editTime.expectRetirementTime)[0]
        sAjax({
          url: '/api/apartment/users',
          type: 'post',
          data: this.editTime,
          success: (data) => {
            if (data.state) {
              this.showEidtModal = false
              this._refreshTable()
              this.$toast('编辑成功')
            } else {
              this.$toast(data.message)
            }
          }
        })
        
      },
      _dateSelected: function (obj, cell) {
        var expectCheckInTime = this.editTime.expectCheckInTime
        var expectRetirementTime = this.editTime.expectRetirementTime
        if (cell === 'expectCheckInTime') {
          if (expectRetirementTime) {
            var timeString = new Date(obj.value).getTime() - new Date(expectRetirementTime).getTime()
            if (timeString > 0) {
              this.$nextTick(() => {
                this.toast('预计入住时间要在预计退宿时间之前')
                this.editTime.expectCheckInTime = ''
              })
              return false
            } else {
              this.editTime.expectCheckInTime = obj.value
            }
          } else {
            this.editTime.expectCheckInTime = obj.value
          }
        }
        if (cell === 'expectRetirementTime') {
          if (expectCheckInTime) {
            var timeString = new Date(obj.value).getTime() - new Date(expectCheckInTime).getTime()
            if (timeString < 0) {
              this.$nextTick(() => {
                this.toast('预计退宿时间要在预计入住时间之后')
                this.editTime.expectRetirementTime = ''
              })
              return false
            } else {
              this.editTime.expectRetirementTime = obj.value
            }
          } else {
            this.editTime.expectRetirementTime = obj.value
          }
        }
        
      },
      _exportStaffList: function () {
        this.outputList = []
        this.outputModalShow = true
      },
      _changeOutputList: function (field) {
        // this.outputList = []
        if(field.fieldName == 'allChoice') {
          if(this.outputList.length == this.formFields.length) {
             this.outputList = []
          }else {
            this.outputList = []
            for(let i = 0;i<this.formFields.length;i++) {
              this.outputList.push(this.formFields[i].fieldName)
            }
          }
        }else{
          var index = this.outputList.indexOf(field.fieldName)
          if (index >= 0) {
            this.outputList.splice(index, 1)
            let allChoice =  this.outputList.indexOf('allChoice') 
              if(allChoice >= 0) {
                this.outputList.splice(allChoice,1)
              }
          } else {
            this.outputList.push(field.fieldName)
            if((this.outputList.length == this.formFields.length - 1) && field.fieldName != 'allChoice') {
              this.outputList.push('allChoice')
            } 
          }
        }
        
      },
      _sureToOutput: function () {
        if (this.outputList.length === 0) {
          this.$toast('请选择要导出的字段')
          return
        }
        if(this.outputList.indexOf('allChoice') >= 0) {
          this.outputList.splice(this.outputList.indexOf('allChoice'),1)
        }
        var searchData = {}
        if (this.curRoute === 'allStaff') {
          searchData = JSON.parse(JSON.stringify(this.$refs.allStaffTable.tableSearchFields))
        } else {
          searchData = JSON.parse(JSON.stringify(this.$refs.liveStaffTable.tableSearchFields))
        }
        var searchText = ''
        for (var i in searchData) {
          if (!searchData[i]) {
            searchText += '&' + i + '=' + ''
          } else {
            searchText += '&' + i + '=' + searchData[i]
          }
        }
        var fieldText = ''
        this.outputList.forEach((ele) => {
          fieldText += ele + ','
        })
        fieldText = fieldText.substring(0, fieldText.length - 1)
        var myDate = new Date()
        var nowTime = myDate.getFullYear() + this._getTimeFormat(myDate.getMonth() + 1) + this._getTimeFormat(myDate.getDate())
        if (this.isSelect === 'allStaff') {
           window.location.href = '/downloads/apartment/users/apartmentUser/excels?fileName=人员信息_' + nowTime + '&fields=' + fieldText + searchText
        } else {
           window.location.href = '/downloads/apartment/users/checkIn/apartmentUser/excels?fileName=人员信息_' + nowTime + '&fields=' + fieldText + searchText
        }
       this.outputModalShow = false
      },
      _getTimeFormat: function (time) {
        return  time < 10 ? '0' + time : time
      },
       _refreshTable: function () {
        this.timeStamp = createTime()
      }
    }
  }
</script>
<style lang="less">
@import url("../../assets/common.less");

#accommodation-staff {
  .relationClassManage-tab {
    li {
      &.active {
        a {
          color: #298df7;
        }
      }
      a {
        color: rgba(0, 0, 0, 0.87);
      }
    }
  }
  .export-modal-body {
    height: 400px;
    .field-item {
      border: 0;
      overflow: hidden;
      cursor: pointer;
      i,
      span {
        float: left;
        font-weight: 500;
        margin-right: 10px;
        line-height: 24px;
        color: rgba(0, 0, 0, 0.54);
      }
      &.output-active {
        i,
        span {
          color: rgba(0, 0, 0, 0.87);
        }
      }
    }
  }
  .content {
    position: relative;
  }
  .modal-label {
    width: 90px;
    text-align: right;
    margin-right: 8px;
  }
  .info-item {
    margin-top: 12px;
    overflow: hidden;
    .item-title {
      display: block;
      float: left;
      width: 57px;
      margin-right: 10px;
      font-size: 14px;
      font-weight: bold;
      color: #151515;
      letter-spacing: 0;
      text-align: right;
      line-height: 24px;
    }
    .info-options {
      display: inline-block;
      &.disabled-click {
        span {
          cursor: not-allowed;
        }
      }
      span {
        display: inline-block;
        margin-left: 1px;
        margin-right: 20px;
        margin-bottom: 17px;
        font-size: 14px;
        color: #555555;
        letter-spacing: 0.6px;
        text-align: left;
        line-height: 24px;
        cursor: pointer;
        i {
          float: left;
          margin-right: 2px;
          font-size: 22px;
          color: #d9d9d9;
          &.active {
            color: #298df7;
          }
        }
      }
    }
  }
  .search-user {
    display: inline-block;
    vertical-align: bottom;
    input {
      border-radius: 3px;
      width: 220px;
      &:focus {
        border: 1px solid #ccc;
        box-shadow: none;
        outline: none;
      }
    }
  }
  .user-info {
    display: inline-block;
    height: 34px;
    width: 220px;
    position: relative;
    padding-top: 6px;
    div {
      display: inline-block;
    }
    i {
        font-size: 20px;
        cursor: pointer;
        position: absolute;
        top: 6px;
        right: 0;
      }
  }
    
}
</style>
