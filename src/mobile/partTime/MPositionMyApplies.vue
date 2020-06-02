<template>
  <div id="myPositionList" class="position-list">
    <view-box>
      <x-header class="position-list-header" title="我的申请" :left-options="{showBack: false}">
        <i slot="overwrite-left" class="maticon back-icon" v-html="icons('navigate_before')" @click="_back">navigate_before</i>
      </x-header>
      <div class="position-content">
        <div class="job-list">
          <div class="job-item" v-for="(item, i) in myPositionListData" :key="i" @click="_checkJobDetail(item)">
            <label class="job-name">{{item.applicationFormVO.position.positionName}}</label>
            <p><span class="job-unit">{{item.applicationFormVO.position.unit&&item.applicationFormVO.position.unit.name}}</span>&nbsp;<span class="job-type">{{item.applicationFormVO.position.positionType}}</span></p>
            <span class="job-address">{{item.applicationFormVO.position.address}}</span>
            <div class="job-info">
              <span class="job-salary">{{item.applicationFormVO.position.rewardStandard}}元/小时</span>
              <span class="job-time">{{item.applicationFormVO.position.createTime?item.applicationFormVO.position.createTime.split(' ')[0]:''}}</span>
            </div>
          </div>
          <div class="noMoreData" v-if="loadingText">---加载中---</div>
          <div class="noMoreData" v-if="!isLoadMoreData&&isShowNoMoreDataTips">---没有更多数据了---</div>
        </div>
      </div>
    </view-box>
  </div>
</template>
<script>
  import { sAjax, translation } from '../../assets/utils/utils.js'
  export default {
    props: {
      data: {
        default: null
      }
    },
    data: function () {
      return {
        myPositionListData: [],
        loadingText: false,
        isLoadMoreData: false,
        isShowNoMoreDataTips: false,
        pageIndex: 0,
        pageSize: 20
      }
    },
    methods: {
      _back: function () {
        this.$emit('removeBread', this.data)
      },
      _getResult: function (val) {
      },
      _onSubmit: function (val) {
        this.pageIndex = 0
        this.myPositionListData = []
        this._initPositionList({
          page: this.pageIndex,
          size: this.pageSize
        })
      },
      _initPositionList: function (param) {
        this.loadingText = true
        this.isLoadMoreData = false// 防止多次拖拽请求
        sAjax({
          url: '/api/pwps/workflow/runtime/applications/histories',
          type: 'get',
          data: param,
          success: (data) => {
            if (data.state) {
              this.loadingText = false
              if (data.data.content.length > 0) {
                this.noDataTips = ''
              } else {
                this.noDataTips = '暂无相关数据'
              }
              data.data.content.forEach((ele) => {
                this.myPositionListData.push(ele)
              })
              if (data.data.content.length < this.pageSize) {
                this.isLoadMoreData = false
                this.isShowNoMoreDataTips = true
              } else {
                this.isLoadMoreData = true
                this.isShowNoMoreDataTips = false
              }
            } else {
              this._toast(data.message)
            }
          }
        })
      },
      _checkJobDetail: function (item) {
        this.$emit('addBread', {
          route: '/partTime/positionDetail',
          title: '',
          isMyApply: true,
          data: item
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
    created: function () {
      var that = this
      //活动简介长度没限制（超出部分...）
      this._initPositionList({
        page: this.pageIndex,
        size: this.pageSize
      })
    },
    mounted: function () {
      this.$pullUpToLoad({
        container: '#myPositionList .position-content',
        down: {
          height: 200,
          callback: () => {
            this.pageIndex = 0
            this.myPositionListData = []
            this._initPositionList({
              page: this.pageIndex,
              size: this.pageSize
            })
          }
        },
        up: {
          callback: () => {
            if (this.isLoadMoreData) {
              this.pageIndex++
              this._initPositionList({
                page: this.pageIndex,
                size: this.pageSize
              })
            }
          }
        }
      })
    }
  }
</script>
<style lang="less">
#myPositionList.position-list {
  background: #f2f2f2;
  .position-list-header {
    height: 56px;
    background: #465aa2;
    box-shadow: 0 2px 4px 0 rgba(154,154,154,0.10);
    z-index: 100;
    padding: 0;
    .back-icon {
      color: #fff;
    }
    .vux-header-title {
      line-height: 56px;
    }
  }
  .weui-search-bar {
    background: #fff;
    .weui-search-bar__form {
      background: #fff;
      &:after {
        border: none;
      }
    }
    .weui-search-bar__label {
      span {
        font-size: 16px;
        font-weight: 500;
        color: #b2b2b2;
      }

      .weui-icon-search {
        font-size: 16px;
        color: #c2c2c2;
      }
    }
    .weui-search-bar__box .weui-search-bar__input {
      height: 20px;
    }
  }
  .search-part {
    position: absolute !important;
    top: 56px;
    left: 0;
  }
  .position-content {
    position: absolute;
    top: 56px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    background: #f2f2f2;
  }
  .job-list {
    .job-item {
      position: relative;
      padding: 15px 21px 25px;
      margin-bottom: 10px;
      background: #fff;
      .job-name {
        margin-bottom: 5px;
        font-size: 16px;
        color: #333333;
      }
      .job-unit,
      .job-type {
        margin-bottom: 12px;
        font-size: 14px;
        color: #888888;
      }
      .job-address {
        padding: 4px 8px;
        font-size: 12px;
        color: #a1a1a1;
        background: #f2f2f2;
        border-radius: 1px;
      }
      .job-info {
        position: absolute;
        right: 21px;
        top: 15px;
        text-align: center;
        .job-salary {
          display: block;
          font-size: 14px;
          color: #e04545;
          letter-spacing: 0.1px;
        }
        .job-time {
          font-size: 12px;
          color: #a1a1a1;
          letter-spacing: 0.2px;
        }
      }
    }
  }
}
</style>
