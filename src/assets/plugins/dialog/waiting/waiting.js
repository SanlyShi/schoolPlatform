import vue from 'vue'
import $ from 'jquery'

// 这里就是我们刚刚创建的那个静态组件
import waitingComponent from './waiting.vue'

// 返回一个 扩展实例构造器
const WaitingConstructor = vue.extend(waitingComponent)
var waitingDom = null
// 定义弹出组件的函数 接收2个参数, 要显示的文本 和 显示时间
function showWaiting (obj) {
  // 实例化一个 toast.vue
  obj = obj || {
    text: '',
    container: 'body'
  }
  waitingDom = new WaitingConstructor({
    el: document.createElement('div'),
    data () {
      return {
        text: obj.text || '',
        show: true,
        container: obj.container || 'body'
      }
    }
  })
  // 把 实例化的 toast.vue 添加到 body 里
  $(waitingDom.container).append(waitingDom.$el)
  waitingDom.show = true
}

function closeWaiting () {
  waitingDom.show = false
}

// 注册为全局组件的函数
function registryToast () {
  // 将组件注册到 vue 的 原型链里去,
  // 这样就可以在所有 vue 的实例里面使用 this.$toast()
  vue.prototype.$waiting = {
    show: showWaiting,
    close: closeWaiting
  }
}

export default registryToast
export const $waiting = {
  show: showWaiting,
  close: closeWaiting
}
