<template>
  <div class="info-set-container">
    <div :id="pageId" class="student-manage-page">
      <div class="content text-center">
        <v-table
          :title="'学生基本信息'"
          ref="studentTable"
          :url="url"
          pagesize="10"
          idField="id"
          :columns="columns"
          :order="true"
          :search="false"
          :searchParams="definedSearch"
          :columnsControl="true"
        >
          <div slot="btn-group" class="btn-group pull-right" role="group">
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
          ></v-tree>
        </div>
        <div slot="modal-footer" class="modal-footer">
          <button
            type="button"
            class="btn cancel-btn clearBtnBorder"
            @click="showExport = false"
          >{{translate.cancel}}</button>
          <button
            type="button"
            class="btn submit-btn clearBtnBorder"
            @click="exportTable"
          >{{ exportStatus }}</button>
        </div>
      </v-modal>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { sAjax, request, translation } from "../../assets/utils/utils.js";
export default {
  data: function() {
    return {
      columns: [],
      url: "/table-data/fts/student/getStudentList",
      method: "get",
      classList: [],
      gradeList: [],
      definedSearch: {
        studentId: "",
        name: "",
        college: "",
        instructorPhoneNum: "",
        grade: "",
        instructorName: "",
        educationLevel:'',
        idCardNo:'',
        accommodation:'',
        className:'',
        fields: '',
      },
      lang: "zh-cn",
      showExport: false,
      fieldsToExport: [],
      exporting: false,
    };
  },
  created: function() {
    var la = localStorage.getItem("lang");
    if (translation(la)) {
      this.lang = la;
    }
    this.getClassList()
    this.getGradeList()
    this._initColumns();
    this.getStuTree();
  },
  computed: {
    translate: function() {
      return translation(this.lang).infoManage;
    },
    exportStatus: function() {
      return this.exporting ? "导出中" : this.translate.export;
    },
  },
  methods: {
    showExportModal(){
      this.showExport = true;
    },
    getStuTree: function(){
 
      let treeData = [];
      let treeItem = {
          id: 1,
          title: "全选",
          edit: false,
          children: []
        };

        this.columns.forEach((child,index) => {
          treeItem.children.push({
            id: index+1,
            title: child.title,
            disabled: false,
            meta: true, 
          });
        });
        treeData.push(treeItem);
      
      this.fieldsToExport = treeData;
          
    },
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
            data: {
              placeholder: this.translate.studentIdPlaceholder
            }
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
            data: {
              placeholder: this.translate.namePlaceholder
            }
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
          id: "idCardNo",
          title: "身份证号",
          className: "text-left",
          width: 120,
          hidden: false,
          search: {
            type: "input",
          },
        },
        {
          id: "accommodation",
          title: "宿舍",
          className: "text-left",
          width: 80,
          hidden: false,
          search: {
            type: "input",
          },
        },
        {
          id: "instructorName",
          title: "辅导员",
          className: "text-left",
          width: 120,
          hidden: false,
          search: {
            type: "input",
          }
        },
        {
          id: "instructorPhoneNum",
          title: "辅导员电话",
          className: "text-left",
          width: 120,
          hidden: false,
          search: {
            type: "input",
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
    exportTable: function() {
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
        this.definedSearch.instructorPhoneNum = this.$refs.studentTable.tableSearchFields.instructorPhoneNum
        this.definedSearch.instructorName = this.$refs.studentTable.tableSearchFields.instructorName
        this.definedSearch.grade = this.$refs.studentTable.tableSearchFields.grade
        this.definedSearch.idCardNo = this.$refs.studentTable.tableSearchFields.idCardNo
        this.definedSearch.accommodation = this.$refs.studentTable.tableSearchFields.accommodation
        this.definedSearch.className = this.$refs.studentTable.tableSearchFields.className
        this.definedSearch.fields = fields.join(',')

        let url = '/downloads/fts/student/excelOutStudentInfo?'
        for(let k in this.definedSearch) {
          url += `${k}=${this.definedSearch[k]}&`
        }
        url = url.substr(0,url.length-1)
        window.location.href = url;
        this.exporting = false;
        this.showExport = false;
        this.getStuTree();
       
    },
  }
};
</script>

<style lang="less">
@import url("../../assets/common.less");
.flex-align-center {
  display: flex;
  align-items: center;
}
.info-set-container {
  height: 100%;
}
.student-manage-page {
  .instructor-text {
    margin-bottom: 20px;
  }
  .modal-text {
    margin: 0 0 10px -35px;
  }
  .modal-body {
    max-height: 400px;
  }
  .transfer-text {
    margin-top: 20px;
    color: red;
  }
  .transferIn {
    margin-top: 20px;
  }
  .value-datepicker{
    width: 140px;
    top:10px;
    display: inline-block;
  }
  .value-input {
    height: 35px;
    padding-top: 0;
    margin-top: 14px;
    width: 30%;
  }
  .advancedSearch-group .dropdown-menu {
    position: fixed;
    top: auto;
    left: auto;
  }
  .searchOptionsText,
  .requirementOptionsText,
  .relationOptionsText {
    width: 65px;
    text-align: center;
    padding: 6px 0;
    border: 1px solid #eeeeee;
  }
  .inputText {
    width: 136px;
    height: 34px;
    vertical-align: middle;
    margin-top: 3px;
    margin-left: 3px;
    padding: 6px 2px;
    border: 1px solid #eeeeee;
  }
  .deleteBtn {
    color: white;
    background: red;
    border-radius: 100px;
    padding: 3px 12px;
  }
  .addBtn {
    color: white;
    background: #298df7;
    border-radius: 100px;
    padding: 3px 12px;
  }
  .category-list {
    list-style: none;
    padding-left: 20px;
    font-size: 14px;
    margin-bottom: 20px;
    li {
      margin-bottom: 10px;
    }
    .field-name {
      font-weight: 500;
      min-width: 160px;
      display: inline-block;
    }
    .field-value {
      color: #666;
    }
  }

  .category .category-title {
    cursor: pointer;
    font-size: 14px;
    margin-bottom: 20px;
  }

  .category .category-title .expand-handler {
    float: right;
  }

  .category .category-table {
    margin-bottom: 20px;
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
}
</style>
