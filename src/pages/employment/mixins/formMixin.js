export default {
  props: [ 'value' ],
  data () {
    // let form = null
    // if (typeof this.value === 'object') {
    //   if (this.value instanceof Array) {
    //     form = JSON.parse(JSON.stringify(this.value))
    //   } else {
    //     form = Object.assign({}, this.value)
    //   }
    // } else {
    //   form = this.value
    // }
    let form = this.value
    return {
      form: form
    }
  },
  watch: {
     form: {
        deep: true,
        handler (val) {
          if (typeof this.form !== 'object') {
            this.$emit('input', val)
          }
        }
     }
  }
}
