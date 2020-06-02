
<template>
  <div>
    <a type="button" @click="back()" class="box_flex align_center back_wrap">
      <i class="maticon back-icon-btn" v-html="icons('arrow_back')">arrow_back</i><span class="nav-title">返回</span>
    </a>
    <div id="courseChart-page" class="chart_page">
      <!-- 模态框（Modal） -->

      <div class="box_flex" style="padding:10px 0 0;">
        <div class="name">{{detail.courseName}}</div>
        <div class="userNum">{{detail.teacherName}}</div>
      </div>
      <div class="tab-div">
        <div class="tab" v-for="(tab, index) in classTabList" :key="index" :class="courseClassId===tab.id? 'active' : ''" :title="tab.className" @click="courseClassId=tab.id">{{tab.className}}</div>
      </div>
      <div class="main_wrap" v-if="curRoute==='chart'">
        <div class="box_flex box_between">
          <div class="flex">
            <div class="box_flex flex_center date_picker_wrap">
              <el-date-picker v-model="dateArea" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </div>
            <div v-if="curTab==='2'" class="box_flex flex_center date_picker_wrap">
              <div style="width:100px;text-align:center">对比</div>
              <el-date-picker v-model="dateArea2" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </div>
          </div>
          <div class="btn-tab">
            <button class="btn clearBtnBorder submit-btn" v-for="(tab, index) in tabList" :key="index" :class="curTab===tab.id? 'btn-bgColor-style' : ''" :title="tab.name" @click="selectTab(tab.id)">{{tab.name}}</button>
          </div>
        </div>
        <div v-show="curTab==='1'" class="box_flex flex_center chart_wrap">
          <div ref="line" style="width:100%;" class="chart"></div>
        </div>
        <div v-show="curTab==='2'" class="box_flex flex_center chart_wrap">
          <div ref="bar" style="width:100%;" class="chart"></div>
        </div>
        <div v-show="curTab==='3'" class="box_flex flex_center chart_wrap radiobox_wrap">
          <div ref="chartPanel" style="overflow-y:auto;width:800px" class="chart"></div>
        </div>
      </div>
      <div v-else>
        <v-table :url="studentTableUrl" ref="myTable" pagesize="10" idField="id" :search="false" :columnsControl="true" :order="true" :columns="studentColumns">
          <div slot="btn-group" role="group">
            <div class="btn-group pull-right">
              <button class="btn clearBtnBorder btn-bgColor-style" v-for="(tab, index) in sutdentTabList" :key="index" :title="tab.name" @click="selectStudentTab(tab.id)">{{tab.name}}</button>
            </div>
          </div>
        </v-table>
      </div>
    </div>
  </div>

</template>

<script>
import echarts from "echarts";
import { request } from '../../assets/utils/utils';
import radiobox from '../../components/VRadiobox'
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
      myBarChart: '',
      curRoute: 'chart',
      type: 'bar',
      optionData: {

      },
      studentColumns: [],
      searchOptions: {
        dateStart: '',
        dateEnd: '',
        dateStart2: '',
        dateEnd2: '',
      },
      panelChartHeight: 450,
      recordDetail: {},
      curTab: '1',
      powerTabList: [],
      tabList: [
        { name: '总览', id: '1' },
        { name: '按时间对比', id: '2' },
        { name: '按班级对比', id: '3' },
        { name: '切换到学生维度', id: '4' }
      ],
      sutdentTabList: [
        { name: '切换到课程维度', id: '5' },
        { name: '导出', id: '6' }
      ],
      classTabList: [],
      courseClassId: '',
    }
  },
  computed: {
    studentTableUrl() {
      return `/table-data/ca/course/statistic/students/page/${this.courseClassId}`
    }
  },
  watch: {
    options(newVal) {
      this.searchOptions = JSON.parse(JSON.stringify(newVal))
    },
    searchOptions: {
      handler(newVal) {
        if (this.courseClassId) {
          this.selectTab(this.curTab);//
        }
      },
      deep: true
    },
    courseClassId(newVal) {
      this.selectTab(this.curTab);//
    }
  },
  created() {
    let searchOptions = JSON.parse(JSON.stringify(this.options))
    searchOptions.dateStart2 = searchOptions.dateStart
    searchOptions.dateEnd2 = searchOptions.dateEnd
    this.searchOptions = searchOptions
    this.recordDetail = this.detail
    this.getClassTabList()
    this.initStudentTable()
  },
  mounted() {
  },
  methods: {
    exportData() {
      let url = `/downloads/ca/course/statistic/students/excel/${this.courseClassId}?`
      let params = {
        pageIndex: this.$refs.myTable.currentPageIndex,
        pageSize: this.$refs.myTable.pagesize,
      }
      let pageParams = this.$refs.myTable.tableSearchFields
      url += 'filename=学生签到统计' + new Date().format('yyyy-MM-dd') + '&'
      for (let i in this.searchOptions) {
        url += i + '=' + this.searchOptions[i] + '&'
      }
      for (let i in this.params) {
        url += i + '=' + this.searchOptions[i] + '&'
      }
      for (let i in this.pageParams) {
        url += i + '=' + this.searchOptions[i] + '&'
      }
      url = url.substring(0, url.length - 1)
      window.location.href = url
    },
    initStudentTable() {
      let that = this
      this.studentColumns = [
        {
          id: "name",
          title: '姓名',
          className: "text-left",
          hidden: false,
        },
        {
          id: "userNo",
          title: '学号',
          className: "text-left",
          hidden: false
        },
        {
          id: "college",
          title: '学院',
          className: "text-left",
          hidden: true,
          search: {
            type: "select",
            data: {
              options: that.$parent.selectOptions.college,
              optionsLabel: 'name',
              optionsValue: 'code'
            }
          },
          formatter(record) {
            return record.collegeName
          }
        }, {
          id: "educationLevel",
          title: '培养层次',
          className: "text-left",
          hidden: true,
          search: {
            type: "select",
            data: {
              options: that.$parent.selectOptions.educationLevel,
              optionsLabel: 'label',
              optionsValue: 'value'
            }
          }
        },
        {
          id: "grade",
          title: '年级',
          className: "text-left",
          hidden: true,
          search: {
            type: "select",
            data: {
              options: that.$parent.selectOptions.grade,
              optionsLabel: 'label',
              optionsValue: 'value'
            }
          }
        },
        {
          id: "department",
          title: '系别',
          className: "text-left",
          hidden: true,
          search: {
            type: "select",
            data: {
              url: '/api/ca/unit/department/options',
              optionsLabel: 'name',
              optionsValue: 'code'
            }
          }
        },
        {
          id: "classId",
          title: '行政班级',
          className: "text-left",
          hidden: false,
          search: {
            type: "select",
            data: {
              options: that.$parent.selectOptions.classId,
              optionsLabel: 'text',
              optionsValue: 'id'
            }
          },
          formatter(record) {
            return record.className
          }
        },
        {
          id: "rateOfAttendance",
          title: '出勤率',
          className: "text-center",
          hidden: false,
          sorting: true,
          sortType: '',
          search: {
            type: "numberArea",
          }
        },
        {
          id: "rateOfAskForLeave",
          title: '请假率',
          className: "text-center",
          hidden: false,
          sorting: true,
          sortType: '',
          search: {
            type: "numberArea",
          }
        },
        {
          id: "rateOfaAbsent",
          title: '缺勤率',
          className: "text-center",
          hidden: false,
          sorting: true,
          sortType: '',
          search: {
            type: "numberArea",
          }
        }]
    },
    getClassTabList() {
      let url = `api/ca/person/classes/${this.recordDetail.courseId}`
      request(url).then(o => {
        if (o.state) {
          this.classTabList = o.data
          if (this.classTabList.length) {
            this.courseClassId = this.classTabList[0].id
          } else {
            $toast('没有课程班级你想看什么?')
          }
        } else {
          this.$toast(o.message)
        }
      })
    },
    afterSelectDateStart() { },
    afterSelectDateEnd() { },
    back() {
      this.$parent.curRoute = 'allStaff'
    },
    selectTab(id) {
      if (id === '1') {//折线图
        this.getLineData()
      } else if (id === '2') {
        this.getBarData()
      } else if (id === '3') {
        this.getPanelData()
      } else if (id === '4') {//学生维度
        this.curRoute = 'student'
        return
      }
      this.curTab = id;
    },
    selectStudentTab(id) {
      console.log('id', id)
      if (id === '5') {//课程维度
        this.curRoute = 'chart'
        this.selectTab(this.curTab)
      } else if (id === '6') {//导出
        this.exportData()
      }
    },
    getLineData() {
      let url = `api/ca/course/statistic/courseClass/${this.courseClassId}/everySignIn?dateStart=${this.searchOptions.dateStart.split(' ')[0]}&dateEnd=${this.searchOptions.dateEnd.split(' ')[0]}`
      request(url).then(o => {
        if (o.state && o.data) {
          let attendArr = []
          let askForLeaveArr = []
          let aAbsentArr = []
          let data = o.data.map(a => {
            attendArr.push(a.rateOfAttendance)
            askForLeaveArr.push(a.rateOfAskForLeave)
            aAbsentArr.push(a.rateOfaAbsent)
            return a.name
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
      let url = `api/ca/course/statistic/everyCourseClass/${this.recordDetail.courseId}?dateStart=${this.searchOptions.dateStart.split(' ')[0]}&dateEnd=${this.searchOptions.dateEnd.split(' ')[0]}`
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
            return a.name
          })
          this.initPanelChart(yAxisData, series)
        } else {
          this.$toast(o.message)
        }
      })
    },
    getBarData() {
      let url1 = `api/ca/course/statistic/courseClass/single/doubleDate/${this.courseClassId}?dateStart=${this.searchOptions.dateStart.split(' ')[0]}&dateEnd=${this.searchOptions.dateEnd.split(' ')[0]}`
      let url2 = `api/ca/course/statistic/courseClass/single/doubleDate/${this.courseClassId}?dateStart=${this.searchOptions.dateStart2.split(' ')[0]}&dateEnd=${this.searchOptions.dateEnd2.split(' ')[0]}`
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
    paserIntOneLittleNum(num) {//保留一位小数
      let number = num * 10
      return parseInt(number.toString().split('.')[0]) / 10
    },
    initBarChart(source) {
      this.myBarChart = echarts.init(this.$refs.bar)
      this.barOptionData = {
        legend: {
          y: 'bottom',
        },
        tooltip: {
          formatter: function (params) {
            let res = params.value[params.seriesIndex + 1] + '%'
            return res
          }
        },
        dataset: {
          source: source
        },
        color: ["#69CDF9", "#FFDB5C", "#FF7E9D", "#A0E6B7"],
        xAxis: {
          axisTick: {
            show: false
          },
          type: 'category'        },
        yAxis: {
          axisTick: {
            show: false
          },
        },
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [
          { type: 'bar' },
          { type: 'bar' },
          { type: 'bar' }
        ]
      };
      this.myBarChart.setOption(this.barOptionData)
    },
    initLineChart(data, series) {
      this.lineChart = echarts.init(this.$refs.line)
      this.lineOptionData = {
        title: {
          text: ''
        },
        legend: {
          data: ['出勤', '请假', '缺勤']
        },
        color: ["#69CDF9", "#FFDB5C", "#FF7E9D", "#A0E6B7"],
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
  },
  components: {
    radiobox
  }
}
</script>

<style lang="less" scoped>
#courseChart-page {
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12);
  .back {
    cursor: pointer;
    margin-left: 0px;
  }
  .table_title {
    font-weight: normal;
    background: white;
    padding: 20px 20px 20px;
    text-align: left;
    .gray {
      font-size: 12px;
      color: #909399;
    }
  }
  .table-container {
    box-shadow: none;
  }
  background: white;
  padding: 20px;
  .radiobox_wrap {
    position: relative;
    .radio_box {
      position: absolute;
      top: 20px;
      right: 20px;
    }
  }
  .chart::-webkit-scrollbar {
    width: 10px;
    height: 10px;
    background-color: #f5f5f5;
  }

  /*定义滚动条轨道 内阴影+圆角*/
  .chart::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 0px rgba(0, 0, 0, 0.3); //内阴影
    border-radius: 10px;
    background-color: #f7f7f7;
  }

  /*定义滑块 内阴影+圆角*/
  .chart::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 0px rgba(0, 0, 0, 0.3); //内阴影
    background-color: #e6e6e6;
  }

  .userNum,
  .name {
    font-size: 15px;
    height: 30px;
    line-height: 30px;
    margin-right: 20px;
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
    padding-right: 30px;
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
      width: 360px;
    }
    padding: 20px;
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

