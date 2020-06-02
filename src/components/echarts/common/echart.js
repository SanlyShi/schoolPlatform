export default {
  props: {
    optionData: {
      type: [Object, Array],
      default: () => ({})
    },
    configOption: {
      type: [Object, Array],
      default: () => ({})
    },
    
  },
  data () {
    return {
      backgroundConfig:"#ffffff",
      myChart: '',
      colorConfig: ['#83d0d5', '#f1cb48', '#188ae2', '#E8830B', '#7460ae', '#fc4b6c', '#31ce77', '#eae0bc', '#e732cb', '#9dce8a'],
      titleConfig: {
        text: this.optionData.title || '',
        left: 'center',
        top: '20',
        textStyle: {
          color: '#333'
        }
      },
      tooltipConfig: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legendConfig: {
        data: [],
        left: 'center',
        bottom: '0',
        textStyle: {
          color: '#B6B6B6'
        }
      },
      seriesConfig: [{
        data: [],
        type: this.type || 'line'
      }]
    }
  },
  watch: {
    optionData: function (data) {
      this.titleConfig.text = this.optionData.title || ''
      this.initChart()
    }
  },
  methods: {
    resizeChart () {
      this.myChart.resize()
    },
    resizeWindow () {
      let that = this
      window.addEventListener('resize', function () {
        // that.myChart.resize()
      })
    }
  },
  destroyed () {
    this.myChart.clear()
  }
}
