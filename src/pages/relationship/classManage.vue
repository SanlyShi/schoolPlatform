<template >
  <div>
    <div id="classManage-page" class="container-fluid" v-if="isParentPage">
      <div class="row text-center class-list-page">
        <v-table
          ref="studentTable"
          :title="translate.tableName"
          :url="url"
          pagesize="10"
          idField="id"
          :columns="columns"
          :order="true"
          :search="true"
        >
          <div slot="btn-group" class="btn-group pull-right" role="group">
            <button
              type="button"
              class="btn btn-bgColor-style clearBtnBorder"
              @click="createClass()"
            >{{translate.create}}{{translate.class}}</button>
            <button
              type="button"
              class="btn btn-bgColor-style clearBtnBorder"
              @click="studentClasses()"
            >{{translate.student}}{{translate.classes}}</button>
          </div>
          <div slot="table-search">
            <div class="input-group search-group pull-left col-md-3 col-md-offset-1">
              <span class="input-group-addon search-name">{{translate.college}}</span>
              <v-select
                class="btn-block search-select"
                :value="defaultOptions"
                :options="collegeOptions.search"
                options-value="id"
                options-label="text"
                @afterSelected="collegeOptionsSelected"
                search
                close-on-select
              ></v-select>
            </div>
            <div class="input-group search-group pull-left col-md-3 col-md-offset-4">
              <span class="input-group-addon search-name">{{translate.learnLevel}}</span>
              <v-select
                class="btn-block search-select"
                :value="defaultOptions"
                :options="levelOptions.search"
                options-value="id"
                options-label="text"
                @afterSelected="levelOptionsSelected"
                search
                close-on-select
              ></v-select>
            </div>
            <div class="input-group search-group pull-left col-md-3 col-md-offset-1">
              <span class="input-group-addon search-name">{{translate.grade}}</span>
              <v-select
                class="btn-block search-select"
                :value="defaultOptions"
                :options="gradeOptions.search"
                options-value="id"
                options-label="text"
                @afterSelected="gradeOptionsSelected"
                search
                close-on-select
              ></v-select>
            </div>
            <div class="input-group search-group pull-left col-md-3 col-md-offset-4">
              <span class="input-group-addon search-name">{{translate.classFullName}}</span>
              <input
                class="form-control search-input"
                type="text"
                v-model="definedSearch.classFullName"
              >
            </div>
          </div>
        </v-table>
      </div>
      <div class="class-member-page" v-if="isShowMemberPage">
        <v-classmembers :classId="classId" @backClassList="backClassList"></v-classmembers>
      </div>
      <!-- 模态框（Modal） -->
      <v-modal :show="showAddClassModal" effect="fade" width="800">
        <div slot="modal-header" class="modal-header">
          <h5 class="modal-title">{{translate.addNew}}{{translate.class}}</h5>
        </div>
        <div slot="modal-body" class="modal-body" v-if="showAddClassModal">
          <div v-if="!isnextStep">
            <div class="input-group addClass-input-group">
              <label class="addClass-text">{{translate.college}}:</label>
              <v-select
                class="btn-block search-select"
                :value="addNewClass.collegeId"
                :options="collegeOptions.addClass"
                options-value="id"
                options-label="text"
                @afterSelected="collegeSelected"
                search
                close-on-select
              ></v-select>
            </div>
            <div class="input-group addClass-input-group">
              <label class="addClass-text">{{translate.faculty}}/{{translate.bigClass}}:</label>
              <input
                class="form-control search-input"
                type="text"
                v-model="addNewClass.faculty"
                aria-describedby="basic-addClass-faculty"
              >
              <label>({{translate.facultyPlaceholder}})</label>
            </div>
            <div class="input-group addClass-input-group">
              <label class="addClass-text">{{translate.grade}}:</label>
              <v-select
                class="btn-block search-select"
                :value="addNewClass.gradeId"
                :options="gradeOptions.addClass"
                options-value="id"
                options-label="text"
                @afterSelected="gradeSelected"
                search
                close-on-select
              ></v-select>
            </div>
            <div class="input-group addClass-input-group">
              <label class="addClass-text">{{translate.learnLevel}}:</label>
              <v-select
                class="btn-block search-select"
                :value="addNewClass.levelId"
                :options="levelOptions.addClass"
                options-value="id"
                options-label="text"
                @afterSelected="levelSelected"
                search
                close-on-select
              ></v-select>
            </div>
            <div class="input-group addClass-input-group">
              <label class="addClass-text">{{translate.class}}{{translate.orderNumber}}:</label>
              <v-select
                class="btn-block search-select"
                :value="orderNumberStr"
                :options="orderNumberOptions"
                options-value="id"
                options-label="text"
                @afterSelected="orderNumberSelected"
                search
                :multiple="true"
              ></v-select>
              <label>({{translate.orderNumberPlaceholder}})</label>
            </div>
            <div class="input-group addClass-input-group">
              <label
                class="creat-class-text"
              >{{translate.will}}{{translate.create}}{{translate.class}}:</label>
              <textarea
                id
                cols="24"
                rows="5"
                class="create-class-textarea"
                disabled="disabled"
                v-model="creatClass"
              ></textarea>
            </div>
          </div>
          <div v-else>
            <label class="edit-class-name-text">系统将根据填写的班级信息自动生成班级名称，若班级名称不符合预期效果，点击可直接编辑</label>
            <div
              class="input-group addClass-input-group"
              v-for="(item, i) in newClassNameArr"
              :key="i"
            >
              <label
                class="creat-class-text"
                v-if="i === 0"
              >{{translate.will}}{{translate.create}}{{translate.class}}:</label>
              <label class="creat-class-text" v-else></label>
              <input
                class="form-control modal-form-style edit-class-input search-input"
                type="text"
                maxlength="50"
                v-model="newClassNameArr[i]"
              >
            </div>
            <div slot="btn-group" class="btn-group" role="group">
              <button
                type="button"
                class="btn submit-btn clearBtnBorder"
                @click="sureCreat()"
              >{{translate.sure}}{{translate.create}}</button>
            </div>
          </div>
          <div class="input-group addClass-input-group">
            <label
              class="creat-class-text"
            >{{translate.already}}{{translate.create}}{{translate.class}}:</label>
            <textarea
              id
              cols="24"
              rows="5"
              class="create-class-textarea"
              disabled="disabled"
              v-model="classHistory"
            ></textarea>
          </div>
          <div v-if="!isnextStep" slot="btn-group" class="btn-group" role="group">
            <button type="button" class="btn submit-btn clearBtnBorder" @click="nextStep()">下一步</button>
          </div>
          <div v-else slot="btn-group" class="btn-group" role="group">
              <button type="button" class="btn submit-btn clearBtnBorder" @click="previous()">上一步</button>
            </div>
        </div>
        <div slot="modal-footer" class="modal-footer">
          <button
            type="button"
            class="btn cancel-btn clearBtnBorder"
            @click="showAddClassModal = false"
          >{{translate.cancel}}</button>
        </div>
      </v-modal>
      <v-modal :show="showEditClassModal" effect="fade" width="800">
        <div slot="modal-header" class="modal-header">
          <h5 class="modal-title">{{translate.edit}}{{translate.class}}</h5>
        </div>
        <div slot="modal-body" class="modal-body">
          <div class="form-group edit-class-group">
            <label class="edit-class-text">{{translate.classFullName}}:</label>
            <input
              class="form-control modal-form-style name-input"
              type="text"
              v-model="editClass.classFullName"
            >
          </div>
          <div class="form-group edit-class-group">
            <label class="edit-class-text">{{translate.established}}:</label>
            <v-datepicker
              ref="datepicker"
              class="btn-block time-picker"
              :value="editClass.createTime"
              :clearButton="false"
              :showTime="false"
              @daySelected="createTimeSelected"
            ></v-datepicker>
          </div>
          <div class="form-group edit-class-group">
            <label class="edit-class-text">{{translate.dissolutionTime}}:</label>
            <v-datepicker
              ref="datepicker"
              class="btn-block time-picker"
              :value="editClass.dissolutionTime"
              :clearButton="false"
              :showTime="false"
              @daySelected="dissolutionTimeSelected"
            ></v-datepicker>
          </div>
          <div class="form-group edit-class-group">
            <label
              class="edit-class-text"
            >{{translate.headTeacher}}{{translate.teacherAndStudentId}}:</label>
            <input
              class="form-control modal-form-style search-input"
              type="text"
              v-model="editClass.classLeaderId"
              v-on:input="isEditClassLeaderId"
            >
            <button
              type="button"
              class="btn check-btn clearBtnBorder"
              @click="checkClassLeaderId"
            >{{translate.check}}</button>
            <div class="idcheckResult">{{checkMessage.classLeader}}</div>
          </div>
          <div class="form-group edit-class-group">
            <label class="edit-class-text">{{translate.headTeacher}}:</label>
            <input
              class="form-control modal-form-style name-input"
              readonly="readonly"
              type="text"
              v-model="editClass.classLeaderName"
              v-on:input="isEditClassLeaderName"
            >
          </div>
          <div class="form-group edit-class-group">
            <label
              class="edit-class-text"
            >{{translate.headTeacher}}{{translate.serve}}{{translate.startTime}}:</label>
            <v-datepicker
              ref="datepicker"
              class="btn-block time-picker"
              :value="editClass.classLeaderStartTime"
              :clearButton="false"
              :showTime="false"
              @daySelected="classLeaderStartTime"
            ></v-datepicker>
          </div>
          <div class="form-group edit-class-group">
            <label
              class="edit-class-text"
            >{{translate.headTeacher}}{{translate.serve}}{{translate.endTime}}:</label>
            <v-datepicker
              ref="datepicker"
              class="btn-block time-picker"
              :value="editClass.classLeaderEndTime"
              :clearButton="false"
              :showTime="false"
              @daySelected="classLeaderEndTime"
            ></v-datepicker>
          </div>
          <!-- <div>
            <button
              class="btn historyRecord-btn clearBtnBorder"
              type="button"
              data-toggle="collapse"
              data-target="#collapseExample"
              aria-expanded="false"
              aria-controls="collapseExample"
            >{{translate.historyRecord}}</button>
            <div class="collapse" id="collapseExample">
              <div class="historyRecord-container">
                <v-table
                  idField="id"
                  :columns="historyRecordColumns"
                  :rows="editClass.classLeaders"
                  :order="true"
                  :columnsControl="false"
                  :paginationShow="false"
                ></v-table>
              </div>
            </div>
          </div> -->
          <!-- <div class="form-group edit-class-group">
            <label
              class="edit-class-text"
            >{{translate.instructor}}{{translate.teacherAndStudentId}}:</label>
            <input
              class="form-control modal-form-style search-input"
              type="text"
              v-model="editClass.instructorId"
              v-on:input="isInstructorId"
            >
            <button
              type="button"
              class="btn check-btn clearBtnBorder"
              @click="checkInstructorId"
            >{{translate.check}}</button>
            <div class="idcheckResult">{{checkMessage.instructor}}</div>
          </div> -->
          <!-- <div class="form-group edit-class-group">
            <label class="edit-class-text">{{translate.instructor}}:</label>
            <input
              class="form-control modal-form-style name-input"
              readonly="readonly"
              type="text"
              v-model="editClass.instructorName"
              v-on:input="isInstructorName"
            >
          </div> -->
          <!-- <div class="form-group edit-class-group">
            <label
              class="edit-class-text"
            >{{translate.instructor}}{{translate.serve}}{{translate.startTime}}:</label>
            <v-datepicker
              ref="datepicker"
              class="btn-block time-picker"
              :value="editClass.instructorStartTime"
              :clearButton="false"
              :showTime="false"
              @daySelected="instructorStartTime"
            ></v-datepicker>
          </div> -->
          <!-- <div class="form-group edit-class-group">
            <label
              class="edit-class-text"
            >{{translate.instructor}}{{translate.serve}}{{translate.endTime}}:</label>
            <v-datepicker
              ref="datepicker"
              class="btn-block time-picker"
              :value="editClass.instructorEndTime"
              :clearButton="false"
              :showTime="false"
              @daySelected="instructorEndTime"
            ></v-datepicker>
          </div> -->
          <!-- <div> -->
            <!-- <button
              class="btn historyRecord-btn clearBtnBorder"
              type="button"
              data-toggle="collapse"
              data-target="#instructorExample"
              aria-expanded="false"
              aria-controls="collapseExample"
            >{{translate.historyRecord}}</button> -->
            <!-- <div class="collapse" id="instructorExample">
              <div class="historyRecord-container">
                <v-table
                  idField="id"
                  :columns="historyRecordColumns"
                  :rows="editClass.instructors"
                  :order="true"
                  :paginationShow="false"
                ></v-table>
              </div>
            </div> -->
          <!-- </div> -->
          <div class="form-group edit-class-group">
            <label>{{translate.class}}{{translate.committee}}:</label>
          </div>
          <div class="historyRecord-container committeeList">
            <v-table
              idField="id"
              :columns="committeeColumns"
              :rows="editClass.classCommitteePeople"
              :order="true"
              :paginationShow="false"
            ></v-table>
          </div>
          <button
            type="button"
            class="btn check-btn clearBtnBorder"
            @click="addNewcommittee"
          >{{translate.add}}</button>
        </div>
        <div slot="modal-footer" class="modal-footer">
          <button
            type="button"
            class="btn cancel-btn clearBtnBorder"
            @click="cancelEditModal"
          >{{translate.cancel}}</button>
          <button
            type="button"
            class="btn submit-btn clearBtnBorder"
            @click="editClassInfo"
          >{{translate.submit}}</button>
        </div>
      </v-modal>

      <v-modal :show="showAddCommitteeModal" effect="fade" width="620">
        <div slot="modal-header" class="modal-header">
          <h5 class="modal-title">{{translate.add}}{{translate.classCommittee}}</h5>
        </div>
        <div slot="modal-body" class="modal-body" v-if="showAddCommitteeModal" style="overflow:visible">
          <div class="form-group class-committee-group">
            <label class="classCommittee-text">{{translate.position}}:</label>
            <v-select
              class="btn-block search-select"
              :options="positionOption"
              v-if="positionOptType === 'select'"
              :value="newCommittee.defaultOptions"
              options-value="id"
              options-label="text"
              @afterSelected="positionSelected"
              search
              close-on-select
            ></v-select>
            <input
              class="form-control modal-form-style search-input"
              v-else
              type="text"
              v-model="newCommittee.name"
              aria-describedby="basic-classCommittee-studentId"
            >
            <button
              type="button"
              class="btn check-btn clearBtnBorder customize-btn"
              @click="customizePosition"
            >{{translate.customize}}{{translate.position}}</button>
          </div>
          <!-- <div class="form-group class-committee-group">
            <label class="classCommittee-text">{{translate.studentId}}:</label>
            <input
              class="form-control modal-form-style search-input"
              type="text"
              v-model="newCommittee.studentId"
              aria-describedby="basic-classCommittee-studentId"
            >
            <button
              type="button"
              class="btn check-btn clearBtnBorder"
              @click="checkStudentId"
            >{{translate.check}}</button>
            <div class="errorMsg">{{newCommittee.checkResult}}</div>
          </div> -->
          <div class="form-group class-committee-group">
            <label class="classCommittee-text">学号/姓名:</label>
            <detect v-if="showAddCommitteeModal" style="display:inline-block;vertical-align: middle;margin-left: 18px;" ref="searchVal"  url="/api/relClass/getUserSimpleInfo"  keyword="nameOrNo" :placeholder="请输入学工号或者姓名" @afterSelected="afterSelectAddBanWei"></detect>
            <!-- <input
              class="form-control modal-form-style name-input"
              readonly="readonly"
              type="text"
              v-model="newCommittee.studentName"
              aria-describedby="basic-classCommittee-name"
            > -->
          </div>
          <div class="form-group class-committee-group">
            <label class="classCommittee-text">{{translate.serve}}{{translate.startTime}}:</label>
            <v-datepicker
              ref="datepicker"
              class="btn-block time-picker"
              :clearButton="false"
              :showTime="false"
              @daySelected="committeeStartTime"
            ></v-datepicker>
          </div>
          <div class="form-group class-committee-group">
            <label class="classCommittee-text">{{translate.serve}}{{translate.endTime}}:</label>
            <v-datepicker
              ref="datepicker"
              class="btn-block time-picker"
              :clearButton="false"
              :showTime="false"
              @daySelected="committeeEndTime"
            ></v-datepicker>
          </div>
        </div>
        <div slot="modal-footer" class="modal-footer">
          <button
            type="button"
            class="btn cancel-btn clearBtnBorder"
            @click="showAddCommitteeModal = false"
          >{{translate.cancel}}</button>
          <button
            type="button"
            class="btn submit-btn clearBtnBorder"
            @click="addCommittee"
          >{{translate.add}}</button>
        </div>
      </v-modal>
    </div>
    <v-import
      v-bind="importParams"
      :downloadTemplateUrl="downloadUrl"
      @backParentPage="backParentPage"
      :isNeedModal="true"
      :modalname="translate.templateSelect"
      v-else
    >
      <div slot="modal">
        <div class="input-group addClass-input-group">
          <label class="addclass-learnLevel-text">{{translate.college}}:</label>
          <v-select
            class="btn-block search-select"
            :value="templateData.collegeId"
            :options="collegeOptions.template"
            options-value="id"
            options-label="text"
            @afterSelected="collegeCheck"
            search
            close-on-select
          ></v-select>
        </div>
        <div class="input-group addClass-input-group">
          <label class="addclass-learnLevel-text">{{translate.grade}}:</label>
          <v-select
            class="btn-block search-select"
            :value="templateData.gradeId"
            :options="gradeOptions.template"
            options-value="id"
            options-label="text"
            @afterSelected="gradeCheck"
            search
            close-on-select
          ></v-select>
        </div>
        <div class="input-group addClass-input-group">
          <label class="template-relationship-text">{{translate.relationship}}:</label>
          <div class="radio-area">
            <div v-for="(col,k) in relationship" :key="k">
              <input type="radio" id="col.id" :value="col.id" v-model="relationshipPick">
              <label for="col.id">{{col.text}}</label>
            </div>
          </div>
        </div>
        <div class="input-group addClass-input-group">
          <label class="template-relationship-text">{{translate.classes}}{{translate.situation}}:</label>
          <div class="radio-area">
            <div v-for="(col,k) in haveClass" :key="k">
              <input type="radio" id="col.id" :value="col.id" v-model="classesPick">
              <label for="col.id">{{col.text}}</label>
            </div>
          </div>
        </div>
      </div>
    </v-import>
  </div>
</template>

<script>
import Vue from "vue";
import { sAjax, translation } from "../../assets/utils/utils.js";
import VclassMembers from "../../pages/relationship/classMembers.vue";
Vue.component("v-classmembers", VclassMembers);
export default {
  created: function() {
    var la = localStorage.getItem("lang");
    var that = this;
    if (translation(la)) {
      this.lang = la;
    }
    sAjax({
      url: "/api/relClass/getClassEditSelectOptions",
      dataType: "json",
      type: "get",
      success: function(data) {
        if (data.state) {
          var result = data.data;
          that.collegeOptions.addClass = result.colleges || [];
          that.gradeOptions.addClass = result.grades || [];
          that.levelOptions.addClass = result.learningLevels || [];
          that.orderNumberOptions = result.classNumbers || [];
        } else {
          that.$toast(data.message);
        }
      }
    });
    sAjax({
      url: "/api/relClass/getClassManageSelectOptions",
      dataType: "json",
      type: "get",
      success: function(data) {
        if (data.state) {
          var result = data.data;
          that.collegeOptions.search = result.colleges || [];
          that.gradeOptions.search = result.grades || [];
          that.levelOptions.search = result.learningLevels || [];
        } else {
          that.$toast(data.message);
        }
      }
    });

    sAjax({
      url: "/api/relClass/getDownloadTemplateConditions",
      dataType: "json",
      type: "get",
      success: function(data) {
        if (data.state) {
          var result = data.data;
          that.collegeOptions.template = result.colleges || [];
          that.gradeOptions.template = result.grades || [];
          that.haveClass = result.haveClass;
          that.relationship = result.relationship;
        } else {
          that.$toast(data.message);
        }
      }
    });
    sAjax({
      url: "/api/relationship/getTempleteFileName/relClassStudent",
      dataType: "json",
      type: "get",
      success: function(result) {
        if (result.state) {
          that.importParams.templateName = result.data;
        }
      }
    });
    this._initColumnsOfSearch();
    this.committeeColumns = [
      {
        id: "classCommittee",
        title: this.translate.position,
        className: "text-left",
        hidden: false
      },
      {
        id: "studentId",
        title: this.translate.studentId,
        className: "text-left",
        hidden: false
      },
      {
        id: "studentName",
        title: this.translate.name,
        className: "text-left",
        hidden: false
      },
      {
        id: "startTime",
        title: this.translate.serve + this.translate.startTime,
        className: "text-center",
        hidden: false
      },
      {
        id: "endTime",
        title: this.translate.serve + this.translate.endTime,
        className: "text-center",
        hidden: false
      },
      {
        id: "opt",
        title: this.translate.opt,
        className: "text-center",
        width: "70px",
        hidden: false,
        formatter: function() {
          return [
            {
              tag: "a",
              text: that.translate.remove,
              className: "opt-btn",
              callback: function(record, index) {
                if (confirm(that.translate.removeConfirmTip)) {
                  that.editClass.classCommitteePeople.splice(index, 1);
                  that.isEditClass = true;
                }
              }
            }
          ];
        }
      }
    ];
    this.historyRecordColumns = [
      {
        id: "name",
        title: this.translate.name,
        className: "text-left",
        hidden: false
      },
      {
        id: "teacherId",
        title: this.translate.teacherAndStudentId,
        className: "text-left",
        hidden: false
      },
      {
        id: "startTime",
        title: this.translate.serve + this.translate.startTime,
        className: "text-center",
        hidden: false
      },
      {
        id: "endTime",
        title: this.translate.serve + this.translate.endTime,
        className: "text-center",
        hidden: false
      }
    ];
    this.importParams.parentPageTitle = this.translate.tableName;
    this.importParams.importBtnType = [
      {
        name: this.translate.overriteImport,
        url: "/relClass/updateStudentClass",
        method: "post",
        isShowBtn: true,
        success: data => {
          if (data.state) {
            this.url =
              "/table-data/relClass/getClasses?timestamp=" + new Date();
          }
        }
      }
    ];
    this.classHistory = this.translate.noClassText;
  },
  data: function() {
    return {
      columns: [],
      committeeColumns: [],
      historyRecordColumns: [],
      url: "/table-data/relClass/getClasses",
      showAddClassModal: false,
      showEditClassModal: false,
      showAddCommitteeModal: false,
      isManagePage: "classManage",
      isShowMemberPage: false,
      classId: 0,
      addNewClass: {
        college: "",
        collegeId: "",
        grade: "",
        gradeId: "",
        level: "",
        levelId: "",
        faculty: "",
        orderNumber: [],
        orderNumberId: [],
        createClass: "",
        classNumber: 0,
        classText: ""
      },
      newClassData: {
        className: "",
        classFullName: "",
        college: "",
        learningLevel: "",
        grade: "",
        classNumber: ""
      },
      classList: [],
      newClassMange: {},
      definedSearch: {
        college: "",
        learningLevel: "",
        grade: "",
        classFullName: ""
      },
      modalType: "",
      collegeOptions: {
        search: [],
        addClass: [],
        template: []
      },
      levelOptions: {
        search: [],
        addClass: []
      },
      gradeOptions: {
        search: [],
        addClass: [],
        template: []
      },
      positionOption: [],
      orderNumberOptions: [],
      relationshipPick: "-1",
      classesPick: "0",
      templateData: {
        collegeId: "",
        gradeId: ""
      },
      editClass: {
        classId: "",
        classFullName: "",
        createTime: "",
        dissolutionTime: "",
        classLeaderId: "",
        classLeaderUserId: "",
        classLeaderName: "",
        classLeaderStartTime: "",
        classLeaderEndTime: "",
        instructorId: "",
        instructorUserId: "",
        instructorName: "",
        instructorStartTime: "",
        instructorEndTime: "",
        classCommitteePeople: [],
        classLeaders: [],
        instructors: []
      },
      committeeData: {
        classCommitteeId: "",
        classCommittee: "",
        studentUserId: "",
        studentId: "",
        studentName: "",
        startTime: "",
        endTime: ""
      },
      addCommitteeJson: {
        classCommittee: "",
        studentId: "",
        studentName: "",
        startTime: "",
        endTime: ""
      },
      newCommittee: {
        name: "",
        studentId: "",
        studentName: "",
        defaultOptions: "",
        checkResult: ""
      },
      positionType: {
        select: "",
        selectName: ""
      },
      committeeTypes: [],
      positionOptType: "select",
      isDisabled: {
        updateData: true
      },
      checkResult: "",
      checkMessage: {
        classLeader: "",
        instructor: ""
      },
      classHistory: "",
      haveClass: [],
      relationship: [],
      fileName: "",
      isParentPage: true,
      importParams: {
        parentPageTitle: "",
        downloadErrorTemplateUrl: "/relationship/downloadErrorExcel",
        checkTemplateUrl: "/relClass/uploadExcel",
        templateName: "",
        importBtnType: null
      },
      isEditClass: false,
      defaultOptions: "-1",
      isnextStep: false,
      editNewClassName: "",
      fullNameArr: [],
      newClassNameArr: [],
      orderNumberStr: "",
      lang: "zh-cn"
    };
  },
  computed: {
    translate: function() {
      return translation(this.lang).classManage;
    },
    downloadUrl: function() {
      return (
        "/relClass/downloadTemplate?college=" +
        this.templateData.collegeId +
        "&grade=" +
        this.templateData.gradeId +
        "&relationship=" +
        this.relationshipPick +
        "&haveClass=" +
        this.classesPick
      );
    },
    creatClass: function() {
      var text = "";
      if (this.addNewClass.orderNumber.length > 0) {
        this.addNewClass.classText = " ";
        text =
          this.translate.willBeCreated +
          this.addNewClass.orderNumber.length +
          this.translate.pieceClass +
          "," +
          this.translate.classNameText +
          ":\n";
        for (var i in this.addNewClass.orderNumber) {
          text +=
            this.addNewClass.college +
            this.addNewClass.faculty +
            this.addNewClass.grade +
            this.addNewClass.level +
            this.addNewClass.orderNumber[i] +
            this.addNewClass.classText +
            "\n";
        }
      } else {
        text =
          this.translate.willBeCreated +
          this.addNewClass.classNumber +
          this.translate.pieceClass +
          "," +
          this.translate.classNameText +
          ":\n";
        text +=
          this.addNewClass.college +
          this.addNewClass.faculty +
          this.addNewClass.grade +
          this.addNewClass.level +
          this.addNewClass.orderNumber +
          this.addNewClass.classText;
      }
      this.editNewClassName = text;
      return text;
    }
  },
  methods: {
    afterSelectAddBanWei(o){
      this.committeeData.studentUserId = o.userId;
      this.committeeData.studentId = o.userNo;
      this.committeeData.studentName = o.name;
      this.newCommittee.studentName = o.name
      this.newCommittee.studentId = o.userNo
      this.newCommittee.checkResult = "";
    },
    _initColumnsOfSearch: function() {
      var that = this;
      this.columns = [
        {
          id: "classFullName",
          title: this.translate.classFullName,
          className: "text-left",
          hidden: false,
          search: {
            type: "input"
          }
        },
        {
          id: "createTime",
          title: this.translate.established,
          className: "text-center",
          hidden: false
        },
        {
          id: "dissolutionTime",
          title: this.translate.dissolutionTime,
          className: "text-center",
          hidden: false
        },
        {
          id: "classLeader",
          title: this.translate.headTeacher,
          className: "text-left",
          hidden: false
        },
        {
          id: "instructor",
          title: this.translate.instructor,
          className: "text-left",
          hidden: false
        },
        {
          id: "studentCount",
          title: this.translate.numberOfMembers,
          className: "text-right",
          hidden: false
        },
        {
          id: "opt",
          title: this.translate.opt,
          className: "text-center",
          width: "210px",
          hidden: false,
          formatter: function() {
            return [
              {
                tag: "a",
                text: that.translate.edit,
                className: "opt-btn",
                callback: function(record, index) {
                  that.showEditClassModal = true;
                  that.isEditClass = false;
                  sAjax({
                    url: "/api/relClass/getClass/" + record.classId,
                    dataType: "json",
                    type: "get",
                    success: function(data) {
                      if (data.state) {
                        var result = data.data;
                        that.editClass.classId = result.classId;
                        that.editClass.classFullName = result.classFullName;
                        that.editClass.classLeaderId = result.classLeaderId;
                        that.editClass.classLeaderUserId =
                          result.classLeaderUserId;
                        that.editClass.classLeaderName = result.classLeaderName;
                        that.editClass.instructorId = result.instructorId;
                        that.editClass.instructorUserId =
                          result.instructorUserId;
                        that.editClass.instructorName = result.instructorName;
                        that.editClass.createTime = result.createTime;
                        that.editClass.dissolutionTime = result.dissolutionTime;
                        that.editClass.classLeaderStartTime =
                          result.classLeaderStartTime;
                        that.editClass.classLeaderEndTime =
                          result.classLeaderEndTime;
                        that.editClass.instructorStartTime =
                          result.instructorStartTime;
                        that.editClass.instructorEndTime =
                          result.instructorEndTime;
                        that.editClass.classCommitteePeople =
                          result.classCommitteePersonVos;
                        that.editClass.classLeaders = result.classLeaders;
                        that.editClass.instructors = result.instructors;
                        that.positionOption = result.classCommitteeTypes;
                        that.committeeTypes.splice(
                          0,
                          that.committeeTypes.length
                        );
                      } else {
                        that.$toast(data.message);
                      }
                    }
                  });
                }
              },
              {
                tag: "a",
                text: that.translate.classMembers,
                className: "opt-btn",
                callback: function(record, index) {
                  that.isManagePage = "memberList";
                  that.isShowMemberPage = true;
                  that.classId = record.classId;
                  that.$emit("showPathNav", record.classFullName);
                }
              },
              {
                tag: "a",
                text: that.translate.remove,
                className: "opt-btn",
                callback: function(record, index) {
                  if (confirm(that.translate.removeConfirmTip)) {
                    sAjax({
                      url: "/api/relClass/deleteClass/" + record.classId,
                      dataType: "json",
                      type: 'post',
                      success: function(data) {
                        if (data.state) {
                          that.url =
                            "/table-data/relClass/getClasses?timestamp=" +
                            new Date().getTime();
                          that.$toast(that.translate.removeSuccessTip);
                        } else {
                          that.$toast(
                            that.translate.removeFailedTip + ":" + data.message
                          );
                        }
                      }
                    });
                  }
                }
              }
            ];
          }
        }
      ];
    },
    studentClasses: function() {
      this.isParentPage = false;
    },
    backParentPage: function() {
      this.isParentPage = true;
    },
    backClassList: function() {
      this.isManagePage = "classManage";
      this.isShowMemberPage = false;
      this.$emit("hidePathNav");
    },
    createClass: function() {
      this.showAddClassModal = true;
      this.addNewClass = {
        college: "",
        collegeId: "",
        grade: "",
        gradeId: "",
        level: "",
        levelId: "",
        faculty: "",
        orderNumber: [],
        orderNumberId: [],
        createClass: "",
        classNumber: 0,
        classText: ""
      };
      this.classHistory = this.translate.noClassText;
      this.orderNumberStr = "";
      this.isnextStep = false;
    },
    sureCreat: function() {
      var that = this;
      var classData = null;
      this.classList.splice(0, this.classList.length);
      this.newClassData.className = this.addNewClass.faculty;
      this.newClassData.college = this.addNewClass.collegeId;
      this.newClassData.learningLevel = this.addNewClass.levelId;
      this.newClassData.grade = this.addNewClass.gradeId;
      if (this.addNewClass.orderNumber.length > 0) {
        for (var i in this.addNewClass.orderNumber) {
          this.newClassData.classFullName = this.newClassNameArr[i].replace(
            /(\s*$)/g,
            ""
          );
          var index = this.fullNameArr.indexOf(this.newClassData.classFullName);
          if (index >= 0) {
            return this.$toast(this.newClassData.classFullName + "已存在");
          }
          this.newClassData.classNumber = this.addNewClass.orderNumberId[i];
          classData = JSON.parse(JSON.stringify(this.newClassData));
          this.classList.push(classData);
        }
      } else {
        this.newClassData.classFullName = this.newClassNameArr[0].replace(
          /(\s*$)/g,
          ""
        );
        var index = this.fullNameArr.indexOf(this.newClassData.classFullName);
        if (index >= 0) {
          return this.$toast(this.newClassData.classFullName + "已存在");
        }
        this.newClassData.classNumber = "";
        classData = JSON.parse(JSON.stringify(this.newClassData));
        this.classList.push(classData);
      }
      sAjax({
        url: "/api/relClass/addClass",
        dataType: "json",
        data: {
          classList: this.classList
        },
        type: "post",
        success: function(data) {
          if (data.state) {
            that.getClassHistory();
            that.url =
              "/table-data/relClass/getClasses?timestamp=" +
              new Date().getTime();
            that.$toast(that.translate.submitSuccessTip);
            that.showAddClassModal = false;
          } else {
            that.$toast(that.translate.submitFailedTip + ":" + data.message);
          }
        }
      });
    },
    collegeSelected: function(obj) {
      this.addNewClass.collegeId = obj.value;
      this.collegeOptions.addClass.forEach((ele, i) => {
        if (this.addNewClass.collegeId === ele.id) {
          this.addNewClass.college = ele.text;
        }
      });
      this.addNewClass.classNumber = 1;
      this.getClassHistory();
    },
    gradeSelected: function(obj) {
      this.addNewClass.gradeId = obj.value;
      this.gradeOptions.addClass.forEach((ele, i) => {
        if (this.addNewClass.gradeId === ele.id) {
          this.addNewClass.grade = ele.text;
        }
      });
      this.addNewClass.classNumber = 1;
      this.getClassHistory();
    },
    levelSelected: function(obj) {
      this.addNewClass.levelId = obj.value;
      this.levelOptions.addClass.forEach((ele, i) => {
        if (this.addNewClass.levelId === ele.id) {
          this.addNewClass.level = ele.text;
        }
      });
      this.addNewClass.classNumber = 1;
      this.addNewClass.classText = this.translate.classText;
      this.getClassHistory();
    },
    orderNumberSelected: function(obj) {
      if (obj.value.length > 0) {
        var orderNumberIdArray = [];
        this.orderNumberStr = obj.value;
        orderNumberIdArray = obj.value.split(",");
        this.addNewClass.orderNumberId = orderNumberIdArray.sort(
          this.sortNumber
        );
        this.addNewClass.orderNumber = [];
        for (var i in this.addNewClass.orderNumberId) {
          for (var j in this.orderNumberOptions) {
            if (
              this.addNewClass.orderNumberId[i] ===
              this.orderNumberOptions[j].id
            ) {
              var index = this.addNewClass.orderNumber.indexOf(
                this.orderNumberOptions[j].text
              );
              if (index < 0) {
                this.addNewClass.orderNumber.push(
                  this.orderNumberOptions[j].text
                );
              }
            }
          }
        }
        if (this.addNewClass.orderNumberId.length === 0) {
          this.addNewClass.classText = this.translate.classText;
        } else {
          this.addNewClass.classText = " ";
        }
      }
    },
    sortNumber: function(a, b) {
      return a - b;
    },
    addNewcommittee: function() {
      this.newCommittee = {
        name: "",
        studentId: "",
        studentName: "",
        defaultOptions: "",
        checkResult: ""
      };
      this.committeeData.startTime = "";
      this.committeeData.endTime = "";
      this.isEditClass = true;
      this.showAddCommitteeModal = true;
    },
    customizePosition: function() {
      this.positionType.select = "";
      this.newCommittee.name = "";
      this.positionOptType =
        this.positionOptType === "select" ? "input" : "select";
      return this.positionOptType;
    },
    collegeOptionsSelected: function(obj) {
      if (obj.value === "-1") {
        this.definedSearch.college = "";
      } else {
        this.definedSearch.college = obj.value;
      }
    },
    levelOptionsSelected: function(obj) {
      if (obj.value === "-1") {
        this.definedSearch.learningLevel = "";
      } else {
        this.definedSearch.learningLevel = obj.value;
      }
    },
    gradeOptionsSelected: function(obj) {
      if (obj.value === "-1") {
        this.definedSearch.grade = "";
      } else {
        this.definedSearch.grade = obj.value;
      }
    },
    collegeCheck: function(obj) {
      this.templateData.collegeId = obj.value;
    },
    gradeCheck: function(obj) {
      this.templateData.gradeId = obj.value;
    },
    getClassHistory: function() {
      var that = this;
      sAjax({
        url: "/api/relClass/getClassHistory",
        dataType: "json",
        data: {
          college: this.addNewClass.collegeId,
          learningLevel: this.addNewClass.levelId,
          grade: this.addNewClass.gradeId
        },
        type: "get",
        success: function(data) {
          if (data.state) {
            var historyClassText = "";
            if (data.data.fullNames.length > 0) {
              var text =
                that.translate.createdText +
                data.data.count +
                that.translate.pieceClass +
                "," +
                that.translate.classNameText +
                ":";
              for (var i in data.data.fullNames) {
                historyClassText += data.data.fullNames[i] + "\n";
                that.fullNameArr.push(
                  data.data.fullNames[i].replace(/(\s*$)/g, "")
                );
              }
              that.classHistory = text + "\n" + historyClassText;
            } else {
              that.classHistory = that.translate.noClassText;
            }
          } else {
            that.$toast(data.message);
          }
        }
      });
    },
    checkClassLeaderId: function() {
      var that = this;
      if (!that.editClass.classLeaderId) {
        that.checkMessage.classLeader = that.translate.enterStudentId;
        return false;
      }
      that.isEditClass = true;
      sAjax({
        url: "/api/relationship/checkUserId/" + that.editClass.classLeaderId,
        dataType: "json",
        type: "get",
        success: function(data) {
          if (data.state) {
            that.editClass.classLeaderName = data.data.name;
            that.editClass.classLeaderUserId = data.data.userId;
            that.checkMessage.classLeader = "";
          } else {
            that.checkMessage.classLeader = data.message;
            that.editClass.classLeaderName = "";
          }
        }
      });
    },
    checkInstructorId: function() {
      var that = this;
      if (!that.editClass.instructorId) {
        that.checkMessage.instructor = that.translate.enterStudentId;
        return false;
      }
      that.isEditClass = true;
      sAjax({
        url: "/api/relationship/checkUserId/" + that.editClass.instructorId,
        dataType: "json",
        type: "get",
        success: function(data) {
          if (data.state) {
            that.editClass.instructorName = data.data.name;
            that.editClass.instructorUserId = data.data.userId;
            that.checkMessage.instructor = "";
          } else {
            that.checkMessage.instructor = data.message;
            that.editClass.instructorName = "";
          }
        }
      });
    },
    checkStudentId: function() {
      var that = this;
      if (!that.newCommittee.studentId) {
        that.newCommittee.checkResult = that.translate.enterStudentId;
        return false;
      }
      sAjax({
        url: "/api/relClass/checkStudent/" + that.newCommittee.studentId,
        dataType: "json",
        type: "get",
        success: function(data) {
          if (data.state) {
            if (data.data.hasThisPerson) {
              that.newCommittee.studentName = data.data.name;
              that.committeeData.studentUserId = data.data.userId;
              that.committeeData.studentId = data.data.id;
              that.committeeData.studentName = data.data.name;
              that.newCommittee.checkResult = "";
            } else {
              that.newCommittee.checkResult = that.translate.noExist;
              that.newCommittee.studentName = "";
            }
          } else {
            that.newCommittee.checkResult = data.message;
          }
        }
      });
    },
    addCommittee: function() {
      if (
        !this.committeeData.startTime ||
        !this.committeeData.endTime ||
        !this.newCommittee.studentId ||
        !this.newCommittee.studentName
      ) {
        this.$toast(this.translate.improveClassInfo);
        return;
      }
      if (!this.positionType.select && !this.newCommittee.name) {
        this.$toast(this.translate.improveClassInfo);
        return;
      }
      if (this.positionType.select) {
        this.committeeData.classCommitteeId = this.positionType.select;
        this.committeeData.classCommittee = this.positionType.selectName;
      } else {
        this.committeeData.classCommitteeId = this.newCommittee.name;
        this.committeeData.classCommittee = this.newCommittee.name;
        this.committeeTypes.push(this.newCommittee.name);
      }
      var newCommitteeData = JSON.parse(JSON.stringify(this.committeeData));
      var isAddCommittee = false;
      if (this.editClass.classCommitteePeople.length > 0) {
        this.editClass.classCommitteePeople.forEach(ele => {
          if (
            this.newCommittee.studentId === ele.studentId &&
            this.committeeData.classCommittee === ele.classCommittee
          ) {
            isAddCommittee = true;
            this.$toast("同一个职位不能同一个人");
            return false;
          }
        });
      }
      if (!isAddCommittee) {
        this.editClass.classCommitteePeople.push(newCommitteeData);
        this.showAddCommitteeModal = false;
        this.positionType.select = "";
      }
    },
    positionSelected: function(obj) {
      this.positionType.select = obj.value;
      this.positionType.selectName = obj.target.selected;
    },
    committeeStartTime: function(d) {
      this.committeeData.startTime = d.value;
    },
    committeeEndTime: function(d) {
      this.committeeData.endTime = d.value;
    },
    createTimeSelected: function(d) {
      this.editClass.createTime = d.value;
    },
    dissolutionTimeSelected: function(d) {
      this.editClass.dissolutionTime = d.value;
    },
    classLeaderStartTime: function(d) {
      this.editClass.classLeaderStartTime = d.value;
    },
    classLeaderEndTime: function(d) {
      this.editClass.classLeaderEndTime = d.value;
    },
    instructorStartTime: function(d) {
      this.editClass.instructorStartTime = d.value;
    },
    instructorEndTime: function(d) {
      this.editClass.instructorEndTime = d.value;
    },
    cancelEditModal: function() {
      if (this.isEditClass) {
        if (confirm(this.translate.cancelEditText)) {
          this.showEditClassModal = false;
        }
      } else {
        this.showEditClassModal = false;
      }
    },
    editClassInfo: function() {
      var that = this;
      if(!this.editClass.classFullName) return this.$toast('班级名称不能为空')
      sAjax({
        url: "/api/relClass/editClass/" + this.editClass.classId,
        dataType: "json",
        data: {
          classFullName: this.editClass.classFullName,
          createTime: this.editClass.createTime,
          dissolutionTime: this.editClass.dissolutionTime,
          classLeaderId: this.editClass.classLeaderUserId,
          classLeaderName: this.editClass.classLeaderName,
          classLeaderStartTime: this.editClass.classLeaderStartTime,
          classLeaderEndTime: this.editClass.classLeaderEndTime,
          instructorId: this.editClass.instructorUserId,
          instructorName: this.editClass.instructorName,
          instructorStartTime: this.editClass.instructorStartTime,
          instructorEndTime: this.editClass.instructorEndTime,
          classCommitteePersonVos: this.editClass.classCommitteePeople,
          committeeTypes: this.committeeTypes
        },
        type: 'post',
        success: function(data) {
          if (data.state) {
            that.url =
              "/table-data/relClass/getClasses?timestamp=" +
              new Date().getTime();
            that.$toast(that.translate.editSuccessTip);
            that.showEditClassModal = false;
            that.committeeTypes.splice(0, that.committeeTypes.length);
          } else {
            that.$toast(that.translate.editFailedTip + ":" + data.message);
          }
        }
      });
    },
    isEditClassLeaderId: function() {
      this.isEditClass = true;
    },
    isEditClassLeaderName: function() {
      this.isEditClass = true;
    },
    isInstructorId: function() {
      this.isEditClass = true;
    },
    isInstructorName: function() {
      this.isEditClass = true;
    },
    nextStep: function() {
      if (!this.addNewClass.collegeId) {
        this.$toast(this.translate.noSelectedCollege);
        return false;
      }
      if (!this.addNewClass.gradeId) {
        this.$toast(this.translate.noSelectedGrade);
        return false;
      }
      if (!this.addNewClass.levelId) {
        this.$toast(this.translate.noSelectedLevel);
        return false;
      }
      this.newClassNameArr = [];
      var classNameStr = this.editNewClassName.split(":\n")[1];
      var classNameArr = classNameStr.split("\n");
      this.newClassNameArr = this.removeEmptyArrayEle(classNameArr);
      this.isnextStep = true;
    },
    previous: function() {
      this.isnextStep = false;
    },
    removeEmptyArrayEle: function(arr) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] == undefined || arr[i] === "") {
          arr.splice(i, 1);
          i = i - 1; // i - 1 ,因为空元素在数组下标 2 位置，删除空之后，后面的元素要向前补位，
          // 这样才能真正去掉空元素,觉得这句可以删掉的连续为空试试，然后思考其中逻辑
        }
      }
      return arr;
    }
  }
};
</script>
<style lang="less">
@import url("../../assets/common.less");
#classManage-page {
  position: relative;
  .class-member-page {
    z-index: 100;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    width: 100%;
    height: 105%;
    background: rgb(245, 245, 245);
  }
  .addClass-input-group {
    width: 100%;
    margin-bottom: 18px;
    .search-select {
      width: 200px;
      margin: 0 18px;
    }
    .search-input {
      margin: 0 18px;
      width: 200px;
      float: initial;
    }
  }
  .addClass-text {
    width: 135px;
    text-align: right;
  }
  .creat-class-text {
    vertical-align: top;
    width: 135px;
    text-align: right;
  }
  .edit-class-name-text {
    margin-left: 47px;
    margin-bottom: 10px;
  }
  .create-class-textarea {
    width: 70%;
    resize: none;
    margin-left: 18px;
    cursor: not-allowed;
    padding: 5px;
  }
  .edit-class-input {
    margin-top: -6px !important;
    width: 300px !important;
  }
  .submit-btn {
    background: #298df7;
    border-radius: 100px;
    color: white;
    font-weight: 500;
  }
  .addclass-learnLevel-text {
    margin-left: 27px;
  }
  .new-class-text {
    vertical-align: top;
    margin-left: 14px;
  }
  .modal-content {
    top: 0;
  }
  .radio-area {
    display: inline-block;
    margin-left: 18px;
  }
  .template-relationship-text {
    vertical-align: top;
  }
  .class-committee-group .btn-block,
  .edit-class-group .btn-block {
    width: auto;
  }
  .class-committee-group .search-select {
    width: 220px;
    margin-left: 18px;
  }
  .time-picker {
    margin-left: 18px;
    display: inline-block;
    .form-control.v-datepicker-input {
      border-radius: 0;
      border-top: 0 solid #ffffff;
      border-left: 0 solid #ffffff;
      border-right: 0 solid #ffffff;
      border-bottom: 2px solid #e0e0e0;
      box-shadow: inset 0 0px 0px rgba(0, 0, 0, 0.075);
      padding: 0;
      width: 220px !important;
    }
  }
  .historyRecord-btn {
    color: white;
    background: #298df7;
    border-radius: 100px;
    margin-left: 10px;
    padding: 3px 12px;
    margin: 10px 0 20px 0;
  }
  .classCommittee-text {
    width: 110px;
    text-align: right;
  }
  .historyRecord-container {
    border: 1px solid #e0e0e0;
    margin-bottom: 20px;
  }
  .historyRecord-container .table-container {
    margin: auto;
  }
  .historyRecord-container table .table-header {
    display: none;
  }
  .class-committee-group .datepicker-popup {
    position: fixed;
  }
  .idcheckResult {
    margin: 5px 0 0 153px;
    color: red;
  }
  .errorMsg {
    margin: 5px 0 0 132px;
    color: red;
  }
  .class-committee-group .form-control[readonly],
  .edit-class-group .form-control[readonly] {
    background: #ffffff;
  }
  .committeeList .opt-btn {
    color: red;
  }
  .edit-class-text {
    width: 130px;
    text-align: right;
  }
  .class-name-text {
    margin-left: 18px;
    font-size: 13px;
    font-weight: 500;
  }
  .customize-btn {
    margin-left: 0px;
  }
  .name-input {
    border-radius: 0;
    border-top: 0 solid #ffffff;
    border-left: 0 solid #ffffff;
    border-right: 0 solid #ffffff;
    border-bottom: 2px solid #e0e0e0;
    box-shadow: inset 0 0px 0px rgba(0, 0, 0, 0.075);
    padding: 0;
  }
  .form-control[readonly] {
    background: #fff;
  }
}
#batchSet-page {
  .addClass-input-group {
    width: 100%;
    margin-bottom: 18px;
  }
  .search-select {
    width: 45%;
    margin-left: 18px;
    padding: 0;
    font-size: 15px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.67);
    border-radius: 0;
    border: none;
    box-shadow: none;
    border-bottom: 2px solid #e0e0e0;
    resize: none;
    background: transparent;
    transition: all 0.3s ease-out;
    &:focus {
      border-bottom: 2px solid #298df7;
    }
  }
  .dropdown-toggle {
    padding-left: 0;
    background: transparent;
    border: none;
    -webkit-box-shadow: none;
    box-shadow: none;
  }
  .addclass-learnLevel-text {
    margin-left: 27px;
  }
  .radio-area {
    display: inline-block;
    margin-left: 18px;
  }
  .template-relationship-text {
    vertical-align: top;
  }
}
</style>
