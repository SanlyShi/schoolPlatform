<template>
  <div class="protocol-page">
    <view-box>
      <x-header title="用户须知" class="position-apply-header">
        <i slot="overwrite-left" class="maticon back-icon" v-html="icons('navigate_before')" @click="_back">navigate_before</i>
      </x-header>
      <div class="apply-content">
        <div class="protocol-text" v-html="protocol.content"></div>
        <div class="check-box-options">
          <span @click="selectIsRead">
            <i class="maticon active" v-html="icons('check_box')" v-if="isRead">check_box</i>
            <i class="maticon" v-html="icons('check_box_outline_blank')" v-else>check_box_outline_blank</i>
          </span>
          <span class="icon-title">我已阅读咨询须知内容并同意以上内容</span>
        </div>
        <div class="protocol-footer">
          <x-button class="agree" :disabled="!isRead" @click.native="_agree">下一步</x-button>
        </div>
      </div>
    </view-box>
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
        protocol: {
          id: '',
          content: ''
        },
        isRead: false,
        isReservation: false
      }
    },
    methods: {
      _back: function () {
        this.$emit('removeBread', this.data)
      },
      _agree: function () {
        if (this.isReservation) {
          this._go(false)
        } else {
           this._go(false)
          // this.$vux.confirm.show({
          //   content: '您是否是首次预约？',
          //   confirmText: '是',
          //   cancelText: '否',
          //   onCancel: () => {
          //     this._go(false)
          //   },
          //   onConfirm: () => {
          //     this._go(true)
          //   }
          // })
        }
      },
      _go: function (firstTime) {
        this.$emit('addBread', {
          route: '/psychology/MCounselorList',
          title: '',
          firstTime: firstTime,
          hasOnline: this.data.hasOnline,
          protocolId: this.protocol.id,
          campus: this.data.campus
        })
        this.$nextTick(() => {
          this.$emit('removeBread', this.data)
        })
      },
      _getProtocol: function () {
        // 待对接
        sAjax({
          url: '/api/mentality/config/readme',
          type: 'get',
          success: (data) => {
            if (data.state) {
              this.protocol = data.data
            } else {
              this.$vux.toast.show({
                text: data.message,
                position: 'bottom',
                type: 'text'
              })
            }
          }
        })
      },
      selectIsRead: function () {
        this.isRead = !this.isRead
      }
    },
    created: function () {
      this._getProtocol()
      sAjax({
        url: '/api/mentality/reservation/has',
        type: 'get',
        success: (data) => {
          if (data.state) {
            this.isReservation = data.data
          } else {
            this.$vux.toast.show({
              text: data.message,
              position: 'bottom',
              type: 'text'
            })
          }
        }
      })
    }
  }
</script>
<style lang="less">
.protocol-page {
  .position-apply-header {
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
  .check-box-options {
    padding-top: 10px;
    margin-bottom: 20px;
    border-top: 1px solid #e0e0e0;
    i {
      font-size: 22px;
      color: #d9d9d9;
      transition: all 0.3s ease;
      cursor: pointer;
      &.active {
        color: #298df7;
      }
    }
    .icon-title {
      font-size: 14px;
      color: #333333;
      display: inline-block;
      margin-top: 2px;
      vertical-align: top;
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
    overflow: auto;
    .protocol-text {
      // min-height: 90%;
      margin-bottom: 24px;
    }
    .protocol-footer {
      text-align: right;
    }

    .agree {
      height: 40px;
      color: #fff;
      font-size: 16px;
      line-height: 40px;
      background: #298df7;
      box-shadow: 0 0 2 0 rgba(0, 0, 0, 0.12), 0 2 2 0 rgba(0, 0, 0, 0.12);
      transition: all 0.1s ease;
      &:active {
        color: #fff;
        background: rgb(121, 137, 230);
      }
    }
  }
}
</style>
