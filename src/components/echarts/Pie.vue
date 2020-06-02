<template>
  <div ref="echarts" class="chart">
  </div>
</template>

<script>
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/chart/pie'
import chartConfig from './common/echart'
import { extend } from './common/extend'
export default {
  mixins: [chartConfig],
  data () {
    return {
      type: 'pie',
      tooltipConfig: {
        trigger: 'item',
        formatter: '{a} <br/>{b}  ({d}%)'
      },
      seriesConfig: [],
      colorConfig:[]
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
      this.seriesConfig = this.optionData.seriesData
      this.colorConfig = this.optionData.color
      resolve()
    },
    initChart () {
      new Promise(this.setData).then(() => {
        this.myChart = echarts.init(this.$refs.echarts)
        this.myChart.setOption(extend({
          title: this.titleConfig,
          tooltip: this.tooltipConfig,
          legend: this.legendConfig,
          series: this.seriesConfig,
          color:this.colorConfig
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
    background-color: #ffffff
  }
</style>
