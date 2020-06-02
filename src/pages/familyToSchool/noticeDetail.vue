<template>
  <div id="announce-page">
    <div class="announce-header">
      <h3>{{curAnnounce.title}}</h3>
      <p><span class="announce-date">{{curAnnounce.data.sendTime}}</span></p>
    </div>
    <div class="announce-body" v-html="curAnnounce.data.content">
      
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import { sAjax, translation } from '../../assets/utils/utils.js'
  export default {
    props: {
      data: {
        default: null
      }
    },
    data: function () {
      return {
        curAnnounce: {
          title: '载入中...',
          sendTime: '',
          browser: 9999,
          content: '载入中...'
        }
      }
    },
    created: function () {
      this.curAnnounce = JSON.parse(JSON.stringify(this.data))
    }
  }
</script>
<style lang="less">
#announce-page {
  width: 100%;
  height: 95%;
  overflow: auto;
  padding: 56px;
  margin: 24px auto 0;
  background: #fff;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
  .announce-header {
    h3 {
      padding: 0;
      margin: 0;
      line-height: 1;
      font-size: 24px;
      color: rgba(0, 0, 0, 0.87);
    }
    p {
      margin-top: 10px;
      font-size: 12px;
      color: rgba(0, 0, 0, 0.4);
    }
    .announce-date {
      margin-right: 12px;
    }
  }
  .announce-body {
    margin-top: 36px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.73);
    letter-spacing: 0.2px;
    line-height: 24px;
    width: 100%;
    img {
     max-width: 100%!important;
    }
    table {
      td,
      th {
        padding: 5px 10px;
        border: 1px solid #ddd;
      }
    }
  }
}
</style>

