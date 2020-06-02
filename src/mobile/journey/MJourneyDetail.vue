<!--  -->
<template>
  <div class="journeyDetail">
    <view-box>
      <x-header class="journey-header" title="行程详情">
        <i slot="overwrite-left" class="maticon back-icon" v-html="icons('navigate_before')" @click="_back">navigate_before</i>
      </x-header>
      <div class="detail-body">
        <div class="route-detail-top">
          <!-- <div class="title">行程详情</div> -->
          <div class="status-img">
            <img v-if="info.status == 'NO'" src="../../../mobile_static/image/fail@2x.png" alt="未通过">
            <img v-else-if="info.status == 'WAIT'" src="../../../mobile_static/image/going@2x.png" alt="审核中">
            <img v-else src="../../../mobile_static/image/success@2x.png" alt="通过">
          </div>
          <div class="detail-cnt">
            <div class="row" v-for="(item, index) in paramsInfo" :key="index">
              <span class="name">{{item.title}}</span>
              <span class="cnt">{{info[item.name]}}</span>
            </div>
            <div class="look-all" @click="lookAllDetail">
              <span>查看全部</span>
              <div class="arrow-right"></div>
            </div>
          </div>
        </div>
        <!-- 审批过程 -->
        <div class="apply-list">
          <div class="apply-item">
            <div class="dot"></div>
            <div class="apply-wrap">
              <div class="apply-info">
                <span class="apply-title">发起申请</span>
                <span class="apply-date">{{info.updateTime || ''}}</span>
              </div>
              <div class="apply-detail">我</div>
            </div>
          </div>
          <div class="apply-item" v-if="info.status !== 'WAIT'">
            <div class="dot"></div>
            <div class="apply-wrap">
              <div class="apply-info">
                <span class="apply-title">审核人</span>
                <span class="apply-date">{{info.checkTime}}</span>
              </div>
              <div v-if="info.status == 'NO'" class="apply-detail">{{info.checkName}}(已驳回)</div>
              <div v-else class="apply-detail">{{info.checkName}}(已同意)</div>
              <div v-if="info.status == 'NO'" class="apply-detail">驳回理由：{{info.reason}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="footer" v-if="info.status == 'NO'">
        <!-- <x-button class="btn btn-line" @click.native="_back">返回</x-button> -->
        <x-button class="btn btn-bg" @click.native="toEdit">编辑</x-button>
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
        id: null,
        status: 'fail',
        paramsInfo: [{
            title: '年份',
            name: 'year'
          },
          {
            title: '省份',
            name: 'province'
          },
          {
            title: '地区',
            name: 'provinceSecond'
          },
          {
            title: '时间',
            name: 'submitTime'
          },
          {
            title: '学年',
            name: 'studyYear'
          },
          {
            title: '活动类别',
            name: 'activityType'
          },
          {
            title: '活动性质',
            name: 'activityNature'
          }, {
            title: '中学/咨询会',
            name: 'middleConsult'
          },
        ],
        info: {},
        applyList: [],
        pageIndex: 0,
        pageSize: 20
      }
    },
    created() {
      this.info = this.data.journeyObj;
      
    },
    mounted() {

    },
    methods: {
      _back: function() {
        this.data.isUpdateLastPage = true
        this.$emit('removeBread', this.data)
      },
      toEdit() {
        this.$emit('addBread', {
          route: '/journey/createJourney',
          title: '',
          journeyObj: this.info,
          type: 'edit'
        })
      },
      lookAllDetail() {
        this.$emit('addBread', {
          route: '/journey/createJourney',
          title: '',
          journeyObj: this.info,
          type: 'check'
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
  }
</script>

<style lang="less">
  .journeyDetail {
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
    .detail-body {
      position: absolute;
      // top: 0;
      top: 56px;
      bottom: 0;
      right: 0;
      left: 0;
      padding-bottom: 58px;
      overflow-y: auto;
      overflow-x: hidden;
      box-sizing: border-box;
    }
    .route-detail-top {
      background-color: #fff;
      margin-bottom: 10px;
      .title {
        height: 50px;
        line-height: 50px;
        border-bottom: 1px solid #CCCCD0;
        padding-left: 15px;
        font-size: 15px;
        font-family: 'PingFangSC-Medium';
        font-weight: 500;
        color: #000;
      }
      .status-img {
        position: absolute;
        top: 78px;
        right: 14px;
        img {
          width: 111px;
          height: 86px;
        }
      }
      .detail-cnt {
        padding: 10px 0;
        .row {
          font-size: 14px;
          padding: 0 20px;
          margin-bottom: 6px;
          .name {
            display: inline-block;
            width: 80px;
            margin-right: 10px;
            color: #999;
            text-align: right;
          }
          .cnt {
            color: #333;
          }
        }
        .look-all {
          padding: 4px 20px;
          color: #333;
          font-size: 14px;
        }
      }
    }
    .apply-list {
      background-color: #fff;
      .apply-item {
        padding: 10px 15px;
        border-bottom: 1px solid #CCCCD0;
        display: flex;
        .dot {
          flex: 0 0 12px;
          width: 12px;
          height: 12px;
          border-radius: 12px;
          background: rgba(60, 155, 255, 1);
          margin-top: 4px;
        }
        .apply-wrap {
          width: 100%;
          margin-left: 15px;
        }
        .apply-info {
          width: 100%;
          display: flex;
          justify-content: space-between;
          .apply-title {
            font-size: 14px;
            font-weight: 500;
            color: rgba(51, 51, 51, 1);
          }
          .apply-date {
            font-size: 12px;
            font-weight: 400;
            color: rgba(102, 102, 102, 1);
          }
        }
        .apply-detail {
          font-size: 14px;
          color: #666;
          line-height: 30px;
        }
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
      z-index: 1;
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
    .arrow-right {
      padding-right: 26px;
      position: relative;
    }
    .arrow-right:after {
      content: " ";
      display: inline-block;
      height: 8px;
      width: 8px;
      border-width: 2px 2px 0 0;
      border-color: #bbb;
      border-style: solid;
      transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
      position: absolute;
      top: 0;
      margin-top: -8px;
      right: 0;
    }
  }
</style>
