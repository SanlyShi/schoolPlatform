<template>
  <div class="payhall-application-mobile">
    <view-box>
      <x-header title="学生缴费" class="payhall-application-header">
        <i
          slot="overwrite-left"
          class="maticon back-icon"
          v-html="icons('navigate_before')"
          @click="_back"
        >navigate_before</i>
      </x-header>
      <div class="apply-content">
        <group
          class="info-group"
          :title="group.title"
          label-width="8em"
          label-margin-right="2em"
          label-align="left"
          v-for="(group, gIndex) in pageStatus.pageLayout.groups"
          :key="gIndex"
        >
          <x-input
            :title="cell.title"
            :readonly="cell.readonly"
            v-model="formFields[cell.name]"
            text-align="right"
            v-for="(cell, cIndex) in group.cells"
            :key="cIndex"
            :ref="`${cell.name}_input`"
            v-if="['input'].indexOf(cell.type)>=0"
          ></x-input>
          <x-textarea
            :title="cell.title"
            v-model="formFields[cell.name]"
            v-else-if="['textarea'].indexOf(cell.type)>=0"
          ></x-textarea>
        </group>
        <box class="submit-box">
          <x-button plain type="primary" class="custom-primary-blue" @click.native="_submit">去缴费</x-button>
        </box>
      </div>
    </view-box>
  </div>
</template>
<script>
import { sAjax } from "../../assets/utils/utils";
export default {
  props: {
    account: {
      default: null
    },
    data: {
      default: null
    }
  },
  data: function() {
    return {
      pageStatus: {
        pageLayout: {
          groups: [
            {
              title: "",
              cells: [
                {
                  title: "学年:",
                  name: "year",
                  type: "input",
                  required: false,
                  readonly: true
                },
                {
                  title: "缴费项目:",
                  name: "name",
                  type: "input",
                  required: false,
                  readonly: true
                },
                {
                  title: "应缴金额:",
                  name: "amount",
                  type: "input",
                  required: false,
                  readonly: true
                  // }, {
                  //   title: '实缴金额:',
                  //   name: 'amountPaid',
                  //   type: 'input',
                  //   required: false,
                  //   readonly: true
                },
                {
                  title: "开始时间:",
                  name: "beginTime",
                  type: "input",
                  required: false,
                  readonly: true
                },
                {
                  title: "结束时间:",
                  name: "endTime",
                  type: "input",
                  required: false,
                  readonly: true
                }
              ]
            },
            {
              title: "",
              cells: [
                {
                  title: "缴费详情:",
                  name: "orderDetails",
                  type: "textarea",
                  required: false,
                  readonly: true
                }
              ]
            }
          ]
        }
      },
      formFields: {
        year: "2018学年-2019学年",
        name: "缴费项目A",
        amount: "5200",
        amountPaid: "5200",
        beginTime: "2018-11-11",
        endTime: "2018-11-22",
        orderDetails: "条目1:300，条目2:400"
      }
    };
  },
  methods: {
    _back: function() {
      this.$emit("removeBread", this.data);
    },
    _submit: function() {
      sAjax({
        url: `/api/payment/orders`,
        type: "post",
        data: {
          userId: this.account.userId,
          projectId: this.data.data.id
        },
        success: data => {
          if (data.state) {
            // if (this.isWeiXin()) {
            //   window.location.href = data.data.wechatPayUrl;
            // } else {
              data.data['amount'] = this.data.data.amount
              this.$emit("addBread", {
                route: "payHall/MPaymentPage",
                title: "",
                data: data.data
              });
            // }
          } else {
            this.$toast(data.message);
          }
        }
      });
    },
    isWeiXin() {
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
      } else {
        return false;
      }
    },
    _getApplication: function() {
      var data = this.data.data;
      // console.log(data);
      this.formFields.orderNum = data.orderNum || "-";
      this.formFields.year = `${data.year}-${parseInt(data.year) + 1}学年`;
      this.formFields.name = data.name;
      this.formFields.amount = data.amount;
      this.formFields.amountPaid = data.amountPaid;
      this.formFields.beginTime = data.beginTime;
      this.formFields.endTime = data.endTime;
      this.formFields.orderDetails = data.orderDetails;
    }
  },
  created: function() {
    this._getApplication();
  }
};
</script>
<style lang="less">
.payhall-application-mobile {
  .payhall-application-header {
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
  .apply-content {
    position: absolute;
    top: 56px;
    left: 0;
    bottom: 0;
    width: 100%;
    padding: 10px 16px 16px;
    z-index: 0;
    background: #f0f0f0;
    overflow: auto;
    .info-group {
      margin: 0 -16px 14px;
      .weui-cells {
        position: relative;
        margin-top: 0;
        background: #fff;
        &::before,
        &::after {
          height: 0;
          border: none;
        }
      }
      .weui-cell {
        padding: 14px 16px;
        font-size: 14px;
        &::before {
          left: 0;
        }
        &.img-input {
          input[type="text"] {
            display: none;
          }
        }
        p {
          margin: 0;
        }
        label {
          margin-bottom: 0;
        }
        input {
          padding-right: 0;
        }
        // .focus-red {
        //   color: #ff5252;
        // }
        .img-item-cover {
          width: 24px;
          height: 16px;
        }
        .img-item {
          height: 24px;
          margin-right: 16px;
        }
        .img-control {
          position: relative;
          display: block;
          width: 24px;
          height: 24px;
          &.img-unset {
            width: auto;
            height: auto;
          }
          input[type="file"] {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
          }
        }
      }
      .vux-cell-placeholder,
      .vux-cell-value,
      .weui-input {
        font-size: 13px;
        color: #333;
      }
      .weui-cell_access {
        .weui-cell__ft {
          padding-right: 0;
          &::after {
            border-width: 0;
          }
        }
      }
      .weui-icon-warn {
        margin-top: -5px;
      }
    }
  }
  .custom-primary-blue {
    font-size: 18px;
    color: #ffffff;
    letter-spacing: 1.01px;
    line-height: 42px;
    border: none;
    background: #298df7;
    box-shadow: 0 -2px 3px 0 rgba(0, 0, 0, 0.16);
    border-radius: 3px;
  }
}
</style>
