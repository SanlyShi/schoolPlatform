<template>
  <div v-if="curRoute === 'allStaff'" id="statistics-page" class="container-fluid">
    <div class="row text-center">
      <v-table :url="url" ref="myTable" pagesize="10" idField="id" :search="false" :order="true" :columnsControl="!queryData.isCollege" :columns="columns">
        <div slot="btn-group" role="group">
          <div class="btn-group pull-left">
            <v-select v-model="yearValue" :options="yearOptions" required='true' optionsLabel="label" optionsValue="value" @afterSelected="changeYear"></v-select>
            <v-select v-model="curbatchId" :options="termsOptions" required='true' style="margin-left:15px" optionsLabel="label" optionsValue="value"></v-select>
            <div class="box_flex flex_center date_picker_wrap">
              <div class="text" style="width:207px">考勤范围：</div>
              <el-date-picker v-model="dateArea" value-format="yyyy-MM-dd" :clearable='false' type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </div>
          </div>
          <div class="btn-group pull-right">
            <button type="button" @click="showCollegeChart()" v-if="queryData.isCollege" class="btn btn-bgColor-style clearBtnBorder">查看图表</button>
            <button type="button" @click="exportData" class="btn btn-bgColor-style clearBtnBorder">导出</button>
          </div>
        </div>
      </v-table>
    </div>
    <div class="row table_title">
      <div class="gray">{{title}},本页数据截止至前一天</div>
    </div>
    <!-- 模态框（Modal） -->
    <v-modal :show="showModal" effect="fade" width="720">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">
          学院考勤情况
        </h5>
      </div>
      <div slot="modal-body" class="modal-body college_chart_wrap" style="min-height:300px">
        <div class="box_flex flex_center date_picker_wrap">
          <el-date-picker v-model="dateArea" value-format="yyyy-MM-dd" :clearable='false' type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </div>
        <button class="btn submit-btn" v-if="!showMore" @click="showMoreRecord()">更多</button>
        <button class="btn submit-btn" v-else @click="showMoreRecord()">收起</button>
        <div class="box_flex flex_center ">
          <div ref="chartPanel" style="overflow-y:auto;width:700px" class="chart"></div>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn cancel-btn clearBtnBorder" @click="showModal = false">取消</button>
      </div>
    </v-modal>
  </div>
  <div v-else-if="curRoute === 'studentDetail'" class="chart_wrap">
    <recordChart :options="searchOptions" :dataRange="dateArea" :detail="recordDetail"></recordChart>
  </div>
  <div v-else-if="curRoute === 'classDetail'" class="chart_wrap">
    <classChart :options="searchOptions" :dataRange="dateArea" :detail="recordDetail"></classChart>
  </div>
  <div v-else-if="curRoute === 'courseDetail'" class="chart_wrap">
    <courseChart :options="searchOptions" :dataRange="dateArea" :detail="recordDetail"></courseChart>
  </div>
</template>

<script>
import Vue from 'vue'
import { request } from '../../assets/utils/utils.js'
import recordChart from './recordChart';
import classChart from './classChart';
import courseChart from './courseChart';
import echarts from "echarts";
import dateArea from './dateArea'
export default {
  mixins: [dateArea],
  created: function () {
    this.queryData = this.$route.query
    for (var i in this.selectOptions) {
      this.getSelectOptions(i)
    }
  },
  data: function () {
    return {
      queryData: {},
      title: '学生考勤情况统计',
      url: '',
      columns: [],
      yearOptions: [],
      recordDetail: {},
      showMore: false,
      yearValue: '',
      termsOptions: [],
      curbatchId: '',
      curRoute: 'allStaff',
      selectOptions: {
        grade: [],//年级
        educationLevel: [],//培养层次
        college: [],//学院
        classId: [],//班级
      },
      searchOptions: {
        grade: '',//年级
        educationLevel: '',//培养层次
        college: '',//学院
        classId: '',//班级
        dateStart: '',
        dateEnd: '',
      },
      showModal: false
    }
  },
  watch: {
    yearValue(newVal) {
      this.termsOptions = this.yearOptions.filter(o => {
        return o.value === newVal
      })[0].terms
      this.curbatchId = this.termsOptions[0].value
      if (!this.searchOptions.dateStart) {
        this.dateArea = [this.termsOptions[0].dateStart, this.termsOptions[0].dateEnd]
      }
    },
    curbatchId(newVal) {
      this.computedUrl()
    },
    searchOptions: {
      handler(newVal) {
        if (this.setTimeoutFun) {
          clearTimeout(this.setTimeoutFun)
        }
        this.setTimeoutFun = setTimeout(() => {//延缓执行,避免短时间内多次调用
          this.computedUrl()
          if(this.showModal){
            this.getPanelData()
          }
        }, 200)
      },
      deep: true
    }
  },
  methods: {
    exportData() {
      let url = '/downloads/ca/student/statistic/excel/' + this.curbatchId + '?'
      let params = {
        pageIndex: this.$refs.myTable.currentPageIndex,
        pageSize: this.$refs.myTable.pagesize,
      }
      let pageParams = this.$refs.myTable.tableSearchFields
      if (this.queryData.isClass) {//说明是班级 换个地址
        url = '/downloads/ca/class/statistic/excel/' + this.curbatchId + '?'
        this.title = '班级考勤情况统计'
      } else if (this.queryData.isCourse) {//说明是课程考勤 换个地址
        url = '/downloads/ca/course/statistic/excel/' + this.curbatchId + '?'
        this.title = '课程考勤情况统计'
      } else if (this.queryData.isCourse) {//说明是学院考勤 再再换个地址
        url = '/downloads/ca/college/statistic/excel/' + this.curbatchId + '?'
        this.title = '学院考勤情况统计'
      }
      url += 'filename=' + this.title + new Date().format('yyyy-MM-dd') + '&'
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
    afterSelectDateStart() {

    },
    showCollegeChart() {
      this.getPanelData()
      this.showModal = true
    },
    showMoreRecord() {
      this.showMore = !this.showMore
      this.getPanelData()
    },
    getPanelData() {
      let url = `api/ca/college/statistic/everyCollege/all?dateStart=${this.searchOptions.dateStart.split(' ')[0]}&dateEnd=${this.searchOptions.dateEnd.split(' ')[0]}`
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
          if (!this.showMore) {
            o.data = o.data.filter((a, index) => {
              return index < 10
            })
          }
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
    paserRateToOneLittleNum(rate) {
      if (rate.indexOf('%') !== -1) {
        let num = parseFloat(rate.replace('%', ''))
        let number = num * 10
        let floatNum = parseInt(number.toString().split('.')[0]) / 10
        if (floatNum.toString().indexOf('.') === -1) {//整数补0
          floatNum += '.0'
        }
        return floatNum + '%'
      } else {
        return rate
      }
    },
    paserIntOneLittleNum(num) {//保留一位小数
      if (num) {
        let number = num * 10
        console.log('k',parseInt(number.toString().split('.')[0]) / 10)
        return parseInt(number.toString().split('.')[0]) / 10
      } else {
        return num
      }
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
          axisTick: {
            show: false
          },
          inverse: true,
          data: yAxisData
        },
        series: series
      };
      this.myPanelChart.setOption(this.panelOptionData)
      this.myPanelChart.resize({
        height: this.panelChartHeight,
      })
    },
    afterSelectDateEnd() { },
    showDetail(record) {//查看考勤详情
      this.recordDetail = record
      if (this.queryData.isPerson) {
        this.curRoute = 'studentDetail'
      } else if (this.queryData.isClass) {
        this.curRoute = 'classDetail'
      } else if (this.queryData.isCourse) {
        this.curRoute = 'courseDetail'
      }
    },
    computedUrl() {
      let url = '/table-data/ca/student/statistic/page/' + this.curbatchId + '?'
      if (this.queryData.isClass) {//说明是班级 换个地址
        url = '/table-data/ca/class/statistic/page/' + this.curbatchId + '?'
      } else if (this.queryData.isCourse) {//说明是课程考勤 换个地址
        url = '/table-data/ca/course/statistic/page/' + this.curbatchId + '?'
      } else if (this.queryData.isCollege) {//说明是学院考勤 再再换个地址
        url = '/table-data/ca/college/statistic/page/' + this.curbatchId + '?'
      }
      for (let i in this.searchOptions) {
        if (i === 'dateStart') {
          url += i + '=' + this.searchOptions[i].split(' ')[0] + '&'
        } else if (i === 'dateEnd') {
          url += i + '=' + this.searchOptions[i].split(' ')[0] + '&'
        } else {
          url += i + '=' + this.searchOptions[i] + '&'
        }
      }
      this.url = url.substring(0, url.length - 1)
    },

    getSelectOptions(value) {
      let url = ''
      if (value === 'college') {
        url = '/api/colleges'
      } else if (value === 'classId') {
        url = '/api/relClass/classes/list'
      } else if (value === 'grade') {
        let nowYear = new Date().getFullYear()
        let num = 10
        let arr = []
        for (let i = 0; i < num; i++) {
          arr.push({
            label: nowYear - i + '',
            value: nowYear - i + ''
          })
        }
        this.selectOptions[value] = arr
        return
      } else if (value === 'educationLevel') {
        url = 'api/ca/dict?typeName=培养层次'
      }
      request(url).then(o => {
        this.selectOptions[value] = o.data
        if (this.selectOptions.classId && !this.hadInit) {//保证初始化的时候 班级已经存在了 
          this.hadInit = true
          this.getYearList()
        }
      })
    },
    initCollegeTable() {
      let that = this
      this.columns = [
        {
          id: "college",
          title: '学院',
          className: "text-left",
          hidden: false,
          search: {
            type: "select",
            data: {
              options: that.selectOptions.college,
              optionsLabel: 'name',
              optionsValue: 'code'
            }
          },
          formatter(record) {
            return record.collegeName
          }
        },
        {
          id: "rateOfAttendance",
          title: '出勤率',
          className: "text-left",
          hidden: false,
          sorting: true,
          sortType: '',
          width: 130,
          search: {
            type: "numberArea",
          },
          formatter(record) {
            return that.paserRateToOneLittleNum(record.rateOfAttendance)
          }
        },
        {
          id: "rateOfAskForLeave",
          title: '请假率',
          className: "text-left",
          hidden: false,
          sorting: true,
          sortType: '', width: 130,
          search: {
            type: "numberArea",
          },
          formatter(record) {
            return that.paserRateToOneLittleNum(record.rateOfAskForLeave)
          }
        },
        {
          id: "rateOfaAbsent",
          title: '缺勤率',
          className: "text-left",
          hidden: false,
          sorting: true,
          sortType: '', width: 130,
          search: {
            type: "numberArea",
          },
          formatter(record) {
            return that.paserRateToOneLittleNum(record.rateOfaAbsent)
          }
        },
      ]
    },
    initStudentTable() {
      let that = this
      this.columns = [
        {
          id: "name",
          title: '姓名',
          className: "text-left",
          hidden: false,
          search: {
            type: "input",
            data: {
              placeholder: ""
            }
          },
        },
        {
          id: "userNo",
          title: '学号',
          className: "text-left",
          hidden: false,
          search: {
            type: "input",
            data: {
              placeholder: ""
            }
          },
        },
        {
          id: "classId",
          title: '行政班级',
          className: "text-left",
          hidden: false,
          search: {
            type: "select",
            data: {
              options: that.selectOptions.classId,
              optionsLabel: 'text',
              optionsValue: 'id'
            }
          },
          formatter(record) {
            return record.className
          }
        },
        {
          id: "educationLevel",
          title: '培养层次',
          className: "text-left",
          hidden: true,
          search: {
            type: "select",
            data: {
              options: that.selectOptions.educationLevel,
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
              options: that.selectOptions.grade,
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
          id: "rateOfAttendance",
          title: '出勤率',
          className: "text-left",
          hidden: false,
          sorting: true,
          sortType: '', width: 130,
          search: {
            type: "numberArea",
          },
          formatter(record) {
            return that.paserRateToOneLittleNum(record.rateOfAttendance)
          }
        },
        {
          id: "rateOfAskForLeave",
          title: '请假率',
          className: "text-left",
          hidden: false,
          sorting: true,
          sortType: '', width: 130,
          search: {
            type: "numberArea",
          },
          formatter(record) {
            return that.paserRateToOneLittleNum(record.rateOfAskForLeave)
          }
        },
        {
          id: "rateOfaAbsent",
          title: '缺勤率',
          className: "text-left",
          hidden: false,
          sorting: true,
          sortType: '', width: 130,
          search: {
            type: "numberArea",
          },
          formatter(record) {
            return that.paserRateToOneLittleNum(record.rateOfaAbsent)
          }
        },
        {
          id: "opt",
          title: "操作",
          className: "text-center",
          width: "230px",
          formatter: function (obj) {
            return [
              {
                tag: "a",
                text: '查看',
                className: "opt-btn",
                callback: function (record, index) {
                  that.showDetail(record)
                }
              }
            ];
          }
        }]
    },
    initClassTable() {
      let that = this
      this.columns = [
        {
          id: "college",
          title: '学院',
          className: "text-left",
          hidden: false,
          search: {
            type: "select",
            data: {
              options: that.selectOptions.college,
              optionsLabel: 'name',
              optionsValue: 'code'
            }
          },
        },
        {
          id: "grade",
          title: '年级',
          className: "text-left",
          hidden: false,
          search: {
            type: "select",
            data: {
              options: that.selectOptions.grade,
              optionsLabel: 'label',
              optionsValue: 'value'
            }
          },
        },
        {
          id: "classId",
          title: '行政班级',
          className: "text-left",
          hidden: false,
          search: {
            type: "select",
            data: {
              options: that.selectOptions.classId,
              optionsLabel: 'text',
              optionsValue: 'id'
            }
          },
          formatter(record) {
            return record.className
          }
        },
        {
          id: "instructorId",
          title: '辅导员',
          className: "text-left",
          hidden: false,
          search: {
            type: "select",
            data: {
              url: '/api/ca/class/statistic/instructor/options',
              optionsLabel: 'label',
              optionsValue: 'value'
            }
          },
          formatter(record) {
            return record.instructor
          }
        },
        {
          id: "rateOfAttendance",
          title: '出勤率',
          className: "text-left",
          hidden: false,
          sorting: true,
          sortType: '', width: 130,
          search: {
            type: "numberArea",
          },
          formatter(record) {
            return that.paserRateToOneLittleNum(record.rateOfAttendance)
          }
        },
        {
          id: "rateOfAskForLeave",
          title: '请假率',
          className: "text-left",
          hidden: false,
          sorting: true,
          sortType: '', width: 130,
          search: {
            type: "numberArea",
          },
          formatter(record) {
            return that.paserRateToOneLittleNum(record.rateOfAskForLeave)
          }
        },
        {
          id: "rateOfaAbsent",
          title: '缺勤率',
          className: "text-left",
          hidden: false,
          sorting: true,
          sortType: '', width: 130,
          search: {
            type: "numberArea",
          },
          formatter(record) {
            return that.paserRateToOneLittleNum(record.rateOfaAbsent)
          }
        }, {
          id: "opt",
          title: "操作",
          className: "text-center",
          width: "230px",
          formatter: function (obj) {
            return [
              {
                tag: "a",
                text: '查看',
                className: "opt-btn",
                callback: function (record, index) {
                  that.showDetail(record)
                }
              }
            ];
          }
        }]
    },
    initCourseTable() {
      let that = this
      this.columns = [
        {
          id: "courseName",
          title: '课程名称',
          className: "text-left",
          hidden: false,
          search: {
            type: "input",
            data: {
              placeholder: ""
            }
          },
        },
        {
          id: "teacherId",
          title: '任课教师学工号',
          className: "text-left",
          hidden: false,
          search: {
            type: "input",
            data: {
              placeholder: ""
            }
          },
        },
        {
          id: "teacherName",
          title: '任课教师',
          className: "text-left",
          hidden: false,
          search: {
            type: "input",
            data: {
              placeholder: ""
            }
          }
        },
        {
          id: "rateOfAttendance",
          title: '出勤率',
          className: "text-left",
          hidden: false,
          sorting: true,
          sortType: '', width: 130,
          search: {
            type: "numberArea",
          },
          formatter(record) {
            return that.paserRateToOneLittleNum(record.rateOfAttendance)
          }
        },
        {
          id: "rateOfAskForLeave",
          title: '请假率',
          className: "text-left",
          hidden: false,
          sorting: true,
          sortType: '', width: 130,
          search: {
            type: "numberArea",
          },
          formatter(record) {
            return that.paserRateToOneLittleNum(record.rateOfAskForLeave)
          }
        },
        {
          id: "rateOfaAbsent",
          title: '缺勤率',
          className: "text-left",
          hidden: false,
          sorting: true,
          sortType: '', width: 130,
          search: {
            type: "numberArea",
          },
          formatter(record) {
            return that.paserRateToOneLittleNum(record.rateOfaAbsent)
          }
        }, {
          id: "signInCount",
          title: '已创建签到次数',
          className: "text-center",
          hidden: false,
          sorting: true,
          sortType: '', width: 220,
          search: {
            type: "numberArea",
          }
        }, {
          id: "opt",
          title: "操作",
          className: "text-center",
          width: "230px",
          formatter: function (obj) {
            return [
              {
                tag: "a",
                text: '查看',
                className: "opt-btn",
                callback: function (record, index) {
                  that.showDetail(record)
                }
              }
            ];
          }
        }]
    },
    getYearList() {
      let url = 'api/ca/courses/options/schoolYears'
      request(url).then(o => {
        if (o.state) {
          this.yearOptions = o.data
          o.data.forEach(a=>{
            a.terms.forEach(b=>{
              if(new Date(b.dateEnd)>new Date()&&new Date()>new Date(b.dateStart)){
                this.yearValue = a.value
              }
            })
          })
          //保证初始化的时候 学年已经存在
          if (this.queryData.isPerson) {//学生
            this.initStudentTable()
          } else if (this.queryData.isClass) {//班级
            this.initClassTable()
          } else if (this.queryData.isCourse) {//课程
            this.initCourseTable()
          } else if (this.queryData.isCollege) {//学院
            this.initCollegeTable()
          }
        }
      })
    }
  },
  components: {
    recordChart,
    classChart,
    courseChart
  }
}
</script>
<style lang="less" >
#statistics-page {
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12);
  .table_title {
    font-weight: normal;
    background: white;
    padding: 0 24px 20px;
    text-align: left;
    .gray {
      color: rgba(0, 0, 0, 0.54);
    }
  }
  .table-container {
    box-shadow: none;
  }
}
.college_chart_wrap {
  position: relative;
  .date_center {
    width: 60px;
    text-align: center;
  }
  .picker_wrap {
    width: 400px;
    margin-bottom: 10px;
  }
  .btn {
    &.submit-btn {
      position: fixed !important;
      right: 20px;
      top: 154px;
      z-index: 11;
    }
  }
}

.chart_wrap {
  height: 100%;
  & > div {
    height: 100%;
    .chart_page {
      height: 100%;
    }
  }
}
.pull-left {
  .text {
    width: 160px;
    text-align: right;
    font-weight: normal;
  }
  .date_center {
    width: 40px;
    font-weight: normal;
  }
}
.date_picker_wrap {
  font-weight: normal;
  .el-input__inner {
    height: 32px;
    border: 1px solid #d9d9d9;
    .el-range-input {
    }
    .el-range-separator,
    .el-input__icon {
      line-height: 24px;
      width: 24px;
    }
  }
}
</style>
