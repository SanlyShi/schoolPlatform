<template>
  <v-modal :show="visiable" effect="fade" width="1000">
    <div slot="modal-header" class="modal-header">
      <div class="modal-title student-info-title">查看学生信息</div>
    </div>
    <div slot="modal-body" class="modal-body">
       <el-tabs v-model="activeName" >
      <!-- <GeminiScrollbar style="height: 500px" :scrollX="false">
        <div id="pdfDom" :class="{ 'exporting-to-pdf': exportingToPdf }">
          <p id="pdf-title" v-if="exportingToPdf">预约详情</p> -->
          <el-tab-pane label="基本信息" name="first">
          <div class="columns">
            <label class="columns-title">基本信息</label>
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
                <div class="form-group">
                  <label class="form-label">联系方式</label>
                  <label class="label-content">{{reservation.student.contact}}</label>
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
                <div class="form-group">
                  <label class="form-label two-words-difference-margin">家庭成员</label>
                  <label class="label-content">{{familyMembersLabel}}</label>
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
                  <label class="label-content">{{reservation.hasPsychiatricHistory ? '是' : '否'}}</label>
                </div>
                <div class="form-group" v-if="reservation.hasPsychiatricHistory">
                  <label class="form-label">医院</label>
                  <label class="label-content">{{reservation.hospital}}</label>
                </div>
                <div class="form-group" v-if="reservation.hasPsychiatricHistory">
                  <label class="form-label">医生姓名</label>
                  <label class="label-content">{{reservation.doctor}}</label>
                </div>
                <div class="form-group" v-if="reservation.hasPsychiatricHistory">
                  <label class="form-label">服用药物</label>
                  <label class="label-content">{{reservation.drug}}</label>
                </div>

              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label class="form-label one-words-difference-margin">家庭精神病史</label>
                  <label class="label-content">{{reservation.psychiatricHistory ? '是' : '否'}}</label>
                </div>
                <div class="form-group">
                  <label class="form-label one-words-difference-margin">是否服用药物</label>
                  <label class="label-content">{{reservation.takeMedicine ? '是' : '否'}}</label>
                </div>
                <div class="form-group">
                  <label class="form-label">是否有咨询记录</label>
                  <label class="label-content">{{reservation.hasConsultingExperience ? '是' : '否'}}</label>
                </div>
                  <div class="form-group" v-if="reservation.hasConsultingExperience">
                  <label class="form-label three-words-difference-margin">咨询时间</label>
                  <label class="label-content">{{reservation.consultingDate}}</label>
                </div>
                <div class="form-group" v-if="reservation.hasConsultingExperience">
                  <label class="form-label three-words-difference-margin">咨询地点</label>
                  <label class="label-content">{{reservation.consultingAddress}}</label>
                </div>
                <div class="form-group" v-if="reservation.hasConsultingExperience">
                  <label class="form-label three-words-difference-margin">咨询主题</label>
                  <label class="label-content">{{reservation.consultingMainContent}}</label>
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
                  <label class="form-label five-words-difference-margin" >状态</label>
                  <label class="label-content">{{statusLabel[reservation.status]}}</label>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label class="form-label one-words-difference-margin">危机评分</label>
                  <label class="label-content">{{reservation.score}}</label>
                </div>
                <div class="form-group">
                  <label class="form-label one-words-difference-margin">咨询记录</label>
                  <label class="label-content">{{reservation.record}}</label>
                </div>
              </div>
            </div>
          </div>
           </el-tab-pane>
           <el-tab-pane label="咨询历史" name="four">
          <div>
            <label class="columns-title">咨询历史</label>
            <v-table
              :url="historyTable.url"
              pagesize="10"
              idField="id"
              :columns="historyTable.columns"
              :paginationShow="false"
              :order="true"
            ></v-table>
          </div>
           </el-tab-pane>
       </el-tabs>
        </div>
      <!-- </GeminiScrollbar> -->
    <!-- </div> -->
    <div slot="modal-footer" class="modal-footer">
       <el-button type="primary" @click="exportToPdf('order')">导出学生预约信息</el-button>
        <el-button type="primary" v-if="reservation.canSeeRecord" @click="exportToPdf('record')">导出咨询记录单</el-button>
      <!-- <button
        type="button"
        class="btn cancel-btn clearBtnBorder"
        :class="{ disabled: exportingToPdf }"
        @click="exportToPdf"
      >{{ exportingToPdf ? '导出中...' : '导出PDF'}}</button>
      <button
        type="button"
        class="btn cancel-btn clearBtnBorder"
        @click="close"
      >取消</button> -->
    </div>
  </v-modal>
</template>

<script>
import { sAjax } from '../../../assets/utils/utils';

export default {
  props: ['reservation'],
  data() {
    return {
      orderHistory: [],
      activeName: 'first',
      visiable: false,
      exportingToPdf: false,
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
      familyMembersDict: {},
      historyTable: {
        url: `/table-data/mentality/reservation/${this.reservation.id}/histories`,
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
            title: "咨询师联系方式",
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
    }
  },
  computed: {
    familyMembersLabel() {
      return this.reservation.familyMembers.map(member => this.familyMembersDict[member]).join(' ')
    }
  },
  created() {
    sAjax({
      url: "/api/system/dicts",
      dataType: "json",
      type: "get",
      data: {
        dictType: "家庭成员类型"
      },
      success: data => {
        if (data.state) {
          for (const dict of data.data) {
            this.familyMembersDict[dict.id] = dict.label
          }
        } else {
          this.$toast(data.message);
        }
      }
    });
    setTimeout(() => {
      this.visiable = true;
    }, 100)
  },
  methods: {
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
             
               this.getPdf(this.reservation.student.name + '预约详情' + new Date().format('yyyy-MM-dd'));
                this.visiable = false;
                this.$emit('close')
            }
           
          }
        })
      }else {
        setTimeout(() => {
          this.getPdf(this.reservation.student.name + '预约详情' + new Date().format('yyyy-MM-dd'));
        },100)
         this.visiable = false;
         this.$emit('close')
        
      }
    },
    // exportToPdf() {
    //   this.exportingToPdf = true;
    //   setTimeout(() => {
    //     this.getPdf(this.reservation.student.name + '预约详情' + new Date().format('yyyy-MM-dd HH:mm:ss'));
    //     this.exportingToPdf = false;
    //   }, 500);
    // },
    close() {
      this.visiable = false;
      this.$emit('close')
    }
  }
}
</script>

<style lang="less">
@import url("../../../assets/common.less");
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
.form-group {
  .form-label {
    min-width: 80px;
    margin-right: 10px;
    text-align: left;
  }
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
</style>

