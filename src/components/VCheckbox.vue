<template>
  <div @click="changeValue()" class="input-group box_flex align_center">
    <span v-if="!radio" class="box_flex align_center" style="width:17px;margin-right:10px">
      <i class="maticon role-icon " v-if="!checkValue" v-html="icons('check_box_outline_blank')">check_box_outline_blank</i>
      <i class="maticon role-icon active " v-else v-html="icons('check_box')">check_box</i>
    </span>
    <span v-else class="box_flex align_center" style="width:17px;margin-right:10px">
      <i class="maticon role-icon " v-if="!checkValue" v-html="icons('radio_button_unchecked')">check_box_outline_blank</i>
      <i class="maticon role-icon active " v-else v-html="icons('radio_button_checked')">check_box</i>
    </span>
    <span v-if="name">{{name}}</span>
  </div>
</template>
<script>
export default {
  data() {
    return {
      checkValue: false
    }
  },
  created() {
    this.checkValue = this.value
  },
  props: {
    value: {
      default: false
    },
    name: {
      default: ''
    },
    radio: {
      default: false
    },
  },
  watch: {
    value(newVal) {
      this.checkValue = newVal
    }
  },
  methods: {
    changeValue() {
      if (this.radio) {
        this.$parent.list = this.$parent.list.map(o => {
          o.checked = false
          return o
        })
        this.checkValue = true
        this.$nextTick((o => {
          this.$parent.changeValue()
        }))
      } else {
        this.checkValue = !this.checkValue
      }
      this.$emit('input', this.checkValue);

    },
  }
}
</script>

<style lang="less" scoped>
.input-group {
  cursor: pointer;
  .light-black-color {
    color: #4091ff;
  }
  .maticon {
    color: #4091ff;
  }
}
</style>
