 <!--
  props: {
    //是否展示日期
     isShowDateOfDay: {
        default: true
      },
      //排班表类型：管理manage,新增add,查看check
      tableType: {
        default: null
      },
      //数据
      tableData: {
        default: null
      }
    },
    // 函数调用
    getWeekTime 获取周的日期
    editConsultant 编辑排班表
    addConsultant 新增排班表
 -->
<template>
  <div id="reserveTable">
    <div class="table-header">
      <slot name="header-select"></slot>
      <div class="week" v-if="isShowDateOfDay">
        <div class="week-lable">周</div>
        <div class="week-select">
          <i class="glyphicon glyphicon-menu-left week-before-icon" @click="lastWeek"></i>
          <i class="maticon week-icon" v-html="icons('event')" @click="changeDate($event)">event</i>
          <i class="glyphicon glyphicon-menu-right week-after-icon" @click="nextWeek"></i>
        </div>
      
      <div style="disply: inline-block;">
        <button type="button" class="btn table-btn clearBtnBorder" v-if="enableShowReservedPeople" @click="changeReservedPeopleVisibility">
          {{ reservedPeopleVisible ? '切换到排班视图' : '切换到人员视图' }}
        </button>
      </div>
      </div>
    </div>
    <div class="table-body">
      <slot name="body-slot"></slot>
      <div class="table-content">
        <div class="table-top">
          <div class="table-date" v-if="isShowDateOfDay">
            <div class="table-left-time">日期</div>
            <div class="date-day" v-for="(com, index) in dateOfday" :key="index">{{com}}</div>
          </div>
          <div class="table-date">
            <div class="table-left-time">时间段</div>
            <div v-for="(com, index) in weekData" :key="index">{{com}}</div>
          </div>
        </div>
        <GeminiScrollbar class="table-srcoll" :scrollX="false" v-if="newTableData.length > 0">
          <div
            class="table-info"
            v-for="(item, index) in newTableData"
            :key="index"
            v-if="tableType === 'add'"
          >
            <div class="table-time">{{item.timeQuantum}}</div>
            <div
              class="name-container black-font-color can-click"
              :class="[com.isChecked?'selected-bg-color':'', _isTableCellFull(com) ? 'full-bg-color': '',Object.keys(com.data).length == 0?'disabled':'']"

              v-for="(com, comIndex) in item.tableData"
              :key="comIndex"
              @click="_selectTabelCell(com)"
            >
                <div
                  class="one-name"
                  v-if="com.data&&com.data.dayTimeTeacher&&com.data.dayTimeTeacher.length === 0"
                ></div>
                <div
                  class="one-name"
                  v-else-if="com.data&&com.data.dayTimeTeacher&&com.data.dayTimeTeacher.length === 1"
                >
                  <div
                    :title="nameItem.user.teacherBaseInfo.name"
                    v-for="(nameItem, nameIndex) in com.data.dayTimeTeacher"
                    :key="nameIndex"
                  >{{nameItem.user.teacherBaseInfo.name}}</div>
                </div>
                <div
                  class="two-name"
                  v-else-if="com.data&&com.data.dayTimeTeacher&&com.data.dayTimeTeacher.length === 2"
                >
                  <div
                    :title="nameItem.user.teacherBaseInfo.name"
                    v-for="(nameItem, nameIndex) in com.data.dayTimeTeacher"
                    :key="nameIndex"
                  >{{nameItem.user.teacherBaseInfo.name }}</div>
                </div>
                <div class="other-name" v-else>
                  <div
                    :title="nameItem.user.teacherBaseInfo.name"
                    v-for="(nameItem, nameIndex) in com.data.dayTimeTeacher"
                    :key="nameIndex"
                  >{{nameItem.user.teacherBaseInfo.name }}</div>
                </div>
            </div>
          </div>
          <div class="table-info" v-else>
            <div class="table-time">{{item.timeQuantum}}</div>
            <div
              class="name-container black-font-color"
              :class="[..._getTableCellBg(com), tableType === 'check' ? '': 'can-click',Object.keys(com.data).length == 0?'disabled':'']"
              v-for="(com, comIndex) in item.tableData"
              :key="comIndex"
              @click="_editConsultant(com,'click')"
              v-if="com.data&&com.data.id"
            >
              <GeminiScrollbar style="height: 100%;" :scrollX="false" v-if="reservedPeopleVisible">
                <div
                  v-for="(nameItem, nameIndex) in com.data.dayTimeTeacher"
                  :key="nameIndex"
                  class="teacher-student-name"
                  :class="{ 'is-reserved': !!nameItem.studentUserId }"
                  @click="_showReservation(nameItem)"
                  >
                    <span :title="nameItem.user.teacherBaseInfo.name">{{nameItem.user.teacherBaseInfo.name}}</span>
                    <span :title="nameItem.studentName || '-'">{{nameItem.studentName || ''}}</span>
                </div>
              </GeminiScrollbar>
              <div v-else>
                <div
                  class="one-name"
                  v-if="com.data&&com.data.dayTimeTeacher&&com.data.dayTimeTeacher.length === 0"
                ></div>
                <div
                  class="one-name"
                  v-else-if="com.data&&com.data.dayTimeTeacher&&com.data.dayTimeTeacher.length === 1"
                >
                  <div
                    :title="nameItem.user.teacherBaseInfo.name"
                    v-for="(nameItem, nameIndex) in com.data.dayTimeTeacher"
                    :class="{'isVisual': !nameItem.isVisual}"
                    :key="nameIndex"
                  >{{nameItem.user.teacherBaseInfo.name}}</div>
                </div>
                <div
                  class="two-name"
                  v-else-if="com.data&&com.data.dayTimeTeacher&&com.data.dayTimeTeacher.length === 2"
                >
                  <div
                    :title="nameItem.user.teacherBaseInfo.name"
                    v-for="(nameItem, nameIndex) in com.data.dayTimeTeacher"
                    :class="{'isVisual': !nameItem.isVisual}"
                    :key="nameIndex"
                  >{{nameItem.user.teacherBaseInfo.name}}</div>
                </div>
                <div class="other-name" v-else>
                  <div
                    :title="nameItem.user.teacherBaseInfo.name"
                    v-for="(nameItem, nameIndex) in com.data.dayTimeTeacher"
                    :class="{'isVisual': !nameItem.isVisual}"
                    :key="nameIndex"
                  >{{nameItem.user.teacherBaseInfo.name}}</div>
                </div>
              </div>
            </div>
            <div
              class="name-container white-font-color"
              @click="_editConsultant(com, 'disabled')"
              v-else
            >
              <div class="other-name"></div>
            </div>
          </div>
        </GeminiScrollbar>
        <div class="loading" v-else>{{loadingText}}</div>
        <div class="clear"></div>
      </div>
    </div>
  </div>
</template>
<script>
import $ from "jquery";
import Vue from "vue";
import { sAjax, translation } from "../../../assets/utils/utils.js";
export default {
  props: {
    isShowDateOfDay: {
      default: true
    },
    tableType: {
      default: null
    },
    tableData: {
      default: null
    },
    timeQuantumArray: {
      default: null
    },
    isChangeDate: {
        default: null
    },
    dataType: {
      default: null
    },
    consultantId: {
      default: null
    },
    studentId: {
      default: null
    },
    enableShowReservedPeople: {
      type: Boolean
    }
  },
  data: function() {
    return {
      weekData: [
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
        "星期日"
      ],
      dayOfWeek: [1, 2, 3, 4, 5, 6, 7],
      tableCells: [],
      dateOfday: [],
      weekStartTime: "",
      weekEndTime: "",
      currentFirstDate: "",
      dateStart: "",
      dateEnd: "",
      newTableData: [],
      selectedTabelCells: [],
      curSelectedDate: "",
      loadingText: "数据加载中~",
      reservedPeopleVisible: false
    };
  },
  watch: {
    timeQuantumArray: {
      deep: true,
      handler: function() {
        this._initData();
      }
    },
    tableData: {
      deep: true,
      handler: function() {
        this._initData();
      }
    }
  },
  created: function() {
    if(this.isChangeDate) {
      this.setDate(new Date(this.isChangeDate));
      this.isChangeDate = null
    }else {
      this.setDate(new Date());
    }
      
    
    if (this.dataType === "setting") {
      this._initData();
    } else {
      if (this.newTableData.length === 0) {
        this._initData();
      }
    }
  },
  methods: {
    _initData: function() {
      this.loadingText = "数据加载中~";
      this.newTableData = [];
      this.tableCells = [];
      for (var i in this.timeQuantumArray) {
        this.newTableData.push({
          timeQuantum: this.timeQuantumArray[i].timeQuantum,
          tableData: []
        });
        for (var j in this.dayOfWeek) {
          this.tableCells.push({
            tablex: this.dayOfWeek[j],
            tabley: this.timeQuantumArray[i].timeQuantum,
            timeSettingId: this.timeQuantumArray[i].id,
            isChecked: false,
            data: {}
          });
        }
      }
      if (this.dataType === "setting") {
        for (var i in this.tableCells) {
          Vue.set(this.tableCells[i].data, "dayTimeTeacher", []);
          Vue.set(this.tableCells[i].data, "dayOfWeek", null);
          Vue.set(this.tableCells[i].data, "timeSetting", {});
          // Vue.set(this.tableCells[i].data, "dateTime", );
          for (var j in this.tableData) {
            var timeQuantum =
              this.tableData[j].timeSetting.timeQuantumStart +
              "-" +
              this.tableData[j].timeSetting.timeQuantumEnd;
            if (
              this.tableData[j].dayOfWeek === this.tableCells[i].tablex &&
              timeQuantum === this.tableCells[i].tabley
            ) {
              this.tableCells[i].data.dayTimeTeacher.push(this.tableData[j]);
              this.tableCells[i].data.dayOfWeek = this.tableData[j].dayOfWeek;
              this.tableCells[i].data.timeSetting = this.tableData[
                j
              ].timeSetting;
              
            }
          }
        }
      } else {
        
        for (var i in this.tableData) {
          for (var j in this.tableCells) {
            if (
              this.tableData[i].dayOfWeek === this.tableCells[j].tablex &&
              this.tableData[i].timeQuantum === this.tableCells[j].tabley
            ) {
              this.tableCells[j].data = this.tableData[i];
            }
          }
        }
      }
      for (var i in this.newTableData) {
        for (var j in this.tableCells) {
          if (this.newTableData[i].timeQuantum === this.tableCells[j].tabley) {
            this.newTableData[i].tableData.push(this.tableCells[j]);
          }
        }
      }
        //  for (var i in this.tableCells) {
        //   Vue.set(this.tableCells[i].data, "dayTimeTeacher",[1,2,3]);
        //  }
      if (this.newTableData.length === 0) {
        this.loadingText = "暂无排班~";
      } else {
        this.loadingText = "";
      }
    },
    _selectTabelCell: function(data) {
      const {dateTime} = data.data
     if(!dateTime) return this.$toast('当前日期未有该时段的排班')
      
      if (!this.consultantId) {
        return this.$toast("请先检索咨询师");
      }
       if(new Date(dateTime).getTime() < new Date().getTime()) {
         return this.$toast("只能选取当天之后的时间");
       }
      if (this.dataType === "addPersonnel") {
        if (!this.studentId) {
          return this.$toast("请先检索学生");
        }
        if (
          data.data.dayTimeTeacher.length > 0 &&
          data.data.dayTimeTeacher[0].isReserved
        ) {
          return this.$toast("预约已满");
        }
      }
      data.isChecked = !data.isChecked;
      if (data.isChecked) {
        this.selectedTabelCells.push(data);
      } else {
        this.selectedTabelCells.forEach((ele, index) => {
          if (ele.tablex === data.tablex && ele.tabley === data.tabley) {
            this.selectedTabelCells.splice(index, 1);
          }
        });
      }
      this.$emit("selectTabelCell", this.selectedTabelCells);
    },
    _editConsultant: function(data, type) {
      if (this.tableType === "check" || type === "disabled") {
        return;
      }
      if (this.reservedPeopleVisible) {
        return;
      } else {
      const {dateTime} = data.data
      if(!dateTime) return this.$toast('当前日期未有该时段的排班')
      if(new Date(dateTime).getTime() < new Date().getTime()) {
         return this.$toast("只能选取当天之后的时间");
       }
        this.$emit("editConsultant", data);
      }
    },
    _showReservation(data) {
      if (data.studentUserId) {
        this.$emit('showReservation', data);
      }
    },
    _isTableCellFull(data) {
      if (!data.data) {
        return false;
      }
      if (!data.data.dayTimeTeacher) {
        return false;
      }
      return data.data.dayTimeTeacher.length > 0 && data.data.dayTimeTeacher[0].isReserved;
    },
    changeDate: function(event) {
      var ev = window.event || event;
      setTimeout(() => {
        this.$date({
          dateFormat: "yyyy-MM-dd",
          value: this.curSelectedDate || "",
          type: "init",
          event: ev,
          onSelect: value => {
            this._daySelectedOfValue({
              value: value
            });
          }
        });
      }, 100);
    },
    _daySelectedOfValue: function(obj) {
      this.curSelectedDate = obj.value;
      this.dateOfday = [];
      this.setDate(this._parserDate(obj.value));
    },
    _parserDate: function(date) {
      var t = Date.parse(date);
      if (!isNaN(t)) {
        return new Date(Date.parse(date.replace(/-/g, "/")));
      } else {
        return new Date();
      }
    },
    lastWeek: function() {
      this.dateOfday = [];
      this.setDate(this.addDate(this.currentFirstDate, -7));
    },
    nextWeek: function() {
      this.dateOfday = [];
      this.setDate(this.addDate(this.currentFirstDate, 7));
    },
    addDate: function(date, n) {
      date.setDate(date.getDate() + n);
      return date;
    },
    setDate: function(date) {
      var week = date.getDay() - 1;
      date = this.addDate(date, week * -1);
      this.currentFirstDate = new Date(date);
      for (var i = 0; i < this.weekData.length; i++) {
        var day = this.getWeekDay(i == 0 ? date : this.addDate(date, 1), i);
        if (day < 10) {
          day = "0" + day;
        }
        this.dateOfday.push(day);
      }
      if (this.weekStartTime && this.weekEndTime) {
        this.$emit("getWeekTime", {
          weekStartTime: this.weekStartTime,
          weekEndTime: this.weekEndTime,
          dateStart: this.dateStart,
          dateEnd: this.dateEnd
        });
      }
    },
    _getTableCellBg: function(data) {
      const classes = [];
      if (data.data && data.data.timeSetting) {
        var num = data.data.timeSetting.timeQuantumStart.split(":")[0];
        if (parseInt(num) < 12 && data.data.dayTimeTeacher.length > 0) {
          classes.push('morning-bg-color');
        }
        if (parseInt(num) >= 12 && data.data.dayTimeTeacher.length > 0) {
          classes.push('afternoon-bg-color');
        }
      }
      if (data.data && data.data.dayTimeTeacher && data.data.dayTimeTeacher.length) {
        for (const dayTimeTeacher of data.data.dayTimeTeacher) {
          if (!dayTimeTeacher.isVisual) {
            // classes.push('student-invisible');
            break;
          }
        }
      }
      return classes;
    },
    changeReservedPeopleVisibility() {
      this.reservedPeopleVisible = !this.reservedPeopleVisible;
      this.$emit('reservedPeopleVisibilityChange', this.reservedPeopleVisible);
    },
    getWeekDay: function(date, i) {
      var weekDay = date.getDate();
      if (i === 0 || i === 6) {
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        if (month <= 9) {
          month = "0" + month;
        }
        var day = date.getDate();
        if (day <= 9) {
          day = "0" + day;
        }
        if (i === 0) {
          this.weekStartTime = year + "年" + month + "月" + day + "日";
          this.dateStart = year + "-" + month + "-" + day;
        } else {
          this.weekEndTime = year + "年" + month + "月" + day + "日";
          this.dateEnd = year + "-" + month + "-" + day;
        }
      }
      return weekDay;
    }
  }
};
</script>
<style lang="less">
// @import url("../../../assets/common.less");
#reserveTable {
  // padding: 54px 40px 0 40px;
  width: 100%;
  font-family: PingFangSC-Medium;
  .loading {
    text-align: center;
    font-size: 16px;
    padding: 200px 0;
    color: rgba(0, 0, 0, 0.54);
  }
  .table-content .table-info{
    .name-container{
      &.selected-bg-color {
        background: rgba(186, 221, 254, 0.58);
        color: rgba(71, 144, 220, 0.9);
      }
      &.full-bg-color {
        color: #ddd;
      }
      &.disabled {
        cursor:not-allowed!important;
        // pointer-events:none;
      }
    }
  }
  .white-font-color {
    color: #ffffff;
  }
  .black-font-color {
    color: #303133;
  }


  .timeQuantum {
    width: 12.5%;
    vertical-align: middle;
    text-align: center;
    border-left: 2px solid #f5f5f5;
    border-top: 2px solid #f5f5f5;
    padding: 13px 0;
    font-size: 15px;
    color: rgba(0, 0, 0, 0.54);
    clear: both;
  }
  .table-header {
    position: relative;
    background: #f6f8f8;
    height: 100px;
    .week {
      display: inline-block;
      padding: 8px 0;
      position: absolute;
      right: 20px;
      top: 0;
      margin-left: 16px;
      .week-lable {
        font-size: 15px;
        color: #494747;
        padding: 6px 12px;
        margin-right: 6px;
        display: inline-block;
      }
      .week-select {
        display: inline-block;
        vertical-align: bottom;
        .week-before-icon,
        .week-after-icon {
          color: #919191;
          vertical-align: top;
          margin-top: 4px;
          padding: 5px 7px;
          cursor: pointer;
        }
        .week-icon {
          border-left: 1px solid#ECECEC;
          border-right: 1px solid#ECECEC;
          color: #298df7;
          padding: 5px 7px;
          cursor: pointer;
        }
      }
    }
  }
  .table-top {
    width: 100%;
  }
  .table-srcoll {
    height: 430px;
    width: 100%;
  }
  .table-content {
    width: 100%;
    height: auto;
    // border-left: 2px solid #f5f5f5;
    // border-right: 2px solid #f5f5f5;
    border-top: 2px solid #f5f5f5;
    .table-date {
      width: 100%;
      height: auto;
      div {
        width: 12.5%;
        float: left;
        vertical-align: middle;
        text-align: center;
        border-right: 2px solid #f5f5f5;
        border-bottom: 2px solid #f5f5f5;
        padding: 13px 0;
        font-size: 15px;
        color: rgba(0, 0, 0, 0.54);
        &.table-left-time {
          border-left: 2px solid #f5f5f5;
        }
        &.date-day {
          color: #298df7;
        }
      }
    }
    .table-info {
      width: 100%;
      height: auto;
      .table-time {
        width: 12.5%;
        float: left;
        vertical-align: middle;
        text-align: center;
        border-bottom: 2px solid #f5f5f5;
        border-left: 2px solid #f5f5f5;
        border-right: 2px solid #f5f5f5;
        font-size: 18px;
        color: #222222;
        height: 103px;
        padding-top: 38px;
      }
      .name-container {
        width: 12.5%;
        float: left;
        vertical-align: middle;
        text-align: center;
        border-right: 2px solid #f5f5f5;
        border-bottom: 2px solid #f5f5f5;
        height: 104px;
        background: white;
        overflow: overlay;
        &.morning-bg-color {
        }
        &.afternoon-bg-color {
        }
        &.student-invisible {
          color: #909399;
        }
        & .isVisual {
          color: #909399!important;
        }
        &.can-click {
          cursor: pointer;
        }
        .teacher-student-name {
          height: 34px;
          background: white;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0 10px;
          border-bottom: 1px solid white;
          color: #303133;
          cursor: default;
          span {
            width: 48%;
            text-align: center;
            &:first-child {
              text-align: left;
              margin-right: 4%;
            }
          }
          &.is-reserved {
            background: #ECF7FF;
            cursor: pointer;
            span:first-child {
              font-weight: bold;
            }
            span:last-child {
              text-align: left;
            }
          }
          &:last-child {
            border-bottom: none;
          }
        }
        .one-name {
          font-size: 18px;
          padding-top: 39px;
        }
        .two-name {
          div {
            font-size: 18px;
            margin-top: 19px;
            margin-bottom: -4px;
          }
        }
        .other-name {
          text-align: left;
          div {
            font-size: 15px;
            display: inline-block;
            margin-top: 18px;
            margin-left: 10px;
            overflow: hidden; /*超出部分隐藏*/
            white-space: nowrap; /*不换行*/
            text-overflow: ellipsis; /*超出部分文字以...显示*/
            width: 50px;
          }
        }
      }
    }
  }
  .clear {
    clear: both;
  }
  .actions {
    display: inline-block;
    // float: right;
    font-size: 14px;
    // padding: 12px 12px 0;
    button {
      font-size: 15px;
    }
  }
}
</style>
