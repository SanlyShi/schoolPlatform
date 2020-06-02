<template>
  <div id="ftsPage-page">
    <GeminiScrollbar class="main-p" :scrollX="false">
      <div class="notice-list">
        <div v-for="(item,index) in noticeInfo" :key="index" class="notice-item" :class="item.className">
          <div class="notice-title">{{item.title}}</div>
          <div class="notice-num">{{item.count}}</div>
          <img class="notice-icon" :src="require('../../assets/img/'+item.imgUrl)" alt="">
        </div>
      </div>
      <div class="notice-chart">
        <div class="notice-chart-title">通知阅读总量</div>
        <div class="notice-chart-content">
          <div ref="line" style="width:100%;" class="chart"></div>
        </div>
      </div>
      <div class="box_wrap_4">
        <div class="container-fluid">
          <div class="page-top-half row" v-if="!isOnlyAdmin">
            <div class="announce-container">
              <div class="announce-part">
                <div class="announce-header">
                  <div class="announce-title">通知</div>
                  <div class="pull-right announce-type-tab">
                    <a :class="index === announceIndex?'active':''" @click="_changeList(index)" v-for="(val, index) in announces" :key="index">{{translate[index]}}</a>
                  </div>
                </div>
                <GeminiScrollbar class="announce-body list-group" :scrollX="false" v-if="announces[announceIndex].length > 0">
                  <div class="list-group-item" v-for="(item ,index) in announces[announceIndex]" :key="index" @click="_viewAnnounce(item)">
                    <span class="announce-date">{{item.sendTime}}</span>
                    <span class="announce-type" :class="{'green':item.type.toLowerCase()=='school','blue':item.type.toLowerCase()!='school'}">{{translate[item.type.toLowerCase()]}}</span>
                    <span class="announce-name">{{item.title}}</span>
                  </div>
                  <div class="list-group-item text-center" :class="pageIndex[announceIndex] < 0?'no-more':'more'">
                    <span v-if="pageIndex[announceIndex] < 0">{{translate.noMore}}</span>
                    <span @click="_initAnnounceList(announceIndex, pageIndex[announceIndex]++)" v-else>{{translate.more}}</span>
                  </div>
                </GeminiScrollbar>
                <div class="announce-body list-group" v-else>
                  <div class="text-center empty-data">
                    <span>{{translate.empty}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GeminiScrollbar>
  </div>
</template>

<script>
import echarts from "echarts";
import Vue from "vue";
import { sAjax, request, translation } from "../../assets/utils/utils.js";
export default {
  inject: {
    windowObj: {
      default: null
    }
  },
  props: {
    account: {
      userId: "",
      userName: "",
      type: ""
    }
  },
  data: function () {
    return {
      noticeInfo: [
        {
          title: "校级通知",
          count: 0,
          className: "school-bg",
          imgUrl: "icon2_school.png"
        },
        {
          title: "院级通知",
          count: 0,
          className: "college-bg",
          imgUrl: "icon2_academy.png"
        },
        {
          title: "辅导员通知",
          count: 0,
          className: "instructor-bg",
          imgUrl: "icon2_counselor.png"
        },
      ],
      lineChart: null,
      isOnlyAdmin: false,
      searchPlaceholder: "",
      isAddClass: false,
      announces: {
        all: [],
        school: [],
        college: [],
        instructor: []
      },
      announceIndex: "all",
      pageSize: 10,
      pageIndex: {
        all: 0,
        school: 0,
        college: 0,
        instructor: 0
      },
      initiatePageIndex: 0,
      isLoadNextPage: false,
      lineChart: null,
      lineOptionData: null,
      lang: "zh-cn",
      timer: null
    };
  },
  created: function () {

    var la = localStorage.getItem("lang");
    if (translation(la)) {
      this.lang = la;
    }
    this.searchPlaceholder = this.translate.placeholder;
    this._initAnnounceList(this.announceIndex, this.pageIndex["all"]++);
    this._getNoticeInfo()
  },
  mounted: function() {
    // this.initEchar()
  },
  computed: {
    translate: function () {
      return translation(this.lang).mainPage;
    },
  },
  watch: {
    account: {
      handler: function () {
      },
      deep: true
    },
    windowObj: {
      deep: true,
      handler: function (val) {
        if (document.body.clientWidth < 1200) {
          this.affairsTabStyle = -24;
          this.setWidth = 135;
        } else {
          this.affairsTabStyle = -7;
          this.setWidth = 300;
        }
      }
    },
  },
  methods: {
    _getNoticeInfo() {
      request("/api/fts/home/getHomeDataCount").then(data => {
        if (data.state) {
            this.noticeInfo[1].count = data.data.collegeCount
            this.noticeInfo[0].count = data.data.schoolCount
            this.noticeInfo[2].count = data.data.instructorCount
            this.initLineChart(data.data.dateList, data.data.dataCountList)
          } else {

          }
      })
    },

    initEchar() {
      const self = this;//因为箭头函数会改变this指向，指向windows。所以先把this保存
      
      window.onresize = function() {
        setTimeout(() => {
        // $(window).resize(function() {
          self.lineChart = echarts.init(self.$refs.line);
          self.lineChart.resize();
        },200)
      }
    },
    initLineChart(dataX, data) {
      this.lineChart = echarts.init(this.$refs.line)
      this.lineOptionData = {
        title: {
          text: ''
        },
        legend: {
          data: ['校级通知']
        },
        color: ["#FFB731"],
        tooltip: {
          trigger: 'axis',
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: dataX
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: data,
          type: 'line'
        }]
      };
      setTimeout(() => {
        this.lineChart.resize();
        this.lineChart.setOption(this.lineOptionData)
      }, 200);
      // window.onresize = this.$refs.line.resize
    },
    _viewAnnounce: function (announce) {
      this.$emit("addBread", {
        route: "/familyToSchool/noticeDetail?id="+announce.id,
        title: announce.title,
        data: announce
      });
    },
    _changeList: function(index) {
      this.announceIndex = index;
      if (this.announces[this.announceIndex].length === 0) {
        // const dec = () =>{

          if(!this.timer) {
            this.timer = 1
            // this.timer = setTimeout(() => {
            this._initAnnounceList(this.announceIndex, this.pageIndex[this.announceIndex]++);
            // }, 800)
          }
        // }
        // dec()
      }
    },
    _initAnnounceList: function (type, index) {
      console.log(type, index)
      let curType = type.toUpperCase()
      if(type == 'all') {
        curType = ""
      }
      sAjax({
        url: "/table-data/fts/home/getHomeNoticeList",
        type: "get",
        data: {
          pageSize: this.pageSize,
          pageIndex: index,
          pageParams: {
            type: curType
          }
        },
        success: data => {
          this.timer = null
          if (data.state) {
            data.data.forEach(ele => {
              this.announces[type].push(ele);
            });
            if (data.data.length < this.pageSize) {
              this.pageIndex[this.announceIndex] = -1;
            }
          }
        }
      });
    },
    _loadNextPage: function () {
      this.initiatePageIndex++;
      // this._initInitiateList(this.initiatePageIndex);
    },
  },
};
</script>
<style scoped lang="less">
#ftsPage-page {
  margin: -4px -10px 0;
  .notice-list {
    display: flex;
    .notice-item {
      position: relative;
      flex: 1;
      height: 180px;
      border-radius: 10px;
      color: #fff;
      margin: 4px 10px;
    }
    .notice-title {
      font-size: 16px;
      font-weight: 500;
      padding: 20px 24px;
    }
    .notice-num {
      font-size: 68px;
      font-family: "HelveticaNeue-Bold,HelveticaNeue";
      font-weight: bold;
      padding-left: 24px;
    }
    .notice-icon {
      position: absolute;
      right: 20px;
      bottom: 0;
      width: 144px;
      height: 144px;
      z-index: 5;
    }
    .school-bg {
      background: linear-gradient(
        220deg,
        rgba(255, 224, 154, 1) 0%,
        rgba(234, 181, 64, 1) 100%
      );
      box-shadow: 0px 4px 10px 0px rgba(246, 206, 116, 0.5);
    }
    .college-bg {
      background: linear-gradient(
        220deg,
        rgba(255, 188, 163, 1) 0%,
        rgba(253, 128, 69, 1) 99%
      );
      box-shadow: 0px 4px 10px 0px rgba(254, 167, 130, 0.5);
    }
    .instructor-bg {
      background: linear-gradient(
        220deg,
        rgba(158, 225, 248, 1) 0%,
        rgba(27, 176, 223, 1) 100%
      );
      box-shadow: 0px 4px 10px 0px rgba(51, 194, 241, 0.5);
    }
  }
  .notice-chart {
    margin: 16px 10px 20px;
    // width: 100%;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 10px 0px rgba(239, 239, 239, 1);
    border-radius: 10px;
    // box-sizing: border-box;
    // padding-bottom: 20px;
    overflow: hidden;
    .notice-chart-title {
      font-size: 16px;
      color: #606266;
      padding: 20px 24px 24px;
      background: rgba(252, 252, 252, 1);
      border-radius: 10px 10px 0px 0px;
      font-weight:600;
    }
    .notice-chart-content {
      // width: calc(100% - 250px);
      width: 100%;
      height: 460px;
      padding-bottom: 20px;
    } 
    .chart {
      width: 100%;
      height: 100%;
    }
  }
}
.box_wrap_4 {
  border-radius: 10px;
  margin-left: 10px;
  margin-right: 10px;
  box-shadow: 0px 2px 10px 0px rgba(239, 239, 239, 1);
}
// end事务统计
// 学校事务+快捷服务
.box_wrap_3 {
  border-radius: 3px;
  overflow: hidden;
  height: 300px;
  box-shadow: 0 0 2px 0 rgba(6, 10, 30, 0.1), 0 2px 2px 0 rgba(11, 15, 40, 0.1);
  .affairs-container {
    width: 64.8%;
    box-shadow: none;
    .mainPage-affairs-header {
      border-bottom: 1px solid #f0f0f0 !important;
    }
  }
  .mainPage-affairs-header {
    font-weight: normal;
  }
  .box_head {
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: #424f61;
    letter-spacing: 0;
    text-align: left;
    line-height: 64px;
    font-weight: normal;
    padding-left: 23px;
    border-bottom: 1px solid #f0f0f0;
    height: 64px;
  }
  .box_main {
    width: 100%;
    padding-top: 18px;
    .box_child {
      width: 48%;
      height: 34px;
      line-height: 34px;
      margin-bottom: 20px;
      font-family: PingFang-SC-Medium;
      font-size: 17px;
      color: #525a67;
      letter-spacing: 0.4px;
      text-decoration: none;
      position: relative;
      .linkName {
        max-width: 160px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      i.maticon {
        position: absolute;
        right: 5px;
        top: 9px;
        font-size: 17px;
        color: #525a67;
        display: none;

        &.edit {
          right: 24px;
        }
      }
      &:hover {
        i.maticon {
          display: block;
          &:hover {
            color: #1478f6;
          }
        }
      }
      cursor: pointer;
      .color_ball {
        width: 10px;
        height: 10px;
        margin-right: 10px;
        margin-left: 31px;
        border-radius: 50%;
      }
    }
  }
}
.quick_server_wrap {
  border-left: 1px solid #f0f0f0;
  .box_head {
    .icon_add_wrap {
      width: 34px;
      line-height: 41px;
      height: 34px;
      cursor: pointer;
      i {
        color: #cbcbc9;
      }
      i:hover {
        color: #2178e6;
      }
    }
  }
}
</style>


<style lang="less">
@import url("../../assets/common.less");
@import url("../../assets/newCommon.less");
#ftsPage-page {
  height: 100%;
  overflow: auto;
  .main-p {
    // max-width: 1140px;
    height: 100%;
    overflow: auto;
  }
  .modal-content {
    padding-left: 0;
    top: 0;
  }
  .page-top-half {
    .announce-container {
      height: 300px;
      // padding: 0 8px 0 0;
      border-radius: 10px !important;
      // margin-bottom: 8px;
      .announce-part {
        height: 100%;
        border-radius: 10px !important;
      }
      .announce-header {
        height: 64px;
        background: #fcfcfc;
        // border-bottom: 1px solid #e0e0e0;
        padding: 20px 16px 20px 24px;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        .announce-title {
          display: inline-block;
          font-size: 16px;
          color: #606266;
          line-height: 16px;
          font-weight: normal;
          margin-top: 3px;
          font-weight:600;
        }
        .announce-type-tab {
          margin-right: -10px;
          a {
            padding: 5px 10px;
            font-size: 13px;
            color: rgba(0, 0, 0, 0.36);
            line-height: 13px;
            font-weight: 500;
            text-decoration: none;
            background: #fcfcfc;
            cursor: pointer;
            &.active {
              color: #1578f6;
            }
          }
        }
      }
      .announce-body {
        height: 236px;
        background: #fff;
        margin-top: 0;
        overflow: auto;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        .list-group-item {
          padding: 0 24px 0 21px;
          line-height: 40px;
          border: none;
          cursor: pointer;
          &:hover {
            background: #f5f5f5;
          }
        }
        .announce-date {
          display: inline-block;
          width: 140px;
          margin-right: 11px;
          font-family: PingFangSC-Medium;
          font-size: 13px;
          color: rgba(0, 0, 0, 0.36);
        }
        .announce-type {
          padding: 6px 12px;
          margin-right: 12px;
          font-size: 12px;
          color: white;
          border-radius: 100px;
          &.blue {
            background: #1478f6;
          }
          &.green {
            background: #62c660;
          }
        }
        .announce-name {
          font-family: PingFangSC-Medium;
          font-size: 13px;
          color: rgba(15, 27, 46, 0.77);
        }
        .more,
        .no-more,
        .empty-data {
          color: rgba(0, 0, 0, 0.36);
          font-size: 13px;
        }
        .more {
          color: rgba(0, 0, 0, 0.64);
        }
        .empty-data {
          padding: 20px;
        }
      }
    }
  }
}
</style>
