<template>
  <div class="date-table-container">
    <div class="date-table-div">
      <div class="date-table-head">
        <div class="date-table-tr">
          <div class="date-table-th date-table-first">排班信息</div>
          <div class="date-table-th" v-for="(dItem, dIndex) in dateArr" :key="dIndex">
            <p class="th-date">{{dItem.date}}</p>
            <p class="th-day">{{dItem.dayStr}}</p>
          </div>
        </div>
      </div>
      <div class="date-table-body">
        <div class="date-table-tr" v-for="(tItem, tIndex) in times" :key="tIndex">
          <div class="date-table-td date-table-first grey">{{tItem.name}}</div>
          <div class="date-table-td"
            :class="{
              grey: dIndex%2 === 1 && type ==='grey',
            }"
            v-html="(formatter&&formatter(classListJson[dItem.date+tItem.name])) || ''"
            v-for="(dItem, dIndex) in dateArr" :key="dIndex" @click="_cellClick(dItem, tItem)">
          </div>
        </div>
        <div class="date-table-tr" v-if="times.length === 0">
          <div class="date-table-td date-table-first grey" style="width: 100%;">暂无排班信息</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      times: {
        default: function () {
          return []
        }
      },
      data: {
        default: function () {
          return []
        }
      },
      curDate: {
        default: function () {
          var today = new Date()
          return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
        }
      },
      dateFormat: {
        default: 'yyyy-MM-dd'
      },
      formatter: {
        default: null
      },
      type: {
        default: 'grey'
      },
      debug: {
        default: false
      }
    },
    data: function () {
      return {
        dayArr: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        curTime: 0
      }
    },
    computed: {
      dateArr: function () {
        var arr = []
        var date = new Date(this.curTime)
        var dayIndex = date.getDay()
        var time = date.getTime()
        if(dayIndex == 0) {
            for (var i = 0; i < 7; i++) {
            arr.push({
              date: this._exchangeTimeToStr(time + (i - dayIndex + 1) * (24 * 3600 * 1000)-86400 * 7 * 1000),
              dayStr: this.dayArr[i],
              dayIndex: 0
            })
          }
        }else {
          for (var i = 0; i < 7; i++) {
          arr.push({
            date: this._exchangeTimeToStr(time + (i - dayIndex + 1) * (24 * 3600 * 1000)),
            dayStr: this.dayArr[i],
            dayIndex: 0
          })
        }
        }
        
        if (this.debug) {
          console.log('生成日期数组', arr)
        }
        this.$emit('dayLoaded', arr)
        return arr
      },
      classList: function () {
        var list = []
        if (this.debug) {
          console.log('传入数据', this.data)
        }
        this.dateArr.forEach((dateEle) => {
          this.times.forEach((timeEle) => {
            var ele = {
              date: dateEle,
              time: timeEle
            }
            this.data && this.data.forEach((d) => {
              if (d.dateName === dateEle.date && d.timeName === timeEle.name) {
                // console.log('d',d);
                ele.isVisual = d.dayTimeTeacher[0].isVisual
                this.$set(ele, 'data', d)
              }
            })
            list.push(ele)
          })
        })
        if (this.debug) {
          console.log('生成单元数组', list)
        }
        return list
      },
      classListJson: function () {
        var j = {}
        this.classList.forEach((cEle) => {
          j[(cEle.date.date + cEle.time.name)] = cEle
        })
        if (this.debug) {
          console.log('生成单元映射表', j)
        }
        return j
      }
    },
    methods: {
      _exchangeTimeToStr: function (time) {
        var d = new Date(time)
        return this._stringify(d, this.dateFormat)
      },
      _nextWeek: function () {
        this.curTime += 7 * 24 * 3600 * 1000
      },
      _preWeek: function () {
        this.curTime += (-7) * 24 * 3600 * 1000
      },
      _cellClick: function (dateItem, timeItem) {
        if (this.debug) {
          console.log(`点击单元格：${dateItem.date} ${timeItem.name}`, this.classListJson[dateItem.date + timeItem.name])
        }
        this.$emit('cellClick', this.classListJson[dateItem.date + timeItem.name])
      },
      _stringify: function (date, format) {
        if (!date) return ''
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        const hour = date.getHours()
        const minute = date.getMinutes()
        const second = date.getSeconds()
        var format1 = format || 'yyyy-MM-dd'
        var str = format1
          .replace(/yyyy/g, year)
          .replace(/MM/g, ('0' + month).slice(-2))
          .replace(/dd/g, ('0' + day).slice(-2))
          .replace(/yy/g, year)
          .replace(/M(?!a)/g, ('0' + month).slice(-2))
          .replace(/d/g, ('0' + day).slice(-2))
          .replace(/hh/g, ('0' + hour).slice(-2))
          .replace(/ii/g, ('0' + minute).slice(-2))
          .replace(/ss/g, ('0' + second).slice(-2))
        return str
      },
      _debugTip: function () {
        var tip = `
        格式要求：
        curDate: '2018-11-30'
        times:[{
          name: '08:00-09:00',
          ...
        }...]
        data:[{
          dateName: '2018-11-26',
          timeName: '10:00~11:00',
          ...
        }...]
        formatter: function(cell){/*
          单元格格式化内容
          cell为单元格对象
        */}
        `
        console.warn(tip)
      }
    },
    created: function () {
      this.curTime = (new Date(this.curDate.replace(/-/g, '/'))).getTime()
      if(this.debug) {
        this._debugTip()
      }
    },
    watch: {
      curDate: function (val) {
        this.curTime = (new Date(val.replace(/-/g, '/'))).getTime()
      }
    }
  }
</script>
<style lang="less">
.date-table-container {
  .date-table-div {
    width: 100%;
    overflow: hidden;
    border: 1px solid #e1e1e1;
    .date-table-head {
      width: 100%;
      height: 54px;
      background: #d0d8e6;
    }
    .date-table-tr {
      font-size: 14px;
      white-space: nowrap;
      border-top: 1px solid #e0e0e0;
      overflow: hidden;
      .date-table-th,
      .date-table-td {
        float: left;
        width: 12%;
        height: 54px;
        line-height: 54px;
        text-align: center;
        transition: all 0.3s ease-in-out;
        p {
          margin: 0;
          line-height: 20px;
          &.th-date{
            margin-top: 10px;
          }
        }
        &.grey {
          background: #f8f8f8;
        }
      }
      .date-table-first {
        width: 16%;
      }
    }
  }
}
</style>

