import vue from 'vue'

import seletctComponent from './select.vue'

// 返回一个 扩展实例构造器
const SelectConstructor = vue.extend(seletctComponent)

var showSelect = function (obj) {
  // 实例化一个 prompt.vue
  obj.options = JSON.parse(JSON.stringify(obj.options))
  obj.selectedItems = JSON.parse(JSON.stringify(obj.selectedItems))
  var selectEl = obj.el || this.$el
  const selectDom = new SelectConstructor({
    el: document.createElement('div'),
    data: {
      options: obj.options || [],
      optionsLabel: obj.optionsLabel || 'label',
      optionsValue: obj.optionsValue || 'value',
      multiple: obj.multiple,
      closeOnSelect: obj.closeOnSelect,
      required: obj.required,
      limit: obj.limit || 1024,
      minSearch: obj.minSearch || 10,
      searchText: obj.searchText || '搜索项',
      selectedItems: obj.selectedItems || [],
      dropdownClass: obj.dropdownClass,
      defaultLang: obj.defaultLang || 'zh-cn',
      el: selectEl
    },
    methods: {
      _optionResult: function (result) {
        obj.onSelect && obj.onSelect(result)
      },
      _optionClose: function () {
        obj.onClose && obj.onClose()
      },
      _optionClick: function (option) {
        obj.onClick && obj.onClick(option)
      }
    }
  })
  // 把 实例化的 toast.vue 添加到 body 里
  document.body.appendChild(selectDom.$el)
}

// 注册为全局组件的函数
var registrySelect = function () {
  // 将组件注册到 vue 的 原型链里去,
  // 这样就可以在所有 vue 的实例里面使用 this.$toast()
  vue.prototype.$select = showSelect
}

export default registrySelect
