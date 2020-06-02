
<template>
  <div class="inSchoolInfo container-fluid">
    <div class="row text-center" v-if="!showExport">
        <a type="button" @click="back()" class="box_flex align_center back_wrap">
          <i class="maticon back-icon-btn" v-html="icons('arrow_back')">arrow_back</i><span class="nav-title">返回</span>
        </a>
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
          <div class="label require"><span>成绩:</span></div>
          <input type="text" class="form-control search-input" v-model="addParams['score']" placeholder="请输入成绩">
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
      url: "/table-data/fts/score/getScoreListByUserId?timestamp=",
      timestamp: new Date(),
      columns:[],
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
        score: "",
      },
      require: {schoolYear: '学年',term: '学期',courseName: '课程名称',score: '成绩'},
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
          id: "score",
          title: "成绩",
          className: "text-left",
          width: 100,
          hidden: false,
          search: {
            type: "input",
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
                  this.addParams.userId = addParams.userId
                  this.addParams.term = addParams.term
                  this.addParams.courseName = addParams.courseName
                  this.addParams.score = addParams.score
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
      if(confirm(`确定删除该学生该科成绩`)){
        
           sAjax({
            url: `/api/fts/score/deleteScoreById?id=${id}`,
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
    addInfoByOne() {
      this.showAddOneInfoModal = true
      this.showAddModal = false
      this.addParams = {
        userId: null,
        schoolYear: "",
        term: "",
        courseName: "",
        score: "",
      }
    },
    batchAddInfo() {//
      this.showExport = true
      this.showAddModal = false
      this.importParams = {
        parentPageTitle: "",
        downloadTemplateUrl: `/fts/score/template`,
        downloadErrorTemplateUrl: `/fts/score/errorFile`,
        checkTemplateUrl: `/fts/score/checkExcel`,
        templateName: "学生期末成绩导入模板",
        importBtnType: [
          {
            url: `/fts/score/addByExcel`,
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
    myIsNaN(value) {
      return typeof value == 'number' && !isNaN(value);
    },
    addOneInfo(){
      this.addParams.userId = this.userInfo.userId
      for (let k in this.require) {
        if(!this.addParams[k]) {
          this.$toast(`${this.require[k]}不能为空`)
          return;
        }
      }
      // if(this.myIsNaN(Number(this.addParams.score))) {
      //   this.$toast(`填写正确成绩`)
      //   return;
      // }
      // this.addParams.score = Number(this.addParams.score)
      // if(Number(this.addParams.score)<0 || !Number.isInteger(this.addParams.score) || Number(this.addParams.score)>100 ) {
      //   this.$toast(`成绩需为0到100的整数`)
      //   return;
      // }

      sAjax({
        url: `/api/fts/score/${this.modalType=='add'?'addScore':'updateScore'}`,
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
  // }
</style>
