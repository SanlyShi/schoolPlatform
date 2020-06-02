import vue from 'vue'

// 这里就是我们刚刚创建的那个静态组件
import promptComponent from './prompt.vue'

// 返回一个 扩展实例构造器
const PromptConstructor = vue.extend(promptComponent)

// 定义弹出组件的函数 接收2个参数, 要显示的文本 和 显示时间
var showPrompt = function (obj) {
  // 实例化一个 prompt.vue
  const promptDom = new PromptConstructor({
    el: document.createElement('div'),
    data: {
      show: true,
      tip: obj.tip,
      placeholder: obj.placeholder,
      warn: obj.warn || '',
      text: ''
    },
    methods: {
      _optionResult: function (result) {
        return obj.callback && obj.callback(result)
      },
      _prompt: function (type) {
        if (this.show) {
          if (this._optionResult({text: this.text, type: type}) !== false) {
            this.show = false
          }
        }
      }
    }
  })

  // 把 实例化的 toast.vue 添加到 body 里
  document.body.appendChild(promptDom.$el)
}

// 注册为全局组件的函数
var registryPrompt = function () {
  // 将组件注册到 vue 的 原型链里去,
  // 这样就可以在所有 vue 的实例里面使用 this.$toast()
  vue.prototype.$prompt = showPrompt
}

export default registryPrompt
