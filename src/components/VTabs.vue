<template>
  <div class="v-tab">
    <div class="v-tab-header">
      <div
        class="v-tab-header-item"
        :class="{active: i === index}"
        v-for="(tab, i) in tabs"
        :key="i"
        @click="index = i"
      >{{tab.name}}{{i}}</div>
    </div>
    <div class="v-tab-content">
      <div class="v-tab-content-list">
        <div
          class="v-tab-content-item"
          v-for="(tab, i) in tabs"
          :key="i"
          :style="`transform: translate3d(${deviceWidth*(i - index) + moveJson.deltaX}px, 0px, 0px);`"
        >
          <router-view :name="tab.route"></router-view>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      tabs: {
        default: function () {
          return [{
            name: '服装',
            id: 'clothing',
            route: '/applicationList/MFreshmanApplication'
          }]
        }
      },
      width: {
        default: 0
      }
    },
    data: function () {
      return {
        index: 0,
        deviceWidth: 0,
        moveJson: {
          deltaX: 0,
          deltaY: 0,
          slidePercent: 0.2, //达到切换效果的拖动距离比
          yxProportion: 0.5 //左右滑动识别比,
        }
      }
    },
    methods: {
      _getSlideAngle: function (dx, dy) {
        return Math.atan2(dy, dx) * 180 / Math.PI;
      },
      _getSlideDirection: function (startX, startY, endX, endY) {
        var dy = endY - startY;
        var dx = endX - startX;
        var result = 0;
        //如果滑动距离太短 
        if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
          return result;
        }
        var angle = this._getSlideAngle(dx, dy);
        if (angle >= -45 && angle < 45) {
          result = 4;
        } else if (angle >= 45 && angle < 135) {
          result = 1;
        } else if (angle >= -135 && angle < -45) {
          result = 2;
        }
        else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
          result = 3;
        }
        return result;
      },
      _touchBind: function () {
        var startX, startY;
        var that = this
        var dom = document.querySelector('.v-tab-content')
        dom.addEventListener('touchstart', (ev) => {
          startX = ev.touches[0].pageX;
          startY = ev.touches[0].pageY;
        }, false);
        dom.addEventListener('touchmove', (ev) => {
          this.moveJson.deltaX = ev.touches[0].pageX - startX
          this.moveJson.deltaY = ev.touches[0].pageY - startY
          if(this.moveJson.deltaX && Math.abs(this.moveJson.deltaY/this.moveJson.deltaX) > this.moveJson.yxProportion) {
            this.moveJson.deltaX = 0
          }
        }, false);
        dom.addEventListener('touchend', (ev) => {
          var endX, endY;
          endX = ev.changedTouches[0].pageX;
          endY = ev.changedTouches[0].pageY;
          var direction = this._getSlideDirection(startX, startY, endX, endY);
          switch (direction) {
            case 0:
              // 不动
              break;
            case 1:
              // 向下
              break;
            case 2:
              // 向上
              break;
            case 3:
              // 向左
              if (this.index < this.tabs.length - 1 && Math.abs(this.moveJson.deltaX) > this.moveJson.slidePercent*this.deviceWidth) {
                this.index++
                this._initHeader()
              }
              break;
            case 4:
              // 向右
              if (this.index > 0 && Math.abs(this.moveJson.deltaX) > this.moveJson.slidePercent*this.deviceWidth) {
                this.index--
                this._initHeader()
              }
              break;
            default:
          }
          this.moveJson.deltaX = 0
          this.moveJson.deltaY = 0
        }, false);
      },
      _initHeader: function () {
        var header = document.querySelector('.v-tab-header')
        var activeItem = document.querySelector('.v-tab-header-item.active')
        var scrollLeft = activeItem.offsetLeft - this.deviceWidth/2
        if( scrollLeft < 0) {
          return
        }
        header.scrollLeft = scrollLeft
      }
    },
    mounted: function () {
      if (!this.width) {
        this.deviceWidth = document.body.clientWidth
      } else {
        this.deviceWidth = this.width
      }
      this._touchBind()
    },
    created: function () {

    },
    watch: {
      width: function (val) {
        this.deviceWidth = val
      }
    }
  }
</script>
<style lang="less">
@activeColor: rgb(128, 174, 235);
.v-tab {
  position: relative;
  width: 100%;
  height: 100%;
  .v-tab-header,
  .v-tab-content {
    position: absolute;
    left: 0;
    right: 0;
  }
  .v-tab-header {
    top: 0;
    height: 46px;
    white-space: nowrap;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    transition: all 0.1s linear;
    .v-tab-header-item {
      display: inline-block;
      padding: 5px 10px;
      line-height: 36px;
      &.active {
        padding-bottom: 3px;
        color: @activeColor;
        border-bottom: 2px solid @activeColor;
      }
    }
  }
  .v-tab-content {
    top: 46px;
    bottom: 0;
    overflow: hidden;
    .v-tab-content-list {
      position: relative;
      width: 100%;
      height: 100%;
    }
    .v-tab-content-item {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      transition: all 0.1s linear;
    }
  }
}
</style>
