<template>
  <div ref="echarts" class="chart">
  </div>
</template>

<script>
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/pictorialBar'
// import 'echarts/lib/component/legend'
import chartConfig from './common/echart'
import { extend } from './common/extend'
export default {
  mixins: [chartConfig],
  data () {
    return {
      type: 'pictorialBar',
      xAxisConfig: {
        max: this.optionData.maxData || '',
        splitLine: {show: false},
        // offset: 10,
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        },
        axisLabel: {
          margin: 10
        }
      },
      // legendConfig:{
      //   show:false
      // },
     tooltipConfig:{
        show:false
      },
      yAxisConfig: {
        data: [],
        inverse: true,
        axisTick: {show: false},
        axisLine: {show: false},
        axisLabel: {
          margin: 10,
          textStyle: {
            color: '#999',
            fontSize: 16
          }
        }
      },
      gridConfig: {
        top: 'center',
        height: 200,
        left: 70,
        right: 100
      },
      seriesConfig: [{
        // current data
        type: 'pictorialBar',
        symbol: this.optionData.spirit,
        symbolRepeat: 'fixed',
        symbolMargin: '5%',
        symbolClip: true,
        symbolSize: 30,
        symbolBoundingData: this.optionData.maxData,
        data: [],
        // markLine: {
        //   symbol: 'none',
        //   label: {
        //     normal: {
        //       formatter: 'max: {c}',
        //       position: 'start'
        //     }
        //   },
        //   lineStyle: {
        //     normal: {
        //       color: 'green',
        //       type: 'dotted',
        //       opacity: 0.2,
        //       width: 2
        //     }
        //   },
        //   data: [{
        //     type: 'max'
        //   }]
        // },
        z: 10
      }, {
        // full data
        type: 'pictorialBar',
        itemStyle: {
          normal: {
            opacity: 0.2
          }
        },
        label: {
          normal: {
            show: true,
            position: 'right',
            offset: [10, 0],
            textStyle: {
              color: 'green',
              fontSize: 18
            }
          }
        },
        animationDuration: 0,
        symbolRepeat: 'fixed',
        symbolMargin: '5%',
        symbol: this.optionData.spirit,
        symbolSize: 30,
        symbolBoundingData: this.optionData.maxData,
        data: [],
        z: 5
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
      let data = this.optionData.seriesData || []
      let yAxisData = []
      let seriesData = []
      for (let item of data) {
        yAxisData.push(item.name)
        seriesData.push(item.value)
      }
      this.yAxisConfig.data = yAxisData
      this.xAxisConfig.maxData = this.optionData.maxData
      for (let item of this.seriesConfig) {
        item.data = seriesData
        item.symbolBoundingData = this.optionData.maxData
        item.symbol = this.optionData.symbol 
      }
      this.seriesConfig[1].label.normal.formatter = (params) => {
        // console.log(params)
        // console.log(this.optionData.maxData)
        // console.log( (params.value / this.optionData.maxData * 100).toFixed(1) + ' %')
        return (params.value / this.optionData.maxData * 100).toFixed(1) + ' %'
      }
      // console.log(this.optionData.maxData)

      resolve()
    },
    initChart () {
      new Promise(this.setData).then(() => {
        this.myChart = echarts.init(this.$refs.echarts)
        this.myChart.setOption(extend({
          title: this.titleConfig,
          tooltip: this.tooltipConfig,
          xAxis: this.xAxisConfig,
          // legend:this.legendConfig,
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
