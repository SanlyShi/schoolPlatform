import vue from 'vue'
import $ from 'jquery'

// 这里就是我们刚刚创建的那个静态组件
import previewComponent from './preview.vue'

// 返回一个 扩展实例构造器
const PreviewConstructor = vue.extend(previewComponent)
function showPreview (obj) {
  obj = obj || {
    container: 'body',
    name: '',
    type: '',
    url: ''
  }
  var previewDom = new PreviewConstructor({
    el: document.createElement('div'),
    data () {
      return {
        container: obj.container || 'body',
        name: obj.name || '',
        type: obj.type || '',
        url: obj.url || ''
      }
    }
  })

  // 把 实例化的 preview.vue 添加到 body 里
  $(obj.container || 'body').append(previewDom.$el)
}

// 注册为全局组件的函数
function registryPreview () {
  // 将组件注册到 vue 的 原型链里去,
  // 这样就可以在所有 vue 的实例里面使用 this.$preview()
  vue.prototype.$preview = showPreview
}

export default registryPreview
