<template>
  <div class="row member">
    <div class="back-parent-page">
      <button type="button" class="btn back-btn clearBtnBorder box_flex align_center" @click="_backParentPage">
        <i class="maticon back-icon-btn" v-html="icons('arrow_back')">arrow_back</i>
        <span class="nav-title">{{selectItem.parentPageTitle}}</span>
      </button>
    </div>
    <v-table ref="memberTable" :title="memberTitle" :url="memberUrl+timestamp" pagesize="10" idField="id" :columns="memberColumns" :multiple="selectItem.isInstructor" @afterChecked="afterChecked" :order="true" :search="false">
      <div slot="btn-group" class="btn-group pull-right" role="group">
        <button type="button" v-if="checkRows.length" class="btn batch-add-btn btn-bgColor-style clearBtnBorder" @click="_batchDeletePosition">{{translate.batch}}{{translate.delete}}职务</button>
        <button type="button" v-if="checkRows.length" class="btn batch-add-btn btn-bgColor-style clearBtnBorder" @click="_batchDeleteMember">{{translate.batch}}{{translate.delete}}{{translate.member}}</button>
        <button type="button" class="btn batch-add-btn btn-bgColor-style clearBtnBorder" v-if="selectItem.isInstructor || orgM" @click="quickAddRecord">{{translate.batch}}{{translate.add}}{{translate.member}}</button>
        <button type="button" v-if="selectItem.isInstructor || orgM" class="btn add-organization btn-bgColor-style clearBtnBorder box_flex align_center" @click="_showAddMemberModal">
          <i class="maticon pull-left" style="font-size:20px" v-html="icons('add')">add</i>
          {{translate.add}}{{translate.member}}
        </button>
        <button
              type="button"
              class="btn add-organization btn-bgColor-style clearBtnBorder"
              @click="_exportList"
            >
              <!-- <i class="maticon pull-left" v-html="icons('add')">add</i> -->
              导出
            </button>
      </div>
    </v-table>
    <v-modal :show="showAddMemberModal" effect="fade" width="746" class="organization-modal">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title" v-if="!isEdit">{{translate.add}}{{translate.member}}</h5>
        <h5 class="modal-title" v-if="isEdit">{{translate.edit}}{{translate.member}}</h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="form-wrap box_flex align_center">
          <div class="form-group box_flex align_center">
            <div class="label">成员:</div>
            <detect placeholder="检测学生学号/姓名" v-if="!isEdit" url='/api/users/check/searchResults' @afterSelected="userSelected"></detect>
            <input type="text" class="value-input" disabled v-else :value="memberUserName+'('+memberUserNo+')'">
          </div>
          <div class="form-group box_flex align_center">
            <div class="label">组织部门:</div>
            <v-select :options="orgDepartmentList" options-value="id" options-label="text" close-on-select justify v-model="orgDepartmentId" @afterSelected="_changeDepartmentId"></v-select>
          </div>
          <div class="form-group box_flex align_center">
            <div class="label">部门职务:</div>
            <v-select :options="positionList" options-value="id" options-label="text" close-on-select justify v-model="positionId"></v-select>
          </div>
          <div v-if="positionId" class="form-group box_flex align_center">
            <div class="label">任职开始时间:</div>
            <v-datepicker v-model="beginTime"></v-datepicker>
          </div>
          <div v-if="positionId" class="form-group box_flex align_center">
            <div class="label">任职结束时间:</div>
            <v-datepicker v-model="endTime"></v-datepicker>
          </div>
          <div class="form-group box_flex align_center">
            <button @click="addMember" class="btn submit-btn">新增</button>
          </div>
        </div>
        <v-table :rows="memberAddList" order="true" :columns="memberAddColumns"></v-table>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="showAddMemberModal = false">{{translate.cancel}}</button>
        <button type="button" class="btn submit-btn clearBtnBorder" @click="_checkMemberUserNo">{{translate.confirm}}</button>
      </div>
    </v-modal>
    <div class="importPageClass" v-show="curRoute === 'importPage'">
      <v-import v-bind="importParams" @backParentPage="curRoute = 'allStaff'"></v-import>
    </div>
  </div>
</template>
<script>
import { sAjax, request, translation } from "../../assets/utils/utils.js";
import importTable from "../../mixins/import.js";
export default {
  mixins: [importTable],
  data() {
    return {
      memberUrl: `/table-data/sc/organizations/${
        this.selectItem.organizationId
        }/members`,
      memberColumns: [],
      timestamp: "?timestamp=",
      memberUserNo: "",
      memberUserName: '',
      memberAddColumns: [],
      orgDepartmentList: [],
      memberAddList: [],
      positionList: [],
      orgDepartmentId: "", //新增编辑组织部门id
      selectOrgDepartment: {},
      selectPosition: {},
      positionId: "", //新增编辑职务id
      isEdit: false,
      showAddMemberModal: false,
      lang: "zh-cn",
      beginTime: "",
      checkRows: [],
      endTime: ""
    };
  },
  props: {
    selectItem: {
      default: {}
    },
    orgM: {
      default: false
    }
  },
  created() {
    var la = localStorage.getItem("lang");
    var that = this;
    this.getCollegeList();
    this.memberAddColumns = [
      {
        id: "name",
        title: "部门+职务",
        className: "text-left",
        formatter(record) {
          return record.selectOrgDepartment.text + record.selectPosition.text;
        }
      },
      {
        id: "beginTime",
        title: "任职开始时间",
        className: "text-left"
      },
      {
        id: "endTime",
        title: "任职结束时间",
        className: "text-left"
      },
      {
        id: "opt",
        title: this.translate.opt,
        className: "text-center",
        width: "230px",
        hidden: false,
        formatter: function (obj) {
          return [
            {
              tag: "a",
              text: "移除",
              className: "opt-btn",
              callback: function (record, index) {
                that.memberAddList.splice(index, 1);
              }
            }
          ];
        }
      }
    ];
    if (translation(la)) {
      this.lang = la;
    }
    this.importParams = {
      parentPageTitle: "",
      downloadTemplateUrl: `/sc/organizations/${
        this.selectItem.organizationId
        }/members/batch/import/template`,
      downloadErrorTemplateUrl: `/sc/organizations/${
        this.selectItem.organizationId
        }/members/batch/import/error`,
      checkTemplateUrl: `/sc/organizations/${
        this.selectItem.organizationId
        }/members/batch/import/check`,
      templateName: "批量导入模板",
      importBtnType: [
        {
          url: `/sc/organizations/${
            this.selectItem.organizationId
            }/members/batch/import`,
          method: "post",
          isShowBtn: true,
          name: "增量导入",
          success: data => {
            this.timestamp = "?timestamp=" + new Date().getTime();
            this.curRoute = "allStaff";
          }
        }
      ]
    };
  },
  methods: {
    _exportList(){
      window.location.href="/downloads/sc/organizations/"+this.selectItem.organizationId+"/membersExcel"
    },
    afterChecked(rows) {
      this.checkRows = rows;
    },
    editMember(record) {
      console.log("record", record);
      let url = `api/sc/organizations/${
        record.organizationMemberId
        }/update/information`;
      request(url).then(o => {
        if (o.state) {
          this.showAddMemberModal = true;
          this.isEdit = true;
          this.userId = record.userId;
          this.memberUserNo = record.userNo
          this.memberUserName = record.name
          this.organizationMemberId = record.organizationMemberId;
          this.orgDepartmentId = "";
          this.positionId = "";
          this.memberAddList = [];
          o.data.forEach(o => {
            this.memberAddList.push({
              selectPosition: { text: o.titleName, id: o.titleId },
              selectOrgDepartment: this.getSelect(
                o.departmentId,
                "orgDepartmentList"
              ),
              memberUserNo: this.memberUserNo,
              beginTime: o.fromDate,
              endTime: o.toDate,
            });
          });
        } else {
          this.$toast(o.message);
        }
      });
    },
    deleteMember(record) {
      let url = `api/sc/organizations/${record.organizationId}/members/${
        record.userId
        }`;
      request(url, {}, "post").then(o => {
        if (o.state) {
          this.timestamp = "?timestamp=" + new Date().getTime();
        } else {
          this.$toast(o.message);
        }
      });
    },
    addMember() {
      if (!this.userId) {
        this.$toast("请输入学号或者姓名!");
        return;
      }
      if (!this.orgDepartmentId) {
        this.beginTime = '';
        this.endTime = '';
        this.$toast("请选择部门!");
        return;
      }
      if (this.orgDepartmentId && !this.positionId) {
        this.$toast("请选择职务!");
        return;
      } else if (this.positionId) {
        if (!this.beginTime) {
          this.$toast("请选择开始时间!");
          return;
        }
        if (!this.endTime) {
          this.$toast("请选择结束时间!");
          return;
        }
        if (this.beginTime > this.endTime) {
          this.$toast("结束时间必须大于开始时间!");
          return;
        }
      }
      let hasPosition = false;
      this.memberAddList.forEach(o => {
        if (o.selectPosition.id === this.positionId) {
          hasPosition = true;
          o.beginTime = this.beginTime
          o.endTime = this.endTime
        }
      })
      if (!hasPosition) {
        this.memberAddList.push({
          selectPosition: this.getSelect(this.positionId, "positionList"),
          selectOrgDepartment: this.getSelect(
            this.orgDepartmentId,
            "orgDepartmentList"
          ),
          memberUserNo: this.memberUserNo,
          beginTime: this.beginTime,
          endTime: this.endTime
        });
      }
    },
    getSelect(id, type) {
      for (var i in this[type]) {
        if (this[type][i].id == id) {
          return this[type][i];
        }
      }
      return {
        text: "",
        id: ""
      };
    },
    _changeDepartmentId() {
      this.getPositionList();
    },
    initTable() {
      let that = this
      this.memberColumns = [
        {
          id: "name",
          title: this.translate.studentName,
          className: "text-left",
          hidden: false,
          search: {
            type: "input",
            data: {
              placeholder: ""
            }
          }
        },
        {
          id: "userNo",
          title: this.translate.userNo,
          className: "text-left",
          hidden: false,
          search: {
            type: "input",
            data: {
              placeholder: ""
            }
          }
        },
        {
          id: "collegeCode",
          title: this.translate.college,
          className: "text-left",
          hidden: false,
          search: {
            type: "select",
            data: {
              optionsLabel: "name",
              optionsValue: "code",
              options: that.collegeList,
            }
          },
          formatter(record) {
            return record.collegeName;
          }
        },
        {
          id: "departmentId",
          title: "部门",
          className: "text-left",
          hidden: false,
          search: {
            type: "select",
            data: {
              optionsLabel: "text",
              optionsValue: "id",
              options: that.orgDepartmentList,
              change(obj) {
                that.getPositionList(obj.value)
              }
            }
          },
          formatter(record) {
            return record.departmentName;
          }
        },
        {
          id: "titleId",
          title: "职务",
          className: "text-left",
          hidden: false,
          search: {
            type: "select",
            data: {
              optionsLabel: "text",
              optionsValue: "id",
              options: that.positionList
            }
          },
          formatter(record) {
            return record.titleName;
          }
        },
        {
          id: "opt",
          title: this.translate.opt,
          className: "text-center",
          width: "230px",
          hidden: false,
          formatter: function (obj) {
            if (that.selectItem.isInstructor) {
              return [
                {
                  tag: "a",
                  text: that.translate.edit,
                  className: "opt-btn",
                  callback: function (record, index) {
                    that.editMember(record);
                  }
                },
                {
                  tag: "a",
                  text: that.translate.delete,
                  className: "opt-btn",
                  callback: function (record, index) {
                    if (confirm(that.translate.memberRemoveConfirmTip)) {
                      that.deleteMember(record);
                    }
                  }
                }
              ];
            }
          }
        }
      ];
    },
    getOrgDepartmentList() {
      let url = `api/sc/orgDepartment/options/allOrgDepartment/${
        this.selectItem.organizationId
        }`;
      request(url).then(o => {
        if (o.state) {
          this.orgDepartmentList = o.data;
          this.initTable();
        }
      });
    },
    getPositionList(id) {
      let url = ''
      if (id) {
        url = `api/sc/organizationTitle/selectOptions/${
          this.selectItem.organizationId
          }/${id}`;
      } else {
        url = `api/sc/organizationTitle/selectOptions/${
          this.selectItem.organizationId
          }/${this.orgDepartmentId}`;
      }
      request(url).then(o => {
        if (o.state) {
          this.positionList = o.data;
          if (id) {
            this.initTable();
          }
        }
      });
    },
    getCollegeList() {
      let url = '/api/colleges'
      request(url).then(o => {
        if (o.state) {
          this.collegeList = o.data
          this.getOrgDepartmentList();
        }
      })
    },
    _backParentPage() {
      this.$parent.showMember = false;
      this.$parent.pageSign = "organizationList";
    },
    userSelected(obj) {
      console.log('obj', obj)
      this.userId = obj.userId
    },
    _checkMemberUserNo: function () {
      if (this.isEdit) {
        let url = `/api/sc/organizations/${
          this.organizationMemberId
          }/update/members`;
        let params = {};
        params.organizationMemberUpdateVO = this.memberAddList.map(o => {
          let a = {
            fromDate: o.beginTime,
            toDate: o.endTime,
            titleId: o.selectPosition.id ? o.selectPosition.id : ""
          };
          return a;
        });
        request(url, params.organizationMemberUpdateVO, "post").then(o => {
          if (o.state) {
            this.$toast("编辑成功");
            this.showAddMemberModal = false;
            this.timestamp = "?timestamp=" + new Date().getTime();
          }
        });
        return;
      }
      if (!this.userId) {
        this.$toast(this.translate.userNoExistedTip);
        return false;
      }
      let url = `/api/sc/organizations/${
        this.selectItem.organizationId
        }/members`;
      let params = {
        userId: this.userId
      };
      params.organizationDuties = this.memberAddList.map(o => {
        let a = {
          fromDate: o.beginTime,
          toDate: o.endTime,
          titleId: o.selectPosition.id ? o.selectPosition.id : ""
        };
        return a;
      });
      request(url, params).then(o => {
        if (o.state) {
          this.$toast("新增成功");
          this.showAddMemberModal = false;
          this.timestamp = "?timestamp=" + new Date().getTime();
        } else {
          this.$toast(o.message);
        }
      });
      return
      sAjax({
        url:
          "/api/sc/organizations/" +
          this.selectItem.organizationId +
          "/members/" +
          this.memberUserNo +
          "/existence",
        dataType: "json",
        type: "get",
        success: data => {

        }
      });
    },
    _showAddMemberModal: function () {
      this.showAddMemberModal = true;
      this.isEdit = false;
      this.memberAddList = [];
      this.memberUserNo = "";
    },
    _batchDeletePosition() {
      //批量删除职务
      if (confirm('确认移除选中成员的职务?')) {
        let str = "?organizationMemberId=";
        console.log(this.checkRows);
        let list = this.checkRows.map((o, index) => {
          if (index == this.checkRows.length - 1) {
            str += o.organizationMemberId;
          } else {
            str += o.organizationMemberId + ",";
          }
          return o.organizationMemberId;
        });

        let url = `api/sc/organizations/${
          this.selectItem.organizationId
          }/members/duty${str}`;
        request(url, {}, "post").then(o => {
          if (o.state) {
            this.timestamp = "?timestamp=" + new Date().getTime();
          } else {
            this.$toast(o.message);
          }
        });
      }
    },
    _batchDeleteMember() {
      //批量删除人员
      if (confirm('确认移除选中成员?')) {
        let str = "?userId=";
        let list = this.checkRows.map((o, index) => {
          if (index == this.checkRows.length - 1) {
            str += o.userId;
          } else {
            str += o.userId + ",";
          }
          return o.userId;
        });

        let url = `api/sc/organizations/${
          this.selectItem.organizationId
          }/members/all${str}`;
        request(url, {}, "post").then(o => {
          if (o.state) {
            this.timestamp = "?timestamp=" + new Date().getTime();
          } else {
            this.$toast(o.message);
          }
        });
      }
    }
  },
  computed: {
    translate: function () {
      return translation(this.lang).organizationManage;
    }
  }
};
</script>
<style lang="less" scoped>
.form-wrap {
  width: 100%;
  flex-wrap: wrap;
  .form-group {
    width: 47%;
    .label {
      width: 100px;
      font-size: 14px;
      color: #666;
      text-align: right;
      padding-right: 12px;
    }
    .v-select,
    .form-control,
    .ditection,
    .value-input,
    .v-datepicker {
      width: 200px;
    }
  }
}
</style>
