<template>
  <div class="text-center">
    <v-table
      ref="peopleTable"
      :url="table.url"
      pagesize="10"
      idField="id"
      :columns="table.columns"
      :order="true"
      :search="true"
      :multiple="true"
      :columnsControl="true"
      @afterChecked="_afterChecked"
    >
      <!-- 多选缴费，删除 -->
      <div
        slot="btn-group"
        role="group"
      >
        <div
          class="btn-group pull-left"
          v-if="tableCheckedList.length > 0"
        >
          <div class="batch-options">
            <span class="pull-left">已选择{{tableCheckedList.length}}项，其中可催缴的有{{tableCheckedList.filter(record => record.status === 'NOT_PAID').length}}项</span>
            <div class="pull-left">
              <button
                type="button"
                class="btn table-btn clearBtnBorder"
                style="transform: translateY(-7px);"
                @click="callPay()"
                v-if="tableCheckedList.filter(record => record.status === 'NOT_PAID').length > 0"
              >催缴</button>
            </div>
          </div>
        </div>
        <div
          slot="btn-group"
          class="btn-group pull-right"
          role="group"
        >
          <button
            class="btn btn-bgColor-style clearBtnBorder"
            @click="exportTable"
          >导出</button>
        </div>
      </div>
    </v-table>
  </div>
</template>
<script>
import Vue from "vue";
import { sAjax, translation, request } from "../../assets/utils/utils.js";
export default {
  created: function() {
    this.table.columns = [
      {
        id: "userNo",
        title: this.translate.studentId,
        className: "text-left",
        hidden: false,
        width: 130,
        search: {
          type: "input",
          data: {
            autoFocus: true
          }
        }
      },
      {
        id: "account",
        title: "新生账号",
        className: "text-left",
        hidden: false,
        width: 130,
        search: {
          type: "input",
          data: {
            autoFocus: true
          }
        },
        hidden: true
      },
      {
        id: "name",
        title: this.translate.name,
        className: "text-left",
        hidden: false,
        width: 130,
        search: {
          type: "input"
        },
        formatter: function(record, index) {
          return record.name;
        }
      },
      {
        id: "college",
        title: this.translate.college,
        className: "text-left",
        hidden: false,
        width: 120,
        search: {
          type: "select",
          data: {
            url: '/api/colleges',
            optionsLabel: "name",
            optionsValue: "code"
          }
        }
      },
      {
        id: "grade",
        title: "年级",
        className: "text-left",
        hidden: true,
        width: 120,
        search: {
          type: "select",
          data: {
            options: this.grade,
            optionsLabel: "name",
            optionsValue: "id"
          }
        }
      },
      {
        id: "projectId",
        title: "缴费项目名称",
        className: "text-left",
        hidden: false,
        width: 130,
        search: {
          type: "select",
          data: {
            url: '/api/payment/projects/published',
            optionsLabel: "name",
            optionsValue: "id"
          }
        },
        formatter: (record) => {
          return record.projectName
        }
      },
      {
        id: "status",
        title: "缴费状态",
        className: "text-left",
        width: 100,
        search: {
          type: "select",
          data: {
            options: this.PayStateOptions1,
            optionsLabel: "name",
            optionsValue: "id"
          }
        },
        hidden: false,
        formatter: function(record, index) {
          if (record.status == "NOT_PAID") {
            return "未缴费";
          } else if (record.status == "PAID_ONLINE") {
            return "已缴费";
          } else if (record.status == "PAID_OFFLINE") {
            return "线下缴费";
          }
        }
      },
      {
        id: "major",
        title: "专业",
        className: "text-left",
        hidden: true,
        width: 120,
        search: {
          type: "select",
          data: {
            url: '/api/system/dicts?dictType=专业',
            optionsLabel: "label",
            optionsValue: "value"
          }
        },
      },
      {
        id: "educationLevel",
        title: "培养层次",
        className: "text-left",
        hidden: true,
        width: 80,
        search: {
          type: "select",
          data: {
            url: '/api/system/dicts?dictType=培养层次',
            optionsLabel: "label",
            optionsValue: "value"
          }
        }
      },
      {
        id: "amount",
        title: "应缴金额",
        className: "text-right",
        hidden: true,
        width: 100,
        formatter: function(record, index) {
          if (record.amount == null) {
            return "";
          } else {
            return record.amount;
          }
        }
      },
      {
        id: "amountPaid",
        title: "实缴金额",
        width: 100,
        className: "text-right",
        hidden: true,
        formatter: function(record, index) {
          if (record.amountPaid == null) {
            return "0";
          } else {
            return record.amountPaid;
          }
        }
      },
      {
        id: "orderDetails",
        title: "缴费详细",
        className: "text-left",
        hidden: true,
        width: 120,
        search: {
          type: "input",
          data: {
            autoFocus: true
          }
        },
      },
      {
        id: "payTime",
        title: "缴费时间",
        className: "text-left",
        hidden: true,
        width: 150,
        search: {
          type: "datetime",
          data: {
            dateFormat: "yyyy-MM-dd hh:ii:ss"
          }
        }
      },
      {
        id: "opt",
        title: this.translate.opt,
        className: "text-right",
        width: 100,
        hidden: false,
        formatter: (record, index) => {
          let cuijiao = {
            tag: "a",
            text: "催缴",
            className: "opt-btn",
            callback: (record, index) => {
              var moveArray = [];
              moveArray.push(record.userId);
              sAjax({
                url: "/api/payment/remind",
                dataType: "json",
                type: "post",
                data: {
                  userId: moveArray,
                  projectId: record.projectId
                },
                success: (data) => {
                  if (data.state) {
                    this.toast("催缴成功");
                  } else {
                    this.toast("催缴失败");
                  }
                }
              });
            }
          };
          if (record.status === 'NOT_PAID') {
            return [cuijiao];
          }
          return [];
        }
      }
    ];
  },
  data: function() {
    return {
      fieldsToExport: [],
      educationLevels: [],
      collegeOptionss: [],
      PayStateOptions: [
        {
          id: "PAID_OFFLINE",
          name: "线下缴费"
        }
      ],
      PayStateOptions1: [
        {
          id: "PAID_ONLINE",
          name: "已缴费"
        },
        {
          id: "NOT_PAID",
          name: "未缴费"
        },
        {
          id: "PAID_OFFLINE",
          name: "线下缴费"
        }
      ],
      PayStateEdit: "",
      ImportCondition: {
        educationLevel: "",
        grade: "",
        schoolStatus: ""
      },
      shouldPayNum: "",
      tableCheckedList: [],
      paySituation: ["已缴费", "未缴费"],
      showEditClassModal: false,
      showExport: false,
      table: {
        url: '/table-data/payment/getinformation',
        columns: [],
      },
      payEditUserId: 0,
      somethingIn: false,
      department: {},
      classMembers: {},
      definedSearch: {},
      studentId: "",
      studentUserId: "",
      singleAddText: "",
      isDisabled: true,
      isSingleDisabled: true,
      isCheckResult: false,
      checkResult: "",
      fileName: "",
      paydetail: "",
      payDetailEdit: "",
      isParentPage: true,
      lang: "zh-cn",
      grade: [
        {
          id: 2015,
          name: "2015级"
        },
        {
          id: 2016,
          name: "2016级"
        },
        {
          id: 2017,
          name: "2017级"
        },
        {
          id: 2018,
          name: "2018级"
        },
        {
          id: 2019,
          name: "2019级"
        },
        {
          id: 2020,
          name: "2020级"
        }
      ],
      schoolStatus: []
    };
  },
  computed: {
    translate: function() {
      return translation(this.lang).classMembers;
    }
  },
  methods: {
    callPay: function() {
      const toRemind = this.tableCheckedList.filter(record => record.status === 'NOT_PAID');
      sAjax({
        url: "/api/payment/remind/multi",
        dataType: "json",
        type: "post",
        data: toRemind.map(record => ({ userId: record.userId, projectId: record.projectId })),
        success: (data) => {
          if (data.state) {
            this.tableCheckedList = [];
            this.toast("催缴成功");
          } else {
            this.toast("催缴失败");
          }
        }
      });
    },
    exportTable: function() {
      const searchData = this.$refs.peopleTable.tableSearchFields;
      var querystring = "";
      for (var i in searchData) {
        if (!searchData[i]) {
          querystring += "&" + i + "=" + "";
        } else {
          querystring += "&" + i + "=" + searchData[i];
        }
      }
      window.location.href = '/downloads/payment/peoplemanage/excel?fileName=缴费人员' + +new Date() + '.xlsx' + querystring
    },
    _afterChecked: function(checkedRecords) {
      this.tableCheckedList = checkedRecords;
    },
  }
};
</script>
<style lang="less">
@import url("../../assets/common.less");
.import-page {
  background: rgb(245, 245, 245);
  position: absolute;
  height: 100%;
  top: 10px;
  left: 0;
  right: 25px;
}
#payHallMembers-page {
  .dep-select {
    width: 200px;
  }
  .info_value {
    display: inline-block;
    width: 198px;
    margin-left: 16px;
    padding: 0;
    vertical-align: bottom;
    font-size: 16px;
    font-weight: 500;
    color: #555555;
    letter-spacing: 0;
    line-height: 15px;
    border-radius: 0;
    // border: none;
    // box-shadow: none;
    // border-bottom: 2px solid #e0e0e0;
    resize: none;
    background: transparent;
    transition: all 0.3s ease-out;
    &.disabled {
      color: rgba(0, 0, 0, 0.87);
      opacity: 0.7;
    }
  }
  .addClass-input-group1 {
    margin-bottom: 5px;
  }
  .addClass-input-group2 {
    margin-top: 15px;
  }
  .batch-options {
    width: 500px;
    transition: all 0.1s ease;
    span {
      line-height: 32px;
    }
    &.active {
      top: 0;
    }
  }
  .opt-btn {
    border-radius: 3px;
    margin-right: 5px;
    font-size: 13px;
    color: rgba(0, 0, 0, 0.54);
  }
  .single-add-group .btn-group {
    width: 198px;
    margin-left: 18px;
  }
  .luin {
    margin-left: 176px;
  }
  .luin1 {
    margin-left: 192px;
  }
  .studentId-input {
    width: 200px;
    display: inline-block;
    margin-left: 18px;
  }
  .singleAddText {
    margin-right: 18px;
  }
  .back-parent-page {
    margin: 0 -15px 0px -15px;
    background: rgb(245, 245, 245);
    padding: 12px 15px;
    margin-top: -5px;
  }
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
  .name-search {
    margin-left: 15px;
  }
}
</style>
