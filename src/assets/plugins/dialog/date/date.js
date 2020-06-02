import vue from 'vue'

import dateComponent from './date.vue'

// 返回一个 扩展实例构造器
const DateConstructor = vue.extend(dateComponent)

var showDate = function (obj) {
  var dateEl = this.$el
  var curD = null
  var value = obj.value || ''
  obj.value = value.replace(/-/g, '/')
  curD = new Date(obj.value)
  curD = isNaN(curD.getFullYear()) ? (new Date()) : curD
  const dateDom = new DateConstructor({
    el: document.createElement('div'),
    data: {
      format: obj.dateFormat || 'yyyy-MM-dd',
      value: obj.value || '',
      showTime: obj.showTime || (obj.dateFormat && obj.dateFormat.length > 10) || false,
      currDate: curD,
      defaultLang: obj.defaultLang || 'zh-cn',
      el: obj.type ? null : dateEl,
      event: obj.event
    },
    methods: {
      _optionResult: function (result) {
        obj.onSelect && obj.onSelect(result)
      },
      _optionClose: function () {
        obj.onClose && obj.onClose()
      }
    }
  })
  document.body.appendChild(dateDom.$el)
}

// 注册为全局组件的函数
var registryDate = function () {
  // 将组件注册到 vue 的 原型链里去,
  // 这样就可以在所有 vue 的实例里面使用 this.$date()
  vue.prototype.$date = showDate
}

export default registryDate
