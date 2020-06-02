<template>
  <div ref="scatterChart" class="chart">
  </div>
</template>
<script>
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/scatter'
export default {
  name: 'scatter',
  data () {
    return {
      myChart: ''
    }
  },
  props: {
    scatterData: {}
  },
  mounted () {
    this.initChart()
  },
  methods: {
    initChart () {
      this.myChart = echarts.init(this.$refs.scatterChart)
      console.log(this.scatterData)
      this.myChart.setOption(this.scatterData)
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
