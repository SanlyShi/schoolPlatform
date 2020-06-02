<template>
  <div class="wrap toast-wrap" v-if="show">
    <div class="show-content">
      <pre class="message">{{text}}</pre>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      show: {
        default: false
      }
    }
  }
</script>

<style lang="less">
@toastWidth: 344px;
.wrap.toast-wrap {
  position: relative;
  // left: 0;
  // right: 0;
  // top: 0;
  // bottom: 0;
  // opacity: 1;
  z-index: 9999;
  .show-content {
    position: fixed;
    right: 50%;
    bottom: 24px;
    width: @toastWidth;
    margin-right: -@toastWidth/2;
    background: rgba(0, 0, 0, 0.87);
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.12), 0 6px 6px 0 rgba(0, 0, 0, 0.12);
    border-radius: 4px;
  }

  .show-content .message {
    display: block;
    margin: 0;
    padding: 0 18px;
    clear: both;
    line-height: 48px;
    font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.87);
    font-weight: 500;
    letter-spacing: 2px;
    background: transparent;
    border: none;
  }
}
</style>
