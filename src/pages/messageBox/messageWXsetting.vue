<template>
  <div class="messageWXsetting-page">
    <div style="padding:10px">
      <label class="ranking-text" style="font-weight:500;font-weight: 600 !important;font-size: 15px;">公众号绑定设置</label>
    </div>
    <div style="padding:10px">
      <label class="ranking-text">公众号appId:</label>
      <input class="input-control" type="text" maxlength="50" v-model="number.appId">
    </div>
    <div style="padding:10px">
      <label class="ranking-text">公众号appSecret:</label>
      <input class="input-control" type="text" maxlength="50" v-model="number.appSecret">
    </div>
    <div style="padding:10px">
      <label class="ranking-text"></label>
      <button class="btn submit" style="margin-left:120px;width:120px" @click="_save">保存</button>
    </div>
  </div>
</template>
<script>
import { sAjax } from "../../assets/utils/utils.js";
export default {
  data() {
    return {
      number: {
        appId: "",
        appSecret: ""
      }
    }
  },
  created() {
    sAjax({
      url: "/api/wechat",
      type: "get",
      async: false,
      success: data => {
        if (data.state) {
          if (data.data) {
            this.number = data.data;
          } else {
            this.number = {
              appId: "",
              appSecret: ""
            }
          }
        } else {
          this.$toast(data.message);
        }
      }
    }).always(() => { });

  },
  methods: {
    _save() {
      sAjax({
        url: "/api/wechat",
        type: "post",
        data: this.number,
        async: false,
        success: data => {
          if (data.state) {
            this.$toast("信息保存成功")
          } else {
          }
        }
      }).always(() => { });
    }
  }
}
</script>
<style lang="less" scoped>
.messageWXsetting-page {
  padding: 30px 20px;
  background: #ffffff;
  min-height: 600px;
  label {
    display: inline-block !important;
    width: 110px !important;
    text-align: right !important;
  }
  .submit {
    width: 110px !important;
    background: #4091ff !important;
    color: #fff !important;
  }
  .input-control {
    margin: 0 0 px 0 0 px;
    padding: 5px 10px;
    font-size: 13px;
    color: rgba(0, 0, 0, 0.67);
    font-weight: 500;
    box-shadow: none;
    border: none;
    background: #f5f5f5;
    border-radius: 4px;
    height: 40px;
    width: 360px;
  }
}
</style>