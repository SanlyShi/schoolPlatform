import Vue from 'vue'
import $ from 'jquery'
import cssIcons from './cssicons.js'
export default {
  init: function () {
    Vue.prototype.showWaiting = function (container, color) {
      var waitingCover = cssIcons['spinner']
      container = container || 'html'
      $(container).append(waitingCover)
      setTimeout(() => {
        $('#showWaiting.page-waiting').remove()
      }, 5000)
    }
    Vue.prototype.closeWaiting = function () {
      $('#showWaiting.page-waiting').remove()
    }

    Vue.prototype.toast = function (msg, showTime, showType, container) {
      showType = cssIcons[showType] ? 'normal' : 'normal'
      container = container || 'html'
      showTime = showTime || 3000
      msg = msg || ''
      if (showType === 'normal' && msg === '') {
        msg = '操作成功！'
      }
      var waitingCover = cssIcons[showType](msg)
      $(container).append(waitingCover)
      $('#showWaiting.page-toast').animate({
        opacity: 1
      }, 300)
      setTimeout(() => {
        $('#showWaiting.page-toast').animate({
          opacity: 0
        }, 300, function () {
          $('#showWaiting.page-toast').remove()
        })
      }, showTime)
    }

    Vue.prototype.$pullUpToLoad = function (option) {
      var options = {
        container: option.container,
        up: {
          bottom: (option.up && option.up.bottom) || 150,
          callback: (option.up && option.up.callback) || function () {}
        },
        down: {
          height: (option.down && option.down.height) || 200,
          callback: (option.down && option.down.callback) || function () {}
        }
      }
      if (!option.container) {
        console.error('$pullUpToLoad.container为空，初始化失败！')
        return
      }
      $(options.container).addClass('xc-pull-refresh-container')
      var $dom = $(options.container)
      if (option.up) {
        var timer = null
        var deltaY = 0
        var oldY = 0
        $dom.off('scroll').on('scroll', function () {
          var scrollTop = $(this).scrollTop()
          var contentH = $(this).get(0).scrollHeight
          var viewH = $(this).height()
          deltaY = scrollTop - oldY
          oldY = scrollTop
          if (deltaY > 0) {
            if (timer) {
              clearTimeout(timer)
            }
            timer = setTimeout(() => {
              if (contentH - scrollTop <= viewH + options.up.bottom) {
                options.up.callback && options.up.callback()
              }
            }, 100)
          }
        })
      }

      if (option.down) {
        var touching = false
        var startY = 0
        var top = 0
        var state = 0

        $dom.off('touchstart').on('touchstart', function (e) {
          startY = e.targetTouches[0].pageY
          if ($dom.scrollTop() === 0) {
            touching = true
          }
        })
        $dom.off('touchmove').on('touchmove', function (e) {
          if (!touching) return
          var diff = e.targetTouches[0].pageY - startY
          if (diff > 0) {
            $dom.addClass('xc-pull-refresh-tip')
            diff = diff > options.down.height ? options.down.height : diff
            e.preventDefault()
          } else {
            return
          }
          // 这个this.top要对应绑定到该元素的transform: translateY(+top+ 'px')上，不然是无法拉动的
          // 因此这里还要对偏移高度做一下处理，直接设置diff +(this.state === 2 ? 40 : 0) 太快了，因为拉取幅度太大
          // 让diff*0.25这样子就差不多了
          top = Math.floor(diff * 0.25)
          $dom.css('transform', `translateY(${top}px)`)
          if (top >= options.down.height / 4) {
            state = 1 // 代表正在拉取
            $dom.addClass('xc-pull-refresh-release')
          } else {
            state = 0 // 代表初始转态
          }
        })
        // touchend手指放开发生
        $dom.off('touchend').on('touchend', function () {
          touching = false
          if (state === 2) {
            top = options.down.height / 4
            return
          }
          // 判断抬起时的高度，是大于40 就开启刷新
          if (top >= options.down.height / 4) {
            $dom.addClass('xc-pull-refresh-loadding')
            setTimeout(() => {
              options.down.callback && options.down.callback()
              top = 0
              $dom.css('transform', `translateY(${top}px)`)
              $dom.removeClass('xc-pull-refresh-release xc-pull-refresh-loadding xc-pull-refresh-tip')
            }, 300)
          } else {
            state = 0
            top = 0
            $dom.css('transform', `translateY(${top}px)`)
            $dom.removeClass('xc-pull-refresh-tip')
          }
        })
      }
    }
  }
}
