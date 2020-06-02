<template>
  <div
    id="payHallMembers-page"
    v-if="isParentPage"
  >
    <!-- 返回按钮 -->
    <div class="back-parent-page">
      <button
        type="button"
        class="btn back-btn clearBtnBorder"
        @click="_backClassList"
      >
        <i
          class="maticon back-icon-btn"
          v-html="icons('arrow_back')"
        >arrow_back</i>
        <span class="nav-title">返回缴费项目列表</span>
      </button>
    </div>
    <!-- 列表 -->
    <div class="text-center">
      <v-table
        ref="renyuanTable"
        :title="tableCheckedList.length > 0?'':(this.itemName+'缴费人员列表')"
        :url="url"
        pagesize="10"
        idField="id"
        :columns="columns"
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
              <span class="pull-left">已选择{{tableCheckedList.length}}项，其中可操作的有{{tableCheckedList.filter(record => record.status === 'NOT_PAID').length}}项</span>
              <div class="pull-left">
                <button
                  type="button"
                  class="btn table-btn clearBtnBorder"
                  @click="callPay()"
                  v-if="tableCheckedList.filter(record => record.status === 'NOT_PAID').length > 0"
                >催缴</button>
                <button
                  type="button"
                  class="btn table-btn clearBtnBorder"
                  @click="remove()"
                  v-if="tableCheckedList.filter(record => record.status === 'NOT_PAID').length > 0"
                >删除</button>
              </div>
            </div>
          </div>
        </div>
        <!-- 右侧导入导出按钮 -->
        <div
          slot="btn-group"
          class="btn-group pull-right"
          role="group"
        >
          <button
            type="button"
            class="btn btn-bgColor-style clearBtnBorder"
            @click="singleAddModal()"
          >新增人员</button>
          <button
            type="button"
            class="btn btn-bgColor-style clearBtnBorder"
            @click="batchAddModal()"
          >批量新增</button>
          <button
            class="btn btn-bgColor-style clearBtnBorder"
            @click="exportTable"
          >导出</button>
        </div>
      </v-table>
    </div>
    <!-- 模态框（Modal） -->
    <!-- 模态编辑项目 -->
    <v-modal
      :show="showEditClassModal"
      effect="fade"
      width="500"
    >
      <div
        slot="modal-header"
        class="modal-header"
      >
        <h5 class="modal-title">编辑项目</h5>
      </div>
      <div
        slot="modal-body"
        class="modal-body"
        v-if="showEditClassModal"
      >
        <div>
          <div class="input-group addClass-input-group">
            <label class="addClass-text">应缴金额:</label>
            <input
              class="form-control search-input"
              type="text"
              aria-describedby="basic-addClass-faculty"
              v-model="shouldPayNumEdit"
            >
          </div>
          <div class="input-group addClass-input-group">
            <label class="edit-class-text">缴费状态:</label>
            <v-select
              class="btn-block search-select"
              :placeholder="'请选择'"
              :value="PayStateEdit"
              :options="PayStateOptions"
              optionsValue="id"
              optionsLabel="name"
              @afterSelected="PayStateSelected"
              search
              close-on-select
            ></v-select>
          </div>
          <div class="form-group addClass-input-group">
            <label class="edit-class-text">缴费详细:</label>
            <v-textarea
              v-model="payDetailEdit"
              class="info_value"
              style="width:212px;"
              :rows="'3'"
              :maxLength="200"
            ></v-textarea>
          </div>
        </div>
      </div>
      <div
        slot="modal-footer"
        class="modal-footer"
      >
        <button
          type="button"
          class="btn cancel-btn clearBtnBorder"
          @click="showEditClassModal = false"
        >取消</button>
        <button
          type="button"
          class="btn submit-btn clearBtnBorder"
          @click="insureEdit()"
        >确认</button>
      </div>
    </v-modal>
    <!-- 模态单个新增 -->
    <v-modal
      :show="showSingleAddModal"
      effect="fade"
      width="500"
    >
      <div
        slot="modal-header"
        class="modal-header"
      >
        <h5 class="modal-title">新增人员</h5>
      </div>
      <div
        slot="modal-body"
        class="modal-body"
        style="height:265px"
      >
        <div class="form-group addClass-input-group">
          <label
            class="addClass-text"
            style="padding-top:10px"
          >学号/姓名:</label>
          <detect
            style="display:inline-block;margin-left:18px;position:absolute"
            url="/api/payment/likeUserName"
            placeholder="请输入姓名或学工号"
            @afterSelected="consultantSelected"
          ></detect>
        </div>
        <div
          class="form-group addClass-input-group"
        >
          <label class="addClass-text">应缴金额:</label>
          <div class="input-group" style="display:inline-block;width:212px;">
            <input
            class="form-control studentId-input search-input"
            type="text"
            v-model="shouldPayNum"
            aria-describedby="basic-singleAdd-id"
          >
          </div>

        </div>
        <div class="form-group addClass-input-group">
          <label class="addClass-text">缴费详细:</label>
          <v-textarea
            v-model="paydetail"
            class="info_value"
            style="overflow:hidden;height:60px;width:212px;"
            :autoHeight="true"
            :rows="'3'"
            :maxLength="200"
          ></v-textarea>
        </div>
      </div>
      <div
        slot="modal-footer"
        class="modal-footer"
      >
        <button
          type="button"
          class="btn cancel-btn clearBtnBorder"
          @click="sureSingleAdd()"
        >确定</button>
        <button
          type="button"
          class="btn cancel-btn clearBtnBorder"
          @click="showSingleAddModal = false"
        >取消</button>
      </div>
    </v-modal>
    <!-- 批量新增弹窗 -->
    <v-modal
      :show="showManyAddModal"
      effect="fade"
      width="500"
    >
      <div
        slot="modal-header"
        class="modal-header"
      >
        <h5 class="modal-title">{{somethingIn?"请选择以下条件":"请选择导入方式"}}</h5>
      </div>
      <div
        slot="modal-body"
        class="modal-body"
      >
        <div class="form-group addClass-input-group">
          <button
            type="button"
            v-show="somethingIn"
            class="btn back-btn clearBtnBorder"
            @click="_backClassList1"
          >
            <i
              class="maticon back-icon-btn"
              v-html="icons('arrow_back')"
            >arrow_back</i>
          </button>
          <button
            type="button"
            v-show="!somethingIn"
            class="btn luin"
            @click="somethingIn = true"
          >条件限制导入</button>
          <div v-if="somethingIn">
            <div class="form-group addClass-input-group2">
              <label class="addClass-text">培养层次:</label>
              <v-select
                v-model="ImportCondition.educationLevel "
                class="dep-select"
                :options="educationLevels"
                :placeholder="'不限'"
                optionsLabel="label"
                optionsValue="value"
                :search="false"
                @afterSelected="educationLevelSelected"
              ></v-select>
            </div>
            <div class="form-group addClass-input-group">
              <label class="addClass-text">在校状态:</label>
              <v-select
                v-model="ImportCondition.schoolStatus"
                class="dep-select"
                :options="schoolStatus"
                optionsLabel="label"
                optionsValue="value"
                :search="false"
                @afterSelected="schoolStatusSelected"
              ></v-select>
            </div>
            <div class="form-group addClass-input-group">
              <label class="addClass-text">年级:</label>
              <v-select
                v-model="ImportCondition.grade"
                class="dep-select"
                :options="grade"
                :placeholder="'不限'"
                optionsLabel="name"
                optionsValue="id"
                :search="false"
                @afterSelected="gradeSelected"
              ></v-select>
            </div>
          </div>
        </div>
        <div
          class="form-group addClass-input-group1"
          v-show="!somethingIn"
        >
          <button
            type="button"
            class="btn luin1"
            @click="piliangdaoru()"
          >批量导入</button>
        </div>
      </div>
      <div
        slot="modal-footer"
        class="modal-footer"
      >
        <button
          type="button"
          v-if="somethingIn"
          class="btn cancel-btn clearBtnBorder"
          @click="insureModel()"
        >导入</button>
        <button
          type="button"
          class="btn cancel-btn clearBtnBorder"
          @click="cancelModel()"
        >{{translate.cancel}}</button>
      </div>
    </v-modal>
  </div>
  <!-- 模态导入页面 -->
  <div
    class="import-page"
    v-else
  >
    <v-import
      v-bind="importParams"
      @backParentPage="backParentPage"
      :overflow="'inherit'"
    ></v-import>
  </div>
</template>
<script>
import Vue from "vue";
import { sAjax, translation, request } from "../../assets/utils/utils.js";
export default {
  props: {
    classId: {
      default: 0
    },
    amount: {
      default: 0
    },
    itemName: {
      default: 0
    }
  },
  created: function() {
    var la = localStorage.getItem("lang");
    // this.showManyAddModal = false
    var that = this;
    if (translation(la)) {
      this.lang = la;
    }
    sAjax({
      url: "/api/payment/collegename",
      dataType: "json",
      type: "get",
      async: false,
      success: function(result) {
        if (result.state) {
          that.collegeOptions = result.data;
        }
      }
    });
    this.shouldPayNum = this.amount;
    sAjax({
      url: "/api/payment/sysdicttype?typeName=培养层次",
      dataType: "json",
      type: "get",
      async: false,
      success: function(result) {
        if (result.state) {
          that.educationLevels = result.data;
        }
      }
    });
    this.schoolStatus = [
      {
        value: "03",
        label: "不限"
      },
      {
        value: "01",
        label: "在校"
      },
      {
        value: "02",
        label: "不在校"
      }
    ];
    this.columns = [
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
            options: this.collegeOptions,
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
        id: "status",
        title: "缴费状态",
        className: "text-left",
        width: 120,
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
            options: this.educationLevels,
            optionsLabel: "label",
            optionsValue: "value"
          }
        }
      },
      {
        id: "amount",
        title: "应缴金额",
        className: "text-right",
        hidden: false,
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
        hidden: false,
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
        width: 125,
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
        className: "text-center",
        width: 200,
        hidden: false,
        formatter: function(record, index) {
          let cuijiao = {
            tag: "a",
            text: "催缴",
            className: "opt-btn",
            callback: function(record, index) {
              var moveArray = [];
              moveArray.push(record.userId);
              sAjax({
                url: "/api/payment/remind",
                dataType: "json",
                type: "post",
                data: {
                  userId: moveArray,
                  projectId: that.classId
                },
                success: function(data) {
                  if (data.state) {
                    that.url =
                      "/table-data/payment/getinformation?projectId=" +
                      that.classId +
                      "&timestamp=" +
                      new Date().getTime();
                    that.toast("催缴成功");
                  } else {
                    that.toast("催缴失败");
                  }
                }
              });
            }
          };
          let bianji = {
            tag: "a",
            text: "编辑",
            className: "opt-btn",
            callback: function(record, index) {
              that.showEditClassModal = true;
              that.payDetailEdit = record.orderDetails;
              that.shouldPayNumEdit = record.amount;
              that.payEditUserId = record.userId;
            }
          };
          let shanchu = {
            tag: "a",
            text: "删除",
            className: "opt-btn",
            callback: function(record, index) {
              var moveArray = [];
              moveArray.push(record.userId);
              if (record.status != "NOT_PAID") {
                that.toast("该生已经缴费，无法删除!");
              } else {
                if (confirm("确定删除？")) {
                  sAjax({
                    url: "/api/payment/deleteallinformation",
                    dataType: "json",
                    type: "post",
                    data: {
                      userId: moveArray,
                      projectId: that.classId
                    },
                    success: function(data) {
                      if (data.state) {
                        that.url =
                          "/table-data/payment/getinformation?projectId=" +
                          that.classId +
                          "&timestamp=" +
                          new Date().getTime();
                        that.toast("删除成功");
                      } else {
                        that.toast("删除失败");
                      }
                    }
                  });
                } else {
                  return false;
                }
              }
            }
          };
          let oprateArr = [];
          if (record.status == "NOT_PAID") {
            oprateArr.push(cuijiao);
            oprateArr.push(bianji);
            oprateArr.push(shanchu);
          }
          return oprateArr;
        }
      }
    ];
    this.columns.forEach((item, index) => {
      if (item.title != "操作" && item.title != "userId") {
        let o = new Object();
        o["id"] = item.id;
        o["title"] = item.title;
        o["hidden"] = false;
        this.fieldsToExport.push(o);
      }
    });
    this.importParams.templateName = "人员管理列表模板.xlsx";
    this.importParams.parentPageTitle = "人员管理列表";
    this.importParams.importBtnType = [
      {
        name: this.translate.overriteImport,
        url: "/payment/batch/update",
        method: 'post',
        isShowBtn: true,
        success: data => {
          if (data.state) {
            this.url =
              "/table-data/payment/getinformation?projectId=" +
              this.classId +
              "&timestamp=" +
              new Date().getTime();
          }
        }
      }
    ];
  },
  data: function() {
    return {
      studentId1: "",
      importParams: {
        parentPageTitle: "",
        downloadTemplateUrl: "/payment/batch/template",
        downloadErrorTemplateUrl: "/payment/batch/error",
        checkTemplateUrl: "/payment/batch/excel/" + this.classId,
        templateName: "",
        importBtnType: null
      },
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
      columns: [],
      url: "/table-data/payment/getinformation?projectId=" + this.classId,
      payEditUserId: 0,
      somethingIn: false,
      showManyAddModal: false,
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
      showSingleAddModal: false,
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
    piliangdaoru: function() {
      this.isParentPage = false;
      this.showManyAddModal = false;
    },
    _backClassList1: function() {
      this.somethingIn = false;
    },
    callPay: function() {
      var moveArray = [];
      this.tableCheckedList.forEach((item, index) => {
        if (item.status === 'NOT_PAID') {
          moveArray.push(item.userId);
        }
      });
      sAjax({
        url: "/api/payment/remind",
        dataType: "json",
        type: "post",
        data: {
          userId: moveArray,
          projectId: this.classId
        },
        success: (data) => {
          if (data.state) {
            this.url =
              "/table-data/payment/getinformation?projectId=" +
              this.classId +
              "&timestamp=" +
              new Date().getTime();
            this.tableCheckedList = [];
            this.toast("催缴成功");
          } else {
            this.toast("催缴失败");
          }
        }
      });
    },
    remove: function() {
      var moveArray = [];
      this.tableCheckedList.forEach((item, index) => {
        if (item.status === 'NOT_PAID') {
          moveArray.push(item.userId);
        }
      });
      if (confirm("确认删除？")) {
        sAjax({
          url: "/api/payment/deleteallinformation",
          dataType: "json",
          type: "post",
          data: {
            userId: moveArray,
            projectId: this.classId
          },
          success: (data) => {
            if (data.state) {
              this.toast("删除成功");
              this.url =
                "/table-data/payment/getinformation?projectId=" +
                this.classId +
                "&timestamp=" +
                new Date().getTime();
              this.tableCheckedList = [];
            } else {
              this.toast("删除失败");
            }
          }
        });
      } else {
        return false;
      }
      this.tableCheckedList = [];
    },
    _afterChecked: function(checkedRecords) {
      this.tableCheckedList = checkedRecords;
    },
    exportTable: function() {
      const searchData = this.$refs.renyuanTable.tableSearchFields;
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
    singleAddModal: function() {
      this.showSingleAddModal = true;
      this.isCheckResult = false;
      this.studentId = "";
      this.paydetail = "";
    },
    checkStudentId: function() {
      var that = this;
      if (!this.studentId) {
        that.isCheckResult = true;
        that.singleAddText = that.translate.enterStudentId;
        return false;
      }
      sAjax({
        url: "/api/relClass/checkStudent/" + this.studentId,
        dataType: "json",
        type: "get",
        success: function(data) {
          that.isCheckResult = true;
          if (data.state) {
            if (data.data.hasThisPerson) {
              that.studentUserId = data.data.userId;
              that.singleAddText = data.data.name;
              that.isSingleDisabled = false;
            } else {
              that.singleAddText = that.translate.noExist;
              that.isSingleDisabled = true;
            }
          } else {
            that.singleAddText = data.message;
            that.isSingleDisabled = true;
          }
        }
      });
    },
    batchAddModal: function() {
      this.showManyAddModal = true;
    },
    backParentPage: function() {
      this.isParentPage = true;
    },
    _backClassList: function() {
      this.$emit("backClassList", "classManage");
    },
    consultantSelected: function(option) {
      this.studentId1 = option.userId;
    },
    sureSingleAdd: function() {
      //这里处理单个新增
      var that = this;
      if (this.shouldPayNum) {
        sAjax({
          url: "/api/payment/oneinformation",
          dataType: "json",
          type: "post",
          data: {
            projectId: that.classId,
            amount: that.shouldPayNum,
            userId: that.studentId1,
            orderDetails: that.paydetail
          },
          success: function(result) {
            if (result.state) {
              that.toast("导入数据成功");
              that.url =
                "/table-data/payment/getinformation?projectId=" +
                that.classId +
                "&timestamp=" +
                new Date().getTime();
              that.showSingleAddModal = false;
            } else {
              that.toast("导入数据失败");
              that.showSingleAddModal = false;
            }
          }
        });
      } else {
        that.toast("应缴金额不能为空");
      }
    },
    cancelModel: function() {
      this.somethingIn = false;
      this.showManyAddModal = false;
    },
    insureModel: function() {
      //这里批量条件新增
      var that = this;
      if (that.amount != null) {
        sAjax({
          url: "/api/payment/insertinformation",
          dataType: "json",
          type: "post",
          data: {
            projectId: that.classId,
            amount: that.amount,
            schoolStatus: that.ImportCondition.schoolStatus,
            educationLevel: that.ImportCondition.educationLevel,
            grade: that.ImportCondition.grade
          },
          success: function(result) {
            if (result.state) {
              that.toast("导入数据成功");
              that.url =
                "/table-data/payment/getinformation?projectId=" +
                that.classId +
                "&timestamp=" +
                new Date().getTime();
              that.showManyAddModal = false;
              that.somethingIn = false;
            } else {
              that.showManyAddModal = false;
              that.somethingIn = false;
              that.toast("导入数据失败");
            }
          }
        });
      } else {
        that.toast("导入失败，请先设置项目应缴金额！");
        that.showManyAddModal = false;
      }
    },
    schoolStatusSelected: function(d) {
      if (d.value == "03") {
        this.ImportCondition.schoolStatus = "";
      } else {
        this.ImportCondition.schoolStatus = d.value;
      }
    },
    gradeSelected: function(d) {
      this.ImportCondition.grade = d.value;
    },
    educationLevelSelected: function(d) {
      this.ImportCondition.educationLevel = d.value;
    },
    PayStateSelected: function(d) {
      this.PayStateEdit = d.value;
    },
    insureEdit: function() {
      //这里处理编辑
      var that = this;
      if (this.PayStateEdit) {
        sAjax({
          url: "/api/payment/updateinformation",
          dataType: "json",
          type: 'post',
          data: {
            userId: that.payEditUserId,
            amount: that.shouldPayNumEdit,
            projectId: that.classId,
            status: that.PayStateEdit,
            orderDetails: that.payDetailEdit
          },
          success: function(data) {
            if (data.state) {
              that.showEditClassModal = false;
              that.url =
                "/table-data/payment/getinformation?projectId=" +
                that.classId +
                "&timestamp=" +
                new Date().getTime();
              that.toast("更新成功");
            } else {
              that.toast("更新失败");
              that.showEditClassModal = false;
            }
          }
        });
      } else {
        alert("请选择缴费状态");
      }
    }
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
