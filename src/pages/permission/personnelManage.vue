<template>
  <div id="personnel-page" class="container-fluid">
    <div class="row text-center">
      <v-table
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
            class="btn add clearBtnBorder"
            @click="addModal()"
          >{{translate.addNew}}{{translate.personnel}}</button>
        </div>
      </v-table>
    </div>

    <!-- 模态框（Modal） -->
    <v-modal :show="showAddModal" effect="fade" width="446">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">{{modalType}}{{translate.personnel}}</h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="form-group">
          <div class="student-number-group">
            <label class="student-number-name">{{translate.studentId}}</label>
            <div class="box_flex" style="padding-left: 10px;">
              <detect style="display:inline-block" ref="searchVal" :searchVal='searchVal' url="/api/relClass/getUserSimpleInfo" keyword="nameOrNo" :placeholder="请输入学号或者姓名" @afterSelected="afterSelectAddPerson"></detect>
              <!-- <input
                id="personnelName"
                type="text"
                class="form-control student-number-input"
                v-model="newPersonnel.empNo"
                ref="empNo"
                v-on:input="inputIsEdited"
              >
              <button
                type="button"
                class="btn checkBtn clearBtnBorder"
                @click="checkPersonnel"
              >{{translate.check}}</button> -->
            </div>
            <label class="error-message">{{errorMessage}}</label>
          </div>
          <div class="student-name-group">
            <label class="student-number-name">{{translate.studentName}}</label>
            <p>
              <label class="student-name">{{newPersonnel.name}}</label>
            </p>
          </div>
        </div>
        <div class="department-select">
          <label class="department-title">{{translate.department}}</label>
          <div class="department-combobox">
            <v-select
              :options="departmentOptions"
              :value="newPersonnel.departmentId"
              optionsLabel="name"
              optionsValue="id"
              @afterSelected="afterSelected"
              :search="true"
            ></v-select>
          </div>
        </div>
        <div class="permissions">
          <label class="permissions-title">{{translate.permissions}}</label>
          <ul class="media-list checkbox-list">
            <li class="media" v-for="(col, k) in permissionData" :key="k">
              <div class="media-left">
                <i
                  class="maticon permissions-checked"
                  v-html="icons('check_box')"
                  v-if="getIsChecked(newPersonnel.permission, col)"
                  @click="_click(1, col)"
                >check_box</i>
                <i
                  class="maticon permissions-unchecked"
                  @click="_click(0, col)"
                  v-html="icons('check_box_outline_blank')"
                  v-else
                >check_box_outline_blank</i>
              </div>
              <div class="media-body permissions-content">
                <h5 class="media-heading permissions-name">{{col.name}}</h5>
                <p class="permissions-description">{{col.remark}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button
          type="button"
          class="btn cancel-btn clearBtnBorder"
          @click="closeModal"
        >{{translate.cancel}}</button>
        <button
          type="button"
          class="btn confirm-btn clearBtnBorder"
          :class="{disabled: isDisabled}"
          @click="changeRole(isDisabled)"
        >{{translate.confirm}}</button>
      </div>
    </v-modal>
  </div>
</template>

<script>
import Vue from "vue";
import { sAjax, translation } from "../../assets/utils/utils.js";
export default {
  created: function() {
    var la = localStorage.getItem("lang");
    var that = this;
    if (translation(la)) {
      this.lang = la;
    }
    sAjax({
      url: "/api/department/person/rule",
      type: "get",
      success: function(data) {
        if (data.state) {
          that.permissionData = data.data;
        }
      }
    });
    this.getDeparmentData();
  },
  data: function() {
    return {
      searchVal:'',
      columns: [],
      url: "/table-data/department/person",
      showAddModal: false,
      departmentOptions: [],
      personnel: {},
      newPersonnel: {
        permission: [],
        name: "",
        departmentId: null
      },
      definedSearch: {
        empNo: "",
        name: "",
        departmentId: ""
      },
      modalType: "",
      errorMessage: "",
      permissionData: [],
      department: {
        id: null,
        name: ""
      },
      isDisabled: true,
      isExistName: false,
      isSelectDepartment: false,
      isChecked: false,
      fruitIds: ["1"],
      isEdited: false,
      lang: "zh-cn"
    };
  },
  computed: {
    translate: function() {
      return translation(this.lang).personnelManage;
    }
  },
  methods: {
    afterSelectAddPerson(o){
      this.newPersonnel.name = o.name;
            this.newPersonnel.empNo = o.userNo;
            this.errorMessage = "";
            this.isExistName = true;
            if (this.isSelectDepartment) {
              this.isDisabled = false;
            }
    },
    _initColumns: function() {
      var that = this;
      this.columns = [
        {
          id: "empNo",
          title: this.translate.studentId,
          className: "text-left",
          width: 150,
          hidden: false,
          search: {
            type: "input",
            data: {
              placeholder: this.translate.personnelIdlaceholder,
              autoFocus: true
            }
          }
        },
        {
          id: "name",
          title: this.translate.studentName,
          className: "text-left",
          width: 120,
          hidden: false,
          search: {
            type: "input",
            data: {
              placeholder: this.translate.personnelNamePlaceholder
            }
          }
        },
        {
          id: "departmentId",
          title: this.translate.department,
          className: "text-left",
          hidden: false,
          width: 150,
          search: {
            type: "select",
            data: {
              options: this.departmentOptions,
              optionsLabel: "name",
              optionsValue: "id"
            }
          },
          formatter: function(record, index) {
            if (record.department) {
              return record.department.name;
            } else {
              return "";
            }
          }
        },
        {
          id: "departmentRuleList",
          title: this.translate.permissions,
          className: "text-left",
          hidden: false,
          formatter: function(record, index) {
            var name = "";
            if (record.departmentRuleList.length > 0) {
              for (var i in record.departmentRuleList) {
                name += record.departmentRuleList[i].name + " ";
              }
              return name;
            } else {
              return " ";
            }
          }
        },
        {
          id: "opt",
          title: this.translate.opt,
          className: "text-center",
          width: 130,
          hidden: false,
          formatter: function() {
            return [
              {
                tag: "a",
                text: that.translate.edit,
                className: "opt-btn",
                callback: function(record, index) {
                  that.getDeparmentData();
                  that.personnel = record;
                  that.newPersonnel.empNo = record.empNo;
                  that.newPersonnel.name = record.name;
                  that.newPersonnel.id = record.id;
                  that.department.id = record.department.id;
                  that.newPersonnel.departmentId = record.department.id.toString();
                  that.department.name = record.department.name;
                  that.newPersonnel.permission = JSON.parse(
                    JSON.stringify(record.departmentRuleList)
                  );
                  that.modalType = that.translate.edit;
                  that.errorMessage = "";
                  that.searchVal = ''
                  that.showAddModal = true;
                  that.isDisabled = false;
                  setTimeout(function() {
                    that.isEdited = false;
                  });
                }
              },
              {
                tag: "a",
                text: that.translate.remove,
                className: "opt-btn",
                callback: function(record, index) {
                  if (confirm(that.translate.removeConfirmTip)) {
                    sAjax({
                      url: "/api/department/person/" + record.id + "/delete",
                      dataType: "json",
                      type: "post",
                      success: function(data) {
                        if (data.state) {
                          that.url =
                            "/table-data/department/person?timestamp=" +
                            new Date().getTime();
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
    getDeparmentData: function() {
      var that = this;
      sAjax({
        url: "/api/department/person/department",
        type: "get",
        success: function(data) {
          if (data.state) {
            that.departmentOptions = data.data;
            that._initColumns();
          }
        }
      });
    },
    inputIsEdited: function() {
      this.isEdited = true;
    },
    editPersonnel: function() {
      var that = this;
      sAjax({
        url: "/api/department/person/" + this.newPersonnel.id,
        dataType: "json",
        data: {
          name: this.newPersonnel.name,
          empNo: this.newPersonnel.empNo,
          department: this.department,
          departmentRuleList: this.newPersonnel.permission
        },
        type: 'post',
        success: function(data) {
          if (data.state) {
            that.url =
              "/table-data/department/person?timestamp=" + new Date().getTime();
            that.showAddModal = false;
          } else {
            that.$toast(that.translate.editSuccessTip + ":" + data.message);
          }
        }
      });
    },
    addModal: function() {
      this.getDeparmentData();
      this.newPersonnel = {
        permission: [],
        name: "",
        departmentId: null
      };
      this.modalType = this.translate.addNew;
      this.showAddModal = true;
      this.isDisabled = true;
      this.isEdited = false;
    },
    closeModal: function() {
      if (this.isEdited) {
        if (confirm(this.translate.cancelEditText)) {
          this.showAddModal = false;
        }
      } else {
        this.showAddModal = false;
      }
    },
    addPersonnel: function() {
      var that = this;
      sAjax({
        url: "/api/department/person",
        dataType: "json",
        data: {
          name: this.newPersonnel.name,
          empNo: this.newPersonnel.empNo,
          department: this.department,
          departmentRuleList: this.newPersonnel.permission
        },
        type: "post",
        success: function(data) {
          if (data.state) {
            that.url =
              "/table-data/department/person?timestamp=" + new Date().getTime();
            that.showAddModal = false;
            that.$toast(that.translate.addSuccessTip);
          } else {
            that.$toast(that.translate.addFailedTip + ":" + data.message);
          }
        }
      });
    },
    checkPersonnel: function() {
      var that = this;
      this.isEdited = true;
      if (!that.newPersonnel.empNo) {
        that.errorMessage = that.translate.enterStudentId;
        return false;
      }
      sAjax({
        url: "/api/users/" + this.newPersonnel.empNo,
        dataType: "json",
        type: "get",
        success: function(data) {
          if (data.state) {
            that.newPersonnel.name = data.data.name;
            that.newPersonnel.empNo = data.data.id;
            that.errorMessage = "";
            that.isExistName = true;
            if (that.isSelectDepartment) {
              that.isDisabled = false;
            }
          } else {
            that.errorMessage = data.message;
            that.newPersonnel.name = "";
            that.isExistName = false;
            that.isDisabled = true;
          }
        }
      });
    },
    changeRole: function(isDisabled) {
      if (this.modalType === this.translate.addNew) {
        if (isDisabled) {
          return false;
        }
        this.addPersonnel();
      } else if (this.modalType === this.translate.edit) {
        this.editPersonnel();
      }
    },
    afterSelected: function(obj) {
      this.isEdited = true;
      this.department.id = obj.value;
      this.newPersonnel.departmentId = obj.value;
      this.departmentOptions.forEach(ele => {
        if (obj.value === ele.id) {
          this.department.name = ele.name;
        }
      });
      if (this.department.id) {
        this.isSelectDepartment = true;
        if (this.isExistName) {
          this.isDisabled = false;
        }
      } else {
        this.isSelectDepartment = false;
        this.isDisabled = true;
      }
    },
    departmentSearch: function(obj) {
      this.definedSearch.departmentId = obj.val;
    },
    _click: function(checkBoxType, permission) {
      this.isEdited = true;
      if (checkBoxType === 1) {
        for (var i in this.newPersonnel.permission) {
          if (this.newPersonnel.permission[i].id === permission.id) {
            this.newPersonnel.permission.splice(i, 1);
          }
        }
      } else {
        if (!this.newPersonnel.permission) {
          Vue.set(this.newPersonnel, "permission", []);
        }
        this.newPersonnel.permission.push(permission);
      }
    },
    getIsChecked: function(permissionArr, permission) {
      if (permissionArr) {
        var index = false;
        for (var i in permissionArr) {
          if (permissionArr[i]) {
            if (permissionArr[i].id === permission.id) {
              index = true;
            }
          }
        }
        return index;
      }
    }
  }
};
</script>
<style lang="less">
@import url("../../assets/common.less");
#personnel-page {
  .add {
    border: none;
    background: #ffffff;
  }
  .modal-header {
    border-bottom: 0 solid #ffffff;
    padding: 20px 0 7px 24px;
  }
  .student-number-input {
    border-radius: 0;
    border-top: 0 solid #ffffff;
    border-left: 0 solid #ffffff;
    border-right: 0 solid #ffffff;
    border-bottom: 2px solid rgba(0, 0, 0, 0.18);
    box-shadow: inset 0 0px 0px rgba(0, 0, 0, 0.075);
    padding: 0;
    width: 232px;
    height: 29px;
    margin-left: 10px;
  }
  .student-number-input:focus {
    border-color: #298df7;
    box-shadow: none;
    -webkit-box-shadow: none;
  }
  .student-number-name {
    font-size: 13px;
    line-height: 13px;
    color: rgba(0, 0, 0, 0.54);
    margin: 5px 0 0 10px;
  }
  .student-number-group {
    width: 252px;
    display: inline-block;
  }
  .student-name-group {
    width: 130px;
    display: inline-block;
    margin-left: 13px;
    position: absolute;
  }
  .checkBtn {
    padding: 0;
    font-size: 13px;
    color: #298df7;
    position: relative;
    left:-71px;
    background: #ffffff;
  }
  .student-name {
    font-size: 13px;
    color: rgba(0, 0, 0, 0.87);
    line-height: 13px;
    margin: 6px 0 0 10px;
  }
  .error-message {
    font-size: 13px;
    color: #ff5252;
    line-height: 13px;
    margin: 8px 0 0 10px;
  }

  .permissions-title {
    font-size: 13px;
    color: rgba(0, 0, 0, 0.54);
    line-height: 13px;
  }
  .permissions {
    margin: 10px 0 0 10px;
  }

  .permissions-name {
    font-size: 13px;
    color: rgba(0, 0, 0, 0.87);
    line-height: 13px;
  }
  .permissions-description {
    font-size: 13px;
    color: rgba(0, 0, 0, 0.54);
    line-height: 13px;
  }
  .checkbox-list {
    margin-top: 16px;
  }
  .permissions-content {
    padding-left: 16px;
  }
  .department-select {
    margin: 2px 0 0 10px;
  }
  .department-title {
    font-size: 13px;
    color: rgba(0, 0, 0, 0.54);
    line-height: 13px;
  }
  .department-combobox {
    .form-control {
      border: 0 solid #ffffff;
      box-shadow: none;
      font-size: 13px;
      color: rgba(0, 0, 0, 0.87);
      line-height: 13px;
      font-weight: 500;
      .btn-content {
      }
    }
    .dropdown-menu {
      position: fixed;
      top: auto;
      left: auto;
    }
    .dropdown-icon i {
      line-height: 23px;
    }
  }
  .confirm-btn {
    font-size: 13px;
    color: #298df7;
    padding: 0;
    margin: 0 8px 0 13px;
    font-weight: 500;
    background: #ffffff;
  }
  .modal.in {
    background-color: rgba(0, 0, 0, 0.3);
  }
  .permissions-checked {
    font-size: 24px;
    color: #298df7;
    line-height: 24px;
    cursor: pointer;
  }
  .permissions-unchecked {
    font-size: 24px;
    color: rgba(0, 0, 0, 0.4);
    line-height: 24px;
    cursor: pointer;
  }
}
</style>
