<template>
  <div id="org-department-page" class="container-fluid">
    <div class="row text-center">
      <v-table title="" :url="url" pagesize="10" idField="id" :columns="columns" :multiple="false" :order="true" :search="true" :searchParams="definedSearch">
      </v-table>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { sAjax, translation } from "../../assets/utils/utils.js";
export default {
  props: {
    data: {
      default: null
    },
    role: {
      default: ""
    }
  },
  created: function () {
    // console.log(this.data)
    // console.log("this.role",this.role)
    var la = localStorage.getItem("lang");
    var that = this;
    if (translation(la)) {
      this.lang = la;
    }
    switch (this.role) {
        case "school":
        this.definedSearch.reqSource = "school"
        break;
        case "college":
        this.definedSearch.reqSource = "college"
        break;
        case "myManage":
        this.definedSearch.reqSource = "instructor"
        break;
    }
    // console.log("this.definedSearch.source ",this.definedSearch.source )
    this.columns = [
      {
        id: "modifiedUserNo",
        title: "学号",
        width: 120,
        className: "text-left",
        hidden: false,
        search: {
          type: "number",
        },
        formatter: function (record) {
          return record.modifiedUser.userNo
        }
      },
      {
        id: "modifiedUserName",
        title: "姓名",
        width: 80,
        className: "text-left",
        hidden: false,
        search: {
          type: "value",
        },
        formatter: function (record) {
          return record.modifiedUser.name
        }
      },
      {
        id: "columnName",
        title: "修改字段",
        width: 120,
        className: "text-left",
        hidden: false,
        search: {
          type: "value",
        }
      },
      {
        id: "source",
        title: "修改来源",
        width: 130,
        className: "text-left",
        hidden: false,
        search: {
          type: "input",
        },
        // formatter: function (record) {
          // switch (record.source) {
          //   case 'SCHOOL':
          //     return '全校学生信息'
          //   case 'COLLEGE':
          //     return '本院学生信息'
          //   case 'INSTRUCTOR_MANAGE':
          //     return '分管学生信息'
          //   case 'INSTRUCTOR':
          //     return '全校辅导员信息'
          //   case 'MY_STUDENT':
          //     return '右上角学生信息查看'
          //   case 'MY_INSTRUCTOR':
          //     return '右上角辅导员信息查看'
          // }
        // }
      },
      {
        id: "reviseUserName",
        title: "修改人姓名",
        width: 80,
        className: "text-left",
        hidden: false,
        search: {
          type: "value",
        },
        formatter: function (record) {
          return record.reviseUser.name
        }
      },
      {
        id: "reviseUserNo",
        title: "修改人工号",
        width: 120,
        className: "text-left",
        hidden: false,
        search: {
          type: "value",
        },
        formatter: function (record) {
          return record.reviseUser.userNo
        }
      },
      {
        id: "createTime",
        title: "修改时间",
        width: 110,
        className: "text-left",
        hidden: false,
      },
      {
        id: "valueBefore",
        title: "修改前数据",
        width: 120,
        className: "text-left",
        hidden: false,
        search: {
          type: "value",
        },
      }, {
        id: "valueAfter",
        title: "修改后数据",
        width: 120,
        className: "text-left",
        hidden: false,
        search: {
          type: "value",
        },
      }

    ];
  },
  data: function () {
    return {
      definedSearch: {
        modifiedUserNo: '',
        modifiedUserName: '',
        columnName: '',
        reviseUserName: '',
        reviseUserNo: '',
        valueBefore: '',
        valueAfter: '',
        source:''
      },
      columns: [],
      // 这里来区分 哪里的日志url
      // url: "/table-data/document/logs/page/"+this.role,
      url: "/table-data/document/logs/page",
      showAddModal: false,
      department: {},
      newDepartment: {
        name: ""
      },
      modalType: "",
      isChange: false,
      isDisabled: false,
      lang: "zh-cn"
    };
  },
  computed: {
    translate: function () {
      return translation(this.lang).departmentManage;
    }
  },
  methods: {
    _verifyLength: function () {
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
    editDepartment: function () {
      var that = this;
      that.isDisabled = true;
      sAjax({
        url: "/api/department/" + this.newDepartment.id,
        dataType: "json",
        data: {
          name: this.newDepartment.name
        },
        type: 'post',
        success: function (data) {
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
    addModal: function () {
      this.newDepartment = {};
      this.modalType = this.translate.addNew;
      this.showAddModal = true;
    },
    addDepartment: function () {
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
          success: function (data) {
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
    changeRole: function (isDisabled) {
      if (isDisabled) {
        return false;
      }
      if (this.modalType === this.translate.addNew) {
        this.addDepartment();
      } else if (this.modalType === this.translate.edit) {
        this.editDepartment();
      }
    },
    cancleModal: function () {
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
