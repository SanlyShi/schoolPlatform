<template>
  <!--
    @description 招聘日历组件
    @param {String} title - 标题 非必填

   -->
  <div class="em-calendar__container">
    <div class="em-calendar__main">
      <div class="em-calendar__panel">
        <div class="em-calendar__panel-header">
          <div class="em-calendar__btn em-calendar__btn-left" @click="switchPrevYear()">
            <i class="el-icon-d-arrow-left"></i>
          </div>
          <div class="em-calendar__btn em-calendar__btn-left" @click="switchPrevMonth()">
            <i class="el-icon-arrow-left"></i>
          </div>
          <span>{{currentMonth.year}} 年</span>
          <span>{{currentMonth.month + 1}} 月</span>
          <div class="em-calendar__btn em-calendar__btn-right" @click="switchNextYear()">
            <i class="el-icon-d-arrow-right"></i>
          </div>
          <div class="em-calendar__btn em-calendar__btn-right" @click="switchNextMonth()">
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
        <div class="em-calendar__panel-content" v-if="!loadingRecruitment&&initDone">
          <table class="em-calendar__table">
            <tr class="em-calendar__tr">
              <th class="em-calendar__th">日</th>
              <th class="em-calendar__th">一</th>
              <th class="em-calendar__th">二</th>
              <th class="em-calendar__th">三</th>
              <th class="em-calendar__th">四</th>
              <th class="em-calendar__th">五</th>
              <th class="em-calendar__th">六</th>
            </tr>
            <tr class="em-calendar__tr" v-for="row in 6" v-bind:key="row">
              <td class="em-calendar__td" v-for="col in 7" v-bind:key="col" @click="getOneDayRecord(row,col)">
                <!-- <div v-if="currentMonth.dayList[(row-1)*7+col-1].isCurrMonth !== 0" @click="getOneDayRecord(row,col)" class="otherMonth" :class="getClass(row,col)">
                  {{ currentMonth.dayList[(row-1)*7+col-1].value>9?currentMonth.dayList[(row-1)*7+col-1].value:'0'+currentMonth.dayList[(row-1)*7+col-1].value}}
                  <span class="ball"></span>
                </div> -->
                <div v-if="currentMonth.dayList[(row-1)*7+col-1].isCurrMonth === 0" :class="[getClass(row,col),{
                      today: isSelectDay(currentMonth.dayList[(row-1)*7+col-1])
                    }]">
                  {{ currentMonth.dayList[(row-1)*7+col-1].value>9?currentMonth.dayList[(row-1)*7+col-1].value:'0'+currentMonth.dayList[(row-1)*7+col-1].value}}
                  <span class="ball"></span>
                </div>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { pAjax, request } from '../../assets/utils/utils'
export default {
  name: "Calendar",
  props: {
    title: {
      type: String,
      default: "招聘日历"
    },
  },
  data() {
    return {
      // 今日
      nowDate: {
        year: 0, // 年
        month: 0, // 月
        day: 0 // 日
      },
      initDone: false,
      // 当前显示月份
      currentMonth: {
        year: 2019,
        month: 4,
        dayList: []
      },
      // 基本日期
      baseDayList: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
        11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
        31
      ],
      // 非闰年月份对应的天数
      monthDayCount: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
      dateEventListMonthInit: {

      },
      dateEventList: {

      },
      selectDay: '',//选中的日期
      loadingRecruitment: true
    };
  },
  methods: {
    getOneDayRecord(row, col) {
      console.log('hhhhhh')
      this.selectDay = this.getDateString(this.currentMonth.dayList[(row - 1) * 7 + col - 1])
      let url = `api/ca/personal/courses/signInStatus?date=${this.selectDay}`
      request(url).then(o => {
        console.log('o', o)
        if (o.state) {
          this.$parent.courseList = o.data.map(a => {
            a.timeEnd =a.timeEnd.replace(/-/g, '/')
            a.timeStart = a.timeStart.replace(/-/g, '/')
            return a
          })
        }

      })
    },
    getNotes(year, month) {
      // let year = new Date().getFullYear()
      // let month = new Date().getMonth()
      console.log('month', month)
      let beginMonth = month
      let endMonth = month + 2
      let beginYear = year, endYear = year
      if (!beginMonth) {//因为可能现在是一月 上一月就变成12月了
        beginMonth = 12
        beginYear = beginYear - 1
      }
      if (endMonth == 13) {
        endMonth = 1
        endYear += 1
      }
      if (beginMonth < 10) {
        beginMonth = '0' + beginMonth
      }
      if (endMonth < 10) {
        endMonth = '0' + endMonth
      }
      let beginDay = this.currentMonth.dayList[0].value > 9 ? this.currentMonth.dayList[0].value : '0' + this.currentMonth.dayList[0].value
      let endDay = this.currentMonth.dayList[this.currentMonth.dayList.length - 1].value > 9 ? this.currentMonth.dayList[this.currentMonth.dayList.length - 1].value : '0' + this.currentMonth.dayList[this.currentMonth.dayList.length - 1].value
      let beginDate = beginYear + '-' + beginMonth + '-' + beginDay
      let dateEnd = endYear + '-' + endMonth + '-' + endDay
      let url = `api/ca/personal/signIn/notes?dateStart=${beginDate}&dateEnd=${dateEnd}`
      request(url).then(o => {
        this.dateEventList = {}
        this.$parent.userInfo = o.data
        for (var i in o.data.dataSignInStatus) {
          if (o.data.dataSignInStatus[i]) {
            this.dateEventList[i] = { class: 'blue' }
          } else {
            this.dateEventList[i] = { class: 'yellow' }
          }
        }
        this.initDone = true;
      })
    },
    getClass(row, col) {
      let event = this.dateEventList[this.getDateString(this.currentMonth.dayList[(row - 1) * 7 + col - 1])]
      if (event) {
        return event.class
      } else {
        return ''
      }
    },
    /**
* 获取当前日期
*/
    getNowDate() {
      let now = new Date();
      this.nowDate = {
        year: now.getFullYear(),
        month: now.getMonth(),
        day: now.getDate()
      }
    },

    /**
     * 获取当前日历显示月份
     */
    getCurrentMonth(year, month) {
      let tmpList = [], resList = [];
      if (year) {
        this.currentMonth.year = year;
      }
      else {
        year = this.currentMonth.year;
      }
      if (month) {
        this.currentMonth.month = month;
      }
      else {
        month = this.currentMonth.month;
      }

      let currDayCount = this.monthDayCount[month];
      if (this.isLeapYear(year) && month === 1) {
        currDayCount += 1;
      }
      tmpList = this.baseDayList.slice(0, currDayCount);
      tmpList.forEach((item) => {
        resList.push({
          value: item,
          isCurrMonth: 0
        });
      });

      let firstWeekDay = new Date(year, month, 1).getDay(); // 1号对应时间
      if (!firstWeekDay) {
        firstWeekDay = 7;
      }
      let prevDayCount = this.monthDayCount[month ? month - 1 : 11];
      if (this.isLeapYear(year) && month === 3) {
        prevDayCount += 1;
      }

      tmpList = this.baseDayList.slice(prevDayCount - firstWeekDay, prevDayCount);
      tmpList = tmpList.reverse();
      tmpList.forEach((item) => {
        resList.unshift({
          value: item,
          isCurrMonth: -1
        });
      });

      tmpList = this.baseDayList.slice(0, (42 - resList.length));
      tmpList.forEach((item) => {
        resList.push({
          value: item,
          isCurrMonth: 1
        })
      });

      this.currentMonth.dayList = resList;

      this.loaddateEventListByMonth(year, month)
      this.getNotes(year, month)

    },
    async loaddateEventListByMonth(year, month) {
      this.loadingRecruitment = true
      for (let i = 0; i <= 2; ++i) { // 上月，本月，下月
        let normalizedMonth = month + i
        if (this.dateEventListMonthInit[normalizedMonth]) { // 该月已经初始化过了
          continue
        }
        this.dateEventListMonthInit[normalizedMonth] = true
      }
      this.loadingRecruitment = false
    },
    getDateString(dayInfo) {
      const normalizedMonth = this.currentMonth.month + 1 + dayInfo.isCurrMonth
      const dateString = `${this.currentMonth.year}-${normalizedMonth > 9 ? normalizedMonth : ('0' + normalizedMonth)}-${dayInfo.value > 9 ? dayInfo.value : ('0' + dayInfo.value)}`
      return dateString
    },

    /**
     * 判断是否为闰年
     */
    isLeapYear(year) {
      return year % 4 === 0 && year % 400 !== 0 ? true : false;
    },

    /**
     * 判断是否为今天
     */
    isSelectDay(obj) {
      return this.getDateString(obj) === this.selectDay
      return obj.isCurrMonth === 0
        && this.currentMonth.year === this.nowDate.year
        && this.currentMonth.month === this.nowDate.month
        && obj.value === this.nowDate.day;
    },

    /**
     * 切换去年同月
     */
    switchPrevYear() {
      this.currentMonth.year -= 1;
      this.getCurrentMonth();
    },

    /**
     * 切换明年同月
     */
    switchNextYear() {
      this.currentMonth.year += 1;
      this.getCurrentMonth();
    },

    /**
     * 切换上月
     */
    switchPrevMonth() {
      let month = this.currentMonth.month - 1;
      if (month === -1) {
        this.currentMonth.month = 11;
        this.currentMonth.year -= 1;
      }
      else {
        this.currentMonth.month = month;
      }
      this.getCurrentMonth();
    },

    /**
     * 切换下月
     */
    switchNextMonth() {
      let month = this.currentMonth.month + 1;
      if (month === 12) {
        this.currentMonth.month = 0;
        this.currentMonth.year += 1;
      }
      else {
        this.currentMonth.month = month;
      }
      this.getCurrentMonth();
    }
  },
  created() {
    this.getNowDate();
    this.getCurrentMonth(this.nowDate.year, this.nowDate.month);
  }
}
</script>


<style lang="less" scoped>
@font-black: #000000;
@font-white: #ffffff;
@font-blue: #298df7;

.em-calendar__container {
  width: 100%;
}

.em-calendar__title {
  color: @font-black;
  font-size: 18px;
  font-weight: 500;
  i {
    color: #303133;
    font-size: 24px;
    vertical-align: middle;
  }
  span {
    vertical-align: middle;
  }
}
.em-calendar__panel {
  padding: 10px;
}

.em-calendar__header {
  text-align: center;
  span {
    font-weight: 300;
    margin-right: 20px;
  }
  span:last-child {
    margin-right: 0;
  }
}

.em-calendar__panel-header {
  text-align: center;
  padding-top: 6px;
  &:after {
    display: block;
    content: ".";
    line-height: 0;
    clear: both;
    visibility: hidden;
  }
}
.em-calendar__btn {
  &:hover {
    color: @font-blue;
  }
}
.em-calendar__btn-left {
  float: left;
  margin-right: 20px;
  &:last-child {
    margin-right: 0;
  }
}
.em-calendar__btn-right {
  float: right;
  margin-left: 20px;
  &:first-child {
    margin-left: 0;
  }
}

.em-calendar__panel-content {
  width: 100%;
}

.em-calendar__table {
  margin: 16px auto auto;
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  table-layout: fixed;
}

.em-calendar__th {
  text-align: center;
  padding: 6px;
}
.em-calendar__td {
  text-align: center;
  vertical-align: middle;
  font-size: 0.4267rem;
  div {
    pointer-events: none;
    margin: 0.16rem;
    width: 0.6667rem;
    height: 0.6667rem;
    line-height: 0.6667rem;
    &:hover {
      background: @font-blue;
      color: @font-white;
    }
    &.has-events {
      cursor: pointer;
      pointer-events: all;
    }
    .ball {
      position: absolute;
      display: none;
      bottom: -0.0567rem;
      width: 0.16rem;
      height: 0.16rem;
      left: 0.2703rem;
      border-radius: 50%;
    }
    &.today {
      &.blue,
      &.yellow {
        .ball {
          display: none;
        }
      }
    }
    &.blue {
      position: relative;
      .ball {
        display: block;
        background: @font-blue;
      }
    }
    &.yellow {
      position: relative;
      .ball {
        display: block;
        background: #f9be1b;
      }
    }
  }
}
.is-dcw {
  color: #00bcd4;
}
.otherMonth {
  color: #666666;
}
.has-events {
  background: @font-blue;
  color: @font-white;
  border-radius: 50%;
}
.today {
  background: @font-blue;
  border-radius: 50%;
  font-weight: 600;
  color: @font-white;
}
</style>
