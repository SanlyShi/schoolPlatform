<!--  -->
<template>
  <div id="journeyList" class="journeyList">
    <view-box>
      <x-header class="journey-header" title="行程安排">
        <i slot="overwrite-left"></i>
      </x-header>
      <div class="enroll-route-list">
        <flexbox v-for="(item, index) in journeyList" :key="index" orient="vertical" class="enroll-route-item" @click.native="toDetail(item)">
          <flexbox-item>
            <flexbox>
              <flexbox-item class="title" :span="9">{{item.activityNature}}</flexbox-item>
              <flexbox-item class="date">{{item.updateTime}}</flexbox-item>
            </flexbox>
          </flexbox-item>
          <flexbox-item class="row">
            <label>省份：</label><span>{{item.province}}</span>
          </flexbox-item>
          <flexbox-item class="row">
            <label>活动类别：</label><span>{{item.activityType}}</span>
          </flexbox-item>
          <flexbox style="margin-top: 8px;">
            <flexbox-item class="row" :span="9"><label>时间：</label><span>{{item.submitTime}}</span></flexbox-item>
            <flexbox-item class="date">
              <span class="going" v-if="item.status == 'WAIT'">审批中</span>
              <span class="fail" v-else-if="item.status == 'NO'">审批未通过</span>
              <span class="success" v-else>审批通过</span>
            </flexbox-item>
          </flexbox>
          <flexbox-item>
  
          </flexbox-item>
        </flexbox>
        <div v-if="loadingText" class="no-more">
          <span class="line"></span>
          <span>加载中</span>
          <span class="line"></span>
        </div>
        <div v-if="!isLoadMoreData&&isShowNoMoreDataTips" class="no-more">
          <span class="line"></span>
          <span>暂无更多日程</span>
          <span class="line"></span>
        </div>
      </div>
      <div class="footer">
        <x-button class="btn btn-line" @click.native="_logout">退出登录</x-button>
        <x-button class="btn btn-line" @click.native="showPop = true">筛选</x-button>
        <x-button class="btn btn-bg" @click.native="_addRoute">新建行程</x-button>
      </div>
      <div class="popup" v-show="showPop" @on-hide="showPop = false">
        <div class="pop-mask" @click="showPop = false"></div>
        <div class="popup-filter-wrap">
          <div class="popup-filter-header">
            <span>筛选条件</span>
            <button @click="search">完成</button>
          </div>
          <div class="popup-filter-body">
            <group gutter="0">
              <popup-picker title="省份" show-name :data="areaList" v-model="searchParam.province"></popup-picker>
              <popup-picker title="活动类别" show-name :data="activityTypeList" v-model="searchParam.activityType"></popup-picker>
              <cell title="活动性质" is-link :border-intent="false" :arrow-direction="showActivityCnt ? 'up' : 'down'" @click.native="showActivityCnt = !showActivityCnt"></cell>
              <div class="slide activity-cnt" :class="showActivityCnt?'animate':''">
                <div class="activity-item" :class="activityNatureIdx==index?'on':''" v-for="(item, index) in activityNatureList" :key="index" @click="_selectNature(index)">{{item.name}}</div>
              </div>
              <div class="pop-ft-btn">
                <x-button class="btn btn-bg" @click.native="_reset">重置</x-button>
                <x-button class="btn btn-line" @click.native="showPop = false">取消</x-button>
              </div>
            </group>
          </div>
        </div>
      </div>
    </view-box>
  </div>
</template>

<script>
  import {
    sAjax
  } from '../../assets/utils/utils';
  export default {
    props: {
      data: {
        default: null
      }
    },
    data() {
      return {
        showPop: false,
        showActivityCnt: false,
        // cells: [{
        //   title: '讲座题目',
        //   name: 'lectureName',
        //   type: 'input',
        //   placeholder: '无讲座填写“无”'
        // }, {
        //   title: '专家姓名',
        //   name: 'expertsName',
        //   type: 'input',
        //   placeholder: '无讲座填写“无”'
        // }, ],
        searchParam: {
          province: [],
          activityType: [],
          activityNature: [],
        },
        areaList: [],
        activityTypeList: [],
        activityNatureList: [],
        activityNatureIdx: -1,
  
        journeyList: [],
        loadingText: false,
        isLoadMoreData: false,
        isShowNoMoreDataTips: false,
        pageIndex: 0,
        pageSize: 20,
        totla: 0,
      };
    },
    computed: {
      update() {
        return this.$attrs.update
      },
    },
    watch: {
      update() {
        // 监听update字段，回到当页，刷新界面
        this.pageIndex = 0
        this.journeyList = []
        this._initJourneyList({
          page: this.pageIndex,
          size: this.pageSize
        })
      }
    },
    created() {
      this._initJourneyList({
        page: this.pageIndex,
        size: this.pageSize
      })
      this.initArea()
      this.initDict()
    },
    mounted() {
      this.$pullUpToLoad({
        container: '#journeyList .enroll-route-list',
        down: {
          height: 200,
          callback: () => {
            this.pageIndex = 0
            this.journeyList = []
            this._initJourneyList({
              page: this.pageIndex,
              size: this.pageSize
            })
          }
        },
        up: {
          callback: () => {
            if (this.isLoadMoreData) {
              this.pageIndex++
                this._initJourneyList({
                  page: this.pageIndex,
                  size: this.pageSize
                })
            }
          }
        }
      })
    },
    methods: {
      initArea() {
        sAjax({
          url: "/api/archives/permissions/getProvinceList",
          dataType: "json",
          type: "GET",
          success: (result) => {
            if (result.state) {
              result.data.forEach(item => {
                item.name = item.label
              })
              // this.areaList[0] = result.data
              this.$set(this, 'areaList', [result.data])
            } else {
              this.$toast(result.message)
            }
          }
        })
      },
      initDict() {
        sAjax({
          url: `/api/archives/demo/getSysDict?name=活动类别`,
          dataType: "json",
          type: "GET",
          async: false,
          success: (result) => {
            if (result.state) {
              let list = []
              if (result.data.length > 0) {
                list = result.data.map(item => {
                  return {
                    name: item.name,
                    value: item.value
                  }
                })
              }
              this.activityTypeList[0] = list
            } else {
              this._toast(`活动类别获取失败`)
            }
  
          }
        })
        sAjax({
          url: `/api/archives/demo/getSysDict?name=活动性质`,
          dataType: "json",
          type: "GET",
          async: false,
          success: (result) => {
            if (result.state) {
              let list = []
              if (result.data.length > 0) {
                list = result.data.map(item => {
                  return {
                    name: item.name,
                    value: item.value
                  }
                })
              }
              this.activityNatureList = list
            } else {
              this._toast(`活动性质获取失败`)
            }
  
          }
        })
      },
      _initJourneyList: function(param) {
        this.loadingText = true
        this.isLoadMoreData = false // 防止多次拖拽请求
        let province = this.searchParam.province[0] || ""
        let activityType = this.searchParam.activityType[0] || ""
        let activityNature = this.searchParam.activityNature || ""
        this.$waiting.show();
        sAjax({
          url: `/api/archives/trip/getOneArrange?province=${province}&activityType=${activityType}&activityNature=${activityNature}`,
          type: 'get',
          data: param,
          success: (data) => {
            this.$waiting.close();
            // console.log(data)
            if (data.state) {
              this.loadingText = false
              if (data.data.content.length > 0) {
                this.noDataTips = ''
              } else {
                this.noDataTips = '暂无相关数据'
              }
              this.total = data.data.totalElements
              data.data.content.forEach((ele) => {
                this.journeyList.push(ele)
              })
              if (this.journeyList.length >= this.total) {
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
      _back() {
        this.data.isUpdateLastPage = true
        this.$emit('removeBread', this.data)
        // this.$emit('_refresh')
      },
      _logout() {
        this.$emit('logout')
      },
      _reset() {
        this.searchParam.province = []
        this.searchParam.activityType = []
        this.searchParam.activityNature = ""
        this.activityNatureIdx = -1
      },
      _selectNature(type) {
        this.activityNatureIdx = type
        this.searchParam.activityNature = this.activityNatureList[type].value
      },
      _addRoute() {
        this.$emit('addBread', {
          route: '/journey/createJourney',
          title: '',
          type: 'add',
        })
      },
      toDetail(item) {
        this.$emit('addBread', {
          route: '/journey/journeyDetail',
          title: '',
          journeyObj: item,
        })
      },
      search() {
        this.showPop = false
        this.journeyList = []
        this._initJourneyList()
      },
      _toast: function(msg) {
        this.$vux.toast.show({
          text: msg,
          position: 'bottom',
          type: 'text'
        })
      }
    },
  };
</script>

<style lang="less">
  .journeyList {
    background-color: #efeff3 !important;
    .journey-header {
      height: 56px;
      background: #fff;
      box-shadow: 0 2px 4px 0 rgba(154, 154, 154, 0.1);
      z-index: 100;
      padding: 0;
      .back-icon {
        color: #2e2e2e;
      }
      .vux-header-title {
        font-size: 18px;
        color: #101010;
        line-height: 56px;
      }
    }
    .enroll-route-list {
      position: absolute;
      top: 56px;
      bottom: 58px;
      left: 0;
      right: 0;
      overflow: auto;
      .no-more {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 4px 0 10px;
        text-align: center;
        font-size: 10px;
        color: #868789;
        .line {
          width: 102px;
          height: 1px;
          background-color: #cbcacf;
          margin: 0 16px;
        }
      }
    }
    .enroll-route-item {
      box-sizing: border-box;
      padding: 15px;
      background-color: #fff;
      margin-bottom: 5px;
      .title {
        font-family: "PingFangSC-Medium";
        font-weight: 500;
        font-size: 15px;
        font-weight: bold;
        color: #333;
      }
      .date {
        font-size: 11px;
        color: #666;
        text-align: right;
      }
      .row {
        color: #666;
        font-size: 14px;
      }
      .success {
        color: #068B2B;
      }
      .going {
        color: #E59609;
      }
      .fail {
        color: #D73E69;
      }
    }
    .footer {
      position: fixed;
      bottom: 0;
      right: 0;
      left: 0;
      display: flex;
      height: 58px;
      align-items: center;
      background: #fff;
      box-shadow: 0px -1px 6px 0px rgba(174, 175, 179, 0.26);
      z-index: 101;
    }
    .footer, .pop-ft-btn {
      .btn {
        height: 38px;
        line-height: 1;
        border-radius: 38px;
        font-size: 14px;
      }
      .btn-line {
        flex: 1;
        margin: 0 10px;
        // height: 48px;
        background: #fff;
        color: #3C9BFF;
        border: 1px solid #0091FF;
      }
      .btn-bg {
        flex: 1;
        margin: 0 10px;
        // height: 48px;
        background: #3C9BFF;
        color: #fff;
      }
    }
    /* 筛选弹窗 */
    .popup {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      top: 0;
      z-index: 102;
      .pop-mask {
        width: 100%;
        height: 100%;
        background: #000;
        opacity: 0.5;
      }
    }
    .popup-filter-wrap {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: #fff;
      border-radius: 12px 12px 0 0;
      z-index: 102;
      height: 406px;
      .popup-filter-header {
        height: 49px;
        line-height: 49px;
        border-bottom: 1px solid #CCCCD0;
        padding: 0 20px;
        font-size: 14px;
        display: flex;
        justify-content: space-between;
        font-family: 'PingFangSC-Medium';
        font-weight: 500;
        button {
          color: #3C9BFF;
          background-color: transparent;
          outline: none;
          border: none;
        }
      }
      .activity-cnt {
        display: flex;
        flex-wrap: wrap;
        overflow-y: scroll;
      }
      .activity-item {
        height: 32px;
        line-height: 32px;
        text-align: center;
        background: rgba(241, 242, 244, 1);
        border: 1px solid rgba(241, 242, 244, 1);
        border-radius: 2px;
        font-size: 14px;
        font-family: 'PingFangSC-Regular';
        font-weight: 400;
        color: rgba(134, 135, 137, 1);
        padding: 0 10px;
        margin: 0 10px 10px 0;
        &.on {
          color: #3C9BFF;
          border: 1px solid #3C9BFF;
          background: #fff;
        }
      }
      .pop-ft-btn {
        position: fixed;
        bottom: 8px;
        left: 0;
        right: 0;
        z-index: 103;
        display: flex;

      }
    }
    .vux-cell-box:before {
      border-top: none !important;
    }
    .weui-cells,
    .weui-cell {
      &::before {
        border-top: 0px solid #ffffff;
      }
      &::after {
        border-bottom: 0px solid #ffffff;
      }
    }
    .weui-check_label,
    .vux-radio-label,
    .weui-cell_access,
    .weui-label,
    .vux-label {
      font-size: 14px;
      color: #333;
      letter-spacing: 0;
      text-decoration: none;
    }
    .slide {
      padding: 0 20px;
      overflow: hidden;
      max-height: 0;
      transition: max-height .5s cubic-bezier(0, 1, 0, 1) -.1s;
    }
    .animate {
      max-height: 180px;
      transition-timing-function: cubic-bezier(0.5, 0, 1, 0);
      transition-delay: 0s;
    }
  }
</style>
