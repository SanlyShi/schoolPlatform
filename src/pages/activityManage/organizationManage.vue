<template>
  <div id="organization-manage" class="container-fluid" v-if="!isImportPage">
    <div class="row text-center" v-if="pageSign === 'organizationList'">
      <v-table
        ref="organizationTable"
        :title="listTitle"
        v-if="listUrl"
        :url="listUrl+'&departmentId='+selectDepartment"
        pagesize="10"
        idField="id"
        :columns="listColumns"
        :multiple="false"
        :order="true"
        :search="true"
      >
        <div slot="btn-group" role="group">
          <v-select
            v-if="newOrganizationType==='SCHOOL'"
            :options="departmentList"
            options-value="id"
            options-label="text"
            close-on-select
            justify
            v-model="selectDepartment"
            @afterSelected="_changeDepartment"
          ></v-select>
          <div
            class="btn-group pull-left"
            style="margin-right:6px"
            v-if="organizationType === 'college'"
          >
            <v-select
              :options="collegeOptions"
              :value="defaultCode"
              options-value="code"
              options-label="name"
              close-on-select
              justify
              @afterSelected="_changeCollege"
            ></v-select>
          </div>
          <div class="btn-group pull-right">
            <button
              type="button"
              class="btn batch-add-btn btn-bgColor-style clearBtnBorder"
              @click="_export"
            >{{translate.export}}</button>
            <button
              type="button"
              class="btn batch-add-btn btn-bgColor-style clearBtnBorder"
              @click="_batchAdd"
            >{{translate.batchAddOrganization}}</button>
            <button
              type="button"
              class="btn add-organization btn-bgColor-style clearBtnBorder"
              @click="_showAddOrganizationModal"
            >
              <i class="maticon pull-left" v-html="icons('add')">add</i>
              {{translate.add}}{{translate.organization}}
            </button>
            
          </div>
        </div>
      </v-table>
    </div>
    <member v-else-if="pageSign === 'member'" :selectItem="selectItem" :orgM="true"></member>
    <position v-else :selectItem="selectItem"></position>
    <v-modal :show="showAddOrganizationModal" effect="fade" width="446" class="organization-modal">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">{{listModalType}}{{translate.organization}}</h5>
      </div>
      <div slot="modal-body" class="modal-body addOrganizationGroup">
        <v-select
            :options="departmentList"
            options-value="id"
            options-label="text"
            close-on-select
            justify
            v-if="newOrganizationType==='SCHOOL'"
            v-model="organization.departmentId"
            @afterSelected="_changeDepartment"
          ></v-select>
        <div class="form-group">
          <input
            type="text"
            class="form-control search-input organization-input"
            :placeholder="translate.namePlaceholder"
            maxlength="50"
            v-model="organization.orgName"
          >
        </div>
        <div class="form-group">
          <input
            type="text"
            class="form-control search-input organization-input"
            :placeholder="translate.instructorPlaceholder"
            v-model="organization.userNo"
          >
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button
          type="button"
          class="btn cancel-btn clearBtnBorder"
          @click="showAddOrganizationModal = false"
        >{{translate.cancel}}</button>
        <button
          type="button"
          class="btn submit-btn clearBtnBorder"
          @click="_changeOrganization"
        >{{translate.confirm}}</button>
      </div>
    </v-modal>
  </div>
  <v-import
    v-bind="importDutyParams"
    @backParentPage="backToDutyList"
    v-else-if="importDutyParams.show"
  ></v-import>
  <v-import v-bind="importParams" @backParentPage="backParentPage" v-else></v-import>
</template>

<script>
import Vue from "vue";
import { sAjax, request, translation } from "../../assets/utils/utils.js";
import member from "./member.vue";
import position from "./position.vue";
export default {
  props: {
    data: {
      default: null
    }
  },
  created: function() {
    var la = localStorage.getItem("lang");
    var that = this;
    if (translation(la)) {
      this.lang = la;
    }
    this.organizationType = this.$route.query.id;
    if (this.organizationType === "college") {
      this.listTitle = "";
      this.importParams.parentPageTitle = this.translate.collegeTitle;
      this.newOrganizationType = "COLLEGE";
      sAjax({
        url: "/api/currentUser/role/manageColleges?roleId=22",
        dataType: "json",
        type: "get",
        success: data => {
          if (data.state) {
            if (data.data.length > 0) {
              this.collegeOptions = data.data;
              this.defaultCode = data.data[0].code;
              this.collegeName = data.data[0].name;
            }
          } else {
            this.$toast(data.message);
          }
        }
      });
    } else {
      this.listTitle = "";
      this.importParams.parentPageTitle = this.translate.schoolTitle;
      this.newOrganizationType = "SCHOOL";
    }
    this.listColumns = [
      {
        id: "name",
        title: this.translate.name,
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
        id: "department",
        title: "所属部门",
        className: "text-left",
        hidden: true,
        formatter(record) {
          return record.department ? record.department.name : "";
        }
      },
      {
        id: "instructorName",
        title: this.translate.instructor,
        className: "text-left",
        hidden: false
      },
      {
        id: "opt",
        title: this.translate.opt,
        className: "text-center",
        width: "230px",
        hidden: false,
        formatter: function(obj) {
          return [
            {
              tag: "a",
              text: that.translate.organization + that.translate.member,
              className: "opt-btn",
              callback: function(record, index) {
                that.pageSign = "member";
                that.selectItem = {
                  organizationId: record.id,
                  parentPageTitle: record.name,
                  isInstructor: true,
                };
              }
            },
            {
              tag: "a",
              text: "组织部门",
              className: "opt-btn",
              callback: function(record, index) {
                that.$parent.addBread({
                  title: "组织部门管理",
                  reflash: true,
                  route: `/activityManage/orgDepartmentManage?organizationId=${record.id}`
                });
              }
            },
            {
              tag: "a",
              text: that.translate.position,
              className: "opt-btn",
              callback: function(record, index) {
                that.pageSign = "position";
                that.selectItem = {
                  organizationId: record.id,
                  parentPageTitle: record.name,
                  isInstructor: true,
                };
              }
            },
            {
              tag: "a",
              text: that.translate.edit,
              className: "opt-btn",
              callback: function(record, index) {
                that.showAddOrganizationModal = true;
                that.listModalType = that.translate.edit;
                that.organization = {
                  orgName: record.name,
                  userNo: record.instructorNo,
                  departmentId: record.department ? record.department.id : ""
                };
                that.organizationId = record.id;
              }
            },
            {
              tag: "a",
              text: obj.enable ? that.translate.dsable : that.translate.enable,
              className: "opt-btn",
              callback: function(record, index) {
                sAjax({
                  url: "/api/sc/organizations/" + record.id + "/availability",
                  dataType: "json",
                  type: 'post',
                  data: {
                    enable: obj.enable ? false : true
                  },
                  success: function(data) {
                    if (data.state) {
                      that.$toast(that.translate.optTips);
                      that.timestamp = new Date().getTime();
                    } else {
                      that.$toast(data.message);
                    }
                  }
                });
              }
            }
          ];
        }
      }
    ];
    if (this.organizationType === "school") {
      this.listColumns[1].hidden = false;
    }
    this.getDepartmentList();
  },
  data: function() {
    return {
      listColumns: [],
      selectItem: {},
      showMember: false,
      departmentList: [], //部门列表
      selectDepartment: "",
      positionBaseUrl: "",
      organizationType: "",
      newOrganizationType: "",
      listTitle: "",
      isImportPage: false,
      collegeOptions: [],
      defaultCode: "",
      collegeName: "",
      timestamp: "",
      positionName: "",
      positionUserId: "",
      orgDepartmentId: "", //选中的组织部门Id
      orgDepartmentList: [], //组织部门列表
      positionId: null,
      showAddOrganizationModal: false,
      listModalType: "",
      organization: {
        orgName: "",
        userNo: "",
        departmentId:'',
      },
      organizationId: null,
      memberUserNo: null,
      memberUserId: null,
      importBtnType: [],
      checkTemplateUrl: "",
      importParams: {
        parentPageTitle: "",
        downloadTemplateUrl: "",
        downloadErrorTemplateUrl: "",
        checkTemplateUrl: "",
        templateName: "",
        importBtnType: null
      },
      importDutyParams: {
        show: false,
        parentPageTitle: "",
        downloadTemplateUrl: "",
        downloadErrorTemplateUrl: "",
        checkTemplateUrl: "",
        templateName: "",
        importBtnType: null
      },
      pageSign: "organizationList",
      parentPageTitle: "",
      lang: "zh-cn"
    };
  },
  components: { member, position },
  computed: {
    translate: function() {
      return translation(this.lang).organizationManage;
    },
    listUrl: function() {
      if (this.organizationType === "college") {
        if (this.defaultCode) {
          return (
            "/table-data/sc/organizations?type=" +
            this.newOrganizationType +
            "&collegeCode=" +
            this.defaultCode +
            "&timestamp=" +
            this.timestamp
          );
        }
      } else {
        return (
          "/table-data/sc/organizations?type=" +
          this.newOrganizationType +
          "&timestamp=" +
          this.timestamp
        );
      }
    }
  },
  methods: {
    
    getDepartmentList() {
      let url = "/api/department/options/my";
      request(url).then(o => {
        console.log("o", o);
        if (o.state) {
          this.departmentList = o.data;
        }
      });
    },
    _changeDepartment(obj) {
      console.log("obj", obj);
    },
    _changeCollege: function(obj) {
      this.defaultCode = obj.value;
      this.collegeName = obj.target.selected;
    },
    _export: function() {
      var orgName = this.$refs.organizationTable.tableSearchFields.name
        ? this.$refs.organizationTable.tableSearchFields.name
        : "";
      sAjax({
        url:
          "/api/sc/organizations/export/key?name=" +
          orgName +
          "&type=" +
          this.newOrganizationType +
          "&collegeCode=" +
          this.defaultCode +
          "&departmentId=" +
          this.selectDepartment,
        dataType: "json",
        type: "get",
        success: data => {
          if (data.state) {
            var fileName = "";
            if (this.organizationType === "college") {
              fileName = this.collegeName + "组织管理列表";
            } else {
              fileName = "校级组织管理列表";
            }
            window.location.href =
              "/downloads/sc/organizations/export/excel?key=" +
              data.data.key +
              "&fileName=" +
              fileName;
          } else {
            this.$toast(data.message);
          }
        }
      });
    },
    _batchAdd: function() {
      this.importParams.downloadTemplateUrl =
        "/sc/organizations/import/template/"+
        this.newOrganizationType
      this.importParams.downloadErrorTemplateUrl =
        "/sc/organizations/import/error";
      this.importParams.templateName = "组织批量新增模板.xlsx";
      this.importParams.importBtnType = [
        {
          name: this.translate.incrementImport,
          url: "/sc/organizations/import",
          method: 'post',
          isShowBtn: true,
          success: data => {
            if (data.state) {
              this.timestamp = new Date().getTime();
            }
          }
        }
      ];
      this.importParams.checkTemplateUrl =
        "/sc/organizations/import/check?type=" +
        this.newOrganizationType +
        "&collegeCode=" +
        this.defaultCode;
      this.isImportPage = true;
    },
    _showAddOrganizationModal: function() {
      this.showAddOrganizationModal = true;
      this.listModalType = this.translate.add;
      this.organization = {
        orgName: "",
        userNo: ""
      };
    },
    backToDutyList: function() {
      this.importDutyParams.show = false;
      this.isImportPage = false;
    },
    backParentPage: function() {
      this.isImportPage = false;
    },
    _changeOrganization: function() {
      if (!this.organization.orgName) {
        this.$toast(this.translate.orgNameTips);
        return false;
      }
      if (!this.organization.userNo) {
        this.$toast(this.translate.orgInstructorNoTips);
        return false;
      }
      sAjax({
          url: '/api/users/' + this.organization.userNo,
          dataType: 'json',
          type: 'get',
          success: (data) => {
            if (data.state) {
              this.positionUserId = data.data.userId
              if (this.listModalType === this.translate.add) {
                this._addOrganization()
              } else if (this.listModalType === this.translate.edit) {
                this._editOrganization()
              }
            } else {
              if (data.code === '50003' || data.code === '10001' || data.code === '50001') {
                this.$toast('学工号不存在')
              } else {
                this.$toast(data.message)
              }
            }
          }
        })
        return
    },
    _addOrganization: function() {
      sAjax({
        url: "/api/sc/organizations",
        dataType: "json",
        type: "post",
        data: {
          name: this.organization.orgName,
          userNo: this.organization.userNo,
          type: this.newOrganizationType,
          collegeCode: this.defaultCode,
          departmentId:this.organization.departmentId,
        },
        success: data => {
          if (data.state) {
            this.$toast(this.translate.optTips);
            this.showAddOrganizationModal = false;
            this.timestamp = new Date().getTime();
          } else {
            if (data.code === "50003") {
              this.$toast("组织名称已存在");
            } else {
              this.$toast(data.message);
            }
          }
        }
      });
    },
    _editOrganization: function() {
      sAjax({
        url: "/api/sc/organizations/" + this.organizationId,
        dataType: "json",
        type: 'post',
        data: {
          name: this.organization.orgName,
          userNo: this.organization.userNo,
          departmentId:this.organization.departmentId,
        },
        success: data => {
          if (data.state) {
            this.$toast(this.translate.optTips);
            this.showAddOrganizationModal = false;
            this.timestamp = new Date().getTime();
          } else {
            if (data.code === "50003") {
              this.$toast("组织名称已存在");
            } else {
              this.$toast(data.message);
            }
          }
        }
      });
    },
    _startTimeSelected: function(data) {
      if (this.$refs.endTime.value) {
        var timeString =
          new Date(data.value).getTime() -
          new Date(this.$refs.endTime.value).getTime();
        if (timeString > 0) {
          this.$toast("开始时间要在结束时间之前");
          this.$refs.startTime.value = "";
          return false;
        } else {
          this.$refs.startTime.value = data.value;
        }
      } else {
        this.$refs.startTime.value = data.value;
      }
    },
    _endTimeSelected: function(data) {
      if (this.$refs.startTime.value) {
        var timeString =
          new Date(data.value).getTime() -
          new Date(this.$refs.startTime.value).getTime();
        if (timeString < 0) {
          this.$toast("结束时间要在开始时间之后");
          this.$refs.endTime.value = "";
          return false;
        } else {
          this.$refs.endTime.value = data.value;
        }
      } else {
        this.$refs.endTime.value = data.value;
      }
    }
  }
};
</script> 
<style lang="less">
@import url("../../assets/common.less");
#organization-manage {
  .back-parent-page {
    margin-bottom: 10px;
    .back-btn {
      padding: 0;
      background: transparent;
    }
    .back-icon-btn {
      font-size: 20px;
      color: rgba(0, 0, 0, 0.54);
      line-height: 20px;
      cursor: pointer;
      vertical-align: middle;
    }
    .nav-title {
      font-size: 13px;
      color: rgba(0, 0, 0, 0.54);
      line-height: 13px;
      margin: 5px 0 0 8px;
      font-weight: 500;
      vertical-align: middle;
    }
  }

  .college-select {
    margin-left: -11px;
    .btn-group .form-control.dropdown-toggle {
      border: none;
      box-shadow: none;
      font-size: 16px;
    }
  }
  .btn-group > .add-organization:last-child:not(:first-child) {
    border-radius: 4px;
  }
  .add-organization {
    font-size: 13px;
    color: #298df7;
    font-weight: 500;
    margin-right: 12px;
    &:hover {
      color: #16a4ff;
    }
    i {
      font-size: 18px;
      color: #298df7;
      margin-right: 3px;
      margin-top: -2px;
      &:hover {
        color: #16a4ff;
      }
    }
  }
  .export-btn,
  .batch-add-btn {
    font-size: 13px;
    color: #298df7;
    &:hover {
      color: #16a4ff;
    }
  }
  .batch-add-btn {
    margin-right: 13px;
  }
  .organization-modal {
    .modal-title {
      margin-left: 10px;
      font-size: 16px;
      color: rgba(0, 0, 0, 0.87);
      padding: 6px 0;
    }
    .modal-body {
      padding: 15px 15px 0;
      &.position-info-body {
        height: 230px;
      }

      .form-group {
        margin-bottom: 15px;
      }
      .organization-input {
        height: 56px;
        padding-left: 24px;
        font-size: 13px;
        color: rgba(0, 0, 0, 0.86);
        border-bottom: 1px solid #e0e0e0;
        &:focus {
          border-color: #298df7;
          box-shadow: none;
          -webkit-box-shadow: none;
        }
      }
    }
    .modal-footer {
      border-top: 0 solid #ffffff;
    }
    .addOrganizationGroup{
      .v-select{
        width:100%;
        margin-bottom:15px;
      }
    }
  }
}
</style>

