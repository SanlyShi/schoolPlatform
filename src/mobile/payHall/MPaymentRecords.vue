<template>
  <div class="payment-records-page">
    <view-box>
      <x-header title="缴费记录" class="payment-records-header">
        <i
          slot="overwrite-left"
          class="maticon back-icon"
          v-html="icons('navigate_before')"
          @click="_back"
        >navigate_before</i>
      </x-header>
      <div class="payment-list">
        <div class="payment-list-cell" v-for="(com, index) in recordData" :key="index" @click="_checkDetail(com)">
          <flexbox>
            <flexbox-item :span="10">
              <div class="payment-list-name">{{com.name}}</div>
              <div class="payment-list-time">{{com.payTime}}</div>
            </flexbox-item>
            <flexbox-item>
              <div class="payment-list-money">-{{com.amountPaid}}</div>
            </flexbox-item>
          </flexbox>
        </div>
      </div>
    </view-box>
  </div>
</template>
<script>
  import { sAjax } from '../../assets/utils/utils';
  export default {
    props: {
      account: {
        default: null
      },
      data: {
        default: null
      }
    },
    data: function () {
      return {
        recordData: []
      }
    },
    methods: {
      _back: function () {
        this.$emit('removeBread', this.data)
      },
      _getRecords: function () {
        sAjax({
          url: '/api/payment/getpayrecord',
          type: 'get',
          success: (data) => {
            if (data.state) {
              this.recordData = data.data.content || []
            } else {
              this.$vux.toast.show({
                text: data.message,
                position: 'bottom',
                type: 'text'
              })
            }
          }
        })
        // this.recordData = [{
        //   orderNum: 'asdfadsfadfasdfwefdf',
        //   year: '2017-2018学年',
        //   name: '缴费项目A',
        //   payTime: '2018-12-12',
        //   amount: '5200',
        //   amountPaid: '5200',
        //   status: '缴费状态',
        //   orderDetails: '缴费明细'
        // }]
      },
      _checkDetail: function (item) {
        console.log(item)
      }
    },
    created: function () {
      this._getRecords()
    }
  }
</script>
<style lang="less">
.payment-records-page {
  .payment-records-header {
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
  .payment-list {
    padding: 0 15px;
    .payment-list-cell {
      padding: 11px 0;
      border-bottom: 1px solid #e7e7e7;
    }
    .payment-list-name {
      margin-bottom: 10px;
      font-size: 14px;
      color: #333333;
      letter-spacing: 0;
      line-height: 1;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .payment-list-time {
      font-size: 12px;
      color: #a0a0a0;
      letter-spacing: 0;
      line-height: 1;
    }
    .payment-list-money {
      font-size: 15px;
      color: #333333;
      letter-spacing: 0.3px;
      line-height: 1;
      text-align: right;
    }
  }
}
</style>
