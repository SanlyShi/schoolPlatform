<template>
  <div class="message-detail-page">
    <view-box>
      <x-header :title="(data.data.sender || '') +'消息'" class="message-detail-header" v-if='!wai'>
        <i
          slot="overwrite-left"
          class="maticon back-icon"
          v-html="icons('navigate_before')"
          @click="_back"
        >navigate_before</i>
      </x-header>
      <div class="message-content">
        <message :data="data.data" v-if="data.data" :wai='wai'></message>
      </div>
    </view-box>
  </div>
</template>
<script>
  import Vue from 'vue'
  import Message from '../../pages/messageBox/message.vue'
  import {sAjax} from '../../assets/utils/utils'
  Vue.component('message', Message)
  export default {
    props: {
      account: {
        default: null
      },
      data: {
        default: {}
      }
    },
    data: function () {
      return {
        wai:false

      }
    },
    created(){
      if(window.location.href.indexOf('wai')>-1){
        //这里去请求外部访问外部的数据
        this.wai = true
        let str = window.location.href
        let id = str.substring(str.indexOf('id')).split('=')[1]
        let url = '/api/message/quiry/'+id
        sAjax({
            url: url,
            type: 'get',
            async:false,
            success: (data) => {
              if(data.state) {
                this.data['data'] = data.data
              } else {
                this.$toast(data.message)
              }
            }
          })
      }
    },
    methods: {
      _back: function () {
        this.$emit('removeBread', this.data)
      }
    }
  }
</script>
<style lang="less">
.message-detail-page {
  .message-detail-header {
    height: 56px;
    background: #fff;
    box-shadow: 0 2px 4px 0 rgba(154, 154, 154, 0.1);
    z-index: 100;
    padding: 0;
    .back-icon {
      color: #2e2e2e;
    }
    .vux-header-title {
      font-size: 18px;
      font-weight: bold;
      color: #101010;
      line-height: 56px;
    }
  }
  .message-content {
    padding: 0 20px;
    pre {
      padding: 0;
      margin: 0;
      background: #fff;
      border: none;
      font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    }
  }
}
</style>
