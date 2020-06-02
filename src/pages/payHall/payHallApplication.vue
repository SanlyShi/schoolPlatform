<template>
  <div class="payhall-application-page container-fluid">
    <div class="row info-container">
      <div class="payhall-header">
        <span class="payhall-sure-title">学生缴费</span>
      </div>
      <div class="divide-line"></div>
      <div class="submit-info col-md-12">
        <div class="info-item" v-if="data.data.status !== 'NOT_PAID'">
          <span class="item-title">订单号:</span>
          <div class="info-options">
            <input type="text" v-model="formFields.orderNum" readonly>
          </div>
        </div>
        <div class="info-item">
          <span class="item-title">学年:</span>
          <div class="info-options">
            <input type="text" v-model="formFields.year" readonly>
          </div>
        </div>
        <div class="info-item">
          <span class="item-title">缴费项目:</span>
          <div class="info-options">
            <input type="text" v-model="formFields.name" readonly>
          </div>
        </div>
        <div class="info-item">
          <span class="item-title">应缴金额:</span>
          <div class="info-options">
            <input type="text" v-model="formFields.amount" readonly>
          </div>
        </div>
        <div class="info-item" v-if="formFields.amountPaid">
          <span class="item-title">实缴金额:</span>
          <div class="info-options">
            <input type="text" v-model="formFields.amountPaid" readonly>
          </div>
        </div>
        <div class="info-item">
          <span class="item-title">开始时间:</span>
          <div class="info-options">
            <input type="text" v-model="formFields.beginTime" readonly>
          </div>
        </div>
        <div class="info-item" >
          <span class="item-title">结束时间:</span>
          <div class="info-options">
            <input type="text" v-model="formFields.endTime" readonly>
          </div>
        </div>
        <div class="info-item">
          <span class="item-title">缴费详情:</span>
          <div class="info-options">
            <v-textarea
              class="textarea"
              v-model="formFields.orderDetails"
              :autoHeight="true"
              :readonly="true"
              :rows="0"
              :maxLength="0"
            ></v-textarea>
          </div>
        </div>
        <div class="info-footer">
          <button class="agree" :class="{
            disabled: data.data.status !== 'NOT_PAID'
          }" @click="_submit">
            <span class="word">{{data.data.status !== 'NOT_PAID'?'已缴费':'缴费' }}</span>
          </button>
          <p class="tip" v-if="tipShow">缴费页面已在新窗口打开，若无新窗口请<a href="javascript:;" @click="_open(url)">点击此处</a>站内缴费</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { sAjax } from '../../assets/utils/utils';
  export default {
    props: {
      data: {
        default: null
      }
    },
    data: function () {
      return {
        formFields: {
          year: '加载中...',
          name: '加载中...',
          amountPaid: '加载中...',
          amount: '加载中...',
          beginTime: '加载中...',
          endTime: '加载中...',
          orderDetails: '加载中...'
        },
        tipShow: false,
        url: ''
      }
    },
    methods: {
      _submit: function () {
        if(this.data.data.status !== 'NOT_PAID') {
          return false
        }
        sAjax({
          url: `/api/payment/orders`,
          type: 'post',
          data: {
            userId: this.$account.id,
            projectId: this.data.data.id
          },
          success: (data) => {
            if (data.state) {
              setTimeout(() => {
                this.tipShow = true
              }, 1000);
              this.url = data.data.qrCodePayUrl
              window.open(data.data.qrCodePayUrl) // 先打开页面
            } else {
              this.$emit('removeBread', this.data)
              this.$toast(data.message)
            }
          }
        })
        
      },
      _open: function (url) {
        window.open(url, '_self')
      },
      _initData: function () {
        var data = this.data.data
        this.formFields.orderNum = data.orderNum || '-'
        this.formFields.year = `${data.year}-${parseInt(data.year)+1}学年`
        this.formFields.name = data.name
        this.formFields.amount = data.amount
        this.formFields.amountPaid = data.amountPaid
        this.formFields.beginTime = data.beginTime
        this.formFields.endTime = data.endTime
        this.formFields.orderDetails = data.orderDetails
      }
    },
    created: function () {
      this._initData()
    }
  }
</script>
<style lang="less">
.payhall-application-page {
  height: 100%;
  .payhall-header {
    font-size: 18px;
    color: #777777;
    letter-spacing: 0;
    line-height: 18px;
  }
  .divide-line {
    height: 1px;
    margin: 16px -50px 19px;
    background: #d9d9d9;
  }
  .info-container {
    min-width: 768px;
    height: 100%;
    padding: 20px 50px;
    background: #fff;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
  }
  .submit-info {
    position: relative;
    padding: 20px 24px;
    .info-item {
      margin-bottom: 12px;
      overflow: hidden;
      .item-title {
        display: block;
        float: left;
        width: 120px;
        margin-right: 10px;
        font-size: 14px;
        font-weight: bold;
        color: #333333;
        letter-spacing: 0;
        text-align: right;
        line-height: 24px;
      }
      .info-options {
        float: left;
        width: 360px;
        span {
          display: inline-block;
          margin-left: 8px;
          margin-bottom: 12px;
          font-size: 14px;
          color: #555555;
          letter-spacing: 0.6px;
          text-align: left;
          line-height: 24px;
          cursor: pointer;
          i {
            float: left;
            margin-right: 2px;
            font-size: 22px;
            color: #d9d9d9;
          }
        }
      }
      input,
      .textarea {
        border: 1px solid #e7e7e7;
        border-radius: 3px;
        width: 100%;
        padding: 3px 8px;
        resize: none;
        outline: none;
        &.error {
          border: 1px solid red;
        }
      }
      input {
        width: 60%;
        padding: 5px 8px;
      }
    }
    .info-footer {
      span {
        margin-right: 32px;
        font-size: 14px;
        color: #298df7;
        letter-spacing: 0;
        text-align: right;
        cursor: pointer;
      }
    }
    .title-tip {
      display: block;
      margin-bottom: 10px;
      font-size: 14px;
      font-weight: bold;
      color: #298df7;
      letter-spacing: 1px;
      text-align: left;
    }
  }
  .agree {
    width: 139px;
    height: 40px;
    margin-top: 24px;
    margin-left: 130px;
    line-height: 40px;
    border: none;
    outline: none;
    box-shadow: 0 0 2 0 rgba(0, 0, 0, 0.12), 0 2 2 0 rgba(0, 0, 0, 0.12);
    border-radius: 3px;
    background: #298df7;
    &:hover {
      background: rgb(121, 137, 230);
    }
    span.word {
      margin: 0;
      color: #fff;
      font-size: 15px;
      letter-spacing: 6px;
      cursor: inherit;
    }
    &.disabled{
      background: #999;
      cursor: default;
      &:hover {
        background: #999;
      }
    }
  }
  .tip{
    margin-left: 60px;
    color: orangered;
  }
  .v-textarea{
    min-height: 80px;
  }
}
</style>
