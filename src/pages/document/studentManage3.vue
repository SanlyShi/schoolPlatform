<template>
  <div class="info-set-container">
    <div :id="pageId" class="student-manage-page" v-show="layoutManageJson.route === 'main'">
      <div class="tab-div">
        <div
          class="tab"
          :class="inSchool ? 'active' : ''"
          title="在校生信息"
          @click="setInSchool(true)"
        >在校生信息</div>
        <div
          class="tab"
          :class="!inSchool ? 'active' : ''"
          title="非在校生信息"
          @click="setInSchool(false)"
        >非在校生信息</div>
      </div>
      <div class="content text-center">
        <v-table
          :title="tableName"
          ref="studentTable"
          :url="url"
          :method="method"
          pagesize="15"
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
              @click="_toExportManage"
              v-if="role === 'school'">
              导出管理
            </button>
            <button
            class="btn btn-bgColor-style clearBtnBorder"
              @click="_toJournal"
              >
              日志
            </button>
            <button
              class="btn btn-bgColor-style clearBtnBorder"
              @click="_showEducationLevelModal"
              v-if="role === 'school'"
            >{{translate.layoutManage}}</button>
            <button
              class="btn btn-bgColor-style clearBtnBorder"
              @click="resetSearchItem();showSearch()"
            >{{translate.advancedSearch}}</button>
            <button
              class="btn btn-bgColor-style clearBtnBorder"
              @click="showExportModal"
            >{{translate.export}}</button>
            <button
              class="btn btn-bgColor-style clearBtnBorder"
              @click="exportStat.show = true"
            >{{translate.exportStat}}</button>
          </div>
        </v-table>
      </div>
      <v-modal :show="advancedSearch.show" effect="fade" width="720">
        <div slot="modal-header" class="modal-header">
          <h5 class="modal-title">{{translate.advancedSearch}}</h5>
        </div>
        <div slot="modal-body" class="modal-body">
          <div
            class="form-group advancedSearch-group"
            v-for="(searchItem, index) in advancedSearch.searchItems"
            :key="'search-item-' + index"
          >
            <v-select
              :options="advancedSearch.columns"
              :value="searchItem.key"
              :search="true"
              :data-index="index"
              @afterSelected="advancedSearchKeySelected"
            ></v-select>
            <v-select
              :options="searchItem.options.relation"
              :value="searchItem.relation"
              :search="true"
              :data-index="index"
              @afterSelected="advancedSearchRelationSelected"
            ></v-select>
            <v-select
              :options="searchItem.options.dictOptions"
              :value="searchItem.value"
              optionsLabel="text"
              optionsValue="id"
              :search="true"
                 :multiple="true"
              :data-index="index"
              @afterSelected="advancedSearchValueSelected"
              v-if="searchItem.isDict"
            ></v-select>
             <v-select
              :options="searchItem.options.province"
              :value="searchItem.province"
              optionsLabel="text"
              optionsValue="id"
              :search="true"
              :multiple="true"
              :data-index="index"
              @afterSelected="advancedSearchProvinceSelected"
              v-if="searchItem.isAddress"
            ></v-select>
            <v-select
              :options="searchItem.options.city"
              :value="searchItem.city"
              optionsLabel="text"
              optionsValue="id"
              :search="true"
              :multiple="true"
              :data-index="index"
              @afterSelected="advancedSearchCitySelected"
              v-if="searchItem.isSelectProvince"
            ></v-select>
            <v-select
              :options="searchItem.options.county"
              :value="searchItem.county"
              optionsLabel="text"
              optionsValue="id"
              :search="true"
              :multiple="true"
              :data-index="index"
              @afterSelected="advancedSearchCountySelected"
              v-if="searchItem.isSelectCity"
            ></v-select>
            <v-datepicker
                ref="datepicker"
                class="btn-block time-picker value-datepicker"
                :value="searchItem.value"
                :clearButton="false"
                :showTime="false"
                :data-index="index"
                @daySelected="advancedSearchDateValue"
                v-if="searchItem.isDate"
            ></v-datepicker>
            <input type="text"
                   class="value-input"
                   v-if="searchItem.isInput"
                   v-model="searchItem.value">
            <!-- <input type="text" class="value-input" v-else v-model="searchItem.value"> -->
            <button
              type="button"
              class="btn deleteBtn clearBtnBorder"
              :data-index="index"
              @click="deleteSearchItem(index)"
            >{{translate.remove}}</button>
          </div>

          <button
            type="button"
            class="btn addBtn clearBtnBorder"
            @click="addSearchItem()"
          >{{translate.addNew}}</button>
        </div>
        <div slot="modal-footer" class="modal-footer">
          <button
            type="button"
            class="btn submit-btn clearBtnBorder"
            @click="resetSearchItem()"
          >{{translate.reset}}</button>
          <button
            type="button"
            class="btn cancel-btn clearBtnBorder"
            @click="advancedSearch.show = false"
          >{{translate.cancel}}</button>
          <button
            type="button"
            class="btn submit-btn clearBtnBorder"
            :class="{disabled: isDisabled}"
            @click="execAdvancedSearch()"
          >{{translate.search}}</button>
        </div>
      </v-modal>
      <v-modal :show="showExport" effect="fade">
        <div slot="modal-header" class="modal-header">
          <h5 class="modal-title">{{translate.export}}</h5>
        </div>
        <div slot="modal-body" class="modal-body">
          <v-tree
            id="resourceTree"
            ref="tree"
            cascade="true"
            :items="fieldsToExport"
            :checkable="true"
            :search="true"
          ></v-tree>
        </div>
        <div slot="modal-footer" class="modal-footer">
          <div class="input-group merge-table pull-left flex-align-center">
            <span @click="isMergeTable = !isMergeTable;">
              <i class="maticon role-icon active" v-html="icons('check_box')" v-if="isMergeTable">check_box</i>
              <i
                class="maticon role-icon"
                v-html="icons('check_box_outline_blank')"
                v-else
              >check_box_outline_blank</i>
            </span>
            <span class="role-name">是否将勾选的字段合并在同个表格</span>
          </div>
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
      <v-modal :show="exportStat.show" effect="fade">
        <div slot="modal-header" class="modal-header">
          <h5 class="modal-title">{{translate.exportStat}}</h5>
        </div>
        <div slot="modal-body" class="modal-body">
          <v-select
            :multiple="true"
            placeholder="全部"
            :options="exportStat.collegeOptions"
            @afterSelected="selectExportStatCollege"
            options-label="text"
            options-value="id"
          ></v-select>
        </div>
        <div slot="modal-footer" class="modal-footer">
          <button
            type="button"
            class="btn cancel-btn clearBtnBorder"
            @click="exportStat.show = false"
          >{{translate.cancel}}</button>
          <button
            type="button"
            class="btn submit-btn clearBtnBorder"
            @click="exportStatToFile"
          >{{ exportStat.exporting ? '导出中' : '导出' }}</button>
        </div>
      </v-modal>
      <v-modal :show="layoutManageJson.educationLevelShow" effect="fade">
        <div slot="modal-header" class="modal-header">
          <h5 class="modal-title">
            请选择需要配置展示布局的培养层次群体
            <!-- {{ translate.setTip}} -->
          </h5>
        </div>
        <div slot="modal-body" class="modal-body">
          <v-select
            v-model="layoutManageJson.educationLevel"
            placeholder="全部"
            :options="layoutManageJson.educationLevelOptions"
            options-label="label"
            options-value="value"
          ></v-select>
        </div>
        <div slot="modal-footer" class="modal-footer">
          <button
            type="button"
            class="btn cancel-btn clearBtnBorder"
            @click="layoutManageJson.educationLevelShow = false"
          >{{translate.cancel}}</button>
          <button
            type="button"
            class="btn submit-btn clearBtnBorder"
            @click="_setLayout()"
          >{{ translate.startSet}}</button>
        </div>
      </v-modal>
    </div>
    <FormSetManage
      :infoSetting="{
        type: 'STUDENT',
        educationLevel: layoutManageJson.educationLevel,
        tabs: layoutManageJson.infoTypes
      }"
      :student="studentBie"
      @back="_closeFormSetting"
      @submit="_saveFormInfo"
      @addNewFenlei="_newFenlei"
      @remove="_removeFenlei"
      @gotoRoleSet="layoutManageJson.route='joinRoleSet'"
      v-show="layoutManageJson.route === 'formSetManage'"
      v-if="layoutManageJson.route !== 'main'"
    ></FormSetManage>
    <studentExportSet v-if="layoutManageJson.route === 'exportSet'"></studentExportSet>
    <JoinRoleSetManage
      :roleSetting="{
        type: 'STUDENT',
        educationLevel: layoutManageJson.educationLevel
      }"
      @back="layoutManageJson.route = 'formSetManage'"
      @submit="_saveRoles"
      v-if="layoutManageJson.route==='joinRoleSet'"
    ></JoinRoleSetManage>
    <div class="preview-container" v-if="layoutManageJson.preview">
      <preview
        :data="layoutManageJson.layoutsJson[layoutManageJson.curInfoId]&&layoutManageJson.layoutsJson[layoutManageJson.curInfoId].components"
        :defaultData="layoutManageJson.instanceJson[layoutManageJson.curInfoId]"
        :log="layoutManageJson.logsJson[layoutManageJson.curInfoId]"
        :script="layoutManageJson.layoutsJson[layoutManageJson.curInfoId]&&layoutManageJson.layoutsJson[layoutManageJson.curInfoId].property&&layoutManageJson.layoutsJson[layoutManageJson.curInfoId].property.script"
        :previewType="'form'"
        :infoSetting="{
          tabs: layoutManageJson.infoTypes,
          curInfoId: layoutManageJson.curInfoId
        }"
        @tabExchange="_initInfoType"
        @submit="_getInfoValue"
        @submitAll="_submitAll"
        @search="_getInfoTypes(null, $event)"
        @back="layoutManageJson.preview = false"
      ></preview>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { sAjax, translation } from "../../assets/utils/utils.js";
import formSetManage from "../workflow/formSetManage.vue";
import exportFile from "../../mixins/export.js";
import { deprecate } from "util";
import studentExportSet from "./studentExportSet.vue";
import advancedSearch from "../../mixins/advancedSearch2.js"
import { setTimeout } from 'timers';
import joinRoleSetManage from '../workflow/joinRoleSetManage.vue'
Vue.component('JoinRoleSetManage', joinRoleSetManage)
Vue.component("FormSetManage", formSetManage);
Vue.component("studentExportSet", studentExportSet);
export default {
  mixins:[exportFile,advancedSearch],//高级搜索所有方法都在里面
  props: {
    data: {
      default: null
    },
    role: {
      default: ""
    },
    xiaostatuszai: {
      default: null
    }
  },
  created: function() {
    if (this.xiaostatuszai == true || this.xiaostatuszai == false) {
      this.xiaoxiao = true;
    }
    var la = localStorage.getItem("lang");
    var that = this;
    sAjax({
      url: "/api/system/dicts?dictType=培养层次",
      dataType: "json",
      type: "get",
      async: false,
      success: function(result) {
        if (result.state) {
          that.educationLevels = result.data;
        }
      }
    });
     sAjax({
      url: "/api/student/manage/manageStudents/schoolStatus?"+"inSchool="+this.inSchool+"&type="+this.role,
      dataType: "json",
      type: "get",
      async: false,
      success: function(result) {
        if (result.state) {
          that.schoolStatusArr = result.data;
        }
      }
    });
    // sAjax({
    //   url: "/api/payment/sysdicttype?typeName=在校状态",
    //   dataType: "json",
    //   type: "get",
    //   async: false,
    //   success: function(result) {
    //     if (result.state) {
    //       that.schoolStatusArr = result.data;
    //     }
    //   }
    // });
    sAjax({
      url: '/api/system/dicts?dictType=专业',
      dataType: 'json',
      type: 'get',
      async: false,
      success: (result) => {
        if (result.state) {
          this.majorOptions = result.data || []
        }
      }
    })
    if (translation(la)) {
      this.lang = la;
    }
    this.definedSearch.type = this.role;

    this.getStuTree();

    sAjax({
      url: `/api/student/manage/getSelectOptions?type=${
        this.definedSearch.type
      }`,
      dataType: "json",
      type: "get",
      success: function(result) {
        var data = result.data;
        if (result.state) {
          that.normalSearchOptions.collegeOptions = data["colleges"] || [];
          that.exportStat.collegeOptions = data["colleges"] || [];
          that.normalSearchOptions.gradeOptions = data["grade"] || [];
          that.normalSearchOptions.studentTypeOptions =
            data["studentType"] || [];
          that._initColumns();
        }
      }
    });
    if (this.layoutManageJson.educationLevelOptions.length === 0) {
      this.$waiting.show();
      sAjax({
        url: "/api/system/dicts?dictType=培养层次",
        type: "get",
        success: data => {
          if (data.state) {
            this.layoutManageJson.educationLevelOptions = data.data;
          } else {
            this.$toast(data.message);
          }
        }
      }).always(() => {
        this.$waiting.close();
      });
    }
    this._initColumns();
    // this.initAdvancedSearchTables();
  },
  data: function() {
    return {
      isMergeTable: false, //是否合并表格
      xiaoxiao: false,
      inSchool: true,
      allSelectDefaultOptions: 1,
      allSelectLei: [],
      studentBie: true,
      educationLevels: [],
      schoolStatusArr: [],
      majorOptions: [],
      columns: [],
      url: "",
      method: "get",
      definedSearch: {
        searchDTOS: [],
        type: "",
        studentId: "",
        studentName: "",
        college: "",
        studentType: "",
        grade: "",
        phoneNumber: "",
        isAdvancedSearch: false,
        educationLevel:'',
        schoolStatus:''
      },
      normalSearchOptions: {
        gradeOptions: [],
        studentTypeOptions: [],
        collegeOptions: []
      },
      newSearchCondition: {
        searchOptionsText: "学号",
        requirementOptionsText: "等于",
        inputText: "",
        relationOptionsText: "并且"
      },
      newSearchArray: [],
      newSearchData: [],
      searchParameters: {
        key: "studentId",
        relation: "eq",
        value: "",
        tableName: "",
        type: "and"
      },
      searchDots: [],
      isSelect: false,
      isClearArray: true,
      isClearSearchData: false,
      lang: "zh-cn",
      exportStat: {
        show: false,
        exporting: false,
        collegeOptions: [],
        collegeCodeList: []
      },
      showExport: false,
      fieldsToExport: [],
      exporting: false,
      student: {
        name: ""
      },
      isDisabled: false,
      layoutManageJson: {
        educationLevelOptions: [],
        educationLevelShow: false,
        educationLevel: "",
        infoTypes: [],
        route: "main",
        layoutsJson: {},
        logsJson: {},
        instanceJson: {},
        preview: false,
        curInfoId: ""
      }
    };
  },
  computed: {
    translate: function() {
      return translation(this.lang).infoManage;
    },
    exportStatus: function() {
      return this.exporting ? "导出中" : this.translate.export;
    },
    tableName: function() {
      return this.role === "school"
        ? this.translate.schoolStudentManage
        : this.role === "college"
        ? this.translate.collegeStudentManage
        : this.translate.myStudentManage;
    },
    pageId: function() {
      return `student-manage-page-${this.role}`;
    },
    distributary: function() {
      return this.role === "school"
        ? "bySchool"
        : this.role === "college"
        ? "byCollege"
        : "byTeacher";
    }
  },
  watch: {
    inSchool: function() {
      this.method = "get";
      this.url =
        "/table-data/student/manage/manageStudents/" +
        this.role +
        "?inSchool=" +
        this.inSchool;
    }
  },
  methods: {
    showExportModal(){
      if(this.fieldsToExport.length>0){
        this.showExport = true;
      }else{
        this.$toast('没有可导出字段')
      }
    },
    getStuTree: function(){
      let that = this
      sAjax({
        url: `/api/student/manage/getTree/${this.role=='myManage'?'INSTRUCTOR':this.role.toUpperCase()}?timeStamp=${new Date().getTime()}`,
        dataType: "json",
        type: "get",
        success: function(result) {
          let data = result.data;
          if (result.state) {
            let treeData = [];
            data.forEach(parent => {
              let treeItem = {
                id: parent.id,
                title: parent.name,
                edit: false,
                children: []
              };
              parent.childrens.forEach(child => {
                treeItem.children.push({
                  id: child.id,
                  title: child.name,
                  disabled: false,
                  meta: true,
                  data: {
                    typeId: parent.id,
                    fieldType: child.fieldType,
                    fieldId: child.id
                  }
                });
              });
              treeData.push(treeItem);
            });
            that.fieldsToExport = treeData;
          }
        }
      });
    },
    _closeFormSetting: function() {
      this.layoutManageJson.route = "main";
      this.getStuTree();
      this.$emit("fullScreen", false);
    },
    _resetLayoutManageJson: function() {
      this.layoutManageJson.layoutsJson = {};
      this.layoutManageJson.logsJson = {};
      this.layoutManageJson.instanceJson = {};
      this.layoutManageJson.curInfoId = "";
    },
    _toExportManage(){
      this.layoutManageJson.route = 'exportSet'
      this.$emit('fullScreen', true)
    },
    _toJournal(){//查看日志
     let id = this.role
     let title = ''
     switch (id) {
       case 'school':
         title = '全校学生'
         break;
       case 'college':
         title = '本院学生'
         break;
       case 'myManage':
         title = '分管学生'
         break;
     }
      this.$addBread({
        route: `/document/studentInfoJournal?id=${id}`,
        title: `${title}日志`
      })
    },
    _showEducationLevelModal: function() {
      this.layoutManageJson.educationLevelShow = true;
    },
    _setLayout: function() {
      // 获取信息类别
      this.layoutManageJson.educationLevelShow = false;
      if (this.layoutManageJson.infoTypes.length === 0) {
        this._getInfoTypes(() => {
          this.layoutManageJson.route = "formSetManage";
          this.$emit("fullScreen", true);
        });
      } else {
        this.layoutManageJson.route = "formSetManage";
        this.$emit("fullScreen", true);
      }
    },
    _getInfoTypes: function(cb, searchContent) {
      // this.$waiting.show();
      sAjax({
        url: "/api/information/columnTypes/STUDENT",
        type: "get",
        data: {
          educationLevel: this.layoutManageJson.educationLevel,
          searchContent: searchContent
        },
        success: data => {
          if (data.state) {
            if (data.data && data.data.length > 0) {
              this.layoutManageJson.infoTypes = data.data || [];
              this.layoutManageJson.infoTypes.forEach(type => {
                this.$set(type, "title", type.text);
              });
              cb && cb();
            } else {
              this.$toast(this.translate.nullColumnTypesTip);
            }
          } else {
            this.$toast(data.message);
          }
        }
      }).always(() => {
        // this.$waiting.close();
      });
    },
    _newFenlei: function(str) {
      //这里处理新增分类操作
      var that = this;
      sAjax({
        url: "/api/data/column/infoType",
        dataType: "json",
        type: "POST",
        data: {
          title: str,
          type: "student"
        },
        success: function(result) {
          if (result.state) {
            that.layoutManageJson.infoTypes.push(result.data);
          } else {
            that.$toast(result.message);
          }
        }
      });
    },
    _removeFenlei: function(id) {
      // 这里处理删除分类操作
      sAjax({
        url: `/api/data/column/infoType/${id}`,
        dataType: "json",
        type: 'post',
        success: function(result) {}
      });
    },
    _saveFormInfo: function(arr) {
      if (arr.length > 0) {
        this.$waiting.show();
        sAjax({
          url: "/api/information/infoSettings/STUDENT",
          type: 'post',
          data: {
            educationLevel: this.layoutManageJson.educationLevel,
            infoTypes: arr
          },
          success: data => {
            if (data.state) {
              this.layoutManageJson.route = "main";
              this.$toast(this.translate.successTip);
            } else {
              this.$toast(data.message);
            }
          }
        }).always(() => {
          this.$waiting.close();
        });
      } else {
        this.layoutManageJson.route = "main";
        this.$toast(this.translate.successTip);
      }
    },
    _saveRoles: function(data) {
      sAjax({
        url: "/api/information/player/" + data.type,
        type: 'post',
        data: {
          players: data.players,
          educationLevel: data.educationLevel
        },
        success: data => {
          if (data.state) {
            this.$toast(this.translate.successTip);
            this.layoutManageJson.route = "formSetManage";
          } else {
            this.$toast(data.message);
          }
        }
      });
    },
    _initInfoType: function(tab) {
      // 获取布局
      if (!tab) {
        return;
      }
      if (
        !(
          this.layoutManageJson.layoutsJson[tab.id] &&
          this.layoutManageJson.logsJson
        )
      ) {
        sAjax({
          url: `/api/information/infoSetting/STUDENT/${tab.id}`,
          type: "get",
          data: {
            userId: this.student.userId,
            distributary: this.distributary
          },
          success: data => {
            if (data.state) {
              if (!data.data) {
                data.data = {
                  components: []
                };
              }
              data.data.components.forEach(ele => {
                Vue.set(ele, "x", ele.location.left);
                Vue.set(ele, "y", ele.location.top);
                Vue.set(ele, "w", ele.size.width);
                Vue.set(ele, "h", ele.size.height);
              });
              this.$set(this.layoutManageJson.layoutsJson, tab.id, data.data);
              this.layoutManageJson.curInfoId = tab.id;

              // 获取操作日志
              sAjax({
                url: `/api/information/infoInstance/changeLogs/STUDENT/${
                  tab.id
                }`,
                type: "get",
                data: {
                  userId: this.student.userId
                },
                success: data => {
                  if (data.state) {
                    this.$set(
                      this.layoutManageJson.logsJson,
                      tab.id,
                      data.data || []
                    );
                    this.layoutManageJson.preview = true;
                  } else {
                    this.$toast(data.message);
                  }
                }
              });
            } else {
              this.$toast(data.message);
            }
          }
        });
      } else {
        this.layoutManageJson.curInfoId = tab.id;
      }
    },
    _getInfoValue: function(obj) {
      // 获取当前类型数据
      this.$set(
        this.layoutManageJson.instanceJson,
        this.layoutManageJson.curInfoId,
        obj
      );
    },
    _submitAll: function() {
      setTimeout(()=>{
        // 提交全部修改记录
        var arr = [];
        for (var i in this.layoutManageJson.instanceJson) {
          arr.push({
            infoId: i,
            formData: this.layoutManageJson.instanceJson[i].formData
          });
        }
        if (arr.length === 0) {
            this.$toast('暂无需保存记录')
            return
          }
        this.$waiting.show();
        let data = {
              typesValue: arr
            }
            switch(this.tableName){
              case '全校学生信息':
              data.source = 'SCHOOL'
              break;
              case '本院学生信息':
              data.source = 'COLLEGE'
              break;
              case '分管学生信息':
              data.source = 'INSTRUCTOR_MANAGE'
              break;
              default:
              data.source = 'undefined'
              break;
            }
        sAjax({
          url: `/api/information/infoInstance/STUDENT/${this.distributary}/${
            this.student.userId
          }`,
          type: 'post',
          data: data,
          success: data => {
            if (data.state) {
              this.$toast(this.translate.successTip);
              this.layoutManageJson.instanceJson = {};
              this.layoutManageJson.preview = false;
              this.url =
                "/table-data/student/manage/manageStudents/" +
                this.role +
                "?inSchool=" +
                this.inSchool + '&timestamp=' + new Date().getTime();
            } else {
              this.$toast(data.message);
            }
          }
        }).always(() => {
          this.$waiting.close();
        });
      }, 100)
    },

    _initColumns: function() {
      this.columns = [
        {
          id: "studentId",
          title: this.translate.infoFields.studentId,
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
          title: this.translate.infoFields.name,
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
          title: this.translate.infoFields.collegeName,
          className: "text-left",
          width: 120,
          hidden: false,
          search: {
            type: "multiSelect",
            data: {
              options: this.normalSearchOptions.collegeOptions,
              optionsLabel: "text",
              optionsValue: "id",
              placeholder: "",
              change: (record) => {
                this.getMajorByCollege(record.value.split(','))
              }
            }
          }
        },
        {
          id: "major",
          title: "专业",
          className: "text-left",
          width: 120,
          hidden: true,
          search: {
            type: "multiSelect",
            data: {
              options: this.majorOptions,
              optionsLabel:'label',
              optionsValue:'value',
            }
          },
        },
        {
          id: "educationLevel",
          title: "培养层次",
          className: "text-left",
          width: 100,
          hidden: false,
          search: {
            type: "multiSelect",
            data: {
              options: this.educationLevels,
              optionsLabel: "label",
              optionsValue: "value"
            }
          }
        },
        {
          id: "grade",
          title: this.translate.infoFields.grade,
          className: "text-left",
          width: 50,
          hidden: false,
          search: {
            type: "multiSelect",
            data: {
              options: this.normalSearchOptions.gradeOptions,
              optionsLabel: "text",
              optionsValue: "id",
              placeholder: ""
            }
          }
        },
        {
          id: "clazz",
          title: "班级",
          className: "text-left",
          width: 120,
          hidden: true,
          search: {
            type: "select",
            data: {
              url:this.role=="college"?"/api/relClass/my/manage/classes/options":"/api/relClass/classes/list",
              optionsLabel:'text',
              optionsValue:'id',
              placeholder: ""
            }
          },
          formatter:function(record){
            return record.clazzName
          }
        },
        {
          id: "phoneNumber",
          title: this.translate.infoFields.phoneNumber,
          className: "text-center",
          width: 120,
          hidden: false,
          search: {
            type: "input",
            data: {
              placeholder: this.translate.phoneNumber
            }
          },
          formatter: function(record, index) {
            return record.phone;
          }
        },
        {
          id: "instructor",
          title: this.translate.infoFields.instructor,
          className: "text-left",
          width: 80,
          hidden: false
        },
        {
          id: "originPlace",
          title: this.translate.infoFields.originPlace,
          className: "text-left",
          width: 120,
          hidden: false,
          search: {
            type: "input",
            data: {
              placeholder: this.translate.phoneNumber
            }
          }
        },
        {
          id: "schoolStatus",
          title: "当前状态",
          className: "text-left",
          width: 120,
          hidden: true,
          search: {
            type: "multiSelect",
            data: {
              options: this.schoolStatusArr,
              optionsLabel: "label",
              optionsValue: "value",
              placeholder: ""
            }
          }
        },
        {
          id: "politicalStatus",
          title: "政治面貌",
          className: "text-left",
          width: 120,
          hidden: false,
          search: {
            type: "select",
            data: {
              url:"/api/system/dicts?dictType=政治面貌",
              optionsLabel:'label',
              optionsValue:'value',
              placeholder: ""
            }
          },
        },
        {
          id: "idCard",
          title: "身份证号",
          className: "text-left",
          width: 120,
          hidden: true,
          search: {
            type: "input",
            data: {
              placeholder: this.translate.studentIdPlaceholder
            }
          }
        },
        {
          id: "nation",
          title: "民族",
          className: "text-left",
          width: 120,
          hidden: true,
          search: {
            type: "multiSelect",
            data: {
              url:"/api/system/dicts?dictType=民族",
              optionsLabel:'label',
              optionsValue:'value',
            }
          },
        },
        {
          id: "opt",
          title: this.translate.opt,
          className: "text-center",
          width: 120,
          hidden: false,
          formatter: () => {
            var that = this;
            return [
              {
                tag: "a",
                text: this.translate.show,
                className: "opt-btn",
                callback: (record, index) => {
                  this._resetLayoutManageJson();
                  this.student = record;
                  if (this.layoutManageJson.infoTypes.length > 0) {
                    this._initInfoType(this.layoutManageJson.infoTypes[0]);
                  } else {
                    this._getInfoTypes(() => {
                      this._initInfoType(this.layoutManageJson.infoTypes[0]);
                    });
                  }
                }
              }
            ];
          }
        }
      ];
      this.url =
        "/table-data/student/manage/manageStudents/" +
        this.role +
        "?inSchool=" +
        this.inSchool + '&timestamp=' + new Date().getTime();
    },
    /**
     * advanced search
     */
    // initAdvancedSearchTables: function() {
    //   sAjax({
    //     url: "/api/student/manage/advance/types",
    //     type: "get",
    //     success: result => {
    //       if (result.state) {
    //         for (let table of result.data) {
    //           this.advancedSearch.tables[table.id] = table;
    //           this.advancedSearch.tableOptions.push({
    //             value: table.id,
    //             label: table.title
    //           });
    //         }
    //         this.advancedSearch.initialized = true;
    //       } else {
    //         this.$toast(result.message);
    //       }
    //     }
    //   });
    // },
    
    getMajorByCollege(code) {
      if (code[0] !== "") {
        sAjax({
          url: '/api/system/major/getMajorByCollegeCodeS',
          dataType: 'json',
          type: 'get',
          data: {collegeCodeS:code},
          async: false,
          success: (result) => {
            if (result.state) {
              this.columns[3].search.data.options = result.data || []
            }
          }
        })
      } else {
        this.columns[3].search.data.options = this.majorOptions
      }
    },
    setInSchool: function(inSchool) {
      this.$refs.studentTable.tableSearchFields.inSchool = inSchool;
      this.inSchool = inSchool;
      var that = this
      sAjax({
        url: "/api/student/manage/manageStudents/schoolStatus?"+"inSchool="+this.inSchool+"&type="+this.role,
        dataType: "json",
        type: "get",
        async: false,
        success: (result)=> {
          this.callback(result.data)
        }
      });
    },
    callback(data){
      this.schoolStatusArr = data;
      this.columns[10].search.data.options = this.schoolStatusArr
    },
    selectExportStatCollege: function(obj) {
      this.exportStat.collegeCodeList = obj.value.split(",");
    },
    exportStatToFile: function() {
      window.location.href =
        "/downloads/document/statistics/students/export?inSchool=" +
        this.inSchool +
        "&role=" +
        this.role +
        "&collegeCode=" +
        this.exportStat.collegeCodeList.join("&collegeCode=");
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
        fields.push(item.data);
      });

      if (!fields.length) {
        return that.$toast("请勾选至少一个字段");
      }
      // this.$waiting.show({
      //   text: "正在导出...(导出时间跟学生数量相关，请耐心等待)",
      //   container: "body"
      // });
      this.exporting = true;
        this.definedSearch.studentId = this.$refs.studentTable.tableSearchFields.studentId
        this.definedSearch.studentName = this.$refs.studentTable.tableSearchFields.name
        this.definedSearch.college = this.$refs.studentTable.tableSearchFields.college
        this.definedSearch.educationLevel = this.$refs.studentTable.tableSearchFields.educationLevel
        this.definedSearch.schoolStatus = this.$refs.studentTable.tableSearchFields.schoolStatus
        this.definedSearch.studentType = this.$refs.studentTable.tableSearchFields.studentType
        this.definedSearch.grade = this.$refs.studentTable.tableSearchFields.grade
        this.definedSearch.phoneNumber = this.$refs.studentTable.tableSearchFields.phoneNumber
        this.definedSearch.inSchool = this.inSchool
        var objData = {}
        objData.inSchool = this.inSchool
        objData.isAdvancedSearch =  this.definedSearch.isAdvancedSearch
        objData.searchDTOS = this.definedSearch.searchDTOS
        objData.studentId =  this.$refs.studentTable.tableSearchFields.studentId
        objData.studentType = this.$refs.studentTable.tableSearchFields.studentType
        objData.type =  this.role
        objData.mergeTables = this.isMergeTable
        let url = '/api/student/manage/getExportFileName?'+"college="+this.definedSearch.college
          +"&grade="+this.definedSearch.grade+"&educationLevel="+this.definedSearch.educationLevel+"&schoolStatus="+this.definedSearch.schoolStatus
          let params = Object.assign({ exportFieldVO: fields }, objData);
        this.exportFile(url,params).then(data=>{
          if (data.state) {
            let triggerDelay = 100;
            let removeDelay = 1000;
            let downloadUrls = [];
            downloadUrls.push(
              `/downloads/student/manage/downloadExportFile?fileName=${
                data.data.fileName
              }`
            );
            if (data.data.hadImage) {
              downloadUrls.push(
                `/downloads/student/manage/downloadImageZipFile?key=${
                  data.data.key
                }`
              );
            }
            downloadUrls.forEach((item, index) => {
              that._createIFrame(item, index * triggerDelay, removeDelay);
            });
            that.showExport = false;
            this.getStuTree();
          } else {
            that.$toast(data.message);
          }
          that.exporting = false;
   
      }).always(() => {
        this.$waiting.close();
      });
    },
    _createIFrame: function(url, triggerDelay, removeDelay) {
      setTimeout(function() {
        var frame = $(
          '<iframe style="display: none;" class="multi-download"></iframe>'
        );
        frame.attr("src", url);
        $(document.body).after(frame);
        // setTimeout(function () {
        //   frame.remove()
        // }, removeDelay)
      }, triggerDelay);
    }
    // collegeOptionsSelected: function (obj) {
    //   if (obj.val === '-1') {
    //     this.definedSearch.college = ''
    //   } else {
    //     this.definedSearch.college = obj.val
    //   }
    // },
    // studentTypeOptionsSelected: function (obj) {
    //   if (obj.val === '-1') {
    //     this.definedSearch.studentType = ''
    //   } else {
    //     this.definedSearch.studentType = obj.val
    //   }
    // },
    // gradeOptionsSelected: function (obj) {
    //   if (obj.val === '-1') {
    //     this.definedSearch.grade = ''
    //   } else {
    //     this.definedSearch.grade = obj.val
    //   }
    // }
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
