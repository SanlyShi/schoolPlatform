<template>
  <div ref="echarts" class="chart">
  </div>
</template>

<script>
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/chart/radar'
import chartConfig from './common/echart'
import { extend } from './common/extend'
export default {
  mixins: [chartConfig],
  data () {
    return {
      type: 'radar',
      radarConfig: {
        name: {
          textStyle: {
            color: '#fff',
            backgroundColor: '#333',
            borderRadius: 20,
            padding: [5, 15]
          }
        },
        radius: '50%',
        indicator: []
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
    setData (resolve) {
      this.legendConfig.data = this.optionData.legendData || []
      this.radarConfig.indicator = this.optionData.indicatorData || []
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
          radar: this.radarConfig,
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
