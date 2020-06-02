<template>
  <div id="vTip" class="v-tooltip" :style="position" v-show="show">
    {{tip}}
    <span class="tri-icon">

    </span>
  </div>
</template>
<script>
  export default {
    data: function () {
      return {
        show: false,
        tipHeight: 50,
        rect: {},
        lang: this.defaultLang
      }
    },
    computed: {
      position: function () {
        return `left:${this.rect.left}px;top:${this.rect.top - this.tipHeight - 20}px;`
      }
    },
    watch: {
      show: function (b) {
        if (b) {
          setTimeout(() => {
            this.vT = document.getElementById('vTip')
            this.tipHeight = this.vT.offsetHeight
          }, 100);
        }
      }
    }
  }
</script>

<style lang="less">
.v-tooltip {
  position: fixed;
  left: -100%;
  top: -100%;
  z-index: 9999;
  max-width: 300px;
  padding: 20px;
  font-weight: 500;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.12), 0 8px 8px 0 rgba(0, 0, 0, 0.12);
  border-radius: 3px;
  transition: all 0.1s ease;
  .tri-icon {
    position: relative;
    display: block;
    width: 20px;
    height: 20px;
    margin-bottom: -25px;
    transform: rotate(45deg);
    -ms-transform: rotate(45deg); /* IE 9 */
    -moz-transform: rotate(45deg); /* Firefox */
    -webkit-transform: rotate(45deg); /* Safari 和 Chrome */
    -o-transform: rotate(45deg);
    background: #fff;
  }
}
</style>
