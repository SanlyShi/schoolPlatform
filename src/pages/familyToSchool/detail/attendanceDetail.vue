
<template>
  <div class="inSchoolInfo container-fluid">
    <div class="row" v-if="!showExport">
        <a type="button" @click="back()" class="box_flex align_center back_wrap">
          <i class="maticon back-icon-btn" v-html="icons('arrow_back')">arrow_back</i><span class="nav-title">返回</span>
        </a>
        <div class="tab-div">
          <div v-for="(item, index) in tabbar" :key="index" class="tab" :class="currentTab == index ? 'active' : ''" @click="selectTab(index)">{{item.name}}</div>
        </div>
        <v-table
          ref="studentTable"
          :url="url+timestamp+'&userId='+userInfo.userId+'&type='+tabbar[currentTab].type"
          pagesize="10"
          idField="id"
          :columns="columns"
          :order="false"
          :search="false"
        >
          <div slot="btn-group" role="group">
            <div class="btn-group pull-left">
              <div class="user-info">
                <span>{{userInfo.name}}</span>
                <span>{{userInfo.studentId}}</span>
                <span style="color: #999;font-size:12px;">本页数据截止至前一天</span>
              </div>
            </div>
            <div class="btn-group pull-right">
              <button
                class="btn btn-bgColor-style clearBtnBorder"
                @click="showAddModal=true;modalType='add'"
              >新增</button>
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
        <button type="button" class="btn submit-btn clearBtnBorder" @click="addInfoByOne" style="width:380px;text-align:center">单条增加</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="batchAddInfo()" style="width:380px;text-align:center;margin-top:20px;">批量导入</button>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="showAddModal = false">取消</button>
      </div>
    </v-modal>
    <v-modal :show="showAddOneInfoModal" effect="fade" width="460">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
          {{modalType=='add'?'新增':'编辑'}}
        </h5>
      </div>
      <div slot="modal-body" class="modal-body container-fluid" style="overflow: inherit;">
        <div class="form-group box_flex align_center">
          <div class="label require"><span>考勤类型:</span></div>
          <v-select :options="tabbar" disabled="true" options-value="type" options-label="name" close-on-select justify v-model="addParams['type']"></v-select>
        </div>
        <div class="form-group box_flex align_center">
          <div class="label require"><span>学年:</span></div>
          <v-select :options="schoolYearList" options-value="value" options-label="label" close-on-select justify v-model="addParams['schoolYear']"></v-select>
        </div>
        <div class="form-group box_flex align_center">
          <div class="label require"><span>学期:</span></div>
          <v-select :options="termList" options-value="value" options-label="label" close-on-select justify v-model="addParams['term']"></v-select>
        </div>
        <div class="form-group box_flex align_center">
          <div class="label require"><span>课程名称:</span></div>
          <input type="text" class="form-control search-input" v-model="addParams['courseName']" placeholder="请输入课程名称">
        </div>
        <div class="form-group box_flex align_center">
          <div class="label require"><span>时间:</span></div>
          <!-- <input type="text" maxlength="3" class="form-control search-input" v-model="addParams['happenTime']"> -->
          <v-datepicker v-model="addParams['happenTime']" @daySelected="_daySelected"></v-datepicker>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="showAddOneInfoModal = false">取消</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="addOneInfo">确定</button>
      </div>
    </v-modal>
    <div v-if="showExport">
      <v-import
        v-bind="importParams"
        @backParentPage="showExport = false">
      </v-import>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import importTable from "../../../mixins/import.js";
import { sAjax, request, translation } from "../../../assets/utils/utils.js";
export default {
  mixins: [importTable],
  props: {
    userInfo: {
      default: null,
    }
  },
  data () {
    return { 
      url: "/table-data/fts/attendance/getAttendanceListByUserId?timestamp=",
      timestamp: new Date(),
      columns:[],
      tabbar: [
        {name: '缺勤记录', type: 'ABSENT'},
        {name: '请假记录', type: 'LEAVE'},
      ],
      currentTab: 0,
      lang: "zh-cn",
      isSelectAll: false,
      showExport: false,
      fieldsToExport: [],
      exporting: false,
      showAddModal: false,
      showAddOneInfoModal: false,
      addParams: {
        userId: null,
        schoolYear: "",
        term: "",
        courseName: "",
        happenTime: "",
      },
      require: {type:'考勤类型', schoolYear: '学年',term: '学期',courseName: '课程名称',happenTime: '时间'},
      schoolYearList: [],
      termList: [
        {label: '1', value: '1'},
        {label: '2', value: '2'},
      ],
      modalType: 'add',
    }
  },
  created () { 
    this.getSchoolYear();
    this._initColumns();
  },
  mounted () { },
  methods: { 
    selectTab(index) {
      this.currentTab = index
    },
    _initColumns: function() {
      this.columns = [
        {
          id: "schoolYear",
          title: "学年",
          className: "text-left",
          width: 120,
          hidden: false,
          search: {
            type: "select",
            data: {
              options: this.schoolYearList,
              optionsLabel: "label",
              optionsValue: "value",
            }
          }
        },
        {
          id: "term",
          title: "学期",
          className: "text-left",
          width: 80,
          hidden: false,
          search: {
            type: "select",
            data: {
              options: this.termList,
              optionsLabel: "label",
              optionsValue: "value",
            }
          }
        },
        {
          id: "courseName",
          title: "课程名称",
          className: "text-left",
          width: 120,
          hidden: false,
          search: {
            type: "input",
          }
        },
        {
          id: "happenTime",
          title: "时间",
          className: "text-left",
          width: 100,
          hidden: false,
          search: {
            type: "datetime",
            data: {
              dateFormat: 'yyyy-MM-dd',
              change: ({ value, target }) => {
                this.url = `/table-data/fts/attendance/getAttendanceListByUserId?happenTimeBegin=${
                  this.$refs.studentTable.tableSearchFields["happenTime_start"]?this.$refs.studentTable.tableSearchFields["happenTime_start"].substr(0,10):''
                }&happenTimeEnd=${
                  this.$refs.studentTable.tableSearchFields["happenTime_end"]?this.$refs.studentTable.tableSearchFields["happenTime_end"].substr(0,10):''
                }&timestamp=`;
              }
            }
          }
        },
        {
          id: "opt",
          className: "text-left",
          title: "操作",
          width: 120,
          hidden: false,
          formatter: () => {
            return [
              {
                tag: "a",
                // 编辑
                text: "编辑",
                className: "opt-btn",
                // 点击编辑将该字段数据显示到modal中
                callback: (record, index) => {
                  this.modalType='edit'
                  let addParams = JSON.parse(JSON.stringify(record))
                  this.addParams.id = addParams.id
                  this.addParams.type = addParams.type
                  this.addParams.userId = addParams.userId
                  this.addParams.term = addParams.term
                  this.addParams.courseName = addParams.courseName
                  this.addParams.happenTime = addParams.happenTime
                  this.addParams.schoolYear = this.schoolYearList.find(item => item.label == record.schoolYear).value
                  this.showAddOneInfoModal = true
                }
              },
              {
                tag: "a",
                text: "删除",
                className: "opt-btn",
                callback: (record, index) => {
                  this.deleteInfo(record.id)
                }
              }
            ];
          }
        }
      ];
    },
    getSchoolYear() {
      sAjax({
        url: "/api/fts/dict/findDictByTypeName?typeName=学年",
        dataType: "json",
        type: "get",
        async: false,
        success: (result) => {
          if (result.state) {
            this.schoolYearList = result.data.map(item => {
              return {
                label: item.label,
                value: item.value
              }
            });
          }
        }
      });
    },
    back() {
      this.$emit('back')
    },
    deleteInfo(id) {
      if(confirm(`确定删除该学生该${this.tabbar[this.currentTab].name}`)){
        
           sAjax({
            url: `/api/fts/attendance/deleteAttendanceById?id=${id}`,
            dataType: "json",
            type: 'post',
            async: false,
            success: (result) => {
              if (result.state) {
                this.timestamp = new Date().getTime()
                this.$toast("删除成功！")
              }
            }
          });
       
      }
    },
    _daySelected(obj) {
      this.addParams.happenTime = obj.value.substr(0, 10)
    },
    addInfoByOne() {
      this.showAddOneInfoModal = true
      this.showAddModal = false
      this.addParams = {
        userId: null,
        type: this.tabbar[this.currentTab].type,
        schoolYear: "",
        term: "",
        courseName: "",
        happenTime: "",
      }
    },
    batchAddInfo() {//
      this.showExport = true
      this.showAddModal = false
      this.importParams = {
        parentPageTitle: "",
        downloadTemplateUrl: `/fts/attendance/template`,
        downloadErrorTemplateUrl: `/fts/score/errorFile`,
        checkTemplateUrl: `/fts/attendance/checkExcel`,
        templateName: "学生考勤信息导入模板",
        importBtnType: [
          {
            url: `/fts/attendance/addByExcel`,
            method: "post",
            isShowBtn: true,
            name: "增量导入",
            success: data => {
              this.timestamp = new Date().getTime();
              this.showExport = false;
            }
          }
        ]
      };
      this.quickAddRecord()
    },
    addOneInfo(){
      this.addParams.userId = this.userInfo.userId
      for (let k in this.require) {
        if(!this.addParams[k]) {
          this.$toast(`${this.require[k]}不能为空`)
          return;
        }
      }
      sAjax({
        url: `/api/fts/attendance/${this.modalType=='add'?'addAttendance':'updateAttendance'}`,
        dataType: "json",
        type: 'post',
        data: this.addParams,
        async: false,
        success: (result) => {
          if (result.state) {
            this.showAddOneInfoModal = false
            this.timestamp = new Date().getTime()
            this.$toast(`${this.modalType=='add'?'新增':'编辑'}成功！`)
          } else {
            this.$toast(result.message)
          }
        }
      });
    },
  }
}
</script>

<style lang="less" scoped>
  .maticon {
    cursor: default;
  }
  .user-info {
    font-size: 18px;
    color: #333;
    span {
      padding: 0 10px;
    }
  }
  // .form-wrap {
  //   width: 100%;
  //   flex-wrap: wrap;
    .form-group {
      margin-right: 20px;
      .label {
        width: 140px;
        font-size: 14px;
        color: #666;
        text-align: right;
        padding-left: 12px;
        padding-right: 12px;
      }
      .v-select,
      .form-control,
      .v-datepicker,
      .ditection {
        width: 200px;
        &.long-input {
          width: 600px;
        }
      }
    }
    .tab-div {
      position: relative;
      height: 40px;
      margin: 10px 0px 0;
      background: white;
      white-space: nowrap;
      border-bottom: 1px solid #f0f0f0;
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
  // }
</style>
