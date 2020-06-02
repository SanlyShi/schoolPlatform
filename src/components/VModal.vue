<!--修改时间：2017-11-22
      传入属性
    props: {
      默认不显示，此属性为必须填写
      show: {
        required: true,
        type: Boolean
      },
      遮罩内容框宽度
      width: {
        default: null
      },
      遮罩显示特效，主要有fade zoom
      effect: {
        type: String,
        default: null
      },
      是否开启背景遮罩层关闭事件
      backdrop: {
        type: Boolean,
        default: false
      },
      是否显示巨大遮罩
      large: {
        type: Boolean,
        default: false
      },
      是否显示小遮罩
      small: {
        type: Boolean,
        default: false
      }
    },
-->
<template>
  <div ref="modal" role="dialog" v-bind:class="{
    'modal':true,
    'fade':effect === 'fade',
    'zoom':effect === 'zoom'
    }">
    <div v-bind:class="{'modal-dialog':true,'modal-lg':large,'modal-sm':small}" role="document" v-bind:style="{width: optionalWidth}">
      <div class="modal-content">
        <slot name="modal-header">
          <slot name="title">
          </slot>
        </slot>
        <slot name="modal-body">
        </slot>
        <slot name="modal-footer">
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  export default {
    props: {
      show: {
        required: true,
        type: Boolean
      },
      width: {
        default: null
      },
      effect: {
        type: String,
        default: null
      },
      backdrop: {
        type: Boolean,
        default: false
      },
      large: {
        type: Boolean,
        default: false
      },
      small: {
        type: Boolean,
        default: false
      }
    },
    data: function () {
      return {
        isShow: this.show
      }
    },
    computed: {
      optionalWidth: function () {
        if (this.width === null) {
          return null
        } else if (Number.isInteger(this.width)) {
          return this.width + 'px'
        }
        return this.width + 'px'
      }
    },
    watch: {
      show: function () {
        this.isShow = this.show
      },
      isShow: function (val) {
        const el = this.$refs.modal
        const body = document.body
        const scrollBarWidth = this.getScrollBarWidth()
        if (val) {
          $(el).find('.modal-content').focus()
          el.style.display = 'block'
          setTimeout(() => $(el).addClass('in'), 0)
          $(body).addClass('modal-open')
          if (scrollBarWidth !== 0) {
            body.style.paddingRight = scrollBarWidth + 'px'
          }
          if (this.backdrop) {
            $(el).on('click', e => {
              if (e.target === el) {
                this.isShow = false
                this.$emit('onHide',true)
              }
            })
          }
        } else {
          body.style.paddingRight = null
          $(body).removeClass('modal-open')
          $(el).removeClass('in').css('display', 'none')
          // $(el).removeClass('in').on('transitionend', () => {
          //   $(el).off('click transitionend')
          //   el.style.display = 'none'
          // })
        }
      }
    },
    methods: {
      close: function () {
        this.isShow = false
      },
      getScrollBarWidth: function () {
        if (document.documentElement.scrollHeight <= document.documentElement.clientHeight) {
          return 0
        }
        let inner = document.createElement('p')
        inner.style.width = '100%'
        inner.style.height = '200px'

        let outer = document.createElement('div')
        outer.style.position = 'absolute'
        outer.style.top = '0px'
        outer.style.left = '0px'
        outer.style.visibility = 'hidden'
        outer.style.width = '200px'
        outer.style.height = '150px'
        outer.style.overflow = 'hidden'
        outer.appendChild(inner)

        document.body.appendChild(outer)
        let w1 = inner.offsetWidth
        outer.style.overflow = 'scroll'
        let w2 = inner.offsetWidth
        if (w1 === w2) w2 = outer.clientWidth

        document.body.removeChild(outer)

        return (w1 - w2)
      }
    }
  }
</script>
<style>
.modal {
  transition: all 0.3s ease;
}
.modal::-webkit-scrollbar {display: none};

.modal.in {
  background-color: rgba(0, 0, 0, 0.3);
}

.modal-dialog {
  margin: 150px auto 0;
}

.modal-body {
  max-height: 500px;
  overflow: auto;
}
.modal-body::-webkit-scrollbar {display: none};

.modal-content {
  box-shadow: 0 0 24px 0 rgba(0, 0, 0, 0.12), 0 24px 24px 0 rgba(0, 0, 0, 0.24);
  border-radius: 4px;
}
.modal-content::-webkit-scrollbar {display: none};

.modal.zoom .modal-dialog {
  -webkit-transform: scale(0.1);
  -moz-transform: scale(0.1);
  -ms-transform: scale(0.1);
  transform: scale(0.1);
  top: 300px;
  opacity: 0;
  -webkit-transition: all 0.3s;
  -moz-transition: all 0.3s;
  transition: all 0.3s;
}

.modal.zoom.in .modal-dialog {
  -webkit-transform: scale(1);
  -moz-transform: scale(1);
  -ms-transform: scale(1);
  transform: scale(1);
  -webkit-transform: translate3d(0, -300px, 0);
  transform: translate3d(0, -300px, 0);
  opacity: 1;
}
</style>
