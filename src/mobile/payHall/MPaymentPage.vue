<template>
  <div class="payment-page">
    <view-box>
      <x-header :title="'缴费'" class="payment-header">
        <i
          slot="overwrite-left"
          class="maticon back-icon"
          v-html="icons('navigate_before')"
          @click="_back"
        >navigate_before</i>
      </x-header>
      <div class="payment-content">
        <!-- <iframe :src="data.data.url" frameborder="0"></iframe> -->
        <div class="info">
          <p class="text">缴费金额</p>
          <p class="number">
            <span>¥</span>
            {{data.data.amount}}
          </p>
        </div>
        <div class="zhifu">
          <ul>
            <li @click="select(0)">
              <img src="../../assets/img/weixin.png" alt>
              <span class="text">微信支付</span>
              <span class="circle" :class="{'act':(payWay==0)}"></span>
            </li>
            <li @click="select(1)">
              <img src="../../assets/img/yinhangka.png" alt>
              <span class="text">银行卡支付</span>
              <span class="circle" :class="{'act':(payWay==1)}"></span>
            </li>
            <li @click="select(2)">
              <img src="../../assets/img/zhifubao.png" alt>
              <span class="text">支付宝支付</span>
              <span class="circle" :class="{'act':(payWay==2)}"></span>
            </li>
          </ul>
        </div>
        <div class="sure">
          <p @click="sure(payWay)">
            <span>确认缴费</span>
          </p>
        </div>
      </div>
    </view-box>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      default: null,
    }
  },
  data: function() {
    return {
      number: 34.3,
      payWay:3,
    };
  },
  methods: {
    _back: function() {
      this.$emit("removeBread", this.data);
    },
    select(o){
      this.payWay = o
    },
    isWeiXin() {
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
      } else {
        return false;
      }
    },
    sure(o){
      if(o == 0){
        if(this.isWeiXin()){
          window.location.href = this.data.data.wechatPayUrl
        }
        else{
          window.location.href = this.data.data.qrCodePayUrl
        }
      }
      if(o == 1){
        window.location.href = this.data.data.bankPayUrl
      }
      if(o == 2){
        window.location.href = this.data.data.qrCodePayUrl
      }
    }
  }
};
</script>
<style lang="less">
.act{
  background-color: rgb(254,86,86);
  border: none
}
.payment-page {
  .payment-header {
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
    .year {
      line-height: 28px;
      color: #2e2e2e;
    }
  }
  .payment-content {
    position: absolute;
    top: 56px;
    left: 0;
    right: 0;
    bottom: 0;
    iframe {
      display: block;
      width: 100%;
      height: 100%;
    }
    .sure {
      width: 100%;
      margin-top: 25px;
      display: flex;
      align-items: center;
      justify-content: center;
      p {
        width: 300px;
        height: 50px;
        background: #3f51b5;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius:2px;
        span {
          display: inline-block;
          // font-family:PingFangSC-Regular;
          font-size: 17px;
          color: #ffffff;
          letter-spacing: 0;
          // text-align:left;
        }
      }
    }
    .zhifu {
      ul {
        list-style: none;
        padding: 0;
        li {
          padding: 20px 18px;
          // font-family:PingFangSC-Regular;
          font-size: 17px;
          line-height: 17px;
          color: #333333;
          letter-spacing: 0;
          border-bottom: solid 1px #e6e6e6;
          // text-align:left;
          image {
            vertical-align: middle;
          }
          .text {
            padding-left: 5px;
          }
          .circle {
            position: absolute;
            right: 18px;
            display: inline-block;
            text-align: right;
            width: 24px;
            height: 24px;
            border-radius: 24px;
            border: solid 1px #e6e6e6;
          }
        }
      }
    }
    .info {
      width: 100%;
      height: 80px;
      // background-color: red;
      padding: 15px 0px;
      text-align: center;
      p {
        margin: 0;
      }
      .text {
        // font-family:PingFangSC-Regular;
        font-size: 12px;
        color: #999999;
        letter-spacing: 0;
        // text-align:right;
      }
      .number {
        // font-family:PingFangSC-Medium;
        font-size: 20px;
        color: #222222;
        letter-spacing: 0;
        span {
          font-size: 15px;
        }
        // text-align:right;
      }
    }
  }
}
</style>
