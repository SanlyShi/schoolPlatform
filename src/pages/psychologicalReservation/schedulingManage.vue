<template>
  <div id="schedulingManage" class="container">
    <div class="scheduling-manage"  v-show="!isAddScheduling">
     <c-reserveTable
      ref='reservaTable'
      :tableData="schedulingData"
      :isShowDateOfDay="true"
      tableType="manage"
      @getWeekTime="_getWeekTime"
      :timeQuantumArray="timeQuantumArray"
      dataType = 'data'
      :enable-show-reserved-people="true"
      @reservedPeopleVisibilityChange="reservedPeopleVisibilityChange"
      @editConsultant="_editConsultant"
      @showReservation="showReservation">
      <div slot="header-select" class="campus-select">
        <div class="select-radio" v-if="schoolData.length > 0">
          <!-- <label class="radio-text">校区</label> -->
           <el-radio @change="switchType" v-model="schedulingType" label="RESERVATION">线下咨询</el-radio>
          <span></span>
          <div class="info-options" v-show="schedulingType == 'RESERVATION'">
            <span class="" v-for="(opt, i) in schoolData" :key="i" @click="_selectCampus(opt)">
              <i class="maticon" :class="selectCampus === opt.value?'active':''" v-html="icons(selectCampus === opt.value?'radio_button_checked':'radio_button_unchecked')"></i>{{opt.label}}
            </span>
          </div>
        </div>
        <div class="select-radio">
          <el-radio @change="switchType"  style="display: block;" v-model="schedulingType" label="ONLINE">网上咨询</el-radio>
        </div>
        <!-- <div class="select-radio" style="margin-left: 19px" v-if="isShowSchedulingType">
          <label class="radio-text">排班类型</label>
          <span></span>
          <div class="info-options">
            <span class="" v-for="(opt, i) in schedulingTypeData" :key="i" @click="_selectSchedulingType(opt)">
              <i class="maticon" :class="schedulingType === opt.value?'active':''" v-html="icons(schedulingType === opt.value?'radio_button_checked':'radio_button_unchecked')"></i>{{opt.label}}
            </span>
          </div>
        </div> -->
      </div>
      <div slot="body-slot" class="body-slot">
        <div class="pull-left">
          <span class="time-tips">{{weekTime.weekStartTime}}-{{weekTime.weekEndTime}} 排班表</span>
          <span v-if="!reservedPeopleVisible">
            <span>
              <span class="show-schedule-color"> </span>
              <span class="show-schedule-name">排班对学生可见</span>
            </span>
            <span>
              <span class="hide-schedule-color"> </span>
              <span class="hide-schedule-name">排班对学生隐藏</span>
            </span>
          </span>
          <span v-else>
            <span>
              <span class="reserved-color"> </span>
              <span class="show-schedule-name">已预约</span>
            </span>
            <span>
              <span class="no-reserved-color"> </span>
              <span class="hide-schedule-name">未预约</span>
            </span>
          </span>
        </div>
        <div class="btn-group pull-right" v-if="!reservedPeopleVisible">
          <button type="button" class="btn table-btn clearBtnBorder" @click="_showSettingModal">排班设置</button>
          <button type="button" class="btn table-btn clearBtnBorder add-btn" @click="addScheduling"> <i class="maticon pull-left add-icon" v-html="icons('add')">add</i> 新增排班</button>
        </div>
      </div>
     </c-reserveTable>
    </div>
    <div class="add-scheduling-page" v-if='isAddScheduling'>
     <div class="addScheduling-header">
       <div class="addScheduling-back pull-left" @click="_back">
          <i class="maticon back-icon-btn pull-left" v-html="icons('navigate_before')">navigate_before</i>
          <div class="back-title">新增排班</div>
       </div>
       <div class="search-user">
         <detect url="/api/mentality/teachers/searchResults" placeholder="咨询师姓名或学工号" @afterSelected="addSchedulingAfterSelected" v-if="isShowSearch"></detect>
         <div v-else>
          <div class="user-info pull-left">{{userIdAndUserName}}</div>  <i class="maticon pull-right" v-html="icons('edit')" @click="changeUserSearch">edit</i>
         </div>
       </div>
     </div>
     <div class="addScheduling-content" :style="'max-height:' + scrollHeight + 'px'">
       <p>{{weekTime.weekStartTime + '-' + weekTime.weekEndTime}}</p>
       <c-reserveTable
        :tableData="schedulingData"
        :isShowDateOfDay="true"
        tableType="add"
        @selectTabelCell="_selectTabelCell"
         @getWeekTime="_getWeekTime"
        :timeQuantumArray="timeQuantumArray"
        dataType = 'add'
        :isChangeDate='isChangeDate'
        :consultantId = "consultantId">
       </c-reserveTable>
      <!-- <c-reserveTable
        :isShowDateOfDay="false"
        :tableData="newSettingData"
        tableType="add"
        :consultantId = "consultantId"
        dataType='setting'
        :timeQuantumArray="timeQuantumArray"
        @selectTabelCell="_selectTabelCell">
      </c-reserveTable> -->
      <div class="box_flex align_center" @click="addhideToStu=!addhideToStu">
          <i class="maticon active" v-html="icons('check_box')" v-if="addhideToStu">check_box</i>
          <i class="maticon" v-html="icons('check_box_outline_blank')" v-else>check_box_outline_blank</i>
        <span class="icon-title">对学生隐藏排班</span>
      </div>
      <div class="tips">注：此排班时间设为每周排班时间段，若需修改请直接在排班表点击人员姓名直接修改；系统将会根据填写的时长与工作时间设置排班时段。</div>
      <div class="psychological-footer">
       <div class="btn-group">
        <button type="button" class="btn submit-btn clearBtnBorder"  @click="submitAddScheduling">提交</button>
      </div>
     </div>
     </div>
    </div>
    <v-modal :show="showEditModal" effect="fade" width="442">
      <div slot="modal-header" class="modal-header">
        编辑
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="modal-search-user">
          <detect url="/api/mentality/teachers/searchResults" placeholder="咨询师姓名或学工号" @afterSelected="editConsultantAfterSelected" v-if="showEditModal"></detect>
        </div>
        <div class="consultant-name-list">
          <div class="consultant-name" v-for="(item, index) in consultantArr" :key="index" @click="deleteConsultant(item)">
            <i class="maticon" v-html="icons('clear')">clear</i>
            {{item.name}}
          </div>
        </div>
        <div>
          <div class="modify-scheduling-options">
            <span @click="hideToStu=!hideToStu">
              <i class="maticon active" v-html="icons('check_box')" v-if="hideToStu">check_box</i>
              <i class="maticon" v-html="icons('check_box_outline_blank')" v-else>check_box_outline_blank</i>
            </span>
            <span class="icon-title">对学生隐藏排班</span>
          </div>
          <div class="modify-scheduling-options">
            <span @click="selectScheduling">
              <i class="maticon active" v-html="icons('check_box')" v-if="isUpdateNext">check_box</i>
              <i class="maticon" v-html="icons('check_box_outline_blank')" v-else>check_box_outline_blank</i>
            </span>
            <span class="icon-title">修改当前周之后所有排班</span>
          </div>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder"  @click="showEditModal = false">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="sumbitEditConsultant">确定</button>
      </div>
    </v-modal>
     <v-modal :show="showSettingModal" effect="fade" width="512">
      <div slot="modal-header" class="modal-header">
       <h5 class="modal-title">
          排班设置
        </h5>
      </div>
      <div slot="modal-body" class="setting-modal-body">
        <div class="form-list">
          <div class="form-group marginLeft45px">
            <label class="form-label"><span class="star">*</span>排班开始日期</label>
            <v-datepicker class="btn-block time-picker"  :clearButton="false" :showTime="false" v-model="settingData.startTime" @daySelected="startTimeSelected"></v-datepicker>
          </div>
          <div class="form-group marginLeft45px">
            <label class="form-label"><span class="star">*</span>排班结束日期</label>
            <v-datepicker class="btn-block time-picker" :clearButton="false" :showTime="false"  v-model="settingData.endTime" @daySelected="endTimeSelected"></v-datepicker>
          </div>
          <div class="time-list" v-for="(item, index) in settingData.timeList" :key="index">
             <div class="form-group marginLeft75px">
              <label class="form-label "><span class="star">*</span>开始时间</label>
              <input type="text" class="form-control form-input" placeholder="时间格式：08:30" v-model="item.timeQuantumStart" @change="checkTimeQuantumStart(item.timeQuantumStart, index)">
            </div>
            <div class="form-group marginLeft75px">
              <label class="form-label "><span class="star">*</span>结束时间</label>
              <input type="text" class="form-control form-input" placeholder="时间格式：08:30" v-model="item.timeQuantumEnd" @change="checkTimeQuantumEnd(item.timeQuantumEnd, index)">
            </div>
            <div class="delete-btn" @click="_deleteTime(item)" >删除</div>
          </div>
          <div class="btn-group add-time-btn">
            <button type="button" class="btn submit-btn" @click="_addTime"> <i class="maticon pull-left add-icon" v-html="icons('add')">add</i>增加时间段</button>
          </div>
        </div>
        <div class="tips">注：此排班时间设为每周排班时间段，若需修改请到排班管理进行修改。</div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder"  @click="showSettingModal = false">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="sumbitSetting">确定</button>
      </div>
    </v-modal>
    <!-- <student-reservation :reservation="reservation" :schedule="schedule" v-if="showStudentReservation" @close="showStudentReservation = false"></student-reservation> -->
    <p>{{showStudentReservation&&reservation!=null}}</p>
      <v-modal :show="showStudentReservation&&reservation!=null" effect="fade" width="1000">
      <div slot="modal-header" class="modal-header">
        <div class="modal-title student-info-title">查看学生信息</div>
      </div>
      <div slot="modal-body" class="modal-body" v-if='reservation'>
        <!-- <GeminiScrollbar class="srcoll-bar" :scrollX="false"> -->
          <el-tabs v-model="activeName" >
         
          <!-- <div id="pdfDom" :class="{ 'exporting-to-pdf': exportingToPdf }"> -->
            <!-- <p id="pdf-title" v-if="exportingToPdf">预约详情</p> -->
             <el-tab-pane label="基本信息" name="first">
            <div class="columns">
              <!-- <label class="columns-title">基本信息</label> -->
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-label">姓名</label>
                    <label class="label-content">{{reservation.student.name}}</label>
                  </div>
                  <div class="form-group">
                    <label class="form-label">学号</label>
                    <label class="label-content">{{reservation.student.userNo}}</label>
                  </div>
                  <div class="form-group">
                    <label class="form-label">年级</label>
                    <label class="label-content">{{reservation.student.grade}}</label>
                  </div>
                  <div class="form-group">
                    <label class="form-label">学院</label>
                    <label class="label-content">{{reservation.student.collegeName}}</label>
                  </div>
                  <div class="form-group">
                    <label class="form-label">邮箱</label>
                    <label class="label-content">{{reservation.student.email}}</label>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-label two-words-difference-margin">班级</label>
                    <label class="label-content">{{reservation.student.className}}</label>
                  </div>
                  <div class="form-group">
                    <label class="form-label">培养层次</label>
                    <label class="label-content">{{reservation.student.educationLevelLabel}}</label>
                  </div>
                  <div class="form-group">
                    <label class="form-label">政治面貌</label>
                    <label class="label-content">{{reservation.student.politicalStatusLabel}}</label>
                  </div>
                  <div class="form-group">
                    <label class="form-label">性别</label>
                    <label class="label-content">{{reservation.student.sexLabel}}</label>
                  </div>
                  <div class="form-group" >
                    <label class="form-label">联系方式</label>
                    <label class="label-content">{{reservation.student.contact}}</label>
                  </div>
                  <!-- <div class="form-group" >
                    <label class="form-label">联系方式</label>
                   
                      <input type="text" class="label-content" :class="formatError.contact?'error':''" v-model="reservation.student.contact" @change="checkAndUpdateContact">
               
                  </div> -->
                </div>
              </div>
            </div>
             </el-tab-pane>
             <el-tab-pane label="预约填写额外信息" name="two">
            <div class="columns">
              <label class="columns-title">预约填写额外信息</label>
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                   
                    <label class="form-label">家庭成员</label>
                    <label class="label-content">{{reservation.familyMembers}}</label>
                  </div>
                  <div class="form-group">
                    <label class="form-label">父母婚姻情况</label>
                    <label class="label-content">{{reservation.parentsMarriageSituation}}</label>
                  </div>
                  <div class="form-group">
                    <label class="form-label">本次咨询内容</label>
                    <label class="label-content">{{reservation.content}}</label>
                  </div>
                  <div class="form-group">
                    <label class="form-label">本次咨询备注</label>
                    <label class="label-content">{{reservation.remark}}</label>
                  </div>

                  <div class="form-group">
                    <label class="form-label">是否有精神科就医经历</label>
                    <label class="label-content">{{reservation.hasPsychiatricHistory?'是':reservation.hasPsychiatricHistory==false?'否':''}}</label>
                  </div>
                  <div class="form-group" v-if="reservation.hasPsychiatricHistory == '是'">
                    <label class="form-label">医院</label>
                    <label class="label-content">{{reservation.hospital}}</label>
                  </div>
                  <div class="form-group" v-if="reservation.hasPsychiatricHistory == '是'">
                    <label class="form-label">医生姓名</label>
                    <label class="label-content">{{reservation.doctor}}</label>
                  </div>
                  <div class="form-group" v-if="reservation.hasPsychiatricHistory == '是'">
                    <label class="form-label">服用药物</label>
                    <label class="label-content">{{reservation.drug}}</label>
                  </div>

                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-label one-words-difference-margin">家庭精神病史</label>
                    <label class="label-content">{{reservation.psychiatricHistory?'是':reservation.psychiatricHistory==false?'否':''}}</label>
                  </div>
                  <div class="form-group">
                    <label class="form-label one-words-difference-margin">是否服用药物</label>
                    <label class="label-content">{{reservation.takeMedicine?'是':reservation.takeMedicine == false?'否':''}}</label>
                  </div>
                  <div class="form-group">
                    <label class="form-label">是否有咨询记录</label>
                    <label class="label-content">{{reservation.hasConsultingExperience?'是':reservation.hasConsultingExperience==false?'否':''}}</label>
                  </div>
                    <div class="form-group" v-if="reservation.hasConsultingExperience == '是'">
                    <label class="form-label three-words-difference-margin">咨询时间</label>
                    <label class="label-content">{{reservation.consultingDate}}</label>
                  </div>
                  <div class="form-group" v-if="reservation.hasConsultingExperience == '是'">
                    <label class="form-label three-words-difference-margin">咨询地点</label>
                    <label class="label-content">{{reservation.consultingAddress}}</label>
                  </div>
                  <div class="form-group" v-if="reservation.hasConsultingExperience == '是'">
                    <label class="form-label three-words-difference-margin">咨询主题</label>
                    <label class="label-content">{{reservation.student.consultingMainContent}}</label>
                  </div>
                </div>
              </div>
            </div>
             </el-tab-pane>
             <el-tab-pane label="本次咨询记录" name="three">
            <div class="columns">
              <label class="columns-title">本次咨询记录</label>
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-label">咨询时间</label>
                    <label class="label-content">{{reservation.dayTime.dateTime}}</label>
                  </div>
                  <div class="form-group">
                    <label class="form-label">咨询师联系方式</label>
                    <label class="label-content">{{reservation.teacher.contact}}</label>
                  </div>
                  <div class="form-group">
                    <label class="form-label two-words-difference-margin" >咨询师姓名</label>
                    <label class="label-content">{{reservation.teacher.name}}</label>
                  </div>
                  <div class="form-group">
                    <label class="form-label" >状态</label>
                    <label class="label-content">{{statusLabel[reservation.status]}}</label>
                  </div>
                </div>
                <div class="col-md-6">
                </div>
              </div>
            </div>
             </el-tab-pane>
             <el-tab-pane label="咨询历史" name="four">
            <div>
              <label class="columns-title">咨询历史</label>
              <v-table
                :url="`/table-data/mentality/reservation/${this.reservation.id}/histories`"
                pagesize="10"
                idField="id"
                :columns="historyTable.columns"
                :paginationShow="false"
                :order="true"
              ></v-table>
            </div>
             </el-tab-pane>
          <!-- </div> -->
          </el-tabs>
        <!-- </GeminiScrollbar> -->
      </div>
      <div slot="modal-footer" class="modal-footer">
        <!-- <button
          type="button"
          class="btn cancel-btn clearBtnBorder"
          :class="{ disabled: exportingToPdf }"
          @click="exportToPdf"
        >{{ exportingToPdf ? '导出中...' : '导出PDF'}}</button> -->
        <el-button type="primary" @click="exportToPdf('order')">导出学生预约信息</el-button>
        <el-button type="primary" v-if="canDownRecord" @click="exportToPdf('record')">导出咨询记录单</el-button>
        <el-button
          @click="showStudentReservation = false;"
        >取消</el-button>
      </div>
      </v-modal>
       <div id="pdfDom" class="second-export" >
        <!-- <div id="pdfDom" class="second-export"> -->
          <iframe width="100%"  height="1188px" :src="pdfSetting.list.length?`/psychic/details?id=${this.pdfSetting.list[this.pdfSetting.index].id}&type=${this.exportType}&history=${orderHistory}`:'/psychic/details?id=undefind'" frameborder="0"></iframe>
          <!-- <iframe width="100%" height="1188px" :src="`/sc/report?userId=353553965901676544&isPdf=true`" frameborder="0"></iframe> -->
        </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { translation, sAjax, createTime } from '../../assets/utils/utils.js'
  import CreserveTable from './components/reserveTable.vue'
  import StudentReservation from './components/studentReservation.vue'
import JSZip from "jszip";
import FileSaver from "file-saver";
  Vue.component('c-reserveTable', CreserveTable)
  export default {
    components: {
      StudentReservation
    },
    inject: {
      windowObj: {
        default: null
      }
    },
    data: function () {
      return {
        familyMembers: [],
        exportType: 'all', //'order/record'
        orderHistory: [],
        pdfSetting: {
          index: 0,
          list: [],
          downloading: false,
          zip: new JSZip(),
          timer: null,
          modalShow: false,
          log: false,
          url: "/api/mentality/reservation/getReservationsInfoId",
        },
        historyTable: {
        columns: [
          {
            id: "createTime",
            title: "咨询时间",
            className: "text-left",
            width: 170,
            hidden: false,
            formatter: record => {
              return record.dayTime && record.dayTime.dateTime
                ? record.dayTime.dateTime +
                    " " +
                    record.dayTime.timeQuantumStart +
                    "-" +
                    record.dayTime.timeQuantumEnd
                : "";
            }
          },
          {
            id: "teacherName",
            title: "咨询师姓名",
            className: "text-left",
            width: 80,
            hidden: false
          },
          {
            id: "contact",
            title: "学生联系方式",
            className: "text-left",
            width: 130,
            hidden: false
          },
          {
            id: "score",
            title: "危机评分",
            className: "text-left",
            width: 80,
            hidden: true
          },
          {
            id: "record",
            title: "咨询记录",
            className: "text-left",
            width: 120,
            hidden: true
          },
          {
            id: "teacherScore",
            title: "学生评分",
            className: "text-left",
            width: 80,
            hidden: false
          },
          {
            id: "status",
            title: "状态",
            className: "text-left",
            hidden: false,
            formatter: record => {
              return this.statusLabel[record.status];
            }
          }
        ]
      },
         statusLabel: {
          SUCCESS: "预约成功",
          CANCELED: "取消预约",
          CANCELED_BY_ADMIN: "后台取消",
          ING: "进行中",
          FINISHED: "已结束",
          DONE: "已完成",
          ABSENT: "未到",
          ABORT: "排班被取消"
        },
        activeName: 'first',
        pyType: 'RESERVATION', //ONLINE  
        isChangeDate: null,
        showEditModal: false,
        showSettingModal: false,
        isAddScheduling: false,
        hideToStu:false,//编辑排班是否对学生隐藏排班标识
        addhideToStu:false,//新增排班是否对学生隐藏排班标识
        weekTime: {},
        schoolData: [],
        selectCampus: '',
        schedulingType: 'RESERVATION',
        isShowSchedulingType: false,
        isUpdateNext: false,
        consultantArr: [],
        settingData: {
          schedulingId: '',
          startTime: '',
          endTime: '',
          timeList: [{
            timeId: 'timeId',
            timeQuantumStart: '',
            timeQuantumEnd: ''
          }]
        },
        schedulingSettingType: 'add',
        schedulingTypeData: [{ value: 'RESERVATION', label: '预约' }, { value: 'ARRANGE_TALKS', label: '首次访谈' }],
        consultantId: '',
        schedulingData: [],
        selectedTabelCells: [],
        tableData: [],
        timeQuantumArray: [],
        consultantInfoArr: [],
        dataTimeId: '',
        changeDate: '',
        scrollHeight: '',
        newSettingData: [],
        isShowSearch: true,
        userIdAndUserName: '',
        lang: 'zh-cn',
        reservedPeopleVisible: false,
        showStudentReservation: false,
        reservation: null,
        schedule: null
      }
    },
    computed: {
      translate: function () {
        return translation(this.lang).employmentUnitManage
      }
    },
    watch: {
      selectCampus: {
        deep: true,
        handler: function () {
          this._initTableData(this.weekTime)
        }
      },
      schedulingType: {
        deep: true,
        handler: function () {
          this._initTableData(this.weekTime)
        }
      },
      windowObj: {
        deep:true,
        handler: function () {
          var pageContentHeight = $(".add-scheduling-page").height()
          this.scrollHeight = pageContentHeight - $(".addScheduling-header").height()
        }
      }
    },
    created: function () {
      var la = localStorage.getItem('lang')
      if (translation(la)) {
        this.lang = la
      }
      sAjax({
        url: '/api/system/dicts',
        dataType: 'json',
        type: 'get',
        data: {
          dictType: '校区'
        },
        success: (data) => {
          if (data.state) {
            this.schoolData = data.data
            this.selectCampus = data.data[0].value
          } else {
            this.$toast(data.message)
          }
        }
      })
      sAjax({
      url: "/api/system/dicts",
      dataType: "json",
      type: "get",
      data: {
        dictType: "家庭成员类型"
      },
      success: data => {
        if (data.state) {
          this.familyMembers = data.data;
        } else {
          this.$toast(data.message);
        }
      }
    });
      sAjax({
        url: '/api/mentality/config',
        dataType: 'json',
        type: 'get',
        success: (data) => {
          if (data.state) {
            if (data.data) {
              this.isShowSchedulingType = data.data.interviewFirst
            }
          } else {
            this.$toast(data.message)
          }
        }
      })

      this._getWeekTime()

    },
    methods: {
      _downloadPdf: function() {
        if (this.pdfSetting.downloading) {
          this.pdfSetting.title = this.pdfSetting.index+1 + '.' + this.pdfSetting.list[this.pdfSetting.index].studentName
          console.log(this.pdfSetting.title)
          this.getPdf(this.pdfSetting.title, data => {
            // this.preview = false;
            this.pdfSetting.modalShow = false;
            if(this.pdfSetting.list.length-1 == this.pdfSetting.index) {
              // console.log(123)
              this.pdfSetting.downloading = false
              // this._nextTask();
              //  return false
            }
            this.pdfSetting.index++;
            this.pdfSetting.zip.file(this.pdfSetting.title + ".pdf", data, {
              binary: true
            });
            // console.log(this.pdfSetting.list[this.pdfSetting.index].id)
            this._nextTask(this.pdfSetting.list[this.pdfSetting.index]?this.pdfSetting.list[this.pdfSetting.index].id:'');
            this.$toast(
              `打包中...(${this.pdfSetting.index}/${this.pdfSetting.list.length})\nPDF文件较大，导出速度慢`
            );
          });
        }
      },
    _nextTask: function(instanceId) {
        // console.log(instanceId)
        this.pdfSetting.timer = setTimeout(() => {
          if (!instanceId) {
            // 归位导出参数
            clearTimeout(this.pdfSetting.timer);
            this.pdfSetting.downloading = false;
            this.pdfSetting.log = false;
            this.pdfSetting.list = [];
            this.pdfSetting.index = 0;
            this.pdfSetting.modalShow = false;

            this.pdfSetting.zip.generateAsync({ type: "blob" }).then(content => {
              // 生成二进制流
              var d = new Date();
              FileSaver.saveAs(
                content,
                '心理预约' +
                  d.getFullYear() +
                  "-" +
                  (d.getMonth() + 1) +
                  "-" +
                  d.getDate()
              ); // 利用file-saver保存文件
              this.$toast("打包成功，开始下载...");
            });
          } else {
            if (!this.pdfSetting.modalShow) {
              // 当表单已经关闭的时候说明已经执行完导出了
              this.pdfSetting.modalShow = true
              this._downloadPdf()
              // this._initPreview({
              //   id: instanceId,
              //   businessId: this.curBusinessId
              // });
            }
          }
        }, 500);
      },
      exportToPdf(type) {
      this.exportType = type
      this.pdfSetting.list = [{id:this.reservation.id,studentName: this.reservation.student.name}]
      this.pdfSetting.downloading = true
      if(type == 'order') {  //导出预约信息需要带历史记录
        let url = "/api/mentality/reservation/" +
                  this.reservation.id +
                  "/histories";
        sAjax({
          url: url,
          type: 'get',
          success: (data) => {
            if(data.state) {
              this.orderHistory = data.data.content
              console.log(this.orderHistory)
              this.showStudentInfoModal = false
               this.getPdf(this.reservation.student.name + '预约详情' + new Date().format('yyyy-MM-dd'));
            }
           
          }
        })
      }else {
        setTimeout(() => {
          this.showStudentInfoModal = false
          this.getPdf(this.reservation.student.name + '预约详情' + new Date().format('yyyy-MM-dd'));
        },100)
        
      }
    },
      switchType(v) {
      // this.$refs.reservaTable.setDate(new Date)
       if(v == 'ONLINE') {
        this.selectCampus = ''
       }else {
         this.selectCampus = this.schoolData[0].value
       }
      },
      _back: function () {
        this.addhideToStu = false
        this.isAddScheduling = false
      },
      _selectCampus: function (opt) {
        this.selectCampus = opt.value
      },
      // _selectSchedulingType: function (opt) {
      //   this.schedulingType = opt.value
      // },
      changeUserSearch: function () {
        this.isShowSearch = true
        this.consultantId = ''
        this.userIdAndUserName = ''
      },
      addScheduling: function () {
        this.isShowSearch = true
        this.userIdAndUserName = ''
        this.consultantId = ''
        this.selectedTabelCells = []
        this.isChangeDate = this.weekTime.dateStart
        // this.schedulingData = []
        // sAjax({
        //   url: '/api/mentality/teachers/schedulingTeacher/setting?type=RESERVATION&campus=' + this.selectCampus+'&startDate=' + this.weekTime.dateStart+'&endDate='+this.weekTime.dateEnd,
        //   dataType: 'json',
        //   type: 'get',
        //   success: (data) => {
        //     if (data.state) {
        //       if (data.data) {
        //         // this.schedulingData = []
        //         this.newSettingData = data.data
               
        //       }
        //     } else {
        //       this.$toast(data.message)
        //     }
        //   }
        // })
        sAjax({
          url: '/api/mentality/scheduling/timeSetting?type=' + this.schedulingType + '&campus=' + this.selectCampus+'&startDate=' + this.weekTime.dateStart+'&endDate='+this.weekTime.dateEnd,
          dataType: 'json',
          type: 'get',
          success: (data) => {
            if (data.state) {
              if (data.data) {
                this.timeQuantumArray = []
                for (var k in data.data) {
                  var timeQuantum = data.data[k]
                  this.timeQuantumArray.push({
                    id: timeQuantum.id,
                    timeQuantum: timeQuantum.timeQuantumStart + '-' + timeQuantum.timeQuantumEnd
                  })
                }
                 this.isAddScheduling = true
              }
            } else {
              this.$toast(data.message)
            }
          }
        })
        setTimeout(() => {
          var pageContentHeight = $(".add-scheduling-page").height()
          this.scrollHeight = pageContentHeight - $(".addScheduling-header").height()
        }, 100)
      },
      _selectTabelCell: function (data) {
        this.selectedTabelCells = data
      },
      _editConsultant: function (data) {
        this.showEditModal = true
        this.isUpdateNext = false
        this.hideToStu = data.data.dayTimeTeacher[0]?!data.data.dayTimeTeacher[0].isVisual:false
        var consultantInfo = JSON.parse(JSON.stringify(data.data.dayTimeTeacher))
        this.consultantArr = []
        this.dataTimeId = data.data.id
        this.changeDate = data.data.dateTime
        consultantInfo.forEach((ele, index) => {
          this.consultantArr.push({
            userId: ele.user.teacherBaseInfo.userId,
            name: ele.user.teacherBaseInfo.name,
          })
        })
      },
      showReservation(data) {
        if (!data || !data.studentUserId) {
          return;
        }
        this.showWaiting()
        this.schedule = data
        this.showStudentReservation = true
        sAjax({
          url: '/api/mentality/reservation/schedules/' + data.id,
          dataType: 'json',
          type: 'get',
          success: (data) => {
            this.closeWaiting()
            if (data.state) {
              this.reservation = data.data
              var text = "";
              for (var i in this.reservation.familyMembers) {
                  for (var j in this.familyMembers) {
                    if (
                      this.reservation.familyMembers[i] === this.familyMembers[j].value
                    ) {
                      text += this.familyMembers[j].label + ",";
                    }
                  }
                }
              this.reservation.familyMembers = text.substr(0, text.length - 1)
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      _getWeekTime: function (data) {
        if (data) {
          console.log(data)
          this.weekTime = data
          if (this.selectCampus || this.schedulingType == 'ONLINE') {
            this._initTableData(data)
          }
        }
      },
      _initTableData: function (data) {

        sAjax({
          url: '/api/mentality/scheduling/page/week/users?campus=' + this.selectCampus + '&type=' + this.schedulingType + '&dateStart=' + data.dateStart + '&dateEnd=' + data.dateEnd,
          dataType: 'json',
          type: 'get',
          success: (data) => {
            if (data.state) {
              if (data.data && data.data.length > 0) {
                this.schedulingData = data.data
              } else {
                this.schedulingData = []
              }
            } else {
              this.$toast(data.message)
            }
          }
        })
        sAjax({
          url: '/api/mentality/scheduling/timeSettings/thisWeek?type=' + this.schedulingType + '&campus=' + this.selectCampus + '&dateStart=' + data.dateStart + '&dateEnd=' + data.dateEnd,
          dataType: 'json',
          type: 'get',
          success: (data) => {
            if (data.state) {
              if (data.data && data.data.length > 0) {
                this.timeQuantumArray = []
                for (var k in data.data) {
                  var timeQuantum = data.data[k]
                  this.timeQuantumArray.push({
                    id: timeQuantum.id,
                    timeQuantum: timeQuantum.timeQuantumStart + '-' + timeQuantum.timeQuantumEnd
                  })
                }
              } else {
                this.timeQuantumArray = []
              }
            } else {
              this.$toast(data.message)
            }
          }
        })

      },
      submitAddScheduling: function () {
        var scheingTimeTeacherVO  = {
           campus: this.selectCampus,
            type: this.schedulingType,
            userId: this.consultantId,
             isVisual :!this.addhideToStu,
        }
        var idList = []
        if (this.selectedTabelCells.length === 0) {
          return this.$toast('请选择时间段')
        }
        if (!this.consultantId) {
          return this.$toast('请先检索咨询师')
        }
        this.selectedTabelCells.forEach((ele, index) => {
          idList.push(ele.data.id)
          // dayTimeTeacher.push({
          //   timeSetting: {
          //     id: ele.timeSettingId
          //   }
          // })
        })
        scheingTimeTeacherVO.dayTimeIds = idList
        sAjax({
          url: '/api/mentality/scheduling/teachers',
          dataType: 'json',
          type: 'post',
          data: scheingTimeTeacherVO,
          success: (data) => {
            if (data.state) {
              this.$toast('新增成功')
              this.isAddScheduling = false
              this.addhideToStu = false
              this._getWeekTime(this.weekTime)
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      selectScheduling: function () {
        this.isUpdateNext = !this.isUpdateNext
      },
      sumbitEditConsultant: function () {
        var dayTimeTeachers = []
        this.consultantArr.forEach((ele, index) => {
          dayTimeTeachers.push({
            user: {
              teacherBaseInfo: {
                userId: ele.userId
              }
            }
          })
        })
        sAjax({
          url: '/api/mentality/scheduling/dayTimeTeachers',
          dataType: 'json',
          type: 'post',
          data: {
            dataTimeId: this.dataTimeId,
            isUpdateNext: this.isUpdateNext,
            changeDate: this.changeDate,
            dayTimeTeachers: dayTimeTeachers,
            isVisual :!this.hideToStu,
          },
          success: (data) => {
            if (data.state) {
              this.$toast('编辑成功')
              this._initTableData(this.weekTime)
              this.showEditModal = false
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      deleteConsultant: function (data) {
        this.consultantArr.forEach((ele, index) => {
          if (ele.userId === data.userId) {
            this.consultantArr.splice(index, 1)
          }
        })
      },
      reservedPeopleVisibilityChange(visibility) {
        this.reservedPeopleVisible = visibility;
      },
      _showSettingModal: function () {
        this.settingData = {
          schedulingId: '',
          startTime: '',
          endTime: '',
          timeList: [{
            timeId: 'timeId',
            timeQuantumStart: '',
            timeQuantumEnd: ''
          }]
        }
        sAjax({
          url: '/api/mentality/scheduling?campus=' + this.selectCampus + '&type=' + this.schedulingType,
          dataType: 'json',
          type: 'get',
          success: (data) => {
            if (data.state) {
              if (data.data) {
                this.schedulingSettingType = 'edit'
                this.settingData = {
                  schedulingId: data.data.id,
                  startTime: data.data.startTime,
                  endTime: data.data.endTime,
                  timeList: []
                }
                data.data.timeSetting.forEach((ele, i) => {
                  if (i === 0) {
                    this.settingData.timeList.push({
                      id: ele.id,
                      timeId: 'timeId',
                      timeQuantumStart: ele.timeQuantumStart,
                      timeQuantumEnd: ele.timeQuantumEnd
                    })
                  } else {
                    this.settingData.timeList.push({
                      id: ele.id,
                      timeId: 'time_' + ele.id,
                      timeQuantumStart: ele.timeQuantumStart,
                      timeQuantumEnd: ele.timeQuantumEnd
                    })
                  }

                })
              } else {
                this.schedulingSettingType = 'add'
              }
            } else {
              this.$toast(data.message)
            }
          }
        })
        this.showSettingModal = true

      },
      _deleteTime: function (data) {
        this.settingData.timeList.forEach((ele, index) => {
          if (data.timeId === ele.timeId) {
            this.settingData.timeList.splice(index, 1)
          }
        })
      },
      _addTime: function () {
        this.settingData.timeList.push({
          timeId: 'time_' + createTime(),
          timeQuantumStart: '',
          timeQuantumEnd: ''
        })
      },
      startTimeSelected: function (data) {
        if (this.settingData.endTime) {
          var timeString = new Date(data.value).getTime() - new Date(this.settingData.endTime).getTime()
          if (timeString > 0) {
            this.$nextTick(() => {
              this.$toast('排班开始日期要在排班结束日期之前')
              this.settingData.startTime = ''
            })
            return false
          } else {
            this.settingData.startTime = data.value
          }
        } else {
          this.settingData.startTime = data.value
        }
      },
      endTimeSelected: function (data) {
        if (this.settingData.startTime) {
          var timeString = new Date(data.value).getTime() - new Date(this.settingData.startTime).getTime()
          if (timeString < 0) {
            this.$nextTick(() => {
              this.$toast('排班结束日期要在排班开始日期之后')
              this.settingData.endTime = ''
            })
            return false
          } else {
            this.settingData.endTime = data.value
          }
        } else {
          this.settingData.endTime = data.value
        }
      },
      sumbitSetting: function () {
        if(!this.settingData.startTime ||!this.settingData.endTime) return this.$toast('请选择排班日期')
        const timeList = this.settingData.timeList
        let timeRequired = true
        for(let i = 0;i< timeList.length;i++) {
          let {timeQuantumStart, timeQuantumEnd} = timeList[i]
          if(!timeQuantumStart || !timeQuantumEnd) {
            timeRequired = false
            return this.$toast('请输入开始时间和结束时间')
          }
        }
        if(!timeRequired) return false
        this.settingData.startTime = /\d{4}-\d{1,2}-\d{1,2}/g.exec(this.settingData.startTime)[0]
        this.settingData.endTime = /\d{4}-\d{1,2}-\d{1,2}/g.exec(this.settingData.endTime)[0]
        var methodsType = ''
        var parameterData = {}
        var url = ''
        if (this.schedulingSettingType === 'add') {
          methodsType = 'post'
          url = '/api/mentality/scheduling'
          parameterData = {
            startTime: this.settingData.startTime,
            endTime: this.settingData.endTime,
            campus: this.selectCampus,
            type: this.schedulingType,
            timeSetting: this.settingData.timeList
          }

        } else {
          methodsType = 'post'
          url = '/api/mentality/scheduling/update'
          parameterData = {
            id: this.settingData.schedulingId,
            startTime: this.settingData.startTime,
            endTime: this.settingData.endTime,
            campus: this.selectCampus,
            type: this.schedulingType,
            timeSetting: this.settingData.timeList
          }

        }
        sAjax({
          url: url,
          dataType: 'json',
          type: methodsType,
          data: parameterData,
          success: (data) => {
            if (data.state) {
              this.$toast('设置成功')
              this._getWeekTime(this.weekTime)
              this.showSettingModal = false
            } else {
              this.$toast(data.message)
            }
          }
        })
      },
      addSchedulingAfterSelected: function (data) {
        this.consultantId = data.userId
        this.userIdAndUserName = data.name + ' (' + data.userNo + ')'
        this.isShowSearch = false
      },
      editConsultantAfterSelected: function (data) {
        var isAdd = true
        this.consultantArr.forEach((ele, index) => {
          if (data.userId === ele.userId) {
            this.$toast('该咨询师已在列表上')
            isAdd = false
            return
          }
        })
        if (isAdd) {
          this.consultantArr.push({
            name: data.name,
            userId: data.userId
          })
        }
      },
      checkTimeQuantumStart: function (timeQuantumStart, index) {
        var pattern = /^([01]\d|2[0123]):([0-5]\d|59)$/
        if (!pattern.test(timeQuantumStart)) {
          this.$toast('开始时间格式不对')
          this.settingData.timeList.forEach((ele, i) => {
            if (index === i) {
              ele.timeQuantumStart = ''
            }
          })
          return
        }
      },
      checkTimeQuantumEnd: function (timeQuantumEnd, index) {
        var pattern = /^([01]\d|2[0123]):([0-5]\d|59)$/
        if (!pattern.test(timeQuantumEnd)) {
          this.$toast('结束时间格式不对')
          this.settingData.timeList.forEach((ele, i) => {
            if (index === i) {
              ele.timeQuantumEnd = ''
            }
          })
          return
        }
      }
    }
  }
</script>
<style lang="less">
@import url("../../assets/common.less");
#schedulingManage {
  height: 100%;
  margin: 24px auto;
  padding: 0;
  background: #fff;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
  font-family: PingFangSC-Medium;
  .maticon{
    cursor:pointer;
  }
  .scheduling-manage {
    padding: 24px 85px;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .add-scheduling-page {
    height: 100%;
  }
  .campus-select {
    display: inline-block;
    margin-left: 15px;
    .select-radio {
      padding: 5px 10px 3px;
    }
    .info-options {
      display: inline-block;
      span {
        display: inline-block !important;
        margin-left: 6px;
        font-size: 13px;
        color: rgba(0,0,0,0.87);
        letter-spacing: 0.6px;
        text-align: left;
        line-height: 24px;
        cursor: pointer;
        margin-bottom: 1px;
        i {
          float: left;
          margin-right: 2px;
          font-size: 18px;
          color: #d9d9d9;
          margin-top: 2px;
          &.active {
            color: #298df7;
          }
        }
      }
    }
    .radio-text {
      font-size: 15px;
      color: #494747;
      line-height: 16px;
      padding-right: 7px;
      border-right: 1px solid #ececec;
    }
    .radio-area {
      display: inline-block;
      div {
        display: inline-block;
        margin-left: 9px;
        cursor: pointer;
        .campus-name {
          font-size: 13px;
          color: rgba(0, 0, 0, 0.87);
        }
      }
    }
  }
  .body-slot {
    background: #f6f8f8;
    height: 50px;
    .time-tips {
      font-size: 15px;
      color: #3e3e3e;
      margin: 15px 10px 0 16px;
      display: inline-block;
    }
    .show-schedule-color,
    .hide-schedule-color,
    .reserved-color,
    .no-reserved-color {
      width: 20px;
      height: 20px;
      display: inline-block;
      vertical-align: bottom;
      margin-left: 9px;
    }
    .show-schedule-name,
    .hide-schedule-name {
      font-size: 15px;
      color: #3e3e3e;
    }
    .show-schedule-color {
      background: #303133;
    }
    .hide-schedule-color {
      background: #909399;
    }
    .reserved-color {
      background: #ECF7FF;
      border: 1px solid #C0C4CC;
    }
    .no-reserved-color {
      background: white;
      border: 1px solid #C0C4CC;
    }
    .btn-group {
      color: #298df7;
      margin-right: 5px;
      button {
        font-size: 15px;
        background: transparent;
        margin-top: 8px;
        .add-icon {
          font-size: 18px;
        }
      }
    }
  }
  .addScheduling-header {
    height: 87px;
    border-bottom: 1px solid #d9d9d9;
    .addScheduling-back {
      cursor: pointer;
      margin-top: 30px;
      margin-left: 53px;
      .back-title {
        display: inline-block;
        font-size: 16px;
        margin-top: 1px;
        margin-left: 16px;
      }
    }
    .search-user {
      float: left;
      margin-left: 50px;
      margin-top: 22px;
      input {
        width: 773px;
      }
      .user-info {
        display: inline-block;
        margin-top: 10px;
      }
      i {
        margin-top: 8px;
        font-size: 20px;
        margin-left: 10px;
        cursor: pointer;
      }
    }
  }
  .addScheduling-content {
    padding: 48px 60px;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    .tips {
      margin-top: 15px;
      color: #f06c6c;
      font-size: 14px;
    }
  }
  .psychological-footer {
    margin-top: 26px;
    margin-bottom: 10px;
    text-align: center;
  }
  .modal-search-user {
    margin-left: 27px;
  }
  .modal-body {
    .consultant-name-list {
      padding: 16px 27px;
      .consultant-name {
        border: 1px solid #d9d9d9;
        border-radius: 3px;
        font-size: 15px;
        color: #333333;
        display: inline-block;
        position: relative;
        padding: 6px 16px;
        margin-right: 12px;
        margin-bottom: 10px;
        cursor: pointer;
        i {
          font-size: 11px;
          color: #9a9a9a;
          position: absolute;
          right: 0;
        }
      }
    }
    .modify-scheduling-options {
      display: inline-block;
      margin-left: 27px;
      i {
        font-size: 22px;
        color: #d9d9d9;
        transition: all 0.3s ease;
        cursor: pointer;
        &.active {
          color: #298df7;
        }
      }
      .icon-title {
        font-size: 14px;
        color: #333333;
        display: inline-block;
        margin-top: 2px;
        vertical-align: top;
      }
    }
  }
  .setting-modal-body {
    padding: 29px 0;
    max-height: 500px;
    overflow-x: hidden;
    overflow-y: auto;
    .form-list {
      .star {
        color: red;
      }
      .time-picker {
        width: 200px;
        display: inline-block;
        margin-left: 9px;
        .form-control.v-datepicker-input {
          border: 1px solid #d9d9d9;
          border-radius: 3px;
        }
        .v-datepicker-icon {
          margin-right: 10px;
        }
      }
      .form-input {
        border: 1px solid #d9d9d9;
        border-radius: 3px;
        width: 200px;
        font-size: 14px;
        display: inline-block;
        margin-left: 9px;
        &:focus {
          box-shadow: none;
          outline: none;
        }
      }
      .marginLeft45px {
        margin-left: 45px;
        margin-bottom: 22px;
      }
      .marginLeft75px {
        margin-left: 75px;
        margin-bottom: 22px;
      }
      .time-list {
        padding-top: 16px;
        border-top: 1px solid #e0e0e0;
        position: relative;
        .delete-btn {
          position: absolute;
          right: 16px;
          top: 21px;
          font-size: 14px;
          color: #298df7;
          cursor: pointer;
        }
      }
      .add-time-btn {
        margin-left: 151px;
        button {
          i {
            font-size: 15px;
          }
        }
      }
    }
    .tips {
      margin-top: 26px;
      margin-left: 16px;
      color: #f06c6c;
      font-size: 14px;
    }
  }
}
</style>
