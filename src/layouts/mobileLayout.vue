
<template>
  <div id="mobileLayout">
    <transition name="slide-fade" v-for="(item,i) in bread" :key="i">
      <router-view class="router-view" :routerName='curRoute' :curRoute="item" :name="item.route.split('?')[0]" :role="item.data&&item.data.id" :update="curRoute === item.route&&curRoute === update" :data="item" :account="account" :style="'z-index:'+ (curRoute === item.route? 100: 0) +';'" @addBread="addBread" @_refresh="_refresh" @removeBread="removeBread" @logout="logout"></router-view>
    </transition>
    <div v-if="studentType !== 'FRESHMAN'">
      <tabbar class="mobile-tabbar" v-if="tabbarRouteArray.indexOf(curRoute)>=0">
        <tabbar-item :class="curRoute === item.route?'active':''" :selected="curRoute === item.route" v-for="(item, i) in taglist" :key="i" @on-item-click="addBread(item)">
          <span slot="label">
            <img :src="require('../../mobile_static/image/'+item.icon+'.png')" v-if="curRoute === item.route" class="tab_icon" alt>
            <img :src="require('../../mobile_static/image/'+item.icon+'_1.png')" v-else class="tab_icon" alt>
            {{item.title}}
          </span>
        </tabbar-item>
      </tabbar>
    </div>

    <!-- 新生账号登录 -->
    <div v-else>
      <tabbar class="mobile-freshman-tabbar" v-if="freshmanTabbarRouteArray.indexOf(curRoute)>=0">
        <tabbar-item :class="curRoute === item.route?'active':''" :selected="curRoute === item.route" v-for="(item, i) in freshmanTaglist" :key="i" @on-item-click="addBread(item)">
          <span slot="label" :id="item.icon" v-if="item.icon">
            <!-- {{'../../mobile_static/image/'+item.icon+'_1.png'}} -->
            <img :src="require('../../mobile_static/image/'+item.icon+'.png')" v-if="curRoute === item.route" class="tab_icon" alt>
            <img :src="require('../../mobile_static/image/'+item.icon+'_1.png')" v-else class="tab_icon" alt>
            {{item.title}}
          </span>
        </tabbar-item>
      </tabbar>
    </div>
  </div>
</template>
<script>
import "../../mobile_static/js/rem.js";
import "../../mobile_static/css/common.less";
import Vue from "vue";
import $ from "jquery";
import { sAjax } from "../assets/utils/utils.js";
import { setTimeout } from 'timers';
export default {
  props: {
    account: {
      default: function () {
        return null;
      }
    }
  },
  created: function () {
    var that = this;
    let getQueryString = function (name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return unescape(r[2]);
      return null;
    }
    let isSign = getQueryString('isSign');
    let advice = getQueryString('advice');
    let isSignList = getQueryString('isSignList');
    if (isSign) {
      this.addBread({
        route: '/ISignIn/mobileTwoCodeSign',
        data: {
          signId: getQueryString('signId'),
          signTabVal: getQueryString('signTabVal'),
          timestamp:getQueryString('timestamp')
        }
      })
      return
    }
    if (advice) {
      this.addBread({
        route: '/main/advice',
      })
      return
    }
    if (isSignList == '1') {
      this.addBread({
        route: '/ISignIn/MISignInList',
      })
      return
    }


    sAjax({
      url: "/login/check",
      type: "get",
      success: data => {
        that.studentType = data.data.type;
        // data.data.schoolId = "dndxdemo"
        // console.log(data.data.schoolId)
        if (data.data.type !== "FRESHMAN") {
          //获取链接参数，/mobile?type=1&key=secondclass，type为跳转类型（1为四个tab页面，其他待定），key跳转哪个组件
          var routerKey = this.GetQueryString("key");
          var router = this.openRouters[routerKey];

          //如果router存在，跳转链接指定的组件，不存在原来的逻辑跳转
          if (router) {
            that.addBread(router);
          } else {
            if (data.data.schoolId == "dndxdemo") {
              that.curRoute = "/applicationList/MWorkHall";
              that.bread = [
                {
                  icon: "shouye_3",
                  title: "办事大厅",
                  route: "/applicationList/MWorkHall"
                }
              ];
              this.taglist = [
                {
                  icon: "shouye_3",
                  title: "办事大厅",
                  route: "/applicationList/MWorkHall"
                },
                {
                  icon: "shouye_5",
                  title: "个人中心",
                  route: "/accountCircle/MAccountCircle"
                }
              ];
            } else {
              that.curRoute = "/main/main";
              that.bread = [
                {
                  icon: "shouye_1",
                  title: "首页",
                  route: "/main/main"
                }
              ];
            }
          }
        } else {
          that.curRoute = "/applicationList/MFreshmanApplication";
          that.bread = [
            {
              title: "新生应用",
              route: "/applicationList/MFreshmanApplication",
              closeable: false,
              data: null
            }
          ];
        }
        if (!data.state) {
          return this.$emit("initAccount", null);
        }
        let r = this.$router.currentRoute.query
        if(r.key =="secondclass"&&r.type == '1') { //校外登录
          this.taglist =  [
        {
          icon: "shouye_2",
          title: "活动",
          route: "/activity/MSecondClassRoom"
        },
        {
          icon: "shouye_5",
          title: "我的",
          route: "/accountCircle/MAccountCircle"
        }
      ]
        }
        this.$emit("initAccount", {
          userId: data.data.id,
          userName: data.data.name,
          type: data.data.type,
          schoolId: data.data.schoolId
        });
        this.schoolId = data.data.schoolId;
      }
    });
    this._getMessages();
  },
  data() {
    return {
      schoolId: "",
      taglist: [
        {
          icon: "shouye_1",
          title: "首页",
          route: "/main/main"
        },
        {
          icon: "shouye_3",
          title: "应用",
          route: "/applicationList/MWorkHall"
        },
        {
          icon: "shouye_2",
          title: "活动",
          route: "/activity/MSecondClassRoom"
        },
        {
          icon: "shouye_4",
          title: "消息",
          route: "/messageBox/MMessagesList",
          data: { list: [] }
        },
        {
          icon: "shouye_5",
          title: "我的",
          route: "/accountCircle/MAccountCircle"
        }
      ],
      freshmanTaglist: [
        {
          icon: "",
          title: "",
          route: "/placeholderRoute"
        },
        {
          icon: "subject",
          title: "公告",
          route: "/announcement/MAnnouncement"
        },
        {
          icon: "circular",
          title: "应用",
          route: "/applicationList/MFreshmanApplication"
        },
        {
          icon: "account_circle",
          title: "我的",
          route: "/accountCircle/MFreshmanStatus"
        },
        {
          icon: "",
          title: "",
          route: "/placeholderRoute"
        }
      ],
      bread: [],
      historyBread: [],
      curRoute: "",
      update: false,
      tabbarRouteArray: [
        "/main/main",
        "/activity/MSecondClassRoom",
        "/applicationList/MWorkHall",
        // "/notifications/notifications",
        "/messageBox/MMessagesList",
        "/accountCircle/MAccountCircle"
      ],
      freshmanTabbarRouteArray: [
        "/announcement/MAnnouncement",
        "/applicationList/MFreshmanApplication",
        "/accountCircle/MFreshmanStatus"
      ],
      disableRoute: ["/placeholderRoute"],
      studentType: "",
      toastText: "",
      isShowToast: false,
      update: "",
      openRouters: {
        secondclass: {
          title: "第二课堂",
          route: "/activity/MSecondClassRoom"
        },
        enroll: {
          title: "行程安排",
          route: "/journey/journeyList"
        },
        student: {
          title: "学生信息查询",
          route: "/studentInfo/studentInfo"
        },
      }
    };
  },
  computed: {},
  watch: {
    curRoute: function () {
      // 清理历史记录中重复的项
      this.historyBread.forEach((b, i) => {
        if (b === this.curRoute) {
          this.historyBread.splice(i, 1);
        }
      });
      // 清理历史记录中不存在的项
      this.historyBread.forEach((hb, i) => {
        var flag = false;
        this.bread.forEach(b => {
          if (hb === b.route) {
            flag = true;
          }
        });
        if (!flag) {
          this.historyBread.splice(i, 1);
        }
      });
      this.historyBread.splice(0, 0, this.curRoute);
    }
  },
  methods: {
    _getMessages: function () {
      sAjax({
        url: "/api/message/quiry",
        type: "get",
        success: data => {
          if (data.state) {
            // this.messages = data.data || [];
            this.taglist[3].data.list = data.data || [];
          }
        }
      });
    },
    removeLastBread(cancelBack) {
      if (this.bread.length == 1) {
        //说明是最后一页了,需要提示退出
      } else {
        this.removeBread(this.bread[this.bread.length - 1]);
      }
    },
    addBread: function (item) {
      var that = this;
      if (this.disableRoute.indexOf(item.route) >= 0) {
        if (item.route !== "/placeholderRoute") {
          that.$vux.toast.show({
            text: "尚未上线 敬请期待",
            position: "bottom",
            type: "text"
          });
        }
        return false;
      }
      var isExist = false;
      that.bread.forEach(function (b, index) {
        if (b.route === item.route) {
          isExist = true;
        }
      });
      if (!isExist) {
        if (!item.data) {
          Vue.set(item, "data", this._getParams(item.route));
        }
        this.bread.push(item);
      }
      this.curRoute = item.route;
    },
    removeBread: function (item) {
      var that = this;
      that.bread.forEach(function (b, index) {
        if (b.route === item.route) {
          that.bread.splice(index, 1);
        }
      });
      if (that.curRoute === item.route) {
        that.curRoute = that.historyBread[1];
      }
      if (item.isUpdateLastPage) {
        this._refresh();
      }
    },
    _refresh: function () {
      this.update = this.curRoute;
      // setTimeout(() => {
      //   this.update = "";
      // }, 100);
    },
    _getParams: function (url) {
      var theRequest = {};
      if (url.indexOf("?") !== -1) {
        var str = url.substr(url.indexOf("?") + 1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
          theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
      }
      return theRequest;
    },
    GetQueryString: function (name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return unescape(r[2]);
      return null;
    },
    logout: function () {
      sAjax({
        url: "/logout",
        type: "get",
        success: data => {
          if (data.state) {
            this.$emit("initAccount", null);
            let r = this.$router.currentRoute.query
            this.clearAllBreads();
             if(r.key =="secondclass"&&r.type == '1') {
              window.location.href = "/" + this.schoolId + "/login/outLogin";
              return false
            }

            if (data.testEnvId) {
              window.location.href = "/school/" + data.testEnvId;
            } else if (data.redirect) {
              window.location.href = data.redirect;
            } else {
              window.location.href = "/" + this.schoolId + "/login";
            }
          } else {
            this.$toast(data.message);
          }
        }
      });
      return false;
    },
    clearAllBreads: function () {
      this.curRoute = this.bread[0].route;
      this.bread.splice(1);
    }
  }
};
</script>
<style lang="less">
@import url("../media/css/mobileCommon.less");
#mobileLayout {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  .router-view {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    overflow: auto;
  }
  .mobile-tabbar {
    position: fixed;
    background: #ffffff;
    .weui-tabbar__item {
      text-decoration: none;
      .weui-tabbar__icon i,
      .weui-tabbar__label span {
        color: rgba(0, 0, 0, 0.36);
      }
      &.weui-bar__item_on {
        .weui-tabbar__icon i,
        .weui-tabbar__label span {
          color: rgba(0, 0, 0, 0.36);
        }
      }
      &.active {
        .weui-tabbar__icon i,
        .weui-tabbar__label span {
          color: #298df7;
        }
      }
    }
  }
  .mobile-freshman-tabbar {
    position: fixed;
    background: #ffffff;
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.18), 0 4px 4px 0 rgba(0, 0, 0, 0.18);
    height: 56px;
    .weui-tabbar__item {
      text-decoration: none;
      .weui-tabbar__icon i,
      .weui-tabbar__label span {
        color: #90a4ae;
      }
      .weui-tabbar__label {
        margin-bottom: 0;
      }
      &.weui-bar__item_on {
        .weui-tabbar__icon i,
        .weui-tabbar__label span {
          color: #90a4ae;
        }
      }
      &.active {
        .weui-tabbar__icon i,
        .weui-tabbar__label span {
          color: #455a64;
        }
      }
    }
  }
  .tab_icon {
    height: 0.54rem;
  }
}
</style>
<style>
.weui-tabbar__label {
  padding-top: 0.2rem;
}
.weui-tabbar__label span {
  display: flex;
  line-height: 0.6rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 0.32rem;
}
</style>

