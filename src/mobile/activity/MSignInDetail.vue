<template>
  <div id="signInDetail">
    <view-box>
      <x-header :title="signName"  class="signInDetail-header">
        <i slot="overwrite-left" class="maticon back-icon" v-html="icons('navigate_before')" @click="_back">navigate_before</i>
      </x-header>
      <div class="signInDetail-content">
        <div class="signInDetail-qrcode">
          <qrcode :value="qrcodeUrl" type="img"></qrcode>
        </div>
        <group class="info-group">
          <x-input :title="'已有 ' + signNumber + ' 人签到'" readonly v-if="!data.isSignOut"></x-input>
          <x-input :title="'已有 ' + signNumber + ' 人签退'" readonly v-else></x-input>
        </group>
        <div class="user-list">
          <group class="info-group">
            <x-input :title="item.name" readonly v-for="(item, index) in signUserData" :key="index">
              <span slot="right" class="signIn-time">{{item.signTime}}</span>
            </x-input>
          </group>
          <div class="noMoreData" v-if="loadingText">---加载中---</div>
          <div class="noMoreData" v-if="!isLoadMoreData && isShowNoMoreDataTips[selectedTab]">---没有更多数据了---</div>
        </div>
      </div>
    </view-box> 
  </div>
</template>
<script>
  import { Qrcode } from 'vux'
  import { sAjax, translation } from '../../assets/utils/utils.js'
  export default {
    props: {
      data: {
        default: ''
      }
    },
    data: function () {
      return {
        signInfo: {},
        pageIndex: 0,
        pageSize: 10,
        timer: null,
        userSignTimer: null,
        signType: '',
        signNumber: 0,
        signName: '',
        qrcodeUrl: '',
        signUserData: [],
        isShowNoMoreDataTips: false,
        isLoadMoreData: false,
        loadingText: false
      }
    },
    created: function () {
      var that = this
      this.signInfo = this.data.data
      this.signType = this.data.isSignOut ? 'SIGN_OUT' : 'SIGN_IN'
      this.signName = this.signInfo.signName + (this.data.isSignOut ? '签退' : '签到')
      this._initUserSignInList(this.pageIndex)
      this.userSignTimer = setInterval(() => {
        this._initUserSignInList(0)   
      }, 10000)
      if (this.signInfo.qrCodeType === 0) {
        clearInterval(this.timer)
        this._initPage()
      } else {
        var time = this.signInfo.qrCodeType * 1000
        this.qrcodeRefresh(time)
      }
    },
    components: {
      Qrcode
    },
    methods: {
      _back: function () {
        this.userSignTimer&&clearInterval(this.userSignTimer)
        this.timer&&clearInterval(this.timer)
        this.$emit('removeBread', this.data)
      },
      _initUserSignInList: function (index) {
        this.loadingText = true
        this.isLoadMoreData = false
        sAjax({
          url: '/api/sc/activityProcesses/getSignUsers?signId=' + this.signInfo.signId + '&pageIndex=' + index + '&pageSize=' + this.pageSize + '&signType=' + this.signType,
          type: 'get',
          success: (data) => {
            if (data.state) {
              this.loadingText = false
              this.signNumber = data.data.userCount
              if (index === 0) {
                this.signUserData = []
              }
              data.data.showSignUserData.forEach((ele) => {
                this.signUserData.push(ele)
              })
              if (this.signUserData.length > this.pageSize) {
                this.isShowNoMoreDataTips = true
              } else {
                this.isShowNoMoreDataTips = false
              }
              if (data.data.showSignUserData.length < this.pageSize) {
                this.isLoadMoreData = false
              } else {
                this.isLoadMoreData = true
              }
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
      _initPage: function () {
        sAjax({
          url: '/api/sc/activityProcesses/getSignCodeUrl/' + this.signInfo.activityId + '/' + this.signInfo.signId + '/' + this.signType,
          type: 'get',
          success: (data) => {
            if (data.state) {
              this.qrcodeUrl = window.location.origin + data.data
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
      qrcodeRefresh: function (time) {
        clearInterval(this.timer)
        this.timer = setInterval(() => {
          this._initPage()
        }, time)

      }
    },
      mounted: function () {
      this.$pullUpToLoad({
        container: '.user-list',
        up: {
          callback: () => {
            if (this.isLoadMoreData) {
              this.pageIndex++
              this._initUserSignInList(this.pageIndex)
            }
          }
        }
      })
    }
  }
</script>
<style lang="less">
#signInDetail {
  .signInDetail-header {
    height: 56px;
    background: #ffffff;
    z-index: 100;
    padding: 0;
    .vux-header-title {
      font-size: 14px;
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
  .signInDetail-content {
    position: absolute;
    top: 56px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    background: #ffffff;
    .signInDetail-qrcode {
      text-align: center;
      margin: 29px 0 60px 0;
      canvas,
      img {
        width: 241px !important;
        height: 233px !important;
      }
    }
    .info-group {
      padding: 0 16px;
      margin-bottom: 14px;
      .weui-cells {
        position: relative;
        background: #f5f5f5;
        border-radius: 8px;
        margin-top: 0px;
        &::before,
        &::after {
          height: 0;
          border: none;
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
        }
        .weui-icon-clear {
          display: none;
        }
        .focus-red {
          color: #ff5252;
        }
        .vux-cell-bd {
          margin: 0;
        }
      }
      .weui-cell_access {
        .weui-cell__ft {
          padding-right: 0;
          &::after {
            border-width: 0;
          }
        }
      }
    }
  }
}
</style>
