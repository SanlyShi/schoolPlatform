<template>
  <div id="collegeRole-page" class="container-fluid">
    <h4 style="margin-left:-14px;color:rgb(117,117,117)">缴费统计时间：{{time}}</h4>
    <div class="row text-center">
      <div slot="btn-group" role="group">
        <div class="btn-group pull-left">
          <v-select
            class="dep-select"
            v-model="collegeSelect"
            :placeholder="'所有学院'"
            :options="college"
            optionsLabel="name"
            optionsValue="code"
            @afterSelected="selectCollegeItem"
          ></v-select>
        </div>
        <div class="btn-group pull-left" style="margin-left:10px">
          <v-select
            class="dep-select"
            v-model="selectSchoolYears"
            :placeholder="'请选择学年'"
            :options="schoolYear"
            optionsLabel="name"
            optionsValue="id"
            @afterSelected="selectSchoolYear"
          ></v-select>
        </div>
        <div class="btn-group pull-left" style="margin-left:10px">
          <v-select
            class="dep-select"
            :multiple="true"
            v-model="selectPayItems"
            :placeholder="'请选择项目'"
            :options="payItem"
            optionsLabel="name"
            optionsValue="id"
            :search="false"
            @afterSelected="selectPayItem"
            style="width:130px"
          ></v-select>
        </div>
        <div class="btn-group pull-left" style="margin-left:10px">
          <button type="button" class="btn submit-btn" @click="reset()">重置</button>
        </div>
        <div class="btn-group pull-left" style="margin-left:10px">
          <button type="button" class="btn submit-btn" @click="addRoleModal()">导出</button>
        </div>
      </div>
    </div>
    <div id="echartContainer" style="margin-left:80px;margin-top:100px;width:95%; height:600px"></div>
    <!-- 模态框（Modal） -->
    <v-modal :show="showUserModal" effect="fade" width="420">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">{{modalType}}{{translate.role}}</h5>
      </div>
      <div slot="modal-body" class="modal-body">
        <input type="hidden" id="role-id" v-model="newDepartRole.id">
        <div class="form-group">
          <label class="input-label">{{translate.level}}</label>
          <v-select
            class="btn-block search-select modal-form-style levels-select"
            :disabled="modalType === '编辑'?true:false"
            :value="newDepartRole.level?newDepartRole.level:'1'"
            :options="levelOptions"
            options-value="id"
            options-label="name"
            @afterSelected="changeLevel"
            search
            close-on-select
          ></v-select>
        </div>
        <div class="form-group">
          <label class="input-label">{{translate.roleName}}</label>
          <input
            type="text"
            class="form-control search-input modal-form-style"
            v-model="newDepartRole.name"
            @keyup="_verifyLength"
          >
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button
          type="button"
          class="btn cancel-btn clearBtnBorder"
          @click="cancelAddRole"
        >{{translate.cancel}}</button>
        <button
          type="button"
          class="btn submit-btn clearBtnBorder"
          @click="addRole"
        >{{translate.submit}}</button>
      </div>
    </v-modal>
  </div>
</template>
<script>
import Vue from "vue";
import echarts from "echarts";
import { sAjax, translation } from "../../assets/utils/utils.js";
export default {
  created: function() {
    var la = localStorage.getItem("lang");
    var that = this;
    if (translation(la)) {
      this.lang = la;
    }
    sAjax({
      url: "/api/payment/years?lang=",
      dataType: "json",
      type: "get",
      success: function(result) {
        //遍历插入学年select
        for (var i = 0; i < result.data.length; i++) {
          let obj = new Object();
          obj["name"] =
            result.data[i] + "-" + (parseInt(result.data[i]) + 1 + "年");
          obj["id"] = result.data[i];
          that.schoolYear.push(obj);
        }
      }
    });
    sAjax({
      url: "/api/colleges?lang=",
      dataType: "json",
      type: "get",
      success: function(result) {
        //遍历插入学院select
        for (var i = 0; i < result.data.length; i++) {
          let obj = new Object();
          obj["name"] = result.data[i].name;
          obj["code"] = result.data[i].code;
          that.college.push(obj);
          // that.projectIds.push(result.data[i].id);
        }
      }
    });
    if (this.schoolYearSelect == "") {
      sAjax({
        url: "/api/payment/projects",
        dataType: "json",
        type: "get",
        success: function(result) {
          // 遍历插入项目select
          // var projectIds = "";
          // var Xitem = [];
          for (var i = 0; i < result.data.length; i++) {
            let obj = new Object();
            obj["name"] = result.data[i].name;
            obj["id"] = result.data[i].id;
            that.payItem.push(obj);
            that.projectIds = that.projectIds + result.data[i].id + ",";
            that.projectIds1 = that.projectIds1 + result.data[i].id + ",";
            // Xitem.push(result.data[i].name);
          }
          that.payItem1 = that.payItem;
          sAjax({
            url: "/api/payment/stat" + "?projectIds=" + that.projectIds,
            dataType: "json",
            type: "get",
            success: function(result) {
              that.time = result.data.createTime;
              // 遍历插入学院select;
              var hasPaymanNum = [];
              var notPayManNum = [];
              var hasPayMoney = [];
              var notPayMoney = [];
              var Xitem = [];
              for (var i = 0; i < result.data.items.length; i++) {
                hasPaymanNum.push(result.data.items[i].peopleCountPaid);
                notPayManNum.push(result.data.items[i].peopleCountNotPay);
                hasPayMoney.push(result.data.items[i].amountPaid);
                notPayMoney.push(result.data.items[i].amountNotPay);
                Xitem.push(result.data.items[i].projectName);
              }
              that.updateEchart(
                Xitem,
                hasPaymanNum,
                notPayManNum,
                hasPayMoney,
                notPayMoney
              );
            }
          });
        }
      });
    }
  },
  data: function() {
    return {
      payItem1: [],
      time: "",
      collegeSelect: "",
      selectPayItems: "",
      selectSchoolYears: "",
      projectIds1: "",
      collegeCode: "",
      projectIds: [],
      schoolYearSelect: "",
      isheadPage: true,
      xueyuan: "数学院",
      item: "学费",
      time: "2017-2018年",
      departmentOptions: [],
      levelOptions: [
        {
          id: "COLLEGE",
          name: "院级"
        },
        {
          id: "SCHOOL",
          name: "校级"
        }
      ],
      college: [],
      schoolYear: [],
      payItem: [],
      currentDepartmentId: "",
      url: "",
      roleUrl: "/table-data/approveRoles/page",
      showUserModal: false,
      newDepartRole: {
        id: "",
        name: "",
        departmentId: 0,
        level: ""
      },
      modalType: "",
      lang: "zh-cn"
    };
  },
  mounted: function() {},
  computed: {
    translate: function() {
      return translation(this.lang).approverRoleManage;
    }
  },
  methods: {
    updateEchart: function(
      Xitem,
      hasPaymanNum,
      notPayManNum,
      hasPayMoney,
      notPayMoney
    ) {
      var myChart = echarts.init(document.getElementById("echartContainer"));
      myChart.setOption({
        title: { text: "缴费统计图" },
        color:["#64c23a","#e6a23c","#f56c6c","#4091ff"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        legend: {
          data: ["已缴费人数", "未缴费人数", "已缴费金额", "未缴费金额"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: Xitem,
            axisLabel: {
              show: true,
              interval: 0,
              rotate: -45,
              formatter: function(params) {
                var newStr = "";
                var n = params.length;
                var a = 12;
                if (n > a) {
                  newStr = params.substring(0, 12) + "...";
                } else {
                  newStr = params;
                }
                return newStr;
              }
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "人数",
            axisLabel: {
              formatter: "{value} 人"
            }
          },
          {
            type: "value",
            name: "金额",
            axisLabel: {
              formatter: "{value} 元"
            }
          }
        ],
        series: [
          {
            name: "已缴费人数",
            type: "bar",
            stack: "人数",
            data: hasPaymanNum
          },
          {
            name: "未缴费人数",
            type: "bar",
            stack: "人数",
            data: notPayManNum
          },
          {
            name: "已缴费金额",
            type: "bar",
            stack: "金额",
            data: hasPayMoney,
            yAxisIndex: 1
          },
          {
            name: "未缴费金额",
            type: "bar",
            stack: "金额",
            data: notPayMoney,
            yAxisIndex: 1
          }
        ],
        itemStyle: {
          normal: {
            color: function(params) {
              var colorList = ["#64c23a","#e6a23c","#f56c6c","#f5f5f5"];
              return colorList[params.dataIndex % colorList.length];
            }
          }
        }
      });
    },
    selectSchoolYear: function(o) {
      this.selectSchoolYears = o.value;
      this.selectPayItems = "";
      var that = this;
      sAjax({
        url: "/api/payment/projects?year=" + o.value,
        dataType: "json",
        type: "get",
        success: function(result) {
          that.projectIds = "";
          that.payItem = [];
          var projectIds = "";
          var Xitem = [];
          for (var i = 0; i < result.data.length; i++) {
            let obj = new Object();
            obj["name"] = result.data[i].name;
            obj["id"] = result.data[i].id;
            that.payItem.push(obj);
            projectIds = projectIds + result.data[i].id + ",";
            that.projectIds = that.projectIds + result.data[i].id + ",";
            Xitem.push(result.data[i].name);
          }
          sAjax({
            url:
              "/api/payment/stat" +
              "?projectIds=" +
              projectIds +
              "&collegeCode=" +
              that.collegeSelect,
            dataType: "json",
            type: "get",
            success: function(result) {
              // 遍历插入学院select;
              var hasPaymanNum = [];
              var notPayManNum = [];
              var hasPayMoney = [];
              var notPayMoney = [];
              for (var i = 0; i < result.data.items.length; i++) {
                hasPaymanNum.push(result.data.items[i].peopleCountPaid);
                notPayManNum.push(result.data.items[i].peopleCountNotPay);
                hasPayMoney.push(result.data.items[i].amountPaid);
                notPayMoney.push(result.data.items[i].amountNotPay);
              }
              that.updateEchart(
                Xitem,
                hasPaymanNum,
                notPayManNum,
                hasPayMoney,
                notPayMoney
              );
            }
          });
        }
      });
    },
    selectCollegeItem: function(o) {
      this.collegeCode = o.value;
      var that = this;
      this.selectSchoolYears = "";
      this.selectPayItems = "";
    },
    selectPayItem: function(o) {
      var that = this;
      if (o.val == "") {
        this.projectIds = this.projectIds1;
      } else {
        this.projectIds = o.value;
      }
      sAjax({
        url:
          "/api/payment/stat" +
          "?projectIds=" +
          this.projectIds +
          "&collegeCode=" +
          that.collegeCode,
        dataType: "json",
        type: "get",
        success: function(result) {
          // 遍历插入学院select;
          var hasPaymanNum = [];
          var notPayManNum = [];
          var hasPayMoney = [];
          var notPayMoney = [];
          var Xitem = [];
          for (var i = 0; i < result.data.items.length; i++) {
            hasPaymanNum.push(result.data.items[i].peopleCountPaid);
            notPayManNum.push(result.data.items[i].peopleCountNotPay);
            hasPayMoney.push(result.data.items[i].amountPaid);
            notPayMoney.push(result.data.items[i].amountNotPay);
            Xitem.push(result.data.items[i].projectName);
          }
          that.updateEchart(
            Xitem,
            hasPaymanNum,
            notPayManNum,
            hasPayMoney,
            notPayMoney
          );
        }
      });
    },
    appeartongji: function() {
      this.isheadPage = false;
    },
    _verifyLength: function() {
      var chineseLen = 0;
      var englishLen = 0;
      var index = 0;
      if (!this.newDepartRole.name) {
        return false;
      }
      for (var i = 0; i < this.newDepartRole.name.length; i++) {
        if (
          this.newDepartRole.name.charCodeAt(i) > 127 ||
          this.newDepartRole.name.charCodeAt(i) === 94
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
        this.newDepartRole.name = this.newDepartRole.name.slice(0, index + 1);
      }
    },
    changeDepartment: function(data) {
      this.currentDepartmentId = data.val;
      this.url =
        this.roleUrl +
        "?time=" +
        new Date().getTime() +
        "&departmentId=" +
        this.currentDepartmentId;
    },
    cancelAddRole: function() {
      this.newDepartRole = {
        id: "",
        name: "",
        departmentId: 0,
        level: "SCHOOL"
      };
      this.showUserModal = false;
    },
    addRoleModal: function() {
      if (this.projectIds == []) {
        this.$toast("请选中缴费项目");
      } else {
        window.location.href =
          "/downloads/payment/stat/export?collegeCode=" +
          this.collegeCode +
          "&projectIds=" +
          this.projectIds;
      }
    },
    reset: function() {
      this.selectSchoolYears = "";
      this.selectPayItems = "";
      this.collegeSelect = "";
    },
    changeLevel: function(data) {
      this.newDepartRole.level = data.val;
    },
    addRole: function() {
      var that = this;
      if (!this.newDepartRole.name) {
        return that.toast(this.translate.nameIsNull);
      }
      if (!this.newDepartRole.level) {
        return that.toast(this.translate.levelIsNull);
      }
      that.newDepartRole.departmentId = that.currentDepartmentId;
      if (this.newDepartRole.id) {
        if (!confirm(this.translate.editRoleConfirmTip)) {
          return false;
        }
        sAjax({
          url: "/api/approveRoles/" + that.newDepartRole.id,
          dataType: "json",
          data: that.newDepartRole,
          type: 'post',
          success: function(data) {
            if (data.state) {
              that.showUserModal = false;
              that.url =
                that.roleUrl +
                "?time=" +
                new Date().getTime() +
                "&departmentId=" +
                that.currentDepartmentId;
            } else {
              that.toast(data.message);
            }
          }
        });
      } else {
        if (!confirm(this.translate.addRoleConfirmTip)) {
          return false;
        }
        sAjax({
          url: "/api/approveRoles",
          dataType: "json",
          data: that.newDepartRole,
          type: "post",
          success: function(data) {
            if (data.state) {
              that.showUserModal = false;
              that.url =
                that.roleUrl +
                "?time=" +
                new Date().getTime() +
                "&departmentId=" +
                that.currentDepartmentId;
            } else {
              that.toast(data.message);
            }
          }
        });
      }
    }
  }
};
</script>
<style lang="less">
@import url("../../assets/common.less");
#collegeRole-page {
  .dropdown-toggle {
    box-shadow: none;
  }
  .addRole-btn {
    font-weight: 500;
    background: transparent;
    box-shadow: none;
    transition: all 0.2s ease;
    &:hover {
      color: #298df7;
    }
  }
  .modal-body {
    .user-no-input {
      width: 70%;
    }
  }
  .add {
    background: @-90ThemeColor;
    border: none;
    border-radius: 100px;
  }
  .search-input-group {
    margin: 5px 0 0 43px;
  }
  .levels-select .dropdown-menu {
    position: fixed;
    top: auto;
    left: auto;
  }
}
</style>
