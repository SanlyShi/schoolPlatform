<template>
  <div class="v-textarea">
    <div ref="container" class="v-text-container" :style="{
      maxHeight: maxHeight+'px'
    }">
      <textarea
        ref="texta"
        :style="{
        lineHeight: lineHeight+'px'
      }"
        v-model="text"
        :placeholder="placeholder"
        :cols="cols"
        :maxlength="maxLength"
        @change="_change"
        @input="_getScrollHeight"
        @focus="_getScrollHeight"
        v-focus
        v-if="!readonly"
      ></textarea>
      <pre
        class="v-textarea-readonly"
        :style="{
        lineHeight: lineHeight+'px'
      }"
        v-else
      >{{text||placeholder}}</pre>
    </div>
    <label class="v-textarea-tip" v-if="maxLength">{{text.length}}/{{maxLength}}</label>
  </div>
</template>
<script>
  export default {
    props: {
      autoHeight: {
        type: Boolean,
        default: false
      },
      lineHeight: {
        type: Number,
        default: 18
      },
      rows: {
        type: Number,
        default: 1
      },
      cols: {
        type: Number,
        default: 0
      },
      placeholder: {
        type: String,
        default: ''
      },
      value: {
        type: String,
        default: ''
      },
      maxLength: {
        type: Number,
        default: -1
      },
      readonly: {
        type: Boolean,
        default: false
      }
    },
    data: function () {
      return {
        text: '',
        scrollHeight: 18,
      }
    },
    computed: {
      maxHeight: function () {
        return this.rows > 0 ? this.lineHeight * (parseInt(this.rows) + 0.5) : 9999
      }
    },
    methods: {
      _change: function (e) {
        this.$emit('change', e)
      },
      _getScrollHeight: function (e) {
        e.target.style.height = 'auto'
        if (this.scrollHeight !== e.target.scrollHeight) {
          if (e.target.scrollHeight > this.scrollHeight) {
            this.scrollHeight = e.target.scrollHeight
          } else {
            this.scrollHeight = this.scrollHeight - this.lineHeight
          }
        }
        e.target.style.height = this.scrollHeight + 'px'
        this.$refs.container.scrollTop = this.scrollHeight
      }
    },
    created: function () {
      this.text = this.value || ''
    },
    mounted: function () {
      if (this.autoHeight) {
        // this.$refs.texta.focus()
      } else {

      }
      // this.scrollHeight = this.$refs.texta.scrollHeight || this.lineHeight
    },
    watch: {
      value: function (val) {
        this.text = val
      },
      text: function (val) {
        this.$emit('input', val)
      }
    }
  }
</script>
<style lang="less">
.v-textarea {
  position: relative;
  overflow: hidden;
  textarea,
  .v-textarea-readonly {
    resize: none;
    width: 100%;
    min-height: 100%;
    padding: 0;
    margin: 0;
    font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
    font-size: 13px;
    color: #333;
    border: none;
    outline: none;
    overflow-y: hidden;
    padding: 5px;
  }
  .v-text-container {
    overflow: auto;
  }
  .v-text-container::-webkit-scrollbar {
            display: none;
        }
  .v-textarea-readonly {
    white-space: pre-wrap;
    background: #f5f5f5;
  }
  .v-textarea-tip {
    position: absolute;
    right: 10px;
    bottom: 0;
    background: #fff;
    color: #999;
    font-size: 12px;
  }
}
</style>
