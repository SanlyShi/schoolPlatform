<template>
  <div id="announcement">
    <view-box>
      <x-header  class="announcement-header">
        <div class="overwrite-title-demo" slot="overwrite-title">
          <tab class="announcement-tabbar" :line-width="1"  v-model="tabIndex">
            <tab-item class="announcement-tab" v-for="(item, index) in tabs" :key="index" :selected="selectedTab === item.type" @on-item-click="tabClick(item)">{{item.name}}</tab-item>
          </tab>
        </div>
      </x-header>
      <div class="announcement-content">
        <div class="announcement-container" v-if="announcementArr[selectedTab].length > 0">
          <group class="announcement-group"  v-for="(col, i) in announcementArr[selectedTab]" :key="i">
            <cell class="announcement-cell" :title="col.title" :inline-desc="col.createTime" @click.native="_viewAnnounce(col)">
              <badge class="announcement-badge" :text="typeData[col.type]"></badge>
            </cell>
          </group>
          <div class="noMoreData" v-if="loadingText">---加载中---</div>
          <div class="noMoreData" v-if="!isLoadMoreData&&isShowNoMoreDataTips[selectedTab]">---没有更多数据了---</div>
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
        number: 0,
        tabIndex: 0,
        tabs: [{
          type: 'all',
          name: '全部'
        }, {
          type: 'school',
          name: '全校'
        }, {
          type: 'college',
          name: '学院'
        }, {
          type: 'instructor',
          name: '辅导员'
        }],
        selectedTab: 'all',
        announcementArr: {
          all: [],
          school: [],
          college: [],
          instructor: []
        },
        pageIndex: {
          all: 0,
          school: 0,
          college: 0,
          instructor: 0
        },
        pageSize: 10,
        isLoadMoreData: false,
        loadingText: false,
        typeData: {
          all: '全部',
          school: '全校',
          college: '学院',
          instructor: '辅导员'
        },
        noDataTips: '',
        isShowNoMoreDataTips: {
          all: false,
          school: false,
          college: false,
          instructor: false
        }
      }
    },
    created: function () {
      var that = this
      this._initAnnouncementList(this.selectedTab)
    },
    methods: {
      _initAnnouncementList: function (type) {
        this.loadingText = true
        this.isLoadMoreData = false
        sAjax({
          url: '/api/announcement/list/20',
          type: 'get',
          data: {
            page: this.pageIndex[type],
            size: this.pageSize,
            type: type
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
                this.announcementArr[type].push(ele)
              })
              if (this.announcementArr[type].length > this.pageSize) {
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
      _viewAnnounce: function (announce) {
        this.$emit('addBread', {
          route: '/announcement/MAnnouncementDetail?id=' + announce.announcementId,
          title: ''
        })
      },
      tabClick: function (obj) {
        this.selectedTab = obj.type
        if (this.announcementArr[this.selectedTab].length === 0) {
          this._initAnnouncementList(this.selectedTab, true)
        }
      }
    },
    mounted: function () {
      this.$pullUpToLoad({
        container: '.announcement-content',
        up: {
          callback: () => {
            if (this.isLoadMoreData) {
              this.pageIndex[this.selectedTab]++
              this._initAnnouncementList(this.selectedTab)
            }
          }
        }
      })
    }
  }
</script>
<style lang="less">
#announcement {
  .announcement-header {
    background: #455a64;
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.12), 0 4px 4px 0 rgba(0, 0, 0, 0.12);
    height: 56px;
    z-index: 100;
    padding: 0;
    .vux-header-title-area {
      height: 56px;
      overflow: initial;
      margin: -1px 0 0;
      .overwrite-title-demo {
        height: 56px;
        .announcement-tabbar {
          height: 56px;
          margin-top: -1px;
          .vux-tab-container {
            height: 56px;
            .vux-tab {
              height: 54px;
              .announcement-tab {
                font-size: 12px;
                background: #455a64;
                padding-top: 4px;
                color: rgba(255, 255, 255, 0.7);
                &.vux-tab-selected {
                  color: #ffffff;
                }
              }
              .vux-tab-ink-bar {
                background-color: #ffffff;
                height: 2px !important;
                margin-top: -1px;
              }
            }
          }
        }
      }
    }
  }
  .announcement-content {
    position: absolute;
    top: 56px;
    bottom: 60px;
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
  .announcement-container {
    overflow: auto;
    .announcement-group {
      .weui-cells {
        margin-top: 0;
        &:before {
          border-top: 0px solid #ffffff;
        }
        .announcement-cell {
          padding: 8px 0;
          .announcement-badge {
            position: absolute;
            left: 0;
            font-size: 12px;
            color: rgba(0, 0, 0, 0.54);
            line-height: 12px;
            background: rgba(0, 0, 0, 0.08);
            height: auto;
            padding: 7px 12px;
            font-weight: bold;
            border-radius: 100px;
            margin-top: -17px;
            margin-left: 16px;
          }
          .vux-cell-bd {
            margin-left: 94px;
          }
          p {
            margin-bottom: -4px;
          }
          .vux-label {
            color: rgba(0, 0, 0, 0.67);
            line-height: 13px;
            font-size: 13px;
          }
          .vux-label-desc {
            font-size: 12px;
            color: rgba(0, 0, 0, 0.36);
            line-height: 12px;
          }
        }
      }
    }
  }
}
</style>
