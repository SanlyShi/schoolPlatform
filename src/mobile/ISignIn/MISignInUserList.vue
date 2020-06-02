<template>
  <div id="iSignUserList">
    <view-box> 
      <x-header  class="search-page-header" :style="{'box-shadow' : isShowBoxShadow ? '0 0 4px 0 rgba(0,0,0,0.12), 0 4px 4px 0 rgba(0,0,0,0.12)' : 'none'}">
        <i slot="overwrite-left" class="maticon back-icon" v-html="icons('navigate_before')" @click="_back">navigate_before</i>
        <div class="search-page-container" slot="overwrite-title" >
          <search
          class="header-search iSignUserList-search"
          @on-change="getResult"
          @on-submit="onSubmit"
          v-model="searchName"
          position="absolute"
          placeholder="请输入"
          auto-scroll-to-top
          top="0"
          ref="search"></search>
        </div>
      </x-header>
      <div class="iSignUserList-content">
        <group class="iSignUserList-group" v-if="listData.length > 0">
          <div v-for="(item, itemIndex) in listData" :key="itemIndex">
            <cell class="iSignUserList-cell" :title="item.name+' (未签到)'" :inline-desc="item.college || '' + item.grade || '' + item.educationLevel || ''" v-if="item.signInStatus === 'NOT_SIGN'">
              <x-button class="manual-sign-btn" mini @click.native="_manualSign(item)">手动签到</x-button>
            </cell>
            <cell class="iSignUserList-cell" :title="item.name" :inline-desc="item.college || '' + item.grade || '' + item.studentType || ''" v-else>
              <x-button class="manual-sign-btn" style="color: rgba(0, 0, 0, 0.77)" mini disabled>已签到</x-button>
            </cell>
          </div>
          <div class="noMoreData" v-if="loadingText">---加载中---</div>
          <!-- <div class="noMoreData" v-if="!isLoadMoreData&&isShowNoMoreDataTips">---没有更多数据了----</div> -->
        </group>
        <div class="nodataText" v-else>{{noDataTips}}</div>
      </div>
       <div id="iSignUserList-transfer-dom" v-transfer-dom>
      <confirm v-model="showConfirm"
      show-input
      ref="confirm"
      title="备注"
      class="iSignUserList-confirm"
      :close-on-confirm="false"
      @on-cancel="onCancel"
      @on-confirm="onConfirm">
      </confirm>
    </div>
    </view-box> 
  </div>
</template>
<script>
  import { sAjax, translation } from '../../assets/utils/utils.js'
  export default {
    props: {
      data: {
        default: ''
      }
    },
    data: function () {
      return {
        pageIndex: 0,
        pageSize: 20,
        listData: [],
        searchTimeOut: null,
        searchName: '',
        noDataTips: '',
        isShowBoxShadow: false,
        info: {},
        showConfirm: false,
        loadingText: false,
        noDataTips: '',
        isLoadMoreData: false,
        isShowNoMoreDataTips: false,
        userId: '',
        userUrl: '',
        detailType: '',
        curManualEntry: {}
      }
    },
    created: function () {
      this.info = this.data.data
      this.detailType = this.data.data.detailType
      this._initPage()
    },
    methods: {
      _back: function () {
        this.$emit('removeBread', this.data)
      },
      getResult: function (val) {
        if (this.searchTimeOut) {
          clearTimeout(this.searchTimeOut)
        }
        this.searchTimeOut = setTimeout(() => {
          this.listData = []
          this.pageIndex = 0
          this._initPage()
        }, 600)
      },
      onSubmit: function () {
        this.listData = []
        this.pageIndex = 0
        this._initPage()
      },
      _initPage: function () {
        this.loadingText = true
        this.isLoadMoreData = false
        if (this.detailType === 'AGENT') {
          this.userUrl = `/api/signIns/${this.info.signId}/people/pages?agentId=${this.info.roleInfo.agentId}&name=${this.searchName}&collegeCode=${this.info.roleInfo.collegeCode}&classId=${this.info.roleInfo.classId}&page=${this.pageIndex}&size=${this.pageSize}`
        } else {
          this.userUrl = `/api/signIns/peoples/MANAGE?signInId=${this.info.signId}&page=${this.pageIndex}&size=${this.pageSize}&name=${this.searchName}`
        }
        sAjax({
          url: this.userUrl,
          type: 'get',
          success: (data) => {
            this.loadingText = false
            if (data.state) {
              if (data.data.content.length > 0) {
                this.noDataTips = ''
              } else {
                this.noDataTips = '---暂无相关数据---'
              }
              data.data.content.forEach((ele) => {
                this.listData.push(ele)
              })
              if (this.listData.length > this.pageSize) {
                this.isShowNoMoreDataTips = true
              } else {
                this.isShowNoMoreDataTips = false
              }
              if (data.data.content.length < this.pageSize) {
                this.isLoadMoreData = false
              } else {
                this.isLoadMoreData = true
              }
            } else {
              this._toast(data.message)
            }
          }
        })
      },
      _manualSign: function (item) {
        this.curManualEntry = item
        this.userId = item.userId
        this.showConfirm = true
      },
      onConfirm: function (msg) {
        if (!msg) {
         return this._toast('请输入备注')
        }
        sAjax({
          url: '/api/signIns/signInStatus',
          dataType: 'json',
          type: 'post',
          data: {
            signInId: this.info.signId,
            userId: this.userId,
            remark: msg
          },
          success: (data) => {
            var message = ''
            this.showConfirm = false
            if (data.state) {
              message = '操作成功'
             this.curManualEntry.signInStatus = 'MANUAL_ENTRY'
            } else {
              message = data.message
            }
            this._toast(message)
          }
        })
      },
      _toast: function (msg) {
        this.$vux.toast.show({
          text: msg,
          position: 'bottom',
          type: 'text'
        })
      }
    },
    mounted: function () {
      this.$pullUpToLoad({
        container: '.iSignUserList-content',
        up: {
          callback: () => {
            if (this.isLoadMoreData) {
              this.pageIndex++
              this._initPage()
            }
          }
        }
      })
      var that = this
      $(".iSignUserList-content").on('scroll', function () {
        var scrollTop = $(this).scrollTop()
        if (scrollTop >= 50) {
          that.isShowBoxShadow = true
        } else {
          that.isShowBoxShadow = false
        }
      })
    }
  }
</script>
<style lang="less">
#iSignUserList {
  .search-page-header {
    height: 56px;
    background: #ffffff;
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.08), 0 4px 4px 0 rgba(0, 0, 0, 0.08);
    z-index: 100;
    padding: 0;
    .sumbit-icon {
      color: #448aff;
      padding: 5px;
      margin-top: -4px;
      position: absolute;
      z-index: 100;
      right: 0;
    }
    .vux-header-title-area {
      margin: 0 0 0 35px;
      height: 56px;
      .header-search {
        &.iSignUserList-search {
          left: 35px;
          width: 76%;
          position: absolute !important;
          top: 0px;
        }
      }
      .weui-search-bar__input {
        height: auto;
        padding: 8px 14px;
        background: #f5f5f5;
        border-radius: 100px;
        font-size: 12px;
        margin-top: 10px;
      }
      .weui-icon-clear {
        font-size: 16px;
        padding: 13px 17px;
      }
    }
  }
  .iSignUserList-content {
    position: absolute;
    top: 42px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    background: #ffffff;
    .iSignUserList-group {
      .weui-cells {
        &:before {
          border-top: 0;
        }
        &:after {
          margin: 0 16px;
          border-bottom: 0;
        }
        .iSignUserList-cell {
          padding: 13px 15px 9px;
          border-bottom: 1px solid #e0e0e0;
          &:before {
            left: 16px;
            right: 16px;
          }
          .manual-sign-btn {
            background: #ffffff;
            font-size: 13px;
            color: #448aff;
            margin-right: -14px;
            &:after {
              border: 0;
            }
          }
          .weui-cell__hd {
            margin-left: 1px;
          }
          .weui-cell-ft {
            margin-top: -5px;
          }
          .vux-cell-primary {
            width: 74%;
          }
          p {
            margin-bottom: -6px;
          }
          .vux-label {
            color: rgba(0, 0, 0, 0.77);
            line-height: 13px;
            font-size: 13px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: inline-block;
            width: 100%;
          }
          .vux-label-desc {
            font-size: 10px;
            color: rgba(0, 0, 0, 0.32);
            line-height: 12px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: inline-block;
            width: 100%;
          }
          &:before {
            border-bottom: 0px solid #ffffff;
          }
        }
      }
    }
  }
}
#iSignUserList-transfer-dom {
  .iSignUserList-confirm {
    .weui-dialog__title {
      font-size: 15px;
    }
    .vux-prompt-msgbox {
      border: 0;
      border-bottom: 2px solid #448aff;
      border-radius: 0;
    }
    .weui-dialog__ft {
      font-size: 14px;
    }
  }
}
</style>
