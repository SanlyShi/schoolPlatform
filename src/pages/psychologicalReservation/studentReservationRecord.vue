<template>
  <div id="student-reservation-record" class="container-fluid" >
    <div class="row text-center" >
      <v-table
       :url="manageTableUrl"
       ref="manageTab"
       pagesize="10"
       idField="id"
       :columns="columns"
       :multiple="false"
       :order="true"
       :search="false"
       :columnsControl="true">
        <div slot="btn-group" role="group" >
        </div>
      </v-table>
    </div>
    <v-modal :show="showStudentInfoModal" effect="fade" width="1000">
      <div slot="modal-header" class="modal-header">
        <div class="student-info-title">
            查看学生信息
        </div>
      </div>
      <div slot="modal-body" class="modal-body">
        <!-- <GeminiScrollbar class="srcoll-bar" :scrollX="false"> -->
           <el-tabs v-model="activeName">
             <el-tab-pane label="基本信息" name="first">
          <!-- <div id="pdfDom" :class="{ 'exporting-to-pdf': exportingToPdf }"> -->
            <!-- <p id="pdf-title" v-if="exportingToPdf">预约详情</p> -->
          <div class="columns">
            <label class="columns-title">基本信息</label>
            <div class="row">
              <div class="col-md-6">
                <div class="form-group" >
                  <label class="form-label">姓名</label>
                  <label class="label-content">{{studentInfoData.name}}</label>
                </div>
                <div class="form-group" >
                  <label class="form-label">学号</label>
                  <label class="label-content">{{studentInfoData.userNo}}</label>
                </div>
                <div class="form-group" >
                  <label class="form-label">年级</label>
                  <label class="label-content">{{studentInfoData.grade}}</label>
                </div>
                <div class="form-group" >
                  <label class="form-label">学院</label>
                  <label class="label-content">{{studentInfoData.collegeName}}</label>
                </div>
                <div class="form-group" >
                  <label class="form-label">邮箱</label>
                  <label class="label-content">{{studentInfoData.email}}</label>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group" >
                  <label class="form-label two-words-difference-margin">班级</label>
                  <label class="label-content">{{studentInfoData.className}}</label>
                </div>
                <div class="form-group" >
                  <label class="form-label">培养层次</label>
                  <label class="label-content">{{studentInfoData.educationLevelLabel}}</label>
                </div>
                <div class="form-group" >
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
              </div>
            </div>
          </div>
           </el-tab-pane>
            <el-tab-pane label="预约填写额外信息" name="two">
          <div class="columns">
            <label class="columns-title">预约填写额外信息</label>
            <div class="row">
              <div class="col-md-6">
                <div class="form-group" >
                  <label class="form-label two-words-difference-margin">家庭成员</label>
                  <label class="label-content">{{studentInfoData.familyMembers}}</label>
                </div>
                <div class="form-group" >
                  <label class="form-label">父母婚姻情况</label>
                  <label class="label-content">{{studentInfoData.parentsMarriageSituation}}</label>
                </div>
                <div class="form-group" >
                  <label class="form-label">本次咨询内容</label>
                  <label class="label-content">{{studentInfoData.content}}</label>
                </div>
                <div class="form-group" >
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
                <div class="form-group" >
                  <label class="form-label one-words-difference-margin">家庭精神病史</label>
                  <label class="label-content">{{studentInfoData.psychiatricHistory}}</label>
                </div>
                <div class="form-group" >
                  <label class="form-label one-words-difference-margin">是否服用药物</label>
                  <label class="label-content">{{studentInfoData.takeMedicine}}</label>
                </div>
                <div class="form-group" >
                  <label class="form-label one-words-difference-margin">是否有咨询记录</label>
                  <label class="label-content">{{studentInfoData.hasConsultingExperience}}</label>
                </div>
                <div class="form-group" >
                  <label class="form-label one-words-difference-margin">咨询时间</label>
                  <label class="label-content">{{studentInfoData.consultingDate}}</label>
                </div>
                <div class="form-group" >
                  <label class="form-label one-words-difference-margin">咨询地点</label>
                  <label class="label-content">{{studentInfoData.consultingAddress}}</label>
                </div>
                <div class="form-group" >
                  <label class="form-label one-words-difference-margin">咨询主题</label>
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
                    <label class="form-label three-words-difference-margin">咨询时间</label>
                    <label class="label-content">{{infoData.dayTime.dateTime}}</label>
                  </div>
                  <div class="form-group">
                    <label class="form-label">咨询师联系方式</label>
                    <label class="label-content">{{infoData.teacher.contact}}</label>
                  </div>
                  <div class="form-group">
                    <label class="form-label two-words-difference-margin" >咨询师姓名</label>
                    <label class="label-content">{{infoData.teacher.name}}</label>
                  </div>
                  <div class="form-group">
                    <label class="form-label five-words-difference-margin" >状态</label>
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
                <label class="columns-title">咨询记录</label>
                <v-table  :url="recordUrl" pagesize="10" idField="id" :columns="recordColumns" :paginationShow="false" :order="true">

                </v-table>
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
        >{{ exportingToPdf ? '导出中...' : '导出PDF'}}</button>
        <button type="button" class="btn cancel-btn clearBtnBorder"  @click="showStudentInfoModal = false">取消</button> -->
         <el-button type="primary" @click="exportToPdf('order')">导出学生预约信息</el-button>
        <el-button type="primary" @click="exportToPdf('record')" v-if="canDownRecord">导出咨询记录单</el-button>
        <el-button
          @click="showStudentInfoModal = false;"
        >取消</el-button>
     </div>
    </v-modal>
    <!-- <v-modal :show="showEvaluationModal" effect="fade" width="400">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
          评价
        </h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="form-group">
          <label class="form-label two-words-difference-margin">危机评分</label>
          <div class="stars-group" v-for="(item, index) in stars" :key="index">
            <span @click="changeStar(item)">
               <i class="maticon" :class="record.starNumber > 3?'danger-color':'default-color'" v-html="icons('star')" v-if="item.isSelected">star</i>
               <i class="maticon star-border" v-html="icons('star_border')" v-else>star_border</i>
            </span>
          </div>
        </div>
        <div class="form-group">
          <label class="input-label textarea-label">咨询结果记录</label>
          <textarea cols="24" rows="5" class="modal-textarea" maxlength="300" v-model="record.resultRecord"></textarea>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder"  @click="showEvaluationModal = false">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder"  @click="sumbitEditRecordModal">确定</button>
      </div>
    </v-modal> -->
    <!-- //编辑或查看咨询记录 -->
    <v-modal :show="showEvaluationModal" effect="fade"  width="1000">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">{{checkOrEdit=='check'?'查看':'编辑'}}</h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <h1 style="text-align: right;margin: 0;" ><el-button @click="checkLog">日志</el-button></h1>
        <div class="logs" v-show="showLog">
           <el-timeline v-if="logList.length">
             <el-timeline-item v-for="(item,index) in logList" :key='index' :timestamp="item.split(' ')[0]" placement="top">
                <el-card>
                  <h4 style="">{{item.split(' ')[0] + '  ' + item.split(' ')[1]}}</h4>
                  <p><span>{{item.split(' ')[2]}}</span> <span v-if="item.split(' ')[3]">{{item.split(' ')[3]}}</span></p>
                </el-card>
             </el-timeline-item>
           </el-timeline>  
           <div v-else><p>暂无日志</p></div>
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
              <el-col :span="20" style="margin-top: 20px;">
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
      <iframe width="100%"  height="1188px" :src="`/psychic/details?id=${this.pdfSetting.list[this.pdfSetting.index]}&type=${this.exportType}&history=${orderHistory}`" frameborder="0"></iframe>
      <!-- <iframe width="100%" height="1188px" :src="`/sc/report?userId=353553965901676544&isPdf=true`" frameborder="0"></iframe> -->
    </div>
  </div>

</template>

<script>
  import Vue from 'vue'
  import { translation, sAjax, createTime } from '../../assets/utils/utils.js'
  import CreserveTable from './components/reserveTable.vue'
  import sign from '../enroll/components/sign.vue'
  import JSZip from "jszip";
import FileSaver from "file-saver";
  Vue.component('c-reserveTable', CreserveTable)
  export default {
    components: {
      sign,
    },
    data: function () {
      return {
        canDownRecord: false,
        canvasUrl: '',
        showExport: false,
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
        logList: [],
        showLog: false,
        isDraw: false,//是否进行过绘制
        showCanvasImg: true,
        checkOrEdit: 'check',//查看状态或者编辑状态
        activeName: 'first',
        manageUrl: '/table-data/mentality/reservation/teacher',
        recordUrl: '',
        timeStamp: '',
        tableSearch: {
        },
        columns: [],
        recordColumns: [],
        modalType: '',
        showStudentInfoModal: false,
        showEvaluationModal: false,
        reason: '',
        record: {
          id: '',
          resultRecord: '',
          starNumber: 1
        },
        stars: [{ id: 1, isSelected: true }, { id: 2, isSelected: false }, { id: 3, isSelected: false }, { id: 4, isSelected: false }, { id: 5, isSelected: false }],
        statusLabel: {
          SUCCESS: '预约成功',
          CANCELED: '取消预约',
          CANCELED_BY_ADMIN: '后台取消',
          ING: '进行中',
          FINISHED: '已结束',
          DONE: '已完成',
          ABSENT: '未到',
          ABORT: '排班被取消'
        },
        studentInfoData: {
          name: '',
          userNo: '',
          grade: '',
          sex: '',
          sexLabel: '',
          collegeName: '',
          className: '',
          educationLevelLabel: '',
          politicalStatusLabel: '',
          contact: '',
          familyMembers: '',
          psychiatricHistory: '',
          takeMedicine: '',
          parentsMarriageSituation: '',
          remark: '',
          content: '',
          hasConsultingExperience: '',
          email: ''
        },
        familyMembers: [],
        statusArray: [{
          id: 'SUCCESS',
          label: '预约成功'
        }, {
          id: 'CANCELED',
          label: '取消预约'
        }, {
          id: 'CANCELED_BY_ADMIN',
          label: '后台取消'
        }, {
          id: 'ING',
          label: '进行中'
        }, {
          id: 'FINISHED',
          label: '已结束'
        }, {
          id: 'DONE',
          label: '已完成'
        }, {
          id: 'ABSENT',
          label: '未到'
        }, {
          id: 'ABORT',
          label: '排班被取消'
        }],
        lang: 'zh-cn',
        exportingToPdf: false
      }
    },
    computed: {
      translate: function () {
        return translation(this.lang).employmentUnitManage
      },
      manageTableUrl() {
        return `${this.manageUrl}?timeStamp=${this.timeStamp}`
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
          dictType: '家庭成员类型'
        },
        success: (data) => {
          if (data.state) {
            this.familyMembers = data.data
          } else {
            this.$toast(data.message)
          }
        }
      })
      this.columns = [{
        id: 'studentName',
        title: '姓名',
        width: 70,
        className: 'text-left',
        hidden: false,
        search: {
          type: 'input',
          data: {
            placeholer: '',
            autoFocus: true
          }
        },
        formatter: function (record) {
          return record.student ? record.student.name : ''
        }
      }, {
        id: 'studentNo',
        title: '学号',
        width: 120,
        className: 'text-left',
        hidden: true,
        search: {
          type: 'input',
          data: {
            placeholer: '',
            autoFocus: true
          }
        },
        formatter: function (record) {
          return record.student ? record.student.userNo : ''
        }
      }, {
        id: 'sex',
        title: '性别',
        width: 50,
        className: 'text-left',
        hidden: true,
        search: {
          type: 'select',
          data: {
            url: '/api/system/dicts?dictType=性别',
            optionsLabel: 'label',
            optionsValue: 'value'
          }
        },
        formatter: function(record) {
          return record.student && record.student.sexLabel;
        }
      }, {
        id: 'collegeCode',
        title: '学院',
        width: 120,
        className: 'text-left',
        hidden: true,
        search: {
          type: 'select',
          data: {
            url: `/api/colleges`,
            optionsLabel: 'name',
            optionsValue: 'code'
          }
        },
        formatter: function (record) {
          return record.student ? record.student.collegeName : ''
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
        id: 'campus',
        title: '校区',
        width: 80,
        className: 'text-left',
        hidden: true,
        formatter: function (record) {
          return record.student ? record.student.campusLabel : ''
        },
        search: {
          type: "select",
          data: {
            url: `/api/system/dicts?dictType=校区`,
            optionsLabel: "label",
            optionsValue: "value"
          }
        },
      }, {
        id: 'contact',
        title: '学生联系方式',
        width: 120,
        className: 'text-left',
        hidden: true,
        search: {
          type: "input",
          data: {
            placeholer: "",
            autoFocus: true
          }
        },
        formatter: function (record) {
          return record.student ? record.student.contact : ''
        }
      }, {
        id: 'teacherName',
        title: '咨询师',
        width: 70,
        className: 'text-left',
        hidden: true,
        search: {
          type: "input",
          data: {
            placeholer: "",
            autoFocus: true
          }
        },
        formatter: function (record) {
          return record.teacher ? record.teacher.name : ''
        }
      }, {
        id: 'time',
        title: '预约时段',
        width: 180,
        className: 'text-center no-wrap',
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
        formatter: function (record) {
          return record.dayTime && record.dayTime.timeQuantum ? (record.dayTime.dateTime + ' ' + record.dayTime.timeQuantum) : ''
        }
      }, {
        id: 'createTime',
        title: '预约时间',
        width: 150,
        className: 'text-center no-wrap',
        hidden: true,
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
        //   return record.dayTime && record.dayTime.dateTime ? record.dayTime.dateTime : ''
        // }
      }, {
        id: 'status',
        title: '状态',
        className: 'text-left',
        hidden: false,
        width: 80,
        search: {
          type: 'select',
          data: {
            options: this.statusArray,
            optionsLabel: 'label',
            optionsValue: 'id'
          }
        },
        formatter: (record) => {
          return this.statusLabel[record.status]
        }
      }, {
        id: 'score',
        title: '危机评分',
        width: 70,
        className: 'text-left',
        hidden: true
      }, {
        id: 'reason',
        title: '取消预约理由',
        width: 120,
        className: 'text-left',
        hidden: true
      }, {
        id: 'opt',
        title: '操作',
        className: 'text-left',
        width: 130,
        hidden: false,
        formatter: (recordItem) => {
          var opts = [{
            tag: 'a',
            text: '查看',
            className: 'opt-btn',
            callback: (record, index) => {
              this.showStudentInfoModal = true
              this.canDownRecord = record.canSeeRecord
              this.recordUrl = '/table-data/mentality/reservation/' + record.id + '/histories'
              var text = ''
              for (var i in record.familyMembers) {
                for (var j in this.familyMembers) {
                  if (record.familyMembers[i] === this.familyMembers[j].value) {
                    text += this.familyMembers[j].label + ','
                  }
                }
              }
              this.infoData = record
              this.studentInfoData = {
                consultingMainContent: record.consultingMainContent,
                    consultingAddress: record.consultingAddress,
                     consultingDate:  record.consultingDate ,
                name: record.student ? record.student.name : '',
                userNo: record.student ? record.student.userNo : '',
                sex: record.student ? record.student.sex : '',
                sexLabel: record.student ? record.student.sexLabel : '',
                grade: record.student ? record.student.grade : '',
                collegeName: record.student ? record.student.collegeName : '',
                className: record.student ? record.student.collegeName : '',
                educationLevelLabel: record.student ? record.student.educationLevelLabel : '',
                politicalStatusLabel: record.student ? record.student.politicalStatusLabel : '',
                contact: record.student ? record.student.contact : '',
                familyMembers: text.substr(0, text.length - 1),
                psychiatricHistory: record.psychiatricHistory ? '是' : '否',
                takeMedicine: record.takeMedicine ? '是' : '否',
                parentsMarriageSituation: record.parentsMarriageSituation,
                remark: record.remark,
                content: record.content,
                hasConsultingExperience: record.hasConsultingExperience ? '是' : '否',
                hasPsychiatricHistory: record.hasPsychiatricHistory
                    ? "是"
                    : "否",
                email: record.email,
                hospital: record.hospital,
                  doctor: record.doctor,
                  drug: record.drug,
              }
            }
          }]
          // if (recordItem.status === 'FINISHED') {
          //   opts.push({
          //     tag: 'a',
          //     text: '评价',
          //     className: 'opt-btn',
          //     callback: (record, index) => {
          //       this.showEvaluationModal = true
          //       this.record.id = record.id
          //     }
          //   })
          // }
          if (recordItem.status === 'ING' || recordItem.status === 'FINISHED') {
            opts.push({
              tag: 'a',
              text: '未到',
              className: 'opt-btn',
              callback: (record, index) => {
                sAjax({
                  url: '/api/mentality/reservation/' + record.id + '/absent',
                  dataType: 'json',
                  type: 'post',
                  success: (data) => {
                    if (data.state) {
                      this.$toast('操作成功')
                      this._refreshTable()
                    } else {
                      this.$toast(data.message)
                    }
                  }
                })
              }
            })
          }
          if(recordItem.caneditRecord) { //可编辑记录单
               opts.push({
                  tag: "a",
                  text: "编辑记录单",
                  className: "opt-btn",
                  callback: (record, index) => {
                    
                    
                    console.log(recordItem.id)
                    // return;
                    let url = `/api/mentality/reservation/${record.id}/getReservationRecord`
                    sAjax({
                      url: url,
                      type: 'get',
                      success: (data) => {
                        if(data.state) {
                          this.checkOrEdit = 'edit'
                          this.canvasUrl = data.data.signUrl || null
                          if(!this.canvasUrl) {
                            this.showCanvasImg = false
                          //  this.$nextTick(() => {
                          //     this.$refs.mySign.overwrite()
                          //  })
                          }else {
                            this.showCanvasImg = true
                          }
                          this.consultModel = Object.assign({},data.data)
                          this.consultModel.handleResult = this.consultModel.handleResult || ''
                          this.consultModel.remark = this.consultModel.remark || ''
                          this.consultModel.reservationId = recordItem.id
                        }
                        
                      }
                    })
                    this.showEvaluationModal = true;
                  }
               })
          }
          return opts
        }
      }]
      this.recordColumns = [{
        id: 'createTime',
        title: '咨询时间',
        className: 'text-left',
        hidden: false,
        width: 170,
        hidden: false,
        formatter: (record) => {
          return record.dayTime && record.dayTime.dateTime ? (record.dayTime.dateTime + ' ' + record.dayTime.timeQuantumStart + '-' + record.dayTime.timeQuantumEnd) : ''
        }
      }, {
        id: 'teacherName',
        title: '咨询师姓名',
        className: 'text-left',
        width: 100,
        hidden: false
      }, {
        id: 'contact',
        title: '学生联系方式',
        className: 'text-left',
        width: 130,
        hidden: false
      }, 
      {
        id: "teacherScore",
        title: "学生评分",
        className: "text-left",
        width: 80,
        hidden: false
      },
      // {
      //   id: 'score',
      //   title: '危机评分',
      //   className: 'text-left',
      //   width: 80,
      //   hidden: false
      // }, {
      //   id: 'record',
      //   title: '咨询记录',
      //   className: 'text-left',
      //   width: 200,
      //   hidden: false
      // },
       {
        id: 'status',
        title: '状态',
        className: 'text-left',
        hidden: false,
        formatter: (record) => {
          return this.statusLabel[record.status]
        }
      },{
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
            opt.push({
              tag: "a",
              text: "查看",
              className: "opt-btn",
              callback: (record, index) => {
                this.consultModel.reservationId = recordItem.id
                this.checkOrEdit = 'check'
                console.  log(recordItem.id)
                // return;
                let url = `/api/mentality/reservation/${recordItem.id}/getReservationRecord`
                sAjax({
                  url: url,
                  type: 'get',
                  success: (data) => {
                    if(data.state) {
                        this.canvasUrl = data.data.signUrl || null
                          if(!this.canvasUrl) {
                            this.showCanvasImg = false
                          }else {
                            this.showCanvasImg = true
                          }
                      this.consultModel = Object.assign({},data.data)
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
          // }
          return opt;
        }
      }]
    },
    methods: {
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
              this._nextTask(this.pdfSetting.list[this.pdfSetting.index]);
            } else {
              this.$toast(data.message);
            }
          }
        });
      },
       _downloadPdf: function() {
        if (this.pdfSetting.downloading) {
          this.pdfSetting.title = this.pdfSetting.index+1
          this.getPdf(this.pdfSetting.title, data => {
            // this.preview = false;
            this.pdfSetting.modalShow = false;
            if(this.pdfSetting.list.length-1 == this.pdfSetting.index) {
              // console.log(123)
              this.pdfSetting.downloading = false
            }
            this.pdfSetting.index++;
            this.pdfSetting.zip.file(this.pdfSetting.title + ".pdf", data, {
              binary: true
            });
            this._nextTask(this.pdfSetting.list[this.pdfSetting.index]);
            this.$toast(
              `打包中...(${this.pdfSetting.index}/${this.pdfSetting.list.length})\nPDF文件较大，导出速度慢`
            );
          });
        }
      },
      downPdf() {
      this.pdfSetting.downloading = true
      this.exportType = 'all'
      this.getPdf(this.studentInfoData.name + '预约详情' + new Date().format('yyyy-MM-dd HH:mm:ss'),data => {
       
      })
      this._outputPdf()
      this.showExport = false
    },
     _export: function() {
      this.showExport = true
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
            if(this.logList.length) {
              this.showLog = true
            }
            
          } 
          
        }
      })
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
      sumbitEditRecordModal: function () {
        if(!this.isDraw) {
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
      _refreshTable: function () {
        this.timeStamp = createTime()
      },
      changeStar: function (data) {
        this.record.starNumber = 0
        for (var i in this.stars) {
          if (this.stars[i].id <= data.id) {
            this.stars[i].isSelected = true
            this.record.starNumber++
          } else {
            this.stars[i].isSelected = false
          }
        }
      },
     exportToPdf(type) {
      this.exportType = type
      this.pdfSetting.list = [this.infoData.id]
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
        }, 100);
        
      }
    }
    }
  }
</script>
<style lang="less">
@import url("../../assets/common.less");
#student-reservation-record {
  .srcoll-bar {
    height: 600px;
  }
  .two-words-difference-margin {
    // margin-left: 28px;
  }
  .one-words-difference-margin {
    margin-left: 14px;
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
        margin-top: 2px;
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
    color: white;
  }
  .columns-title {
    font-size: 16px;
    font-weight: bold;
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
    border: 2px solid #e0e0e0;
    outline: none;
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
#student-reservation-record  {
    #pdfDom {
      font-size: 14px;
      padding: 24px;
  }
  .second-export {
      position: absolute;
      top: 0;
      z-index: -1;
      width: 840px;
  }  
}

</style>
