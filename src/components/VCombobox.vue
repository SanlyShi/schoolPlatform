<!--文档更新时间：2017-11-21
    props: {
      默认值
      defaultValue: {
        default () {
          return []
        }
      },
      下拉选项
      options: {
        type: Array,
        default: function () {
          return []
        }
      },
      是否开启多选
      multiple: {
        type: Boolean,
        default: false
      },
      是否显示清除所有按钮
      clearButton: {
        type: Boolean,
        default: false
      },
      选择并关闭（多选情况生效）
      closeOnSelect: {
        type: Boolean,
        default: false
      },
      下拉失效
      disabled: {
        type: Boolean,
        default: false
      },
      语言包
      lang: {
        type: String,
        default: 'zh-cn'
      },
      多选情况下上限限制
      limit: {
        type: Number,
        default: 1024
      },
      标签name属性（并没什么卵用）
      name: {
        type: String,
        default: null
      },
      选项文字字段
      optionsLabel: {
        type: String,
        default: 'label'
      },
      选项标识字段
      optionsValue: {
        type: String,
        default: 'value'
      },
      未选择情况下显示的文字
      placeholder: {
        type: String,
        default: ''
      },
      提交过程是否必填
      required: {
        type: Boolean,
        default: false
      },
      开启搜索的最小选项个数 当数组长度大于默认的10时开启搜索，之前的search设置搜索弃用
      minSearch: {
        type: Number,
        default: 5
      },
      搜索内容
      searchText: {
        type: String,
        default: null
      },
      选项远程获取地址
      url: {
        type: String,
        default: null
      }
    }
-->
<template>
  <div class="v-select" :class="classes">
    <div class="form-control dropdown-toggle" :style="'cursor:'+(disabled?'not-allowed':'pointer')" :disabled="disabled" @click="showOptions()">
      <span class="btn-content" :class="{'placeholder':!selected}" :title="selected || (loading ? translate.loading : (placeholder||translate.notSelected))" v-html="selected || (loading ? translate.loading : (placeholder||translate.notSelected)) "></span>
      <span v-if="selectedItems.length&&clearButton" class="close" @click.stop="clear()">&times;</span>
      <span class="dropdown-icon">
        <i class="maticon" style="transform: rotate(90deg);"
                  v-html="icons('chevron_left')" v-if="show">arrow_drop_up</i>
        <i class="maticon" style="transform: rotate(-90deg);"
                  v-html="icons('chevron_left')" v-else>arrow_drop_down</i>
        
      </span> 
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  import { translation } from '../assets/utils/utils.js'
  export default {
    props: {
      autoSelect: {
        type: Boolean,
        default: true
      },
      defaultValue: {
        default: ''
      },
      value: {
        type: String,
        default: ''
      },
      options: {
        type: Array,
        default: function () {
          return []
        }
      },
      multiple: {
        type: Boolean,
        default: false
      },
      clearButton: {
        type: Boolean,
        default: false
      },
      closeOnSelect: { // only works when multiple
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      defaultLang: {
        type: String,
        default: 'zh-cn'
      },
      dropdownClass: {
        type: 'String',
        default: null
      },
      limit: {
        type: Number,
        default: 1024
      },
      optionsLabel: {
        type: String,
        default: 'label'
      },
      optionsValue: {
        type: String,
        default: 'value'
      },
      placeholder: {
        type: String,
        default: ''
      },
      required: {
        type: Boolean,
        default: false
      },
      minSearch: {
        type: Number,
        default: 10
      },
      searchText: {
        type: String,
        default: ''
      },
      url: {
        type: String,
        default: ''
      },
    },
    data: function () {
      return {
        loading: null,
        show: false,
        selfOptions: [],
        values: '',
        isSelect: false, // 确定是选值还是传值
        lang: this.defaultLang
      }
    },
    computed: {
      selected: function () {
        var valuesArr = []
        var value = this.value || this.values
        if (!this.multiple && !isNaN(value)) {
          value = value ? (value + '') : null
        }
        if (value && typeof value === 'object') {
          value = value.join(',')
        }
        valuesArr = value ? value.split(',') : []
        var labels = []
        this.selfOptions.forEach((opt) => {
          if (valuesArr.indexOf(opt[this.optionsValue]) >= 0) {
            labels.push(opt[this.optionsLabel])
          }
        })

        return labels.join(',')
      },
      selectedItems: function () {
        var valuesArr = []
        var value = this.value || this.values
        if (!this.multiple && !isNaN(value)) {
          value = value + ''
        }
        if (value && typeof value === 'object') {
          value = value.join(',')
        }
        valuesArr = value ? value.split(',') : []
        var selectedItems = []
        this.selfOptions.forEach((opt) => {
          if (valuesArr.indexOf(opt[this.optionsValue]) >= 0) {
            selectedItems.push(opt)
          }
        })
        // if (this.required && selectedItems.length === 0) {
        //   if (this.selfOptions[0]) {
        //     selectedItems.push(this.selfOptions[0])
        //   }
        // }
        return selectedItems
      },
      classes: function () {
        return [{
          open: this.show,
          disabled: this.disabled
        }, this.class, 'btn-group']
      },
      translate: function () {
        return translation(this.lang).comboAndDate
      },
    },
    watch: {
      url: function () {
        this.update()
      },
      options: {
        deep: true,
        handler: function (arr) {
          this.selfOptions = arr
          // 对value值统一转成字符串
          this.selfOptions.forEach((ele) => {
            ele[this.optionsValue] = ele[this.optionsValue].toString()
          })
          if (this.required && this.values.length === 0) {
            if (this.selfOptions[0]) {
              this.values = this.selfOptions[0][this.optionsValue]
            }
          }
        }
      },
      value: function (value, oldValue) {
        this.values = value
      },
      values: function (value) {
        this.$emit('input', value)
        if (!this.autoSelect) {
          if (this.isSelect) {
            this.$emit('afterSelected', { val: value, value: value, target: this })
            this.$emit('change', { val: value, value: value, target: this })
            this.isSelect = false
          }
        } else {
          this.$emit('afterSelected', { val: value, value: value, target: this })
          this.$emit('change', { val: value, value: value, target: this })
        }
      }
    },
    methods: {
      clear: function () {
        if (this.disabled) {
          return
        }
      },
      showOptions: function () {
        if (this.disabled) return
        this.show = true
        this.$select({
          selectedItems: this.selectedItems,
          options: this.selfOptions,
          optionsLabel: this.optionsLabel,
          optionsValue: this.optionsValue,
          multiple: this.multiple,
          closeOnSelect: this.closeOnSelect,
          required: this.required,
          limit: this.limit,
          minSearch: this.minSearch,
          searchText: this.searchText,
          dropdownClass: this.dropdownClass,
          defaultLang: this.lang,
          onSelect: (selectedItems) => {
            var arr = []
            selectedItems.forEach((ele) => {
              arr.push(ele[this.optionsValue])
            })
            this.values = arr.join(',')
            this.isSelect = true
          },
          onClick: (option) => {
            this.$emit('optionClick', { option: option, target: this })
          },
          onClose: () => {
            this.show = false
          }
        })
      },
      update: function () {
        // 获取下拉框选择数据
        if (this.url) {
          this.loading = true
          $.ajax({
            url: this.url,
            type: 'get',
            data: {
              lang: this.lang
            },
            success: (data) => {
              if (data.state) {
                this.selfOptions = data.data || []
                this.selfOptions.forEach((ele) => {
                  ele[this.optionsValue] = ele[this.optionsValue].toString()
                })
                if (this.required && this.values.length === 0) {
                  if (this.selfOptions[0]) {
                    this.values = this.selfOptions[0][this.optionsValue]
                  }
                }
              } else {
                this.$toast(data.message)
              }
            }
          }).always(() => {
            this.loading = false
          })
        }
      }
    },
    created: function () {
      var la = localStorage.getItem('lang')
      if (translation(la)) {
        this.lang = la
      }
      this.selfOptions = this.options || []
      this.selfOptions.forEach((ele) => {
        ele[this.optionsValue] = ele[this.optionsValue].toString()
      })
      this.values = this.value
      if (this.required && !this.values) {
        if (this.selfOptions[0]) {
          this.values = this.selfOptions[0][this.optionsValue]
        }
      }
      this.update()
    },
    mounted: function () {
      this.$emit('onload', this)
    }
  }
</script>

<style lang="less">
.v-select {
  position: relative;
  &.disabled {
    .dropdown-toggle {
      color: #c0c4cc;
      background: transparent;
    }
  }
  &.open {
    z-index: 9999;
  }
  .close {
    margin-left: 5px;
  }
  div.form-control.dropdown-toggle {
    position: relative;
    height: auto;
    padding-right: 24px;
    cursor: pointer;
    border-radius: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    box-shadow: none;
    .dropdown-icon {
      position: absolute;
      top: 0;
      right: 0;
      height: 100%;
      font-size: 24px;
      color: rgba(0, 0, 0, 0.54) !important;
      i {
        line-height: 30px;
      }
    }
    .btn-content {
      font-size: 13px;
      &.placeholder{
        color: #909399;
      }
    }
  }

  .form-control.dropdown-toggle {
    border-radius: 0px;
  }

  .form-control.dropdown-toggle > .close {
    float: none;
    font-size: 20px;
    line-height: 20px;
  }
}
</style>
