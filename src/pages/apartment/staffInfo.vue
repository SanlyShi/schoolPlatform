<template>
  <div id="staff-info">
    <!-- <div class="log">
      <button class="btn log-toggle" :class="[log.logShow?'open':'']" title="操作日志"@click="log.logShow = !log.logShow">
        日志
      </button>
      <div class="log-content" :class="[log.logShow?'active':'']">

      </div>
    </div> -->
    <div class="header">
      <label class="header-title pull-left">住宿人员信息</label>
      <div class="pull-right" v-if="!isEdit">
        <button type="button" class="btn submit-btn " @click="isEdit = true">编辑</button>
      </div>
      <div class="pull-right" v-else>
        <button type="button" class="btn submit-btn" @click="_saveInfo">保存</button>
        <button type="button" class="btn cancel-btn" @click="_cancelEdit">取消</button>
      </div>
    </div>
    <div class="content" :style="'max-height:' + scrollHeight + 'px'">
      <div class="info-card clearStyle">
        <label class="card-title">基本信息</label>
        <div>
          <div class="row">
            <div class="col-md-4" v-for="(item, itemIndex) in basicInfo.layout.columns" :key="itemIndex">
              <div class="form-group" v-for="(cell, cellIndex) in item.cells" :key="cellIndex" v-if="cell.type==='notEditable'">
                <label class="input-label title-label">{{cell.title}}:</label>
                <label class="input-label modal-label">{{basicInfo.defaultValue[cell.name]}}</label>
              </div>
              <div class="form-group" v-else>
                <label class="input-label title-label">{{cell.title}}:</label>
                <label class="input-label modal-label" v-if="!isEdit">{{basicInfo.defaultValue[cell.name]}}</label>
                <input type="text" class="form-control form-input-style" v-model="basicInfo.defaultValue[cell.name]" @change="_changeValue(cell.name)" v-else>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label class="input-label textarea-label">备注:</label>
            <textarea cols="24" rows="3" class="textarea-style" :disabled="isEdit?false:true" maxlength="600" v-model="basicInfo.defaultValue.remark"></textarea>
          </div>
        </div>
      </div>
      <div class="info-card">
        <label class="card-title">住宿信息</label>
        <div>
          <label class="input-label title-label">所属宿舍:</label>
          <label>{{accommodationInfo.defaultValue.ownDormitory}}</label>
        </div>
        <div class="row">
          <div class="col-md-4" v-for="(item, itemIndex) in accommodationInfo.layout.columns" :key="itemIndex">
            <div class="form-group" v-for="(cell, cellIndex) in item.cells" :v-for="cellIndex" v-if="cell.type==='notEditable'">
              <label class="input-label title-label">{{cell.title}}:</label>
              <label class="input-label modal-label">{{accommodationInfo.defaultValue[cell.name]}}</label>
            </div>
            <div class="form-group" v-else>
              <label class="input-label title-label" style="vertical-align: bottom">{{cell.title}}:</label>
              <div v-if="isCanEdit[cell.name]" style="display: inline-block">
                <label class="input-label modal-label" v-if="!isEdit">{{_getTimeTextShow(accommodationInfo.defaultValue[cell.name])}}</label>
                <v-datepicker class="btn-block form-datepicker-style" format="yyyy-MM-dd" :clearButton="false" :showTime="false" v-model="accommodationInfo.defaultValue[cell.name]" @daySelected="_dateSelected($event, cell.name)" v-else></v-datepicker>
              </div>
              <div v-else style="display: inline-block">
                <label class="input-label modal-label" >{{_getTimeTextShow(accommodationInfo.defaultValue[cell.name])}}</label>
              </div>
            </div>
          </div>
        </div>
        <div class="table-container">
          <v-table
            title="入退调记录"
            idField="id"
            :columns="accommodationInfo.historyRecordColumns"
            :rows="accommodationInfo.historyRecord"
            :order="true"
            :columnsControl="false"
            :paginationShow="false"></v-table>
        </div>  
      </div>
      <div class="info-card">
        <label class="card-title">缴费记录</label>
        <div class="table-container">
          <v-table
            title="历史缴费记录"
            idField="id"
            :columns="paymentRecord.historyRecordColumns"
            :rows="paymentRecord.historyRecord"
            :order="true"
            :columnsControl="false"
            :paginationShow="false"></v-table>
        </div> 
      </div>
      <div class="info-card">
        <label class="card-title">生活习惯</label>
        <div class="row">
          <div class="col-md-4" v-for="(item, itemIndex) in livingHabit.layout.columns" :key="itemIndex">
            <div class="form-group" v-for="(cell, cellIndex) in item.cells" :v-for="cellIndex">
              <label class="input-label title-label">{{cell.title}}:</label>
              <label class="input-label modal-label">{{livingHabit.defaultValue[cell.name]}}</label>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label class="input-label title-label">其他:</label>
          <label class="input-label modal-label">{{livingHabit.defaultValue.other}}</label>
        </div>
        <div class="form-group">
          <label class="input-label textarea-label">备注:</label>
          <textarea cols="24" rows="3" class="textarea-style" maxlength="600" :disabled="isEdit?false:true" v-model="livingHabit.defaultValue.remark"></textarea>
        </div>
      </div>
      <div class="info-card">
        <label class="card-title">违规违纪记录</label>
        <div>
          <v-table
          title="违规违纪记录"
          idField="id"
          :columns="violationRecord.historyRecordColumns"
          :rows="violationRecord.historyRecord"
          :order="true"
          :columnsControl="false"
          :paginationShow="false">
          <div slot="btn-group" class="btn-group pull-right" role="group">
            <button type="button" class="btn clearBtnBorder add-btn" @click="showAddRecordModa">新增</button>
          </div>
          </v-table>
        </div>
      </div>
    </div>
    <v-modal :show="showAddModal" effect="fade" width="450">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
           新增违规违纪记录
        </h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="form-group">
          <label class="input-label modal-label">违规类型</label>
          <v-select class="btn-block form-select-style" :value="violationRecord.addViolationData.violationTypeDefaultValue"  :options="violationRecord.addViolationData.violationTypeData" optionsLabel="label" optionsValue="value"  @afterSelected="_valueSelected" search close-on-select></v-select>
        </div>
        <div class="form-group">
          <label class="input-label modal-textarea-label">备注</label>
          <textarea cols="24" rows="3" class="modal-textarea-style" maxlength="600" v-model="violationRecord.addViolationData.remark"></textarea>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder"  @click="showAddModal = false">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder"  @click="addViolationRecord">确认</button>
      </div>
    </v-modal>
  </div>
</template>
<script>
  import Vue from 'vue'
  import { sAjax, translation, createTime } from '../../assets/utils/utils.js'
  export default {
    inject: {
      windowObj: {
        default: null
      }
    },
    props: {
      data: {
        default: null
      }
    },
    data: function () {
      return {
        basicInfo: {
          layout: {
            columns: [{
              index: '0',
              cells: [{
                title: '姓名',
                name: 'name',
                type: 'notEditable'
              }, {
                title: '准考证号',
                name: 'admissionTicketNumber',
                type: 'notEditable'
              }, {
                title: '宗教',
                name: 'religion',
                type: 'notEditable'
              }, {
                title: '专业',
                name: 'profession',
                type: 'notEditable'
              }, {
                title: '学籍',
                name: 'schoolRoll',
                type: 'notEditable'
              }, {
                title: '邮箱',
                name: 'email',
                type: 'editable'
              }, {
                title: '学生类型',
                name: 'studentType',
                type: 'notEditable'
              }, {
                title: '延毕原因',
                name: 'reasonForDelayingGraduation',
                type: 'notEditable'
              }]
            }, {
              index: '1',
              cells: [{
                title: '性别',
                name: 'sex',
                type: 'notEditable'
              }, {
                title: '国籍',
                name: 'nationality',
                type: 'notEditable'
              }, {
                title: '学院',
                name: 'college',
                type: 'notEditable'
              }, {
                title: '年级',
                name: 'grade',
                type: 'notEditable'
              }, {
                title: '电话',
                name: 'phone',
                type: 'editable'
              }, {
                title: '生源地',
                name: 'studentSource',
                type: 'notEditable'
              }, {
                title: '人员类型',
                name: 'personType',
                type: 'notEditable'
              }, {
                title: '民族',
                name: 'nation',
                type: 'notEditable'
              }]
            }, {
              index: '2',
              cells: [{
                title: '学号',
                name: 'userNo',
                type: 'notEditable'
              }, {
                title: '系别',
                name: 'department',
                type: 'notEditable'
              }, {
                title: '培养层次',
                name: 'cultureLevel',
                type: 'notEditable'
              }, {
                title: '身份证号',
                name: 'identityNumber',
                type: 'notEditable'
              }, {
                title: '学习方式',
                name: 'learningMethod',
                type: 'notEditable'
              }, {
                title: '学制',
                name: 'schoolSystem',
                type: 'notEditable'
              }, {
                title: '辅导员',
                name: 'instructor',
                type: 'notEditable'
              }]
            }]
          },
          defaultValue: {
            name: '',
            admissionTicketNumber: '',
            religion: '',
            profession: '',
            schoolRoll: '',
            email: '',
            studentType: '',
            instructor: '',
            sex: '',
            nationality: '',
            college: '',
            grade: '',
            phone: '',
            studentSource: '',
            personType: '',
            reasonForDelayingGraduation: '',
            userNo: '',
            nation: '',
            nativeLanguage: '',
            department: '',
            cultureLevel: '',
            identityNumber: '',
            learningMethod: '',
            schoolSystem: '',
            remark: ''
          }
        },
        accommodationInfo: {
          layout: {
            columns: [{
              index: '0',
              cells: [{
                title: '入住情况',
                name: 'checkInSituation',
                type: 'notEditable'
              }]
            }, {
              index: '1',
              cells: [{
                title: '预计入住时间',
                name: 'expectedCheckInTime',
                type: 'editable'
              }]
            }, {
              index: '2',
              cells: [{
                title: '预计退宿时间',
                name: 'expectedLeaveDormitoryTime',
                type: 'editable'
              }]
            }]
          },
          defaultValue: {
            ownDormitory: '',
            checkInSituation: '',
            expectedCheckInTime: '',
            expectedLeaveDormitoryTime: ''
          },
          historyRecord: [],
          historyRecordColumns: [{
            id: 'changeDate',
            title: '入退调时间',
            className: 'text-left',
            hidden: false,
          },{
            id: 'changeDate',
            title: '事项',
            className: 'text-left',
            hidden: false,
            formatter: (record) => {
          //     WAIT_CHECK_IN: '预分配',
          // CHECK_IN: '已入住',
          // RETIREMENT: '退宿',
          // ACCOMMODATION: '调宿'
              if(record.checkInStatus == 'IN_CHECK_IN') {
                return '入住确认中'
              }
              if(record.checkInStatus == 'IN_RETIREMENT') {
                return '退宿确认中'
              }
              if(record.checkInStatus == 'WAIT_CHECK_IN') {
                return '分配'
              }
              if(record.checkInStatus == 'CHECK_IN') {
                return '入住'
              }
              if(record.checkInStatus == 'RETIREMENT') {
                return '退宿'
              }
              if(record.checkInStatus == 'ACCOMMODATION') {
                return '调宿'
              }

            }
          }, {
            id: 'checkInStatus',
            title: '入退调记录',
            className: 'text-left',
            hidden: false,
            formatter: (record) => {
              console.log(record)
              if(record.checkInStatus == 'RETIREMENT') {
                return '从' + record.roomValue + '退宿'
              }else {
                return this.checkInStatus[record.checkInStatus] + record.roomValue
              }
             
            }
          }]
        },
        paymentRecord: {
          historyRecord: [],
          historyRecordColumns:[{
            id: 'createTime',
            title: '时间',
            className: 'text-left',
            hidden: false,
          }, {
            id: 'batchName',
            title: '名称',
            className: 'text-left',
            hidden: false,
          }, {
            id: 'schoolYear',
            title: '学年',
            className: 'text-left',
            hidden: false,
          }, {
            id: 'paymentStatus',
            title: '状态',
            className: 'text-left',
            hidden: false,
          }, {
            id: 'cost',
            title: '费用',
            className: 'text-left',
            hidden: false,
          }, {
            id: 'remark',
            title: '备注',
            className: 'text-left',
            hidden: false,
          }]
        },
        livingHabit: {
          layout: {
            columns: [{
              index: '0',
              cells: [{
                title: '作息时间',
                name: 'schedule',
                type: 'notEditable'
              }]
            }, {
              index: '1',
              cells: [{
                title: '兴趣爱好',
                name: 'hobby',
                type: 'notEditable'
              }]
            }, {
              index: '2',
              cells: [{
                title: '空调温度',
                name: 'airConditioningTemperature',
                type: 'notEditable'
              }]
            }]
          },
          defaultValue: {
            schedule: '',
            hobby: '',
            airConditioningTemperature: '',
            other: '',
            remark: ''
          }
        },
        violationRecord: {
          historyRecord: [],
          historyRecordColumns:[{
            id: 'type',
            title: '违规类型',
            width: 150,
            className: 'text-left',
            hidden: false,
          }, {
            id: 'createTime',
            title: '记录时间',
            width: 200,
            className: 'text-left',
            hidden: false,
          }, {
            id: 'remark',
            title: '备注',
            width: 300,
            className: 'text-left',
            hidden: false,
          }, {
            id: 'opt',
            title: '操作',
            className: 'text-centet',
            hidden: false,
            formatter: (recordItem) => {
              return [{
                tag: 'a',
                text: '删除',
                callback: (record, index) => {
                  if (confirm('确定要删除吗')) {
                    sAjax({
                      url: '/api/apartment/users/disciplinary/' + record.id,
                      type: 'post',
                      success: (data) => {
                        if (data.state) {
                          this.$toast('删除成功')
                          this._refreshTable()
                          this._getViolationData()
                        } else {
                          this.$toast(data.message)
                        }
                      }
                    })
                  }
                }
              }]
            }
          }],
          addViolationData: {
            violationTypeDefaultValue: '',
            violationTypeData: [],
            remark: ''
          }
        },
        log: {
          logShow: false,
        },
        isEdit: false,
        isCanEdit: {
          expectedCheckInTime: true,
          expectedLeaveDormitoryTime: true
        },
        showAddModal: false,
        timeStamp: '',
        checkInStatus: {
          WAIT_CHECK_IN: '预分配',
          CHECK_IN: '已入住',
          IN_CHECK_IN: '入住确认中',
          IN_RETIREMENT: '退宿确认中',
          RETIREMENT: '退宿',
          ACCOMMODATION: '调宿'
        },
        recordBeforeEditData: {
          phone: '',
          email: '',
          baseInfoRemark: '',
          userHabitsRemark: '',
          expectCheckInTime: '',
          expectRetirementTime: ''
        },
        scrollHeight: null
      }
    },
    created: function () {
      sAjax({
        url: '/api/apartment/users/baseInfo/' + this.data.data.userId,
        type: 'get',
        success: (data) => {
          if (data.state) {
            var data = data.data || []
            if (data) {
              this.basicInfo.defaultValue = {
                name: data.name,
                admissionTicketNumber: data.userNo,
                religion: data.faith,
                profession: data.major,
                schoolRoll: data.statusOfSchoolStatus,
                email: data.email,
                studentType: data.studentType,
                instructor: data.instructorName,
                sex: data.sex,
                nationality: data.nationality,
                college: data.college,
                grade: data.grade,
                phone: data.phone,
                studentSource: data.originPlace,
                personType: data.userType,
                reasonForDelayingGraduation: data.isPostpone,
                userNo: data.userNo,
                department: data.department,
                cultureLevel: data.educationLevel,
                nation: data.nation,
                identityNumber: data.idCardNo,
                learningMethod: data.studyType,
                schoolSystem: data.studyYears,
                remark: data.remark
              }
              this.recordBeforeEditData.phone = data.pone
              this.recordBeforeEditData.email = data.email
              this.recordBeforeEditData.baseInfoRemark = data.remark
            }
          } else {
            this.$toast(data.message)
          }
        }
      })
      sAjax({
        url: '/api/apartment/users/apartmentInfo/' + this.data.data.userId,
        type: 'get',
        success: (data) => {
          if (data.state) {
            if (data.data) {
              if (data.data.checkInStatus === 'CHECK_IN' || data.data.checkInStatus === 'ACCOMMODATION') {
                this.isCanEdit.expectedCheckInTime = false
              }
              if (data.data.checkInStatus === 'RETIREMENT') {
                this.isCanEdit.expectedLeaveDormitoryTime = false
                this.isCanEdit.expectedCheckInTime = false
              }
              // console.log(data)
              
               this.accommodationInfo.defaultValue = {
                // ownDormitory:  data.data.campus + data.data.zone.name + data.data.building.name + (data.data.roomName || '') + (data.data.bed || ''),
                checkInSituation: this.checkInStatus[data.data.checkInStatus],
                expectedCheckInTime: data.data.expectCheckInTime || '',
                expectedLeaveDormitoryTime: data.data.expectRetirementTime || ''
              }
              if(data.data.campus && data.data.zone && data.data.building){
                 this.accommodationInfo.defaultValue.ownDormitory = data.data.campus + data.data.zone.name + data.data.building.name + (data.data.roomName || '') + (data.data.bed || '')
              }
              this.accommodationInfo.historyRecord = data.data.apartmentUserList
              console.log(data.data.apartmentUserList)
              if (data.data.apartmentUserHabits) {
                this.livingHabit.defaultValue = {
                  schedule: data.data.apartmentUserHabits.timeTable,
                  hobby: data.data.apartmentUserHabits.hobbiesAndInterests,
                  airConditioningTemperature: data.data.apartmentUserHabits.airConditioningTemperature,
                  other: data.data.apartmentUserHabits.remark,
                  remark: data.data.apartmentUserHabits.managerRemark
                }
                this.recordBeforeEditData.userHabitsRemark = data.data.apartmentUserHabits.managerRemark
              }
              this.recordBeforeEditData.expectCheckInTime = data.data.expectCheckInTime
              this.recordBeforeEditData.expectRetirementTime = data.data.expectRetirementTime
            }
          } else {
            this.$toast(data.message)
          }
        }
      })
      sAjax({
        url: '/api/apartment/payment/PaymentList/' + this.data.data.userId,
        dataType: 'json',
        type: 'get',
        success: (data) => {
          if (data.state) {
            this.paymentRecord.historyRecord = data.data || []
          } else {
            this.$toast(data.message)
          }
        }
      })
      this._getViolationData()
      sAjax({
        url: '/api/apartment/dicts',
        dataType: 'json',
        type: 'get',
        data: {
          typeName: '违规类型'
        },
        success: (data) => {
          if (data.state) {
            this.violationRecord.addViolationData.violationTypeData = data.data || []
          } else {
            this.$toast(data.message)
          }
        }
      })
    },
    watch: {
      windowObj: {
        deep:true,
        handler: function () {
          var pageContentHeight = $("#staff-info").height()
          this.scrollHeight = pageContentHeight - $(".header").height() - 19
        }
      }
    },
    mounted: function () {
      var pageContentHeight = $("#staff-info").height()
      this.scrollHeight = pageContentHeight - $(".header").height() - 19
    },
    methods: {
      _getTimeTextShow: function (time) {
        if (time) {
          return /\d{4}-\d{1,2}-\d{1,2}/g.exec(time)[0]
        } else {
          return ''
        }
      },
      _getViolationData: function () {
        sAjax({
          url: '/api/apartment/users/disciplinary/' + this.data.data.userId,
          type: 'get',
          success: (data) => {
            if (data.state) {
              if (data.data) {
                this.violationRecord.historyRecord = data.data
              }
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      _saveInfo: function () {
        var expectCheckInTime = ''
        var expectRetirementTime = ''
        if (this.accommodationInfo.defaultValue.expectedCheckInTime) {
          expectCheckInTime = /\d{4}-\d{1,2}-\d{1,2}/g.exec(this.accommodationInfo.defaultValue.expectedCheckInTime)[0]
        }
        if (this.accommodationInfo.defaultValue.expectedLeaveDormitoryTime) {
          expectRetirementTime = /\d{4}-\d{1,2}-\d{1,2}/g.exec(this.accommodationInfo.defaultValue.expectedLeaveDormitoryTime)[0] 
        }
        sAjax({
          url: '/api/apartment/users/info/' + this.data.data.userId,
          type: 'post',
          data: {
            baseInfo: {
              phone: this.basicInfo.defaultValue.phone,
              mail: this.basicInfo.defaultValue.email,
              remark: this.basicInfo.defaultValue.remark,
            },
            userHabits: {
              managerRemark: this.livingHabit.defaultValue.remark
            },
            apartmentUser: {
              userId: this.data.data.userId,
              expectCheckInTime: expectCheckInTime,
              expectRetirementTime: expectRetirementTime
            }
          },
          success: (data) => {
            if (data.state) {
              this.isEdit = false
              this.$toast('修改成功')
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      _cancelEdit: function () {
        this.isEdit = false
        this.basicInfo.defaultValue.phone = this.recordBeforeEditData.phone
        this.basicInfo.defaultValue.email = this.recordBeforeEditData.email
        this.basicInfo.defaultValue.remark = this.recordBeforeEditData.baseInfoRemark
        this.livingHabit.defaultValue.remark = this.recordBeforeEditData.userHabitsRemark
        this.accommodationInfo.defaultValue.expectedCheckInTime = this.recordBeforeEditData.expectCheckInTime
        this.accommodationInfo.defaultValue.expectedLeaveDormitoryTime = this.recordBeforeEditData.expectRetirementTime
      },
      _dateSelected: function (obj, cell) {
        var deltaTime = new Date(this.accommodationInfo.defaultValue.expectedCheckInTime).getTime() - new Date(this.accommodationInfo.defaultValue.expectedLeaveDormitoryTime).getTime()
        if (deltaTime > 0) {
          if (cell === 'expectedCheckInTime') {
            this.$toast('预计入住时间要在预计退宿时间之前')
            this.$nextTick(() => {
              this.accommodationInfo.defaultValue.expectedCheckInTime = ''
            })
          } else {
            this.$toast('预计退宿时间要在预计入住时间之后')
            this.$nextTick(() => {
              this.accommodationInfo.defaultValue.expectedLeaveDormitoryTime = ''
            })
          }
        }
      },
      addViolationRecord: function () {
        if (!this.violationRecord.addViolationData.violationTypeDefaultValue) {
          this.$toast('请选择违规类型')
          return
        }
        sAjax({
          url: '/api/apartment/users/disciplinary',
          type: 'post',
          data: {
            userId: this.data.data.userId,
            type: this.violationRecord.addViolationData.violationTypeDefaultValue,
            remark: this.violationRecord.addViolationData.remark
          },
          success: (data) => {
            if (data.state) {
              this.$toast('新增成功')
              this._refreshTable()
              this._getViolationData()
              this.showAddModal = false
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      _valueSelected: function (obj) {
        this.violationRecord.addViolationData.violationTypeDefaultValue = obj.value
      },
      showAddRecordModa: function () {
        this.showAddModal = true
        this.violationRecord.addViolationData.violationTypeDefaultValue = ''
        this.violationRecord.addViolationData.remark = ''
      },
      _changeValue: function (type) {
        if (type === 'phone') {
          if (!/^1[3456789]\d{9}$/.test(this.basicInfo.defaultValue.phone)) {
            this.$toast('电话格式不正确')
            this.basicInfo.defaultValue.phone = ''
          }
        } else {
          var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
          if (!re.test(this.basicInfo.defaultValue.email)) {
            this.$toast('邮箱格式不正确')
            this.basicInfo.defaultValue.email = ''
          }
        }
      },
       _refreshTable: function () {
        this.timeStamp = createTime()
      }
    }
  }
</script>
<style lang="less">
#staff-info {
  height: 100%;
  background: #fff;
  padding: 0 22px;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
  position: relative;
  .header {
    height: 60px;
    padding-top: 13px;
    border-bottom: 1px solid #f0f0f0;
    .header-title {
      font-size: 18px;
      color: #333333;
      margin-top: 3px;
    }
    .edit-btn,
    .cancel-edit-btn {
      box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
      border-radius: 5px;
      font-size: 13px;
      padding: 7px 27px;
    }
    .edit-btn {
      background: #298df7;
      color: #ffffff;
    }
    .cancel-edit-btn {
      background: #e0e0e0;
      color: #333333;
    }
  }
  .content {
    margin-top: 5px;
    overflow-y: auto;
    overflow-x: hidden;
    .info-card {
      border-top: 1px solid #f0f0f0;
      &.clearStyle {
        border-top: 0 solid #f0f0f0;
      }
      .card-title {
        font-size: 16px;
        color: #298df7;
        margin: 10px 0;
      }
      .title-label,
      .textarea-label {
        width: 90px;
        text-align: right;
        margin-right: 8px;
      }
      .textarea-label {
        vertical-align: top;
      }
      .textarea-style {
        width: 89%;
        resize: none;
        padding: 5px;
        border: 1px solid #d9d9d9;
        border-radius: 3px;
        outline: none;
        background: #fff;
        &:disabled {
          cursor: not-allowed;
        }
      }
      .table-container {
        margin-bottom: 16px;
      }
      .add-btn {
        box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
        border-radius: 5px;
        font-size: 13px;
        padding: 7px 27px;
        background: #298df7;
        color: #ffffff;
      }
    }
  }
  .modal-textarea-style {
    width: 80%;
    resize: none;
    padding: 5px;
    border: 1px solid #d9d9d9;
    border-radius: 3px;
    outline: none;
    background: #fff;
  }
  .modal-label {
    margin-right: 8px;
  }
  .modal-textarea-label {
    text-align: right;
    vertical-align: top;
    width: 55px;
    margin-right: 8px;
  }
  .log {
    .log-toggle {
      position: absolute;
      right: 35px;
      top: 62px;
      z-index: 1;
      line-height: 26px;
      padding: 0;
      border: none;
      box-shadow: none;
      background: transparent;
      outline: none;
      transition: all 0.3s ease;
      &.open {
        right: 208px;
      }
    }
    .log-content {
      position: absolute;
      right: -200px;
      top: 58px;
      bottom: 0;
      width: 200px;
      height: auto;
      padding-top: 5px;
      background: #fff;
      transition: all 0.3s ease;
      box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.12), 0 8px 8px 0 rgba(0, 0, 0, 0.12);
      z-index: 1;
      display: none;
      overflow-x: hidden;
      overflow-y: auto;
      &.active {
        right: 0;
        display: block;
      }
      .log-item {
        padding: 10px 0;
        margin: 0 10px 10px;
        border-radius: 2px;
        border-bottom: 1px solid #f0f0f0;
        .log-time {
          font-size: 13px;
          color: rgba(0, 0, 0, 0.4);
        }
        .log-detail {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.58);
        }
        .log-records {
          p {
            margin: 0;
            font-size: 13px;
            color: rgba(0, 0, 0, 0.58);
          }
        }
      }
    }
  }
}
</style>
