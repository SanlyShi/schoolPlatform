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
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/pie'
import chartConfig from './common/echart'
import { extend } from './common/extend'
export default {
  mixins: [chartConfig],
  data () {
    return {
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
    initChart () {
      this.myChart = echarts.init(this.$refs.echarts)
      this.myChart.setOption(extend({
        color: this.colorConfig,
        title: this.titleConfig,
        tooltip: this.tooltipConfig,
        legend: this.legendConfig,
        xAxis: this.optionData.xAxis || [],
        yAxis: this.optionData.yAxis || [],
        dataset: {
          source: this.optionData.source || []
        },
        grid: this.optionData.grid || {},
        series: this.optionData.series || []
      }, this.configOption))
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
