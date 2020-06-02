<template>
  <div class="editor-page">
    <script :id="'editor_'+idTime" type="text/plain"></script>
  </div>
</template>

<script>
  /* eslint-disable */
  import { createTime } from '../assets/utils/utils.js'
  export default {
    props: {
      value: {
        type: String,
        default: ''
      },
      config: {
        type: Object
      }
    },
    created: function () {
      this.idTime = createTime()
    },
    data: function () {
      return {
        editor: null,
        defaultValue:  this.value,
        idTime: ''
      }
    },
    computed: {

    },
    watch: {
      defaultValue: function (val) {
        this.$emit('input', val)
        this.$emit('change', this.defaultValue)
      },
      value: function (val) {
        if (val !== this.defaultValue) {
          this.editor.reset()
          this.defaultValue = val
          this.editor.setContent(val)
        }
      }
    },
    mounted: function () {
      const _this = this

      // 预先清除富文本缓存
      if(sessionStorage.getItem("thisIdTime")){
        UE.delEditor('editor'+sessionStorage.getItem('thisIdTime'));
      }
      this.editor = UE.getEditor('editor_' + this.idTime, this.config) // 初始化UE
      sessionStorage.setItem("thisIdTime",this.idTime)

      this.editor.addListener('ready', function () {
        _this.editor.setContent(_this.defaultValue) // 确保UE加载完成后，放入内容。
        _this.editor.addListener('contentchange', function () {
          _this.defaultValue = _this.editor.getContent()
        })
      })
    },
    methods: {
      getUEContent: function () { // 获取内容方法
        return this.editor.getContent()
      }
    },
    beforeDestroy: function () {
      this.editor.destroy()
    }
  }
</script>

<style lang='less'>
@import url("../assets/common.less");
.editor-page {
  position: relative;
  width: 100%;
  padding: 0;
  .edui-editor.edui-default {
    width: auto !important;
  }
}
</style>
