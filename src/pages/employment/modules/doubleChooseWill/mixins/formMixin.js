export default {
  props: [ 'value' ],
  data () {
    let form = null
    if (typeof this.value === 'object') {
      if (this.value instanceof Array) {
        form = JSON.parse(JSON.stringify(this.value))
      } else {
        form = Object.assign({}, this.value)
      }
    } else {
      form = this.value
    }
    return {
      form: form
    }
  },
  watch: {
    value: {
      deep: true,
      handler (val) {
        if (typeof val === 'object') {
          if (val instanceof Array) {
            this.form = JSON.parse(JSON.stringify(val))
          } else {
            this.form = Object.assign({}, val)
          }
        } else {
          this.form = val
        }
      }
    },
    form: {
      deep: true,
      handler (val) {
        this.$emit('input', val)
      }
    }
  }
}
