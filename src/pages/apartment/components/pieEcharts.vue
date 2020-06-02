<template>
  <div class="c-pie-echarts" :id="timeStamp+'pie'"></div>
</template>

<script>
  import Vue from 'vue'
  import echarts from 'echarts'
  import { translation, sAjax, createTime } from '../../../assets/utils/utils.js'
  export default {
    props: {
      countData: {
        default: null
      }
    },
    created: function () {
      this.timeStamp = createTime()
    },
    data: function () {
      return {
        pie: null,
        option: {},
        timeStamp: null
      }
    },
    watch: {
      countData: function () {
      //  this.pie.setOption(this.option, true)
      }
    },
    mounted: function () {
      this.pie =echarts.init(document.getElementById(this.timeStamp + 'pie'))
      this.option = {
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        color: ['#90D4E7', '#91B0E4', '#7896D4','#536DFE'],
        series: [{
          name: '统计',
          type: 'pie',
          hoverAnimation: false,
          radius: '80%',
          center: ['49%', '41%'],
          data: this.countData,
          label: {
            normal: {
              show: false
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      }
      this.pie.setOption(this.option, true)
    },
    methods: {
      
    }
  }
</script>

<style lang="less">
.c-pie-echarts {
  width: 167px;
  height: 167px;
}
</style>
