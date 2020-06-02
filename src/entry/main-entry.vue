<template>
  <router-view :navList="navList" :headItems="headItems" :account="account" :navToggle="navToggle" :sidebarShow="sidebarShow" :layoutType="layoutType" :asyncLogin="asyncLogin" @initNavList="initNavList" @initAccount="initAccount" >
  </router-view>
  <!-- <router-view :account="account" @initAccount="initAccount" v-else></router-view> -->
</template>
<script>
import Vue from "vue";
import $ from "jquery";
import Router from "vue-router";
import { setMainVueInstance, sAjax } from "../assets/utils/utils.js";
import MainLayout from "../layouts/manageTypeLayout.vue";
import LoginLayout from "../layouts/loginLayout.vue";
import formLayout from "../layouts/formLayout.vue";
import mobileLayout from "../layouts/mobileLayout.vue";
import applicationLayout from "../layouts/applicationLayout.vue";
export default {
  components: {
    MainLayout,
    LoginLayout,
    formLayout,
    mobileLayout,
    applicationLayout
  },
  created: function () {
    setMainVueInstance(this);
  },
  data: function () {
    return {
      navToggle: true,
      sidebarShow: true,
      layoutType: "left",
      navList: [],
      headItems: [],
      account: null,
      options: [],
      asyncLogin: false,
      ajaxRequests: [],
      ASYNC_LOGIN_PROCESS: "async_login_process",
      myWidth: 100,
      entrySetting: {
        mainRoutes: ["/index", "/school/test"]
      },
      windowObj2: {
        width: 100,
        height: 100
      }
    };
  },
  provide: function () {
    return {
      windowObj: this.windowObj2
    };
  },
  watch: {
    account: {
      handler: function () {
        let url = "/api/currentUser/menus"
        if (this.$route.query.systemId) {
          this.account.systemId = this.$route.query.systemId
        }
        if (this.$route.query.sys) {
          url = "/api/currentUser/menus?sys=" + this.$route.query.sys
        }
        this.navList = [];
        if (!this.account || this.account.type === "FRESHMAN") {
          return;
        }
        if (this.$route.path.indexOf('mobile') <= -1) {
          $.ajax({
            url: url,
            type: "get",
            success: data => {
              if (data.state) {
                data.data.sort(this.compare("sort")).forEach((ele, i) => {
                  this.navList.push(this._getRouteObj(ele, i === 0));
                });
              } else {
                this.$toast(data.message);
              }
            }
          });
        }
      },
      deep: true
    }
  },
  methods: {
    _getRouteObj: function (ele, open = false) {
      var obj = {};
      obj.title = ele.name;
      obj.tooltip = ele.tooltip;
      if (ele.url && ele.url.indexOf("?id=") >= 0) {
        this.$set(obj, "route", ele.url.split("?id=")[0]);
        this.$set(obj, "data", this._getParams(ele.url));
      } else {
        this.$set(obj, "route", ele.url);
      }
      if (ele.subMenus && ele.subMenus.length > 0) {
        this.$set(obj, "open", open);
        if (!obj.children) {
          this.$set(obj, "children", []);
        }
        ele.subMenus.sort(this.compare("sort")).forEach(childMenu => {
          obj.children.push(this._getRouteObj(childMenu));
        });
      }
      return obj;
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
    initNavList: function (list) {
      this.navList = list;
    },
    initAccount: function (account) {
      this.account = account;
    },
    compare: function (val) {
      return function (before, after) {
        return before[val] - after[val];
      };
    },
    toLogin() {
      this.$router.push({
        path: "/login"
      });
    },
    readyToAsyncLogin: function (ajaxRequest) {
      // this.toLogin();
      // return;
      this.ajaxRequests.push(ajaxRequest);
      if (window.localStorage.getItem(this.ASYNC_LOGIN_PROCESS)) {
        return;
      }
      if (this.asyncLogin) {
        return;
      }
      this.asyncLogin = true;
      let that = this;
      window.addEventListener("storage", function (e) {
        if (window.localStorage.getItem(this.ASYNC_LOGIN_PROCESS)) {
          return;
        }
        that.asyncLogin = false;
        that.ajaxRequests.forEach(request => {
          sAjax(request, true);
        });
        that.ajaxRequests = [];
      });
      if (this.$router.currentRoute.path.indexOf('employment') >= 0) {
        return;
      }
      this.$toast("登录信息已超时");
    }
  },
  mounted: function () {
    var timer = null;
    var that = this;
    $(window)
      .off("resize")
      .on("resize", function () {
        timer && clearTimeout(timer);
        timer = setTimeout(() => {
          that.windowObj2.width = window.innerWidth;
          that.windowObj2.height = window.innerHeight;
        }, 300);
      });
  }
};
</script>
<style lang="less">
</style>
