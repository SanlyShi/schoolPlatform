<template>
  <div id="mobileMain" style="padding-bottom:50px;">
    <div class="mainBox" v-if="!showChart">
    <div class="search_box bg-white">
      <div class="search_icon"></div>
      <input @click="toAppList()" readonly type='search' placeholder="搜索">
      <!-- <div @click="saoyisao()" class="tow_code"></div> -->
    </div>
    <div class="swiper_wrap bg-white">
      <swiper :list="swiperList" :auto="true" height="120px"></swiper>
    </div>


    <!-- 报表部分 -->
    <div class="chartPart" v-if="authority">
      <div class="typeList">
        <div class="students">
          <a class="studentCard" @click="showChart = true;chartType = 'student'">
            <span>在校学生数</span>
            <p>{{studentCount.toFixed(0).toString().replace(/(\d)(?=(?:\d{3})+$)/g,"$1,")}}</p>
          </a>
          <a class="teacherCard" @click="showChart = true;chartType = 'teacher'">
            <span>职工数</span>
            <p>{{teacherCount.toFixed(0).toString().replace(/(\d)(?=(?:\d{3})+$)/g,"$1,")}}</p>
          </a>
          <a class="appCard" @click="showChart = true;chartType = 'app'">
            <span>应用服务</span>
            <p>{{appCount.toFixed(0).toString().replace(/(\d)(?=(?:\d{3})+$)/g,"$1,")}}</p>
          </a>
        </div>  
      </div>
    </div>
    
    <!-- 暂时隐藏 --> 
    <div class="box_wrap bg-white apps">
      <h1><i></i><span>推荐应用</span></h1>
      <!-- <div class="title_box box_flex box_between align_center">
        <div class="title">推荐应用</div>
        <div class="text box_flex align_center" @click="toAppList()">
          查看更多
          <i slot="icon" class="maticon" v-html="icons('chevron_right')"></i>
        </div>
      </div> -->
      <!-- (hotAppList.length<=6&&index<=3)||(hotAppList.length>4&&index<3) -->
      <div class="box_main box_flex">
        <div v-for="(item,index) in hotAppList" :key="index" v-if="index<6" class="box_child box_flex column flex_center" @click="_checkDetail(item)">
          <div class="icon_wrap box_flex flex_center align_center" :style="{'background':item.app.background?item.app.background:'#3F87E7'}">
            <i class="maticon" :title="item.app.imgPath" v-html="icons(item.app.imgPath)" v-if="item.app.imgType !== '2'">{{item.app.imgPath}}</i>
            <i class="maticon app-icon-style theme-icon-application" v-else-if="item.app.imgType === '2'">
              <span class="saasicon-36px" :class="['saasicon-36px-'+ item.app.imgPath]"></span>
            </i>
          </div>
          <div class="name">{{item.app.name}}</div>
        </div>
        <div v-if="hotAppList.length>4" class="box_child more box_flex column flex_center" @click="toAppList()">
          <div class="icon_wrap box_flex flex_center align_center">
            <img style="width:0.8rem;height:0.8rem;" :src="require('../../../mobile_static/image/more.png')" alt="">
          </div>
          <div class="name">更多</div>
        </div>
      </div>
    </div>
  
    
    <!-- <div class="bar"></div> -->

    <div class="box_wrap boxBg">
      <div class="title_box box_flex box_between align_center">
        <div class="title gonggao">
          <h1><i></i><span>通知公告</span></h1>
          <!-- <div class="bar"></div> -->
        </div>
      </div>
      <div class="gonggao_wrap">
        <div v-for="(item,index) in adviceList" :key="index" @click="toAdvice(item)">
          <div class="title"><i v-if="index<3"><em>置 顶</em></i><span>{{item.title}}</span></div>
          <div class="content">
            <!-- <div class="text">{{item.text?item.text:""}}</div> -->
            <div class="data_time grow_1">
              <div class="left">
                <i></i>
                <span>{{item.browser}}</span>
              </div>
              <div class="right">
                {{item.createTime}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <p class="bottomTip" v-if='adviceList.length'>到底啦</p>
    </div>


    <!-- 图表页 -->
    <student-chart :allCount='studentCount' @backToParent='backToParent' v-if="showChart&&chartType == 'student'"></student-chart>
    <teacher-chart @backToParent='backToParent' v-if="showChart&&chartType == 'teacher'"></teacher-chart>
    <app-chart @backToParent='backToParent' v-if="showChart&&chartType == 'app'"></app-chart>
  </div>
</template>
<script>
import { request } from "../../assets/utils/utils.js";
import studentChart from './charts/student'
import teacherChart from './charts/teacher'
import appChart from './charts/appChart'
export default {
  props: {
    account: {
      default: null
    },
    routerName: {
      default: null,
    },
    data: {
      default: null,
    }
  },
  components: {
    studentChart,
    teacherChart,
    appChart
  },
  watch: {
    routerName: function(val) {
        if(val == '/main/main') {
          this.getAdviceList();
        }
    }
  },
  created() {
    request('/api/document/statistic/authority',{},'post').then(data => {
      if(data.state) {
        if(data.data) { //有权限查看
        this.authority = true
          request('/api/document/statistic/getOverallView',{},'post').then(data => {
            if(data.state) {
              if(data.data) {
                this.studentCount = data.data.student
                this.teacherCount = data.data.teacher
                this.appCount = data.data.app
              }
            }
          })
        }
      }
    })
    
    this.getAdviceList();
    request("/api/firstPage/getPictureList?timestamp=" + new Date()).then(o => {
      if (o.state) {
        if (o.data.content && o.data.content.length > 0) {
          this.swiperList = []
          o.data.content.forEach((item, index) => {
            if (item.is_enable == 0) {
              let image = {
                url: `${item.url}`,
                img: "/downloads/storage/images/" + item.picture_hash,
                title: ""
              }
              this.swiperList.push(image)

            }

          })
          if (this.swiperList.length == 0) {
            this.swiperList = []
            let image1 = {
              url: "javascript:",
              img: require("../../../mobile_static/image/banner1.png"),
              title: ""
            }
            this.swiperList.push(image1)

          }

        }
        else {
          this.swiperList = []
          let image1 = {
            url: "javascript:",
            img: require("../../../mobile_static/image/banner1.png"),
            title: ""
          }
          this.swiperList.push(image1)
        }
      } else {
        this.$toast(o.message)
      }
    })
  },
  data: function () {
    return {
      showChart: false,//是否显示图表页
      chartType: '',// [student,teacher,app]
      recordData: [],
      hotAppList: [], //推荐应用列表
      adviceList: [], //公告列表
      swiperList: [],
      studentCount: 0,
      teacherCount: 0,
      appCount: 0,
      authority: false,//是否有权限查看报表信息
    };
  },
  methods: {
    backToParent() {
      this.showChart = false
    },
    toAppList() {
      let router = {
        icon: "assignment",
        title: "办事大厅",
        route: "/applicationList/MWorkHall"
      };
      this.$parent.addBread(router);
    },
    toAdvice(item) {
      //查看公告
      let router = {
        icon: "assignment",
        title: "公告",
        data: item,
        route: "/main/advice"
      };
      this.$parent.addBread(router);
    },
    saoyisao() {
      this.$toast("暂未开放");
    },
    getHotAppList() {
      //获取推荐应用列表
      let url = "/api/app/popular";
      request(url).then(o => {
        this.hotAppList = o.data.sort((a,b)=>{
              return a.sort-b.sort
            });
      });
    },
    _checkDetail(obj) {
      var router = {};
      let url = "/api/app/" + obj.app.id + "/business/now?getDetail=false";
      request(url).then(data => {
        if (obj.app.setting.type === "FORM") {
          router = {
            route: "/form/MFormLayout?appId=" + obj.app.id,
            title: "",
            curBusiness: data.data[0],
            businessList: data.data.map(o => {
              o.value = o.business.name
              o.key = o.business.id
              return o;
            }),
            type: {
              typeTitle: "",
              childName: obj.name
            }
          };
        } else if (obj.app.setting.type === "LINK") {
          window.location.href = obj.app.setting.linkUrl
        } else {
          router = {
            route:
              "/form/MFlowDetail?appId=" +
              obj.app.id +
              "&businessId=" +
              data.data[0].business.id,
            title: obj.app.name,
            curBusiness: data.data[0],
            businessList: data.data.map(o => {
              o.value = o.business.name
              o.key = o.business.id
              return o;
            })
          }
        }

        this.$parent.addBread(router);
      });
    },
    getAdviceList() {
      //获取公告列表
      let url = "/table-data/announcement/list/10";
      let params = {
        pageSize: 999,
        pageIndex: 0,
        pageParams: {
          type: "all"
        }
      };
      request(url, params, "get").then(o => {
        this.adviceList = o.data;
        // console.log("hotAppList", JSON.parse(JSON.stringify(o)));
      });
    }
  },
  mounted() {
    // pushHistory();
    let that = this;
    let cancelBack = function (e) {
      if (that.$parent.bread.length == 1) {
        that.$vux.toast.show({
          text: "再按一次,退出系统",
          position: "bottom",
          type: "text"
        });
        window.removeEventListener("popstate", cancelBack, false);
        setTimeout(function () {
          pushHistory();
          window.addEventListener("popstate", cancelBack, false);
        }, 2000)
      } else {
        that.$parent.removeLastBread(cancelBack)
        window.removeEventListener("popstate", cancelBack, false);
        pushHistory();
        window.addEventListener("popstate", cancelBack, false);
      }
    };
    window.addEventListener("popstate", cancelBack, false);
    function pushHistory() {
      // var state = {
      //   title: "title",
      //   url: "#"
      // };
      // window.history.pushState(state, "title", "#");
    }
    this.getHotAppList();
    
  }
};
</script>
<style lang="less" scoped>
#mobileMain {
  background: #f4f4f4 !important;
}
.box_main {
  flex-wrap: wrap;
}
.bottomTip {
  color: #C0C4CC;
  font-size: 12px;
  text-align: center;
}
.chartPart {
  background: #fff;
  .typeList {
    .students {
      display: flex;
      padding: 16px;
    }
    a {
      display: inline-block;
      padding-left: 0.2667rem;
      padding-top: 0.4533rem;
      float: left;
      background: url('../../../mobile_static/image/pic_stu_a@2x.png') no-repeat;
      background-size: contain;
      width: 2.8933rem;
      height: 1.8667rem;
      color: #fff;
      font-size: 0.3467rem;
      margin-right: 0.2667rem;
      p {
        margin: 0;
        font-size: 0.4267rem;
        font-weight: bold;

      }
    }
    a:focus, a:hover {
      text-decoration: none;
    }
    a.teacherCard {
       background: url('../../../mobile_static/image/pic_teacher_a@2x.png') no-repeat;
      background-size: contain;
    }
    a.appCard {
      margin-right: 0;
      background: url('../../../mobile_static/image/pic_app_a@2x.png') no-repeat;
      background-size: contain;
    }
  }
}
.bg-white {
  background: #fff;
}
.apps {
   h1 {
      margin: 0;
      padding: 0;
      font-size: 0.4267rem;
      padding: 0.4133rem 0 0.64rem 0;
      color: #303133;
      span {
          // font-size: 16px;
          display: inline-block;
          vertical-align: middle;
          font-weight: bold;
      }
      i {
          display: inline-block;
          vertical-align: middle;
          width: 0.1067rem;
          margin-right: 0.4267rem;
          height: 0.5067rem;
          background:rgba(77,121,246,1);
          box-shadow:1px 1px 2px 0px rgba(77,121,246,0.2);
      }
  }
}
.boxBg {
  background: #f4f4f4;
  box-shadow: 0px 2px 2px 1px rgba(220, 223, 230, .5);
  .title_box {
    background: #fff;
  }
}
.swiper_wrap {
  padding: 16px 15px 0;
  .vux-slider {
    border-radius: 5px;
  }
}
.search_box {
  padding: 0.4267rem;

  padding-bottom: 0;
  position: relative;

  .search_icon {
    position: absolute;
    height: 0.3733rem;
    width: 0.3733rem;
    left: 0.66rem;
    top: 0.6533rem;
    background-image: url("../../../mobile_static/image/shouye_sousuo.png");
    background-size: 100% 100%;
  }
  input {
    // border: 1px solid #C0C4CC;
    border: none;
    // height: 0.8rem;
    // line-height: 0.8rem;
    width: 100%;
    padding: .2rem 0 .2rem .72rem;
    padding-left: 0.72rem;
    text-align: left;
    font-size: 0.32rem;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(144, 147, 153, 1);
    background:rgba(247,249,250,1);
    border-radius:0.4933rem;
    // box-shadow: 0rem 0.08rem 0.1733rem 0.1rem rgba(192, 196, 204, 0.2);
    // border-radius: 0.52rem;
  }
  .tow_code {
    width: 0.586667rem;
    height: 0.586667rem;
    background-image: url("../../../mobile_static/image/shouye_saoyisao.png");
    background-size: 100% 100%;
    position: absolute;
    top: 0.55rem;
    right: 0.6rem;
  }
}
.title_box {
  width: 100%;
  .title {
    font-family: PingFangSC-Medium;
    font-size: 0.4533rem;
    color: #303133;
  }
  .text {
    font-family: PingFangSC-Regular;
    font-size: 0.3467rem;
    color: #999999;
  }
}
.box_child {
  &.more {
    // position: absolute;
    right: 0;
  }
  width: 2.5rem;
  margin-bottom: 0.466rem;
  position: relative;
  .icon_wrap {
    width: 1.52rem;
    height: 1.52rem;
    border-radius: 13px;
    margin-bottom: 0.1333rem;
    i {
      color: white;
    }
    .maticon {
      font-size: 36px;
    }
    .app-icon-style {
      width: 36px;
      height: 36px;
    }
  }
  .name {
    height: 36px;
    max-width: 1.8667rem;
    font-family: PingFangSC-Regular;
    font-size: 0.32rem;
    color: #666666;
    letter-spacing: 0.0037rem;
    text-overflow: ellipsis;
    text-align: center;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    text-align: -webkit-center;
    -webkit-box-orient: vertical;
    word-wrap: break-word;
    word-break: break-all;
  }
}

.gonggao {
  position: relative;
  h1 {
      margin: 0;
      padding: 0.4133rem 0 0.64rem 0;
      font-size: 0.4267rem;
      color: #303133;
      span {
          // font-size: 16px;
          display: inline-block;
          vertical-align: middle;
          font-weight: bold;
      }
      i {
          display: inline-block;
          vertical-align: middle;
          width: 0.1067rem;
          margin-right: 0.4267rem;
          height: 0.5067rem;
          background:rgba(77,121,246,1);
          box-shadow:1px 1px 2px 0px rgba(77,121,246,0.2);
      }
  }
  &.title {
    font-size: 0.4533rem;
    font-weight: bold;
  }
  .bar {
    position: absolute;
    bottom: 0;
    left: 0.133rem;
    width: 0.48rem;
    height: 0.1067rem;
    background: #fcb814;
  }
}
.gonggao_wrap {
  padding: 0.4267rem;
  padding-top: 0;
  background: #fff;
  padding-bottom: 0;
  .title {
    font-family: PingFangSC-Medium;
    font-size: 15px;
    color: #303133;
    font-weight: 400;
    i {
      margin-right: 0.2267rem;
      display: inline-block;
      width: 0.96rem;
      height: 0.4267rem;
      line-height: 0.4267rem;
      background:rgba(77,121,246,0.09);
      border-radius:2px;
      text-align: center;
      em {
        font-style: normal;
        color: #4D79F6;
        opacity: .7;
        font-size: 12px
      }
    }
  }
  .text {
    font-family: PingFangSC-Regular;
    font-size: 13px;
    color: #999999;
    letter-spacing: -0.01px;
  }
  & > div:last-child {
    .data_time {
      border-bottom: none;
    }
  }
}
.content {
  .text {
    width: 70%;
    letter-spacing: -0.01px;
    margin-top: 0.2133rem;
  }
  .data_time {
    text-align: left;
    margin: 0.2667rem 0 0.4rem;
    font-weight: 400;
    padding-bottom: 0.4rem;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #909399;
    letter-spacing: 0;
    border-bottom: .5px solid rgb(245,246,248);
  }
  .grow_1 {
    display: flex;
    justify-content: space-between;
    .left {
      span {
        display: inline-block;
        vertical-align: middle;
      }
      i {
        display: inline-block;
        width: 0.32rem;
        height: 0.2667rem;
        background: url("../../../mobile_static/image/icon_readnumber@2x.png") no-repeat;
        background-size: contain;
        vertical-align: middle;
      }
    }
  }
}
</style>
<style lang="less">
.swiper_wrap {
  .vux-swiper-desc {
    background: none !important;
  }
  .vux-slider .vux-indicator-right {
    position: absolute;
    right: 15px;
    bottom: 5px;
    left: 15px;
    text-align: center;
    display: flex;
    justify-content: center;
    a {
      .vux-icon-dot {
        width: 0.1rem;
        height: 0.1rem;
        background: rgba(255, 255, 255, 1);
        border-radius: 50%;
        opacity: 0.7;
      }
      .vux-icon-dot.active {
        border-radius: 0.2rem;
        width: 0.3733rem;
        background: rgba(255, 255, 255, 1);
        opacity: 0.8;
      }
    }
  }
}
</style>
