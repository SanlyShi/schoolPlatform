<template>
  <div id="my-scheduling" class="container">
    <div class="scheduling-manage">
     <c-reserveTable
      :tableData="schedulingData"
      :isShowDateOfDay="true"
      tableType="check"
      @getWeekTime="_getWeekTime"
      :timeQuantumArray="timeQuantumArray"
      @editConsultant="_editConsultant">
      <div slot="header-select" class="campus-select">
        <!-- <div class="select-radio" v-if="schoolData.length > 0">
          <label class="radio-text">校区</label>
          <span></span>
          <div class="radio-area" >
            <div v-for="(col,k) in schoolData" :key="k">
              <input type="radio" id="col.id"  :value="col.value" v-model="selectCampus">
              <label class="campus-name" for="col.id">{{col.label}}</label>
            </div>
          </div>
        </div> -->
        <div class="select-radio" v-if="schoolData.length > 0">
          <!-- <label class="radio-text">校区</label> -->
           <el-radio @change="switchType" v-model="schedulingType" label="RESERVATION">线下咨询</el-radio>
          <span></span>
          <div class="info-options" v-show="schedulingType == 'RESERVATION'">
            <div v-for="(col,k) in schoolData" :key="k" style="display: inline-block;">
              <input style="margin: 0;" type="radio" id="col.id"  :value="col.value" v-model="selectCampus">
              <label class="campus-name" for="col.id">{{col.label}}</label>
            </div>
            <!-- <span class="" v-for="(opt, i) in schoolData" :key="i" @click="_selectCampus(opt)">
              <i class="maticon" :class="selectCampus === opt.value?'active':''" v-html="icons(selectCampus === opt.value?'radio_button_checked':'radio_button_unchecked')"></i>{{opt.label}}
            </span> -->
          </div>
        </div>
        <div class="select-radio">
          <el-radio @change="switchType"  style="display: block;" v-model="schedulingType" label="ONLINE">网上咨询</el-radio>
        </div>
        <!-- <div class="select-radio" style="margin-left: 19px" v-if="isShowSchedulingType">
          <label class="radio-text">排班类型</label>
          <span></span>
          <div class="radio-area">
            <div v-for="(col,k) in schedulingTypeData" :key="k">
              <input type="radio" id="col.id"  :value="col.id" v-model="schedulingType">
              <label class="campus-name" for="col.id">{{col.label}}</label>
            </div>
          </div>
        </div> -->
      </div>
      <div slot="body-slot" class="body-slot">
        <div class="pull-left">
          <span class="time-tips">{{weekTime.weekStartTime}}-{{weekTime.weekEndTime}} 排班表</span>
          <span>
            <span class="show-schedule-color"> </span>
            <span class="show-schedule-name">排班对学生可见</span>
          </span>
           <span>
            <span class="hide-schedule-color"> </span>
            <span class="hide-schedule-name">排班对学生隐藏</span>
          </span>
        </div>
      </div>
     </c-reserveTable>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { translation, sAjax, createTime } from '../../assets/utils/utils.js'
  import CreserveTable from './components/reserveTable.vue'
  Vue.component('c-reserveTable', CreserveTable)
  export default {
    data: function () {
      return {
        showEditModal: false,
        showSettingModal: false,
        weekTime: {},
        schoolData: [],
        selectCampus: '',
        schedulingType: 'RESERVATION',
        isShowSchedulingType: false,
        isUpdateNext: false,
        consultantArr: [],
        settingData: {
          schedulingId: '',
          startTime: '',
          endTime: '',
          timeList: [{
            timeId: 'timeId',
            timeQuantumStart: '',
            timeQuantumEnd: ''
          }]
        },
        schedulingSettingType: 'add',
        schedulingTypeData: [{ id: 'RESERVATION', label: '预约' }, { id: 'ARRANGE_TALKS', label: '首次访谈' }],
        consultantId: '',
        schedulingData: [],
        selectedTabelCells: [],
        tableData: [],
        timeQuantumArray: [],
        consultantInfoArr: [],
        dataTimeId: '',
        changeDate: '',
        lang: 'zh-cn'
      }
    },
    computed: {
      translate: function () {
        return translation(this.lang).employmentUnitManage
      }
    },
    watch: {
      selectCampus: {
        deep: true,
        handler: function () {
          this._initTableData(this.weekTime)
        }
      },
      schedulingType: {
        deep: true,
        handler: function () {
          this._initTableData(this.weekTime)
        }
      }
    },
    created: function () {
      var la = localStorage.getItem('lang')
      if (translation(la)) {
        this.lang = la
      }
      sAjax({
        url: '/api/mentality/scheduling/campus',
        dataType: 'json',
        type: 'get',
        success: (data) => {
          if (data.state) {
            this.schoolData = data.data
            this.selectCampus = data.data[0].value
          } else {
            this.$toast(data.message)
          }
        }
      })
      sAjax({
        url: '/api/mentality/config',
        dataType: 'json',
        type: 'get',
        success: (data) => {
          if (data.state) {
            if (data.data) {
              this.isShowSchedulingType = data.data.interviewFirst
            }
          } else {
            this.$toast(data.message)
          }
        }
      })

      this._getWeekTime()
    },
    methods: {
      _getWeekTime: function (data) {
        if (data) {
          this.weekTime = data
          if (this.selectCampus) {
            this._initTableData(data)
          }
        }
      },
      _initTableData: function (data) {
        sAjax({
          url: '/api/mentality/scheduling/teachers/page/week?campus=' + this.selectCampus + '&type=' + this.schedulingType + '&dateStart=' + data.dateStart + '&dateEnd=' + data.dateEnd,
          dataType: 'json',
          type: 'get',
          success: (data) => {
            if (data.state) {
              if (data.data && data.data.length > 0) {
                this.schedulingData = data.data
                this.timeQuantumArray = []
                if (data.data[0].setting) {
                  for (var k in data.data[0].setting.timeSetting) {
                    var timeQuantum = data.data[0].setting.timeSetting[k]
                     this.timeQuantumArray.push({
                      id: timeQuantum.id,
                      timeQuantum: timeQuantum.timeQuantumStart + '-' + timeQuantum.timeQuantumEnd
                    })
                  }
                }
              } else {
                this.schedulingData = []
                this.timeQuantumArray = []
              }
            } else {
              this.$toast(data.message)
            }
          }
        })
        sAjax({
          url: '/api/mentality/scheduling/timeSettings/thisWeek?type=' + this.schedulingType + '&campus=' + this.selectCampus + '&dateStart=' + data.dateStart + '&dateEnd=' + data.dateEnd,
          dataType: 'json',
          type: 'get',
          success: (data) => {
            if (data.state) {
              if (data.data && data.data.length > 0) {
                this.timeQuantumArray = []
                for (var k in data.data) {
                  var timeQuantum = data.data[k]
                  this.timeQuantumArray.push({
                    id: timeQuantum.id,
                    timeQuantum: timeQuantum.timeQuantumStart + '-' + timeQuantum.timeQuantumEnd
                  })
                }
              } else {
                this.timeQuantumArray = []
              }
            } else {
              this.$toast(data.message)
            }
          }
        })
      }
    }
  }
</script>
<style lang="less">
@import url("../../assets/common.less");
#my-scheduling {
  height: 100%;
  margin: 24px auto;
  padding: 0;
  background: #fff;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
  font-family: PingFangSC-Medium;
  overflow-x: hidden;
  overflow-y: auto;
  .scheduling-manage {
    padding: 24px 85px;
  }
  .campus-select {
    display: inline-block;
    margin-left: 15px;
    .select-radio {
      display: flex;
      background: #ffffff;
      padding: 7px 10px 2px;
    }
    .radio-text {
      font-size: 15px;
      color: #494747;
      line-height: 16px;
      padding-right: 7px;
      border-right: 1px solid #ececec;
    }
    .radio-area {
      display: inline-block;
      div {
        display: inline-block;
        margin-left: 9px;
        cursor: pointer;
        .campus-name {
          font-size: 13px;
          color: rgba(0, 0, 0, 0.87);
        }
      }
    }
  }
  .body-slot {
    background: #f6f8f8;
    height: 50px;
    .time-tips {
      font-size: 15px;
      color: #3e3e3e;
      margin: 15px 10px 0 16px;
      display: inline-block;
    }
    .show-schedule-color,
    .hide-schedule-color {
      width: 20px;
      height: 20px;
      display: inline-block;
      vertical-align: bottom;
      margin-left: 9px;
    }
    .show-schedule-name,
    .hide-schedule-name {
      font-size: 15px;
      color: #3e3e3e;
    }
    .show-schedule-color {
      background: #303133;
    }
    .hide-schedule-color {
      background: #909399;
    }
    .btn-group {
      color: #298df7;
      margin-right: 5px;
      button {
        font-size: 15px;
        background: transparent;
        margin-top: 8px;
        &.add-btn {
          margin-left: -4px;
        }
        .add-icon {
          font-size: 18px;
        }
      }
    }
  }
  .addScheduling-header {
    height: 87px;
    border-bottom: 1px solid #d9d9d9;
    .addScheduling-back {
      cursor: pointer;
      margin-top: 30px;
      margin-left: 53px;
      .back-title {
        display: inline-block;
        font-size: 16px;
        margin-top: 1px;
        margin-left: 16px;
      }
    }
    .search-user {
      float: left;
      margin-left: 50px;
      margin-top: 22px;
      input {
        background: #f5f5f5;
        border-radius: 20px;
        width: 773px;
        height: 40px;
      }
    }
  }
  .addScheduling-content {
    padding: 48px 60px;
    .tips {
      margin-top: 15px;
      color: #f06c6c;
      font-size: 14px;
    }
  }
  .psychological-footer {
    position: absolute;
    z-index: 100;
    bottom: 30px;
    left: 48%;
    .sumbit-btn {
      border-radius: 27.5px;
      font-size: 16px;
      color: #ffffff;
      background: #298df7;
    }
  }
  .modal-search-user {
    margin-left: 27px;
  }
  .modal-body {
    .consultant-name-list {
      padding: 16px 27px;
      .consultant-name {
        border: 1px solid #d9d9d9;
        border-radius: 3px;
        font-size: 15px;
        color: #333333;
        display: inline-block;
        position: relative;
        padding: 6px 16px;
        margin-right: 12px;
        margin-bottom: 10px;
        cursor: pointer;
        i {
          font-size: 11px;
          color: #9a9a9a;
          position: absolute;
          right: 0;
        }
      }
    }
    .modify-scheduling-options {
      display: inline-block;
      margin-left: 27px;
      i {
        font-size: 22px;
        color: #d9d9d9;
        transition: all 0.3s ease;
        cursor: pointer;
        &.active {
          color: #298df7;
        }
      }
      .icon-title {
        font-size: 14px;
        color: #333333;
        display: inline-block;
        margin-top: 2px;
        vertical-align: top;
      }
    }
  }
  .setting-modal-body {
    padding: 29px 0;
    max-height: 500px;
    overflow-x: hidden;
    overflow-y: auto;
    .form-list {
      .star {
        color: red;
      }
      .time-picker {
        width: 200px;
        display: inline-block;
        margin-left: 9px;
        .form-control.v-datepicker-input {
          border: 1px solid #d9d9d9;
          border-radius: 3px;
        }
        .v-datepicker-icon {
          margin-right: 10px;
          margin-top: 2px;
        }
      }
      .form-input {
        border: 1px solid #d9d9d9;
        border-radius: 3px;
        width: 200px;
        font-size: 14px;
        display: inline-block;
        margin-left: 9px;
        &:focus {
          box-shadow: none;
          outline: none;
        }
      }
      .marginLeft45px {
        margin-left: 45px;
        margin-bottom: 22px;
      }
      .marginLeft75px {
        margin-left: 75px;
        margin-bottom: 22px;
      }
      .time-list {
        padding-top: 16px;
        border-top: 1px solid #e0e0e0;
        position: relative;
        .delete-btn {
          position: absolute;
          right: 16px;
          top: 21px;
          font-size: 14px;
          color: #298df7;
          cursor: pointer;
        }
      }
      .add-time-btn {
        margin-left: 151px;
        button {
          border: 1px solid #298df7;
          border-radius: 3px;
          font-size: 15px;
          color: #298df7;
          &:active,
          &:focus {
            outline: none !important;
            box-shadow: none !important;
          }
          i {
            font-size: 15px;
            margin-top: 2px;
          }
        }
      }
    }
    .tips {
      margin-top: 26px;
      margin-left: 16px;
      color: #f06c6c;
      font-size: 14px;
    }
  }
}
</style>
