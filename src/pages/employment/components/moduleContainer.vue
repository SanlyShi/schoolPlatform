<template>
  <div class="module" :class="{ 'module-inline': inline, 'module-actions': actions }">
    <div class="title" v-if="!actions"><i></i><span>{{ title }}</span></div>
    <div class="info"
      :class="{ 'info-small': small, 'info-edit': edit, loader: loader }"
       v-loading="loader"
       :element-loading-text="loaderText"
       >
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    loader: Boolean,
    loaderText: String,
    title: String,
    inline: Boolean,
    small: Boolean,
    edit: Boolean,
    actions: Boolean
  }
}
</script>

<style lang="less" scoped>
.loader {
  height: 300px;
  position: relative;
}
</style>
