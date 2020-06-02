<template>
  <div class="v-date-cover" @click="_close" v-if="show">
    <div class="datepicker-popup" :style="position" v-show="displayDayView" @click.stop="" v-if="dayView">
      <div class="datepicker-inner">
        <div class="datepicker-body">
          <div class="datepicker-ctrl">
            <span class="datepicker-preBtn glyphicon glyphicon-chevron-left" aria-hidden="true" @click.stop="_preNextMonthClick(0)"></span>
            <span class="datepicker-nextBtn glyphicon glyphicon-chevron-right" aria-hidden="true" @click.stop="_preNextMonthClick(1)"></span>
            <p @click.stop="_switchMonthView">{{_stringifyDayHeader(currDate)}}</p>
          </div>
          <div class="datepicker-weekRange">
            <span v-for="(w,i) in translate.daysOfWeek" :key="i">{{w}}</span>
          </div>
          <div class="datepicker-dateRange">
            <span v-for="(d,i) in dateRange" :key="i" :class="d.sclass" @click.stop="_daySelect(d.date,$event)">{{d.text}}</span>
          </div>
        </div>
        <div class="datepicker-footer container-fluid" v-if="showTime">
          <div class="row text-center">
            <div class="col-xs-2 clear-padding time-input">
            </div>
            <div class="form-group col-xs-2 clear-padding time-input">
              <input type="text" class="form-control" v-model="hour" @change="_checkTime" />
            </div>
            <div class="col-xs-1 clear-padding time-input">
              <label for="">:</label>
            </div>
            <div class="form-group col-xs-2 clear-padding time-input">
              <input type="text" class="form-control pull-left" v-model="minute" @change="_checkTime" />
            </div>
            <div class="col-xs-1 clear-padding time-input">
              <label for="">:</label>
            </div>
            <div class="form-group col-xs-2 clear-padding time-input">
              <input type="text" class="form-control" v-model="second" @change="_checkTime" />
            </div>
            <div class="col-xs-2 clear-padding time-input">
              
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="datepicker-popup" :style="position" v-show="displayMonthView" @click.stop="" v-if="!(yearView || hourView || minuteView || secondView)">
      <div class="datepicker-inner">
        <div class="datepicker-body">
          <div class="datepicker-ctrl">
            <span class="datepicker-preBtn glyphicon glyphicon-chevron-left" aria-hidden="true" @click.stop="_preNextYearClick(0)"></span>
            <span class="datepicker-nextBtn glyphicon glyphicon-chevron-right" aria-hidden="true" @click.stop="_preNextYearClick(1)"></span>
            <p @click.stop="_switchDecadeView">{{_stringifyYearHeader(currDate)}}</p>
          </div>
          <div class="datepicker-monthRange">
            <template v-for="(m,i) in translate.months">
              <span :key="i" :class="{'datepicker-dateRange-item-active':(translate.months[_parse(value).getMonth()]  === m) &&currDate.getFullYear() === _parse(value).getFullYear()}" @click.stop="_monthSelect(i)">{{m.substr(0,3)}}</span>
            </template>
          </div>
        </div>
      </div>
    </div>
    <div class="datepicker-popup" :style="position" v-show="displayYearView" @click.stop="" v-if="!(hourView || minuteView || secondView)">
      <div class="datepicker-inner">
        <div class="datepicker-body">
          <div class="datepicker-ctrl">
            <span class="datepicker-preBtn glyphicon glyphicon-chevron-left" aria-hidden="true" @click.stop="_preNextDecadeClick(0)"></span>
            <span class="datepicker-nextBtn glyphicon glyphicon-chevron-right" aria-hidden="true" @click.stop="_preNextDecadeClick(1)"></span>
            <p>{{_stringifyDecadeHeader(currDate)}}</p>
          </div>
          <div class="datepicker-monthRange decadeRange">
            <template v-for="(decade,d) in decadeRange">
              <span :key="d" :class="{'datepicker-dateRange-item-active':_parse(value).getFullYear() === decade.text}" @click.stop="_yearSelect(decade.text)">{{decade.text}}</span>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data: function () {
      return {
        show: true,
        displayDayView: true,
        displayMonthView: false,
        displayYearView: false,
        hour: 0,
        minute: 0,
        second: 0,
        hasChange: false,
        rect: {},
        translation: {
          'zh-cn': {
            daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
            months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
          },
          'en': {
            daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
            months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
          }
        },
        lang: this.defaultLang
      }
    },
    computed: {
      position: function () {
        var top = 0, left = 0
        if (window.innerWidth >= 768) {
          if (window.innerHeight - this.rect.bottom < 295) {
            top = this.rect.top - 295
            top = top < 0 ? 0 : top
          } else {
            top = this.rect.bottom
          }
          if (window.innerWidth - this.rect.left < 218) {
            left = window.innerWidth - 218
          } else {
            left = this.rect.left
          }
        } else {
          left = (window.innerWidth - 218) / 2
          top = (window.innerHeight - 295) / 3
        }
        return `left:${left}px;top:${top}px;opacity: 1;`
      },
      decadeRange: function () {
        var decadeRange = []
        const yearStr = this.currDate.getFullYear().toString()
        const firstYearOfDecade = (yearStr.substring(0, yearStr.length - 1) + 0) - 1
        for (let i = 0; i < 12; i++) {
          decadeRange.push({
            text: firstYearOfDecade + i
          })
        }
        return decadeRange
      },
      dateRange: function () {
        var dateRange = []
        const currMonthFirstDay = new Date(this.currDate.getFullYear(), this.currDate.getMonth(), 1)
        let firstDayWeek = currMonthFirstDay.getDay() + 1
        if (firstDayWeek === 0) {
          firstDayWeek = 7
        }
        const dayCount = this._getDayCount(this.currDate.getFullYear(), this.currDate.getMonth())
        // 补充日期前位
        if (firstDayWeek > 1) {
          const preMonth = this._getYearMonth(this.currDate.getFullYear(), this.currDate.getMonth() - 1)
          const prevMonthDayCount = this._getDayCount(preMonth.year, preMonth.month)
          for (let i = 1; i < firstDayWeek; i++) {
            const dayText = prevMonthDayCount - firstDayWeek + i + 1
            dateRange.push({
              text: dayText,
              date: new Date(preMonth.year, preMonth.month, dayText),
              sclass: 'datepicker-item-gray'
            })
          }
        }
        //生成日期
        for (let i = 1; i <= dayCount; i++) {
          const date = new Date(this.currDate.getFullYear(), this.currDate.getMonth(), i)
          const week = date.getDay()
          let sclass = ''
          // this.disabledDaysOfWeek.forEach((el) => {
          //   if (week === parseInt(el, 10)) sclass = 'datepicker-item-disable'
          // })
          if (i === this.currDate.getDate()) {
            // if (this.value) {
            const valueDate = this._parse(this.value)
            if (valueDate) {
              if (valueDate.getFullYear() === this.currDate.getFullYear() && valueDate.getMonth() === this.currDate.getMonth()) {
                sclass = 'datepicker-dateRange-item-active'
              }
            }
            // }
          }
          dateRange.push({
            text: i,
            date: date,
            sclass: sclass
          })
        }
        //补充日期后位，使其总共占据6列
        if (dateRange.length < 42) {
          const nextMonthNeed = 42 - dateRange.length
          const nextMonth = this._getYearMonth(this.currDate.getFullYear(), this.currDate.getMonth() + 1)
          for (let i = 1; i <= nextMonthNeed; i++) {
            dateRange.push({
              text: i,
              date: new Date(nextMonth.year, nextMonth.month, i),
              sclass: 'datepicker-item-gray'
            })
          }
        }
        return dateRange
      },
      translate: function () {
        return this.translation[this.defaultLang]
      },
      yearView: function () {
        return /^y{4}$/.test(this.format)
      },
      monthView: function () {
        return /^y{4}(\-|\/|\.)M{2}$/.test(this.format)||/^y{4}(\年|\/|\.)M{2}月{1}$/.test(this.format)
      },
      hourView: function () {
        return /^h{2}$/.test(this.format)
      },
      minuteView: function () {
        return /^h{2}:i{2}$/.test(this.format)
      },
      secondView: function () {
        return /^h{2}:i{2}:s{2}$/.test(this.format)
      },
      dayView: function () {
        return !(this.yearView||this.monthView||this.hourView||this.minuteView||this.secondView)
      }
    },
    created: function () {
      this.hour = this.currDate.getHours()
      this.minute = this.currDate.getMinutes()
      this.second = this.currDate.getSeconds()
      this.hour = this.hour < 10 ? ('0' + this.hour) : this.hour
      this.minute = this.minute < 10 ? ('0' + this.minute) : this.minute
      this.second = this.second < 10 ? ('0' + this.second) : this.second
      this.displayDayView = this.dayView
      this.displayMonthView = this.monthView
      this.displayYearView = this.yearView
    },
    methods: {
      _getDayCount: function (year, month) {
        const dict = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        if (month === 1) {
          if ((year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0)) {
            return 29
          }
        }
        return dict[month]
      },
      _preNextDecadeClick: function (flag) {
        const year = this.currDate.getFullYear()
        const months = this.currDate.getMonth()
        const date = this.currDate.getDate()

        if (flag === 0) {
          this.currDate = new Date(year - 10, months, date)
        } else {
          this.currDate = new Date(year + 10, months, date)
        }
      },
      _preNextMonthClick: function (flag) {
        const year = this.currDate.getFullYear()
        const month = this.currDate.getMonth()
        const date = this.currDate.getDate()

        if (flag === 0) {
          const preMonth = this._getYearMonth(year, month - 1)
          this.currDate = new Date(preMonth.year, preMonth.month, date)
        } else {
          const nextMonth = this._getYearMonth(year, month + 1)
          this.currDate = new Date(nextMonth.year, nextMonth.month, date)
        }
      },
      _preNextYearClick: function (flag) {
        const year = this.currDate.getFullYear()
        const months = this.currDate.getMonth()
        const date = this.currDate.getDate()
        if (flag === 0) {
          this.currDate = new Date(year - 1, months, date)
        } else {
          this.currDate = new Date(year + 1, months, date)
        }
      },
      _yearSelect: function (year) {
        this.displayYearView = false
        this.currDate = new Date(year, this.currDate.getMonth(), this.currDate.getDate())
        if(this.yearView) {
          this.value = this._stringify(this.currDate)
          this.show = false
          this._optionResult(this.value)
        } else {
          this.displayMonthView = true
        }
      },
      _monthSelect: function (index) {
        this.displayMonthView = false
        this.currDate = new Date(this.currDate.getFullYear(), index, this.currDate.getDate())
        if(this.monthView) {
          this.value = this._stringify(this.currDate)
          this.show = false
          this._optionResult(this.value)
        } else {
          this.displayDayView = true
        }
      },
      _daySelect: function (date, event) {
        if (event.target.classList[0] === 'datepicker-item-disable') {
          return false
        } else {
          this.currDate = date
          this.value = this._stringify(this.currDate)
          // if (this.showTime) {
          //   this.value = this.value + ' ' + (this.hour < 10 ? ('0' + parseInt(this.hour)) : this.hour) + ':' + (this.minute < 10 ? ('0' + parseInt(this.minute)) : this.minute) + ':' + (this.second < 10 ? ('0' + parseInt(this.second)) : this.second)
          // }
          this.displayDayView = false
          this.show = false
          this._optionResult(this.value)
        }
      },
      _switchMonthView: function () {
        this.displayDayView = false
        this.displayMonthView = true
      },
      _switchDecadeView: function () {
        this.displayMonthView = false
        this.displayYearView = true
      },
      _getYearMonth: function (year, month) {
        if (month > 11) {
          year++
          month = 0
        } else if (month < 0) {
          year--
          month = 11
        }
        return {
          year: year,
          month: month
        }
      },
      _checkTime: function () {
        if (isNaN(this.hour) || this.hour < 0 || this.hour > 23) {
          this.hour = this.currDate.getHours()
        }
        if (isNaN(this.minute) || this.minute < 0 || this.minute > 59) {
          this.minute = this.currDate.getMinutes()
        }
        if (isNaN(this.second) || this.second < 0 || this.second > 59) {
          this.second = this.currDate.getSeconds()
        }
      },
      _stringifyDecadeHeader: function (date) {
        const yearStr = date.getFullYear().toString()
        const firstYearOfDecade = yearStr.substring(0, yearStr.length - 1) + 0
        const lastYearOfDecade = parseInt(firstYearOfDecade, 10) + 10
        return firstYearOfDecade + '-' + lastYearOfDecade
      },
      _stringifyDayHeader: function (date) {
        return this.translate.months[date.getMonth()] + ' ' + date.getFullYear()
      },
      _stringifyYearHeader: function (date) {
        return date.getFullYear()
      },
      _stringify: function (date, format) {
        if (!date) date = this._parse()
        if (!date) return ''
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        // const hour = date.getHours()
        // const minute = date.getMinutes()
        // const second = date.getSeconds()
        const monthName = this._parseMonth(date)
        format = format || 'yyyy-MM-dd hh:ii:ss'
        return format
          .replace(/yyyy/g, year)
          .replace(/MMMM/g, monthName)
          .replace(/MMM/g, monthName.substring(0, 3))
          .replace(/MM/g, ('0' + month).slice(-2))
          .replace(/dd/g, ('0' + day).slice(-2))
          .replace(/yy/g, year)
          .replace(/M(?!a)/g, month)
          .replace(/d/g, day)
          .replace(/hh/g, ('0' + this.hour).slice(-2))
          .replace(/ii/g, ('0' + this.minute).slice(-2))
          .replace(/ss/g, ('0' + this.second).slice(-2))
      },
      _parseMonth: function (date) {
        return this.translate.months[date.getMonth()]
      },
      _parse: function (str = this.value) {
        let date
        if (str.length === 10 && (this.format === 'dd-MM-yyyy' || this.format === 'dd/MM/yyyy')) {
          date = new Date(str.substring(6, 10), str.substring(3, 5) - 1, str.substring(0, 2))
        } else {
          date = str ? (new Date(str)) : (new Date())
        }
        return isNaN(date.getFullYear()) ? new Date() : date
      },
      _close: function () {
        this.show = false
        this.displayDayView = this.displayMonthView = this.displayYearView = false
        if (this.hasChange) {
          this._optionResult(this.selectedItems)
        }
        this._optionClose()
        window.onresize = ''
      }
    },
    mounted: function () {
      var that = this
      this.rect = this.el ? this.el.getBoundingClientRect() : {
        left: that.event.clientX,
        bottom: that.event.clientY,
        top: that.event.clientY
      }
      window.onresize = function () {
        that.rect = that.el ? that.el.getBoundingClientRect() : {
          left: that.event.clientX,
          bottom: that.event.clientY,
          top: that.event.clientY
        }
      }
    }
  }
</script>

<style lang="less">
.v-date-cover {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background: rgba(255, 255, 255, 0);
  .datepicker-popup {
    position: absolute;
    top: -100%;
    left: -100%;
    border: 1px solid #ccc;
    border-radius: 5px;
    background: #fff;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
  }

  .datepicker-inner {
    width: 218px;
  }

  .datepicker-body {
    padding: 10px 10px;
  }

  .datepicker-ctrl p,
  .datepicker-ctrl span,
  .datepicker-body span {
    display: inline-block;
    width: 28px;
    line-height: 28px;
    height: 28px;
    border-radius: 4px;
  }

  .datepicker-ctrl p {
    width: 65%;
  }

  .datepicker-ctrl span {
    position: absolute;
  }

  .datepicker-body span {
    text-align: center;
  }

  .datepicker-footer label {
    padding: 5px 10px;
  }

  .datepicker-footer input {
    text-align: center;
    padding: 5px 6px;
  }
  .clear-padding {
    padding: 0;
  }
  .time-input {
    label {
      padding: 5px 0;
    }
  }

  .datepicker-monthRange span {
    width: 48px;
    height: 50px;
    line-height: 45px;
  }

  .datepicker-item-disable {
    background-color: white !important;
    cursor: not-allowed !important;
  }

  .decadeRange span:first-child,
  .decadeRange span:last-child,
  .datepicker-item-disable,
  .datepicker-item-gray {
    color: #999;
  }

  .datepicker-dateRange-item-active:hover,
  .datepicker-dateRange-item-active {
    background: #4091ff !important;
    color: white !important;
  }

  .datepicker-monthRange {
    margin-top: 10px;
  }

  .datepicker-monthRange span,
  .datepicker-ctrl span,
  .datepicker-ctrl p,
  .datepicker-dateRange span {
    cursor: pointer;
  }

  .datepicker-monthRange span:hover,
  .datepicker-ctrl p:hover,
  .datepicker-ctrl i:hover,
  .datepicker-dateRange span:hover,
  .datepicker-dateRange-item-hover {
    background-color: #eeeeee;
  }

  .datepicker-weekRange span {
    font-weight: 500;
  }

  .datepicker-label {
    background-color: #f8f8f8;
    font-weight: 500;
    padding: 7px 0;
    text-align: center;
  }

  .datepicker-ctrl {
    position: relative;
    height: 30px;
    line-height: 30px;
    font-weight: 500;
    text-align: center;
  }

  .month-btn {
    font-weight: 500;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .datepicker-preBtn {
    left: 2px;
  }

  .datepicker-nextBtn {
    right: 2px;
  }
  /* 设置持续时间和动画函数 */

  .slide-fade-enter-active {
    transition: all 0.5s ease;
  }

  .slide-fade-leave-active {
    transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
  }

  .slide-fade-enter,
  .slide-fade-leave-to {
    transform: translateX(10px);
    opacity: 0;
  }
}
@media screen and (max-width: 768px) {
  .v-date-cover {
    background: rgba(0, 0, 0, 0.54);
  }
}
</style>
