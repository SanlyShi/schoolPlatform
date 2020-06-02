<template>
  <div id="creatSignIn">
    <view-box>
      <x-header  class="creatSignIn-header">
        <i slot="overwrite-left" class="maticon back-icon" v-html="icons('navigate_before')" @click="_back">navigate_before</i>
      </x-header>
      <div class="creatSignIn-content">
        <group class="info-group">
          <x-input title="签到名称" class="signIn-info-input" text-align="right" placeholder="请填写" v-model="signInName"></x-input>
          <popup-radio title="二维码刷新类型" :options="qrcodeRefreshType" value-text-align="right"  v-model="qrcodeRefreshTypeOption" placeholder="请选择"></popup-radio>
          <datetime title="签到开始时间" placeholder="请选择"  v-model="signInStartTime" value-text-align="right" format="YYYY-MM-DD HH:mm" @on-change="_timeSelect($event, 'start')"></datetime>
          <datetime title="签到结束时间" placeholder="请选择"  v-model="signInEndTime" value-text-align="right" format="YYYY-MM-DD HH:mm" @on-change="_timeSelect($event, 'end')"></datetime>
          <popup-radio title="是否需要签退" :options="needSignOff" value-text-align="right" v-model="needSignOffOption" v-if="!isSignOut"></popup-radio>
        </group>
      </div>
      <box class="submit-box" gap="16px">
        <x-button plain type="primary" class="custom-primary-blue" @click.native="_create()" v-if="isCreat">创建</x-button>
        <x-button plain type="primary" class="custom-primary-blue" @click.native="_save()" v-else>保存</x-button>
      </box>
    </view-box> 
  </div>
</template>
<script>
  import { sAjax, translation } from '../../assets/utils/utils.js'
  import { rejects } from 'assert';
  export default {
    props: {
      data: {
        default: ''
      }
    },
    data: function () {
      return {
        signInName: '',
        qrcodeRefreshType: [],
        qrcodeRefreshTypeOption: 0,
        needSignOffOption: '否',
        needSignOff: ['是', '否'],
        signInStartTime: '',
        signInEndTime: '',
        startTime: '',
        endTime: '',
        activityInfo: {},
        signInfo: {},
        isCreat: true,
        isSignOut: false,
        blockDuplicatClicks: false
      }
    },
    created: function () {
      var that = this
      var array = ['', '', '', '', '', '', '']
      array.forEach((ele, i) => {
        if (i === 0) {
          this.qrcodeRefreshType.push({
            key: i * 5,
            id: i * 5,
            value: '静态码'
          })
        } else {
          this.qrcodeRefreshType.push({
            key: i * 5,
            id: i * 5,
            value: i * 5 + '秒'
          })
        }

      })
      this.activityInfo = this.data.activityInfo
      this.signInfo = this.data.data
      this.startTime = (new Date(this.activityInfo.applyStartTime.replace(/-/g, '/'))).getTime()
      this.endTime = (new Date(this.activityInfo.endTime.replace(/-/g, '/'))).getTime() + 3 * 60 * 60 * 1000
      if ($.isEmptyObject(this.data.data)) {
        this.isCreat = true
      } else {
        this.signInName = this.signInfo.signName
        this.qrcodeRefreshTypeOption = this.signInfo.qrCodeType
        this.signInStartTime = this.signInfo.signStartTime
        this.signInEndTime = this.signInfo.signEndTime
        this.needSignOffOption = this.signInfo.haveSignOut ? '是' : '否'
        this.isCreat = false
      }
      this.isSignOut = this.data.isSignOut
    },
    methods: {
      _back: function () {
        this.$emit('removeBread', this.data)
      },
      changeDate: function (time) {
        var date = new Date(time),
          Y = date.getFullYear() + '-',
          M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-',
          D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ',
          h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':',
          m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes())
        return Y + M + D + h + m
      },
      _signInDetail: function () {
        this.$emit('addBread', {
          route: '/activity/MSignInDetail',
          title: ''
        })
      },
      _editSignIn: function () {
        this.$emit('addBread', {
          route: '/activity/MCreateSignIn',
          title: ''
        })
      },
      _create: function () {
        if (!this.signInName) {
          return this._toast('名称不能为空')
        }
        if (this.blockDuplicatClicks) {
          return false
        }
        this.blockDuplicatClicks = true
        sAjax({
          url: '/api/sc/activityProcesses/createActivitySign',
          type: 'post',
          data: {
            activityId: this.activityInfo.id,
            signName: this.signInName,
            qrCodeType: this.qrcodeRefreshTypeOption,
            haveSignOut: this.needSignOffOption === '是' ? true : false,
            signStartTime: this.signInStartTime ? this.signInStartTime : this.activityInfo.applyStartTime,
            signEndTime: this.signInEndTime ? this.signInEndTime : this.changeDate(this.endTime)
          },
          success: (data) => {
            this.blockDuplicatClicks = false
            if (data.state) {
              this.data.isUpdateLastPage = true
              this.$emit('removeBread', this.data)
            } else {
              this._toast(data.message)
            }
          }
        })
      },
      _save: function () {
        if (!this.signInName) {
          return this._toast('名称不能为空')
        }
        if (this.blockDuplicatClicks) {
          return false
        }
        this.blockDuplicatClicks = true
        sAjax({
          url: '/api/sc/activityProcesses/updateActivitySign/' + this.signInfo.signId,
          type: 'post',
          data: {
            signName: this.signInName,
            qrCodeType: this.qrcodeRefreshTypeOption,
            haveSignOut: this.needSignOffOption === '是' ? true : false,
            signStartTime: this.signInStartTime ? this.signInStartTime : this.activityInfo.applyStartTime,
            signEndTime: this.signInEndTime ? this.signInEndTime : this.changeDate(this.endTime)
          },
          success: (data) => {
            this.blockDuplicatClicks = false
            if (data.state) {
              this.data.isUpdateLastPage = true
              this.$emit('removeBread', this.data)
            } else {
             this._toast(data.message)
            }
          }
        })
      },
      _toast: function (msg) {
        this.$vux.toast.show({
          text: msg,
          position: 'bottom',
          type: 'text'
        })
      },
      _timeSelect: function (value, type) {
        var startTimeString = (new Date(this.signInStartTime.replace(/-/g, '/'))).getTime()
        var endTimeString = (new Date(this.signInEndTime.replace(/-/g, '/'))).getTime()
        if (type === 'start') {
          if (startTimeString < this.startTime) {
            setTimeout(() => {
              this.signInStartTime = ''
            }, 100)
            this.$vux.alert.show({
              title: '签到开始时间要在报名开始时间' + this.activityInfo.applyStartTime + '之后'
            })
          }
          if (startTimeString > this.endTime) {
            setTimeout(() => {
              this.signInStartTime = ''
            }, 100)
            this.$vux.alert.show({
              title: '签到开始时间要在活动结束后三个小时' + this.changeDate(this.endTime) + '之前'
            })
          }
          if (this.signInEndTime) {
            if (startTimeString > endTimeString) {
              setTimeout(() => {
                this.signInStartTime = ''
              }, 100)
              this.$vux.alert.show({
                title: '签到开始时间要在签到结束时间' + this.signInEndTime + '之前'
              })
            }
          }
        } else {
          if (endTimeString > this.endTime) {
            setTimeout(() => {
              this.signInEndTime = ''
            }, 100)
            this.$vux.alert.show({
              title: '签到结束时间要在活动结束后三个小时' + this.changeDate(this.endTime) + '之前'
            })
          }
          if (endTimeString < this.startTime) {
            setTimeout(() => {
              this.signInEndTime = ''
            }, 100)
            this.$vux.alert.show({
              title: '签到结束时间要在报名开始时间' + this.activityInfo.applyStartTime + '之后'
            })
          }
          if (this.signInStartTime) {
            if (startTimeString > endTimeString) {
              setTimeout(() => {
                this.signInEndTime = ''
              }, 100)
              this.$vux.alert.show({
                title: '签到结束时间要在签到开始时间' + this.signInStartTime + '之后'
              })
            }
          }
        }
      }
    }
  }
</script>
<style lang="less">
#creatSignIn {
  .creatSignIn-header {
    height: 56px;
    background: #ffffff;
    // box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.08), 0 4px 4px 0 rgba(0, 0, 0, 0.08);
    z-index: 100;
    padding: 0;
  }
  .creatSignIn-content {
    position: absolute;
    top: 40px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    background: #ffffff;
    .info-group {
      padding: 0 16px;
      .weui-cells {
        position: relative;
        background: #f5f5f5;
        border-radius: 8px;
        &::before,
        &::after {
          height: 0;
          border: none;
        }
      }
      .vux-datetime {
        div {
          p {
            font-weight: 500;
            font-size: 13px;
            color: rgba(0, 0, 0, 0.77);
            margin: 0;
          }
        }
      }
      .weui-cell {
        font-size: 13px;
        padding: 15px 16px;
        &::before {
          left: 0;
        }
        label {
          margin-bottom: 0;
          font-weight: 500;
          font-size: 13px;
          color: rgba(0, 0, 0, 0.77);
        }
        .weui-icon-clear {
          display: none;
        }
        .focus-red {
          color: #ff5252;
        }
        .vux-cell-bd {
          p {
            margin: 0;
          }
        }
      }
      .weui-cell_access {
        .weui-cell__ft {
          padding-right: 0;
          .vux-cell-value {
            font-size: 13px;
            color: rgba(0, 0, 0, 0.6);
            font-weight: 500;
          }
          &::after {
            border-width: 0;
          }
        }
      }
    }
  }
  .submit-box {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .custom-primary-blue {
    font-size: 14px;
    color: #ffffff;
    line-height: 42px;
    background: #448aff;
    border: none;
    border-radius: 100px;
  }
}
</style>
