<template >
  <div>
    <div
      id="payHallManage-page"
      class="container-fluid"
      v-if="isParentPage"
    >
      <!-- 缴费项目表格 -->
      <div class="row text-center class-list-page">
        <v-table
          ref="payHallTable"
          :url="url"
          pagesize="10"
          idField="id"
          :columns="columns"
          :order="true"
          :search="true"
          :columnsControl="true"
        >
          <div
            slot="btn-group"
            class="btn-group pull-right"
            role="group"
          >
            <button
              type="button"
              class="btn btn-bgColor-style clearBtnBorder"
              @click="createClass()"
            >新增项目</button>
          </div>
        </v-table>
      </div>
      <!-- 成员管理 表格-->
      <div
        class="class-member-page"
        v-if="isShowMemberPage"
      >
        <v-payHallMembers
          :classId="classId"
          :itemName="itemName"
          :amount="amount"
          @backClassList="backClassList"
        ></v-payHallMembers>
      </div>
      <!-- 模态新增项目 -->
      <v-modal
        :show="showAddClassModal"
        effect="fade"
        width="500"
      >
        <div
          slot="modal-header"
          class="modal-header"
        >
          <h5 class="modal-title">新增项目</h5>
        </div>
        <div
          slot="modal-body"
          class="modal-body"
          v-if="showAddClassModal"
        >
          <div class="input-group addClass-input-group">
            <label class="addClass-text">学年:</label>
            <v-select
              class="btn-block search-select"
              v-model="addNewItem.schoolyear"
              :options="collegeOptions.grades"
              options-value="id"
              options-label="text"
              @afterSelected="addNewItemSchoolyearSelected"
              search
              close-on-select
            ></v-select>
          </div>
          <div class="input-group addClass-input-group">
            <label class="addClass-text">缴费项目名称:</label>
            <input
              class="form-control search-input"
              type="text"
              v-model="addNewItem.payItemName"
              aria-describedby="basic-addClass-payItemName"
            >
          </div>
          <div class="form-group edit-class-group">
            <label class="edit-class-text time-picker-label pull-left">开始时间:</label>
            <v-datepicker
              ref="datepicker"
              class="btn-block time-picker"
              format="yyyy-MM-dd hh:ii"
              v-model="addNewItem.paystartTime"
              :clearButton="false"
              :showTime="false"
              @daySelected="startTimeSelected"
            ></v-datepicker>
          </div>
          <div class="form-group edit-class-group">
            <label class="edit-class-text time-picker-label pull-left">结束时间:</label>
            <v-datepicker
              ref="datepicker"
              class="btn-block time-picker"
              format="yyyy-MM-dd hh:ii"
              v-model="addNewItem.payendTime"
              :clearButton="false"
              :showTime="false"
              @daySelected="endTimeSelected"
            ></v-datepicker>
          </div>
          <div class="input-group addClass-input-group">
            <label class="addClass-text">每人应缴费金额:</label>
            <input
              placeholder="选填*请输入数字"
              class="form-control search-input"
              type="text"
              v-model="addNewItem.payItemNum"
              aria-describedby="basic-addClass-payItemName"
            >
          </div>
        </div>
        <div
          slot="modal-footer"
          class="modal-footer"
        >
          <button
            type="button"
            class="btn cancel-btn clearBtnBorder"
            @click="showAddClassModal = false"
          >取消</button>
          <button
            type="button"
            class="btn submit-btn clearBtnBorder"
            @click="insureAdd()"
          >确认</button>
        </div>
      </v-modal>
      <!-- 模态编辑项目 -->
      <v-modal
        :show="showeditNewItemModal"
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
          v-if="showeditNewItemModal"
        >
          <div class="input-group addClass-input-group">
            <label class="addClass-text">学年:</label>
            <v-select
              class="btn-block search-select"
              v-model="editNewItem.schoolyear"
              :options="schoolyearList"
              options-value="id"
              options-label="text"
              @afterSelected="collegeSelected"
              search
              close-on-select
            ></v-select>
          </div>
          <div class="input-group addClass-input-group">
            <label class="addClass-text">缴费项目名称:</label>
            <input
              class="form-control search-input"
              type="text"
              v-model="editNewItem.payItemName"
              aria-describedby="basic-addClass-payItemName"
            >
          </div>
          <div class="form-group edit-class-group">
            <label class="edit-class-text time-picker-label pull-left">开始时间:</label>
            <v-datepicker
              ref="datepicker"
              class="btn-block time-picker"
              format="yyyy-MM-dd hh:ii"
              v-model="editNewItem.paystartTime"
              :clearButton="false"
              :showTime="false"
              @daySelected="editNewItemStartTime"
            ></v-datepicker>
          </div>
          <div class="form-group edit-class-group">
            <label class="edit-class-text time-picker-label pull-left">结束时间:</label>
            <v-datepicker
              ref="datepicker"
              class="btn-block time-picker"
              format="yyyy-MM-dd hh:ii"
              v-model="editNewItem.payendTime"
              :clearButton="false"
              :showTime="false"
              @daySelected="editNewItemEndTime"
            ></v-datepicker>
          </div>
          <div class="input-group addClass-input-group">
            <label class="addClass-text">每人应缴费金额:</label>
            <input
              placeholder="选填*请输入数字"
              class="form-control search-input"
              type="text"
              v-model="editNewItem.amount"
              :disabled="disabled"
              aria-describedby="basic-addClass-payItemName"
            >
          </div>
        </div>
        <div
          slot="modal-footer"
          class="modal-footer"
        >
          <button
            type="button"
            class="btn submit-btn clearBtnBorder"
            @click="insureEdit()"
          >确认</button>
          <button
            type="button"
            class="btn cancel-btn clearBtnBorder"
            @click="showeditNewItemModal = false"
          >取消</button>
        </div>
      </v-modal>
    </div>
    <!-- 导入资源 -->
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
            :value="templateData.schoolyear"
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
            <div class="info-options">
              <span v-for="(col,k) in relationship" :key="k" @click="relationshipPick=col.id">
                <i class="maticon" :class="relationshipPick === col.id?'active':''" v-html="icons(relationshipPick === col.id?'radio_button_checked':'radio_button_unchecked')"></i>
                {{col.text}}
              </span>
            </div>
          </div>
        </div>
        <div class="input-group addClass-input-group">
          <label class="template-relationship-text">{{translate.classes}}{{translate.situation}}:</label>
          <div class="radio-area">
            <div class="info-options">
              <span v-for="(col,k) in haveClass" :key="k" @click="classesPick=col.id">
                <i class="maticon" :class="classesPick === col.id?'active':''" v-html="icons(classesPick === col.id?'radio_button_checked':'radio_button_unchecked')"></i>
                {{col.text}}
              </span>
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
import VpayHallMembers from "../../pages/payHall/payHallMembers.vue";
Vue.component("v-payHallMembers", VpayHallMembers);
export default {
  created: function() {
    //初始化表头字段
    this._initColumnsOfSearch();
  },
  data: function() {
    return {
      disabled: false,
      columns: [],
      url: "/table-data/payment/allproject",
      showAddClassModal: false,
      showeditNewItemModal: false,
      showAddCommitteeModal: false,
      isManagePage: "classManage",
      isShowMemberPage: false,
      classId: 0,
      amount: 0,
      itemName: "",
      addNewItem: {
        schoolyear: "",
        payItemName: "",
        paystartTime: "",
        payendTime: "",
        shouldPayNum: "",
        payItemNum: ""
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
      schoolyearList: [
        {
          text: "2022-2023学年",
          id: "2022"
        },
        {
          text: "2021-2022学年",
          id: "2021"
        },
        {
          text: "2020-2021学年",
          id: "2020"
        },
        {
          text: "2019-2020学年",
          id: "2019"
        },
        {
          text: "2018-2019学年",
          id: "2018"
        },
        {
          text: "2017-2018学年",
          id: "2017"
        },
        {
          text: "2016-2017学年",
          id: "2016"
        }
      ],
      collegeOptions: {
        template: [],
        grades: [
          {
            text: "2022-2023学年",
            id: "2022"
          },
          {
            text: "2021-2022学年",
            id: "2021"
          },
          {
            text: "2020-2021学年",
            id: "2020"
          },
          {
            text: "2019-2020学年",
            id: "2019"
          },
          {
            text: "2018-2019学年",
            id: "2018"
          },
          {
            text: "2017-2018学年",
            id: "2017"
          },
          {
            text: "2016-2017学年",
            id: "2016"
          }
        ]
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
        schoolyear: "",
        gradeId: ""
      },
      editNewItem: {
        id: "",
        classId: "",
        schoolyear: "",
        payItemName: "",
        paystartTime: "",
        payendTime: "",
        payItemNum: "",
        amount: ""
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
      iseditNewItem: false,
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
    downloadUrl: function() {
      return (
        "/relClass/downloadTemplate?college=" +
        this.templateData.schoolyear +
        "&grade=" +
        this.templateData.gradeId +
        "&relationship=" +
        this.relationshipPick +
        "&haveClass=" +
        this.classesPick
      );
    }
  },
  methods: {
    editInsure: function() {
      this.showeditNewItemModal = false;
    },
    _initColumnsOfSearch: function() {
      var that = this;
      this.columns = [
        {
          id: "year",
          title: "学年",
          width: 120,
          className: "text-left",
          hidden: false,
          formatter: function(record, index) {
            return record.year + "-" + (parseInt(record.year) + 1 + "学年");
          },
          search: {
            type: "select",
            data: {
              options: that.schoolyearList,
              optionsLabel: "text",
              optionsValue: "id"
            }
          }
        },
        {
          id: "id",
          title: "缴费项目代码",
          width: 100,
          className: "text-left",
          hidden: false
        },
        {
          id: "amount",
          title: "应缴金额",
          width: 120,
          className: "text-left",
          hidden: true
        },
        {
          id: "name",
          title: "缴费项目名称",
          width: 140,
          className: "text-left",
          hidden: false,
          search: {
            type: "input"
          }
        },
        {
          id: "beginTime",
          title: "开始时间",
          width: 150,
          className: "text-center",
          hidden: false
        },
        {
          id: "endTime",
          title: "结束时间",
          width: 150,
          className: "text-left",
          hidden: false
        },
        {
          id: "opt",
          title: "操作",
          className: "text-left",
          width: 200,
          hidden: false,
          formatter: function(record, index) {
            var returnArr = [];
            let bianji = {
              tag: "a",
              text: "编辑",
              className: "opt-btn",
              callback: function(record, index) {
                that.showeditNewItemModal = true;
                that.iseditNewItem = false;
                that.editNewItem.id = record.id;
                that.editNewItem.schoolyear = record.year;
                that.editNewItem.payItemName = record.name;
                that.editNewItem.paystartTime = record.beginTime;
                that.editNewItem.payendTime = record.endTime;
                that.editNewItem.amount = record.amount;
              }
            };
            let renyuanguanli = {
              tag: "a",
              text: "人员管理",
              className: "opt-btn",
              callback: function(record, index) {
                that.isManagePage = "memberList";
                that.isShowMemberPage = true;
                that.classId = record.id;
                that.itemName = record.name;
                that.amount = record.amount;
              }
            };
            let shanchu = {
              tag: "a",
              text: "删除",
              className: "opt-btn",
              callback: function(record, index) {
                if (confirm("确定删除此项目吗？")) {
                  sAjax({
                    url: "/api/payment/checkamount?id=" + record.id,
                    dataType: "json",
                    type: "get",
                    success: function(data) {
                      if (data.data.okDelete) {
                        sAjax({
                          url: "/api/payment/deleteproject?id=" + record.id,
                          dataType: "json",
                          type: 'post',
                          success: function(result) {
                            if (result.state) {
                              that.url =
                                "/table-data/payment/allproject" +
                                "?timestamp=" +
                                new Date().getTime();
                              that.toast("删除数据成功");
                              that.showAddClassModal = false;
                            } else {
                              that.toast("删除数据失败");
                            }
                          }
                        });
                      } else {
                        alert("已有人缴费，无法删除该项目!");
                      }
                    }
                  });
                }
              }
            };
            let fabu = {
              tag: "a",
              text: "发布",
              className: "opt-btn",
              callback: function(record, index) {
                sAjax({
                  url: "/api/payment/upProject?id=" + record.id,
                  dataType: "json",
                  type: 'post',
                  success: function(result) {
                    if (result.state) {
                      that.url =
                        "/table-data/payment/allproject" +
                        "?timestamp=" +
                        new Date().getTime();
                      that.toast("发布成功");
                      that.showAddClassModal = false;
                    } else {
                      that.toast("发布失败");
                    }
                  }
                });
              }
            };
            let xiajia = {
              tag: "a",
              text: "下架",
              className: "opt-btn",
              callback: function(record, index) {
                sAjax({
                  url: "/api/payment/downProject?id=" + record.id,
                  dataType: "json",
                  type: 'post',
                  success: function(result) {
                    if (result.state) {
                      that.url =
                        "/table-data/payment/allproject" +
                        "?timestamp=" +
                        new Date().getTime();
                      that.toast("下架成功");
                      that.showAddClassModal = false;
                    } else {
                      that.toast("下架失败");
                    }
                  }
                });
              }
            };
            returnArr.push(bianji);
            returnArr.push(renyuanguanli);
            returnArr.push(shanchu);
            if (record.push) {
              returnArr.push(fabu);
            } else {
              returnArr.push(xiajia);
            }
            return returnArr;
          }
        }
      ];
    },
    insureAdd: function() {
      var that = this;
      if (this.addNewItem.payItemNum == 0) {
        this.toast("应缴费金额不能为0");
      } else {
        if (
          !isNaN(this.addNewItem.payItemNum) ||
          this.addNewItem.payItemNum == null ||
          this.addNewItem.payItemNum == ""
        ) {
          if (
            this.addNewItem.schoolyear &&
            this.addNewItem.payendTime &&
            this.addNewItem.paystartTime &&
            this.addNewItem.payItemName
          ) {
            let newitem = {
              year: this.addNewItem.schoolyear,
              beginTime: this.addNewItem.paystartTime,
              endTime: this.addNewItem.payendTime,
              name: this.addNewItem.payItemName,
              amount: this.addNewItem.payItemNum
            };
            //这里新增动作
            sAjax({
              url: "/api/payment/addproject",
              dataType: "json",
              type: "post",
              data: newitem,
              success: function(result) {
                if (result.state) {
                  that.url =
                    "/table-data/payment/allproject" +
                    "?timestamp=" +
                    new Date().getTime();
                  that.toast("新增数据成功");
                  that.showAddClassModal = false;
                } else {
                  if (result.code == "50003") {
                    that.toast("项目名重复或项目已存在！");
                  } else {
                    that.toast("新增数据失败");
                  }
                }
              }
            });
          } else {
            alert("请正确输入项目信息!");
          }
        } else {
          alert("金额需要为纯数字");
        }
      }
    },
    insureEdit: function() {
      var that = this;
      if (this.editNewItem.amount == 0) {
        this.toast("应缴费金额不能为0");
      } else {
        if (
          !isNaN(this.editNewItem.amount) ||
          this.editNewItem.amount == null ||
          this.editNewItem.amount == ""
        ) {
          if (
            this.editNewItem.schoolyear &&
            this.editNewItem.payendTime &&
            this.editNewItem.paystartTime &&
            this.editNewItem.payItemName
          ) {
            let newitem = {
              id: this.editNewItem.id,
              year: this.editNewItem.schoolyear,
              endTime: this.editNewItem.payendTime,
              beginTime: this.editNewItem.paystartTime,
              name: this.editNewItem.payItemName,
              amount: this.editNewItem.amount
            };
            //这里做编辑保存动作
            sAjax({
              url: "/api/payment/updateproject",
              dataType: "json",
              type: 'post',
              data: newitem,
              success: function(result) {
                if (result.state) {
                  that.url =
                    "/table-data/payment/allproject" +
                    "?timestamp=" +
                    new Date().getTime();
                  that.toast("编辑数据成功");
                  that.showeditNewItemModal = false;
                } else {
                  if (result.code == "50003") {
                    that.toast("项目名重复或项目已存在！");
                  } else if (result.code == "10005") {
                    that.toast("已有人员缴费，不可编辑应缴金额！");
                  } else {
                    that.toast("编辑数据失败");
                  }
                }
              }
            });
          } else {
            alert("请正确输入项目信息!");
          }
        } else {
          alert("金额需要为纯数字");
        }
      }
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
    },
    createClass: function() {
      this.showAddClassModal = true;
      this.addNewItem = {
        college: "",
        schoolyear: "",
        grade: "",
        gradeId: "",
        level: "",
        levelId: "",
        payNum: "",
        payItemName: "",
        orderNumber: [],
        orderNumberId: [],
        createClass: "",
        classNumber: 0,
        classText: ""
      };
    },
    sureCreat: function() {
      var that = this;
      var classData = null;
      this.classList.splice(0, this.classList.length);
      this.newClassData.className = this.addNewItem.payItemName;
      this.newClassData.college = this.addNewItem.schoolyear;
      this.newClassData.learningLevel = this.addNewItem.levelId;
      this.newClassData.grade = this.addNewItem.gradeId;
      if (this.addNewItem.orderNumber.length > 0) {
        for (var i in this.addNewItem.orderNumber) {
          this.newClassData.classFullName = this.newClassNameArr[i].replace(
            /(\s*$)/g,
            ""
          );
          var index = this.fullNameArr.indexOf(this.newClassData.classFullName);
          if (index >= 0) {
            return this.toast(this.newClassData.classFullName + "已存在");
          }
          this.newClassData.classNumber = this.addNewItem.orderNumberId[i];
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
          return this.toast(this.newClassData.classFullName + "已存在");
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
            that.toast(that.translate.submitSuccessTip);
            that.showAddClassModal = false;
          } else {
            that.toast(that.translate.submitFailedTip + ":" + data.message);
          }
        }
      });
    },
    addNewItemSchoolyearSelected: function(o) {},
    collegeSelected: function(obj) {
      this.addNewItem.schoolyear = obj.value;
    },
    gradeSelected: function(obj) {
      this.addNewItem.gradeId = obj.value;
      this.gradeOptions.addClass.forEach((ele, i) => {
        if (this.addNewItem.gradeId === ele.id) {
          this.addNewItem.grade = ele.text;
        }
      });
      this.addNewItem.classNumber = 1;
      this.getClassHistory();
    },
    levelSelected: function(obj) {
      this.addNewItem.levelId = obj.value;
      this.levelOptions.addClass.forEach((ele, i) => {
        if (this.addNewItem.levelId === ele.id) {
          this.addNewItem.level = ele.text;
        }
      });
      this.addNewItem.classNumber = 1;
      this.addNewItem.classText = this.translate.classText;
      this.getClassHistory();
    },
    orderNumberSelected: function(obj) {
      if (obj.value.length > 0) {
        var orderNumberIdArray = [];
        this.orderNumberStr = obj.value;
        orderNumberIdArray = obj.value.split(",");
        this.addNewItem.orderNumberId = orderNumberIdArray.sort(
          this.sortNumber
        );
        this.addNewItem.orderNumber = [];
        for (var i in this.addNewItem.orderNumberId) {
          for (var j in this.orderNumberOptions) {
            if (
              this.addNewItem.orderNumberId[i] === this.orderNumberOptions[j].id
            ) {
              var index = this.addNewItem.orderNumber.indexOf(
                this.orderNumberOptions[j].text
              );
              if (index < 0) {
                this.addNewItem.orderNumber.push(
                  this.orderNumberOptions[j].text
                );
              }
            }
          }
        }
        if (this.addNewItem.orderNumberId.length === 0) {
          this.addNewItem.classText = this.translate.classText;
        } else {
          this.addNewItem.classText = " ";
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
      this.iseditNewItem = true;
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
      this.templateData.schoolyear = obj.value;
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
          college: this.addNewItem.schoolyear,
          learningLevel: this.addNewItem.levelId,
          grade: this.addNewItem.gradeId
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
            that.toast(data.message);
          }
        }
      });
    },
    checkClassLeaderId: function() {
      var that = this;
      if (!that.editNewItem.classLeaderId) {
        that.checkMessage.classLeader = that.translate.enterStudentId;
        return false;
      }
      that.iseditNewItem = true;
      sAjax({
        url: "/api/relationship/checkUserId/" + that.editNewItem.classLeaderId,
        dataType: "json",
        type: "get",
        success: function(data) {
          if (data.state) {
            that.editNewItem.classLeaderName = data.data.name;
            that.editNewItem.classLeaderUserId = data.data.userId;
            that.checkMessage.classLeader = "";
          } else {
            that.checkMessage.classLeader = data.message;
            that.editNewItem.classLeaderName = "";
          }
        }
      });
    },
    checkInstructorId: function() {
      var that = this;
      if (!that.editNewItem.instructorId) {
        that.checkMessage.instructor = that.translate.enterStudentId;
        return false;
      }
      that.iseditNewItem = true;
      sAjax({
        url: "/api/relationship/checkUserId/" + that.editNewItem.instructorId,
        dataType: "json",
        type: "get",
        success: function(data) {
          if (data.state) {
            that.editNewItem.instructorName = data.data.name;
            that.editNewItem.instructorUserId = data.data.userId;
            that.checkMessage.instructor = "";
          } else {
            that.checkMessage.instructor = data.message;
            that.editNewItem.instructorName = "";
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
        this.toast(this.translate.improveClassInfo);
        return;
      }
      if (!this.positionType.select && !this.newCommittee.name) {
        this.toast(this.translate.improveClassInfo);
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
      if (this.editNewItem.classCommitteePeople.length > 0) {
        this.editNewItem.classCommitteePeople.forEach(ele => {
          if (
            this.newCommittee.studentId === ele.studentId &&
            this.committeeData.classCommittee === ele.classCommittee
          ) {
            isAddCommittee = true;
            this.toast("同一个职位不能同一个人");
            return false;
          }
        });
      }
      if (!isAddCommittee) {
        this.editNewItem.classCommitteePeople.push(newCommitteeData);
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
    editNewItemStartTime: function(d) {
      if (this.editNewItem.startTime) {
        var timeString =
          new Date(d.value).getTime() -
          new Date(this.editNewItem.endTime).getTime();
        if (timeString > 0) {
          this.$nextTick(() => {
            this.toast("缴费开始时间要在缴费结束时间之前");
            this.editNewItem.startTime = "";
          });
          return false;
        } else {
          this.editNewItem.startTime = d.value;
        }
      } else {
        this.editNewItem.startTime = d.value;
      }
    },
    editNewItemEndTime: function(d) {
      if (this.editNewItem.endTime) {
        var timeString =
          new Date(d.value).getTime() -
          new Date(this.editNewItem.startTime).getTime();
        if (timeString < 0) {
          this.$nextTick(() => {
            this.toast("缴费开始时间要在缴费结束时间之前");
            this.editNewItem.endTime = "";
          });
          return false;
        } else {
          this.editNewItem.endTime = d.value;
        }
      } else {
        this.editNewItem.endTime = d.value;
      }
    },
    startTimeSelected: function(d) {
      if (this.addNewItem.payendTime) {
        var timeString =
          new Date(d.value).getTime() -
          new Date(this.addNewItem.payendTime).getTime();
        if (timeString > 0) {
          this.$nextTick(() => {
            this.toast("缴费开始时间要在缴费结束时间之前");
            this.addNewItem.paystartTime = "";
          });
          return false;
        } else {
          this.addNewItem.paystartTime = d.value;
        }
      } else {
        this.addNewItem.paystartTime = d.value;
      }
    },
    endTimeSelected: function(d) {
      if (this.addNewItem.paystartTime) {
        var timeString =
          new Date(d.value).getTime() -
          new Date(this.addNewItem.paystartTime).getTime();
        if (timeString < 0) {
          this.$nextTick(() => {
            this.toast("缴费开始时间要在缴费结束时间之前");
            this.addNewItem.payendTime = "";
          });
          return false;
        } else {
          this.addNewItem.payendTime = d.value;
        }
      } else {
        this.addNewItem.payendTime = d.value;
      }
    },
    classLeaderStartTime: function(d) {
      this.editNewItem.classLeaderStartTime = d.value;
    },
    classLeaderEndTime: function(d) {
      this.editNewItem.classLeaderEndTime = d.value;
    },
    instructorStartTime: function(d) {
      this.editNewItem.instructorStartTime = d.value;
    },
    instructorEndTime: function(d) {
      this.editNewItem.instructorEndTime = d.value;
    },
    cancelEditModal: function() {
      if (this.iseditNewItem) {
        if (confirm(this.translate.cancelEditText)) {
          this.showeditNewItemModal = false;
        }
      } else {
        this.showeditNewItemModal = false;
      }
    },
    editNewItemInfo: function() {
      var that = this;
      sAjax({
        url: "/api/relClass/editNewItem/" + this.editNewItem.classId,
        dataType: "json",
        data: {
          createTime: this.editNewItem.createTime,
          dissolutionTime: this.editNewItem.dissolutionTime,
          classLeaderId: this.editNewItem.classLeaderUserId,
          classLeaderName: this.editNewItem.classLeaderName,
          classLeaderStartTime: this.editNewItem.classLeaderStartTime,
          classLeaderEndTime: this.editNewItem.classLeaderEndTime,
          instructorId: this.editNewItem.instructorUserId,
          instructorName: this.editNewItem.instructorName,
          instructorStartTime: this.editNewItem.instructorStartTime,
          instructorEndTime: this.editNewItem.instructorEndTime,
          classCommitteePersonVos: this.editNewItem.classCommitteePeople,
          committeeTypes: this.committeeTypes
        },
        type: 'post',
        success: function(data) {
          if (data.state) {
            that.url =
              "/table-data/relClass/getClasses?timestamp=" +
              new Date().getTime();
            that.toast(that.translate.editSuccessTip);
            that.showeditNewItemModal = false;
            that.committeeTypes.splice(0, that.committeeTypes.length);
          } else {
            that.toast(that.translate.editFailedTip + ":" + data.message);
          }
        }
      });
    },
    iseditNewItemLeaderId: function() {
      this.iseditNewItem = true;
    },
    iseditNewItemLeaderName: function() {
      this.iseditNewItem = true;
    },
    isInstructorId: function() {
      this.iseditNewItem = true;
    },
    isInstructorName: function() {
      this.iseditNewItem = true;
    }
  }
};
</script>
<style lang="less">
@import url("../../assets/common.less");
#payHallManage-page {
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
      width: 212px;
      margin: 0 19px;
    }
    .search-input {
      margin: 0 16px;
      width: 212px;
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

  .addclass-learnLevel-text {
    margin-left: 27px;
  }
  .new-class-text {
    vertical-align: top;
    margin-left: 14px;
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
  .time-picker-label{
    line-height: 34px;
  }
  .time-picker {
    display: inline-block;
    margin-left: 22px;
    .form-control {
      border-radius: 0;
      border: none;
      border-bottom: 2px solid #e0e0e0;
      width: 212px !important;
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
    margin-right: 65px;
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
