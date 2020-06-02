<template>
  <div id="secondClassRoom">
    <view-box>
      <x-header :title="isShowBoxShadow" class="activityList-header" :style="{'box-shadow' : isShowBoxShadow ? '0 0 4px 0 rgba(0,0,0,0.12), 0 4px 4px 0 rgba(0,0,0,0.12)' : 'none'}">
        <x-button slot="overwrite-left" class="publish-activity-btn" @click.native="_publishActivity">发起</x-button>
        <div class="activityList-search" slot="overwrite-title" @click="_searchActivity">
          <i  class="maticon" v-html="icons('search')">search</i>
        </div>
        <span slot="right" class="activityList-header-opt">
          <i class="maticon filter-icon" v-html="icons('filter_list')" @click="_filterActivity">filter_list</i>
          <!-- <i class="maticon organization-icon" v-html="icons('people')"  @click="_organizationManagePage">people</i> -->
          <i class="maticon organization-icon" v-html="icons('more_vert')"  @click="showOptions = true;">people</i>
          <span class="tips-point" v-if="isShowPoint"></span>
        </span>
      </x-header>
      <div class="tab-wrap">
        <!-- <tab :scroll-threshold="4" default-color="#606266">
          <tab-item 
            v-for="(item, index) in tabList" 
            :key="index"
            :selected="index === currentTabIdx"
            @on-item-click="onItemClick"
          >{{item.typeName}}</tab-item>
        </tab> -->
        <div class="m-tab">
          <div class="m-tabbar"
          >
            <div
              v-for="(item, index) in tabList" 
              class="m-item-wrap"  
              :key="index" 
              @click="onItemClick(index)"
            >
              <div 
                class="m-item" 
                :class="{'m-tab-active' : currentTabIdx==index}"
              >{{item.typeName}}</div>
            </div>
          </div>
        </div>
      </div>
      <div v-transfer-dom>
        <actionsheet :menus="menuOptions" v-model="showOptions" show-cancel @on-click-menu="_menuClick"></actionsheet>
      </div>
      <div v-transfer-dom>
        <popup class="popup-filter" v-model="showFilter" height="100%" is-transparent>
          <group class="popup-filter-header">
            <cell>
              <span slot="icon" @click="showFilter = false"><i class="maticon" v-html="icons('navigate_before')"></i></span>
              <p><span class="filter-opt" @click="_search('reset')">还原</span><span class="filter-opt sure" @click="_search">确定</span></p>
            </cell>
          </group>
          <div class="popup-filter-body" @click.native="showFilter = false">
            <group class="filter-group">
              <radio title="title" :options="pageStatus.pageOptions['sort']" v-model="filterData['sort']"></radio>
            </group>
            <group class="filter-group">
              <datetime
                v-model="filterData['startTime']"
                :title="'活动时间开始时间'">
              </datetime>
              <datetime
                v-model="filterData['endTime']"
                :title="'活动时间结束时间'">
              </datetime>
            </group>
            <group class="filter-group">
              <checklist :options="activityStatusList||[]" v-model="filterData['status']"></checklist>
            </group>
            <group class="filter-group">
              <checklist :options="pageStatus.pageOptions['activityType']||[]" v-model="filterData['content_type_id']"></checklist>
            </group>
            <group class="filter-group">
              <checklist :options="pageStatus.pageOptions['activityCategory']||[]" v-model="filterData['type_id']"></checklist>
            </group>
          </div>
        </popup>
      </div>
      <div id="listOfActivity" class="activityList-content">
        <div v-if="activityListData.length > 0">
          <div v-for="(item, itemIndex) in activityListData" :key="itemIndex" @click="_checkDetail(item)">
            <activity-list :activityItem="item" :creatAjax="creatAjax"></activity-list>
          </div>
          <div class="noMoreData" v-if="loadingText">—— 加载中 ——</div>
          <div class="noMoreData" v-if="!isLoadMoreData&&isShowNoMoreDataTips">—— 没有更多数据了 ——</div>
        </div>
        <div class="nodataText" v-else-if="noDataTips">
          <div class="empty">
            <img :src="require('../../../static/image/pic_err_none@2x.png')" alt="">
            <p>暂无活动</p>
          </div>
        </div>
      </div>
    </view-box>
  </div>
</template>
<script>
  import { sAjax, translation } from '../../assets/utils/utils.js'
  import ActivityList from './components/activityList'
  export default {
    props: {
      data: {
        default: ''
      }
    },
    components: {
      ActivityList
    },
    data: function () {
      return {
        showOptions: false,
        menuOptions: {org: '我的组织', his: '历史活动'},
        activityListData: [],
        creatAjax: null,
        pageIndex: 0,
        pageSize: 10,
        isLoadMoreData: false,
        loadingText: false,
        showFilter: false,
        filterData: {},
        timer: null,
        activityStatusList: [{
          key: 'BEFORE_APPLY_START',
          value: '报名未开始'
        }, {
          key: 'APPLY_ING',
          value: '报名进行中'
        // }, {
        //   key: 'AFTER_APPLY_END',
        //   value: '报名已结束'
        }, {
          key: 'BEFORE_ACTIVITY_START',
          value: '活动未开始'
        }, {
          key: 'ACTIVITY_ING',
          value: '活动进行中'
        }, 
        // {
        //   key: 'AFTER_ACTIVITY_END',
        //   value: '活动已结束'
        // }
        ],
        pageStatus: {
          pageOptions: {
            sort: [{
              key: 'HEAT_SCORE',
              value: '按热度排序'
            }, {
              key: 'PUBLISH_TIME',
              value: '按时间排序'
            }]
          }
        },
        noDataTips: '',
        isShowBoxShadow: false,
        isShowNoMoreDataTips: false,
        tabList: [
          {typeName: "全部", id: 0}
        ],
        currentTabIdx: 0,
      }
    },
    created: function () {
      var that = this
      this.initTab()
      //活动简介长度没限制（超出部分...）
      this._initActivityList({
        page: this.pageIndex,
        size: this.pageSize
      })
      this._getActivityTypes()
      this._getContentTypes()
    },
    methods: {
      _search: function (type) {
        this.showFilter = false
        if (type === 'reset') {
          this.filterData = {}
        }
        this.pageIndex = 0
        var data = JSON.parse(JSON.stringify(this.filterData))
        data.size = this.pageSize
        data.page = this.pageIndex
        this.activityListData = []
        this._initActivityList(data)
      },
      _checkDetail: function (item) {
        this.$emit('addBread', {
          route: '/activity/MActivityDetail',
          title: item.name,
          data: item
        })
      },
      onItemClick(tabIdx) {
        this.pageIndex = 0
        this.currentTabIdx = tabIdx
        this.filterData = {}
        var data = {}
        data.size = this.pageSize
        data.page = this.pageIndex
        this.filterData.type_id = []
        if (tabIdx != 0) {
          data.type_id = this.tabList[tabIdx].id
          this.filterData.type_id.push(data.type_id)
        }
        this.activityListData = []
        this._initActivityList(data)
      },
      initTab() {
        sAjax({
          url: '/api/sc/activityContentType/selectOptions',
          type: 'get',
          success: (data) => {
            if (data.state) {
              if (data.data) {
                this.tabList = data.data
              }
            } else {
              this._toast(data.message)
            }
          }
        })
      },
      _initActivityList: function (param) {
        this.loadingText = true
        this.isLoadMoreData = false// 防止多次拖拽请求
        if(!param.status || param.status.length==0) {
          param.status = ['APPLY_ING']
        }
        // param.status = param.status || 'APPLY_ING'
        this.creatAjax = sAjax({
          url: '/api/sc/activities/pages',
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
                ele.isCollect = false
                this.activityListData.push(ele)
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
      _publishActivity: function () {
        sAjax({
          url: '/api/sc/organizations/list/join',
          type: 'get',
          success: (data) => {
            if (data.state) {
              if (data.data && data.data.length > 0) {
                this.$emit('addBread', {
                  route: '/activity/MPublishActivity',
                  title: '',
                  data: {
                    publishers: data.data
                  }
                })
              } else {
                this.$vux.alert.show({
                  title: '您尚未加入任何组织，快去加入吧！'
                })
              }
            } else {
              this._toast('发布权限检测失败，请稍后重试')
            }
          }
        })
      },
      _searchActivity: function () {
        this.$emit('addBread', {
          route: '/activity/MActivitySearch',
          title: ''
        })

      },
      _filterActivity: function () {
        this.showFilter = true
        // this.$emit('addBread', {
        //   route: '/activity/MPublishActivity',
        //   title: ''
        // })
      },
      _organizationManagePage: function () {
        sAjax({
          url: '/api/sc/organizations/list/join-audit',
          type: 'get',
          success: (data) => {
            if (data.state) {
              this.$forceUpdate()
              if (data.data.length === 0) {
                this.$emit('addBread', {
                  route: '/organization/MOrganizationSearch',
                  title: ''
                })
              } else {
                this.$emit('addBread', {
                  route: '/organization/MOrganizationManage',
                  title: ''
                })
              }
            } else {
              this._toast(data.message)
            }
          }
        })
      },
      _history: function () {
        this.$emit('addBread', {
          route: '/activity/MActivityHistory',
          title: ''
        })
      },
      _toast: function (msg) {
        this.$vux.toast.show({
          text: msg,
          position: 'bottom',
          type: 'text'
        })
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
      },
      _getContentTypes: function () {
        sAjax({
          url: '/api/sc/activityContentType',
          type: 'get',
          success: (data) => {
            if (data.state) {
              if (!this.pageStatus.pageOptions['activityType']) {
                this.$set(this.pageStatus.pageOptions, 'activityType', [])
              }
              if (data.data) {
                data.data.forEach((type) => {
                  // var item = {
                  //   key: type.id + '',
                  //   value: type.typeName,
                  //   parent: 0
                  // }
                  // this.pageStatus.pageOptions['activityType'].push(item)
                  type.childType && type.childType.forEach((typeChild) => {
                    var item2 = {
                      key: typeChild.id + '',
                      value: typeChild.typeName,
                      parent: type.id + ''
                    }
                    this.pageStatus.pageOptions['activityType'].push(item2)
                  })
                })
              }
            } else {
              this._toast(data.message)
            }
          }
        })
      },
      _getActivityTypes: function () {
        sAjax({
          url: '/api/sc/activities/types',
          type: 'get',
          success: (data) => {
            if (data.state) {
              if (!this.pageStatus.pageOptions['activityCategory']) {
                this.$set(this.pageStatus.pageOptions, 'activityCategory', [])
              }
              if (data.data) {
                data.data.forEach((cat) => {
                  var item = {
                    key: cat.id,
                    value: cat.name
                  }
                  this.pageStatus.pageOptions['activityCategory'].push(item)
                })
              }
            } else {
              this._toast(data.message)
            }
          }
        })
      },
      _menuClick(val) {
        // this.showOptions = false
        if(val == 'org') {
          this._organizationManagePage()
        } else if (val == 'his') {
          this._history()
        }
      }
    },
    watch: {
      filterData: {
        deep: true,
        handler: function (obj) {
          // if (this.timer) {
          //   clearTimeout(this.timer)
          // }
          // this.timer = setTimeout(() => {
          //   this.pageIndex = 0
          //   var data = JSON.parse(JSON.stringify(obj))
          //   data.size = this.pageSize
          //   data.page = this.pageIndex
          //   this._initActivityList(data)
          // }, 600)
        }
      }
    },
    mounted: function () {
      this.$pullUpToLoad({
        container: '.activityList-content',
        down: {
          height: 200,
          callback: () => {
            this.pageIndex = 0 
            var data = JSON.parse(JSON.stringify(this.filterData))
            data.size = this.pageSize
            data.page = this.pageIndex
            this.activityListData = []
            this._initActivityList(data)
          }
        },
        up: {
          callback: () => {
            if (this.isLoadMoreData) {
              this.pageIndex++ 
              var data = JSON.parse(JSON.stringify(this.filterData))
              data.size = this.pageSize
              data.page = this.pageIndex
              this._initActivityList(data)
            }
          }
        }
      })
      var that = this
      $(".activityList-content").on('scroll', function () {
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
.popup-filter {
  * {
    font-weight: 500;
  }
  .popup-filter-header {
    position: absolute;
    top: 16px;
    left: 16px;
    right: 16px;
    // margin: 16px 16px 0;
    .weui-cells {
      background: #ffffff;
      box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.12), 0 4px 4px 0 rgba(0, 0, 0, 0.12);
      border-radius: 8px;
    }
    .weui-cell {
      padding-bottom: 7px;
    }
    .filter-opt {
      font-size: 13px;
      color: rgba(0, 0, 0, 0.4);
      letter-spacing: 0;
      line-height: 28px;
      &.sure {
        margin-left: 18px;
        color: #448aff;
      }
    }
  }
  .popup-filter-body {
    position: absolute;
    top: 80px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
    padding: 0 16px;
    .filter-group > .weui-cells {
      margin-bottom: 16px;
      background: #ffffff;
      box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.12), 0 4px 4px 0 rgba(0, 0, 0, 0.12);
      border-radius: 8px;
      .weui-check_label,
      .vux-radio-label,
      .weui-cell_access {
        font-size: 13px;
        color: rgba(0, 0, 0, 0.77);
        letter-spacing: 0;
        text-decoration: none;
      }
    }
  }
}
#secondClassRoom {
  .noMoreData {
    font-size: 12px;
    color: #909399;
    font-weight:400;
  }
  .icon {
    flex: 0 0 12px;
    // width: 11px;
    height: 12px;
    padding-right: 8px;
  }
  .set-text-right {
    text-align: right;
  }
  .activityList-header {
    height: 64px;
    background: #ffffff;
    .vux-header-left {
      left: 16px;
      top: 16px;
      .publish-activity-btn {
        font-size: 12px;
        color: #ffffff;
        line-height: 12px;
        background: #448aff;
        border-radius: 100px;
        padding: 10px 12px;
        &:after {
          border: 0 solid #ffffff;
        }
      }
    }
    .vux-header-title-area {
      margin: 13px 94px 0 89px;
      .activityList-search {
        background: #f5f5f5;
        border-radius: 100px;
        height: 32px;
        i {
          font-size: 16px;
          color: rgba(0, 0, 0, 0.24);
          margin: 8px 12px;
        }
      }
    }
    .activityList-header-opt {
      margin-right: -4px;
      display: inline-block;
      .filter-icon {
        font-size: 24px;
        color: rgba(0, 0, 0, 0.54);
        padding: 5px;
      }
      .organization-icon {
        font-size: 24px;
        color: rgba(0, 0, 0, 0.87);
        padding: 5px;
      }
      .tips-point {
        background: #448aff;
        border-radius: 100px;
        height: 6px;
        width: 6px;
        position: absolute;
        right: 0;
        top: 6px;
      }
    }
  }
  .activityList-content {
    position: absolute;
    top: 104px;
    bottom: 50px;
    left: 0;
    right: 0;
    overflow: auto;
    background: #f4f5f7;
  }
}
#secondClassRoom {
  .vux-tab-container {
    height: 40px;
  }
  .vux-tab {
    height: 40px;
  }
  .vux-tab-wrap {
    padding-top: 40px;
    z-index: 12;
  }
  .vux-tab .vux-tab-item.vux-tab-selected {
    border: none !important;
    color:#303133 !important;
    font-size: .506667rem;
    font-weight:500;
    position: relative;
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      margin-left: -.293333rem;
      width:.586667rem;
      height:.106667rem;
      border: none;
      color:rgba(40,161,255,1) !important;
      background:rgba(40,161,255,1) !important;
      box-shadow:0px 2px 5px 0px rgba(40,161,255,0.4);
      border-radius:.106667rem;

    }
  }
  .vux-tab .vux-tab-item {
    background: none;
    line-height: 40px;
    font-size: .453333rem;
    font-weight:400;
  }
  .vux-tab-ink-bar {
    background: transparent;
  }


  .m-tab {
    position: sticky;
    width: 100%;
    // top: 44px;
    // margin-top: 44px;
    /* height: 180rpx; */
    background: #fff;
    /* padding-top: 20rpx; */
    display: flex;
    flex-direction: column;
    z-index: 10;
    overflow-x: scroll;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  /* 选项卡样式 */
  .m-tabbar {

    display: flex;
    flex-direction: row;
    height: 40px;
    line-height: 40px;
    background: #fff;
    text-align: center;
    /* padding: 0 0 0 30rpx; */
    white-space: nowrap;
    /* border-bottom: 1rpx solid #f0f0f0; */
    .m-item-wrap{
      position: relative;
      flex:1;
    }
    .m-item {
      flex: 1;
      position: relative;
      /* margin: 0 32rpx;
      text-align: center;
      height: 60rpx;
      line-height: 50rpx; */
      color: #909090;
      font-size: 18px;
      padding: 0 15px;
      font-weight: 400;
      background: #fff;
      max-width: 170px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .m-item.m-tab-active {
      max-width: 100% !important;
      font-size: 19px;
      color: #303133 ;
      font-weight: 500; 
      transition: color .3s;
      /* transition: font-size .3s; */
    }

    .m-item.m-tab-active:after {
      content: "";
      display: block;
      text-align: center;
      position: absolute;
      bottom: 0;
      left: 50%;
      margin-left: -11px;
      width: 22px;
      height: 4px;
      background:rgba(40,161,255,1);
      box-shadow:0px 1px 3px 0px rgba(40,161,255,0.4);
      border-radius:2px;
      transition: width .3s;
    }
  }
  .empty {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #606266;
    font-size: 13px;
    position: relative;
    img {
      width: 5.333333rem;
      height: 4rem;
      margin: 1.173333rem 0 1.52rem;
    }
    p {
      bottom: 20px;
      position: absolute;
    }
  }
}
</style>
