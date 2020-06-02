import vue from 'vue'

import tooltipComponent from './tooltip.vue'

// 返回一个 扩展实例构造器
const TooltipConstructor = vue.extend(tooltipComponent)
const tooltipDom = new TooltipConstructor({
  el: document.createElement('div')
})
document.body.appendChild(tooltipDom.$el)
// 把 实例化的 toast.vue 添加到 body 里
document.body.appendChild(tooltipDom.$el)
var showTooltip = function (evt, tip) {
  // 实例化一个 prompt.vue
  tooltipDom.tip = tip
  tooltipDom.show = tip
  if (evt) {
    tooltipDom.el = evt.target
    tooltipDom.rect = evt.target.getBoundingClientRect()
  }
}

// 注册为全局组件的函数
var registryTooltip = function () {
  // 将组件注册到 vue 的 原型链里去,
  // 这样就可以在所有 vue 的实例里面使用 this.$toast()
  vue.prototype.$tooltip = showTooltip
}

export default registryTooltip
