
<template>
  <div id="paymentDetail">
    <x-header :title="data.title" class="paymentDetail-header">
      <i slot="overwrite-left" class="maticon back-icon" v-html="icons('navigate_before')" @click="_back">navigate_before</i>
    </x-header>
    <iframe class="paymentDetail-detail" :src="data.url" frameborder="0"></iframe>
  </div>
</template>
<script>
  import Vue from 'vue'
  export default {
    props: {
      data: {
       default: null
      }
    },
    created: function () {
      // console.log('---'+JSON.stringify(this.data))
    },
    methods: {
      _back: function () {
        this.$emit('removeBread', this.data)
      }
    }

  }
</script>
<style lang="less">
#paymentDetail {
  .paymentDetail-header {
    background: #ffffff;
    height: 56px;
    z-index: 100;
    padding: 0;
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.08), 0 4px 4px 0 rgba(0, 0, 0, 0.08);
    .vux-header-title {
      font-size: 16px;
      font-weight: bold;
      color: rgba(0, 0, 0, 0.67);
      font-weight: 500;
      height: 56px;
      margin: 0 64px;
      text-align: left;
      span {
        padding-top: 8px;
      }
    }
  }
  .paymentDetail-detail {
    width: 100%;
    height: 100%;
  }
}
</style>

