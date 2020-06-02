<template>
  <div id="activitySearch">
    <view-box> 
      <x-header  class="search-page-header">
        <i slot="overwrite-left" class="maticon back-icon" v-html="icons('navigate_before')" @click="_back">navigate_before</i>
        <div class="search-page-container" slot="overwrite-title" >
          <search
          class="header-search"
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
      <div class="activitySearch-content">
        <div class="search-history-record" v-if="isShowHistoryRecord">
          <div class="history-cell" v-for="(item, i) in historyRecordData" @click="_clickHistoryRecord(item.content)">
            <i class="maticon history-icon" v-html="icons('schedule')">schedule</i>
            <span class="history-record-title">{{item.content}}</span>
            <i class="maticon clear-icon" v-html="icons('clear')" @click.stop="_deleteHistoryRecord(item.content)">clear</i>
          </div>
        </div>
        <div class="search-result-list" v-else>
          <div v-if="activityListData.length > 0">
              <div class="result-cell" v-for="(item, i) in activityListData" @click="_activityDetail(item)">
                <span class="result-title">{{item.name}}</span>
              </div>
              <div class="noMoreData" v-if="loadingText">---加载中---</div>
              <div class="noMoreData" v-if="!isLoadMoreData&&isShowNoMoreDataTips">---没有更多数据了---</div>
          </div>
          <div class="nodataText" v-else>{{noDataTips}}</div>
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
        default: ''
      }
    },
    data: function () {
      return {
        isShowHistoryRecord: true,
        pageIndex: 0,
        pageSize: 20,
        searchName: '',
        isLoadMoreData: false,
        activityListData: [],
        historyRecordData: [],
        searchTimeOut: null,
        loadingText: false,
        noDataTips: '',
        isShowNoMoreDataTips: false
      }
    },
    created: function () {
      var that = this
      this._getHistoryRecord()

    },
    methods: {
      _back: function () {
        this.$emit('removeBread', this.data)
      },
      getResult: function (val) {
        if (!val) {
          this.isShowHistoryRecord = true
          this._getHistoryRecord()
        } else {
          this.isShowHistoryRecord = false
          if (this.searchTimeOut) {
            clearTimeout(this.searchTimeOut)
          }
          this.searchTimeOut = setTimeout(() => {
            this._initActivityList()
          }, 600)
        }
      },
      onSubmit: function () {
        this._initActivityList()
      },
      _initActivityList: function () {
        this.loadingText = true
        this.isLoadMoreData = false// 防止多次拖拽请求
        sAjax({
          url: '/api/sc/activities/pages?name=' + this.searchName,
          type: 'get',
          data: {
            page: this.pageIndex,
            size: this.pageSize
          },
          success: (data) => {
            if (data.state) {
              this.loadingText = false
              if (data.data.content.length > 0) {
                this.noDataTips = ''
              } else {
                this.noDataTips = '---暂无相关数据---'
              }
              if (this.searchName) {
                this.activityListData = []
              }
              data.data.content.forEach((ele) => {
                this.activityListData.push(ele)
              })
              this._saveHistoryRecord()
              if (this.activityListData.length > this.pageSize) {
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
      _getHistoryRecord: function () {
        sAjax({
          url: '/api/system/search/histories?portal=INDEX_ACTIVITY_NAME_SEARCH&top=3',
          type: 'get',
          success: (data) => {
            if (data.state) {
              this.historyRecordData = data.data
            } else {
              this._toast(data.message)
            }
          }
        })
      },
      _saveHistoryRecord: function () {
        if (!this.searchName) {
          return false
        }
        sAjax({
          url: '/api/system/search/histories',
          type: 'post',
          data: {
            content: this.searchName,
            portal: 'INDEX_ACTIVITY_NAME_SEARCH'
          },
          success: function (data) {
            if (!data.state) {
              this._toast(data.message)
            }
          }
        })
      },
      _deleteHistoryRecord: function (content) {
        sAjax({
          url: '/api/system/search/histories/delete?portal=INDEX_ACTIVITY_NAME_SEARCH&content=' + content,
          type: 'post',
          success: (data) => {
            if (data.state) {
              this._getHistoryRecord()
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
      _clickHistoryRecord: function (content) {
        this.searchName = content
        this.isShowHistoryRecord = false
        this.$refs.search.setFocus()
        this.onSubmit()
      },
      _activityDetail: function (item) {
        this.$emit('addBread', {
          route: '/activity/MActivityDetail',
          title: item.name,
          data: item
        })
      }
    },
    mounted: function () {
      this.$pullUpToLoad({
        container: '.activitySearch-content',
        up: {
          callback: () => {
            if (this.isLoadMoreData) {
              this.pageIndex++
              this._initActivityList()
            }
          }
        }
      })
    }
  }
</script>
<style lang="less">
#activitySearch {
  .search-page-header {
    height: 56px;
    background: #ffffff;
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.08), 0 4px 4px 0 rgba(0, 0, 0, 0.08);
    z-index: 100;
    padding: 0;
    .vux-header-title-area {
      margin: 0 0 0 35px;
      height: 56px;
      .header-search {
        &.vux-search-fixed {
          left: 35px;
          width: 90%;
        }
      }
    }
  }
  .activitySearch-content {
    position: absolute;
    top: 56px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    background: #ffffff;
    .nodataText {
      text-align: center;
      font-size: 13px;
      font-weight: bold;
      margin-top: 30px;
    }
    .noMoreData {
      text-align: center;
      font-size: 13px;
      font-weight: bold;
      margin: 10px 0;
    }
    .search-history-record {
      .history-cell {
        height: 50px;
        padding: 0 16px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
      }
      .history-icon {
        font-size: 24px;
        color: rgba(0, 0, 0, 0.54);
        margin-top: 12px;
      }
      .history-record-title {
        display: inline-block;
        vertical-align: top;
        margin-top: 17px;
        margin-left: 20px;
        font-size: 13px;
        color: rgba(0, 0, 0, 0.54);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        width: 71%;
      }
      .clear-icon {
        font-size: 24px;
        color: rgba(0, 0, 0, 0.24);
        float: right;
        margin-top: 12px;
      }
    }
    .search-result-list {
      .result-cell {
        height: 50px;
        padding: 0 16px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        .result-title {
          display: inline-block;
          vertical-align: top;
          margin-top: 14px;
          margin-left: 48px;
          font-weight: 500;
          font-size: 13px;
          color: rgba(0, 0, 0, 0.67);
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          width: 82%;
        }
      }
    }
  }
}
</style>
