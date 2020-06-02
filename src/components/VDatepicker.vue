<!--最后修改时间：2017-11-23
  props: {
  传入默认值
      defaultValue: {
        type: String,
        default: ''
      },
      传入日期显示格式
      format: {
        default: 'yyyy-MM-dd'
      },
      关闭时间显示,已废除，是否需要时间显示现在根据format进行判断
      showTime: {
        type: boolean,
        default: true
      },
      设置组件宽度
      width: {
        type: String,
        default: '200px'
      },
      是否显示清除内容按钮
      clearButton: {
        type: Boolean,
        default: true
      },
      日期显示语言
      defaultLang: {
        type: String,
        default: 'zh-cn'
      },
      提示语
      placeholder: {
        type: String,
        default: '请选择日期'
      }
    },

    @daySelected: 选择时间触发
    参数： { value: this.value, target: this }
-->
<template>
  <div class="v-datepicker" :class="classes">
    <div class="form-control" :style="'cursor:'+(disabled?'not-allowed':'pointer')" :disabled="disabled" @click="inputClick($event)">
      <span class="btn-content" :title="text || (placeholder||translate.datePlaceholder)" v-html="text || (placeholder||translate.datePlaceholder) "></span>
      <span v-if="(!disabled) && clearButton && text" class="close v-datepicker-icon" @click.stop="clearValue">&times;</span>
      <span class="maticon v-datepicker-icon" v-html="icons(showTime ? 'schedule' : 'event')" v-else></span>
    </div>

    <!-- <button v-if="(!disabled) && clearButton && text" type="button" class="pull-right close" @click.stop="clearValue">
      <span>&times;</span>
    </button>
    <span class="maticon v-datepicker-icon" v-html="icons(showTime ? 'schedule' : 'event')" v-else>event</span>
    <input class="form-control v-datepicker-input" :class="classes" type="text" :placeholder="placeholder||translate.datePlaceholder" :style="'cursor:'+ (disabled?'not-allowed':'pointer')" :value="text" readonly="" disabled v-if="!disabled"/>
    <input class="form-control v-datepicker-input" :class="classes" type="text" :placeholder="placeholder||translate.datePlaceholder" :style="'cursor:'+ (disabled?'not-allowed':'pointer')" :value="text" readonly="" disabled v-else/> -->
  </div>
</template>

<script>
  import { translation } from '../assets/utils/utils.js' 
  export default {
    props: {
      beforeSelect:{//传一个方法进来,返回值为选择的时间, 当return true的时候 才会赋值
        type:Function,
        default(){
          return true
        }
      },
      clearButton: {
        type: Boolean,
        default: true
      },
      width: {
        type: String,
        default: '200px'
      },
      placeholder: {
        type: String,
        default: ''
      },
      disabled: {
        type: Boolean,
        default: false
      },
      defaultValue: {
        type: String,
        default: ''
      },
      format: {
        default: 'yyyy-MM-dd'
      },
      defaultLang: {
        type: String,
        default: 'zh-cn'
      },
      value: {
        type: String,
        default: ''
      }
    },
    created: function () {
      var la = localStorage.getItem('lang')
      if (translation(la)) {
        this.lang = la
      }
      this.curValue = this.defaultValue || this.value
    },
    data: function () {
      return {
        curValue: '',
        lang: this.defaultLang
      }
    },
    computed: {
      translate: function () {
        return translation(this.lang).comboAndDate
      },
      classes: function () {
        return [{
          'with-reset-button': this.clearButton,
        }]
      },
      text: function () {
        // 由于兼容原因， 需要将 '-' 转换为 '/'才可正常显示
        //由于加了年月日 
        // if(this.curValue&&this.curValue.indexOf('年')!==-1){
        //   let curValue =  this.curValue.replace('年','/')
        //   curValue = curValue.replace('月','/')
        //   curValue = curValue.replace('日','')
        //   if(curValue.length<=7){
        //     curValue+='-01'
        //   }
        //  return this._stringify((new Date(curValue.replace(/-/g, '/'))), this.format)
        // }

        // if(this.curValue&&this.curValue.length<=7){//兼容问题 IOS不识别 
        //  let curValue =  this.curValue+'-01'
        //  return this._stringify((new Date(curValue.replace(/-/g, '/'))), this.format)
        // }
        return this._stringify((this.curValue ? new Date(this.curValue.replace(/-/g, '/')) : null), this.format)
      },
      showTime: function () {
        return this.format.length > 10
      }
    },
    methods: {
      clearValue: function () {
        this.curValue = ''
      },
      inputClick: function (obj) {
        if (this.disabled) { return }
        let clickDom = ''
         if($(obj.target).hasClass('form-control')){
         clickDom = $(obj.target)
        }else{
          clickDom = $(obj.target).parents('.form-control')
        }
        clickDom.addClass('active');
        this.$date({
          value: this.curValue,
          dateFormat: this.format,
          defaultLang: this.lang,
          showTime: this.showTime,
          onSelect: (value) => {
            value = this._stringify((value ? new Date(value.replace(/-/g, '/')) : null), 'yyyy-MM-dd hh:ii:ss')
            if(!this.beforeSelect(value)){
              return
            }
            this.curValue = value.length > 10 ? value : (value + ' 00:00:00')
            clickDom.removeClass('active');
          },
          onClose(){
            clickDom.removeClass('active');
          }
        })
      },
      _stringify: function (date, format) {
        if (!date) return ''
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        const hour = date.getHours()
        const minute = date.getMinutes()
        const second = date.getSeconds()
        var format1 = format || 'yyyy-MM-dd'
        var str = format1
          .replace(/yyyy/g, year)
          .replace(/MM/g, ('0' + month).slice(-2))
          .replace(/dd/g, ('0' + day).slice(-2))
          .replace(/yy/g, year)
          .replace(/M(?!a)/g, ('0' + month).slice(-2))
          .replace(/d/g, ('0' + day).slice(-2))
          .replace(/hh/g, ('0' + hour).slice(-2))
          .replace(/ii/g, ('0' + minute).slice(-2))
          .replace(/ss/g, ('0' + second).slice(-2))
        return str
      }
    },
    watch: {
      value: function (value) {
        this.curValue = value
      },
      curValue: function (value) {
        this.$emit('input', value)
        this.$emit('daySelected', { value: value, target: this })
        this.$emit('change', { value: value, target: this })
      }
    }
  }
</script>

<style lang="less">
.mTable_wrap{
  .v-datepicker .form-control.active,.form-control:hover{
     border:none
  }
}
.v-datepicker {
  position: relative;
  cursor: pointer;
  overflow: hidden;
  .form-control.active,.form-control:hover{
     border:1px solid #4091ff;
  }
  .form-control[disabled] {
    background: #eee;
  }
  input.v-datepicker-input.with-reset-button {
    padding: 0;
    box-shadow: none;
    background: transparent;
    border: none;
    text-align: inherit;
    z-index: 2;
  }
  div.form-control {
    position: relative;
    height: auto;
    padding-right: 24px;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    box-shadow: none;
    .btn-content {
      font-size: 13px;
    }
  }

  .close {
    position: absolute;
    top: 0;
    right: 0;
    outline: none;
    z-index: 5;
    display: block;
    // height: 34px;
    line-height: 34px;
    text-align: center;
  }

  .close:focus {
    opacity: 0.2;
  }
  .v-datepicker-icon {
    position: absolute;
    font-size: 20px;
    top: -1px;
    right: 4px;
    z-index: 99;
    height: 100%;
    color: rgba(0, 0, 0, 0.54);
    display: flex;
    align-items: center
  }
}
</style>
