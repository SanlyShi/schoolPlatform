<template>
  <div class="container-fluid">
    <div class="row">
      <div v-html="data.data.tip"></div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      default: null
    }
  }
}
</script>
<style lang="less">

</style>
