<template>
  <div class="statistics_wrap box_flex flex_column column">
    <div class="tab-div flex_shrink" style="margin-top:0">
      <div v-for="(tab,index) in tabList" :key="index" class="tab" :class="tab.id===curTab ? 'active' : ''" @click="curTab = tab.id">{{tab.name}}</div>
    </div>
    <div class="top box_flex flex_wrap flex_shrink">
      <div class="box_flex align_center select_wrap" v-for="(item,index) in selectList" :key="index">
        <span class="text">{{item.name}}</span>
        <v-select v-model="selectValues[item.field]" :multiple="item.multiple" :required="item.required" :options="item.options" :options-value="item.valueField" :options-label="item.labelField" @afterSelected="checkValue()"></v-select>
      </div>
      <div class="button_wrap box_flex">
        <button class="reSet box_flex align_center" style="margin-right:18px">
          <img src="../../../static/image/icon_resetting.png" class="reset_icon" />
          <div @click="_reset()">重置</div>
        </button>
        <button class="search">搜索</button>
      </div>
    </div>
    <div class="main grow_1 box_flex column">
      <div class="box_flex flex_between align_center flex_shrink" style="padding: 5px;padding-top:15px;">
        <!-- <div class="tab" :class="isEchart ? 'active' : ''" title="图形" @click="isEchart = true">图形</div>
        <div class="tab" :class="!isEchart ? 'active' : ''" title="表格" @click="isEchart = false">表格</div> -->
        <div class="radio_wrap">
          <radioBox :radioList="radioList" :needMargin="true" v-model="chartTypeEnum"></radioBox>
        </div>
        <div class="box_flex align_center">
          <div v-if="!isEchart" class="icon_chart box_flex flex_center" @click="isEchart=!isEchart">
            <img src="../../../static/image/icon_chart_blue.png" alt="">
          </div>
          <div v-else class="bg_blue icon_chart box_flex flex_center">
            <img src="../../../static/image/icon_chart_white.png" alt="">
          </div>
          <div v-if="isEchart" class="icon_table box_flex flex_center" @click="isEchart=!isEchart">
            <img src="../../../static/image/icon_table_blue.png" alt="">
          </div>
          <div v-if="!isEchart" class="bg_blue icon_table box_flex flex_center">
            <img src="../../../static/image/icon_table_white.png" alt="">
          </div>
        </div>
      </div>
      <div class="chart_wrap grow_1" v-if="isEchart">
        <div v-if="chartData.length">
          <div ref="lineEcharts" class="chart">
          </div>
        </div>
        <div v-else class="box_flex flex_center">
          <div style="width:320px">
            <img style="width:100%;" src="../../../static/image/empty_data.png" alt="">
            <div style="width:100%;text-align:center">暂无数据呦~</div>
          </div>
        </div>
      </div>
      <div v-else class="grow_1">
        <v-table id="data_table" :rows=tableRows :fill="true" :pagesize="8" idField="id" :order="true" :columns="columns">
          <div slot="btn-group" role="group">
            <div class="btn-group pull-right">
              <button type="button" class="btn btn-bgColor-style clearBtnBorder" @click="exportExcel()">导出</button>
            </div>
          </div>
        </v-table>
      </div>
    </div>
  </div>
</template>
<script>
import { request } from '../../assets/utils/utils';
import radioBox from '../../components/VRadiobox'
import echarts from 'echarts/lib/echarts'
export default {
  data: function () {
    let nowYear = new Date().getFullYear()
    let yearList = []
    for (let i = 0; i < 5; i++) {
      yearList.push({
        value: (nowYear - i) + '',
        name: (nowYear - i) + ''
      })
    }
    return {
      selectValues: {
        year: '',
        division: '',
        province: '',
        enrollWay: '',
        majorName: '',
        educationLevel: '',
      },
      chartTypeEnum: 'YEAR',
      selectList: [
        {
          field: 'year',
          options: yearList,
          name: '录取年份',
          valueField: 'value',
          labelField: 'name',
          required: false,
          multiple: true,
        },
        {
          field: 'division',
          options: [],
          name: '科类',
          url: '/api/archives/demo/getSysDict?name=科类',
          valueField: 'name',
          labelField: 'name',
          required: false,
        },
        {
          field: 'province',
          options: [],
          name: '生源地',
          url: '/api/archives/statistic/getOptionsProvince',
          valueField: 'label',
          labelField: 'label',
          required: false,
          formatter(o) {
            return {
              label: o,
              value: o,
            }
          }
        },
        {
          field: 'enrollWay',
          options: [],
          name: '录取方式',
          url: '/api/archives/demo/getSysDict?name=录取方式',
          valueField: 'name',
          labelField: 'name',
          multiple: true,
        },
        {
          field: 'majorName',
          options: [],
          name: '录取专业',
          url: '/api/archives/demo/getSysDict?name=录取专业',
          valueField: 'name',
          labelField: 'name',
          multiple: true,
        },
        {
          field: 'educationLevel',
          options: [],
          name: '培养层次',
          url: '/api/archives/demo/getSysDict?name=培养层次',
          valueField: 'name',
          labelField: 'name',
          multiple: true,
        },
      ],
      tabList: [{ name: '录取人数', id: 'person' }],
      curTab: 'person',
      radioList: [
        {
          name: '区分年份',
          id: 'YEAR'
        },
        {
          name: '区分科类',
          id: 'DIVISION'
        },
        {
          name: '区分录取方式',
          id: 'ENROLLWAY'
        },
        {
          name: '区分培养层次',
          id: 'EDUCATIONLEVEL'
        },
        {
          name: '区分专业',
          id: 'MAJORNAME'
        }
      ],
      radioKeys: {
        'YEAR': 0,
        'DIVISION': 1,
        'ENROLLWAY': 2,
        'EDUCATIONLEVEL': 3,
        'MAJORNAME': 4,
      },
      tableUrl: '',
      isEchart: true,
      chartData: [],
      tableRows: [],
      hadCheck: false,
      checkStatus: '?checkStatus=false',
      showReasonModal: false,
      note: '',
      timestamp: '&timestamp=',
      columns: [],
      url: '/table-data/archives/query/checkList',
      exportUrl: '/downloads/archives/statistic/getPeopleChart/excel',
      timeOutNum: '',
      charturl: '/api/archives/statistic/getPeopleChart'
    }
  },
  components: {
    radioBox
  },
  watch: {
    curTab(newValue) {
      switch (newValue) {
        case 'core'://高考分数
          this.chartUrl = '/api/archives/statistic/getExaminationCore'
          this.exportUrl = '/downloads/archives/statistic/getExaminationCore/excel'
          break;
        case 'rank'://高考排名
          this.chartUrl = '/api/archives/statistic/getExaminationRanking'
          this.exportUrl = '/downloads/archives/statistic/getExaminationRanking/excel'
          break;
        case 'rate'://排名比例
          this.chartUrl = '/api/archives/statistic/getExaminationRankRate'
          this.exportUrl = '/downloads/archives/statistic/getExaminationRankingRate/excel'
          break;
        case 'number'://专业录取人数  
          this.chartUrl = '/api/archives/statistic/getExaminationRanking'
          break;
        case 'gradient'://专业录取梯度
          this.chartUrl = '/api/archives/statistic/getExaminationRanking'
          break;
      }
      if (this.timeOutNum) {//避免短时间内多次调用
        clearTimeout(this.timeOutNum)
        this.timeOutNum = ''
      }
      this.timeOutNum = setTimeout(this.getData, 100)
    },
    isEchart(newValue) {
      if (this.timeOutNum) {//避免短时间内多次调用
        clearTimeout(this.timeOutNum)
        this.timeOutNum = ''
      }
      this.timeOutNum = setTimeout(this.getData, 100)
    },
    chartTypeEnum(newValue) {
      if (this.timeOutNum) {
        clearTimeout(this.timeOutNum)
        this.timeOutNum = ''
      }
      this.timeOutNum = setTimeout(this.getData, 100)
    },
    selectValues: {
      deep: true,
      handler(newValue) {
        if (this.timeOutNum) {
          clearTimeout(this.timeOutNum)
          this.timeOutNum = ''
        }
        this.timeOutNum = setTimeout(this.getData, 100)
      }
    }
  },
  methods: {
    exportExcel() {
      let url = this.exportUrl + '?chartTypeEnum=' + this.chartTypeEnum + '&'
      for (var i in this.selectValues) {
        url += i + '=' + this.selectValues[i] + '&'
      }
      window.location.href = url
    },
    _reset() {

      if (this.$route.query.type === 'achievement') {
        this.selectValues.enrollWay = ''
        this.selectValues.majorName = ''
        this.selectValues.educationLevel = ''
      } else {
        this.selectValues = {
          year: '',
          division: '',
          province: '',
          enrollWay: '',
          majorName: '',
          educationLevel: '',
        }
      }
    },
    initColumns() {
      let radioName = this.radioList[this.radioKeys[this.chartTypeEnum]].name
      let tabName = ''
      this.tabList.forEach(o => {
        if (o.id === this.curTab) {
          tabName = o.name
        }
      })
      if (this.$route.query.type === 'achievement') {
        this.columns = [{
          id: "province",
          title: '生源地',
          className: "text-left",
          width: 180,
          hidden: false,
        }, {
          id: "name",
          title: tabName,
          className: "text-left",
          width: 180,
          hidden: false,
        }, {
          id: "radioName",
          title: radioName,
          className: "text-left",
          width: 120,
          hidden: false,
        }, {
          id: "number",
          title: "人数",
          className: "text-left",
          width: 80,
          hidden: false,
        }]
        this.tableRows = []
        this.chartData.forEach(o => {
          this.tableRows = [...this.tableRows, ...o.dataList.map(a => { a.province = this.selectValues.province; a.radioName = o.name; return a })]
        })
      } else {
        this.columns = [{
          id: "name",
          title: "生源地",
          className: "text-left",
          width: 180,
          hidden: false,
        }, {
          id: "radioName",
          title: radioName,
          className: "text-left",
          width: 120,
          hidden: false,
        }, {
          id: "number",
          title: "人数",
          className: "text-left",
          width: 80,
          hidden: false,
        }]
        this.tableRows = []
        this.chartData.forEach(o => {
          this.tableRows = [...this.tableRows, ...o.dataList.map(a => { a.radioName = o.name; return a })]
        })
      }


    },
    initSelect() {
      this.selectList.forEach(o => {
        if (o.url) {
          request(o.url).then(a => {
            if (a.state) {
              o.options = a.data.map((b, index) => {
                let obj = b
                if (o.formatter) {
                  obj = o.formatter(b)
                }
                if (index === 0 && o.required) {//如果是必选的,就自动第一个
                  this.selectValues[o.field] = obj[o.valueField]
                }
                return obj
              })
            }
          })
        }
      })
    },
    getTable(opt, colName, typeName) {
      var axisData = opt.xAxis[0].data;//获取图形的data数组
      var series = opt.series;//获取series
      var num = 0;//记录序号
      var sum = new Array();//获取合计数组（根据对应的系数生成相应数量的sum）
      for (var i = 0; i < series.length; i++) {
        sum[i] = 0;
      }
      var table = '<table class="bordered"><thead><tr>'
        + '<th>' + colName + '</th>'
        + '<th>' + typeName + '</th>';
      for (var i = 0; i < series.length; i++) {
        table += '<th>' + series[i].name + '</th>'
      }
      table += '</tr></thead><tbody>';
      for (var i = 0, l = axisData.length; i < l; i++) {
        num += 1;
        for (var n = 0; n < series.length; n++) {
          if (series[n].data[i]) {
            sum[n] += Number(series[n].data[i]);
          } else {
            sum[n] += Number(0);
          }

        }
        table += '<tr>'
          + '<td>' + num + '</td>'
          + '<td>' + axisData[i] + '</td>';
        for (var j = 0; j < series.length; j++) {
          if (series[j].data[i]) {
            table += '<td>' + series[j].data[i] + '</td>';
          } else {
            table += '<td>' + 0 + '</td>';
          }

        }
        table += '</tr>';
      }
      //最后一行加上合计
      table += '<tr>' + '<td>' + (num + 1) + '</td>' + '<td>合计</td>';
      for (var n = 0; n < series.length; n++) {
        if (String(sum[n]).indexOf(".") > -1)
          table += '<td>' + (Number(sum[n])).toFixed(2) + '</td>';
        else
          table += '<td>' + Number(sum[n]) + '</td>';
      }
      table += '</tr></tbody></table>';
      return table;
    },
    getData() {
      let url = this.chartUrl
      let params = {
        chartTypeEnum: this.chartTypeEnum
      }
      for (var i in this.selectValues) {
        if (this.selectValues[i]) {
          params[i] = this.selectValues[i].split(',')
        }
      }
      request(url, params).then(o => {
        if (!o.data) {
          this.chartData = []
        } else {
          this.chartData = o.data
        }
        if (this.isEchart) {
          if (this.chartData.length) {
            this.initChart(o)
          }
        } else {
          this.initColumns()
        }
      })
    },
    initChart(o) {
      let xAxis = {
        type: 'category',
        boundaryGap: false,
        data: []
      }
      if (o.data[0]) {
        xAxis.data = o.data[0].dataList.map(a => {
          return a.name
        })
      }
      let series = []
      let legend = {
        height: 250,
      }
      let grid = {}
      if (this.chartTypeEnum === 'MAJORNAME') {
        legend.right = 160
        legend.textStyle = {
          fontSize: 12
        }
        grid.y = 80
      }
      legend.data = o.data.map(a => {
        series.push({
          name: a.name,
          type: 'line',
          smooth: true,
          data: a.dataList.map(b => { return b.number }),
        })
        return a.name
      })
      let options = {
        tooltip: {
          trigger: 'axis'
        },
        legend: legend,
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            magicType: { type: ['line', 'bar'] },
            restore: {},
            saveAsImage: {}
          }
        },
        color: ["#69CDF9", "#FF7E9D", "#FFDB5C", "#E7BCF1", "#A0E6B7", "#FFA07F", "#DF62AF"],
        xAxis: xAxis,
        yAxis: {
          type: 'value',
          axisLabel: {
          }
        },
        grid: grid,
        series: series
      };
      if (this.myChart) {//如果已经有图表了,要先销毁,不然会有bug
        this.myChart.dispose()
      }
      this.$nextTick(() => {
        this.myChart = echarts.init(this.$refs.lineEcharts)
        this.myChart.setOption(options)
      })
    },
    checkValue() {
      //用来验证数据是否正确
    },
  },
  mounted() {
    if (this.$route.query.type === 'person') {//录取人数
      this.getData()
    } else if (this.$route.query.type === 'achievement') {//成绩分布
      this.selectList[0].multiple = false;//年份单选
      this.selectValues.year = this.selectList[0].options[0].value
      this.selectList[0].required = true;//年份必传
      this.selectList[1].required = true;//科类必传
      this.selectList[2].required = true;//生源地必传
      this.tabList = [{ name: '高考分数', id: 'core' }, { name: '高考排名', id: 'rank' }, { name: '排名比例', id: 'rate' }]
      this.curTab = 'core'
    } else {//录取专业
      this.tabList = [{ name: '专业录取人数', id: 'number' }, { name: '专业录取梯度', id: 'gradient' }]
    }
    this.initSelect()
  }
}
</script>
<style lang="less" scoped>
.statistics_wrap {
  height: 100%;
  width: 100%;
  .top,
  .main {
    background: white;
    .icon_chart {
      border-radius: 5px 0 0 5px;
    }
    .icon_table {
      border-radius: 0 5px 5px 0;
      margin-right: 10px;
    }
    .icon_chart,
    .icon_table {
      width: 50px;
      height: 40px;
      background: #f3f9ff;
      &.bg_blue {
        background: #419dff;
      }
      img {
        width: 24px;
        height: 24px;
      }
    }
  }
  .top {
    padding: 24px 10px 50px 10px;
    margin-bottom: 20px;
    position: relative;
    .button_wrap {
      position: absolute;
      bottom: 16px;
      right: 13px;
      button {
        border: none;
        padding: 6px 34px;
        font-size: 14px;
        font-weight: 400;
        outline: none;
        border-radius: 5px;
        line-height: 20px;
      }
      .reSet {
        color: #909399;
        padding: 6px 22px;
        margin-right: 10px;
        .reset_icon {
          width: 14px;
          height: 14px;
          margin-right: 10px;
        }
        background-color: white;
        &:hover {
          background-color: #f4f5f7;
        }
      }
      .search {
        color: white;
        background: #298df7;
        &:hover {
          opacity: 0.9;
        }
      }
    }
    .select_wrap {
      .text {
        width: 90px;
        padding-right: 10px;
        text-align: right;
      }
      .v-select {
        width: 200px;
      }
      margin: 0 0px 20px 0;
    }
  }
  .main {
    padding-top: 1px;
  }
  .radio_wrap {
    margin-left: 19px;
    display: inline-block;
    .input-group {
      .input-group {
        margin-right: 20px;
      }
    }
  }
  .chart_wrap {
    padding-top: 5px;
    .chart {
      width: 100%;
      height: 444px;
    }
  }
}
</style>

