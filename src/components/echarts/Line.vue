<template>
  <div ref="echarts" class="chart">
  </div>
</template>

<script>
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/chart/line'
import chartConfig from './common/echart'
import { extend } from './common/extend'
export default {
  mixins: [chartConfig],
  data () {
    return {
      type: 'line',
      legendConfig: {
        data: this.optionData.legendData || [],
        left: 'center',
        bottom: '0',
        textStyle: {
          color: '#B6B6B6'
        }
      },
      xAxisConfig: {
        type: 'category',
        position: 'bottom',
        name: '',
        nameLocation: 'center',
        nameGap: '50',
        data: this.optionData.xAxisData || [],
        axisTick: {
          show: false
        },
        axisLabel: {
          textStyle: {
            color: '#BFC2C8'
          },
          rotate: 30,
          interval: 0
        },
        axisLine: {
          lineStyle: {
            color: '#BFC2C8'
          }
        }
      },
      yAxisConfig: {
        type: 'value',
        left: '0',
        name: '',
        nameLocation: 'center',
        nameGap: '45',
        axisLine: {
          lineStyle: {
            color: '#BFC2C8'
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          lineStyle: {
            color: '#898D95'
          }
        },
        axisLabel: {
          textStyle: {
            color: '#BFC2C8'
          },
          interval: 0,
          formatter: function (value, index) {
            if (value >= 1000 && value < 10000000) {
              value = value / 1000 + 'K'
            } else if (value >= 1000000 && value < 1000000000) {
              value = value / 1000000 + 'M'
            } else if (value >= 1000000000) {
              value = value / 1000000000 + 'B'
            }
            return value
          }
        }
      }
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
    setData (resolve) {
      this.legendConfig.data = this.optionData.legendData || []
      this.xAxisConfig.data = this.optionData.xAxisData || []
      this.seriesConfig = this.optionData.seriesData || []
      for (let item of this.seriesConfig) {
        item.type = this.type
      }
      resolve()
    },
    initChart () {
      new Promise(this.setData).then(() => {
        this.myChart = echarts.init(this.$refs.echarts)
        this.myChart.setOption(extend({
          color: this.colorConfig,
          title: this.titleConfig,
          tooltip: this.tooltipConfig,
          legend: this.legendConfig,
          xAxis: this.xAxisConfig,
          yAxis: this.yAxisConfig,
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
