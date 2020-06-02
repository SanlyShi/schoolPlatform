<template>
  <div id="organizationSearch">
    <view-box>
      <x-header  class="search-page-header" :style="{'box-shadow' : isShowBoxShadow ? '0 0 4px 0 rgba(0,0,0,0.12), 0 4px 4px 0 rgba(0,0,0,0.12)' : 'none'}">
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
      <div class="organizationSearch-content">
        <div class="search-result-list" v-if="organizationList.length > 0">
          <div class="result-cell" v-for="(item, itemIndex) in organizationList" :key="itemIndex">
            <span class="result-title">{{item.organization.name}}</span>
            <span class="apple-join-btn" v-if="item.canApply" @click="_applyOrganization(item)">申请加入</span>
            <span class="apple-join-btn" v-if="item.applying">等待审核</span>
            <span class="apple-join-btn" v-if="item.hasJoined">已加入</span>
          </div>
          <div class="noMoreData" v-if="loadingText">---加载中---</div>
          <div class="noMoreData" v-if="!isLoadMoreData&&isShowNoMoreDataTips">---没有更多数据了---</div>
        </div>
        <div class="nodataText" v-else>{{noDataTips}}</div>
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
        organizationList: [],
        searchTimeOut: null,
        searchName: '',
        pageIndex: 0,
        pageSize: 20,
        noDataTips: '',
        isShowBoxShadow: false,
        isLoadMoreData: false,
        loadingText: false,
        isShowNoMoreDataTips: false
      }
    },
    created: function () {
      this._initPage(true)
    },
    methods: {
      _back: function () {
        this.$emit('removeBread', this.data)
      },
      _initPage: function () {
        this.loadingText = true
        this.isLoadMoreData = false
        sAjax({
          url: '/api/sc/organizations/list/search-join?name=' + this.searchName + '&page=' + this.pageIndex + '&size=' + this.pageSize,
          type: 'get',
          success: (data) => {
            this.loadingText = false
            if (data.state) {
              if (data.data.content.length > 0) {
                this.noDataTips = ''
              } else {
                this.noDataTips = '---暂无相关数据---'
              }
              if (this.searchName) {
                this.organizationList = []
              }
              data.data.content.forEach((ele) => {
                this.organizationList.push(ele)
              })
              if (this.organizationList.length > this.pageSize) {
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
      getResult: function (val) {
        if (this.searchTimeOut) {
          clearTimeout(this.searchTimeOut)
        }
        this.searchTimeOut = setTimeout(() => {
          this._initPage()
        }, 600)
      },
      onSubmit: function () {
        this._initPage()
      },
      _applyOrganization: function (item) {
        sAjax({
          url: '/api/sc/organizations/' + item.organization.id + '/members/apply',
          type: 'post',
          success: (data) => {
            if (data.state) {
              this._toast('申请成功，请等待管理员审核')
              item.applying = true
              item.canApply = false
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
      }
    },
    mounted: function () {
      this.$pullUpToLoad({
        container: '.organizationSearch-content',
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
      $(".organizationSearch-content").on('scroll', function () {
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
#organizationSearch {
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
          width: 91%;
        }
      }
    }
  }
  .organizationSearch-content {
    position: absolute;
    top: 60px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    background: #ffffff;
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
          width: 63%;
        }
        .apple-join-btn {
          font-size: 13px;
          color: #448aff;
          font-weight: 500;
          float: right;
          margin: 4px 4px 0 0;
          padding: 10px 0;
        }
      }
    }
  }
}
</style>
