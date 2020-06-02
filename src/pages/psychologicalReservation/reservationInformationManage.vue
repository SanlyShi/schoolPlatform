<template>
  <div id="reservation-info-manage" class="container-fluid">
    <div class="row text-center" v-if="curRouter === 'manage'">
      <v-table
        :url="manageTableUrl"
        pagesize="10"
        idField="id"
        :columns="columns"
        :multiple="false"
        :order="true"
        :search="false"
        ref="manageTab"
      >
        <div slot="btn-group" role="group">
          <div class="btn-group pull-right">
            <button
              type="button"
              class="btn add clearBtnBorder"
              @click="addReservationPersonnel"
            >新增预约人员</button>
            <button type="button" class="btn add clearBtnBorder" @click="_export">导出</button>
          </div>
        </div>
      </v-table>
    </div>
    <div class="add-reservation-personnel" v-else>
      <div class="addPersonnel-header">
        <div class="addPersonnel-back pull-left" @click="_back">
          <i
            class="maticon back-icon-btn pull-left"
            v-html="icons('navigate_before')"
          >navigate_before</i>
          <div class="back-title">新增预约人员</div>
        </div>
      </div>
      <div class="addPersonnel-content" :style="'max-height:' + scrollHeight + 'px'">
        <div class="modal-search-user">
          <label class="search-user-label one-words-difference-margin">学生</label>
          <detect
            url="/api/document/students/searchResults"
            placeholder="学生姓名或学工号"
            @afterSelected="studentSelected"
            v-if="isShowSearch.student"
          ></detect>
          <div class="userId-and-userName" v-else>
            <div class="user-info pull-left">{{userIdAndUserName.student}}</div>
            <i class="maticon pull-right" v-html="icons('edit')" @click="changeStudentSearch">edit</i>
          </div>
        </div>
        <div class="modal-search-user">
          <label class="search-user-label">咨询师</label>
          <detect
            url="/api/mentality/teachers/searchResults"
            placeholder="咨询师姓名或学工号"
            @afterSelected="consultantSelected"
            v-if="isShowSearch.consultant"
          ></detect>
          <div class="userId-and-userName" v-else>
            <div class="user-info pull-left">{{userIdAndUserName.consultant}}</div>
            <i
              class="maticon pull-right"
              v-html="icons('edit')"
              @click="changeConsultantSearch"
            >edit</i>
          </div>
        </div>
        <c-reserveTable
          :isShowDateOfDay="true"
          :tableData="schedulingData"
          tableType="add"
          data-type="addPersonnel"
          @getWeekTime="_getWeekTime"
          :timeQuantumArray="timeQuantumArray"
          :consultantId="addPersonnel.consultantId"
          :studentId="addPersonnel.studentId"
          @selectTabelCell="_selectTabelCell"
        >
          <div slot="header-select" class="campus-select">
            <div class="select-radio" v-if="schoolData.length > 0">
               <el-radio v-model='schedulingType' label="RESERVATION">线下咨询</el-radio>
              <!-- <label class="radio-text">校区</label> -->
              <span></span>
              <div class="radio-area"  v-show="schedulingType == 'RESERVATION'">
                <div v-for="(col,k) in schoolData" :key="k">
                  <input type="radio" id="col.id" :value="col.value" v-model="selectCampus">
                  <label class="campus-name" for="col.id">{{col.label}}</label>
                </div>
              </div>
            </div>
            <div class="select-radio">
              <el-radio  style="display: block;" v-model='schedulingType' label="ONLINE">网上咨询</el-radio>
            </div>
            <!-- <div class="select-radio" style="margin-left: 19px" v-if="isShowSchedulingType">
              <label class="radio-text">排班类型</label>
              <span></span>
              <div class="radio-area">
                <div v-for="(col,k) in schedulingTypeData" :key="k">
                  <input type="radio" id="col.id" :value="col.id" v-model="schedulingType">
                  <label class="campus-name" for="col.id">{{col.label}}</label>
                </div>
              </div>
            </div> -->
          </div>
          <div slot="body-slot" class="body-slot">
            <div class="pull-left">
              <span
                class="time-tips"
              >{{weekTime&&weekTime.weekStartTime}}-{{weekTime&&weekTime.weekEndTime}} 排班表</span>
            </div>
          </div>
        </c-reserveTable>
      </div>
      <div class="psychological-footer">
        <div class="btn-group">
          <button type="button" class="btn sumbit-btn clearBtnBorder" @click="submitPersonnel">提交</button>
        </div>
      </div>
    </div>
    <v-modal :show="showStudentInfoModal" effect="fade" width="1000">
      <div slot="modal-header" class="modal-header">
        <div class="modal-title student-info-title">查看学生信息</div>
      </div>
      <div slot="modal-body" class="modal-body">
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
                    <label class="label-content">{{studentInfoData.name}}</label>
                  </div>
                  <div class="form-group">
                    <label class="form-label">学号</label>
                    <label class="label-content">{{studentInfoData.userNo}}</label>
                  </div>
                  <div class="form-group">
                    <label class="form-label">年级</label>
                    <label class="label-content">{{studentInfoData.grade}}</label>
                  </div>
                  <div class="form-group">
                    <label class="form-label">学院</label>
                    <label class="label-content">{{studentInfoData.collegeName}}</label>
                  </div>
                  <div class="form-group">
                    <label class="form-label">邮箱</label>
                    <label class="label-content">{{studentInfoData.email}}</label>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-label">班级</label>
                    <label class="label-content">{{studentInfoData.className}}</label>
                  </div>
                  <div class="form-group">
                    <label class="form-label">培养层次</label>
                    <label class="label-content">{{studentInfoData.educationLevelLabel}}</label>
                  </div>
                  <div class="form-group">
                    <label class="form-label">政治面貌</label>
                    <label class="label-content">{{studentInfoData.politicalStatusLabel}}</label>
                  </div>
                  <div class="form-group">
                    <label class="form-label">性别</label>
                    <label class="label-content">{{studentInfoData.sexLabel}}</label>
                  </div>
                  <div class="form-group" >
                    <label class="form-label">联系方式</label>
                    <label class="label-content">{{studentInfoData.contact}}</label>
                  </div>
                  <!-- <div class="form-group" >
                    <label class="form-label">联系方式</label>
                   
                      <input type="text" class="label-content" :class="formatError.contact?'error':''" v-model="studentInfoData.contact" @change="checkAndUpdateContact">
               
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
                    <label class="label-content">{{studentInfoData.familyMembers}}</label>
                  </div>
                  <div class="form-group">
                    <label class="form-label">父母婚姻情况</label>
                    <label class="label-content">{{studentInfoData.parentsMarriageSituation}}</label>
                  </div>
                  <div class="form-group">
                    <label class="form-label">本次咨询内容</label>
                    <label class="label-content">{{studentInfoData.content}}</label>
                  </div>
                  <div class="form-group">
                    <label class="form-label">本次咨询备注</label>
                    <label class="label-content">{{studentInfoData.remark}}</label>
                  </div>

                  <div class="form-group">
                    <label class="form-label">是否有精神科就医经历</label>
                    <label class="label-content">{{studentInfoData.hasPsychiatricHistory}}</label>
                  </div>
                  <div class="form-group" v-if="studentInfoData.hasPsychiatricHistory == '是'">
                    <label class="form-label">医院</label>
                    <label class="label-content">{{studentInfoData.hospital}}</label>
                  </div>
                  <div class="form-group" v-if="studentInfoData.hasPsychiatricHistory == '是'">
                    <label class="form-label">医生姓名</label>
                    <label class="label-content">{{studentInfoData.doctor}}</label>
                  </div>
                  <div class="form-group" v-if="studentInfoData.hasPsychiatricHistory == '是'">
                    <label class="form-label">服用药物</label>
                    <label class="label-content">{{studentInfoData.drug}}</label>
                  </div>

                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-label one-words-difference-margin">家庭精神病史</label>
                    <label class="label-content">{{studentInfoData.psychiatricHistory}}</label>
                  </div>
                  <div class="form-group">
                    <label class="form-label one-words-difference-margin">是否服用药物</label>
                    <label class="label-content">{{studentInfoData.takeMedicine}}</label>
                  </div>
                  <div class="form-group">
                    <label class="form-label">是否有咨询记录</label>
                    <label class="label-content">{{studentInfoData.hasConsultingExperience}}</label>
                  </div>
                    <div class="form-group" v-if="studentInfoData.hasConsultingExperience == '是'">
                    <label class="form-label three-words-difference-margin">咨询时间</label>
                    <label class="label-content">{{studentInfoData.consultingDate}}</label>
                  </div>
                  <div class="form-group" v-if="studentInfoData.hasConsultingExperience == '是'">
                    <label class="form-label three-words-difference-margin">咨询地点</label>
                    <label class="label-content">{{studentInfoData.consultingAddress}}</label>
                  </div>
                  <div class="form-group" v-if="studentInfoData.hasConsultingExperience == '是'">
                    <label class="form-label three-words-difference-margin">咨询主题</label>
                    <label class="label-content">{{studentInfoData.consultingMainContent}}</label>
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
                    <label class="label-content">{{infoData.dayTime.dateTime}}</label>
                  </div>
                  <div class="form-group">
                    <label class="form-label">咨询师联系方式</label>
                    <label class="label-content">{{infoData.teacher.contact}}</label>
                  </div>
                  <div class="form-group">
                    <label class="form-label" >咨询师姓名</label>
                    <label class="label-content">{{infoData.teacher.name}}</label>
                  </div>
                  <div class="form-group">
                    <label class="form-label" >状态</label>
                    <label class="label-content">{{statusLabel[infoData.status]}}</label>
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
                :url="recordUrl"
                pagesize="10"
                idField="id"
                :columns="recordColumns"
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
          @click="showStudentInfoModal = false;"
        >取消</el-button>
      </div>
    </v-modal>
    <!-- //编辑或查看咨询记录 -->
    <v-modal :show="showEvaluationModal" effect="fade"  width="1000">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">{{checkOrEdit=='check'?'查看':'编辑'}}</h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <h1 style="text-align: right;margin: 0;" v-if="checkOrEdit == 'check'"><el-button @click="checkLog">日志</el-button></h1>
        <div class="logs" v-show="showLog">
           <el-timeline>
             <el-timeline-item v-for="(item,index) in logList" :key='index' :timestamp="item.split(' ')[0]" placement="top">
                <el-card>
                  <h4 style="">{{item.split(' ')[0] + '  ' + item.split(' ')[1]}}</h4>
                 <p><span>{{item.split(' ')[2]}}</span> <span v-if="item.split(' ')[3]">{{item.split(' ')[3]}}</span></p>
                </el-card>
             </el-timeline-item>
           </el-timeline>  
        </div>       
        <div class="form-group">
          <el-form v-model="consultModel"  label-width="130px">
            <el-row>
              <el-col :span="6">
                <el-form-item label='姓名：'>
                  <!-- <el-input v-if="checkOrEdit =='edit'" v-model="consultModel.studentName"></el-input> -->
                  <span >{{consultModel.studentName}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label='性别：'>
                  <!-- <el-input v-if="checkOrEdit =='edit'" v-model="consultModel.sex"></el-input> -->
                   <span >{{consultModel.sex}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label='年级：'>
                  <!-- <el-input v-if="checkOrEdit =='edit'" v-model="consultModel.grade"></el-input> -->
                 <span >{{consultModel.grade}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label='次数：'>
                  <!-- <el-input v-if="checkOrEdit =='edit'" v-model="consultModel.count"></el-input> -->
                   <span >{{consultModel.count}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label='咨询时间：'>
                  <!-- <el-input v-if="checkOrEdit =='edit'" v-model="consultModel.consultTime"></el-input> -->
                   <span >{{consultModel.consultTime}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label='咨询师：'>
                  <!-- <el-input  v-if="checkOrEdit =='edit'" v-model="consultModel.consultTeacher"></el-input> -->
                   <span >{{consultModel.consultTeacher}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label='基本状态：'>
                  <el-input  v-if="checkOrEdit =='edit'" v-model="consultModel.baseState"></el-input>
                  <span v-else>{{consultModel.baseState}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label='主诉内容：'>
                  <el-input  v-if="checkOrEdit =='edit'" v-model="consultModel.complaintContent"></el-input>
                  <span v-else>{{consultModel.complaintContent}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label='咨询处理：' class="count">
                  <el-input  v-if="checkOrEdit =='edit'" type="textarea" :disabled="consultModel.handleResult.length >= 500" v-model="consultModel.handleResult" resize='none' rows='4'></el-input>
                  <span  v-if="checkOrEdit =='edit'" class="countLength">{{consultModel.handleResult.length + '/500'}}</span>
                  <span v-else>{{consultModel.handleResult}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label='后续安排及备注：' class="count">
                  <el-input v-if="checkOrEdit =='edit'" type="textarea" :disabled="consultModel.remark.length >= 500" v-model="consultModel.remark" resize='none' rows='4'></el-input>
                  <span v-if="checkOrEdit =='edit'" class="countLength">{{consultModel.remark.length + '/500'}}</span>
                  <span v-else>{{consultModel.remark}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label='整体评估：'>
                   <el-radio-group v-model="consultModel.evaluationType" :disabled='checkOrEdit =="check"'>
                      <el-radio :label="0">一般问题</el-radio>
                      <el-radio :label="1">提醒关注</el-radio>
                      <el-radio :label="2">重点危机（请立刻联系个案管理师）</el-radio>
                   </el-radio-group>
                </el-form-item>
                  
                </el-col>
              </el-row>
              <el-row>
              <el-col :span="20">
                <el-form-item label="咨询师签名：" style="height: 100px;">
                  <img class="canvasImg" v-if="showCanvasImg " :src="'/downloads/storage/images/' + this.canvasUrl + '.png'" alt="">
                  <el-button size="small" style="vertical-align: bottom;margin-left: 10px;" v-if="showCanvasImg&&checkOrEdit == 'edit'" icon="el-icon-delete" type="primary" @click="resetCanvas">重置</el-button>
                  <!-- el-button -->
                  <sign @isdraw='getDraw' height="100" v-if="(!showCanvasImg&&showEvaluationModal) && checkOrEdit == 'edit'" :canvasUrl='this.canvasUrl' ref='mySign' style="text-align: right;"></sign>
                
                
                </el-form-item>
                <el-button size="small"  style="vertical-align: bottom;margin-left: 140px;" v-if="(!showCanvasImg&&showEvaluationModal) && checkOrEdit == 'edit'" icon="el-icon-delete" type="primary" @click="resetCanvas">重置</el-button>
              </el-col>
              <el-col :span="20">
                <el-form-item label="最新修改时间：" >
                  <span v-if="consultModel.newestUpdateTime&&consultModel.newestUpdateTime.length">{{consultModel.newestUpdateTime.join('/')}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <!-- <label class="form-label two-words-difference-margin">危机评分</label> -->
          <!-- <div class="stars-group" v-for="(item, index) in stars" :key="index">
            <span @click="changeStar(item)">
              <i
                class="maticon"
                :class="record.starNumber > 3?'danger-color':'default-color'"
                v-html="icons('star')"
                v-if="item.isSelected"
              >star</i>
              <i class="maticon star-border" v-html="icons('star_border')" v-else>star_border</i>
            </span>
          </div> -->
        </div>
        <!-- <div class="form-group">
          <label class="input-label textarea-label">咨询结果记录</label>
          <textarea
            cols="24"
            rows="5"
            class="modal-textarea"
            maxlength="300"
            v-model="record.resultRecord"
          ></textarea>
        </div> -->
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button
          type="button"
          class="btn cancel-btn clearBtnBorder"
          @click="showEvaluationModal = false;isDraw = false;logList = [];showLog = false;"
        >取消</button>
        <button
        v-if="checkOrEdit=='edit'"
          type="button"
          class="btn submit-btn clearBtnBorder"
          @click="sumbitEditRecordModal"
        >确定</button>
      </div>
    </v-modal>
 
    <v-modal :show="showExport" effect="fade" width="400">
        <div slot="modal-header" class="modal-header">
          <h5 class="modal-title">导出</h5>
        </div>
         <div slot="modal-body" class="modal-body">
           <div class="block"><el-button type="primary" @click="downPdf">导出PDF</el-button></div>
           <div class="block"><el-button type="primary" @click="downExcel">导出EXCEL</el-button></div>
         </div>
         <div slot="modal-footer" class="modal-footer">
        <button
          type="button"
          class="btn cancel-btn clearBtnBorder"
          @click="showExport = false"
        >取消</button>
      
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
import Vue from "vue";
import { translation, sAjax, createTime } from "../../assets/utils/utils.js";
import CreserveTable from "./components/reserveTable.vue";
import starts from "../../mixins/starts.js";
import sign from '../enroll/components/sign.vue'
// import loadpdf from './components/loadPdf'
import JSZip from "jszip";
import FileSaver from "file-saver";
Vue.component("c-reserveTable", CreserveTable);

export default {
  inject: {
    windowObj: {
      default: null
    }
  },
  mixins: [starts],
  components: {
    sign,
  },
  data: function() {
    return {
      // schedulingType: 'RESERVATION',
      showLog: false,
      logList: [],
      canDownRecord: false,
      exportType: 'all', //'order/record'
      // canSeeRecord: false,
      // exportToPdf: [],
      studentIds: [],
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
      isDraw: false,//是否进行过绘制
      showCanvasImg: true,
      checkOrEdit: 'check',//查看状态或者编辑状态
      activeName: 'first',
      canvasUrl: '',
      consultModel: {
        studentName: '',
        sex: '',
        grade: '',
        reservationId: '',
        count: '',
        consultTime: '',//咨询时间
        consultTeacher: '',//咨询师
        baseState: '', //基本状态
        complaintContent: '', //主诉内容
        handleResult: '',//咨询处理结果
        remark: '',
        evaluationType: '',
        signUrl: '',
        newestUpdateTime: '',
      },

      showExport: false,
      infoData:{
        dayTime:{
          dateTime:""
        },
        teacher:{
          contact:""
        },
        teacher:{
          name:""
        },
        score:"",
        record:""

      },
      tableSearch: {
        consultStartTime: '',
        consultEndTime: '',
        reserveStartTime: '',
        reserveEndTime: ''
      },
      manageUrl: "/table-data/mentality/reservation/school",
      recordUrl: "",
      timeStamp: "",
      columns: [],
      recordColumns: [],
      curRouter: "manage",
      modalType: "",
      showStudentInfoModal: false,
      showEvaluationModal: false,
      reason: "",
      addPersonnel: {
        studentId: "",
        consultantId: "",
        reservationData: []
      },
      tableData: [],
      scrollHeight: 0,
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
      studentInfoData: {
        userId:"",
        name: "",
        userNo: "",
        grade: "",
        sex: '',
        sexLabel: '',
        collegeName: "",
        className: "",
        educationLevelLabel: "",
        politicalStatusLabel: "",
        contact: "",
        familyMembers: "",
        psychiatricHistory: "",
        takeMedicine: "",
        parentsMarriageSituation: "",
        remark: "",
        content: "",
        hasConsultingExperience: "",
        email: ""
      },
      familyMembers: [],
      schedulingData: [],
      timeQuantumArray: [],
      selectedTabelCells: [],
      selectCampus: "",
      schedulingType: "RESERVATION",
      isShowSchedulingType: false,
      schedulingTypeData: [
        { id: "RESERVATION", label: "预约" },
        { id: "ARRANGE_TALKS", label: "首次访谈" }
      ],
      statusArray: [
        {
          id: "SUCCESS",
          label: "预约成功"
        },
        {
          id: "CANCELED",
          label: "取消预约"
        },
        {
          id: "CANCELED_BY_ADMIN",
          label: "后台取消"
        },
        {
          id: "ING",
          label: "进行中"
        },
        {
          id: "FINISHED",
          label: "已结束"
        },
        {
          id: "DONE",
          label: "已完成"
        },
        {
          id: "ABSENT",
          label: "未到"
        },
        {
          id: "ABORT",
          label: "排班被取消"
        }
      ],
      userIdAndUserName: {
        student: "",
        consultant: ""
      },
      isShowSearch: {
        student: true,
        consultant: true
      },
      lang: "zh-cn",
      formatError: {
          contact: false
      },
      // exportingToPdf: false
    };
  },
  computed: {
    translate: function() {
      return translation(this.lang).employmentUnitManage;
    },
    manageTableUrl() {
      return `${this.manageUrl}?timeStamp=${this.timeStamp}`
    }
  },
  watch: {
    selectCampus: {
      deep: true,
      handler: function() {
        if (this.weekTime) {
          this._initTableData(this.weekTime);
        }
      }
    },
    schedulingType: {
      deep: true,
      handler: function() {
        if (this.weekTime) {
          this._initTableData(this.weekTime);
        }
      }
    },
    windowObj: {
      deep: true,
      handler: function(val) {
        var pageContentHeight = $(".add-reservation-personnel").height();
        this.scrollHeight =
          pageContentHeight - $(".addPersonnel-header").height();
      }
    }
  },
  created: function() {
    var la = localStorage.getItem("lang");
    if (translation(la)) {
      this.lang = la;
    }
    this._getWeekTime();
    sAjax({
      url: "/api/mentality/config",
      dataType: "json",
      type: "get",
      success: data => {
        if (data.state) {
          if (data.data) {
            this.isShowSchedulingType = data.data.interviewFirst;
          }
        } else {
          this.$toast(data.message);
        }
      }
    });
    sAjax({
      url: "/api/mentality/scheduling/campus",
      dataType: "json",
      type: "get",
      success: data => {
        if (data.state) {
          this.schoolData = data.data;
          if(data.data.length) {
            this.selectCampus = data.data[0].value;
          }
          
        } else {
          this.$toast(data.message);
        }
      }
    });
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

    this.columns = [
      {
        id: "studentName",
        title: "姓名",
        width: 70,
        className: "text-left",
        hidden: false,
        search: {
          type: "input",
          data: {
            placeholer: "",
            autoFocus: true
          }
        },
        formatter: function(record) {
          return record.student ? record.student.name : "";
        }
      },
      {
        id: "studentNo",
        title: "学号",
        width: 120,
        className: "text-left",
        hidden: false,
        search: {
          type: "input",
          data: {
            placeholer: "",
            autoFocus: true
          }
        },
        formatter: function(record) {
          return record.student ? record.student.userNo : "";
        }
      },
      {
        id: 'sex',
        title: '性别',
        width: 50,
        className: 'text-left',
        hidden: false,
        search: {
          type: 'select',
          data: {
            url: '/api/system/dicts?dictType=性别',
            optionsLabel: 'label',
            optionsValue: 'value'
          }
        },
        formatter: function(record) {return record.student && record.student.sexLabel;

        }
      },
      {
        id: "collegeCode",
        title: "学院",
        width: 120,
        className: "text-left",
        hidden: false,
        search: {
          type: "select",
          data: {
            url: `/api/colleges`,
            optionsLabel: "name",
            optionsValue: "code"
          }
        },
        formatter: function(record) {
          return record.student ? record.student.collegeName : "";
        }
      },
      {
        id: "type",
        title: "类型",
        width: 120,
        className: "text-left",
        hidden: false,
        search: {
          type: "select",
          data: {
            options: [{name:'线下咨询',code: 'RESERVATION'},{name:'网上咨询',code: 'ONLINE'}],
            optionsLabel: "name",
            optionsValue: "code"
          }
        },
        formatter: function(record) {
          return record.type
        }
      },
      {
        id: "campus",
        title: "校区",
        width: 80,
        className: "text-left",
        hidden: false,
        search: {
          type: "select",
          data: {
            url: `/api/system/dicts?dictType=校区`,
            optionsLabel: "label",
            optionsValue: "value"
          }
        },
        formatter: function(record) {
          return record.student ? record.student.campusLabel : "";
        }
      },
      {
        id: "contact",
        title: "学生联系方式",
        width: 120,
        className: "text-left",
        hidden: false,
        search: {
          type: "input",
          data: {
            placeholer: "",
            autoFocus: true
          }
        },
        formatter: function(record) {
          return record.student ? record.student.contact : "";
        }
      },
      {
        id: "teacherName",
        title: "咨询师",
        width: 70,
        className: "text-left",
        hidden: false,
        search: {
          type: "input",
          data: {
            placeholer: "",
            autoFocus: true
          }
        },
        formatter: function(record) {
          return record.teacher ? record.teacher.name : "";
        }
      },
      {
        id: "time",
        title: "预约时段",
        width: 180,
        className: "text-center no-wrap",
        hidden: false,
        search: {
          type: 'datetime',
          data: {
            placeholder: '预约时段',
            dateFormat: 'yyyy-MM-dd hh:ii',
            startTimeFieldName: 'consultStartTime',
            endTimeFieldName: 'consultEndTime'
          }
        },
        formatter: function(record) {
          return record.dayTime && record.dayTime.timeQuantum
            ? record.dayTime.dateTime + " " + record.dayTime.timeQuantum
            : "";
        }
      },
      {
        id: "createTime",
        title: "预约时间",
        width: 150,
        className: "text-center no-wrap",
        hidden: false,
        search: {
          type: 'datetime',
          data: {
            placeholder: '预约',
            dateFormat: 'yyyy-MM-dd hh:ii',
            startTimeFieldName: 'reserveStartTime',
            endTimeFieldName: 'reserveEndTime'
          }
        },
        // formatter: function (record) {
        //   // return record.dayTime && record.dayTime.dateTime ? record.dayTime.dateTime : ''
        // }
      },
      {
        id: "status",
        title: "状态",
        className: "text-left",
        hidden: false,
        width: 80,
        search: {
          type: "select",
          data: {
            options: this.statusArray,
            optionsLabel: "label",
            optionsValue: "id"
          }
        },
        formatter: record => {
          return this.statusLabel[record.status];
        }
      },
      {
        id: "score",
        title: "危机评分",
        width: 70,
        className: "text-center",
        hidden: true
      },
      {
        id: "reason",
        title: "取消预约理由",
        width: 120,
        className: "text-left",
        hidden: false
      },
      {
        id: "opt",
        title: "操作",
        className: "text-left",
        width: 130,
        hidden: false,
        formatter: recordItem => {
          var opts = [
            {
              tag: "a",
              text: "查看",
              className: "opt-btn",
              callback: (record, index) => {
                this.showStudentInfoModal = true;
                this.record.id = record.id;
                this.canDownRecord = record.canSeeRecord
                this.recordUrl =
                  "/table-data/mentality/reservation/" +
                  record.id +
                  "/histories";
                var text = "";
                for (var i in record.familyMembers) {
                  for (var j in this.familyMembers) {
                    if (
                      record.familyMembers[i] === this.familyMembers[j].value
                    ) {
                      text += this.familyMembers[j].label + ",";
                    }
                  }
                }
                this.infoData = record
                this.studentInfoData = {  
                  userId:record.student ? record.student.userId : "",
                  consultingMainContent: record.consultingMainContent,
                  consultingAddress: record.consultingAddress,
                  consultingDate:  record.consultingDate ,
                  name: record.student ? record.student.name : "",
                  userNo: record.student ? record.student.userNo : "",
                  sex: record.student ? record.student.sex : '',
                  sexLabel: record.student ? record.student.sexLabel : '',
                  grade: record.student ? record.student.grade : "",
                  collegeName: record.student ? record.student.collegeName : "",
                  className: record.student ? record.student.className : "",
                  educationLevelLabel: record.student
                    ? record.student.educationLevelLabel
                    : "",
                  politicalStatusLabel: record.student
                    ? record.student.politicalStatusLabel
                    : "",
                  contact: record.student ? record.student.contact : "",
                  familyMembers: text.substr(0, text.length - 1),
                  psychiatricHistory: record.psychiatricHistory ? "是" : record.psychiatricHistory==false? "否":'',
                  takeMedicine: record.takeMedicine ? "是" :record.takeMedicine==false? "否":'',
                  parentsMarriageSituation: record.parentsMarriageSituation,
                  remark: record.remark,
                  content: record.content,
                  hasConsultingExperience: record.hasConsultingExperience
                    ? "是"
                    :record.hasConsultingExperience==false? "否":'',
                    hasPsychiatricHistory: record.hasPsychiatricHistory
                    ? "是"
                    : record.hasPsychiatricHistory==false?"否":'',
                  email: record.email,
                  hospital: record.hospital,
                  doctor: record.doctor,
                  drug: record.drug,
                };
              }
            }
          ];
          if (
            recordItem.status === "SUCCESS" ||
            recordItem.status === "ING" ||
            recordItem.status === "FINISHED"
          ) {
            opts.push({
              tag: "a",
              text: "取消预约",
              className: "opt-btn",
              callback: (record, index) => {
                sAjax({
                  url: "/api/mentality/config",
                  dataType: "json",
                  type: "get",
                  success: data => {
                    if (data.state) {
                      this._cancelReservition(record, data.data.cancelTip);
                    } else {
                      this.$toast(data.message);
                    }
                  }
                });
              }
            });
          }
          if ((recordItem.status === "ING" || recordItem.status === "FINISHED")&&recordItem.canSeeNoArrived) {
            opts.push({
              tag: "a",
              text: "未到",
              className: "opt-btn",
              callback: (record, index) => {
                if (confirm("确定未到吗？")) {
                  sAjax({
                    url: "/api/mentality/reservation/" + record.id + "/absent",
                    dataType: "json",
                    type: 'post',
                    success: data => {
                      if (data.state) {
                        this.$toast("操作成功");
                        this._refreshTable();
                      } else {
                        this.$toast(data.message);
                      }
                    }
                  });
                }
              }
            });
          }
          if(recordItem.canSeeRecord) { //可查看记录单
               opts.push({
                  tag: "a",
                  text: "记录单",
                  className: "opt-btn",
                  callback: (record, index) => {
                    this.consultModel.reservationId = recordItem.id
                    // return;
                    let url = `/api/mentality/reservation/${record.id}/getReservationRecord`
                    sAjax({
                      url: url,
                      type: 'get',
                      success: (data) => {
                        if(data.state) {
                          // this.
                          console.log(data.data)
                          this.checkOrEdit = 'check'
                          this.showCanvasImg = true
                          this.canvasUrl = data.data.signUrl || null
                          this.consultModel = Object.assign({},data.data)
                        }
                        
                      }
                    })
                    this.showEvaluationModal = true;
                  }
               })
          }
          // if(recordItem.caneditRecord) { //可编辑记录单
          //      opts.push({
          //         tag: "a",
          //         text: "编辑记录单",
          //         className: "opt-btn",
          //         callback: (record, index) => {
          //           // this.consultModel.reservationId = recordItem.id
                    
          //           console.  log(recordItem.id)
          //           // return;
          //           let url = `/api/mentality/reservation/${record.id}/getReservationRecord`
          //           sAjax({
          //             url: url,
          //             type: 'get',
          //             success: (data) => {
          //               if(data.state) {
          //                 this.checkOrEdit = 'edit'
          //                 this.canvasUrl = data.data.signUrl || null
          //                 if(!this.canvasUrl) {
          //                   this.showCanvasImg = false
          //                 //  this.$nextTick(() => {
          //                 //     this.$refs.mySign.overwrite()
          //                 //  })
          //                 }else {
          //                   this.showCanvasImg = true
          //                 }
          //                 this.consultModel = Object.assign({},data.data)
          //                  this.consultModel.handleResult = this.consultModel.handleResult || ''
          //                 this.consultModel.remark = this.consultModel.remark || ''
          //                 this.consultModel.reservationId = recordItem.id
          //               }
                        
          //             }
          //           })
          //           this.showEvaluationModal = true;
          //         }
          //      })
          // }
          return opts;
        }
      }
    ];
    this.recordColumns = [
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
        width: 150,
        hidden: false
      },
      // {
      //   id: "score",
      //   title: "危机评分",
      //   className: "text-left",
      //   width: 80,
      //   hidden: true
      // },
      // {
      //   id: "record",
      //   title: "咨询记录",
      //   className: "text-left",
      //   width: 120,
      //   hidden: true
      // },
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
      },
      {
        id: "opt",
        title: "操作 ",
        className: "text-center",
        width: 130,
        hidden: false,
        formatter: recordItem => {
          // if (["DONE", "FINISHED"].indexOf(recordItem.status) < 0) {
          //   return [
          //     {
          //       tag: "a",
          //       text: "编辑",
          //       className: "opt-btn",
          //       callback: (record, index) => {
          //       this.showEvaluationModal = true;
          //       this.record = {
          //         id: record.id,
          //         resultRecord: "",
          //         starNumber: 1
          //       };
          //     }
          //     }
          //   ]
          // }
          
          var opt = [];
          // if (["DONE", "FINISHED"].indexOf(recordItem.status) < 0) {
            if(recordItem.canSeeRecordAndExport) {

            opt.push({
              tag: "a",
              text: "查看",
              className: "opt-btn",
              callback: (record, index) => {
                this.consultModel.reservationId = recordItem.id
                this.checkOrEdit = 'check'
                // return;
                let url = `/api/mentality/reservation/${recordItem.id}/getReservationRecord`
                sAjax({
                  url: url,
                  type: 'get',
                  success: (data) => {
                    if(data.state) {
                      this.consultModel = Object.assign({},data.data)
                      this.canvasUrl = data.data.signUrl || null
                    }
                    
                  }
                })
                this.showEvaluationModal = true;
                // this.record = {
                //   id: record.id,
                //   resultRecord: "",
                //   starNumber: 1
                // };
              }
            });
        }
          // }
          return opt;
        }
      }
    ];
    sAjax({
      url: "/api/mentality/reservation/managerAuthority",
      dataType: "json",
      type: "get",
      success: data => {
        // console.log('data',data);
        if(data.state){
          if(data.data){ // 说明有管理员权限,显示危机评分和咨询记录
            this.columns[9].hidden = false;
            this.recordColumns[3].hidden = false;
            this.recordColumns[4].hidden = false;
          }
        }
      }
    });
  },
  methods: {
    checkLog() { //查看日志
    if(this.showLog){
      this.showLog = !this.showLog
      return
    }
      let url = '/api/mentality/reservation/'+ this.consultModel.id +'/seeReservationRecordLog'
      sAjax({
        url: url,
        type: 'get',
        success: (data) => {
          if(data.state) {
            this.logList = data.data.content
            this.showLog = true
          } 
          
        }
      })
    },
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
    _outputPdf: function(evt) {
        this.$waiting.show()
        // console.log(data)
        // data.pageSize = 99999 
        sAjax({
          url: this.pdfSetting.url,
          type: "get",
          success: data => {
            // console.log(data)
            this.$waiting.close()
            if (data.state) {
              this.pdfSetting.downloading = true;
              this.pdfSetting.list = data.data
              this._nextTask(this.pdfSetting.list[this.pdfSetting.index].id);
            } else {
              this.$toast(data.message);
            }
          }
        });
      },
    getDraw(data) { //是否有绘制
      console.log(data)
      this.isDraw = data
    },
    resetCanvas() {
      this.showCanvasImg = false
      this.consultModel.signUrl = null
      this.$nextTick(() => {
        this.$refs.mySign.overwrite()
      })
      
    },
    changeStudentSearch: function() {
      this.isShowSearch.student = true;
      this.addPersonnel.studentId = "";
      this.userIdAndUserName.student = "";
    },
    changeConsultantSearch: function() {
      this.isShowSearch.consultant = true;
      this.addPersonnel.consultantId = "";
      this.userIdAndUserName.consultant = "";
    },
    _selectTabelCell: function(data) {
      this.selectedTabelCells = data;
    },
    _back: function() {
      this.curRouter = "manage";
    },
    addReservationPersonnel: function() {
      this.curRouter = "add";
      this.addPersonnel.studentId = "";
      this.addPersonnel.consultantId = "";
      (this.userIdAndUserName = {
        student: "",
        consultant: ""
      }),
        (this.isShowSearch = {
          student: true,
          consultant: true
        });
      setTimeout(() => {
        var pageContentHeight = $(".add-reservation-personnel").height();
        this.scrollHeight =
          pageContentHeight - $(".addPersonnel-header").height();
      }, 100);
    },
    downPdf() {
      this.pdfSetting.downloading = true
      this.exportType = 'all'
      this.getPdf(this.studentInfoData.name + '预约详情' + new Date().format('yyyy-MM-dd HH:mm:ss'),data => {
       
      })
      this._outputPdf()
      this.showExport = false
    },
    downExcel() {
      var searchData = this.$refs.manageTab.tableSearchFields;
      var searchText = "";
      for (var i in searchData) {
        if (!searchData[i]) {
          searchText += "&" + i + "=" + "";
        } else {
          searchText += "&" + i + "=" + searchData[i];
        }
      }
      sAjax({
        url:
          "/api/mentality/reservation/export?consultStartTime=" +
          this.tableSearch.consultStartTime +
          "&consultEndTime=" +
          this.tableSearch.consultEndTime +
          "&reserveStartTime=" +
          this.tableSearch.reserveStartTime +
          "&reserveEndTime=" +
          this.tableSearch.reserveEndTime +
          searchText,
        type: "get",
        success: data => {
          if (data.state) {
            window.location.href =
              "/downloads/mentality/reservation/download?key=" + data.data;
          } else {
            this.$toast(data.message);
          }
        }
      }).always(() => {
        this.$waiting.close();
      });
    },
    _export: function() {
      this.showExport = true
      //记得删
      // var searchData = this.$refs.manageTab.tableSearchFields;
      // var searchText = "";
      // for (var i in searchData) {
      //   if (!searchData[i]) {
      //     searchText += "&" + i + "=" + "";
      //   } else {
      //     searchText += "&" + i + "=" + searchData[i];
      //   }
      // }
      // this.$waiting.show();
      // sAjax({
      //   url:
      //     "/api/mentality/reservation/export?consultStartTime=" +
      //     this.tableSearch.consultStartTime +
      //     "&consultEndTime=" +
      //     this.tableSearch.consultEndTime +
      //     "&reserveStartTime=" +
      //     this.tableSearch.reserveStartTime +
      //     "&reserveEndTime=" +
      //     this.tableSearch.reserveEndTime +
      //     searchText,
      //   type: "get",
      //   success: data => {
      //     if (data.state) {
      //       window.location.href =
      //         "/downloads/mentality/reservation/download?key=" + data.data;
      //     } else {
      //       this.$toast(data.message);
      //     }
      //   }
      // }).always(() => {
      //   this.$waiting.close();
      // });
    },
    sumbitEditRecordModal: function() {
      if(this.showCanvasImg || !this.isDraw) {
        let reservationRecordVO = Object.assign({},this.consultModel)
        let id = this.consultModel.reservationId 
        sAjax({
          url: "/api/mentality/reservation/" + id + "/saveReservationRecord",
          dataType: "json",
          type: 'post',
          data: reservationRecordVO,
          success: data => {
            if (data.state) {
              this.$toast("编辑成功");
              this.isDraw = false
              this.showEvaluationModal = false;
              this.recordUrl =
                "/table-data/mentality/reservation/" +
                id +
                "/histories?timeStamp=" +
                createTime();
            } else {
              this.$toast(data.message);
            }
          }
        });
      }else {
        let file = this.$refs.mySign.getFile();//画布生成的图片文件
        var fd = new FormData();
        fd.append("file", file);
        fd.append("fieldName", file.name);
        sAjax({
        url: "/upload/storage/files",
        type: "post",
        data: fd,
        contentType: false,
        processData: false,
        success: data => {
          if (data.code === "88888") {
            this.consultModel.signUrl = data.data.hash
            let reservationRecordVO = Object.assign({},this.consultModel)
            let id = this.consultModel.reservationId 
            sAjax({
              url: "/api/mentality/reservation/" + id + "/saveReservationRecord",
              dataType: "json",
              type: 'post',
              data: reservationRecordVO,
              success: data => {
                if (data.state) {
                  this.$toast("编辑成功");
                  this.isDraw = false
                  this.showEvaluationModal = false;
                  this.recordUrl =
                    "/table-data/mentality/reservation/" +
                    id +
                    "/histories?timeStamp=" +
                    createTime();
                } else {
                  this.$toast(data.message);
                }
              }
            });
            // this.unitInfoFrom.license = data.data.hash;
            // this.$refs['unitInfoFromRules'].validateField('license')
          } else {
            this.$toast(data.message);
          }
        }
      }).always(() => { });
      }
       
    },
    studentSelected: function(data) {
      this.addPersonnel.studentId = data.userId;
      this.userIdAndUserName.student = data.name + " (" + data.userNo + ")";
      this.isShowSearch.student = false;
    },
    _getWeekTime: function(data) {
      if (data) {
        this.weekTime = data;
        if (this.selectCampus) {
          this._initTableData(data);
        }
      }
    },
    _initTableData: function(data) {
      sAjax({
        url:
          "/api/mentality/scheduling/teachers/page/week?campus=" +
          this.selectCampus +
          "&type=" +
          this.schedulingType +
          "&dateStart=" +
          data.dateStart +
          "&dateEnd=" +
          data.dateEnd +
          "&userId=" +
          this.addPersonnel.consultantId,
        dataType: "json",
        type: "get",
        success: data => {
          if (data.state) {
            if (data.data && data.data.length > 0) {
              // console.log(JSON.stringify(data))
              this.schedulingData = data.data;
              this.timeQuantumArray = [];
              for (var k in data.data[0].setting.timeSetting) {
                var timeQuantum = data.data[0].setting.timeSetting[k];
                this.timeQuantumArray.push({
                  id: timeQuantum.id,
                  timeQuantum:
                    timeQuantum.timeQuantumStart +
                    "-" +
                    timeQuantum.timeQuantumEnd
                });
              }
            } else {
              this.schedulingData = [];
              this.timeQuantumArray = [];
            }
          } else {
            this.$toast(data.message);
          }
        }
      });
    },
    consultantSelected: function(data) {
      this.addPersonnel.consultantId = data.userId;
      this.userIdAndUserName.consultant = data.name + " (" + data.userNo + ")";
      this.isShowSearch.consultant = false;
      this._initTableData(this.weekTime);
    },
    _refreshTable: function() {
      this.timeStamp = createTime();
    },
    submitPersonnel: function() {
      if (!this.addPersonnel.studentId) {
        return this.$toast("请先搜索学生");
      }
      if (!this.addPersonnel.consultantId) {
        return this.$toast("请先搜索咨询师");
      }
      var dayTimeTeacherId = [];
      for(let item of this.selectedTabelCells) {
        let {dayTimeTeacher} = item.data
        if(dayTimeTeacher.length) {
          dayTimeTeacherId.push(item.data.dayTimeTeacher[0].id);
        }else {
          return this.$toast('请选择有排班老师的日期')
        }
      }
      // this.selectedTabelCells.forEach((ele, index) => {
      //   dayTimeTeacherId.push(ele.data.dayTimeTeacher[0].id);
      // });
      sAjax({
        url: "/api/mentality/reservation/manual",
        dataType: "json",
        type: "post",
        data: {
          dayTimeTeacherId: dayTimeTeacherId,
          studentUserId: this.addPersonnel.studentId
        },
        success: data => {
          if (data.state) {
            this.$toast("添加成功");
            this.curRouter = "manage";
          } else {
            this.$toast(data.message);
          }
        }
      });
    },
    _cancelReservition: function(record, canceTip) {
      this.$prompt({
        tip: "取消预约原因",
        placeholder: "请在此处输入取消原因",
        warn: canceTip,
        callback: result => {
          if (result.type === "ok") {
            if (!result.text) {
              this.$toast("请输入取消预约原因！");
              return false;
            }
            sAjax({
              url: "/api/mentality/reservation/" + record.id + "/cancelByAdmin",
              type: 'post',
              data: {
                reason: result.text
              },
              success: data => {
                if (data.state) {
                  this.$toast("取消成功");
                  this._refreshTable();
                } else {
                  this.$toast(data.message);
                }
              }
            });
          }
        }
      });
    },
    checkAndUpdateContact: function () {
      var re = /^1[3456789]\d{9}$/
      let contact = this.studentInfoData.contact;
      let userId = this.studentInfoData.userId;
      if (!re.test(contact)) {
        this.$toast('联系方式格式不正确')
        return
      }
      sAjax({
        url: "/api/mentality/reservation/updateContact/"+userId+"?contact="+contact,
        dataType: "json",
        type: 'post',
        success: data => {
          if (data.state) {
            this.$toast("修改成功");
          } else {
            this.$toast(data.message);
          }
        }
      });
    },
    exportToPdf(type) {
      this.exportType = type
      this.pdfSetting.list = [{id:this.infoData.id,studentName: this.infoData.student.name}]
      this.pdfSetting.downloading = true
      if(type == 'order') {  //导出预约信息需要带历史记录
        let url = "/api/mentality/reservation/" +
                  this.infoData.id +
                  "/histories";
        sAjax({
          url: url,
          type: 'get',
          success: (data) => {
            if(data.state) {
              this.orderHistory = data.data.content
              console.log(this.orderHistory)
              this.showStudentInfoModal = false
               this.getPdf(this.studentInfoData.name + '预约详情' + new Date().format('yyyy-MM-dd'));
            }
           
          }
        })
      }else {
        setTimeout(() => {
          this.showStudentInfoModal = false
          this.getPdf(this.studentInfoData.name + '预约详情' + new Date().format('yyyy-MM-dd'));
        },100)
        
      }
    }
  }
};
</script>
<style lang="less">
@import url("../../assets/common.less");
#reservation-info-manage {
  .srcoll-bar {
    height: 600px;
  }
  .campus-select {
    display: inline-block;
    width: 60%;
    margin-left: 15px;
    .select-radio {
      display: block;
      background: #f6f8f8;
      padding: 7px 10px 2px;
      margin-bottom: 10px;
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
    .morning-color,
    .afternoon-color {
      width: 20px;
      height: 20px;
      display: inline-block;
      vertical-align: bottom;
      margin-left: 9px;
    }
    .morning-name,
    .afternoon-name {
      font-size: 15px;
      color: #3e3e3e;
    }
    .morning-color {
      background: #ef6060;
    }
    .afternoon-color {
      background: #5176d2;
    }
  }
  .two-words-difference-margin {
    margin-left: 28px;
  }
  .five-words-difference-margin{
    margin-left: 70px;
  }
  .one-words-difference-margin {
    margin-left: 14px;
  }
  .three-words-difference-margin {
    margin-left: 42px;
  }
  .add {
    background: #ffffff;
    border: none;
  }
  .consultative-time {
    .time-picker {
      width: 200px;
      display: inline-block;
      margin-left: 9px;
      margin-right: 9px;
      button.close {
        margin-right: 10px;
      }
      .form-control.v-datepicker-input {
        border: 1px solid #d9d9d9;
        border-radius: 3px;
      }
      .v-datepicker-icon {
        margin-right: 10px;
      }
    }
  }
  .label-content {
    margin-left: 10px;
  }
  .columns {
    border-bottom: 1px solid #e0e0e0;
    margin-bottom: 16px;
  }
  .student-info-title {
    font-size: 16px;
    color: #6d6d6d;
  }
  .columns-title {
    font-size: 16px;
    font-weight: bold !important;
    margin-bottom: 10px;
  }
  .stars-group {
    display: inline-block;
    vertical-align: bottom;
    margin-left: 8px;
    span {
      cursor: pointer;
      .star-border {
        color: #999999;
      }
      .default-color {
        color: #f8e717;
      }
      .danger-color {
        color: #ff3d3d;
      }
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
  .radio-group {
    margin-bottom: 9px;
    .radio-area {
      display: inline-block;
      div {
        display: inline-block;
        margin-left: 14px;
        margin-right: 5px;
        cursor: pointer;
        label {
          margin-left: 5px;
        }
      }
    }
  }
  .textarea-label {
    vertical-align: top;
  }
  .modal-textarea {
    width: 72%;
    resize: none;
    margin-left: 10px;
    padding: 5px;
    border: 1px solid #e0e0e0;
    outline: none;
  }
  .cancel-modal-textarea {
    width: 100%;
    resize: none;
    margin-top: 10px;
    padding: 5px;
    border: 0 solid #e0e0e0;
    outline: none;
  }
  .add-reservation-personnel {
    height: 100%;
    padding: 0;
    background: #fff;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
    font-family: PingFangSC-Medium;
    .addPersonnel-header {
      height: 56px;
      border-bottom: 1px solid #d9d9d9;
      .addPersonnel-back {
        cursor: pointer;
        margin-top: 16px;
        margin-left: 53px;
        .back-title {
          display: inline-block;
          font-size: 16px;
          margin-top: 1px;
          margin-left: 16px;
        }
      }
    }
    .addPersonnel-content {
      padding: 20px 53px;
      overflow-y: auto;
      overflow-x: hidden;
      .modal-search-user {
        margin-bottom: 16px;
        .userId-and-userName {
          display: inline-block;
          margin-top: 2px;
          margin-left: 16px;
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
        .search-user-label {
          vertical-align: top;
          margin-top: 5px;
        }
        .input-group {
          display: inline-block;
          margin-left: 7px;
        }
      }
    }
    .psychological-footer {
      position: absolute;
      z-index: 100;
      bottom: 30px;
      left: 48%;
      .sumbit-btn {
        border-radius: 27.5px;
        font-size: 16px;
        color: #ffffff;
        background: #298df7;
      }
    }
  }
  .no-wrap {
    white-space: normal;
    line-height: 1.5;
  }
  #pdfDom {
    font-size: 14px;
    padding: 24px;
    .table-data {
      overflow-x: hidden;
      height: 100%;
      overflow-y: visible;
      max-height: max-content;
      table {
        position: relative;
      }
    }
  }
  #pdf-title {
    text-align: center;
    font-size: 18px;
    margin-bottom: 24px;
    font-weight: bold;
  }
}
.block {
  text-align: center;
  margin-bottom: 20px;
  button {
    width: 60%;
  }
}
.count.el-form-item {
  .el-textarea {
    position: relative;
    textarea {
      padding-right: 100px;
    }
  }
  span.countLength {
    position: absolute;
    right: 20px;
    bottom: 10px;
    line-height: 1;
  }
}
.second-export {
  position: absolute;
  top: 0;
  // opacity: 0;
  z-index: -1;
  width: 840px;
  // height: 1188px;
}
.logs {
  position: absolute;
  right: -15px;
  top: 70px;
  z-index: 101;
  background: #fff;
  width: 300px;
  max-height: 700px;
  overflow-y: auto;
  h4 {
    font-size: 14px;
    margin-top: 0;
  }
  .tip {
    color: #4091ff;
  }
  .el-timeline-item__content {
    margin-right: 5px;
  }
  .el-timeline-item__wrapper {
      width: calc(100% - 15px);
  }
}
// .dialogModal {
//   display: none;
// }
// .canvasImg:hover + .dialogModal {
//     display: block;
// }
</style>
