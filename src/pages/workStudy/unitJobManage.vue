<template>
  <div id="unitJobManage" v-if="curRouter === 'unitJobList'">
    <div class="tab-div">
      <div>
        <div
          class="tab"
          :class="!jobUserManage ? 'active' : ''"
          title="单位岗位管理"
          @click="jobUserManage = false"
        >单位岗位管理</div>
        <div
          class="tab"
          :class="jobUserManage ? 'active' : ''"
          title="岗位人员管理"
          @click="jobPeopleManage"
        >岗位人员管理</div>
      </div>
      <v-select v-model="jobDeclareData.unitId" :options="unitData"  optionsLabel="name" optionsValue="id" @afterSelected="changeUnit"></v-select>
    </div>
    <div class="container-fluid row text-center" v-if="!jobUserManage">
      <v-table
        :url="jobDeclareData.unitId?`${manageUrl}${jobDeclareData.unitId}?timeStamp=${timeStamp}`:''"
        pagesize="10"
        idField="id"
        :order="true"
        :columns="columns"
        :search="false"
        :columnsControl="true"
        key="position">
        <div slot="btn-group" role="group">
          <!-- <div class="btn-group pull-left">
            <v-select v-model="jobDeclareData.unitId" :options="unitData"  optionsLabel="name" optionsValue="id" @afterSelected="changeUnit"></v-select>
          </div> -->
          <div class="btn-group pull-right">
            <button type="button" class="btn btn-bgColor-style clearBtnBorder" @click="_showJobDeclareModal">新增岗位</button>
            <!-- <button type="button" class="btn add clearBtnBorder" @click="jobPeopleManage">切换到岗位人员管理</button> -->
          </div>
        </div>
      </v-table>
    </div>
    <div class="container-fluid row" v-else>
      <v-table title="岗位人员列表"
        ref="jobPeople"
        :url="`/table-data/pwps/users/page?unitId=${this.jobDeclareData.unitId}&timeStamp=${timeStamp}`"
        pagesize="10"
        idField="id"
        :order="true"
        :columns="userColumns"
        key="member"
        :search="false">
        <div slot="btn-group" role="group">
          <div class="btn-group pull-right">
            <button type="button" class="btn btn-bgColor-style clearBtnBorder" @click="showAddModal = true">新增人员</button>
            <!-- <button type="button" class="btn btn-bgColor-style clearBtnBorder" @click="batchNewAddPeople">批量新增人员</button> -->
            <!-- <button type="button" class="btn add clearBtnBorder" @click="jobUserManage = false">切换到单位岗位视图</button> -->
            <button type="button" class="btn btn-bgColor-style clearBtnBorder" @click="exportJobMembers">导出</button>
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
        <button type="button" class="btn submit-btn clearBtnBorder" @click="newAddPeopel" style="width:380px;text-align:center">单条增加</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="batchNewAddPeople" style="width:380px;text-align:center;margin-top:20px;">批量导入</button>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="showAddModal = false">取消</button>
      </div>
    </v-modal>
     <v-modal :show="showAddPeopleModal" effect="fade" width="590">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
          新增人员
        </h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="form-group">
          <label class="input-label"><span>*</span>学年</label>
          <v-select class="btn-block search-select" :value="schoolYearDefault" :options="schoolYearData" optionsLabel="name" optionsValue="id" @afterSelected="addSchoolYearSelected" search close-on-select></v-select>
        </div>
        <!-- <div class="form-group">
          <label class="input-label"><span>*</span>所属单位 </label>
          <v-select class="btn-block search-select" :value="unitDefault" :options="unitData" optionsLabel="name" optionsValue="id" @afterSelected="unitSelected" search close-on-select></v-select>
        </div> -->
        <div class="form-group">
          <label class="input-label"><span>*</span>岗位</label>
          <v-select class="btn-block search-select" :value="jobDefault" :options="jobData" optionsLabel="positionName" optionsValue="id" @afterSelected="jobSelected" search close-on-select></v-select>
        </div>
        <div class="form-group">
          <label class="input-label"><span>*</span>学号</label>
          <input id="user-no" type="text"  class="form-control search-input modal-form-style"  @change="checkAddUser" v-model="people.userNo">
          <button type="button" style="margin-left: 8px" class="btn submit-btn " @click="checkAddUser">检测</button>
          <p class="error-message">{{people.errorMessage}}</p>
        </div>
        <div class="form-group">
          <label class="input-label" >姓名</label>
          <input type="text" class="form-control search-input modal-form-style" disabled="disabled" v-model="people.userName">
        </div>
        <div class="form-group">
          <label class="input-label" >联系方式</label>
          <input type="text" placeholder="请输入联系方式" class="form-control search-input modal-form-style" v-model="people.contact" @change="isPhoneNo">
        </div>
        <div class="form-group datepicker-group">
          <label class="input-label"><span>*</span>工作开始时间</label>
          <v-datepicker class="btn-block time-picker" v-model="people.jobStartTime" :clearButton="false" :showTime="false" @daySelected="editWorkStartTimeSelected"></v-datepicker>
        </div>
        <div class="form-group datepicker-group">
          <label class="input-label"><span>*</span>工作结束时间</label>
          <v-datepicker class="btn-block time-picker" v-model="people.planOnJobEndTime" :clearButton="false" :showTime="false" @daySelected="editworkEndTimeSelected"></v-datepicker>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="showAddPeopleModal = false">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder"  @click="sureAddPeople">确定</button>
      </div>
    </v-modal>
    <v-modal :show="showAddJobModal" width="900" >
      <div slot="modal-body" class="modal-body" style="height: 400px;padding: 0;">
        <jobDeclare1
          :type="declareJson.type"
          :data="declareJson.data"
          @back="_closeDeclare"
          @submit="sureAddJob"
          v-if="showAddJobModal"
        ></jobDeclare1>
      </div>
    </v-modal>
    <v-modal :show="showEditPeopleModal" effect="fade" width="500">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
          编辑人员
        </h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="form-group datepicker-group">
          <label class="input-label">工作开始时间</label>
          <v-datepicker class="btn-block time-picker" v-model="editPeople.jobStartTime" :clearButton="false" :showTime="false" @daySelected="editWorkStartTimeSelected"></v-datepicker>
        </div>
        <div class="form-group datepicker-group">
          <label class="input-label">工作结束时间</label>
          <v-datepicker class="btn-block time-picker" v-model="editPeople.planOnJobEndTime" :clearButton="false" :showTime="false" @daySelected="editworkEndTimeSelected"></v-datepicker>
        </div>
        <div class="form-group">
          <label class="input-label">在岗状态</label>
          <v-select class="btn-block search-select" :value="editPeople.onTheJobStatus" :options="jobStatusData" options-value="id" options-label="text" @afterSelected="jobStatusSelected" search close-on-select></v-select>
        </div>
        <div class="form-group">
          <label class="input-label textarea-label" >备注</label>
          <v-textarea :cols="20" :rows="30" class="modal-textarea" :autoHeight="true" :maxLength="600" v-model="editPeople.remark"></v-textarea>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="showEditPeopleModal = false">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder"  @click="sureEditPeople">确定</button>
      </div>
    </v-modal>
  </div>
  <v-import
    v-bind="importParams"
    @backParentPage="curRouter = 'unitJobList'"
    :downloadTemplateUrl="downloadUrl"
    :checkTemplateUrl="checkTemplateUrl"
    :isNeedModal="true" :modalname="'选择学年'"
     v-else-if="curRouter === 'importPage'">
    <div slot="modal">
      <div class="form-group">
        <label class="college-text">学年</label>
        <v-select class="btn-block search-select" :value="importModalSchoolYearDefault" :options="schoolYearData" optionsLabel="name" optionsValue="id" @afterSelected="importModalSchoolYearSelected" search close-on-select></v-select>
      </div>
    </div>
  </v-import>
  <jobApplyForm @back="_back" formType="unitJobView" :isApply="false" :formDetail="applicationFormDetail" v-else-if="curRouter === 'jobApplyForm'"></jobApplyForm>
  <jobDeclare  :jobFormInfo="jobFormInfo" :optParameter="optParameter" :newJobDeclareData="jobDeclareData" :jobParameter="jobParameter" @back="_backJobList" @cancelApplication="_cancelApplication" @resubimt="_resubimt" @revoke="_revoke" @sumbitJobDeclare="_sumbitJobDeclare"  v-else></jobDeclare>
</template>

<script>
  import Vue from 'vue'
  import { sAjax, translation, createTime } from '../../assets/utils/utils.js'
  import jobDeclare from './jobDeclare.vue'
  import jobDeclare1 from './jobDeclare1.vue'
  Vue.component('jobDeclare1', jobDeclare1)
  Vue.component('jobDeclare', jobDeclare)
  export default {
    created: function () {
      var la = localStorage.getItem('lang')
      var that = this
      if (translation(la)) {
        this.lang = la
      }
      this.isTodifficultStudentData = [{ id: 'true', text: '是' }, { id: 'false', text: '否' }]

      sAjax({
        url: '/login/check',
        type: 'get',
        success: (data) => {
          this.account = data.data
        }
      })
      sAjax({
        url: '/api/pwps/units/my',
        dataType: 'json',
        type: 'get',
        success: (data) => {
          if (data.state) {
            if (data.data.length > 0) {
              this.unitData = data.data
              this.jobDeclareData.unitId = data.data[0].id
              this.unitName = data.data[0].name
            }
          } else {
            this.$toast(data.message)
          }
        }
      })

      sAjax({
        url: '/api/pwps/positions/all/schoolYears',
        dataType: 'json',
        type: 'get',
        success: (data) => {
          if (data.state) {
            this.schoolYearData = data.data
          } else {
            this.$toast(data.message)
          }
        }
      })
      sAjax({
        url: '/api/system/dicts',
        dataType: 'json',
        type: 'get',
        data: {
          dictType: '岗位类型'
        },
        success: (data) => {
          if (data.state) {
            this.positionTypeData = data.data
          } else {
            this.$toast(data.message)
          }
        }
      })
      this.columns = [{
        id: 'schoolYear',
        title: '学年',
        className: 'text-left',
        hidden: false,
        width: 100,
        formatter: function (record) {
          if (record.schoolYear) {
            return record.schoolYear.name
          }
        },
        search: {
          type: 'select',
          data: {
            url: '/api/pwps/positions/all/schoolYears',
            optionsLabel: 'name',
            optionsValue: 'id'
          }
        }
      }, {
        id: 'unitId',
        title: '单位名称',
        className: 'text-left',
        hidden: false,
        width: 90,
        formatter: function (record) {
          if (record.unit) {
            return record.unit.name
          }
        },
        search: {
          type: 'select',
          data: {
            url: '/api/pwps/units/all',
            optionsLabel: 'name',
            optionsValue: 'id'
          }
        }
      }, {
        id: 'positionName',
        title: '岗位名称',
        className: 'text-left',
        width: 120,
        hidden: false,
        search: {
          type: 'input',
          data: {
            placeholer: '',
            autoFocus: true
          }
        }
      }, {
        id: 'positionType',
        title: '岗位类型',
        className: 'text-left',
        width: 90,
        hidden: false,
        formatter: (record) => {
          var label = ''
          this.positionTypeData.forEach((ele, index) => {
            if (ele.value === record.positionType) {
              label = ele.label
            }
          })
          return label
        },
        search: {
          type: 'select',
          data: {
            url: '/api/system/dicts?dictType=岗位类型',
            optionsLabel: 'label',
            optionsValue: 'value'
          }
        }
      }, {
        id: 'personCount',
        title: '岗位人数',
        className: 'text-left',
        width: 60,
        hidden: false
      }, {
        id: 'userIncumbencyCount',
        title: '在岗人数',
        width: 60,
        className: 'text-left',
        hidden: false
      }, {
        id: 'rewardStandard',
        title: '薪酬标准',
        className: 'text-left',
        width: 60,
        hidden: false
      }, {
        id: 'salaryCapMonth',
        title: '月工资上限',
        className: 'text-left',
        width: 110,
        hidden: false
      }, {
        id: 'auditingStatus',
        title: '审核状态',
        className: 'text-left',
        width: 90,
        hidden: false,
        formatter: (record) => {
          if (record.auditingStatus) {
            return this.auditingStatus[record.auditingStatus]
          }
        },
      }, {
        id: 'isToDifficultyStudent',
        title: '针对困难生',
        className: 'text-left',
        width: 110,
        hidden: true,
        formatter: function (record) {
          return record.isToDifficultyStudent ? '是' : '否'
        },
        search: {
          type: 'select',
          data: {
            options: this.isTodifficultStudentData,
            optionsLabel: 'text',
            optionsValue: 'id'
          }
        }
      }, {
        id: 'canApply',
        title: '允许学生申请',
        className: 'text-left',
        width: 130,
        hidden: true,
        formatter: function (record) {
          return record.canApply ? '是' : '否'
        },
        search: {
          type: 'select',
          data: {
            options: this.isTodifficultStudentData,
            optionsLabel: 'text',
            optionsValue: 'id'
          }
        }
      }, {
        id: 'address',
        title: '工作地点',
        className: 'text-left',
        width: 90,
        hidden: true,
        search: {
          type: 'input',
          data: {
            placeholer: '',
            autoFocus: true
          }
        }
      }, {
        id: 'workingTime',
        title: '工作时段',
        className: 'text-left',
        width: 120,
        hidden: true,
        search: {
          type: 'input',
          data: {
            placeholer: '',
            autoFocus: true
          }
        }
      }, {
        id: 'jobStartTime',
        title: '工作开始时间',
        className: 'text-left',
        width: 150,
        hidden: true,
        formatter: function (record) {
          return record.jobStartTime.split(' 00:00:00')[0]
        }
      }, {
        id: 'jobEndTime',
        title: '工作结束时间',
        className: 'text-left',
        width: 150,
        hidden: true,
        formatter: function (record) {
          return record.jobEndTime.split(' 00:00:00')[0]
        }
      }, {
        id: 'applyStartTime',
        title: '申请开始时间',
        className: 'text-left',
        width: 150,
        hidden: true,
        formatter: function (record) {
          return record.applyStartTime.split(' 00:00:00')[0]
        }
      }, {
        id: 'applyEndTime',
        title: '申请结束时间',
        className: 'text-left',
        width: 150,
        hidden: true,
        formatter: function (record) {
          return record.applyEndTime.split(' 00:00:00')[0]
        }
      }, {
        id: 'publishStatus',
        title: '发布状态',
        className: 'text-left',
        width: 150,
        hidden: false,
        search: {
          type: 'select',
          data: {
            options: [
              {label: '已发布', value: '已发布'},
              {label: '未发布', value: '未发布'},
              {label: '已过期', value: '已过期'},
            ],
            optionsLabel: 'label',
            optionsValue: 'value'
          }
        },
      },{
        id: 'opt',
        className: 'text-left',
        title: '操作',
        width: 100,
        hidden: false,
        formatter: (record) => {
          let opt = [{
            tag: 'a',
            text: '查看',
            className: 'opt-btn',
            callback: (record, index) => {
              this.positionId = record.id
              this.optParameter = {
                isCheck: false,
                optsType: 'view',
                canCancel: record.canCancel,
                canResubmit: record.canResubmit,
                canRevoke: record.canRevoke,
                isShowLog: true
              }
              this.jobParameter = {
                positionId: record.id,
                isView: record.canResubmit ? false : true,
                unitName: this.unitName
              }
              this.jobDeclareData = {
                unitId: record.unit.id,
                managerId: (record.manager&&record.manager.userId) || '',
                userNo: (record.manager&&record.manager.userNo) || '',
                userName: (record.manager&&record.manager.name) || '',
                positionType: record.positionType,
                positionName: record.positionName,
                address: record.address,
                rewardStandard: record.rewardStandard, //报酬标准
                jobStartTime: record.jobStartTime,
                jobEndTime: record.jobEndTime,
                applyStartTime: record.applyStartTime,
                applyEndTime: record.applyEndTime,
                schoolYearId: record.schoolYear.id,
                contact: record.contact,
                personCount: record.personCount, //岗位人数
                workingTime: record.workingTime, //工作时段
                salaryCapMonth: record.salaryCapMonth, //月工资上限
                totalWork: record.totalWork, 
                isToDifficultyStudent: record.isToDifficultyStudent, //只针对困难生
                canApply: record.canApply, //允许学生请求
                description: record.description,
                positionRequire: record.positionRequire,
                remark: record.remark,
                campus: record.campus
              }
              // this.positionTypeData.forEach((ele, index) => {
              //   if (ele.label === record.positionType) {
              //     this.jobDeclareData.positionType = ele.id
              //   }
              // })
              this.curRouter = 'jobDeclarePage'
            }
          }]
          if(!!record.publishAuthority&&record.auditingStatus=='PASS'&&record.publishStatus=="未发布") {
            opt.push({
              tag: 'a',
              text: '发布',
              className: 'opt-btn',
              callback: (record, index) => {
                this.showAddJobModal = true
                this.declareJson = {
                  type: 'unitPublish',
                  data: {
                    id: record.id,
                    applyEndTime: record.applyEndTime,
                    applyStartTime: record.applyStartTime,
                  }
                }
              }
            })
          }
          return opt;
        }
      }]
      sAjax({
        url: '/api/colleges',
        type: 'GET',
        success: (data) => {
          if (data.state) {
            this.colleges = data.data
          } else {
            this.$toast(data.message)
          }
        }
      })
      this.userColumns = [{
        id: 'userName',
        title: '姓名',
        width: 60,
        className: 'text-left',
        hidden: false,
        search: {
          type: 'input',
          data: {
            placeholer: '',
            autoFocus: true
          }
        }
      }, {
        id: 'userNo',
        title: '学号',
        width: 120,
        className: 'text-left',
        hidden: false,
        search: {
          type: 'input',
          data: {
            placeholer: '',
            autoFocus: true
          }
        }
      }, {
        id: 'collegeCode',
        title: '学院',
        className: 'text-left',
        hidden: false,
        width: 100,
        search: {
          type: 'select',
          data: {
            url: `/api/colleges`,
            optionsLabel: 'name',
            optionsValue: 'code'
          }
        },
        formatter: function (record) {
          return record.college
        }
      }, {
        id: 'userGrade',
        title: '年级',
        width: 50,
        className: 'text-left',
        hidden: false,
        search: {
          type: 'input',
          data: {
            placeholer: '',
            autoFocus: true
          }
        }
      }, {
        id: 'educationLevel',
        title: '培养层次',
        width: 80,
        className: 'text-left',
        hidden: false,
        search: {
          type: 'select',
          data: {
            url: '/api/system/dicts?dictType=培养层次',
            optionsLabel: 'label',
            optionsValue: 'value'
          }
        },
        formatter: (record)=>{
          return record.educationLevelName
        }
      }, {
        id: 'idCardNo',
        title: '身份证号',
        className: 'text-left',
        hidden: false,
        width: 130,
        search: {
          type: 'input',
          data: {
            placeholer: '',
            autoFocus: true
          }
        }
      }, {
        id: 'contact',
        title: '联系方式',
        className: 'text-left',
        hidden: false,
        width: 90,
        search: {
          type: 'input',
          data: {
            placeholer: '',
            autoFocus: true
          }
        }
      }, {
        id: 'positionName',
        title: '岗位名称',
        className: 'text-left',
        width: 90,
        hidden: false,
        search: {
          type: 'input',
          data: {
            placeholer: '',
            autoFocus: true
          }
        }
      }, {
        id: 'schoolYear',
        title: '学年',
        className: 'text-left',
        hidden: false,
        width: 100,
        search: {
          type: 'select',
          data: {
            url: '/api/pwps/positions/all/schoolYears',
            optionsLabel: 'name',
            optionsValue: 'id'
          }
        }
      }, {
        id: 'onTheJobStatus',
        title: '在岗状态',
        className: 'text-left',
        width: 80,
        hidden: false,
        search: {
          type: 'select',
          data: {
            options: [{
              id: 'RETREAT_FROM_A_PORT',
              name: '退岗'
            },{
              id: 'ON_JOB',
              name: '在岗'
            }],
            optionsLabel: 'name',
            optionsValue: 'id'
          }
        },
        formatter: (record) => {
          return record.onTheJobStatus === 'ON_JOB' ? '在岗' : '退岗'
        }
      }, {
        id: 'opt',
        className: 'text-left',
        title: '操作',
        width: 150,
        hidden: false,
        formatter: () => {
          return [{
            tag: 'a',
            text: '编辑',
            className: 'opt-btn',
            callback: (record, index) => {
              this.showEditPeopleModal = true
              this.editPeople = {
                id: record.id,
                jobStartTime: record.jobStartTime,
                planOnJobEndTime: record.planOnJobEndTime,
                onTheJobStatus: record.onTheJobStatus,
                remark: record.remark
              }
              // this.editPeople = {
              //   id: record.id,
              //   jobStartTime: record.applicationFormVO && record.applicationFormVO.workStartTime && record.applicationFormVO.workStartTime.split(' 00:00:00')[0],
              //   planOnJobEndTime: record.applicationFormVO && record.applicationFormVO.workEndTime && record.applicationFormVO.workEndTime.split(' 00:00:00')[0],
              //   onTheJobStatus: record.onTheJobStatus,
              //   remark: record.applicationFormVO && record.applicationFormVO.remark
              // }
            }
          }, {
            tag: 'a',
            text: '查看申请单',
            className: 'opt-btn',
            callback: (record, index) => {
              this.curRouter = 'jobApplyForm'
              this.applicationFormDetail = {
                createTime: record.position && record.position.createTime,
                contact: record.contact,
                form: record.applicationFormVO,
                formId: record.id,
                isShowLog: true,
                opts: {
                  canCancel: false,
                  canResubmit: false,
                  canRevoke: false
                }
              }
            }
          }]
        }
      }]
    },
    data: function () {
      return {
        showAddJobModal: false,
        showAddModal: false,
        unitData: [],
        columns: [],
        userColumns: [],
        manageUrl: '/table-data/pwps/positions/page/positions/',
        jobUserManage: false,
        isTodifficultStudentData: [],
        jobDeclareData: {
          unitId: '',
          managerId: '',
          userNo: '',
          userName: '',
          positionType: '',
          positionName: '',
          address: '',
          rewardStandard: '', //报酬标准
          jobStartTime: '',
          jobEndTime: '',
          applyStartTime: '',
          applyEndTime: '',
          schoolYearId: '',
          contact: '',
          personCount: '', //岗位人数
          workingTime: '', //工作时段
          salaryCapMonth: '', //月工资上限
          isToDifficultyStudent: '', //只针对困难生
          canApply: '', //允许学生请求
          description: '',
          positionRequire: '',
          remark: '',
          campus: ''
        },
        unitName: '', //所属部门
        modalType: '',
        isView: false,
        positionTypeData: [],
        schoolYearData: [],
        colleges: [],
        showAddPeopleModal: false,
        people: {
          userId: '',
          userNo: '',
          userName: '',
          errorMessage: '',
          jobStartTime: '',
          planOnJobEndTime: '',
          contact: '',
        },
        importPage: false,
        importParams: {
          parentPageTitle: '岗位人员列表',
          downloadErrorTemplateUrl: '/pwps/users/excels/errorExcels',
          templateName: '岗位人员导入',
          importBtnType: null
        },
        schoolYearDefault: '',
        unitDefault: '',
        jobDefault: '',
        jobData: [],
        importModalSchoolYearDefault: '',
        auditingStatus: {
          WAIT_AUDITING: '待审核',
          PASS: '通过',
          S_FAILED_TO_PASS: '不通过',
          X_CANCELED: '取消',
          TO_RESUBMIT: '等待重新提交'
        },
        auditingStatusString: '',
        account: [],
        positionId: '',
        lang: 'zh-cn',
        showEditPeopleModal: false,
        editPeople: {
          id: '',
          jobStartTime: '',
          planOnJobEndTime: '',
          onTheJobStatus: '',
          remark: ''
        },
        jobStatusData: [{
          id: 'ON_JOB',
          text: '在岗'
        }, {
          id: 'RETREAT_FROM_A_PORT',
          text: '退岗'
        }],
        applicationFormDetail: {},
        curRouter: 'unitJobList',
        timeStamp: '',
        userTimeStamp: '',
        newJobDeclareData: {},
        jobFormInfo: {
          unitId: '',
          managerId: '',
          userNo: '',
          userName: ''
        },
        optParameter: {
          isCheck: false,
          optsType: '',
          canCancel: false,
          canResubmit: false,
          canRevoke: false,
          isShowLog: false
        },
        jobParameter: {
          positionId: '',
          isView: false,
          unitName: ''
        },
        declareJson: {},
      }
    },
    computed: {
      translate: function () {
        return translation(this.lang).schoolRoleManage
      },
      downloadUrl: function () {
        return '/pwps/users/excels/templates?schoolYear=' + this.importModalSchoolYearDefault + '&unitId=' + this.jobDeclareData.unitId
      },
      checkTemplateUrl: function () {
        return '/pwps/users/excels/check?schoolYear=' + this.importModalSchoolYearDefault + '&unitId=' + this.jobDeclareData.unitId
      }
    },
    methods: {
      _closeDeclare: function () {
        this.showAddJobModal = false
        this.declareJson = {
          type: '',
          data: null
        }
      },
      sureAddJob: function (formData) {
        sAjax({
          url: `/api/pwps/positions/publish/${formData.id}`,
          type: 'post',
          data: formData,
          success: (data) => {
            if (data.state) {
              this.declareJson = {
                type: '',
                data: null
              }
              this.timeStamp = createTime()
              this.showAddJobModal = false
              this.$toast('岗位发布成功')
            } else {
              if (data.code === '30805') {
                this.$toast('该单位已被禁用，无法进行岗位申报')
              } else {
                this.$toast(data.message)
              }
            }
          }
        })
      },
      _backJobList: function () {
        this.curRouter = 'unitJobList'
      },
      _back: function () {
        this.curRouter = 'unitJobList'
      },
      isPhoneNo: function () {
        var pattern = /^1[3456789]\d{9}$/
        if (!pattern.test(this.people.contact)) {
          this.$toast('联系方式格式不对')
          this.people.contact = ''
          return
        }
      },
      jobPeopleManage: function () {
        this.jobUserManage = true
      },
      changeUnit: function (data) {
        this.unitData.forEach((ele, index) => {
          if (ele.id === data.value) {
            this.unitName = ele.name
          }
        })
        this.jobDeclareData.unitId = data.value
      },
      _sumbitJobDeclare: function (data) {
        sAjax({
          url: '/api/pwps/positions',
          type: 'post',
          data: data,
          success: (data) => {
            if (data.state) {
              this.curRouter = 'unitJobList'
              this._refreshTable(this)
            } else {
              if (data.code === '30805') {
                this.$toast('该单位已被禁用，无法进行新增岗位')
              } else {
                this.$toast(data.message)
              }
            }
          }
        })
      },
      _showJobDeclareModal: function () {
        this.curRouter = 'jobDeclarePage'
        this.jobFormInfo = {
          unitId: this.jobDeclareData.unitId,
          managerId: this.account.id,
          userNo: this.account.userNo,
          userName: this.account.name
        }
        this.optParameter = {
          isCheck: false,
          optsType: 'declare',
          canCancel: false,
          canResubmit: false,
          canRevoke: false,
          isShowLog: false
        }
        this.jobParameter = {
          positionId: '',
          isView: false,
          unitName: this.unitName
        }
      },
      addSchoolYearSelected: function (obj) {
        this.schoolYearDefault = obj.value
        sAjax({
          url: '/api/pwps/positions/options?schoolYear=' + this.schoolYearDefault + '&unitId=' + this.jobDeclareData.unitId,
          type: 'GET',
          success: (data) => {
            if (data.state) {
              this.jobData = data.data
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      importModalSchoolYearSelected: function (obj) {
        this.importModalSchoolYearDefault = obj.value
      },
      newAddPeopel: function () {
        this.showAddModal = false
        this.showAddPeopleModal = true
        this.schoolYearDefault = '',
          this.jobDefault = '',
          this.people = {
            userId: '',
            userNo: '',
            userName: '',
            errorMessage: ''
          }
      },
      jobSelected: function (obj) {
        this.jobDefault = obj.value
      },
      batchNewAddPeople: function () {
        this.showAddModal = false
        this.curRouter = 'importPage'
        this.importParams.importBtnType = [{
          url: '/pwps/users/batch',
          method: 'post',
          isShowBtn: true,
          name: '增量导入',
          success: (data) => {
            if (data.state) {
              this.timeStamp = new Date()
            }
          }
        }]
      },
      checkAddUser: function () {
        sAjax({
          url: '/api/users/' + this.people.userNo,
          type: 'GET',
          success: (data) => {
            if (data.state) {
              this.people.userId = data.data.userId
              this.people.userName = data.data.name
              this.people.errorMessage = ''
            } else {
              this.people.errorMessage = '用户不存在'
              this.people.userId = ''
              this.people.userName = ''
            }
          }
        })
      },
      sureAddPeople: function () {
        if (!this.schoolYearDefault) {
          this.$toast('请先选择学年')
          return
        }
        if (!this.jobDefault) {
          this.$toast('请先选择岗位')
          return
        }
        if (!this.people.userId) {
          this.$toast('请先检测用户')
          return
        }
        if (!this.people.jobStartTime) {
          this.$toast('工作开始时间不能为空')
          return
        }
        if (!this.people.planOnJobEndTime) {
          this.$toast('工作结束时间不能为空')
          return
        }
        sAjax({
          url: '/api/pwps/users',
          type: 'post',
          data: {
            userId: this.people.userId,
            positionId: this.jobDefault,
            jobStartTime: this.people.jobStartTime,
            planOnJobEndTime: this.people.planOnJobEndTime,
            contact: this.people.contact,
          },
          success: (data) => {
            if (data.state) {
              this.timeStamp = new Date()
              this.showAddPeopleModal = false
              this.$toast('新增成功')
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      editWorkStartTimeSelected: function (data) {
        let type = this.showAddPeopleModal ? "people": "editPeople"
        if (this[type].planOnJobEndTime) {
          var timeString = new Date(data.value).getTime() - new Date(this[type].planOnJobEndTime).getTime()
          if (timeString > 0) {
            this.$nextTick(() => {
              this.$toast('工作开始时间要在工作结束时间之前')
              this[type].jobStartTime = ''
            })
            return false
          } else {
            this[type].jobStartTime = data.value
          }
        } else {
          this[type].jobStartTime = data.value
        }
      },
      editworkEndTimeSelected: function (data) {
        let type = this.showAddPeopleModal ? "people": "editPeople"
        if (this[type].jobStartTime) {
          var timeString = new Date(data.value).getTime() - new Date(this[type].jobStartTime).getTime()
          if (timeString < 0) {
            this.$nextTick(() => {
              this.$toast('工作结束时间要在工作开始时间之后')
              this[type].planOnJobEndTime = ''
            })
            return false
          } else {
            this[type].planOnJobEndTime = data.value
          }
        } else {
          this[type].planOnJobEndTime = data.value
        }
      },
      jobStatusSelected: function (obj) {
        this.editPeople.onTheJobStatus = obj.value
      },
      sureEditPeople: function () {
        if (!this.editPeople.jobStartTime) {
          this.$toast('工作开始时间不能为空')
          return
        }
        if (!this.editPeople.planOnJobEndTime) {
          this.$toast('工作结束时间不能为空')
          return
        }
        if (!this.editPeople.onTheJobStatus) {
          this.$toast('在岗状态不能为空')
          return
        }
        if (this.editPeople.jobStartTime.length === 10) {
          this.editPeople.jobStartTime = this.editPeople.jobStartTime + ' 00:00:00'
        }
        if (this.editPeople.planOnJobEndTime.length === 10) {
          this.editPeople.planOnJobEndTime = this.editPeople.planOnJobEndTime + ' 00:00:00'
        }
        sAjax({
          url: '/api/pwps/users/edit',
          type: 'post',
          data: this.editPeople,
          success: (data) => {
            if (data.state) {
              this.timeStamp = new Date()
              this.$toast('操作成功')
              this.showEditPeopleModal = false
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      _revoke: function () {
        if (window.confirm('确定撤回吗？')) {
          sAjax({
            url: '/api/pwps/workflow/runtime/position/' + this.positionId + '/revoke',
            type: 'post',
            success: (data) => {
              if (data.state) {
                this._refreshTable(this)
                this.$toast('撤回成功')
                this.curRouter = 'unitJobList'
              } else {
                this.$toast(data.message)
              }
            }
          })
        }
      },
      _resubimt: function () {
        var newData = JSON.parse(JSON.stringify(this.jobDeclareData))
        if (window.confirm('确定重新提交吗？')) {
          sAjax({
            url: '/api/pwps/workflow/runtime/position/' + this.positionId + '/resubmit',
            type: 'post',
            data: newData,
            success: (data) => {
              if (data.state) {
                this._refreshTable(this)
                this.$toast('重新提交成功')
                this.curRouter = 'unitJobList'
              } else {
                this.$toast(data.message)
              }
            }
          })
        }
      },
      _cancelApplication: function () {
        if (window.confirm('确定取消申请吗？')) {
          sAjax({
            url: '/api/pwps/workflow/runtime/position/' + this.positionId + '/canceled',
            type: 'post',
            success: (data) => {
              if (data.state) {
                this._refreshTable(this)
                this.$toast('取消成功')
                this.curRouter = 'unitJobList'
              } else {
                this.$toast(data.message)
              }
            }
          })
        }
      },
      _refreshTable: function (obj) {
        obj.timeStamp = createTime()
      },
      exportJobMembers: function () {
        var str = `unitId=${this.jobDeclareData.unitId}&`
        var searchJson = this.$refs.jobPeople.tableSearchFields
        for (var i in searchJson) {
          str += `${i}=${searchJson[i]}&`
        }
        str += `timeStamp=${createTime()}`
        location.href = `/downloads/pwps/users/excel?${str}`
      },
    }
  }
</script>
<style lang="less">
@import url("../../assets/common.less");
#unitJobManage {
  background: #fff;
  .back-parent-page {
    margin-bottom: 10px;
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
  .tab-div {
    position: relative;
    height: 50px;
    padding-top: 10px;
    padding-right: 15px;
    background: white;
    white-space: nowrap;
    border-bottom: 1px solid #f0f0f0;
    display:flex;
    justify-content: space-between;
    .v-select {
      width: 160px;
    }
    .apply-container {
      position: absolute;
      right: 0;
    }
    .tab-list {
      position: relative;
      .gm-scroll-view {
        padding-right: 200px;
      }
    }
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
      border-bottom: 2px solid transparent;
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
      margin-right: -4px;
    }
  }
  .check-btn {
    background: #298df7 !important;
  }
  
  .modal-content {
    top: auto;
  }
  .log-toggle {
    position: absolute;
    right: 8px;
    top: 10px;
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
    top: 0;
    bottom: 0;
    width: 200px;
    height: auto;
    // height: 100%;
    // overflow: auto;
    padding-top: 5px;
    background: #fff;
    transition: all 0.3s ease;
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.12), 0 8px 8px 0 rgba(0, 0, 0, 0.12);
    z-index: 1;

    &.active {
      right: 5px;
    }
  }
}
#unitJobManage .modal-body {
    .form-group {
      display: flex;
      align-items: center;
    }
    .search-select {
      width: 220px;
      margin: 0 0 0 18px;
    }
    .star {
      color: red;
    }
    .datepicker-group .btn-block {
      width: auto;
    }
    .datepicker-group .form-control[readonly] {
      background: #ffffff;
    }
    .input-label {
      width: 120px;
      text-align: right;
    }
    .input-label span {
      color: red;
      font-size: 20px;
      vertical-align: middle;
    }
    .v-textarea {
      height: 100px;
      border-radius: 5px;
      padding: 8px;
      padding-bottom: 22px;
      width: 100%;
      textarea {
        height: 78px !important;
      }
    }
    .time-picker {
      width: 220px !important;
      margin-left: 18px;
      display: inline-block;
      .form-control.v-datepicker-input {
        border-radius: 0;
        border-top: 0 solid #ffffff;
        border-left: 0 solid #ffffff;
        border-right: 0 solid #ffffff;
        border-bottom: 2px solid #e0e0e0;
        box-shadow: inset 0 0px 0px rgba(0, 0, 0, 0.075);
        padding: 0;
        width: 220px !important;
      }
    }
    .one-words-difference-margin {
      margin-left: 13px;
    }
    .two-words-difference-margin {
      margin-left: 28px;
    }
    .three-words-difference-margin {
      margin-left: 41px;
    }
    .four-words-difference-margin {
      margin-left: 55px;
    }
    .other-words-difference-margin {
      margin-left: 83px;
    }
    .unit-name-label {
      margin-left: 17px;
    }
    .textarea-label {
      vertical-align: top;
    }
    .modal-textarea {
      width: 77%;
      resize: none;
      margin-left: 28px;
      padding: 5px;
      border: 2px solid #e0e0e0;
      outline: none;
      &:disabled {
        cursor: not-allowed;
      }
    }
    .marginTop25px {
      margin-top: 25px;
    }
    .radio-group {
      width: 90%;
      margin-bottom: 18px;
      .radio-area {
        display: inline-block;
        div {
          display: inline-block;
          margin-left: 22px;
        }
      }
    }
  }
</style>
