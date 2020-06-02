<template>
  <div id="myPayment">
    <view-box>
      <x-header title="我的缴费" class="myPayment-header">
        <i
          slot="overwrite-left"
          class="maticon back-icon"
          v-html="icons('navigate_before')"
          @click="_back"
        >navigate_before</i>
      </x-header>
      <div class="form-nav">
        <div
          class="form-tab"
          v-for="(item,i) in tabs"
          :key="i"
          :class="{active:isSelect == item.id}"
          @click="changeTab(item.id)"
        >{{item.name}}</div>
      </div>
      <div class="myPayment-content">
        <div class="pending-list" v-if="isSelect === 'pending'">
          <div
            class="pending-cell"
            v-for="(com, index) in pendingData"
            :key="index"
            @click="goToPayment(com)"
          >
            <flexbox>
              <flexbox-item :span="9">
                <div class="pending-name">
                  {{com.name}}
                  <span class="status">待缴</span>
                </div>
                <div>{{com.amount}}</div>
                <div class="pending-time">{{com.beginTime}} 至 {{com.endTime}}</div>
              </flexbox-item>
              <flexbox-item>
                <div class="pending-btn">去缴费</div>
              </flexbox-item>
            </flexbox>
          </div>
        </div>
        <div class="paid-list" v-else>
          <div class="pending-cell" v-for="(com, index) in paidData" :key="index">
            <flexbox>
              <flexbox-item :span="9">
                <div class="pending-name">
                  {{com.name}}
                  <span class="status">已缴</span>
                </div>
                <div>{{com.amountPaid}}</div>
                <div class="pending-time">{{com.payTime}}</div>
              </flexbox-item>
              <flexbox-item>
                <!-- <div class="pending-btn">
                 去缴费
                </div>-->
              </flexbox-item>
            </flexbox>
          </div>
        </div>
      </div>
    </view-box>
  </div>
</template>
<script>
import Vue from "vue";
import { sAjax, translation } from "../../assets/utils/utils.js";
export default {
  props: {
    data: {
      default: ""
    },
    update: {
      default: false
    },
    account: {
      default: null
    }
  },
  data: function() {
    return {
      tabs: [{ id: "pending", name: "待缴" }, { id: "paid", name: "已缴" }],
      isSelect: "pending",
      pendingData: [
        {
          title: "",
          time: "",
          amount: "",
          status: "",
          code: 11001
        }
        // , {
        //   title: '住宿费',
        //   time: '2018-11-06',
        //   amount: '0.01',
        //   status: 'pay',
        //   code: 11002
        // }, {
        //   title: '团费',
        //   time: '2018-11-06',
        //   amount: '0.01',
        //   status: 'pay',
        //   code: 11003
        // }, {
        //   title: '党费',
        //   time: '2018-11-06',
        //   amount: '0.01',
        //   status: 'pay',
        //   code: 11004
        // }, {
        //   title: '留学生缴费',
        //   time: '2018-11-06',
        //   amount: '0.01',
        //   status: 'pay',
        //   code: 11005
        // }, {
        //   title: '四六级',
        //   time: '2018-11-06',
        //   amount: '0.01',
        //   status: 'pay',
        //   code: 11006
        // }, {
        //   title: '重修',
        //   time: '2018-11-06',
        //   amount: '0.01',
        //   status: 'pay',
        //   code: 11007
        // }, {
        //   title: '考试',
        //   time: '2018-11-06',
        //   amount: '0.01',
        //   status: 'pay',
        //   code: 11008
        // }, {
        //   title: '电费',
        //   time: '2018-11-06',
        //   amount: '0.01',
        //   status: 'pay',
        //   code: 11009
        // }],
        // paidData: [{
        //   title: '考试',
        //   time: '2018-11-06',
        //   amount: '0.01',
        //   status: 'paid',
        //   code: 11008
        // }, {
        //   title: '重修',
        //   time: '2018-11-06',
        //   amount: '0.01',
        //   status: 'paid',
        //   code: 11007
        // }, {
        //   title: '电费',
        //   time: '2018-11-06',
        //   amount: '0.01',
        //   status: 'pay',
        //   code: 11009
        // }
      ]
    };
  },
  computed: {},
  watch: {},
  created: function() {
    sAjax({
      url: "/api/payment/getpayrecord",
      dataType: "json",
      type: "get",
      async: false,
      success: result => {
        if (result.state) {
          this.paidData = result.data.content;
        }
      }
    });
    sAjax({
      url: "/api/payment/getnotpayproject",
      dataType: "json",
      type: "get",
      async: false,
      success: result => {
        if (result.state) {
          this.pendingData = result.data.content;
        }
      }
    });
  },
  methods: {
    _back: function() {
      this.$emit("removeBread", this.data);
    },
    changeTab: function(obj) {
      this.isSelect = obj;
    },
    isWeiXin() {
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
      } else {
        return false;
      }
    },
    goToPayment: function(item) {
      // window.location.href = '/aggregation/payment/ccb/check?code=' + item.code
      // this.account.userId
      this.$waiting.show();
       sAjax({
          url: "/api/payment/getInProject",
          type: "get",
          data: {
            id: item.projectId
          },
          success: data => {
            if (data.state) {
              if (data.data && data.data.status) {
                if (data.data.status === "NOT_PAID") {
                  data.data['amount'] = item.amount
                  this.$emit("addBread", {
                    route: "/payHall/MPaymentApplication",
                    title: data.data.name,
                    data: data.data
                  });
                } else {
                  this.$toast("您已缴费，无需缴费！");
                }
              } else {
                this.$toast("该应用无需缴费！");
              }
            } else {
              this.$toast(data.message);
            }
          }
        }).always(() => {
          this.$waiting.close();
        });

      // sAjax({
      //   url: `/api/payment/orders`,
      //   type: "post",
      //   data: {
      //     userId: this.account.userId,
      //     projectId: item.projectId
      //   },
      //   success: data => {
      //     if (data.state) {
      //       if (this.isWeiXin()) {
      //         window.location.href = data.data.wechatPayUrl;
      //       } else {
      //         this.$emit("addBread", {
      //           route: "/paymentHall/paymentDetail",
      //           title: item.name,
      //           url: data.data.qrCodePayUrl
      //         });
      //       }
      //     } else {
      //       this.$toast(data.message);
      //     }
      //   }
      // });
    }
    // _clickApplyDetail: function (obj) {
    //   this.$emit('addBread', {
    //     route: '/form/MFormLayout?appId=' + obj.appId + '&instanceId=' + obj.id + '&nodeId=' + obj.currentNode.id,
    //     title: ''
    //   })
    // }
  }
};
</script>
<style lang="less">
#myPayment {
  .myPayment-header {
    background: #ffffff;
    height: 56px;
    z-index: 100;
    padding: 0;
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
  .form-nav {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    width: 100%;
    height: 56px;
    background: #ffffff;
    margin-top: 56px;
    box-shadow: 0 0 0px 0 rgba(0, 0, 0, 0.18), 0 4px 4px 0 rgba(0, 0, 0, 0.18);
    .form-tab {
      width: 50%;
      height: 56px;
      display: inline-block;
      font-size: 13px;
      color: rgba(0, 0, 0, 0.54);
      text-align: center;
      padding-top: 20px;
      cursor: pointer;
      &.active {
        font-weight: 500;
        color: rgba(0, 0, 0, 0.67);
        border-bottom: 2px solid rgba(0, 0, 0, 0.67);
        cursor: default;
      }
    }
  }
  .myPayment-content {
    position: absolute;
    top: 112px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    background: #ffffff;
    .pending-cell {
      border-bottom: 1px solid #e0e0e0;
      padding: 10px 16px;
      .pending-btn {
        float: right;
        font-size: 14px;
        color: #ffffff;
        background: #298df7;
        border-radius: 100px;
        padding: 5px;
      }
      .pending-time {
        font-size: 12px;
        color: rgba(0, 0, 0, 0.6);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .pending-name {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.7);
        font-weight: bold;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .status {
        font-size: 13px;
        background: rgba(0, 0, 0, 0.08);
        border-radius: 100px;
        padding: 6px;
        margin-left: 5px;
      }
    }
  }
}
</style>
