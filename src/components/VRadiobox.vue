<template>
  <div class="input-group box_flex align_center" :class="{column:column}">
    <checkbox v-for="(item,index) in list" :key="index" radio='true' :class="{'needMargin':needMargin}" v-model="item.checked" :name="item.name"></checkbox>
  </div>
</template>
<script>
export default {
  data() {
    return {
      list: [],
      checkValue: ''
    }
  },
  created() {
    this.list = JSON.parse(JSON.stringify(this.radioList))
  },
  props: {
    value: {
      default: ''
    },
    radioList: {
      default: []
    },
    column: {
      default: ''
    },
    needMargin:{
      default:false
    }
  },
  watch: {
    value(newVal) {
      this.checkValue = newVal
      this.list = this.list.map(o => {
        if (o.id === newVal) {
          o.checked = true
        } else {
          o.checked = false
        }
        return o
      })
    },
    radioList(newArr) {
      this.list = JSON.parse(JSON.stringify(this.radioList))
      this.list = this.list.map(o => {
        if (o.id === this.checkValue) {
          o.checked = true
        } else {
          o.checked = false
        }
        return o
      })
    }
  },
  mounted(){
    this.checkValue = this.value
      this.list = this.list.map(o => {
        if (o.id === this.checkValue) {
          o.checked = true
        } else {
          o.checked = false
        }
        return o
      })
  },
  methods: {
    changeValue() {
      this.list.forEach(o => {
        if (o.checked) {
          this.value = o.id
          this.$emit('input', o.id);
        }
      })
    },
  }
}
</script>

<style lang="less" scoped>
.input-group {
  .light-black-color {
    color: #4091ff;
  }
  .maticon {
    color: #4091ff;
  }
  .needMargin{
    margin-right: 16px;
  }
}
</style>
