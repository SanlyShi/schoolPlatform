<template>
  <div class="link-page">
    <h3 class="title">首页底部信息管理:</h3>
    <div class="editor">
      <u-editor ref="bottomContent" :config="editorConfig" v-model="contentValue"></u-editor>
    </div>
    <div class="save_box">
      <button class=" btn_style" @click="_reset">重置</button>
      <button class=" btn_style" @click="_save">保存</button>
    </div>
  </div>
</template>

<script>
import { request } from '../../assets/utils/utils.js'
export default {
  created: function () {
    this.systemId = sessionStorage.getItem('_SYSTEM_ID')
    request('/api/cms/platform/getBanner', {systemId:this.systemId}, "get").then(o => {
        if (o.state) {
          this.contentValue =  o.data.bottomContent
        } else {
          this.$toast(o.message)
        }
      })
  },
  data: function () {
    return {
      systemId: '',
      editorConfig: {
        initialFrameHeight: 420
      },
      contentValue: '',
    }
  },
  methods: {
    _reset() {
      this.contentValue = ''
    },
    _save() {
      let params = {}
      params['systemId'] = this.systemId
      params['bottomContent'] = this.contentValue
      let url = "/api/cms/system/updateBanner"
      request(url, params, "post").then(o => {
        if (o.state) {
          this.$toast('保存成功!');
        } else {
          this.$toast(o.message)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.link-page {
  background: #ffffff;
  .title {
    padding: 15px 0 15px 8px;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.87);
    font-weight: 500;
    line-height: 2;
  }
  .save_box {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ffffff;
    padding-bottom: 15px;
    .btn_style {
      display: inline-block;
      background: #298df7;
      color: white;
      width: 104px;
      height: 33px;
      line-height: 12px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 500;
      outline: none;
      border: none;
      margin-left: 20px;
    }
  }
}
</style>
