export default {
  data () {
    return {
      dateArea: ['', ''],
      dateArea2: ['', '']
    }
  },
  created () {
    this.dateArea = this.dataRange
    this.dateArea2 = JSON.parse(JSON.stringify(this.dataRange))
  },
  props: {
    dataRange: {
      default () {
        return ['', '']
      }
    }
  },
  watch: {
    dataRange (newVal) {
      this.dateArea = newVal
    },
    dateArea (newVal) {
      if (newVal) {
        this.searchOptions.dateStart = newVal[0]
        this.searchOptions.dateEnd = newVal[1]
      }
    },
    dateArea2 (newVal) {
      if (newVal) {
        this.searchOptions.dateStart2 = newVal[0]
        this.searchOptions.dateEnd2 = newVal[1]
      }
    }
  },
  methods: {}
}
