export default {
  data () {
    return {
      timeRangePickerOptions: {},
      applyTimeRangePickerOptions: {}
    }
  },
  async created () {
    this.initTimeLimit()
  },
  methods: {
    initTimeLimit () {
      Object.assign(this.timeRangePickerOptions, {
        disabledDate: (time) => {
          let minTime = this.form.applyTimeRange && this.form.applyTimeRange[1]
          if (!minTime) {
            return false
          }
          return time < new Date(minTime)
        }
      })
      Object.assign(this.applyTimeRangePickerOptions, {
        disabledDate: (time) => {
          let maxTime = this.form.timeRange && this.form.timeRange[0]
          if (!maxTime) {
            return false
          }
          return time > new Date(maxTime)
        }
      })
    }
  }
}
