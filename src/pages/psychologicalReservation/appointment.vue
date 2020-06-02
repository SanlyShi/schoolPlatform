<template>
  <div class="appointment">
    <detect></detect>
  </div>
</template>
<script>
  import Vue from 'vue';
  import { sAjax } from '../../assets/utils/utils';
  import Detection from 'components/personalDetection.vue';
  Vue.component('detect', Detection)
  export default {
    props: {
      data: {
        default: null
      }
    },
    data: function () {
      return {

      }
    },
    methods: {
      _getData: function () {
        
      }
    }
  }
</script>
<style lang="less">
.appointment {
}
</style>
