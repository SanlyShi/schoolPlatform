<template>
  <div class="info-set-container">
    <div :id="pageId" class="student-manage-page">
      <div class="content text-center">
        <v-table :title="'学生家长账号管理'" ref="studentTable" :url="url+timestamp" pagesize="10" idField="id" :columns="columns" :order="true" :search="false" :searchParams="definedSearch" :columnsControl="true">
          <div slot="btn-group" class="btn-group pull-right" role="group">
            <button class="btn btn-bgColor-style clearBtnBorder" @click="showExportModal">批量导出</button>
          </div>
        </v-table>
      </div>
      <v-modal :show="showExport" effect="fade">
        <div slot="modal-header" class="modal-header">
          <h5 class="modal-title">导出</h5>
        </div>
        <div slot="modal-body" class="modal-body">
          <v-tree id="resourceTree" ref="tree" cascade="true" :items="fieldsToExport" :checkable="true" :search="false"></v-tree>
        </div>
        <div slot="modal-footer" class="modal-footer">
          <button type="button" class="btn cancel-btn clearBtnBorder" @click="showExport = false">{{translate.cancel}}</button>
          <button type="button" class="btn submit-btn clearBtnBorder" @click="exportTable">{{ exportStatus }}</button>
        </div>
      </v-modal>
      <v-modal :show="showModal" effect="fade" width="460">
        <div slot="modal-header" class="modal-header">
          <h5 class="modal-title">
            {{modalType=='add'?'新增':'编辑'}}
          </h5>
        </div>
        <div slot="modal-body" class="modal-body container-fluid" style="overflow: inherit;">
          <div class="form-group box_flex align_center">
            <div class="label require"><span>家长账号:</span></div>
            <!-- <el-select v-model="pIdx" @change="marjorTypeChange">
                <el-option v-for="(item,index) in pAcchountList" :key="index" :label='item.label' :value='item.label'></el-option>
            </el-select> -->
            <v-select :options="pAcchountList" options-value="value" options-label="label" :value="pIdx" justify @afterSelected="afterSelected"></v-select>
          </div>
          <div class="form-group box_flex align_center">
            <div class="label"><span>家长姓名:</span></div>
            <input type="text" class="form-control search-input" v-model="curStudent[parentInfo[pIdx].name]"  disabled="true">
          </div>
          <div class="form-group box_flex align_center">
            <div class="label"><span>家长关系:</span></div>
            <input type="text" class="form-control search-input" v-model="curStudent[parentInfo[pIdx].relation]"  disabled="true">
          </div>
          <div class="form-group box_flex align_center">
            <div class="label"><span>家长电话:</span></div>
            <input type="text" class="form-control search-input" v-model="curStudent[parentInfo[pIdx].phone]" disabled="true">
          </div>
        </div>
        <div slot="modal-footer" class="modal-footer">
          <button type="button" class="btn cancel-btn clearBtnBorder" @click="showModal = false">取消</button>
          <button type="button" class="btn submit-btn clearBtnBorder" @click="reset">确定</button>
        </div>
      </v-modal>
    </div>
  </div>
</template>

<script>
  import Vue from "vue";
  import {
    sAjax,
    request,
    translation
  } from "../../assets/utils/utils.js";
  export default {
    data: function() {
      return {
        columns: [],
        url: "/table-data/fts/user/getUserAccountList?timestamp=",
        method: "get",
        timestamp: new Date().getTime(),
        classList: [],
        gradeList: [],
        definedSearch: {
          studentId: "",
          name: "",
          college: "",
          grade: "",
          educationLevel: '',
          idCardNo: '',
          className: '',
          isRegister: '',
          familyName: '',
          relation: '',
          familyPhoneNum: '',
          familyNameAnother: '',
          relationAnother: '',
          familyUserIdAnother: '',
          fields: '',
        },
        lang: "zh-cn",
        showExport: false,
        fieldsToExport: [],
        exporting: false,
        showModal: false,
        curStudent: {},
        relationList: [
          {value: "FATHER",label:"父亲"},
          {value: "MOTHER",label:"母亲"}
        ],
        registerList: [
          {value: "1",label:"已注册"},
          {value: "0",label:"未注册"}
        ],
        curParent: [],
        parentInfo: [
          {id: "familyUserId", name: "familyName", relation: "relation", phone: "familyPhoneNum"},
          {id: "familyUserIdAnother", name: "familyNameAnother", relation: "relationAnother", phone: "familyPhoneNumAnother"},
        ],
        pAcchountList: [],
        pIdx: "0",
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
      showExportModal() {
        this.showExport = true;
      },
      getStuTree: function() {
  
        let treeData = [];
        let treeItem = {
          id: 1,
          title: "全选",
          edit: false,
          children: []
        };
  
        this.columns.forEach((child, index) => {
          if (child.id == 'opt') {
            return;
          }
          treeItem.children.push({
            id: index + 1,
            title: child.title,
            disabled: false,
            meta: true,
          });
        });
        treeData.push(treeItem);
  
        this.fieldsToExport = treeData;
  
      },
      _initColumns: function() {
        this.columns = [{
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
            width: 100,
            hidden: false,
            search: {
              type: "input",
            }
          },
          {
            id: "idCardNo",
            title: "身份证",
            className: "text-left",
            width: 160,
            hidden: false,
            search: {
              type: "input",
            }
          },
          {
            id: "isRegister",
            title: "是否注册家长账号",
            className: "text-left",
            width: 120,
            hidden: false,
            search: {
              type: "select",
              data: {
                options: this.registerList,
                optionsLabel: "label",
                optionsValue: "value",
              }
            },
          },
          {
            id: "familyName",
            title: "家长姓名1",
            className: "text-left",
            width: 120,
            hidden: false,
            search: {
              data: {
                placeholder: "家长姓名",
              },
              type: "input",
            }
          },
          {
            id: "relation",
            title: "家长关系1",
            className: "text-left",
            width: 120,
            hidden: false,
            search: {
              type: "select",
              data: {
                options: this.relationList,
                optionsLabel: "label",
                optionsValue: "value",
                placeholder: "家长关系",
              }
            },
          },
          {
            id: "familyPhoneNum",
            title: "家长账号1",
            className: "text-left",
            width: 120,
            hidden: false,
            search: {
              data: {
                placeholder: "家长账号",
              },
              type: "input",
            }
          },
          {
            id: "familyNameAnother",
            title: "家长姓名2",
            className: "text-left",
            width: 120,
            hidden: false,
            // search: {
            //   type: "input",
            // }
          },
          {
            id: "relationAnother",
            title: "家长关系2",
            className: "text-left",
            width: 120,
            hidden: false,
            // search: {
            //   type: "select",
            //   data: {
            //     options: this.relationList,
            //     optionsLabel: "label",
            //     optionsValue: "value",
            //   }
            // },
          },
          {
            id: "familyPhoneNumAnother",
            title: "家长账号2",
            className: "text-left",
            width: 120,
            hidden: false,
            // search: {
            //   type: "input",
            // }
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
            hidden: true,
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
            hidden: true,
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
            title: "操作",
            className: "text-left",
            width: 80,
            hidden: false,
            options: [{
              tag: "a",
              text: "重置",
              callback: (record, index) => {
                this.pAcchountList = []
                this.pIdx = "0"
                if (record.familyUserId) {
                  this.curStudent = record
                  if(record.familyUserId) {
                    this.pAcchountList.push({value:"0", label: "家长账号1"})
                  }
                  if(record.familyUserIdAnother) {
                    this.pAcchountList.push({value:"1", label: "家长账号2"})
                  }
                  this.showModal = true
                } else if (confirm("该生还未绑定家长账号，无法重置！")) {
  
                }
              }
            }]
          }
        ];
      },
      filterRelation(str) {
        return str == "FATHER" ? "父亲" :str == "MOTHER" ? "母亲" : str;
      },
      reset() {
        if (confirm("确定重置该学生家长信息吗？重置后数据将无法恢复!")) {
          console.log(this.curStudent[this.parentInfo[this.pIdx].id])
          sAjax({
            url: "/api/fts/user/resetUser?userId=" + this.curStudent[this.parentInfo[this.pIdx].id],
            type: 'post',
            success: data => {
              if (data.state) {
                this.timestamp = new Date().getTime()
                this.showModal = false
              } else {
                this.$toast(data.message);
              }
            }
          })
        }
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
      afterSelected(record) {
        if(record.val) {
          this.pIdx = record.val
        }
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
        this.definedSearch.grade = this.$refs.studentTable.tableSearchFields.grade
        this.definedSearch.idCardNo = this.$refs.studentTable.tableSearchFields.idCardNo
        this.definedSearch.className = this.$refs.studentTable.tableSearchFields.className
        this.definedSearch.isRegister = this.$refs.studentTable.tableSearchFields.isRegister
        this.definedSearch.familyName = this.$refs.studentTable.tableSearchFields.familyName
        this.definedSearch.relation = this.$refs.studentTable.tableSearchFields.relation
        this.definedSearch.familyPhoneNum = this.$refs.studentTable.tableSearchFields.familyPhoneNum
        this.definedSearch.familyNameAnother = this.$refs.studentTable.tableSearchFields.familyNameAnother
        this.definedSearch.relationAnother = this.$refs.studentTable.tableSearchFields.relationAnother
        this.definedSearch.familyUserIdAnother = this.$refs.studentTable.tableSearchFields.familyUserIdAnother
        this.definedSearch.fields = fields.join(',')
  
        let url = '/downloads/fts/user/excelOutUserAccount?'
        for (let k in this.definedSearch) {
          url += `${k}=${this.definedSearch[k]}&`
        }
        url = url.substr(0, url.length - 1)
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
    .value-datepicker {
      width: 140px;
      top: 10px;
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
    
  }
</style>
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
