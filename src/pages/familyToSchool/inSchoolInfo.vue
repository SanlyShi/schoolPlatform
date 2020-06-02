<!--  -->
<template>
  <div class="inSchoolInfo container-fluid" v-if="!showDetail">
    <div class="row text-center">
        <v-table
          :title="title[type]+'学生信息'"
          ref="studentTable"
          :url="url"
          pagesize="10"
          idField="id"
          :columns="columns"
          :order="true"
          :search="false"
          :searchParams="definedSearch"
        >
          <div slot="btn-group" class="btn-group pull-right" role="group">
            <!-- <button
              class="btn btn-bgColor-style clearBtnBorder"
              @click="showAddModal=true"
            >导入</button> -->
            <button
              class="btn btn-bgColor-style clearBtnBorder"
              @click="showExportModal"
            >批量导出</button>
          </div>
        </v-table>
    </div>
    <v-modal :show="showExport" effect="fade">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">导出</h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <v-tree
          id="resourceTree"
          ref="tree"
          cascade="true"
          :items="fieldsToExport"
          :checkable="true"
          :search="false"
          @clickChild="clickChild"
          @itemClick="ckeckItem"
        ></v-tree>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <div class="input-group merge-table pull-left flex-align-center">
          <span @click="selectAll">
            <i class="maticon role-icon active" v-html="icons('check_box')" v-if="isSelectAll">check_box</i>
            <i
              class="maticon role-icon"
              v-html="icons('check_box_outline_blank')"
              v-else
            >check_box_outline_blank</i>
          </span>
          <span class="role-name">全选</span>
        </div>
        <button
          type="button"
          class="btn cancel-btn clearBtnBorder"
          @click="showExport = false"
        >取消</button>
        <button
          type="button"
          class="btn submit-btn clearBtnBorder"
          @click="exportTable"
        >导出</button>
      </div>
    </v-modal>
  </div>
  <div v-else>
    
    <score-detail v-if="this.type=='score'" :userInfo="record" @back="back"></score-detail>
    <attendance-detail v-else-if="this.type=='attendance'" :userInfo="record" @back="back"></attendance-detail>
    <reward-punishment v-else-if="this.type=='rewardPunishment'" :userInfo="record" @back="back"></reward-punishment>
  </div>
</template>

<script>
import Vue from "vue";
import importTable from "../../mixins/import.js";
import { sAjax, request, translation } from "../../assets/utils/utils.js";
import scoreDetail from "./detail/scoreDetail.vue";
import attendanceDetail from "./detail/attendanceDetail.vue";
import rewardPunishment from "./detail/rewardPunishmentDetail.vue";
export default {
  mixins: [importTable],
  props: {
    data: {
      default: null
    },
  },
  components: {
    scoreDetail,
    attendanceDetail,
    rewardPunishment,
  },
  data () {
    return { 
      type: "",
      title: {
        score: '期末成绩',
        attendance: '考勤信息',
        rewardPunishment: '奖惩信息',
      },
      url: "/table-data/fts/student/getStudentList",
      columns:[],
      definedSearch: {
        studentId: "",
        name: "",
        college: "",
        grade: "",
        educationLevel:'',
        className:'',
        fields: '',
      },
      lang: "zh-cn",
      isSelectAll: false,
      showExport: false,
      fieldsToExport: [],
      exporting: false,
      treeIndexArr: [],
      treeInfo: {
        score: ["学年","学期","课程名称","成绩",],
        attendance: ["学年","学期","课程名称","时间",],
        rewardPunishment: ["奖励名称","奖励学年","评定日期","处分程度","处分日期","处分撤销时间",],
      },
      showDetail: false,
      showAddModal: false,
      showAddOnePersonModal: false,
      addPersonParams: {},
      record: {},
    }
  },
  computed: {
    exportStatus: function() {
      return this.exporting ? "导出中" : this.translate.export;
    },
    isSelectAll: function() {
      if(this.treeIndexArr.length==2) {
        return true;
      } else {
        return false;
      }
    },
  },
  watch: {
    treeIndexArr(val){
      console.log(val)
      if(val.length==2) {
        this.isSelectAll = true;
      } else {
        this.isSelectAll = false;
      }
    },
  },
  created () { 
    this.type = this.$route.query.type
    this.getClassList()
    this.getGradeList()
    this._initColumns();
    this.getStuTree()
  },
  mounted () { },
  methods: { 
    _initColumns: function() {
      this.columns = [
        {
          id: "studentId",
          title: "学号",
          className: "text-left",
          width: 120,
          hidden: false,
          search: {
            type: "input",
          }
        },
        {
          id: "name",
          title: "姓名",
          className: "text-left",
          width: 80,
          hidden: false,
          search: {
            type: "input",
          }
        },
        {
          id: "college",
          title: "学院",
          className: "text-left",
          width: 120,
          hidden: false,
          search: {
            type: "select",
            data: {
              url: `/api/fts/dict/getUnitList`,
              optionsLabel: "label",
              optionsValue: "value",
            }
          }
        },
        {
          id: "educationLevel",
          title: "培养层次",
          className: "text-left",
          width: 100,
          hidden: false,
          search: {
            type: "select",
            data: {
              url: `/api/fts/dict/findDictByTypeName?typeName=培养层次`,
              optionsLabel: "label",
              optionsValue: "value"
            }
          }
        },
        {
          id: "grade",
          title: "年级",
          className: "text-left",
          width: 100,
          hidden: false,
          search: {
            type: "select",
            data: {
              options: this.gradeList,
              optionsLabel: "label",
              optionsValue: "value"
            }
          }
        },
        {
          id: "className",
          title: "班级",
          className: "text-left",
          width: 120,
          hidden: false,
          search: {
            type: "select",
            data: {
              options: this.classList,
              optionsLabel: "label",
              optionsValue: "value"
            }
          },
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
                text: "查看",
                className: "opt-btn",
                // 点击编辑将该字段数据显示到modal中
                callback: (record, index) => {
                  this.record = record
                  this.showDetail = true;
                }
              },
              // {
              //   tag: "a",
              //   text: "删除",
              //   className: "opt-btn",
              //   callback: (record, index) => {
              //     this.deleteInfo(record.userId)
              //   }
              // }
            ];
          }
        }
      ];
      this.url =
        "/table-data/fts/student/getStudentList" +
        "?timestamp=" +
        new Date().getTime();
    },
    getClassList() {
      sAjax({
        url: "/api/fts/dict/getClassList",
        dataType: "json",
        type: "get",
        async: false,
        success: (result) => {
          if (result.state) {
            this.classList = result.data.map(item => {
              return {
                label: item,
                value: item
              }
            });
          }
        }
      });
    },
    getGradeList() {
      sAjax({
        url: "/api/fts/dict/getGradeList",
        dataType: "json",
        type: "get",
        async: false,
        success: (result) => {
          if (result.state) {
            this.gradeList = result.data.map(item => {
              return {
                label: item,
                value: item
              }
            });
          }
        }
      });
    },
    showExportModal(){
      this.showExport = true;
    },
    clickChild(obj) {
      console.log(obj)
      let length = 0;
      let tempObj = JSON.parse(JSON.stringify(obj))

      tempObj.result.forEach(item => {
        if(item.id == tempObj.item.id) {
          item.checked = !tempObj.item.checked
        }
        if(item.checked) {
          length++
        }
      })
      let idx = this.treeIndexArr.findIndex(item => item == tempObj.index)
      if(idx==-1&&length == tempObj.result.length) {
        this.treeIndexArr.push(tempObj.index+1)
      } else if(idx!==-1&&length !== tempObj.result.length) {
        this.treeIndexArr.splice(idx, 1)
      }
    },
    ckeckItem(index,id) {
      console.log(index,id)
      let idx = this.treeIndexArr.findIndex(item => item == index)
      if(idx>-1) {
        this.treeIndexArr.splice(idx, 1)
      } else {
        this.treeIndexArr.push(index)
      }
    },
    selectAll() {
      this.isSelectAll = !this.isSelectAll
      if(this.isSelectAll) {
        this.treeIndexArr = [1,2]
        this.$refs.tree.setAllChecked()
      } else {
        this.$refs.tree.setAllUnchecked()
        this.treeIndexArr = []
      }
      
    },
    getStuTree(){
 
      let treeData = [];
      let treeItem1 = {
          id: 1,
          title: "学生基本信息",
          edit: false,
          children: []
        };

        this.columns.forEach((child,index) => {
          if(child.id == 'opt') {
            return;
          }
          treeItem1.children.push({
            id: index+1,
            title: child.title,
            disabled: false,
            meta: true,
            checked: false,
          });
        });
        treeData.push(treeItem1);
        let treeItem2 = {
          id: 2,
          title: `${this.title[this.type]}信息`,
          edit: false,
          children: []
        };

        this.treeInfo[this.type].forEach((child,index) => {
          treeItem2.children.push({
            id: 6+index+1,
            title: child,
            disabled: false,
            meta: true,
            checked: false,
          });
        });
        treeData.push(treeItem2);
      
      this.fieldsToExport = treeData;
          
    },
    exportTable() {
      let that = this;
      if (this.exporting) {
        return;
      }

      //这里是处理导出表的字段
      let checkedItems = this.$refs.tree.getChecked();
      let fields = [];
      checkedItems.forEach(item => {
        if (!item.meta) {
          return;
        }
        if (!item.checked) {
          return;
        }
        fields.push(item.id);
      });

      if (!fields.length) {
        return that.$toast("请勾选至少一个字段");
      }

      this.exporting = true;
        this.definedSearch.studentId = this.$refs.studentTable.tableSearchFields.studentId
        this.definedSearch.name = this.$refs.studentTable.tableSearchFields.name
        this.definedSearch.college = this.$refs.studentTable.tableSearchFields.college
        this.definedSearch.educationLevel = this.$refs.studentTable.tableSearchFields.educationLevel
        this.definedSearch.grade = this.$refs.studentTable.tableSearchFields.grade
        this.definedSearch.className = this.$refs.studentTable.tableSearchFields.className
        this.definedSearch.fields = fields.join(',')

        let url = `/downloads/fts/${this.type}/excelOutStudentAnd${this.type.charAt(0).toUpperCase()+this.type.slice(1)}?`
        for(let k in this.definedSearch) {
          url += `${k}=${this.definedSearch[k]}&`
        }
        url = url.substr(0,url.length-1)
        window.location.href = url;
        this.exporting = false;
        this.showExport = false;
        this.getStuTree();
       
    },
    deleteInfo(userId) {
      if(confirm(`确定删除该学生${this.title[this.type]}`)){
        let name = [this.type]
        if(this.type == "rewardPunishment") {
          name = ["reward", "punishment"]
        }
        name.map(item => {
           sAjax({
            url: `/api/fts/${this.type}/delete${item.charAt(0).toUpperCase() + item.slice(1)}ByUserId?userId=${userId}`,
            dataType: "json",
            type: 'post',
            async: false,
            success: (result) => {
              if (result.state) {
                this.$toast("删除成功！")
              }
            }
          });
        })
       
      }
    },
    back() {
      this.showDetail = false
    }
  }
}
</script>

<style scoped>
  .maticon {
    cursor: default;
  }
</style>
