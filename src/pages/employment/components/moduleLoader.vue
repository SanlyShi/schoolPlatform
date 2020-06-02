<template>
  <div class="module" :class="{ 'module-inline': inline }">
    <div class="title"></div>
    <div class="info loader" v-loading="true" :element-loading-text="text">
    </div>
  </div>
</template>

<script>
export default {
  props: {
    inline: Boolean,
    text: String
  }
}
</script>

<style lang="less" scoped>
.loader {
  height: 300px
}
</style>

