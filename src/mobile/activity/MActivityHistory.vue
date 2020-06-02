<template>
  <div id="activityHistory">
      <x-header :title="isShowBoxShadow" class="activityList-header" :style="{'box-shadow' : isShowBoxShadow ? '0 0 4px 0 rgba(0,0,0,0.12), 0 4px 4px 0 rgba(0,0,0,0.12)' : 'none'}">
        <i slot="overwrite-left" class="maticon back-icon" v-html="icons('navigate_before')" @click="_back">navigate_before</i>
        <!-- <div class="activityList-search" slot="overwrite-title" @click="_searchActivity">
          <i  class="maticon" v-html="icons('search')">search</i>
        </div> -->
        <div slot="overwrite-title" style="position:relative">
          <div class="search_icon"></div>
          <x-input class="header-search aavv" 
            @on-change="_search"
            @on-submit="_search"
            :cancel-text="' '" 
            v-model="searchName" 
            position="relative" 
            auto-fixed="false"
            placeholder="请输入你想要搜索的内容" 
            :show-clear="false" 
            auto-scroll-to-top top="0" ref="search">
            <!-- <slot name='right'>取消</slot> -->
          </x-input>
        </div>
        <span slot="right" class="activityList-header-opt">
          <i class="maticon filter-icon" v-html="icons('filter_list')" @click="_filterActivity">filter_list</i>
          <span class="tips-point" v-if="isShowPoint"></span>
        </span>
      </x-header>
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
            <!-- <group class="filter-group">
              <checklist :options="activityStatusList||[]" v-model="filterData['status']"></checklist>
            </group> -->
            <group class="filter-group">
              <checklist :options="pageStatus.pageOptions['activityType']||[]" v-model="filterData['content_type_id']"></checklist>
            </group>
            <group class="filter-group">
              <checklist :options="pageStatus.pageOptions['activityCategory']||[]" v-model="filterData['type_id']"></checklist>
            </group>
          </div>
        </popup>
      </div>
      <div id="listOfActivity1" class="activityList-content1">
        <div v-if="activityListData.length > 0">
          <div v-for="(item, itemIndex) in activityListData" :key="itemIndex" @click="_checkDetail(item)">
            <activity-list :activityItem="item" :creatAjax="creatAjax"></activity-list>
            <!-- <div class="activity-positive-card">
              <div class="collect" @click.stop="_collect(item)">
                <img :src="require(`../../../mobile_static/image/icon_heart_${item.isCollect?'choosed':'default'}_b.png`)" alt="">
              </div>
              <div class="activity-type set-text-right" title="">{{item.typeName}}</div>
              <div class="cover-wrap">
                <x-img v-if="item.images.length>0&&item.images[0].isCover" class="activity-cover" :src="imageUrlPrefix + item.images[0].image + '?thumb=true'" container="#listOfActivity1"></x-img>
                <div class="activity-time">{{_getActivityTimeStatus(item)}}</div>
              </div>
              <flexbox class="cnt-wrap" orient="vertical">
                <flexbox-item>
                  <div class="activity-title" title="">{{item.name}}</div>
                  <div class="activity-tag">{{item.contentTypeParentName}}</div>
                </flexbox-item>
                <flexbox-item class="box_flex mb0">
                  <div class="activity-info" v-if="item.teacherName"><img class="icon" :src="require('../../../mobile_static/image/icon_teacher.png')" alt="">{{item.teacherName}}</div>
                  <div class="activity-info" v-if="item.classTime"><img class="icon" :src="require('../../../mobile_static/image/icon_time.png')" alt="">{{item.classTime}}</div>
                </flexbox-item>
                <flexbox-item class="box_flex mb0">
                  <div class="activity-info" v-if="item.studentOriented&&item.studentOriented.length>0"><img class="icon" :src="require('../../../mobile_static/image/icon_number.png')" alt="">{{item.studentOriented.length>1?item.studentOriented[0].name+'等':item.studentOriented[0].name}}</div>
                  <div class="activity-info" v-else-if="item.grade&&item.grade.length>0"><img class="icon" :src="require('../../../mobile_static/image/icon_number.png')" alt="">{{item.grade.length>1?item.grade[0]+'级等':item.grade[0]+'等'}}</div>
                  <div class="activity-info" v-else><img class="icon" :src="require('../../../mobile_static/image/icon_number.png')" alt="">面向全体</div>
                  <div class="activity-info"><img class="icon" :src="require('../../../mobile_static/image/icon_location.png')" alt="">{{item.place}}</div>
                </flexbox-item>
              </flexbox>
            </div> -->
          </div>
          <div class="noMoreData" v-if="loadingText">---加载中---</div>
          <div class="noMoreData" v-if="!isLoadMoreData&&isShowNoMoreDataTips">---没有更多数据了---</div>
        </div>
        <div class="nodataText" v-else>{{noDataTips}}</div>
      </div>
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
        searchName: '',
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
        }, {
          key: 'AFTER_ACTIVITY_END',
          value: '活动已结束'
        }],
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
        isShowNoMoreDataTips: false
      }
    },
    created: function () {
      var that = this
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
          this.searchName = ''
        }
        this.pageIndex = 0
        var data = JSON.parse(JSON.stringify(this.filterData))
        data.name = this.searchName
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
      _back: function () {
        this.$emit('removeBread', this.data)
      },
      _initActivityList: function (param) {
        this.loadingText = true
        this.isLoadMoreData = false// 防止多次拖拽请求
        param.status = 'AFTER_ACTIVITY_END'
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
              data.data.content.forEach((ele, index) => {
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
      _collect: function (e) {
        var url = ''
        if (!e.isCollect) {
          url = `/api/sc/activitySocializations/createCollection`
        } else {
          url = `/api/sc/activitySocializations/cancelCollection`
        }
        sAjax({
          url: url,
          type: 'post',
          data: {
            id: e.id
          },
          success: (data) => {
            if (data.state) {
              this.$toast(`${e.isCollect?'取消收藏':'收藏成功'}`)
              e.isCollect = !e.isCollect
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
        container: '.activityList-content1',
        down: {
          height: 200,
          callback: () => {
            this.pageIndex = 0
            this.activityListData = []
            this._initActivityList({
              page: this.pageIndex,
              size: this.pageSize
            })
          }
        },
        up: {
          callback: () => {
            if (this.isLoadMoreData) {
              this.pageIndex++
              this._initActivityList({
                page: this.pageIndex,
                size: this.pageSize
              })
            }
          }
        }
      })
      var that = this
      $(".activityList-content1").on('scroll', function () {
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
      &::before {
        border: none;
      }
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
#activityHistory {
  .noMoreData {
    font-size: 12px;
    color: #909399;
    font-weight:400;
  }
  .vux-header .vux-header-title {
    height: 60px;
    margin: 0 60px;
    // overflow: auto;
  }
  .search_icon {
    position: absolute;
    height: 0.3733rem;
    width: 0.3733rem;
    left: 8px;
    top: 8px;
    z-index: 14;
    background-image: url("../../../mobile_static/image/shouye_sousuo.png");
    background-size: 100% 100%;
  }
  .weui-search-bar__box {
    padding: 0;
  }
  .vux-x-input.weui-cell  {
    padding: 0 10px 0 20px;
  }
  .weui-cell {
    &::before {
      border: none;
    }
  }
  .header-search  {
    border: none;
    height: 0.8rem;
    // width: 80%;
    padding-left: 0.72rem;
    text-align: left;
    font-size: 14px;
    // margin-top: 0.4rem;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(144, 147, 153, 1);
    background: #f4f5f7;
    // box-shadow: 0rem 0.08rem 0.1733rem 0rem rgba(192, 196, 204, 0.22);
    border-radius: 0.52rem;
  }
  .icon {
    flex: 0 0 12px;
    // width: 22px;
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
      margin: 13px 80px 0 80px;
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
  .activityList-content1 {
    position: absolute;
    top: 69px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    background: #f4f5f7;
  }
}
</style>
