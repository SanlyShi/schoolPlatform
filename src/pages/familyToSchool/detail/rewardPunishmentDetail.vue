
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
          :url="url+timestamp+'&userId='+userInfo.userId"
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
          <div class="label require"><span>奖惩类型:</span></div>
          <v-select :options="tabbar" options-value="type" disabled="true" options-label="name" close-on-select justify v-model="tabbar[currentTab].type"></v-select>
        </div>
        <div v-if="currentTab==0">
          <div class="form-group box_flex align_center">
            <div class="label require"><span>奖励名称:</span></div>
            <input type="text" class="form-control search-input" v-model="addParams[tabbar[currentTab].type]['name']" placeholder="请输入奖励名称">
          </div>
          <div class="form-group box_flex align_center">
            <div class="label require"><span>奖励学年:</span></div>
            <v-select :options="schoolYearList" options-value="value" options-label="label" close-on-select justify v-model="addParams[tabbar[currentTab].type]['schoolYear']"></v-select>
          </div>
          <div class="form-group box_flex align_center">
            <div class="label require"><span>评定日期:</span></div>
            <v-datepicker v-model="addParams[tabbar[currentTab].type]['evaluateTime']" @daySelected="_daySelectedEvaluateTime"></v-datepicker>
          </div>
          <div class="form-group box_flex align_center">
            <div class="label"><span>奖励级别:</span></div>
            <v-select :options="levelList" options-value="value" options-label="label" close-on-select justify v-model="addParams[tabbar[currentTab].type]['level']"></v-select>
          </div>
        </div>
        <div v-else>
          <div class="form-group box_flex align_center">
            <div class="label require"><span>处分程度:</span></div>
            <v-select :options="degreeList" options-value="value" options-label="label" close-on-select justify v-model="addParams[tabbar[currentTab].type]['degree']"></v-select>
          </div>
          <div class="form-group box_flex align_center">
            <div class="label require"><span>处分日期:</span></div>
            <v-datepicker v-model="addParams[tabbar[currentTab].type]['punishmentTime']" @daySelected="_daySelectedPunishmentTime"></v-datepicker>
          </div>
          <div class="form-group box_flex align_center">
            <div class="label mt-66 require"><span>处分原因:</span></div>
            <v-textarea style="width: 250px;" v-model="addParams[tabbar[currentTab].type]['reason']" :autoHeight="true"  :rows="4" placeholder="请输入处分原因" :maxLength="200"></v-textarea>
          </div>
          <div class="form-group box_flex align_center">
            <div class="label"><span>处分撤销时间:</span></div>
            <v-datepicker v-model="addParams[tabbar[currentTab].type]['revokeTime']" @daySelected="_daySelectedRevokeTime"></v-datepicker>
          </div>
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
      url: "/table-data/fts/rewardPunishment/getRewardListByUserId?timestamp=",
      timestamp: new Date(),
      columns:[],
      tabbar: [
        {name: '奖励记录', type: 'Reward'},
        {name: '处分记录', type: 'Punishment'},
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
        Reward: {
          userId: null,
          schoolYear: "",
          name:"",
          evaluateTime:"",
          level:"",
        },
        Punishment: {
          userId:null,
          degree:"",
          reason:"",
          revokeTime:"",
          punishmentTime:"",
        }
      },
      require: {
        Reward:{schoolYear: '奖励学年',name: '奖励名称',evaluateTime: '评定日期'},
        Punishment:{degree: '处分程度',punishmentTime: '处分时间',reason: '处分原因'},
      },
      schoolYearList: [],
      levelList: [],
      degreeList: [],
      termList: [
        {label: '1', value: '1'},
        {label: '2', value: '2'},
      ],
      modalType: 'add',
    }
  },
  created () { 
    this.getSchoolYear();
    this.getLevel();
    this.getDegree();
    this._initColumns();
  },
  mounted () { },
  methods: { 
    selectTab(index) {
      this.currentTab = index
      this._initColumns()
      this.url = `/table-data/fts/rewardPunishment/get${this.tabbar[this.currentTab].type}ListByUserId?timestamp=`
    },
    _initColumns: function() {
      
      this.columns = this.tabbar[this.currentTab].type=="Reward" ? [
        {
          id: "name",
          title: "奖励名称",
          className: "text-left",
          width: 120,
          hidden: false,
          search: {
            type: "input",
          }
        },
        {
          id: "schoolYear",
          title: "奖励学年",
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
          id: "evaluateTime",
          title: "评定日期",
          className: "text-left",
          width: 100,
          hidden: false,
          search: {
            type: "datetime",
            data: {
              dateFormat: 'yyyy-MM-dd',
              change: ({ value, target }) => {
                this.url = `/table-data/fts/rewardPunishment/get${this.tabbar[this.currentTab].type}ListByUserId?evaluateTimeBegin=${
                  this.$refs.studentTable.tableSearchFields["evaluateTime_start"]?this.$refs.studentTable.tableSearchFields["evaluateTime_start"].substr(0,10):''
                }&evaluateTimeEnd=${
                  this.$refs.studentTable.tableSearchFields["evaluateTime_end"]?this.$refs.studentTable.tableSearchFields["evaluateTime_end"].substr(0,10):''
                }&timestamp=`;
              }
            }
          }
        },
        {
          id: "level",
          title: "奖励级别",
          className: "text-left",
          width: 120,
          hidden: false,
          search: {
            type: "select",
            data: {
              options: this.levelList,
              optionsLabel: "label",
              optionsValue: "value",
            }
          }
        },
      ]:[
         {
          id: "degree",
          title: "处分程度",
          className: "text-left",
          width: 120,
          hidden: false,
          search: {
            type: "select",
            data: {
              options: this.degreeList,
              optionsLabel: "label",
              optionsValue: "value",
            }
          }
        },
        {
          id: "reason",
          title: "处分原因",
          className: "text-left",
          width: 250,
          hidden: false,
          search: {
            type: "input",
          }
        },
        {
          id: "punishmentTime",
          title: "处分日期",
          className: "text-left",
          width: 120,
          hidden: false,
          search: {
            type: "datetime",
            data: {
              dateFormat: 'yyyy-MM-dd',
              change: ({ value, target }) => {
                this.url = `/table-data/fts/rewardPunishment/get${this.tabbar[this.currentTab].type}ListByUserId?punishmentTimeBegin=${
                  this.$refs.studentTable.tableSearchFields["punishmentTime_start"]?this.$refs.studentTable.tableSearchFields["punishmentTime_start"].substr(0,10):''
                }&punishmentTimeEnd=${
                  this.$refs.studentTable.tableSearchFields["punishmentTime_end"]?this.$refs.studentTable.tableSearchFields["punishmentTime_end"].substr(0,10):''
                }&timestamp=`;
              }
            }
          }
        },
        {
          id: "revokeTime",
          title: "处分撤销时间",
          className: "text-left",
          width: 100,
          hidden: false,
          search: {
            type: "input",
          }
        },
      ]
      this.columns.push(
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
                  this.addParams[this.tabbar[this.currentTab].type] = this.currentTab==0 ? {
                      id: addParams.id,
                      schoolYear: this.schoolYearList.find(item => item.label == record.schoolYear).value,
                      name:addParams.name,
                      evaluateTime:addParams.evaluateTime,
                      level:this.levelList.find(item => item.label == record.level).value,
                    } : {
                      id: addParams.id,
                      degree:this.degreeList.find(item => item.label == record.degree).value,
                      reason:addParams.reason,
                      revokeTime:addParams.revokeTime,
                      punishmentTime:addParams.punishmentTime,
                    }
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
        })
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
          } else {
            this.$toast(result.message)
          }
        }
      });
    },
    getLevel() {
      sAjax({
        url: "/api/fts/dict/findDictByTypeName?typeName=奖励级别",
        dataType: "json",
        type: "get",
        async: false,
        success: (result) => {
          if (result.state) {
            this.levelList = result.data.map(item => {
              return {
                label: item.label,
                value: item.value
              }
            });
          } else {
            this.$toast(result.message)
          }
        }
      });
    },
    getDegree() {
      sAjax({
        url: "/api/fts/dict/findDictByTypeName?typeName=处分程度",
        dataType: "json",
        type: "get",
        async: false,
        success: (result) => {
          if (result.state) {
            this.degreeList = result.data.map(item => {
              return {
                label: item.label,
                value: item.value
              }
            });
          } else {
            this.$toast(result.message)
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
            url: `/api/fts/rewardPunishment/delete${this.tabbar[this.currentTab].type}ById?id=${id}`,
            dataType: "json",
            type: 'post',
            async: false,
            success: (result) => {
              if (result.state) {
                this.timestamp = new Date().getTime()
                this.$toast("删除成功！")
              } else {
                this.$toast(result.message)
              }
            }
          });
       
      }
    },
    _daySelectedEvaluateTime(obj) {
      this.addParams.Reward.evaluateTime = obj.value.substr(0, 10)
    },
    _daySelectedRevokeTime(obj) {
      this.addParams.Punishment.revokeTime = obj.value.substr(0, 10)
    },
    _daySelectedPunishmentTime(obj) {
      this.addParams.Punishment.punishmentTime = obj.value.substr(0, 10)
    },
    addInfoByOne() {
      this.showAddOneInfoModal = true
      this.showAddModal = false
      this.addParams = {
        Reward: {
          userId: null,
          schoolYear: "",
          name:"",
          evaluateTime:"",
          level:"",
        },
        Punishment: {
          userId:null,
          degree:"",
          reason:"",
          revokeTime:"",
          punishmentTime:"",
        }
      }
    },
    batchAddInfo() {//
      this.showExport = true
      this.showAddModal = false
      this.importParams = {
        parentPageTitle: "",
        downloadTemplateUrl: `/fts/rewardPunishment/template`,
        downloadErrorTemplateUrl: `/fts/score/errorFile`,
        checkTemplateUrl: `/fts/rewardPunishment/checkExcel`,
        templateName: "学生奖惩信息导入模板",
        importBtnType: [
          {
            url: `/fts/rewardPunishment/addByExcel`,
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
      this.addParams[this.tabbar[this.currentTab].type].userId = this.userInfo.userId
      for (let k in this.require[this.tabbar[this.currentTab].type]) {
        if(!this.addParams[this.tabbar[this.currentTab].type][k]) {
          this.$toast(`${this.require[this.tabbar[this.currentTab].type][k]}不能为空`)
          return;
        }
      }
      let add = `add${this.tabbar[this.currentTab].type}`
      let update = `update${this.tabbar[this.currentTab].type}`
      sAjax({
        url: `/api/fts/rewardPunishment/${this.modalType=='add'?add:update}`,
        dataType: "json",
        type: 'post',
        data: this.addParams[this.tabbar[this.currentTab].type],
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
  .mt-66 {
    margin-top: -66px;
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
      .v-textarea,
      .ditection {
        width: 250px;
        &.long-input {
          width: 600px;
        }
      }
      .v-textarea {
        height: 100px;
        border-radius: 5px;
        padding: 8px;
        padding-bottom: 22px;
        width: 100%;
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
