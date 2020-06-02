<template>
  <div id="myActivity" style="height:100%;">
    <view-box>
      <x-header  class="myActivity-header" :style="{'box-shadow' : isShowBoxShadow ? '0 0 4px 0 rgba(0,0,0,0.12), 0 4px 4px 0 rgba(0,0,0,0.12)' : 'none'}">
        <i slot="overwrite-left" class="maticon back-icon" v-html="icons('navigate_before')" @click="_back">navigate_before</i>
        <div class="overwrite-title-demo" slot="overwrite-title">
          <div class="myActivity-tabbar">
            <div class="tab-item" :class="selectedTab === item.type?'active':''" v-for="(item, index) in tabs" :key="index" @click="tabClick(item)">{{item.name}}</div>
          </div>
        </div>
      </x-header>
      <div class="myActivity-content">
        <div class="myActivity-container" v-if="activityList[selectedTab].length > 0">
          <group class="myActivity-group" >
            <cell class="myActivity-cell" :title="col.name" :inline-desc="_getActivityTimeStatus(col)" v-for="(col, i) in activityList[selectedTab]" :key="i" @click.native="_clickActivity(col)">
              
            </cell>
          </group>
          <div class="noMoreData" v-if="loadingText">---加载中---</div>
          <div class="noMoreData" v-if="!isLoadMoreData && isShowNoMoreDataTips[selectedTab]">---没有更多数据了---</div>
        </div>
        <div class="nodataText" v-else>{{noDataTips}}</div>
      </div>
    </view-box> 
  </div>
</template>
<script>
  import Vue from 'vue'
  import { sAjax, translation } from '../../assets/utils/utils.js'
  export default {
    props: {
      data: {
        default: ''
      }
    },
    data: function () {
      return {
        number: 0,
        tabIndex: 0,
        tabs: [{
          type: 'PARTICIPANT',
          name: '参与'
        }, {
          type: 'PUBLISH',
          name: '发起'
        }, {
          type: 'AUDITOR',
          name: '管理'
        }, {
          type: 'COLLECTION',
          name: '收藏'
        }],
        selectedTab: 'PARTICIPANT',
        activityList: {
          PARTICIPANT: [],
          PUBLISH: [],
          AUDITOR: [],
          COLLECTION: []
        },
        pageIndex: {
          PARTICIPANT: 0,
          PUBLISH: 0,
          AUDITOR: 0,
          COLLECTION: 0
        },
        pageSize: 20,
        isLoadMoreData: false,
        loadingText: false,
        isShowNoMoreDataTips: {
          PARTICIPANT: false,
          PUBLISH: false,
          AUDITOR: false,
          COLLECTION: false
        },
        creatAjax: null,
        noDataTips: '',
        isShowBoxShadow: ''
      }
    },
    created: function () {
      var that = this
      this._initMyActivityList(this.selectedTab, true)

    },
    methods: {
      _initMyActivityList: function (type) {
        this.loadingText = true
        this.isLoadMoreData = false// 防止多次拖拽请求
        this.creatAjax = sAjax({
          url: '/api/sc/activities/type/' + type,
          type: 'get',
          data: {
            page: this.pageIndex[type],
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
              data.data.content.forEach((ele) => {
                this.activityList[type].push(ele)
              })
              if (this.activityList[type].length > this.pageSize) {
                this.isShowNoMoreDataTips[type] = true
              } else {
                this.isShowNoMoreDataTips[type] = false
              }
              if (data.data.content.length < this.pageSize) {
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
      addBread: function () {
        this.$emit('addBread', {
          route: '/form/MFormLayout',
          title: ''
        })
      },
      _back: function () {
        this.$emit('removeBread', this.data)
      },
      _clickActivity: function (item) {
        this.$emit('addBread', {
          route: '/activity/MActivityDetail',
          title: item.name,
          data: item,
          type: this.selectedTab
        })
      },
      tabClick: function (obj) {
        this.selectedTab = obj.type
        if (this.activityList[this.selectedTab].length === 0) {
          this._initMyActivityList(this.selectedTab, true)
        }
      },
      _getActivityTimeStatus: function (data) {
        var applyStartTime = new Date(data.applyStartTime.replace(/-/g, '/'));
        var applyEndTime = new Date(data.applyEndTime.replace(/-/g, '/'));
        var startTime = new Date(data.startTime.replace(/-/g, '/'));
        var endTime = new Date(data.endTime.replace(/-/g, '/'));
        var now = this.creatAjax.getResponseHeader("Date") ? new Date(this.creatAjax.getResponseHeader("Date")) : new Date()
        var applyStartTimeTimeDif = applyStartTime.getTime() - now.getTime(); //报名开始时间差
        var applyEndTimeTimeDif = applyEndTime.getTime() - now.getTime(); //报名结束时间差
        var startTimeTimeDif = startTime.getTime() - now.getTime(); //活动开始时间差
        var endTimeTimeDif = endTime.getTime() - now.getTime(); //活动结束时间差
        var str = ''
        if (applyStartTimeTimeDif > 0) {
          str = this._getTimeString(applyStartTimeTimeDif, '报名开始', 'start')

        } else if (applyEndTimeTimeDif > 0) {
          str = this._getTimeString(applyEndTimeTimeDif, '报名截止', 'end')

        } else if (startTimeTimeDif > 0) {
          str = this._getTimeString(startTimeTimeDif, '活动开始', 'start')

        } else if (endTimeTimeDif > 0) {
          str = this._getTimeString(endTimeTimeDif, '活动结束', 'end')

        } else {
          str = '活动已结束'
        }
        data.statusStr = str
        return str
      },
      _getTimeString: function (secondTime, actStatus, type) {
        var totalSecs = secondTime / 1000
        var dayTime = Math.floor(totalSecs / (3600 * 24))
        var hourTime = Math.floor((totalSecs - dayTime * 24 * 3600) / 3600)
        var minuteTime = Math.floor((totalSecs - dayTime * 24 * 3600 - hourTime * 3600) / 60)
        if (dayTime != 0) {
          return '距' + actStatus + '还有 ' + dayTime + ' 天 '
        } else if (hourTime != 0) {
          return '距' + actStatus + '还有 ' + hourTime + ' 小时 '
        } else if (hourTime == 0 && minuteTime != 0) {
          if (type === 'start') {
            if (actStatus === '报名开始') {
              return '报名即将开始'
            }
            if (actStatus === '活动开始') {
              return '活动即将开始'
            }
          } else {
            if (actStatus === '报名截止') {
              return '报名即将结束'
            }
            if (actStatus === '活动结束') {
              return '活动即将结束'
            }
          }
        }
      }
    },
     mounted: function () {
      this.$pullUpToLoad({
        container: '.myActivity-content',
        up: {
          callback: () => {
            if (this.isLoadMoreData) {
              this.pageIndex[this.selectedTab]++
              this._initMyActivityList(this.selectedTab)
            }
          }
        }
      })
      var that = this
      $(".myActivity-content").on('scroll', function () {
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
#myActivity {
  .myActivity-header {
    height: 56px;
    background: #ffffff;
    // box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.08), 0 4px 4px 0 rgba(0, 0, 0, 0.08);
    z-index: 100;
    padding: 0;
    .vux-header-left .left-arrow {
      color: rgba(0, 0, 0, 0.54);
    }
    .vux-header-title-area {
      height: 56px;
      overflow: initial;
      margin: -1px 0 0 50px;
      .overwrite-title-demo {
        height: 56px;
        .myActivity-tabbar {
          height: 56px;
          float: right;
          margin-right: 12px;
          .tab-item {
            font-size: 13px;
            color: rgba(0, 0, 0, 0.54);
            background: #f5f5f5;
            border-radius: 100px;
            font-weight: 500;
            padding: 7px 14px;
            display: inline-block;
            margin-top: 12px;
            margin-left: 8px;
            &.active {
              color: #ffffff;
              background: #448aff;
            }
          }
          // .vux-tab-container {
          //   height: 56px;
          //   .vux-tab {
          //     height: 54px;
          //     position: absolute;
          //     right: 12px;
          //     width: 90%;
          //     .myActivity-tab {
          //       font-size: 12px;
          //       background: #ffffff;
          //       padding-top: 4px;
          //       &.vux-tab-selected {
          //         color: #298df7;
          //       }
          //     }
          //     .vux-tab-bar-inner {
          //       background-color: #298df7;
          //       height: 2px;
          //       margin-top: 1px;
          //     }
          //   }
          //   @media screen and (width: 414px) {
          //     .vux-tab {
          //       width: 85%;
          //     }
          //   }
          //   @media screen and (width: 384px) {
          //     .vux-tab {
          //       width: 89%;
          //     }
          //   }
          //   @media screen and (max-width: 320px) {
          //     .vux-tab {
          //       width: 95%;
          //     }
          //   }
          // }
        }
      }
    }
  }
  .myActivity-content {
    position: absolute;
    padding-top: 56px;
    top: 0;
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
  }
  .myActivity-container {
    .myActivity-group {
      .weui-cells {
        &:before {
          border-top: 0px solid #ffffff;
        }
        &:after {
          border-bottom: 0px solid #ffffff;
        }
        .myActivity-cell {
          padding: 6px 15px 9px;
          &:before {
            left: 16px;
            right: 16px;
          }
          .weui-cell__hd {
            margin-left: 1px;
          }
          p {
            margin-bottom: -6px;
          }
          .vux-label {
            color: rgba(0, 0, 0, 0.77);
            line-height: 13px;
            font-size: 13px;
          }
          .vux-label-desc {
            font-size: 10px;
            color: rgba(0, 0, 0, 0.32);
            line-height: 10px;
          }
          &:before {
            border-bottom: 0px solid #ffffff;
          }
        }
      }
    }
  }
}
</style>
