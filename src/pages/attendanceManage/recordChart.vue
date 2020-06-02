
<template>
  <div>
    <a type="button" @click="back()" class="box_flex align_center back_wrap">
      <i class="maticon back-icon-btn" v-html="icons('arrow_back')">arrow_back</i><span class="nav-title">返回</span>
    </a>
    <div id="recordChart-page" class="chart_page">
      <!-- 模态框（Modal） -->
      <div class="box_flex" style="padding:10px 0;">
        <div class="name">{{detail.name}}</div>
        <div class="userNum">{{detail.userNo}}</div>
      </div>
      <div class="main_wrap">
        <div class="box_flex box_between">
          <div class="flex">
            <div class="box_flex flex_center date_picker_wrap">
              <el-date-picker v-model="dateArea" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </div>
            <div v-if="curTab==='3'" class="box_flex flex_center date_picker_wrap">
              <div style="width:100px;text-align:center">对比</div>
              <el-date-picker v-model="dateArea2" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </div>
          </div>
          <div class="btn-tab">
            <div class="btn clearBtnBorder submit-btn" v-for="(tab, index) in tabList" :key="index" :class="curTab===tab.id? 'btn-bgColor-style' : ''" :title="tab.name" @click="selectTab(tab.id)">{{tab.name}}</div>
          </div>
        </div>

        <div v-show="curTab==='1'" class="box_flex flex_center chart_wrap">
          <div ref="pie" style="width:100%;" class="chart"></div>
        </div>
        <div v-show="curTab==='2'" class="box_flex flex_center chart_wrap">
          <div ref="line" style="width:100%;" class="chart"></div>
        </div>
        <div v-show="curTab==='3'" class="box_flex flex_center chart_wrap">
          <div ref="bar" style="width:100%;" class="chart"></div>
        </div>
        <div v-show="curTab==='4'" class="box_flex flex_center chart_wrap">
          <div ref="chartPanel" class="chart"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import { request } from '../../assets/utils/utils';
import dateArea from './dateArea'
export default {
  mixins: [dateArea],
  props: {
    detail: {
      default() {
        return {}
      }
    },
    options: {
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      myPanelChart: '',
      myPieChart: '',
      type: 'pie',
      optionData: {

      },
      searchOptions: {
        dateStart: '',
        dateEnd: '',
        dateStart2: '',
        dateEnd2: '',
      },
      recordDetail: {},
      curTab: '1',
      tabList: [
        { name: '总览', id: '1' },
        { name: '时间维度', id: '2' },
        { name: '课程维度', id: '4' },
        { name: '按时间对比', id: '3' },
      ]
    }
  },
  computed: {},
  watch: {
    options(newVal) {
      this.searchOptions = JSON.parse(JSON.stringify(newVal))
    },
    searchOptions: {
      handler(newVal) {
        this.selectTab(this.curTab);//
      },
      deep: true
    }
  },
  created() {
    let searchOptions = JSON.parse(JSON.stringify(this.options))
    searchOptions.dateStart2 = searchOptions.dateStart
    searchOptions.dateEnd2 = searchOptions.dateEnd
    this.searchOptions = searchOptions
    this.recordDetail = this.detail
  },
  mounted() {
  },
  methods: {
    afterSelectDateStart() { },
    afterSelectDateEnd() { },
    back() {
      this.$parent.curRoute = 'allStaff'
    },
    selectTab(id) {
      this.curTab = id;
      if (id === '1') {
        this.getPieData()
      } else if (id === '2') {
        this.getLineData()
      } else if (id === '3') {
        this.getBarData()
      } else if (id === '4') {
        this.getPanelData()
      }
    },
    getBarData() {
      let url1 = `api/ca/student/statistic/single/all?uId=${this.recordDetail.userId}&dateStart=${this.searchOptions.dateStart.split(' ')[0]}&dateEnd=${this.searchOptions.dateEnd.split(' ')[0]}`
      let url2 = `api/ca/student/statistic/single/all?uId=${this.recordDetail.userId}&dateStart=${this.searchOptions.dateStart2.split(' ')[0]}&dateEnd=${this.searchOptions.dateEnd2.split(' ')[0]}`
      let data1 = {
        rateOfAttendance: 0,
        rateOfAskForLeave: 0,
        rateOfaAbsent: 0,
      }
      let data2 = {
        rateOfAttendance: 0,
        rateOfAskForLeave: 0,
        rateOfaAbsent: 0,
      }
      request(url1).then(o => {
        if (o.state && o.data) {
          data1 = o.data
          request(url2).then(o => {
            if (o.state && o.data) {
              data2 = o.data
              let source = [
                ['product', '出勤率', '请假率', '缺勤率'],
                [this.searchOptions.dateStart.split(' ')[0] + '至' + this.searchOptions.dateEnd.split(' ')[0], data1.rateOfAttendance, data1.rateOfAskForLeave, data1.rateOfaAbsent],
                [this.searchOptions.dateStart2.split(' ')[0] + '至' + this.searchOptions.dateEnd2.split(' ')[0], data2.rateOfAttendance, data2.rateOfAskForLeave, data2.rateOfaAbsent]
              ]
              this.initBarChart(source)
            }
          })
        }
      })
    },
    initBarChart(source) {
      this.myBarChart = echarts.init(this.$refs.bar)
      this.barOptionData = {
        legend: {
          y: 'bottom',
        },
        dataset: {
          source: source
        },
        tooltip: {
          formatter: function (params) {
            let res = params.value[params.seriesIndex + 1] + '%'
            return res
          }
        },
        color: ["#69CDF9", "#FFDB5C", "#FF7E9D", "#A0E6B7"],
        xAxis: {
          axisTick: {
            show: false
          },
          type: 'category'
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        series: [
          { type: 'bar' },
          { type: 'bar' },
          { type: 'bar' }
        ]
      };
      this.myBarChart.setOption(this.barOptionData)
    },
    getPieData() {
      let url = `api/ca/student/statistic/single/all?uId=${this.recordDetail.userId}&dateStart=${this.searchOptions.dateStart.split(' ')[0]}&dateEnd=${this.searchOptions.dateEnd.split(' ')[0]}`
      request(url).then(o => {
        if (o.state) {
          let data = [{
            value: 0,
            name: '出勤'
          },
          {
            value: 0,
            name: '请假'
          },
          {
            value: 0,
            name: '缺勤'
          }
          ]
          let rateOfAttendance = 0
          if (o.data) {
            data[0].value = o.data.countOfAttendance
            data[1].value = o.data.countOfAskForLeave
            data[2].value = o.data.countOfaAbsent
            rateOfAttendance = o.data.rateOfAttendance
          }

          this.initPieChart(data, rateOfAttendance)
        } else {
          this.$toast(o.message)
        }
      })
    },
    getLineData() {
      let url = `api/ca/student/statistic/everyday/all?uId=${this.recordDetail.userId}&dateStart=${this.searchOptions.dateStart.split(' ')[0]}&dateEnd=${this.searchOptions.dateEnd.split(' ')[0]}`
      request(url).then(o => {
        if (o.state && o.data) {
          let attendArr = []
          let askForLeaveArr = []
          let aAbsentArr = []
          let data = o.data.map(a => {
            attendArr.push(this.paserIntOneLittleNum(a.rateOfAttendance))
            askForLeaveArr.push(this.paserIntOneLittleNum(a.rateOfAskForLeave))
            aAbsentArr.push(this.paserIntOneLittleNum(a.rateOfaAbsent))
            return a.date
          })

          let series = [
            {
              name: '出勤',
              type: 'line',
              data: attendArr
            },
            {
              name: '请假',
              type: 'line',
              data: askForLeaveArr
            },
            {
              name: '缺勤',
              type: 'line',
              data: aAbsentArr
            },
          ]
          this.initLineChart(data, series)
        } else {
          this.$toast(o.message)
        }
      })

    },
    getPanelData() {
      let url = `api/ca/student/statistic/everyCourse/all?uId=${this.recordDetail.userId}&dateStart=${this.searchOptions.dateStart.split(' ')[0]}&dateEnd=${this.searchOptions.dateEnd.split(' ')[0]}`
      request(url).then(o => {
        if (o.state && o.data) {
          let series = [{
            name: '出勤',
            type: 'bar',
            stack: '总量',
            barCategoryGap: 15,
            label: {
              normal: {
                show: true,
                position: 'insideRight',
                formatter: function (param) {
                  if (param.value == 0) {
                    return ''
                  } else {
                    return param.value
                  }
                },
              }
            },
            data: []
          },
          {
            name: '请假',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: false,
                position: 'insideRight'
              }
            },
            data: []
          },
          {
            name: '缺勤',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: false,
                position: 'insideRight'
              }
            },
            data: []
          },
          ]
          this.panelChartHeight = 82 + o.data.length * 33
          // if (this.panelChartHeight < 450) {
          //   this.panelChartHeight = 450
          // }
          let yAxisData = o.data.map(a => {
            series[0].data.push(this.paserIntOneLittleNum(a.rateOfAttendance))
            series[1].data.push(this.paserIntOneLittleNum(a.rateOfAskForLeave))
            series[2].data.push(this.paserIntOneLittleNum(a.rateOfaAbsent))
            return a.courseName
          })
          this.initPanelChart(yAxisData, series)
        } else {
          this.$toast(o.message)
        }
      })
    },
    paserIntOneLittleNum(num) {//保留一位小数
      let number = num * 10
      return parseInt(number.toString().split('.')[0]) / 10
    },
    initPieChart(data, rateOfAttendance) {
      this.myPieChart = echarts.init(this.$refs.pie)
      this.pieOptionData = {
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        graphic: [{ //环形图中间添加文字
          type: 'text', //通过不同top值可以设置上下显示
          left: 'center',
          top: '45%',
          style: {
            text: parseInt(rateOfAttendance) + '%',
            textAlign: 'center',
            fill: '#303133', //文字的颜色
            width: 30,
            height: 30,
            fontSize: '50',
            fontFamily: "Microsoft YaHei"
          }
        }, { //环形图中间添加文字
          type: 'text', //通过不同top值可以设置上下显示
          left: 'center',
          top: '58%',
          style: {
            text: '出勤率',
            textAlign: 'center',
            fill: 'gray', //文字的颜色
            width: 30,
            height: 30,
            fontSize: 18,
            fontFamily: "Microsoft YaHei"
          }
        }],
        legend: {
          orient: 'vertical',
          x: 'right',
          data: ['出勤', '请假', '缺勤']
        },
        color: ["#69CDF9", "#FFDB5C", "#FF7E9D", "#A0E6B7"],
        series: [{
          name: '整体出勤情况',
          type: 'pie',
          radius: ['50%', '70%'],
          center: ['50%', '50%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: 'center'
            },
            emphasis: {
              show: false,
              textStyle: {
                fontSize: '30',
                fontWeight: 'bold'
              }
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: data
        }]
      }
      this.myPieChart.setOption(this.pieOptionData)
    },
    initLineChart(data, series) {
      this.lineChart = echarts.init(this.$refs.line)
      this.lineOptionData = {
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            console.log(params)
            let str = ''
            params.forEach(o => {
              str += o.marker + o.seriesName + ':' + o.data + '%' + '</br>'
            })
            return str
          }
        },
        color: ["#69CDF9", "#FFDB5C", "#FF7E9D", "#A0E6B7"],
        legend: {
          data: ['出勤', '请假', '缺勤']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisTick: {
            show: false
          },
          data: data
        },
        yAxis: {
          axisTick: {
            show: false
          },
          type: 'value'
        },
        series: series
      };

      this.lineChart.setOption(this.lineOptionData)
    },
    initPanelChart(yAxisData, series) {
      this.myPanelChart = echarts.init(this.$refs.chartPanel)
      this.panelOptionData = {
        title: {
          text: "",
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function (params) {
            let res = params[0].name + '<br/>'
            params.map(item => {
              res += `${item.seriesName}:${item.data}%<br/>`
            })
            return res
          }
        },
        legend: {
          y: '10',
          data: ['出勤', '请假', '缺勤']
        },
        color: ["#69CDF9", "#FFDB5C", "#FF7E9D", "#A0E6B7"],

        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          position: 'top',
          type: 'value',
          axisTick: {
            show: false
          },
          axisLabel: {
            formatter: '{value} %'
          }
        },
        yAxis: {
          type: 'category',
          inverse: true,//倒序
          axisTick: {
            show: false
          },
          data: yAxisData
        },
        series: series
      };
      this.myPanelChart.setOption(this.panelOptionData)
      this.myPanelChart.resize({
        height: this.panelChartHeight,
      })
    }
  }
}
</script>

<style lang="less" scoped>
#recordChart-page {
  background: white;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12);
  padding: 20px;
  .back {
    cursor: pointer;
    margin-left: 0px;
  }
  .name {
    width: 120px;
    text-align: left;
  }
  .userNum,
  .name {
    font-size: 15px;
    height: 30px;
    line-height: 30px;
  }
  .flex {
    display: flex;
    align-items: center;
  }
  .flex-sb {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .title-date {
    margin-right: 20px;
  }
  .chart {
    width: 600px;
    height: 100%;
  }
  .date_center {
    width: 60px;
    text-align: center;
  }
  .main_wrap {
    height: 85%;
    .chart_wrap{
      height: 90%;
    }
    .picker_wrap {
      width: 400px;
    }
  }
  .tab-div {
    position: relative;
    height: 40px;
    margin: 10px 0px 0;
    background: white;
    white-space: nowrap;
    border-bottom: 1px solid #f0f0f0;
    .apply-container {
      position: absolute;
      right: 0;
    }
    .tab-list {
      position: relative;
      .gm-scroll-view {
        padding-right: 200px;
      }
    }
    .tab {
      display: inline-block;
      // max-width: 200px;
      width: 150px;
      padding: 0 20px;
      font-size: 13px;
      color: rgba(0, 0, 0, 0.54);
      line-height: 40px;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      border-bottom: 2px solid transparent;
      cursor: pointer;
      vertical-align: top;
      &.tab-node {
        line-height: 20px;
        p {
          margin: 0;
          text-align: left;
        }
      }
      &:hover,
      &.active {
        color: #298df7;
        border-bottom: 2px solid #298df7;

        height: 40px;
      }
      margin-right: -4px;
    }
  }
}
</style>

