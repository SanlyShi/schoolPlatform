<template>
  <v-modal :show="signData.show" effect="fade" width="500">
    <div slot="modal-header" class="modal-header">
      <h5 class="modal-title">{{ title }}</h5>
    </div>
    <div slot="modal-body" class="modal-body modal-full-width container-fluid new-sign-modal-body">
      <div class="signType data-wrap" v-if="checkInType == 'loop'">
        <v-select
          :disabled="title == '编辑签到'"
          v-model="selectType"
          required
          style="width: 50%;"
          :options="typeList"
          optionsLabel="text"
          optionsValue="id"
          class="seleced_role"
          placeholder="请选择签到类型"
        ></v-select>
      </div>
      <div class="form-group data-wrap">
        <input
          type="text"
          class="form-control"
          v-model="signData.name"
          :maxlength="signData.maxLength"
          :placeholder="i18n.addSignPlaceholder"
        />
      </div>
      <!-- i签到或者单次签到 -->
      <div v-if="checkInType == 'single' || signData.needOut">
        <div v-if="!signData.needOut" class="form-group data-wrap box_flex box_center">
          <v-datepicker
            ref="startTime"
            class="btn-block time-picker"
            :value="signData.startTime"
            :format="signData.dateFormat"
            :placeholder="i18n.signStartPlaceholder"
            :clearButton="false"
            @daySelected="signStartSelected"
          ></v-datepicker>
          <div class="date_center">至</div>
          <v-datepicker
            ref="endTime"
            class="btn-block time-picker"
            :value="signData.endTime"
            :format="signData.dateFormat"
            :placeholder="i18n.signEndPlaceholder"
            :clearButton="false"
            @daySelected="signEndSelected"
          ></v-datepicker>
        </div>
        <div v-else class="box_flex flex_center data-wrap date_picker_wrap">
          <el-date-picker
            style="width:100%;"
            :picker-options="pickOptions"
            :disabled="new Date(signData.startTime)<new Date()"
            v-model="dateArea"
            value-format="yyyy-MM-dd HH:mm:ss"
            :clearable="false"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </div>
      </div>
      <!-- 考勤签到（多次） -->
      <div v-else>
        <div v-if="selectType == 'day'">
          <div class="form-group data-wrap box_flex box_center">
            <v-datepicker
              ref="startTime"
              :beforeSelect="beforeStartTimeStartSelect"
              :value="signData.startTime"
              @daySelected="signStartSelected"
              format="yyyy-MM-dd"
              class="btn-block time-picker"
              :clearButton="false"
            ></v-datepicker>
            <div class="date_center">至</div>
            <v-datepicker
              ref="startTime"
              :beforeSelect="beforeEndTimeStartSelect"
              :value="signData.endTime"
              @daySelected="signEndSelected"
              format="yyyy-MM-dd"
              class="btn-block time-picker"
              :clearButton="false"
            ></v-datepicker>
          </div>
          <div class="notice">
            <i class="el-icon-warning"></i>
            <span>开始日期和结束日期必须大于当日</span>
          </div>
          <div class="form-group data-wrap box_flex box_center my-elwrap">
            <el-time-select
              style="width: 30%;"
              @change="dateChange_day(signData.startTimeToHours,'start')"
              :picker-options="{ start: '06:00',step: '00:15',end:'24:00',maxTime:signData.endTimeToHours}"
              placeholder="起始时间"
              v-model="signData.startTimeToHours"
              value-format="HH:mm:ss"
            ></el-time-select>
            <el-time-select
              style="width: 30%;"
              @change="dateChange_day(signData.endTimeToHours,'end')"
              :picker-options="{ start: '06:00',step: '00:15',end:'24:00',minTime:signData.startTimeToHours}"
              placeholder="结束时间"
              v-model="signData.endTimeToHours"
              value-format="HH:mm:ss"
            ></el-time-select>
            <!-- <v-datepicker ref="startTime" :value="signData.startTimeToHours" format="hh:ii:ss" class="btn-block time-picker"  :clearButton="false"></v-datepicker>
            <v-datepicker ref="startTime" :value="signData.endTimeToHours" format="hh:ii:ss" class="btn-block time-picker"  :clearButton="false"></v-datepicker>-->
          </div>
        </div>
        <div v-else>
          <div class="form-group data-wrap box_flex box_center">
            <v-datepicker
              ref="startTime"
              :beforeSelect="beforeStartTimeStartSelect"
              :value="signData.startTime"
              @daySelected="signStartSelected"
              format="yyyy-MM-dd"
              class="btn-block time-picker"
              :clearButton="false"
            ></v-datepicker>
            <div class="date_center">至</div>
            <v-datepicker
              ref="startTime"
              :beforeSelect="beforeEndTimeStartSelect"
              :value="signData.endTime"
              @daySelected="signEndSelected"
              format="yyyy-MM-dd"
              class="btn-block time-picker"
              :clearButton="false"
            ></v-datepicker>
          </div>
          <div class="weeklyDate">
            <div
              style="display: flex;line-height: 40px;"
              v-for="(item,index) in weeklyDate"
              :key="index"
            >
              <el-checkbox
                @change="checkboxChange"
                :disabled="title=='编辑签到'"
                v-model="item.isChecked"
              >{{dateToCn(item.index)}}</el-checkbox>
              <div class="form-group data-wrap box_flex box_center my-elwrap" v-if="item.isChecked">
                <el-time-select
                  style="width: 40%;"
                  @change="dateChange(item.startHours,index)"
                  :picker-options="{ start: '06:00',step: '00:15',end:'24:00',maxTime:item.endHours}"
                  placeholder="起始时间"
                  v-model="item.startHours"
                  value-format="HH:mm:ss"
                ></el-time-select>
                <el-time-select
                  style="width: 40%;"
                  @change="dateChange_end(item.endHours,index)"
                  :picker-options="{ start: '06:00',step: '00:15',end:'24:00',minTime:item.startHours}"
                  placeholder="结束时间"
                  v-model="item.endHours"
                  value-format="HH:mm:ss"
                ></el-time-select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="data-wrap" v-if="signData.needOut">
        <div class="sign-ways">
          <div class="switch box_flex box_between">
            <span class="label">使用签退</span>
            <el-switch v-model="signData.isSignOut"></el-switch>
          </div>
          <div class="form-group box_flex box_center date_picker_wrap">
            <el-date-picker
              style="width:100%;"
              :picker-options="pickOptions"
              :disabled="signData.signOutTimeStart&&new Date(signData.signOutTimeStart)<new Date()||!signData.isSignOut"
              v-model="dateArea2"
              value-format="yyyy-MM-dd HH:mm:ss"
              :clearable="false"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
            <!-- <v-datepicker ref="beginOutTime" class="btn-block time-picker" :disabled="signData.signOutTimeStart&&new Date(signData.signOutTimeStart)<new Date()||!signData.isSignOut" :value="signData.signOutTimeStart" :beforeSelect="beforeOutTimeStartSelect" :format="signData.dateFormat" placeholder="请选择签退开始时间" :clearButton="false" @daySelected="signOutStartSelected"></v-datepicker>
            <div class="date_center">至</div>
            <v-datepicker ref="endOutTime" class="btn-block time-picker" :disabled="!signData.isSignOut" :value="signData.signOutTimeEnd" :format="signData.dateFormat" placeholder="请选择签退结束时间" :clearButton="false" :beforeSelect="beforeOutTimeEndSelect" @daySelected="signOutEndSelected"></v-datepicker>-->
          </div>
        </div>
      </div>
      <div class="form-group">
        <div class="sign-ways">
          <div
            v-show="!signData.needOut"
            class="sign-way"
            :class="{ active: signData.signWay === signData.signWays.qrcode }"
            @click="setSignWay(signData.signWays.qrcode)"
          >
            <v-icon
              :name="signData.signWay === signData.signWays.qrcode ? 'radio_button_checked' : 'radio_button_unchecked'"
            ></v-icon>
            <span>扫码签到</span>
          </div>
          <div v-show="signData.signWay === signData.signWays.qrcode">
            <div class="switch box_flex box_between">
              <span class="label">{{i18n.useDynamicCode}}</span>
              <el-switch v-model="signData.useDynamicCode"></el-switch>
              <!-- <div class="slider">
                <div class="pipe"></div>
                <div class="head"></div>
              </div>-->
            </div>
            <div class="switch box_flex box_between">
              <span class="label">开启定位限制</span>
              <el-switch v-model="signData.scanQrcodeWithLocation"></el-switch>
              <!-- <div class="slider">
                <div class="pipe"></div>
                <div class="head"></div>
              </div>-->
            </div>
            <div class="qrcode-locations" v-show="signData.scanQrcodeWithLocation">
              <locations :moreAddress="!signData.needOut" :locations="signData.qrcodeLocations"></locations>
            </div>
          </div>
          <div
            class="sign-way"
            v-if="!signData.needOut"
            :class="{ active: signData.signWay === signData.signWays.location }"
            @click="setSignWay(signData.signWays.location)"
          >
            <v-icon
              :name="signData.signWay === signData.signWays.location ? 'radio_button_checked' : 'radio_button_unchecked'"
            ></v-icon>
            <span>定位签到</span>
          </div>
          <div
            class="sign-way"
            v-if="!signData.needOut&&checkInType==='loop'"
            :class="{ active: signData.signWay === signData.signWays.outside }"
            @click="setSignWay(signData.signWays.outside)"
          >
            <v-icon
              :name="signData.signWay === signData.signWays.outside ? 'radio_button_checked' : 'radio_button_unchecked'"
            ></v-icon>
            <span>外勤打卡</span>
          </div>
          <div v-show="signData.signWay === signData.signWays.location">
            <locations :locations="signData.locations"></locations>
          </div>
        </div>
      </div>
    </div>
    <div slot="modal-footer" class="modal-footer">
      <button type="button" class="btn cancel-btn clearBtnBorder" @click="cancel">{{i18n.cancel}}</button>
      <!-- TODO 点击确定后disabled -->
      <button type="button" class="btn submit-btn clearBtnBorder" @click="confirm">{{i18n.sure}}</button>
    </div>
  </v-modal>
</template>
<script>
import Vue from "vue";
import VIcon from "./components/vIcon";
import Locations from "./locations";

export default {
  components: {
    VIcon,
    Locations
  },
  props: {
    weekDay: String,
    checkInType: String, //single、loop
    i18n: Object,
    signInfo: Object,
    title: String,
    locations: {
      type: Array,
      default: function() {
        return [];
      }
    },
    frequency: String
  },
  watch: {
    signInfo(newValue) {
      console.log(newValue);
      this.signData = newValue;
      if (!this.signData.signWays) {
        if (this.checkInType == "loop") {
          this.signData.signWays = {
            qrcode: "qrcode",
            location: "location",
            outside: "outside"
          };
        } else {
          this.signData.signWays = {
            qrcode: "qrcode",
            location: "location",
          };
        }
      }else if(this.checkInType === 'loop'){
        this.signData.signWays = {
            qrcode: "qrcode",
            location: "location",
            outside: "outside"
          };
      }
      this.formatDateArea();
    },
    dateArea(newVal, oldVal) {
      //手动赋值的时候 需要设noWatchDateArea为true 否则会触发验证
      if (this.noWatchDateArea) {
        setTimeout(() => {
          this.noWatchDateArea = false;
        }, 100);
        return;
      }
      if (newVal) {
        if (new Date(newVal[0]) < new Date()) {
          this.$toast("选择失败！只能选择当前时间之后的签到时间！");
          this.noWatchDateArea = true;
          this.dateArea = oldVal;
        } else if (
          new Date(newVal[0]).format("yyyy-MM-dd") !==
          new Date(newVal[1]).format("yyyy-MM-dd")
        ) {
          this.$toast("签到开始与结束时间需要在同一天");
          this.noWatchDateArea = true;
          this.dateArea = oldVal;
        } else {
          this.signData.startTime = newVal[0];
          this.signData.endTime = newVal[1];
        }
      }
    },
    dateArea2(newVal, oldVal) {
      if (this.noWatchDateArea) {
        this.noWatchDateArea = false;
        return;
      }
      if (newVal) {
        if (new Date(newVal[0]) < new Date()) {
          this.$toast("选择失败！只能选择当前时间之后的签退时间！");
          this.noWatchDateArea = true;
          this.dateArea2 = oldVal;
        } else if (
          new Date(newVal[0]).format("yyyy-MM-dd") !==
          new Date(newVal[1]).format("yyyy-MM-dd")
        ) {
          this.$toast("签退开始与结束时间需要在同一天");
          this.noWatchDateArea = true;
          this.dateArea2 = oldVal;
        } else {
          this.signData.signOutTimeStart = newVal[0];
          this.signData.signOutTimeEnd = newVal[1];
        }
      }
    }
  },
  data: function() {
    return {
      weeklyDate: [],
      selectWeekDay: [], //选中的签到日期： 星期N、
      isChecked: false,
      signDataBak: null,
      signData: {},
      dateArea: ["", ""],
      dateArea2: ["", ""],
      typeList: [
        { text: "每日签到", id: "day" },
        { text: "每周签到", id: "week" }
      ],
      selectType: "day",
      pickOptions: {
        disabledDate(nowDate) {
          return nowDate.getTime() + 86400000 < Date.now();
        }
      }
    };
  },
  created: function() {
    if (this.frequency) {
      this.selectType = this.frequency;
    }
    this.weeklyDate = [];
    for (let i = 0; i < 7; i++) {
      this.weeklyDate.push({
        index: i,
        isChecked: false,
        startHours: "",
        endHours: ""
      });
    }
    if (this.weekDay) {
      let arr = this.weekDay.split("&");
      for (let i = 0; i < arr.length; i++) {
        let list = arr[i].split(",");
        let index = Number(list[0]) - 1;
        Object.assign(this.weeklyDate[index], {
          index: index,
          isChecked: true,
          startHours: list[1],
          endHours: list[2]
        });
        // this.weeklyDate[index] =
      }
      console.log(this.weeklyDate);
    }
    this.signDataBak = JSON.parse(JSON.stringify(this.signInfo));
    this.signData = this.signInfo;

    if (this.frequency == "day") {
      this.signData.startTimeToHours = this.signInfo.hourStart;
      this.signData.endTimeToHours = this.signInfo.hourEnd;
    }
    console.log(this.signData);
    if (!this.signData.signWays) {
      if (this.checkInType == "loop") {
        //非单次签到
        this.signData.signWays = {
          qrcode: "qrcode",
          location: "location",
          outside: "outside"
        };
      } else {
        this.signData.signWays = {
          qrcode: "qrcode",
          location: "location"
        };
      }
    }
    this.formatDateArea();
  },
  computed: {},
  methods: {
    checkboxChange() {
      // if(this.title == '编辑签到') {
      //   return this.$toast('无法修改已选择的日期')
      // }
    },
    dateChange_day(val, type) {
      if (type == "start") {
        if (this.signData.startTimeToHours.split(":").length == 2) {
          this.signData.startTimeToHours = val + ":00";
        }
      } else {
        if (this.signData.endTimeToHours.split(":").length == 2) {
          this.signData.endTimeToHours = val + ":00";
        }
      }
    },
    dateChange(val, index) {
      if (this.weeklyDate[index].startHours) {
        if (this.weeklyDate[index].startHours.split(":").length == 2) {
          this.weeklyDate[index].startHours = val + ":00";
        }
      }
    },
    dateChange_end(val, index) {
      if (this.weeklyDate[index].endHours) {
        if (this.weeklyDate[index].endHours.split(":").length == 2) {
          this.weeklyDate[index].endHours = val + ":00";
        }
      }
    },
    dateToCn(index) {
      switch (index) {
        case 0:
          return "星期一";
          break;
        case 1:
          return "星期二";
          break;
        case 2:
          return "星期三";
          break;
        case 3:
          return "星期四";
          break;
        case 4:
          return "星期五";
          break;
        case 5:
          return "星期六";
          break;
        case 6:
          return "星期日";
          break;
        default:
          break;
      }
    },
    formatDateArea() {
      this.noWatchDateArea = true;
      this.dateArea = ["", ""];
      this.dateArea2 = ["", ""];
      if (this.signData.startTime) {
        this.dateArea = [this.signData.startTime, this.signData.endTime];
      }
      if (this.signData.signOutTimeStart) {
        this.dateArea2 = [
          this.signData.signOutTimeStart,
          this.signData.signOutTimeEnd
        ];
      }
    },
    beforeStartTimeStartSelect(value) {
      if(this.checkInType === 'single'){
        return true
      }
      if (new Date(value).getTime() > new Date().getTime() - 86400000) {
        if (this.signData.endTime) {
          if (new Date(value) > new Date(this.signData.endTime)) {
            this.$toast(this.i18n.endTimeMustBeAfterStartTime);
            return false;
          }
          if (
            new Date(value).format("yyyy-MM-dd") !==
            new Date(this.signData.endTime).format("yyyy-MM-dd")
          ) {
            this.$toast("签到开始与结束时间需要在同一天");
            return false;
          }
        }
        return true;
      } else {
        this.$toast("选择失败！只能选择当前时间之后的签到时间！");
      }
      return false;
    },
    beforeEndTimeStartSelect(value) {
      if(this.checkInType === 'single'){
        return true
      }
      if (new Date(value).getTime() > new Date().getTime() - 86400000) {
        if (this.signData.startTime) {
          if (new Date(this.signData.startTime) > new Date(value)) {
            this.$toast(this.i18n.endTimeMustBeAfterStartTime);
            return false;
          }
          // if (
          //   new Date(this.signData.startTime).format("yyyy-MM-dd") !==
          //   new Date(value).format("yyyy-MM-dd")
          // ) {
          //   this.$toast("签到开始与结束时间需要在同一天");
          //   return false;
          // }
        }
        return true;
      } else {
        this.$toast("选择失败！只能选择当前时间之后的签到时间！");
      }
      return false;
    },
    beforeOutTimeStartSelect(value) {
      if (new Date(value) > new Date()) {
        if (this.signData.signOutTimeEnd) {
          if (new Date(value) > new Date(this.signData.signOutTimeEnd)) {
            this.$toast(this.i18n.endTimeMustBeAfterStartTime);
            return false;
          }
          // if (
          //   new Date(value).format("yyyy-MM-dd") !==
          //   new Date(this.signData.signOutTimeEnd).format("yyyy-MM-dd")
          // ) {
          //   this.$toast("签退开始与结束时间需要在同一天");
          //   return false;
          // }
        }
        return true;
      } else {
        this.$toast("选择失败！只能选择当前时间之后的签退时间！");
      }
      return false;
    },
    beforeOutTimeEndSelect(value) {
      if (new Date(value) > new Date()) {
        if (this.signData.signOutTimeStart) {
          if (new Date(this.signData.signOutTimeStart) > new Date(value)) {
            this.$toast(this.i18n.endTimeMustBeAfterStartTime);
            return false;
          }
          if (
            new Date(this.signData.signOutTimeStart).format("yyyy-MM-dd") !==
            new Date(value).format("yyyy-MM-dd")
          ) {
            this.$toast("签退开始与结束时间需要在同一天");
            return false;
          }
        }
        return true;
      } else {
        this.$toast("选择失败！只能选择当前时间之后的签退时间！");
      }
      return false;
    },
    changeIsSignOut() {
      if (this.$parent.signTabVal === "signOut") {
        this.$toast("签退列表使用中,无法取消签退!");
        return;
      }
      this.signData.isSignOut = !this.signData.isSignOut;
      this.$forceUpdate();
    },
    setSignWay: function(signWay) {
      this.signData.signWay = signWay;
    },
    cancel: function() {
      Object.assign(this.signData, this.signInfo);
      if (this.checkInType == "loop" && this.frequency == "day") {
        this.signData.startTimeToHours = this.signInfo.hourStart;
        this.signData.endTimeToHours = this.signInfo.hourEnd;
      }

      // this.weeklyDate = []
      // for(let i = 0;i<7;i++) {
      //     this.weeklyDate.push({
      //       index: i,
      //       isChecked: false,
      //       startHours:'',
      //       endHours:''
      //     })
      //   }
      this.signData.show = false;
    },
    confirm: function() {
      if (!this.signData.startTime) {
        return this.$toast(this.i18n.error.pleaseChooseStartTime);
      }
      if (!this.signData.endTime) {
        return this.$toast(this.i18n.error.pleaseChooseEndTime);
      }

      if (this.signData.isSignOut) {
        if (!this.signData.signOutTimeStart) {
          return this.$toast("请选择签退开始时间!");
        }
        if (!this.signData.signOutTimeEnd) {
          return this.$toast("请选择签退结束时间!");
        }
        if (this.signData.signOutTimeStart > this.signData.signOutTimeEnd) {
          return this.$toast("签退结束时间必须在开始时间之后!");
        }
        if (
          new Date(this.signData.signOutTimeStart).format("yyyy-MM-dd") !==
          new Date(this.signData.signOutTimeEnd).format("yyyy-MM-dd")
        ) {
          this.$toast("签到开始与结束时间需要在同一天");
          return;
        }
      }
      if (!this.signData.name) {
        return this.$toast(this.i18n.error.pleaseFillInSignName);
      }

      if (
        this.signData.signWay === this.signData.signWays.qrcode &&
        this.signData.scanQrcodeWithLocation
      ) {
        if (!this.signData.qrcodeLocations.length) {
          return this.$toast("请添加地点");
        }
        for (let location of this.signData.qrcodeLocations) {
          if (!location.init) {
            return this.$toast("请选择地图中的地点作为中心点");
          }
        }
      }
      if (this.signData.signWay === this.signData.signWays.location) {
        if (!this.signData.locations.length) {
          return this.$toast("请添加地点");
        }
        for (let location of this.signData.locations) {
          if (!location.address) {
            return this.$toast("请选择地图中的地点作为中心点");
          }
        }
      }
      if (this.selectType == "week") {
        //周签到
        this.selectWeekDay = [];
        let weekDay = "";
        for (let i = 0; i < this.weeklyDate.length; i++) {
          if (this.weeklyDate[i].isChecked) {
            if (
              this.weeklyDate[i].startHours == "" ||
              this.weeklyDate[i].endHours == ""
            ) {
              return this.$toast("请选择时间");
            } else {
              let start;
              let end;
              if (this.weeklyDate[i].startHours.split(":").length == 2) {
                start = this.weeklyDate[i].startHours + ":00";
              } else {
                start = this.weeklyDate[i].startHours;
              }
              if (this.weeklyDate[i].endHours.split(":").length == 2) {
                end = this.weeklyDate[i].endHours + ":00";
              } else {
                end = this.weeklyDate[i].endHours;
              }
              this.selectWeekDay.push(`${i + 1},${start},${end}`);
            }
          }
        }
        if (this.selectWeekDay.length == 0) {
          return this.$toast("请选择签到日期");
        }
        this.signData.weekDay = this.selectWeekDay.join("&");
      }
      if (this.signData.needOut) {
        this.$emit("confirm", this.signData);
        return;
      }
      if (this.title == "编辑签到") {
        this.signData.checkInType = this.checkInType;
        if (this.selectType == "day") {
          this.$emit("editMethod", this.signData);
        } else {
          this.$emit("editMethod", this.signData);
        }
      } else {
        this.signData.checkInType = this.signInfo.project.checkInType;
      }

      this.signData.selectType = this.selectType;
      console.log(this.signData);
      this.$emit("confirm", this.signData);
    },
    signStartSelected: function(date) {
      // if(this.signInfo.project.checkInType == 'loop') {  //非单次
      //   if(date.value) {
      //     let DATE = date.value.split(' ')
      //     this.signData.startTime = DATE[0]
      //   }
      // }else {
      this.signData.startTime = date.value;
      // }
    },
    signEndSelected: function(date) {
      // if(this.signInfo.project.checkInType == 'loop') {  //非单次
      //   if(date.value) {
      //     let DATE = date.value.split(' ')
      //     this.signData.endTime = DATE[0]
      //   }
      // }else {
      this.signData.endTime = date.value;
      // }
    },
    signOutStartSelected: function(date) {
      this.signData.signOutTimeStart = date.value;
    },
    signOutEndSelected: function(date) {
      this.signData.signOutTimeEnd = date.value;
    }
  }
};
</script>
<style scoped lang="less">
@primaryColor: #298df7;
@blackTextColor: rgba(0, 0, 0, 0.77);
@defaultTextColor: rgba(0, 0, 0, 0.54);
@muteTextColor: rgba(0, 0, 0, 0.36);
.data-wrap {
  padding: 10px 22px;
}
.modal-header {
  padding: 21px 25px;
  .modal-title {
    font-weight: 600;
    font-size: 16px;
    color: @blackTextColor;
  }
}
.modal-body {
  font-weight: 600;
  .form-group {
    .modal-input {
      padding-left: 10px;
      padding-right: 10px;
    }
  }
  .modal-input {
    display: inline-block;
    font-size: 13px;
    color: @blackTextColor;
    border: none;
    box-shadow: none;
    outline: none;
  }
  .type-div.row {
    padding: 12px 15px;
    border-top: 1px solid #e0e0e0;
    .app-type-text {
      font-size: 13px;
      color: @muteTextColor;
      line-height: 40px;
      margin-left: 9px;
      margin-top: -12px;
      .add-category {
        cursor: pointer;
        font-size: 13px;
        color: @defaultTextColor;
        text-decoration: underline;
        letter-spacing: 0;
      }
    }
    .app-type-content {
      height: 146px;
      overflow: auto;
      .type-p {
        padding: 11px 10px;
        margin: 0;
        font-size: 13px;
        color: @defaultTextColor;
        cursor: pointer;
        i {
          display: none;
          float: left;
          margin-right: 8px;
          font-size: 18px;
          color: @defaultTextColor;
        }
        &.active {
          i {
            display: inline-block;
          }
        }
      }
      .creat-category-input {
        input {
          border: none;
          -webkit-box-shadow: none;
          box-shadow: none;
          border-radius: 0;
          background: transparent;
          width: 77%;
          margin-left: 70px;
          font-size: 13px;
          font-weight: 500;
          padding: 0;
          color: @defaultTextColor;
          border-bottom: 2px solid #e0e0e0;
          margin-left: 10px;
          &:focus,
          &:hover {
            border-bottom: 2px solid @primaryColor;
          }
        }
        .create-btn-group {
          margin: -36px 64px 0 0;
          .btn {
            background: transparent;
          }
          .create-cancel {
            padding: 6px 0;
            font-size: 13px;
            color: @defaultTextColor;
            font-weight: 500;
          }
          .create-sure {
            color: @primaryColor;
          }
          .error-msg {
            padding: 10px;
            margin: 0;
            font-size: 13px;
            color: indianred;
            font-weight: 500;
          }
        }
      }
    }
  }
  &.modal-full-width {
    padding: 0;
    overflow: inherit;
    max-height: 1000px;
    .form-group {
      margin-bottom: 0;
      .date_center {
        font-weight: normal;
        padding: 0 5px;
        height: 32px;
        line-height: 32px;
      }
      & > input {
        height: 56px;
        padding-left: 24px;
        outline: 0;
        box-shadow: none;
        border-radius: 0;
        border: none;
        font-size: 13px;
      }
      .sign-ways {
        padding: 22px;
        border-top: 1px solid #e0e0e0;
        .sign-way {
          cursor: pointer;
          transition: all 200ms;
          margin-top: 20px;
          i {
            font-size: 22px;
            color: #bdbdbd;
            float: left;
          }
          span {
            height: 22px;
            line-height: 26px;
            color: #bdbdbd;
            margin-left: 5px;
            font-size: 13px;
          }
          &.active {
            i,
            span {
              color: #555;
            }
          }
        }
      }
    }
  }
}

.switch {
  height: 30px;
  line-height: 30px;
  position: relative;
  cursor: pointer;
  padding-right: 5px;
  margin-top: 5px;
  .label {
    padding-left: 0;

    font-size: 13px;
    color: @blackTextColor;
  }
  .slider {
    position: relative;
    height: 100%;
    float: right;
    padding: 0 18px 0;
    .head {
      width: 20px;
      height: 20px;
      position: absolute;
      left: 0;
      top: 5px;
      height: 20px;
      border-radius: 10px;
      background: #f5f5f5;
      box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
      transform: translateX(0);
      transition: transform 300ms;
    }
    .pipe {
      background: #bdbdbd;
      width: 30px;
      height: 13px;
      border-radius: 10px;
      left: 5px;
      top: 9px;
      position: absolute;
      transition: all 300ms;
    }
  }
  &.on {
    .head {
      background: @primaryColor;
      transform: translateX(16px);
    }
    .pipe {
      background: rgba(63, 81, 181, 0.3);
    }
  }
}
</style>
<style lang="less">
.modal-content {
  .my-elwrap {
    .el-date-editor {
      margin-right: 40px;
      .el-input__icon {
        line-height: 32px;
      }
    }
    input {
      font-size: 12px;
      font-weight: normal;
      padding-left: 30px;
    }
  }
}
.weeklyDate {
  padding: 10px 22px;
  .my-elwrap {
    padding: 0;
    .el-input .el-input__inner {
      padding-left: 30px;
    }
    .el-checkbox {
      margin-right: 30px;
    }
  }
  div {
    i {
      font-style: normal;
    }
  }
}
.notice {
  padding: 10px 22px;
  color: #555;
  i {
    color: #298ef8;
    font-size: 16px;
  }
}
</style>
