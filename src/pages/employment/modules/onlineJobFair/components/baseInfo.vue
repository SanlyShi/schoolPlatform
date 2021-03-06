<template>
  <module-container title="基本信息" :inline="inline">
    <el-form v-if="!edit" :model="form" size="small">
      <el-form-item label="网招会名称" v-if="!(rules.name && rules.name.hidden)">
        <p>{{ form.name }}</p>
      </el-form-item>
      <el-form-item label="网招会起止时间">
        <p>{{form.timeRange.map(time => new Date(time).format('yyyy-MM-dd HH:mm')).join(' ~ ')}}</p>
      </el-form-item>
      <el-form-item label="申请起止时间" v-if="!(rules.applyTime && rules.applyTime.hidden)">
        <p>{{form.applyTimeRange.map(time => new Date(time).format('yyyy-MM-dd HH:mm')).join(' ~ ')}}</p>
      </el-form-item>
      <el-form-item label="简介">
        <p v-html="form.desc"></p>
      </el-form-item>
    </el-form>

    <el-form ref="form" :model="form" :rules="formRules" @validate="formValidate" v-else>
      <el-form-item label="网招会名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入网招会名称"></el-input>
      </el-form-item>

      <el-form-item label="网招会起止时间" prop="timeRange">
        <el-date-picker
          v-model="form.timeRange"
          type="datetimerange"
          format="yyyy-MM-dd HH:mm"
          range-separator="到"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          :picker-options="timeRangePickerOptions">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="申请起止时间" prop="applyTimeRange">
        <el-date-picker
          v-model="form.applyTimeRange"
          type="datetimerange"
          format="yyyy-MM-dd HH:mm"
          range-separator="到"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          :picker-options="applyTimeRangePickerOptions">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="简介">
        <!-- 富文本 -->
        <u-editor ref="descEditor" :config="editorConfig" v-model="form.desc"></u-editor>
      </el-form-item>
    </el-form>
  </module-container>
</template>

<script>
  import FormMixin from '../../../mixins/formMixin'
  import TimeLimitMixin from '../../../mixins/timeLimitMixin'
  import ModuleContainer from '../../../components/moduleContainer.vue'
  export default {
    props: {
      inline: Boolean,
      edit: Boolean, // 编辑态
      rules: {
        type: Object,
        default: {}
      }
    },
    mixins: [FormMixin, TimeLimitMixin],
    components: {
      ModuleContainer,
    },
    data() {
      return {
        formRules: {
          name: [
            { required: true, message: '请输入网招会名称', trigger: 'blur' },
            { min: 2, max: 60, message: '长度在2到60个汉字', trigger: 'blur' }
          ],
          timeRange: [{ required: true, message: '请选择网招会起止时间', trigger: 'blur' }],
          applyTimeRange: [{ required: true, message: '请选择申请起止时间', trigger: 'blur' }]
        },
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
    },
    created() {
    },
    methods: {
      async validate() {
        return this.$refs.form.validate()
      }
    }
  }
</script>
