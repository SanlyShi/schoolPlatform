<template>
  <div id="advice-page">
    <x-header :title="data.title" class="paymentDetail-header">
      <i
        slot="overwrite-left"
        class="maticon back-icon"
        v-html="icons('navigate_before')"
        @click="_back"
      >navigate_before</i>
    </x-header>
    <div class="announce-main">
      <div class="announce-header">
        <h3>{{curAnnounce.title}}</h3>
        <p>
          <span class="announce-date">{{curAnnounce.createTime}}</span>
        </p>
      </div>
      <div class="announce-body" v-html="curAnnounce.content"></div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { sAjax, translation } from "../../assets/utils/utils.js";
export default {
  props: {
    data: {
      default: null
    }
  },
  data: function() {
    return {
      curAnnounce: {
        title: "载入中...",
        createTime: "",
        browser: 9999,
        content: "载入中..."
      }
    };
  },
  created: function() {
    let id = ''
    if(this.data.data.announcementId){
      id = this.data.data.announcementId
    }
    else{
      id = this.$route.query.advice
    }

    sAjax({
      url: "/api/announcement/browser/" + id,
      type: "post",
      success: data1 => {
        if (data1.state) {
          sAjax({
            url: "/api/announcement/" + id,
            type: "get",
            success: data2 => {
              if (data2.state) {
                this.curAnnounce = data2.data;
              } else {
                this.$toast(data2.message);
              }
            }
          });
        } else {
          this.$toast(data1.message);
        }
      }
    });
  },
  methods: {
    _back: function() {
      // this.$emit("removeBread", this.data);
      // this.$emit("removeBread", this.data);
      if(window.location.href.indexOf('advice')>-1){
      }
      else{
        this.$emit("removeBread", this.data);
      }

    }
  }
};
</script>
<style lang="less" >
#advice-page {
  width: 100%;
  overflow: auto;
  background: #fff;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
  .paymentDetail-header {
    background: #ffffff;
    height: 56px;
    z-index: 100;
    padding: 0;
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.08), 0 4px 4px 0 rgba(0, 0, 0, 0.08);
    .vux-header-title {
      font-size: 16px;
      font-weight: bold;
      color: rgba(0, 0, 0, 0.67);
      font-weight: 500;
      height: 56px;
      margin: 0 64px;
      text-align: left;
      span {
        padding-top: 8px;
      }
    }
  }
  .announce-main{
    padding: 0.4533rem;
  }
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
      max-width: 100% !important;
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

