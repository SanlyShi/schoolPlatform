<template>
  <div ref="barChart" class="chart">
  </div>
</template>
<script>
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/chart/bar'
import chartConfig from './common/echart'
import { extend } from './common/extend'
export default {
  mixins: [chartConfig],
  props: ['tooltipOptions'],
  name: 'bar',
  data () {
    return {
      myChart: '',
      type: 'bar',
      gridConfig: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxisConfig: [{
        type: 'category',
        data: [],
        axisTick: {
          alignWithLabel: true
        }
      }],
      yAxisConfig: [{
        type: 'value'
      }]
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
      this.legendConfig = this.optionData.legend
      this.xAxisConfig= this.optionData.xAxis
       this.yAxisConfig = this.optionData.yAxis
      this.seriesConfig = this.optionData.seriesData 
      // for (let item of this.seriesConfig) {
      //   item.type = this.type
      //   // item.barWidth = item.barWidth || '30%'
      // }
      resolve()
    },
    initChart () {
      new Promise(this.setData).then(() => {
        this.myChart = echarts.init(this.$refs.barChart)
        this.myChart.setOption(extend({
          color: this.colorConfig,
          title: this.titleConfig,
          tooltip: this.optionData.tooltip?this.optionData.tooltip:this.tooltipConfig,
          legend: this.optionData.legend?this.optionData.legend:this.legendConfig,
          grid: this.optionData.grid?this.optionData.grid:this.gridConfig,
          xAxis: this.xAxisConfig,
          yAxis: this.yAxisConfig,
          series: this.seriesConfig
        }, this.configOption),true)
      })
    }
  }
}
</script>
<style scope>
  .chart{
    width: 100%;
    height: 100%;
  }
</style>
