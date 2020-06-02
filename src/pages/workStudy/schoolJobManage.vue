<template>
  <div id="schoolJobManage" class="container-fluid" v-if="curRouter === 'schoolJobList'&&!showAddJobModal">
    <div class="tab-div">
      <div class="tab" :class="curPage == 'schoolJobList' ? 'active' : ''" title="全校岗位管理" @click="curPage = 'schoolJobList'">全校岗位管理</div>
      <div class="tab" :class="curPage == 'jobPeopleManage' ? 'active' : ''" title="岗位人员管理" @click="curPage = 'jobPeopleManage'">岗位人员管理</div>
    </div>
    <div class="row text-center" v-if="curPage === 'schoolJobList'">
      <v-table key="schoolJob" :url="`${url}?timeStamp=${timeStamp}`" pagesize="10" idField="id" :order="true" :multiple="false" :search="false" :columnsControl="true" :columns="columns" v-show="!declareJson.type">
        <div slot="btn-group" role="group">
          <div class="btn-group pull-right">
            <button type="button" class="btn btn-bgColor-style table-btn clearBtnBorder" @click="newAddJob">新增岗位</button>
            <button type="button" class="btn btn-bgColor-style table-btn clearBtnBorder" @click="batchNewAddJob">批量新增岗位</button>
            <!-- <button
              type="button"
              class="btn btn-bgColor-style table-btn clearBtnBorder"
              @click="curPage = 'salaryGrantManage'"
            >切换到薪酬发放管理</button>
            <button
              type="button"
              class="btn btn-bgColor-style table-btn clearBtnBorder"
              @click="curPage = 'jobPeopleManage'"
            >切换到岗位人员管理</button> -->
          </div>
        </div>
      </v-table>
    </div>
    <div class="row" v-else-if="curPage === 'jobPeopleManage'">
      <v-table ref="jobPeople" key="jobPeople" title="岗位人员管理" :url="jobPeoPleUrl" pagesize="10" idField="id" :order="true" :multiple="false" :search="false" :columnsControl="true" :columns="jobPeopleColumns">
        <div slot="btn-group" role="group">
          <div class="btn-group pull-right">
            <button type="button" class="btn btn-bgColor-style table-btn clearBtnBorder" @click="newAddPeopel">新增人员</button>
            <button type="button" class="btn btn-bgColor-style table-btn clearBtnBorder" @click="batchNewAddPeople">批量新增人员</button>

            <!-- <button
              type="button"
              class="btn btn-bgColor-style table-btn clearBtnBorder"
              @click="curPage = 'schoolJobList'"
            >切换到全校岗位管理</button> -->
            <button type="button" class="btn btn-bgColor-style table-btn clearBtnBorder" @click="exportJobMembers">导出</button>
          </div>
        </div>
      </v-table>
    </div>
    <div class="row" v-else>
      <v-table key="salary" title="薪酬发放管理" ref="gruntTable" :url="salaryGrantManageUrl" pagesize="10" idField="id" :order="true" :multiple="false" :search="false" :columnsControl="isJobView?false:true" :columns="salaryGrantManageColumns">
        <div slot="btn-group" role="group">
          <div class="btn-group pull-right">
            <button type="button" class="btn btn-bgColor-style table-btn clearBtnBorder" v-if="!isJobView" @click="showSalaryExport">导出</button>
            <button type="button" class="btn btn-bgColor-style table-btn clearBtnBorder" v-if="!isJobView" @click="importGrantResult">发放结果导入</button>
            <button type="button" class="btn btn-bgColor-style table-btn clearBtnBorder" @click="changeView">切换到{{viewText}}</button>
            <button type="button" class="btn btn-bgColor-style table-btn clearBtnBorder" @click="curPage = 'schoolJobList'">切换到全校岗位管理</button>
          </div>
        </div>
      </v-table>
    </div>

    <v-modal :show="salaryPeopleExport.show" effect="fade" width="400" key="xxx">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">导出——字段选择</h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <ul class="list-group">
          <li :key="index" class="list-group-item field-item" v-for="(field, index) in salaryPeopleExport.fields" :class="field.selected ? 'active' : ''" @click="field.selected = !field.selected">
            <i class="maticon" v-html="icons('check_box_outline_blank')" v-if="!field.selected">check_box_outline_blank</i>
            <i class="maticon" v-html="icons('check_box')" v-else>check_box</i>
            <span>{{field.text}}</span>
          </li>
        </ul>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="salaryPeopleExport.show = false">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="_export">导出</button>
      </div>
    </v-modal>

    <v-modal :show="showAddPeopleModal" effect="fade" width="420">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
          新增人员
        </h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="form-group">
          <label class="input-label"><span>*</span>学年</label>
          <v-select class="btn-block search-select" v-model="people.year" :options="schoolYearData" optionsLabel="name" optionsValue="id" search close-on-select></v-select>
        </div>
        <div class="form-group">
          <label class="input-label"><span>*</span>所属单位 </label>
          <v-select class="btn-block search-select" v-model="people.unitId" :options="unitList" optionsLabel="name" optionsValue="id" search close-on-select></v-select>
        </div>
        <div class="form-group">
          <label class="input-label"><span>*</span>岗位</label>
          <v-select class="btn-block search-select" v-model="people.positionId" :options="jobData" optionsLabel="positionName" optionsValue="id"></v-select>
        </div>
        <div class="form-group">
          <label class="input-label"><span>*</span>学号</label>
          <detect url='api/document/students/searchResults' :searchVal="people.searchVal" :placeholder="请输入学号或者姓名" @afterSelected="afterSelectAddPerson"></detect>
        </div>
        <div class="form-group">
          <label class="input-label">联系方式</label>
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
        <button type="button" class="btn submit-btn clearBtnBorder" @click="sureAddPeople">确定</button>
      </div>
    </v-modal>

    <v-modal :show="showEditPeopleModal" effect="fade" width="400">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">编辑人员</h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="form-group info-group">
          <label class="input-label text-right pull-left">工作开始时间</label>
          <v-datepicker class="time-picker" v-model="editPeople.jobStartTime" :clearButton="false" :showTime="false" @daySelected="workStartTimeSelected"></v-datepicker>
        </div>
        <div class="form-group info-group">
          <label class="input-label text-right pull-left">开始结束时间</label>
          <v-datepicker class="time-picker" v-model="editPeople.planOnJobEndTime" :clearButton="false" :showTime="false" @daySelected="workEndTimeSelected"></v-datepicker>
        </div>
        <div class="form-group info-group">
          <label class="input-label text-right pull-left">在岗状态</label>
          <v-select class="search-select" :value="editPeople.onTheJobStatus" :options="jobStatusData" options-value="id" options-label="text" @afterSelected="jobStatusSelected" search close-on-select></v-select>
        </div>
        <div class="form-group info-group">
          <label class="input-label text-right pull-left">备注</label>
          <textarea cols="24" rows="5" class="modal-textarea" maxlength="600" v-model="editPeople.remark"></textarea>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="showEditPeopleModal = false">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="sureEditPeople">确定</button>
      </div>
    </v-modal>

    <!-- <v-modal :show="showAddJobModal&&['setting', 'publish'].indexOf(declareJson.type)>=0" width="900" >
      <div slot="modal-body" class="modal-body" style="height: 400px;padding: 0;">
        <jobDeclare1
          :type="declareJson.type"
          :data="declareJson.data"
          @back="_closeDeclare"
          @submit="sureAddJob"
          v-if="showAddJobModal"
        ></jobDeclare1>
      </div>
    </v-modal> -->
  </div>

  <jobDeclare1 :type="declareJson.type" :data="declareJson.data" @back="_closeDeclare" @submit="sureAddJob" v-else-if="curRouter === 'schoolJobList'&&showAddJobModal"></jobDeclare1>
  <v-import v-bind="importParams" @backParentPage="curRouter = 'schoolJobList'" :downloadTemplateUrl="downloadUrl" :checkTemplateUrl="checkTemplateUrl" :isNeedModal="isNeedModal" :modalname="'选择学年'" v-else-if="curRouter === 'importPage'">
    <div slot="modal">
      <div class="form-group">
        <label class="college-text">学年</label>
        <v-select class="btn-block search-select" :value="importModalSchoolYearDefault" :options="schoolYearData" optionsLabel="name" optionsValue="id" @afterSelected="importModalSchoolYearSelected" search close-on-select></v-select>
      </div>
    </div>
  </v-import>
  <v-import class="jobs-batch-import" v-bind="importJobParams" @backParentPage="curRouter = 'schoolJobList'" v-else-if="curRouter === 'importJobs'"></v-import>
  <jobApplyForm @back="_back" formType="schoolJobView" :isApply="false" :formDetail="applicationFormDetail" v-else></jobApplyForm>

</template>

<script>
import Vue from 'vue'
import { sAjax, translation, createTime, request } from '../../assets/utils/utils.js'
import jobApplyForm from './jobApplyForm.vue'
import jobDeclare from './jobDeclare1.vue'
Vue.component('jobApplyForm', jobApplyForm)
Vue.component('jobDeclare1', jobDeclare)
export default {
  created: function () {
    var la = localStorage.getItem('lang')
    var that = this
    if (translation(la)) {
      this.lang = la
    }
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
    this.getUnitList()
  },
  data: function () {
    return {
      columns: [],
      timeStamp: '',
      url: '/table-data/pwps/positions/page/positions',
      salaryGrantManageUrl: '/table-data/pwps/salaries/page/byUser',
      jobViewUrl: '/table-data/pwps/salaries/page/byPosition',
      peopleViewUrl: '/table-data/pwps/salaries/page/byUser',
      jobPeoPleUrl: '/table-data/pwps/users/page',
      salaryGrantManageColumns: [],
      jobViewColumns: [],
      peopleViewColumns: [],
      jobPeopleColumns: [],
      salaryPeopleExport: {
        show: false,
        fields: [
          { id: 'schoolYear', text: '学年', selected: true },
          { id: 'month', text: '月份', selected: true },
          { id: 'unitId', text: '单位名称', selected: true },
          { id: 'positionName', text: '岗位名称', selected: true },
          { id: 'positionType', text: '岗位类型', selected: false },
          { id: 'rewardStandard', text: '薪酬标准(元/小时)', selected: false },
          { id: 'salaryCapMonth', text: '薪酬上限', selected: false },
          { id: 'name', text: '姓名', selected: true },
          { id: 'userNo', text: '学号', selected: true },
          { id: 'collegeName', text: '学院', selected: false },
          { id: 'educationLevel', text: '培养层次', selected: false },
          { id: 'idCardNo', text: '身份证号', selected: false },
          { id: 'contact', text: '手机', selected: false },
          { id: 'isDifficultyStudent', text: '是否困难生', selected: false },
          { id: 'nation', text: '民族', selected: false },
          { id: 'sex', text: '性别', selected: false },
          { id: 'manHour', text: '工时', selected: false },
          { id: 'totalPayMount', text: '应发金额', selected: true },
          { id: 'realPayMount', text: '实发金额', selected: true },
          { id: 'isGrant', text: '发放状态', selected: true },
          { id: 'remark', text: '备注', selected: true }
        ]
      },
      isTodifficultStudentData: [{ id: 'true', text: '是' }, { id: 'false', text: '否' }],
      showAddPeopleModal: false,
      showAddJobModal: false,
      curPage: 'schoolJobList',
      isJobView: false,
      viewText: '岗位视图',
      schoolYearDefault: '',
      schoolYearData: [],
      jobDefault: '',
      jobData: [],
      people: {
        userId: '',
        userNo: '',
        unitId: '',
        searchVal: '',
        positionId: '',
        year: '',
        userName: '',
        errorMessage: ''
      },
      job: {},
      importPage: false,
      importParams: {
        parentPageTitle: '',
        downloadErrorTemplateUrl: '',
        templateName: '',
        importBtnType: null
      },
      importJobParams: {
        parentPageTitle: '全校岗位列表',
        checkTemplateUrl: '/pwps/positions/import/check',
        downloadErrorTemplateUrl: '/pwps/positions/import/error',
        downloadTemplateUrl: '/pwps/positions/import/template',
        templateName: '岗位列表导入模板',
        importBtnType: [{
          url: '/pwps/positions/import',
          isShowBtn: true,
          method: 'post',
          name: '增量导入',
          success: (data) => {
            if (data.state) {
              this.timeStamp = createTime()
            }
          }
        }]
      },
      showEditPeopleModal: false,
      jobStatusData: [{
        id: 'ON_JOB',
        text: '在岗'
      }, {
        id: 'RETREAT_FROM_A_PORT',
        text: '退岗'
      }],
      editPeople: {
        id: '',
        jobStartTime: '',
        planOnJobEndTime: '',
        onTheJobStatus: '',
        remark: ''
      },
      importModalSchoolYearDefault: '',
      positionTypeData: [],
      applicationFormDetail: {},
      curRouter: 'schoolJobList',
      unitList: [],
      oldRouter: '',
      isNeedModal: '',
      declareJson: {
        type: '',
        data: null
      },
      lang: 'zh-cn'
    }
  },
  computed: {
    translate: function () {
      return translation(this.lang).schoolRoleManage
    },
    downloadUrl: function () {
      if (this.curPage === 'jobPeopleManage') {
        return '/pwps/users/excels/templates?schoolYear=' + this.importModalSchoolYearDefault
      } else {
        return '/pwps/users/template/grantResult'
      }
    },
    checkTemplateUrl: function () {
      if (this.curPage === 'jobPeopleManage') {
        return '/pwps/users/excels/check?schoolYear=' + this.importModalSchoolYearDefault
      } else {
        return '/pwps/users/salary/grantResults/excel'
      }
    },
  },
  watch: {
    'people.year'(newVal) {
      this.getPositionList()
    },
    'people.unitId'(newVal) {
      this.getPositionList()
    },
  },
  methods: {
    isPhoneNo: function () {
      var pattern = /^1[3456789]\d{9}$/
      if (!pattern.test(this.people.contact)) {
        this.$toast('联系方式格式不对')
        this.people.contact = ''
        return
      }
    },
    editWorkStartTimeSelected: function (data) {
      let type = this.showAddPeopleModal ? "people" : "editPeople"
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
      let type = this.showAddPeopleModal ? "people" : "editPeople"
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
    afterSelectAddPerson(a) {
      this.people.searchVal = `${a.name}(${a.userNo})`
      this.people.userId = a.userId
      this.people.userNo = a.userNo
      this.people.userName = a.name
    },
    initColumns() {
      let that = this;
      this.columns = [{
        id: 'schoolYear',
        title: '学年',
        className: 'text-left',
        hidden: false,
        width: 100,
        formatter: function (record) {
          return record.schoolYear && record.schoolYear.name
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
        width: 80,
        formatter: function (record) {
          return record.unit && record.unit.name
        },
        search: {
          type: 'select',
          data: {
            options: this.unitList,
            optionsLabel: 'name',
            optionsValue: 'id'
          }
        }
      }, {
        id: 'positionName',
        title: '岗位名称',
        className: 'text-left',
        hidden: false,
        width: 80,
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
        width: 60,
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
        className: 'text-right',
        hidden: false,
        width: 60
      }, {
        id: 'userIncumbencyCount',
        title: '在岗人数',
        className: 'text-right',
        width: 60,
        hidden: false
      }, {
        id: 'rewardStandard',
        title: '薪酬标准(元/小时)',
        className: 'text-right',
        width: 110,
        hidden: false
      }, {
        id: 'salaryCapMonth',
        title: '月工资上限',
        className: 'text-right',
        width: 80,
        hidden: false
      }, {
        id: 'isToDifficultyStudent',
        title: '针对困难生',
        className: 'text-center',
        width: 80,
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
        className: 'text-center',
        width: 100,
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
        width: 80,
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
        hidden: true,
        width: 80,
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
        hidden: true,
        width: 150,
        formatter: function (record) {
          return record.jobStartTime ? record.jobStartTime.split(' 00:00:00')[0] : ''
        }
      }, {
        id: 'jobEndTime',
        title: '工作结束时间',
        className: 'text-left',
        hidden: true,
        width: 150,
        formatter: function (record) {
          return record.jobEndTime ? record.jobEndTime.split(' 00:00:00')[0] : ''
        }
      }, {
        id: 'applyStartTime',
        title: '申请开始时间',
        className: 'text-left',
        hidden: true,
        width: 150,
        formatter: function (record) {
          return record.applyStartTime ? record.applyStartTime.split(' 00:00:00')[0] : ''
        }
      }, {
        id: 'applyEndTime',
        title: '申请结束时间',
        className: 'text-left',
        width: 150,
        hidden: true,
        formatter: function (record) {
          return record.applyEndTime ? record.applyEndTime.split(' 00:00:00')[0] : ''
        }
      }, {
        id: 'publishStatus',
        title: '发布状态',
        className: 'text-left',
        width: 80,
        hidden: false,
        search: {
          type: 'select',
          data: {
            options: [{ text: '未发布', id: '未发布' }, { text: '已发布', id: '已发布' }, { text: '已过期', id: '已过期' }],
            optionsLabel: 'text',
            optionsValue: 'id'
          }
        }
      }, {
        id: 'opt',
        className: 'text-left',
        title: '操作',
        width: 120,
        hidden: false,
        formatter: (recordItem) => {
          var text = '发布'
          var type = 'publish'
          if (recordItem.isPublish) {
            text = '设置'
            type = 'setting'
          }
          return [{
            tag: 'a',
            text: text,
            className: 'opt-btn',
            callback: (record, index) => {
              this.showAddJobModal = true
              record.isToDifficultyStudent = record.isToDifficultyStudent + ''
              record.canApply = record.canApply + ''
              record.schoolYearId = record.schoolYear.id
              record.unitId = record.unit.id
              record.userName = record.manager.name
              record.userNo = record.manager.userNo
              this.declareJson = {
                type: type,
                data: record
              }
            }
          }, {
            tag: 'a',
            text: '删除',
            className: 'opt-btn',
            callback: (record, index) => {
              if (window.confirm('删除后数据无法恢复，确定删除吗？')) {
                sAjax({
                  url: '/api/pwps/positions/' + record.id,
                  type: 'post',
                  success: (data) => {
                    if (data.state) {
                      this.url = '/table-data/pwps/positions/page/positions?timestamp=' + createTime()
                      this.$toast('删除成功')
                    } else {
                      this.$toast(data.message)
                    }
                  }
                })
              }
            }
          }]


        }
      }]
      this.jobPeopleColumns = [{
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
        id: 'userName',
        title: '姓名',
        className: 'text-left',
        width: 50,
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
        id: 'idCardNo',
        title: '身份证',
        className: 'text-left',
        width: 150,
        hidden: true,
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
        width: 100,
        hidden: false,
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
        id: 'unitId',
        title: '单位名称',
        className: 'text-left',
        width: 80,
        hidden: false,
        search: {
          type: 'select',
          data: {
            options: this.unitList,
            optionsLabel: 'name',
            optionsValue: 'id'
          }
        },
        formatter: function (record) {
          return record.unitName
        }
      }, {
        id: 'isDifficultyStudent',
        title: '是否困难生',
        className: 'text-center',
        width: 100,
        hidden: true,
        search: {
          type: 'select',
          data: {
            options: [{
              id: true,
              name: '是'
            }, {
              id: false,
              name: '否'
            }],
            optionsLabel: 'name',
            optionsValue: 'id'
          }
        },
        formatter: function (record) {
          return record.applicationFormVO.isDifficultyStudent ? '是' : '否'
        }
      }, {
        id: 'userGrade',
        title: '年级',
        className: 'text-left',
        width: 40,
        hidden: false,
        search: {
          type: 'input',
          data: {
            placeholer: '',
            autoFocus: true
          }
        }
      }, {
        id: 'educationLevelName',
        title: '培养层次',
        className: 'text-left',
        width: 70,
        hidden: false,
        search: {
          type: 'select',
          data: {
            url: '/api/system/dicts?dictType=培养层次',
            optionsLabel: 'label',
            optionsValue: 'value'
          }
        }
      }, {
        id: 'positionName',
        title: '岗位名称',
        className: 'text-left',
        width: 100,
        hidden: false,
        search: {
          type: 'input',
          data: {
            placeholer: '',
            autoFocus: true
          }
        }
      }, {
        id: 'onTheJobStatus',
        title: '在岗状态',
        className: 'text-left',
        width: 70,
        hidden: false,
        search: {
          type: 'select',
          data: {
            options: this.jobStatusData,
            optionsLabel: 'text',
            optionsValue: 'id'
          }
        },
        formatter: function (record) {
          return record.onTheJobStatus === 'ON_JOB' ? '在岗' : '退岗'
        }
      }, {
        id: 'originPlace',
        title: '生源地',
        className: 'text-left',
        width: 120,
        hidden: true
      }, {
        id: 'opt',
        className: 'text-left',
        title: '操作',
        width: 120,
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
                isShowLog: false,
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
      this.jobViewColumns = [{
        id: 'schoolYear',
        title: '学年',
        className: 'text-left',
        hidden: false,
        width: 110,
        search: {
          type: 'select',
          data: {
            url: '/api/pwps/positions/all/schoolYears',
            optionsLabel: 'name',
            optionsValue: 'id'
          }
        },
        formatter: function (record) {
          return record.position && record.position.schoolYear && record.position.schoolYear.name
        }
      }, {
        id: 'month',
        title: '月份',
        className: 'text-left',
        width: 70,
        hidden: false,
        search: {
          type: 'input',
          data: {
            placeholer: '',
            autoFocus: true
          }
        }
      }, {
        id: 'unitId',
        title: '单位名称',
        className: 'text-left',
        width: 130,
        hidden: false,
        formatter: function (record) {
          return record.position && record.position.unit && record.position.unit.name
        },
        search: {
          type: 'select',
          data: {
            options: this.unitList,
            optionsLabel: 'name',
            optionsValue: 'id'
          }
        }
      }, {
        id: 'positionName',
        title: '岗位名称',
        className: 'text-left',
        width: 150,
        hidden: false,
        formatter: function (record) {
          return record.position && record.position.positionName
        },
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
        width: 100,
        hidden: false,
        formatter: (record) => {
          if (record.position) {
            var label = ''
            this.positionTypeData.forEach((ele, index) => {
              if (ele.value === record.position.positionType) {
                label = ele.label
              }
            })
            return label
          }
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
        id: 'grantCount',
        title: '发放人数',
        className: 'text-right',
        width: 80,
        hidden: false
      }, {
        id: 'totalPayMount',
        title: '应发放薪酬',
        className: 'text-left',
        width: 90,
        hidden: false
      }, {
        id: 'realPayMount',
        title: '实际发放薪酬',
        className: 'text-left',
        width: 90,
        hidden: false
      }]
      this.peopleViewColumns = [{
        id: 'schoolYear',
        title: '学年',
        className: 'text-left',
        hidden: false,
        width: 110,
        search: {
          type: 'select',
          data: {
            url: '/api/pwps/positions/all/schoolYears',
            optionsLabel: 'name',
            optionsValue: 'id'
          }
        },
        formatter: function (record) {
          return record.position && record.position.schoolYear && record.position.schoolYear.name
        }
      }, {
        id: 'month',
        title: '月份',
        className: 'text-left',
        width: 80,
        hidden: false,
        search: {
          type: 'input'
        }
      }, {
        id: 'unitId',
        title: '单位名称',
        className: 'text-left',
        width: 120,
        hidden: false,
        formatter: function (record) {
          return record.position && record.position.unit && record.position.unit.name
        },
        search: {
          type: 'select',
          data: {
            options: this.unitList,
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
        formatter: function (record) {
          return record.position && record.position.positionName
        },
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
        width: 100,
        hidden: true,
        formatter: (record) => {
          if (record.position) {
            var label = ''
            this.positionTypeData.forEach((ele, index) => {
              if (ele.value === record.position.positionType) {
                label = ele.label
              }
            })
            return label
          }

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
        id: 'rewardStandard',
        title: '薪酬标准(元/小时)',
        className: 'text-right',
        width: 120,
        hidden: true,
        formatter: function (record) {
          return record.position && record.position.rewardStandard
        }
      }, {
        id: 'salaryCapMonth',
        title: '薪酬上限',
        className: 'text-right',
        width: 80,
        hidden: true,
        formatter: function (record) {
          return record.position && record.position.salaryCapMonth
        }
      }, {
        id: 'name',
        title: '姓名',
        className: 'text-left',
        width: 100,
        hidden: false,
        formatter: function (record) {
          return record.user && record.user.name
        },
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
        className: 'text-left',
        width: 130,
        hidden: false,
        formatter: function (record) {
          return record.user && record.user.userNo
        },
        search: {
          type: 'input',
          data: {
            placeholer: '',
            autoFocus: true
          }
        }
      }, {
        id: 'collegeName',
        title: '学院',
        className: 'text-left',
        width: 80,
        hidden: false,
        formatter: function (record) {
          return record.userDetail.collegeName
        }
      }, {
        id: 'educationLevel',
        title: '培养层次',
        className: 'text-left',
        width: 80,
        hidden: false,
        formatter: function (record) {
          return record.userDetail.educationLevelLabel
        }
      }, {
        id: 'idCardNo',
        title: '身份证号',
        className: 'text-left',
        width: 150,
        hidden: true,
        formatter: function (record) {
          return record.userDetail.idCardNo
        }
      }, {
        id: 'contact',
        title: '联系方式',
        className: 'text-left',
        width: 120,
        hidden: true,
        formatter: function (record) {
          return record.userDetail.contact
        }
      }, {
        id: 'isDifficultyStudent',
        title: '是否困难生',
        className: 'text-left',
        width: 100,
        hidden: true,
        formatter: function (record) {
          return record.userDetail.isDifficultyStudent ? '是' : '否'
        }
      }, {
        id: 'nation',
        title: '民族',
        className: 'text-left',
        width: 80,
        hidden: true,
        formatter: function (record) {
          return record.userDetail.nationLabel
        }
      }, {
        id: 'sex',
        title: '性别',
        className: 'text-left',
        width: 40,
        hidden: true,
        formatter: function (record) {
          return record.userDetail.sexLabel
        }
      }, {
        id: 'manHour',
        title: '工时',
        className: 'text-right',
        width: 60,
        hidden: true
      }, {
        id: 'totalPayMount',
        title: '应发金额',
        className: 'text-right',
        width: 80,
        hidden: false
      }, {
        id: 'realPayMount',
        title: '实发金额',
        width: 80,
        className: 'text-right',
        hidden: false
      }, {
        id: 'isGrant',
        title: '发放状态',
        className: 'text-center',
        width: 100,
        hidden: false,
        search: {
          type: 'select',
          data: {
            options: [{ value: true, label: '已发放' }, { value: false, label: '未发放' }],
            optionsLabel: 'label',
            optionsValue: 'value'
          }
        },
        formatter: function (record) {
          return record.isGrant ? '已发放' : '未发放'
        }
      }, {
        id: 'remark',
        title: '备注',
        width: 80,
        className: 'text-left',
        hidden: true
      }]
      this.salaryGrantManageColumns = this.peopleViewColumns
    },
    _back: function () {
      this.curRouter = 'schoolJobList'
    },
    getUnitList() {
      let url = '/api/pwps/units/all'
      request(url).then(o => {
        if (o.state) {
          this.unitList = o.data
        }
        this.initColumns()
      })
    },
    changeView: function () {
      this.isJobView = !this.isJobView
      if (this.isJobView) {
        this.viewText = '人员视图'
        this.salaryGrantManageColumns = this.jobViewColumns
        this.salaryGrantManageUrl = this.jobViewUrl
      } else {
        this.viewText = '岗位视图'
        this.salaryGrantManageColumns = this.peopleViewColumns
        this.salaryGrantManageUrl = this.peopleViewUrl
      }
    },
    showSalaryExport: function () {
      this.salaryPeopleExport.show = true
    },
    _export: function () {
      var searchData = this.$refs.gruntTable.tableSearchFields
      var searchText = ''
      for (var i in searchData) {
        if (!searchData[i]) {
          searchText += '&' + i + '=' + ''
        } else {
          searchText += '&' + i + '=' + searchData[i]
        }
      }
      const selectedFieldIds = [];
      for (const field of this.salaryPeopleExport.fields) {
        if (field.selected) {
          selectedFieldIds.push(field.id);
        }
      }
      searchText += `&exportFields=${selectedFieldIds.join(',')}`
      window.location.href = '/downloads/pwps/salaries/excel?detail=true&fileName=全校薪酬发放' + searchText
    },
    importGrantResult: function () {
      this.curRouter = 'importPage'
      this.isNeedModal = false
      this.importParams = {
        parentPageTitle: '薪酬发放管理列表',
        downloadErrorTemplateUrl: '/pwps/users/excel/error/grantResult',
        templateName: '薪酬发放结果导入'
      },
        this.importParams.importBtnType = [{
          url: '/pwps/users/salary/grantResults',
          method: 'post',
          isShowBtn: true,
          name: '覆盖导入',
          success: (data) => {
            if (data.state) {
              this.salaryGrantManageUrl = '/table-data/pwps/salaries/page/byUser?timestamp=' + createTime()
            }
          }
        }]
    },
    newAddPeopel: function () {
      this.showAddPeopleModal = true
      this.schoolYearDefault = ''
      this.jobDefault = ''
      this.people = {
        userId: '',
        searchVal: '',
        userNo: '',
        unitId: '',
        year: '',
        userName: '',
        errorMessage: ''
      }
    },
    batchNewAddPeople: function () {
      this.curRouter = 'importPage'
      this.isNeedModal = true
      this.importParams = {
        parentPageTitle: '岗位人员管理列表',
        downloadErrorTemplateUrl: '/pwps/users/excels/errorExcels',
        templateName: '岗位人员导入'
      }
      this.importParams.importBtnType = [{
        url: '/pwps/users/batch',
        method: 'post',
        isShowBtn: true,
        name: '增量导入',
        success: (data) => {
          if (data.state) {
            this.jobPeoPleUrl = '/table-data/pwps/users/page?timestamp=' + createTime()
          }
        }
      }]
    },
    exportJobMembers: function () {
      var str = ''
      var searchJson = this.$refs.jobPeople.tableSearchFields
      for (var i in searchJson) {
        str += `${i}=${searchJson[i]}&`
      }
      str += `timeStamp=${createTime()}`
      location.href = `/downloads/pwps/users/excel?${str}`
    },
    newAddJob: function () {
      this.showAddJobModal = true
      this.declareJson = {
        type: 'add',
        data: null
      }
    },
    batchNewAddJob: function () {
      this.curRouter = 'importJobs'
    },
    getPositionList() {
      let url = `/api/pwps/positions/options?schoolYear=${this.people.year}&unitId=${this.people.unitId}`
      request(url).then(o => {
        if (o.state) {
          this.jobData = o.data.map(a => {
            return {
              id: a.id,
              positionName: a.positionName
            }
          })
        } else {
          this.$toast(data.message)
        }
      })
    },
    checkUser: function () {
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
    jobSelected: function (obj) {
      this.jobDefault = obj.value
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
      sAjax({
        url: '/api/pwps/users/edit',
        type: 'post',
        data: this.editPeople,
        success: (data) => {
          if (data.state) {
            this.jobPeoPleUrl = '/table-data/pwps/users/page?timestamp=' + createTime()
            this.$toast('操作成功')
            this.showEditPeopleModal = false
          } else {
            this.$toast(data.message)
          }
        }
      })
    },
    sureAddPeople: function () {
      if (!this.people.year) {
        this.$toast('请先选择学年')
        return
      }
      if (!this.people.positionId) {
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
      let url = '/api/pwps/users'
      request(url, this.people).then(o => {
        if (o.state) {
          this.timestamp = new Date()
          this.showAddPeopleModal = false
          this.$toast('新增成功')
        } else {
          this.$toast(o.message)
        }
      })

    },
    sureAddJob: function (formData) {
      if (this.declareJson.type === 'publish') {

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
      } else if (this.declareJson.type === 'setting') {
        sAjax({
          url: `/api/pwps/positions/update/${formData.id}`,
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
              this.$toast('设置保存成功')
            } else {
              this.$toast(data.message)
            }
          }
        })
      } else {
        formData.addedByAdmin = true
        sAjax({
          url: '/api/pwps/positions',
          type: 'post',
          data: formData,
          success: (data) => {
            if (data.state) {
              this.timeStamp = createTime()
              this.showAddJobModal = false
              this.declareJson = {
                type: '',
                data: null
              }
              this.$toast('岗位新增成功')
            } else {
              if (data.code === '30805') {
                this.$toast('该单位已被禁用，无法进行岗位新增')
              } else {
                this.$toast(data.message)
              }
            }
          }
        })
      }
    },
    _closeDeclare: function () {
      this.showAddJobModal = false
      this.declareJson = {
        type: '',
        data: null
      }
    },
    workStartTimeSelected: function (data) {
      if (this.editPeople.planOnJobEndTime) {
        var timeString = new Date(data.value).getTime() - new Date(this.editPeople.planOnJobEndTime).getTime()
        if (timeString > 0) {
          this.$nextTick(() => {
            this.$toast('工作开始时间要在工作结束时间之前')
            this.editPeople.jobStartTime = ''
          })
          return false
        } else {
          this.editPeople.jobStartTime = data.value
        }
      } else {
        this.editPeople.jobStartTime = data.value
      }
    },
    workEndTimeSelected: function (data) {
      if (this.editPeople.jobStartTime) {
        var timeString = new Date(data.value).getTime() - new Date(this.editPeople.jobStartTime).getTime()
        if (timeString < 0) {
          this.$nextTick(() => {
            this.$toast('工作结束时间要在工作开始时间之后')
            this.editPeople.planOnJobEndTime = ''
          })
          return false
        } else {
          this.editPeople.planOnJobEndTime = data.value
        }
      } else {
        this.editPeople.planOnJobEndTime = data.value
      }
    },
    jobStatusSelected: function (obj) {
      this.editPeople.onTheJobStatus = obj.value
    },
    importModalSchoolYearSelected: function (obj) {
      this.importModalSchoolYearDefault = obj.value
    }
  }
}
</script>
<style lang="less">
@import url("../../assets/common.less");
#schoolJobManage {
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
  .modal-body {
    .field-item {
      border: 0;
      i {
        color: rgba(0, 0, 0, 0.54);
        vertical-align: middle;
      }
      span {
        vertical-align: middle;
      }
      &.active {
        color: rgba(0, 0, 0, 0.54);
        background-color: #fff;
        i {
          color: #298df7;
        }
      }
    }
    .jobs-batch-import {
      width: auto;
      padding: 0;
    }
    .search-select {
      width: 220px;
      margin: 0 18px;
    }
    .star {
      color: red;
    }
    .info-group {
      .input-label {
        width: 86px;
        line-height: 34px;
      }
      background: #ffffff;
    }
    .one-words-difference-margin {
      margin-left: 13px;
    }
    .two-words-difference-margin {
      margin-left: 28px;
    }
    .four-words-difference-margin {
      margin-left: 55px;
    }
    .unit-name-label {
      margin-left: 17px;
    }
    .textarea-label {
      vertical-align: top;
    }
    .modal-textarea {
      width: 60%;
      resize: none;
      margin-left: 18px;
      padding: 5px;
      border-radius: 5px;
      border: 1px solid #e0e0e0;
      outline: none;
      &:disabled {
        cursor: not-allowed;
      }
    }
    .radio-group {
      width: 100%;
      margin-bottom: 18px;
      margin-top: 25px;
      .radio-area {
        display: inline-block;
        div {
          display: inline-block;
          margin-left: 22px;
        }
      }
    }
  }
  .batch-div {
    position: absolute;
    left: 0;
    top: -21px;
    z-index: 3;
    width: 100%;
    height: 50px;
    padding: 0 10px 0 20px;
    margin: 0 0 -10px 0;
    background: rgb(250, 241, 218);
    span {
      line-height: 50px;
      &.batch-tip {
        color: #298df7;
      }
    }
    .batch-opt {
      span {
        display: inline-block;
        margin: 0 12px;
        cursor: pointer;
        transition: all 0.3s ease-out;
        &:hover {
          color: #298df7;
        }
      }
    }
  }
  .two-words-difference-margin {
    margin-left: 28px;
  }
  .error-message {
    margin-left: 50px;
    margin-top: 10px;
    color: red;
  }
  .time-picker {
    display: inline-block;
    margin-left: 18px;
    .form-control {
      border-radius: 0;
      border: none;
      border-bottom: 2px solid #e0e0e0;
      width: 220px !important;
    }
  }
  .textarea-label {
    vertical-align: top;
  }
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
}
#schoolJobManage .modal-body {
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
  .ditection {
    margin: 0 18px;
    width: 220px;
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
