<template>
  <div id="log" class="container-fluid">
    <div class="row text-center">
      <ul id="myTab" class="nav nav-tabs optLog-tab">
        <li
          :class="{active:isSelect == item.id}"
          v-for="(item, index) in tabs"
          :key="index"
          @click="changeTab(item)"
        >
          <a>{{translate.logList[item.id]}}</a>
        </li>
      </ul>
    </div>
    <div class="content row">
      <div v-show="curRoute === 'inOutChangeRecord'">
        <br>
        <div class="form-group col-md-4" v-for="(item, index) in dormitory.layout" :key="index">
          <label class="input-label">{{item.title}}</label>
          <v-select
            class="btn-block form-select-style"
            :multiple="true"
            :value="dormitory.defaultValue[item.id]"
            :options="dormitory.options[item.id]"
            options-value="value"
            options-label="label"
            @afterSelected="_optionsSelected($event, item)"
            search
          ></v-select>
        </div>
        <div class="form-group col-md-4">
          <label class="input-label">开始{{translate.time}}:</label>
          <v-datepicker
            class="btn-block form-datepicker-style"
            :clearButton="false"
            :showTime="false"
            v-model="editTime.inOutChangeStartTime"
            @daySelected="_dateSelected($event, 'inOutChangeStartTime')"
          ></v-datepicker>
          <!-- <label class="input-label">————————————</label> -->
        </div>
        <div class="form-group">
          <label class="input-label" style="margin-left:14px;">结束{{translate.time}}:</label>
          <v-datepicker
            class="btn-block form-datepicker-style"
            :clearButton="false"
            :showTime="false"
            v-model="editTime.inOutChangeEndTime"
            @daySelected="_dateSelected($event, 'inOutChangeEndTime')"
          ></v-datepicker>
          <button
            type="button"
            class="btn submit-btn clearBtnBorder"
            @click="_inOutChangeReset"
          >{{translate.reset}}</button>
          <button
            type="button"
            class="btn submit-btn clearBtnBorder"
            @click="_inOutChangeSearch"
          >{{translate.search}}</button>
        </div>
        <div class="form-group" style="padding-left:15px;">
          <label class="input-label">结果：入住</label>
          <label class="class-name-text">{{result.numberOfIn}}</label>
          <label class="input-label">人,退宿</label>
          <label class="class-name-text">{{result.numberOfOut}}</label>
          <label class="input-label">人,调宿</label>
          <label class="class-name-text">{{result.numberOfAccommodation}}</label>
          <label class="input-label">人</label>
        </div>
        <v-table
          :url="inOutChangeRecordUrl"
          pagesize="10"
          idField="id"
          :columns="inOutChangeRecordColumns"
          :order="true"
          :search="true"
          @columnExchanged="_columnExchanged"
          :key="1"
          ref="inOutChangeRecordTable"
        ></v-table>
      </div>
      <div v-show="curRoute === 'optRecord'">
        <br>
        <div class="form-group">
          <label class="input-label">&nbsp;&nbsp;&nbsp;&nbsp;{{translate.time}}:</label>
          <v-datepicker
            class="btn-block form-datepicker-style"
            :clearButton="false"
            :showTime="false"
            v-model="editTime.optStartTime"
            @daySelected="_dateSelected($event, 'optStartTime')"
          ></v-datepicker>
          <!-- <label class="input-label">————————————</label> -->
          <v-datepicker
            class="btn-block form-datepicker-style"
            :clearButton="false"
            :showTime="false"
            v-model="editTime.optEndTime"
            @daySelected="_dateSelected($event, 'optEndTime')"
          ></v-datepicker>
          <button
            type="button"
            class="btn submit-btn clearBtnBorder"
            @click="_optReset"
          >{{translate.reset}}</button>
          <button
            type="button"
            class="btn submit-btn clearBtnBorder"
            @click="_optSearch"
          >{{translate.search}}</button>
        </div>
        <v-table
          :url="optRecordUrl"
          pagesize="10"
          idField="id"
          :columns="optRecordColumns"
          :order="true"
          :search="true"
          @columnExchanged="_columnExchanged"
          :key="2"
          ref="optRecordTable"
        ></v-table>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import $ from "jquery";
import { translation, sAjax, createTime } from "../../assets/utils/utils.js";
export default {
  props: {
    account: {
      default: null
    }
  },
  created: function() {
    var la = localStorage.getItem("lang");
    if (translation(la)) {
      this.lang = la;
    }
    sAjax({
      url: "/api/apartment/dicts?typeName=校区",
      type: "get",
      success: data => {
        if (data.state) {
          data.data.forEach(ele => {
            this.dormitory.options.campus.push({
              label: ele.label,
              value: ele.value
            });
          });
        } else {
          this.toast(data.message);
        }
      }
    });
    this._initColumns();
  },
  data: function() {
    return {
      result: {
        numberOfAccommodation: "",
        numberOfIn: "",
        numberOfOut: ""
      },
      dormitory: {
        layout: [
          {
            title: "校区:",
            id: "campus"
          },
          {
            title: "园区:",
            id: "zone"
          },
          {
            title: "宿舍楼:",
            id: "building"
          }
        ],
        options: {
          campus: [],
          zone: [],
          building: []
        },
        defaultValue: {
          campus: "",
          zone: "",
          building: ""
        }
      },
      inOutChangeRecordUrl:
        "/table-data/apartment/in/out/accommodation/record/list",
      optRecordUrl: "/table-data/apartment/operation/record/list",
      columnsInOutChangeRecord: [],
      columnsOptRecord: [],
      optRecordColumns: [],
      inOutChangeRecordColumns: [],
      isSelect: "inOutChangeRecord",
      isShowPathNav: false,
      tabs: [
        { id: "inOutChangeRecord", label: "入退调记录" },
        { id: "optRecord", label: "操作记录" }
      ],
      curRoute: "inOutChangeRecord",
      searchSelectOptions: {
        operation: [
          { label: "入住", value: "CHECK_IN" },
          { label: "退宿", value: "RETIREMENT" },
          { label: "调宿", value: "ACCOMMODATION" }
        ],
        operatorType: [
          { label: "管理员", value: "APARTMENT_MANAGER" },
          { label: "学院", value: "COLLEGE" },
          { label: "学生", value: "STUDENT" }
        ]
      },
      isShowSearch: true,
      editTime: {
        inOutChangeStartTime: "",
        inOutChangeEndTime: "",
        optStartTime: "",
        optEndTime: ""
      },
      timeStamp: "",
      lang: "zh-cn"
    };
  },
  computed: {
    translate: function() {
      return translation(this.lang).log;
    }
  },
  methods: {
    _optionsSelected: function(obj, item) {
      this.dormitory.defaultValue[item.id] = obj.value;
      if (obj.value === "") {
      } else {
        if (item.id === "campus") {
          var arr = this.dormitory.defaultValue.campus.split(",");
          if (arr.length > 1) {
            this.dormitory.options.zone.splice(
              0,
              this.dormitory.options.zone.length
            );
            this.dormitory.options.building.splice(
              0,
              this.dormitory.options.building.length
            );
            this.dormitory.defaultValue.zone = "";
            this.dormitory.defaultValue.building = "";
          } else {
            this.$nextTick(() => {
              this._getZonesData(this.dormitory.defaultValue[item.id]);
            });
          }
        } else if (item.id === "zone") {
          var arr2 = this.dormitory.defaultValue.zone.split(",");
          if (arr2.length > 1) {
            this.dormitory.options.building.splice(
              0,
              this.dormitory.options.building.length
            );
            this.dormitory.defaultValue.building = "";
          } else {
            this.$nextTick(() => {
              this._getBuildingData(this.dormitory.defaultValue[item.id]);
            });
          }
        }
      }
    },
    _initColumns: function() {
      this.columnsInOutChangeRecord = [
        {
          id: "userNo",
          title: this.translate.userNo,
          width: 150,
          className: "text-left",
          hidden: false,
          search: {
            type: "input",
            data: {
              placeholer: "",
              autoFocus: false
            }
          }
        },
        {
          id: "name",
          title: this.translate.name,
          width: 80,
          className: "text-left",
          hidden: false,
          search: {
            type: "input",
            data: {
              placeholer: "",
              autoFocus: false
            }
          }
        },
        {
          id: "dormitory",
          title: this.translate.dormitory,
          width: 250,
          className: "text-left",
          hidden: false,
          formatter: record => {
            return (
              record.dormitory.campus +
              record.dormitory.zone +
              record.dormitory.buildName +
              "-" +
              record.dormitory.room
            );
          }
        },
        {
          id: "operation",
          title: this.translate.operation,
          width: 70,
          className: "text-left",
          hidden: false,
          search: {
            type: "multiSelect",
            data: {
              options: this.searchSelectOptions.operation,
              optionsLabel: "label",
              optionsValue: "value"
            }
          }
        },
        {
          id: "operatorType",
          title: this.translate.operatorType,
          width: 100,
          className: "text-left",
          hidden: false,
          search: {
            type: "multiSelect",
            data: {
              options: this.searchSelectOptions.operatorType,
              optionsLabel: "label",
              optionsValue: "value"
            }
          }
        },
        {
          id: "operatorUserNo",
          title: this.translate.operatorUserNo,
          width: 150,
          className: "text-left",
          hidden: false,
          search: {
            type: "input",
            data: {
              placeholer: "",
              autoFocus: false
            }
          }
        },
        {
          id: "operatorName",
          title: this.translate.operatorName,
          width: 80,
          className: "text-left",
          hidden: false,
          search: {
            type: "input",
            data: {
              placeholer: "",
              autoFocus: false
            }
          }
        },
        {
          id: "operationTime",
          title: this.translate.operationTime,
          width: 150,
          className: "text-left",
          hidden: false
        },
        {
          id: "ip",
          title: this.translate.ip,
          className: "text-left",
          width: 100,
          hidden: false,
          formatter: record => {
            this.result.numberOfAccommodation = record.numberOfAccommodation;
            this.result.numberOfIn = record.numberOfIn;
            this.result.numberOfOut = record.numberOfOut;
          }
        }
      ];
      this.columnsOptRecord = [
        {
          id: "operation",
          title: this.translate.operation,
          width: 300,
          className: "text-left",
          hidden: false
        },
        {
          id: "fileName",
          title: this.translate.fileName,
          width: 100,
          className: "text-left",
          hidden: false
        },
        {
          id: "operatorType",
          title: this.translate.operatorType,
          width: 100,
          className: "text-left",
          hidden: false,
          search: {
            type: "select",
            data: {
              options: this.searchSelectOptions.operatorType,
              optionsLabel: "label",
              optionsValue: "value"
            }
          }
        },
        {
          id: "userNo",
          title: this.translate.operatorUserNo,
          width: 150,
          className: "text-left",
          hidden: false,
          search: {
            type: "input",
            data: {
              placeholer: "",
              autoFocus: false
            }
          }
        },
        {
          id: "name",
          title: this.translate.operatorName,
          width: 80,
          className: "text-left",
          hidden: false,
          search: {
            type: "input",
            data: {
              placeholer: "",
              autoFocus: false
            }
          }
        },
        {
          id: "operationTime",
          title: this.translate.operationTime,
          width: 150,
          className: "text-left",
          hidden: false
        },
        {
          id: "ip",
          title: this.translate.ip,
          className: "text-left",
          width: 100,
          hidden: false,
          formatter: record => {
            this.result.numberOfAccommodation = record.numberOfAccommodation;
            this.result.numberOfIn = record.numberOfIn;
            this.result.numberOfOut = record.numberOfOut;
          }
        }
      ];
      if (this.isSelect === "inOutChangeRecord") {
        this.inOutChangeRecordColumns = this.columnsInOutChangeRecord;
      } else {
        this.optRecordColumns = this.columnsOptRecord;
      }
    },
    changeTab: function(obj) {
      this.isSelect = obj.id;
      this.curRoute = obj.id;
      this._initColumns();
    },
    _getZonesData: function(campusId) {
      sAjax({
        url: "/api/apartment/zones/getByCampuses/" + campusId,
        type: "get",
        success: data => {
          if (data.state) {
            this.dormitory.options.zone.splice(
              0,
              this.dormitory.options.zone.length
            );
            if (data.data) {
              data.data.forEach(ele => {
                this.dormitory.options.zone.push({
                  label: ele.name,
                  value: ele.zoneId.toString()
                });
              });
            }
          } else {
            this.$toast(data.message);
          }
        }
      });
    },
    _getBuildingData: function(zoneId) {
      sAjax({
        url: "/api/apartment/buildings/list/" + zoneId,
        type: "get",
        success: data => {
          if (data.state) {
            this.buildingData = data.data;
            this.dormitory.options.building.splice(
              0,
              this.dormitory.options.building.length
            );
            if (data.data) {
              data.data.forEach(ele => {
                this.dormitory.options.building.push({
                  label: ele.name,
                  value: ele.buildingId.toString()
                });
              });
            }
          } else {
            this.$toast(data.message);
          }
        }
      });
    },
    _dateSelected: function(obj, cell) {
      var inOutChangeStartTime = this.editTime.inOutChangeStartTime;
      var inOutChangeEndTime = this.editTime.inOutChangeEndTime;
      var optStartTime = this.editTime.optStartTime;
      var optEndTime = this.editTime.optEndTime;
      if (cell === "inOutChangeStartTime") {
        if (inOutChangeEndTime) {
          var timeString =
            new Date(obj.value).getTime() -
            new Date(inOutChangeEndTime).getTime();
          if (timeString > 0) {
            this.$nextTick(() => {
              this.toast("开始时间要在结束时间之前");
              this.editTime.inOutChangeStartTime = "";
            });
            return false;
          } else {
            this.editTime.inOutChangeStartTime = obj.value;
          }
        } else {
          this.editTime.inOutChangeStartTime = obj.value;
        }
      }
      if (cell === "inOutChangeEndTime") {
        if (inOutChangeStartTime) {
          var timeString =
            new Date(obj.value).getTime() -
            new Date(inOutChangeStartTime).getTime();
          if (timeString < 0) {
            this.$nextTick(() => {
              this.toast("结束时间要在开始时间之后");
              this.editTime.inOutChangeEndTime = "";
            });
            return false;
          } else {
            this.editTime.inOutChangeEndTime = obj.value;
          }
        } else {
          this.editTime.inOutChangeEndTime = obj.value;
        }
      }
      if (cell === "optStartTime") {
        if (optEndTime) {
          var timeString =
            new Date(obj.value).getTime() - new Date(optEndTime).getTime();
          if (timeString > 0) {
            this.$nextTick(() => {
              this.toast("开始时间要在结束时间之前");
              this.editTime.optStartTime = "";
            });
            return false;
          } else {
            this.editTime.optStartTime = obj.value;
          }
        } else {
          this.editTime.optStartTime = obj.value;
        }
      }
      if (cell === "optEndTime") {
        if (optStartTime) {
          var timeString =
            new Date(obj.value).getTime() - new Date(optStartTime).getTime();
          if (timeString < 0) {
            this.$nextTick(() => {
              this.toast("结束时间要在开始时间之后");
              this.editTime.optEndTime = "";
            });
            return false;
          } else {
            this.editTime.optEndTime = obj.value;
          }
        } else {
          this.editTime.optEndTime = obj.value;
        }
      }
    },
    _inOutChangeReset: function() {
      this.dormitory.defaultValue.campus = "";
      this.dormitory.defaultValue.zone = "";
      this.dormitory.defaultValue.building = "";
      this.editTime.inOutChangeEndTime = "";
      this.editTime.inOutChangeStartTime = "";
      this.dormitory.options.zone.splice(0, this.dormitory.options.zone.length);
      this.dormitory.options.building.splice(
        0,
        this.dormitory.options.building.length
      );
      this.inOutChangeRecordUrl =
        "/table-data/apartment/in/out/accommodation/record/list";
    },
    _inOutChangeSearch: function() {
      this.inOutChangeRecordUrl =
        "/table-data/apartment/in/out/accommodation/record/list?" +
        "campus=" +
        this.dormitory.defaultValue.campus +
        "&zone=" +
        this.dormitory.defaultValue.zone +
        "&building=" +
        this.dormitory.defaultValue.building +
        "&startTime=" +
        this.editTime.inOutChangeStartTime +
        "&endTime=" +
        this.editTime.inOutChangeEndTime;
    },
    _optReset: function() {
      this.editTime.optEndTime = "";
      this.editTime.optStartTime = "";
      this.optRecordUrl = "/table-data/apartment/operation/record/list";
    },
    _optSearch: function() {
      this.optRecordUrl =
        "/table-data/apartment/operation/record/list?" +
        "startTime=" +
        this.editTime.optStartTime +
        "&endTime=" +
        this.editTime.optEndTime;
    }
  }
};
</script>
<style lang="less">
@import url("../../assets/common.less");
#log {
  .input-label{
  width:100px;
  text-align: right
}
.form-group{
  padding-left:14px
}
  .optLog-tab {
    li {
      &.active {
        a {
          color: #298df7;
        }
      }
      a {
        color: rgba(0, 0, 0, 0.87);
      }
    }
  }
  .content {
    position: relative;
    background: white;
  }
}
</style>
