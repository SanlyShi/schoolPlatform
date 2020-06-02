<template>
  <div class="el-collapse-item" :class="{'is-active': isActive}">
    <div
      role="tab"
      :aria-expanded="isActive"
      :aria-controls="`el-collapse-content-${id}`"
      :aria-describedby ="`el-collapse-content-${id}`"
    >
      <div
        class="el-collapse-item__header sign_title"
        role="button"
        :id="`el-collapse-head-${id}`"
        tabindex="0"
        :class="{
          'focusing': focusing,
          'is-active': isActive
        }"
        @click="handleHeaderClick"
        @focus="handleFocus"
        @keyup.space.enter.stop="handleEnterClick"
        @blur="focusing = false"
      >
        <i
          class="el-collapse-item__arrow maticon"

          :class="{'is-active': isActive}"
          >expand_more</i>
        <slot name="title">{{title}}</slot>
      </div>
    </div>
    <transition
      @beforeEnter="beforeEnter"
      v-on:enter="enter"
      v-on:after-enter="afterEnter"

      v-on:before-leave="beforeLeave"
      v-on:leave="leave"
      v-on:after-leave="afterLeave"
    >
      <div
        class="el-collapse-item__wrap"
        v-show="isActive"
        role="tabpanel"
        :aria-hidden="!isActive"
        :aria-labelledby="`el-collapse-head-${id}`"
        :id="`el-collapse-content-${id}`"
      >
        <div class="el-collapse-item__content">
          <slot name="content"></slot>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import Emitter from "./mixins/emitter";
import { addClass, removeClass } from "../../../../assets/utils/dom";

export default {
  name: "ElCollapseItem",

  componentName: "ElCollapseItem",

  mixins: [Emitter],

  data() {
    return {
      contentWrapStyle: {
        height: "auto",
        display: "block"
      },
      contentHeight: 0,
      focusing: false,
      isClick: false
    };
  },

  inject: ["collapse"],

  props: {
    title: String,
    name: {
      type: [String, Number],
      default() {
        return this._uid;
      }
    },
    /**
     * 高度修正，直接修改css导致内容高度变化的，需要用此值修正动画
     */
    itemWrapCorrectionHeight: {
      type: Number,
      default() {
        return 0;
      }
    }
  },

  computed: {
    isActive() {
      return this.collapse.activeNames.indexOf(this.name) > -1;
    },
    id() {
      return +new Date();
    }
  },

  methods: {
    handleFocus() {
      setTimeout(() => {
        if (!this.isClick) {
          this.focusing = true;
        } else {
          this.isClick = false;
        }
      }, 50);
    },
    handleHeaderClick() {
      this.dispatch("ElCollapse", "item-click", this);
      this.focusing = false;
      this.isClick = true;
    },
    handleEnterClick() {
      this.dispatch("ElCollapse", "item-click", this);
    },

    /* transition */
    beforeEnter(el) {
      addClass(el, "collapse-transition");
      if (!el.dataset) el.dataset = {};

      el.dataset.oldPaddingTop = el.style.paddingTop;
      el.dataset.oldPaddingBottom = el.style.paddingBottom;
      el.style.height = 0 + this.itemWrapCorrectionHeight + "px";
      el.style.paddingTop = 0;
      el.style.paddingBottom = 0;
    },
    enter(el) {
      el.dataset.oldOverflow = el.style.overflow;
      if (el.scrollHeight !== 0) {
        el.style.height = el.scrollHeight + "px";
        el.style.paddingTop = el.dataset.oldPaddingTop;
        el.style.paddingBottom = el.dataset.oldPaddingBottom;
      } else {
        el.style.height = "";
        el.style.paddingTop = el.dataset.oldPaddingTop;
        el.style.paddingBottom = el.dataset.oldPaddingBottom;
      }

      el.style.overflow = "hidden";
    },
    afterEnter(el) {
      // for safari: remove class then reset height is necessary
      removeClass(el, "collapse-transition");
      el.style.height = "";
      el.style.overflow = el.dataset.oldOverflow;
    },
    beforeLeave(el) {
      if (!el.dataset) el.dataset = {};
      el.dataset.oldPaddingTop = el.style.paddingTop;
      el.dataset.oldPaddingBottom = el.style.paddingBottom;
      el.dataset.oldOverflow = el.style.overflow;

      el.style.height = el.scrollHeight + "px";
      el.style.overflow = "hidden";
    },
    leave(el) {
      if (el.scrollHeight !== 0) {
        // for safari: add class after set height, or it will jump to zero height suddenly, weired
        addClass(el, "collapse-transition");
        el.style.height = 0 + this.itemWrapCorrectionHeight + 'px';
        el.style.paddingTop = 0;
        el.style.paddingBottom = 0;
      }
    },
    afterLeave(el) {
      removeClass(el, "collapse-transition");
      el.style.height = "";
      el.style.overflow = el.dataset.oldOverflow;
      el.style.paddingTop = el.dataset.oldPaddingTop;
      el.style.paddingBottom = el.dataset.oldPaddingBottom;
    }
  }
};
</script>

<style lang="less">
.el-collapse-item__header,
.el-collapse-item__wrap {
  background-color: #fff;
}
.el-scrollbar__bar {
  position: absolute;
  right: 2px;
  bottom: 2px;
  z-index: 1;
  border-radius: 4px;
  opacity: 0;
  -webkit-transition: opacity 120ms ease-out;
  transition: opacity 120ms ease-out;
}
.el-scrollbar__bar.is-vertical {
  width: 6px;
  top: 2px;
}
.el-scrollbar__bar.is-vertical > div {
  width: 100%;
}
.el-scrollbar__bar.is-horizontal {
  height: 6px;
  left: 2px;
}
.el-carousel__item,
.el-carousel__mask {
  height: 100%;
  top: 0;
  left: 0;
  position: absolute;
}
.el-scrollbar__bar.is-horizontal > div {
  height: 100%;
}
.el-carousel__item {
  width: 100%;
  display: inline-block;
  overflow: hidden;
  z-index: 0;
}
.el-carousel__item.is-active {
  z-index: 2;
}
.el-carousel__item.is-animating {
  -webkit-transition: -webkit-transform 0.4s ease-in-out;
  transition: -webkit-transform 0.4s ease-in-out;
  transition: transform 0.4s ease-in-out;
  transition: transform 0.4s ease-in-out, -webkit-transform 0.4s ease-in-out;
}
.el-carousel__item--card {
  width: 50%;
  -webkit-transition: -webkit-transform 0.4s ease-in-out;
  transition: -webkit-transform 0.4s ease-in-out;
  transition: transform 0.4s ease-in-out;
  transition: transform 0.4s ease-in-out, -webkit-transform 0.4s ease-in-out;
}
.el-carousel__item--card.is-in-stage {
  cursor: pointer;
  z-index: 1;
}
.el-carousel__item--card.is-in-stage.is-hover .el-carousel__mask,
.el-carousel__item--card.is-in-stage:hover .el-carousel__mask {
  opacity: 0.12;
}
.el-carousel__item--card.is-active {
  z-index: 2;
}
.el-carousel__mask {
  width: 100%;
  opacity: 0.24;
  -webkit-transition: 0.2s;
  transition: 0.2s;
}
.el-fade-in-enter,
.el-fade-in-leave-active,
.el-fade-in-linear-enter,
.el-fade-in-linear-leave,
.el-fade-in-linear-leave-active,
.fade-in-linear-enter,
.fade-in-linear-leave,
.fade-in-linear-leave-active {
  opacity: 0;
}
.fade-in-linear-enter-active,
.fade-in-linear-leave-active {
  -webkit-transition: opacity 0.2s linear;
  transition: opacity 0.2s linear;
}
.el-fade-in-linear-enter-active,
.el-fade-in-linear-leave-active {
  -webkit-transition: opacity 0.2s linear;
  transition: opacity 0.2s linear;
}
.el-fade-in-enter-active,
.el-fade-in-leave-active {
  -webkit-transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
  transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
}
.el-zoom-in-center-enter-active,
.el-zoom-in-center-leave-active {
  -webkit-transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
  transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
}
.el-zoom-in-center-enter,
.el-zoom-in-center-leave-active {
  opacity: 0;
  -webkit-transform: scaleX(0);
  transform: scaleX(0);
}
.el-zoom-in-top-enter-active,
.el-zoom-in-top-leave-active {
  opacity: 1;
  -webkit-transform: scaleY(1);
  transform: scaleY(1);
  -webkit-transition: opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1),
    -webkit-transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  transition: opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1),
    -webkit-transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1),
    opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1),
    opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1),
    -webkit-transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  -webkit-transform-origin: center top;
  transform-origin: center top;
}
.el-zoom-in-top-enter,
.el-zoom-in-top-leave-active {
  opacity: 0;
  -webkit-transform: scaleY(0);
  transform: scaleY(0);
}
.el-zoom-in-bottom-enter-active,
.el-zoom-in-bottom-leave-active {
  opacity: 1;
  -webkit-transform: scaleY(1);
  transform: scaleY(1);
  -webkit-transition: opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1),
    -webkit-transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  transition: opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1),
    -webkit-transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1),
    opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1),
    opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1),
    -webkit-transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  -webkit-transform-origin: center bottom;
  transform-origin: center bottom;
}
.el-zoom-in-bottom-enter,
.el-zoom-in-bottom-leave-active {
  opacity: 0;
  -webkit-transform: scaleY(0);
  transform: scaleY(0);
}
.el-zoom-in-left-enter-active,
.el-zoom-in-left-leave-active {
  opacity: 1;
  -webkit-transform: scale(1, 1);
  transform: scale(1, 1);
  -webkit-transition: opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1),
    -webkit-transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  transition: opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1),
    -webkit-transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1),
    opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1),
    opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1),
    -webkit-transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  -webkit-transform-origin: top left;
  transform-origin: top left;
}
.el-zoom-in-left-enter,
.el-zoom-in-left-leave-active {
  opacity: 0;
  -webkit-transform: scale(0.45, 0.45);
  transform: scale(0.45, 0.45);
}
.collapse-transition {
  -webkit-transition: 0.3s height ease-in-out, 0.3s padding-top ease-in-out,
    0.3s padding-bottom ease-in-out;
  transition: 0.3s height ease-in-out, 0.3s padding-top ease-in-out,
    0.3s padding-bottom ease-in-out;
}
.horizontal-collapse-transition {
  -webkit-transition: 0.3s width ease-in-out, 0.3s padding-left ease-in-out,
    0.3s padding-right ease-in-out;
  transition: 0.3s width ease-in-out, 0.3s padding-left ease-in-out,
    0.3s padding-right ease-in-out;
}
.el-list-enter-active,
.el-list-leave-active {
  -webkit-transition: all 1s;
  transition: all 1s;
}
.el-list-enter,
.el-list-leave-active {
  opacity: 0;
  -webkit-transform: translateY(-30px);
  transform: translateY(-30px);
}
.el-opacity-transition {
  -webkit-transition: opacity 0.3s cubic-bezier(0.55, 0, 0.1, 1);
  transition: opacity 0.3s cubic-bezier(0.55, 0, 0.1, 1);
}
.el-collapse {
  border-top: 1px solid #ebeef5;
  border-bottom: 1px solid #ebeef5;
}
.el-collapse-item__header {
  height: 48px;
  line-height: 48px;
  color: #303133;
  cursor: pointer;
  border-bottom: 1px solid #ebeef5;
  font-size: 13px;
  font-weight: 500;
  -webkit-transition: border-bottom-color 0.3s;
  transition: border-bottom-color 0.3s;
  outline: 0;
}
.el-collapse-item__arrow {
  margin-right: 8px;
  -webkit-transition: -webkit-transform 0.3s;
  transition: -webkit-transform 0.3s;
  transition: transform 0.3s;
  transition: transform 0.3s, -webkit-transform 0.3s;
  float: right;
  line-height: 48px;
  font-weight: 300;
}
.el-collapse-item__arrow.is-active {
  -webkit-transform: rotate(180deg);
  transform: rotate(180deg);
}
.el-collapse-item__header.focusing:focus:not(:hover) {
  color: #409eff;
}
.el-collapse-item__header.is-active {
  border-bottom-color: transparent;
}
.el-collapse-item__wrap {
  will-change: height;
  overflow: hidden;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border-bottom: 1px solid #ebeef5;
}
.el-collapse-item__content {
  padding-bottom: 25px;
  font-size: 13px;
  color: #303133;
  line-height: 1.769230769230769;
}
.el-collapse-item:last-child {
  margin-bottom: -1px;
}
</style>
