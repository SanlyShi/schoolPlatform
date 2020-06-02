<template>
  <div class="page-1">
    <v-flow></v-flow>
  </div>
</template>

<script>
  import Vue from 'vue'
  import VFlow from '../components/VFlow.vue'
  Vue.component('v-flow', VFlow)
  export default {
    data () {
      return {
      }
    }
  }
</script>

<style lang="less">
  .page-1{
    margin-top: 20px;
  }
</style>
