<template>
  <module-container title="招聘简章" :inline="inline">
    <div v-if="!edit" v-html="form"></div>
    <u-editor ref="descEditor" :config="editorConfig" v-model="form" v-else></u-editor>
  </module-container>
</template>

<script>
  import FormMixin from '../mixins/formMixin'
  import ModuleContainer from '../components/moduleContainer.vue'

  export default {
    props: {
      inline: Boolean,
      edit: Boolean,
      rules: {
        type: Object,
        default: {}
      }
    },
    mixins: [FormMixin],
    components: {
      ModuleContainer,
    },
    data() {
      return {
        editorConfig: {
          autoHeightEnabled: true,
          wordCount: false,
          autoFloatEnabled: false,
          toolbars: [
            ['source', //源代码
              'undo', //撤销
              'redo', //重做
              'bold', //加粗

              'italic', //斜体
              'underline', //下划线
              'strikethrough', //删除线
              'fontborder', //字符边框
              'subscript', //下标

              'superscript', //上标
              'formatmatch', //格式刷
              'removeformat', //清除格式
              'time', //时间
              'date', //日期
              'horizontal', //分隔线
            ],
            ['paragraph', //段落格式
              'fontfamily', //字体
              'fontsize', //字号
              'justifyleft', //居左对齐
              'justifyright', //居右对齐
              'justifycenter', //居中对齐
              'justifyjustify', //两端对齐
              'forecolor', //字体颜色
              'backcolor', //背景色
              'insertorderedlist', //有序列表
              'insertunorderedlist', //无序列表
              'lineheight', //行间距
              'rowspacingtop', //段前距
              'rowspacingbottom', //段后距
            ],
            [
              'insertimage', //多图上传
              'attachment', //附件
              'link', //超链接
              'emotion', //表情
              'spechars', //特殊字符
              'imagenone', //默认
              'imageleft', //左浮动
              'imageright', //右浮动
              'autotypeset', //自动排版
              'snapscreen', //截图
              'preview', //预览
              'print', //打印
              'fullscreen', //全屏
              'background', //背景
              'insertcode', //代码语言
              'directionalityltr', //从左向右输入
              'directionalityrtl', //从右向左输入
              'customstyle', //自定义标题
              'template', //模板
            ]
          ]
        }
      }
    }
  }
</script>
