<template>
  <div ref="echarts" class="chart">
  </div>
</template>

<script>
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/chart/pictorialBar'
import chartConfig from './common/echart'
import { extend } from './common/extend'
export default {
  mixins: [chartConfig],
  data () {
    return {
      type: 'pictorialBar',
      xAxisConfig: {
        splitLine: {show: false},
        axisLabel: {show: false},
        axisTick: {show: false},
        axisLine: {show: false}
      },
      gridConfig: {
        containLabel: true,
        left: 20
      },
      yAxisConfig: {
        data: [],
        inverse: true,
        axisLine: {show: false},
        axisTick: {show: false},
        axisLabel: {
          margin: 30,
          textStyle: {
            fontSize: 14
          }
        },
        axisPointer: {
          label: {
            show: true,
            margin: 30
          }
        }
      },
      seriesConfig: []
    }
  },
  mounted () {
    let init = new Promise((resolve) => {
      this.initChart()
      resolve()
    })
    init.then(() => {
      this.resizeWindow()
    })
  },
  methods: {
    labelSetting () {
      return {
        normal: {
          show: true,
          position: 'right',
          offset: [10, 0],
          textStyle: {
            fontSize: 16
          }
        }
      }
    },
    setData (resolve) {
      this.legendConfig.data = this.optionData.legendData || []
      this.gridConfig.left = this.optionData.gridLeftData || 20
      this.yAxisConfig.data = this.optionData.yAxisData || []
      let seriesArr = this.optionData.seriesData
      this.seriesConfig = []
      for (let item of seriesArr) {
        let seriesObj = {
          name: item.name,
          type: 'pictorialBar',
          label: this.labelSetting(),
          symbolRepeat: true,
          barGap: '10%',
          symbolSize: item.symbolSize || ['80%', '60%'],
          barCategoryGap: item.barCategoryGap || '40%',
          data: item.data
        }
        this.seriesConfig.push(seriesObj)
      }
      resolve()
    },
    initChart () {
      new Promise(this.setData).then(() => {
        this.myChart = echarts.init(this.$refs.echarts)
        this.myChart.setOption(extend({
          title: this.titleConfig,
          tooltip: this.tooltipConfig,
          legend: this.legendConfig,
          xAxis: this.xAxisConfig,
          yAxis: this.yAxisConfig,
          grid: this.gridConfig,
          series: this.seriesConfig
        }, this.configOption))
      })
    }
  }
}
</script>
<style type="text/css">
  .chart{
    width: 100%;
    height: 100%;
  }
</style>
