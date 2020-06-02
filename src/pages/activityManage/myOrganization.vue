<template>
  <div id="org-department-page" class="container-fluid">
    <div v-show="!showMember&&!showPosition" class="row text-center">
      <v-table
        title="第二课堂"
        :url="url"
        pagesize="10"
        idField="id"
        :columns="columns"
        :multiple="false"
        :order="true"
        :search="true"
      ></v-table>
    </div>

    <!-- 模态框（Modal） -->
    <v-modal :show="showAddModal" effect="fade" class="editDepartmentModal" width="274">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">{{modalType}}组织部门</h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="form-group">
          <input
            id="departmentName"
            type="text"
            class="form-control search-input"
            v-model="newDepartment.name"
            @keyup="_verifyLength"
            ref="count"
          >
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button
          type="button"
          class="btn cancel-btn clearBtnBorder"
          @click="cancleModal"
        >{{translate.cancel}}</button>
        <button
          type="button"
          class="btn submit-btn clearBtnBorder"
          :class="{disabled: isDisabled}"
          @click="changeRole(isDisabled)"
        >{{translate.confirm}}</button>
      </div>
    </v-modal>
    <member v-if="showMember" :selectItem="selectItem"></member>
    <position v-if="showPosition" :selectItem="selectItem"></position>
  </div>
</template>

<script>
import Vue from "vue";
import { sAjax, request, translation } from "../../assets/utils/utils.js";
import member from "./member.vue";
import position from "./position.vue";
export default {
  created: function() {
    var la = localStorage.getItem("lang");
    this.userType = this.$parent.account.type; //学生或者指导员,权限相关
    var that = this;
    if (translation(la)) {
      this.lang = la;
    }
    this.columns = [
      {
        id: "organizationIds",
        title: "组织名称",
        className: "text-left",
        width: 160,
        hidden: false,
        search: {
          type: "multiSelect",
          data: {
            url: '/api/sc/organizations/options/organizations',
            optionsLabel: "text",
            optionsValue: "id",
          }
        },
        formatter(record) {
          return record.name;
        }
      },
      {
        id: "type",
        title: "类型",
        width: 80,
        className: "text-left",
        hidden: false,
        search: {
          type: "select",
          data: {
            optionsLabel: "label",
            optionsValue: "value",
            options: [
              { label: "校级", value: "SCHOOL" },
              { label: "院级", value: "COLLEGE" }
            ]
          }
        },
        formatter(record) {
          return record.type === "SCHOOL" ? "校级" : "院级";
        }
      },
      {
        id: "department",
        title: "所属部门",
        className: "text-left",
        hidden: false,
        formatter(record) {
          return record.department ? record.department.name : "";
        }
      },
      {
        id: "instructorName",
        title: "指导老师",
        className: "text-left",
        hidden: false
      },
      {
        id: "opt",
        title: this.translate.opt,
        className: "text-center",
        width: "130px",
        hidden: false,
        formatter: function(obj) {
          if (this.userType === "STUDENT" || !obj.isInstructor) {
            return [
              {
                tag: "a",
                text: "组织成员",
                className: "opt-btn",
                callback: function(record, index) {
                  that.showMember = true;
                  that.pageSign = "member";
                  that.selectItem = {
                    organizationId: record.id,
                    parentPageTitle: record.name
                  };
                  // that.selectOrganizationId = record.id;
                  // that.memberTitle = that.translate.member + that.translate.table;
                  // that.parentPageTitle = record.name;
                  // that.memberUrl =
                  //   "/table-data/sc/organizations/" + record.id + "/members";
                }
              }
            ];
          } else {
            return [
              {
                tag: "a",
                text: "组织成员",
                className: "opt-btn",
                callback: function(record, index) {
                  that.showMember = true;
                  that.pageSign = "member";
                  that.selectItem = {
                    organizationId: record.id,
                    parentPageTitle: record.name,
                    isInstructor:record.isInstructor,
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
                    data: { organizationId: record.id },
                    reflash: true,
                    route: "/activityManage/orgDepartmentManage"
                  });
                }
              },
              {
                tag: "a",
                text: "职务",
                className: "opt-btn",
                callback: function(record, index) {
                  console.log("record", record);
                  that.showPosition = true;
                  that.selectItem = {
                    organizationId: record.id,
                    parentPageTitle: record.name
                  };
                }
              }
            ];
          }
        }
      }
    ];
  },
  data: function() {
    return {
      columns: [],
      url: "/table-data/sc/organizations/page/myOrganizations",
      showAddModal: false,
      department: {},
      newDepartment: {
        name: ""
      },
      userType: "STUDENT",
      modalType: "",
      isChange: false,
      showMember: false,
      showPosition: false,
      isDisabled: false,
      lang: "zh-cn"
    };
  },
  components: { member, position },
  computed: {
    translate: function() {
      return translation(this.lang).departmentManage;
    }
  },
  methods: {
    _verifyLength: function() {
      var chineseLen = 0;
      var englishLen = 0;
      var index = 0;
      if (!this.newDepartment.name) {
        return false;
      }
      this.isChange = true;
      for (var i = 0; i < this.newDepartment.name.length; i++) {
        if (
          this.newDepartment.name.charCodeAt(i) > 127 ||
          this.newDepartment.name.charCodeAt(i) === 94
        ) {
          chineseLen++;
        } else {
          englishLen += 0.5;
        }
        if (parseInt(chineseLen + englishLen) === 25) {
          index = i;
        }
      }
      if (parseInt(chineseLen + englishLen) > 25) {
        this.newDepartment.name = this.newDepartment.name.slice(0, index + 1);
      }
    },
    editDepartment: function() {
      var that = this;
      that.isDisabled = true;
      sAjax({
        url: "/api/department/" + this.newDepartment.id,
        dataType: "json",
        data: {
          name: this.newDepartment.name
        },
        type: 'post',
        success: function(data) {
          that.isDisabled = false;
          if (data.state) {
            that.department.id = that.newDepartment.id;
            that.department.name = that.newDepartment.name;
            that.showAddModal = false;
            that.$toast(that.translate.editSuccessTip);
          } else {
            that.$toast(that.translate.editFailedTip + ":" + data.message);
          }
        }
      });
    },
    addModal: function() {
      this.newDepartment = {};
      this.modalType = this.translate.addNew;
      this.showAddModal = true;
    },
    addDepartment: function() {
      var that = this;
      if (!this.newDepartment.name) {
        that.$toast("请输入部门名称");
      } else {
        that.isDisabled = true;
        sAjax({
          url: "/api/department",
          dataType: "json",
          data: {
            name: this.newDepartment.name
          },
          type: "post",
          success: function(data) {
            that.isDisabled = false;
            if (data.state) {
              that.url =
                "/table-data/department?timestamp=" + new Date().getTime();
              that.showAddModal = false;
              that.$toast(that.translate.addSuccessTip);
            } else {
              that.$toast(that.translate.addFailedTip + ":" + data.message);
            }
          }
        });
      }
    },
    changeRole: function(isDisabled) {
      if (isDisabled) {
        return false;
      }
      if (this.modalType === this.translate.addNew) {
        this.addDepartment();
      } else if (this.modalType === this.translate.edit) {
        this.editDepartment();
      }
    },
    cancleModal: function() {
      if (this.isChange) {
        if (confirm(this.translate.cancelConfirmTip)) {
          this.showAddModal = false;
        }
      } else {
        this.showAddModal = false;
      }
    }
  }
};
</script>
<style lang="less">
@import url("../../assets/common.less");
#orgDepartmentImportPage {
  height: 888px;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 12;
  background: white;
}
#org-department-page {
  .modal-header {
    border-bottom: 0 solid #ffffff;
  }
  .modal-footer {
    border-top: 0 solid #ffffff;
    padding: 15px;
  }
  .modal-body {
    padding: 20px 24px 5px;
  }
  .search-input-group {
    margin: 5px 0 0 43px;
  }
}
</style>
