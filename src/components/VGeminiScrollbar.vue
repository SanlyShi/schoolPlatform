<template>
  <div class="v-gm-scrollbar" ref="geminiScrollbar" v-if="!isPhone">
    <div class="gm-scrollbar -vertical" v-show="scrollX">
      <div class="thumb"></div>
    </div>
    <div class="gm-scrollbar -horizontal" v-show="scrollY">
      <div class="thumb"></div>
    </div>
    <div class="gm-scroll-view">
      <slot></slot>
    </div>
  </div>
  <div v-else>
    <slot></slot>
  </div>
</template>

<script>
  import GeminiScrollbar from '../assets/plugins/js/gemini-scrollbar-supplement.js'
  export default {
    props: {
      autoCreate: {
        type: Boolean,
        default: true
      },
      autoshow: {
        type: Boolean,
        default: true
      },
      forceGemini: {
        type: Boolean,
        default: false
      },
      minThumbSize: {
        type: Number,
        default: 20
      },
      scrollX: {
        type: Boolean,
        default: true
      },
      scrollY: {
        type: Boolean,
        default: true
      }
    },
    data: function () {
      return {
        geminiScrollbar: null,
        isPhone: false,
        timer: null
      }
    },
    methods: {
      _createBar: function () {
        this.geminiScrollbar = new GeminiScrollbar({
          element: this.$refs.geminiScrollbar,
          createElements: false,
          onResize: () => {
            this.$emit('resize')
          },
          ...this.$props
        })
        if (this.autoCreate) {
          this.geminiScrollbar.create()
        }
        this.$emit('ready', this.geminiScrollbar)
      },
      _destroyBar: function () {
        if (this.geminiScrollbar) {
          this.geminiScrollbar.destroy()
        }
        this.geminiScrollbar = null
      },
      _judgeIsPhone: function () {
        this.isPhone = document.body.clientWidth < 768
      }
    },
    mounted() {
      this._judgeIsPhone()
      if (!this.isPhone) {
        this._createBar()
      } else {
        this._destroyBar()
      }
    },
    updated() {
      this._judgeIsPhone()
      this.$nextTick(() => {
        if (!this.isPhone) {
          this._createBar()
        } else {
          this._destroyBar()
        }
        if (!this.isPhone) {
          setTimeout(() => {
            this.geminiScrollbar && this.geminiScrollbar.update()
          }, 200)
        }
      })
    },
    beforeDestroy() {
      this._destroyBar()
    }
  }
</script>
<style lang="less">
/**
 * gemini-scrollbar
 * @version 1.5.3
 * @link http://noeldelgado.github.io/gemini-scrollbar/
 * @license MIT
 */

/* disable selection while dragging */
.gm-scrollbar-disable-selection {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* fallback for native floating scrollbars */
.gm-prevented {
  -webkit-overflow-scrolling: touch;
}
.gm-prevented > .gm-scrollbar {
  display: none;
}

/* actual gemini-scrollbar styles */
.gm-scrollbar-container {
  position: relative;
  overflow: hidden !important;
  width: 100%;
  height: 100%;
}

.gm-scrollbar {
  position: absolute;
  right: 2px;
  bottom: 2px;
  z-index: 1;
  border-radius: 3px;
}

.gm-scrollbar.-vertical {
  width: 6px;
  top: 2px;
}

.gm-scrollbar.-horizontal {
  height: 6px;
  left: 2px;
}

.gm-scrollbar .thumb {
  position: relative;
  display: block;
  width: 0;
  height: 0;
  cursor: pointer;
  border-radius: inherit;
  background-color: rgba(0, 0, 0, 0.1);
  transform: translate3d(0, 0, 0);
}

.gm-scrollbar .thumb:hover,
.gm-scrollbar .thumb:active {
  background-color: rgba(0, 0, 0, 0.3);
}

.gm-scrollbar.-vertical .thumb {
  width: 100%;
}

.gm-scrollbar.-horizontal .thumb {
  height: 100%;
}

.gm-scrollbar-container .gm-scroll-view {
  width: 100%;
  height: 100%;
  // padding: 2px;
  overflow: scroll;
  transform: translate3d(0, 0, 0);
  -webkit-overflow-scrolling: touch;
}

/* @option: autoshow */
.gm-scrollbar-container.gm-autoshow .gm-scrollbar {
  opacity: 0;
  transition: opacity 120ms ease-out;
}
.gm-scrollbar-container.gm-autoshow:hover > .gm-scrollbar,
.gm-scrollbar-container.gm-autoshow:active > .gm-scrollbar,
.gm-scrollbar-container.gm-autoshow:focus > .gm-scrollbar {
  opacity: 1;
  transition: opacity 340ms ease-out;
}

.gm-resize-trigger {
  position: absolute;
  display: block;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: -1;
  opacity: 0;
}
</style>

