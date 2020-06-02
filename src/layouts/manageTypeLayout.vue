<!--最后修改时间：2017-11-30
  props:{
  是否显示伸缩按钮
    navToggle: true,
    是否显示侧边栏
    sidebarShow:true,
    显示布局类型，主要有4类，'left','left-absolute','right','right-absolute'
    layoutType: 'left',
    侧边栏导航选项
    navList:{
        default:function(){
          return []
        }
      },
      顶部栏初始化数据
      headItems:{
        default:function(){
          return []
        }
      },
      账号管理部分数据
      account:{
        default:function(){
          return {
            userName: '未登录',
            userId: '',
            options: []
        }
        }
      }
  }
-->
<template>
  <div class="login" v-if="toTestEnv">
    <div class="logincontent">
      <div class="container-fluid">
        <h2>登录</h2>
        <p class="text-muted">{{ testEnvName }}</p>
        <hr />
        <div class="form-group">
          <label>学工号</label>
          <input type="text" class="form-control" v-model="userid" @keyup="_keypressToLogin" />
        </div>
        <div class="form-group">
          <label>密码</label>
          <input type="password" class="form-control" v-model="password" @keyup="_keypressToLogin" />
        </div>
        <div class="form-group">
          <input
            id="login-to-test"
            type="button"
            class="btn btn-primary btn-lg"
            :class="logining ? 'disabled' : ''"
            :value="logining ? '登录中' : '登录'"
            @click="loginToTestEnv"
          />
        </div>
      </div>
    </div>
  </div>
  <div id="async-login-tip" v-else-if="isAsyncLoginWindow">
    登录成功，将在3s后
    <a href="javascript:void(0)" @click="closeAsyncLogin">关闭本窗口</a>
  </div>
  <div
    id="main"
    class="page-header-fixed"
    :class="[account&&account.type === 'FRESHMAN'?'green-style':'blue-style', theme, show?'reset-container':'']"
    v-else
  >
    <div id="async-login" v-if="asyncLogin" @click="toAsyncLogin">
      <i class="maticon">open_in_new</i>
      <br />弹出登录窗口
    </div>
    <a class="exchangelan" @click="changeLan" v-if="false">{{lang==='en'?'English':'中文'}}</a>
    <reset-password
      :showUserNo="loginWay=='FRESHMAN'?false:true"
      :number="account.userNo"
      :showIdCard="false"
      :showOldPassword="true"
      :userNoDisabled="true"
      @close="forget = false"
      v-if="forget"
    ></reset-password>
    <v-nav
      :items="headItems"
      :account="account"
      :sysTitle="sysTitle"
      :search="false"
      :class="[headerShow?'':'hide-nav']"
      style="margin-bottom: 0;"
    >
      <div
        slot="menu-toggle"
        class="menu-toggle pull-left"
        @click="toggle(0)"
        v-if="navList&&navList.length>0"
      >
        <i class="maticon" title="隐藏/显示菜单" v-html="icons('menu')"></i>
      </div>
      <div slot="bread" class="bread-container" v-if="breadShow">
        <v-bread
          class="bread"
          :items="bread"
          :curRoute="curRoute"
          @changeRoute="changeRoute"
          @refreshRoute="_refresh"
          @removeBread="removeBread"
        >
          {{historyBread}}
          <!-- 此处是为了让历史访问路由生效 -->
        </v-bread>
      </div>
      <!-- <div slot="clear-toggle" class="clear-toggle pull-right">
        <i class="maticon" title="清除所有tab" @click="clearAllBreads" v-html="icons('clear_all')">clear_all</i>
        <i class="maticon" title="刷新当前tab" @click="_refresh" v-html="icons('refresh')">refresh</i>
      </div>-->
      <div
        slot="toggle"
        class="container-fluid text-center slide-toggle"
        @click="toggle(1)"
        v-show="!headerShow"
      >
        <i
          class="glyphicon glyphicon-menu-down"
          :class="{
          'rotate-180': headerShow
        }"
        ></i>
      </div>
      <v-account
        slot="account"
        class="nav navbar-nav navbar-right"
        :account="account"
        @logout="logout"
        @messageToggle="messageShow = !messageShow"
        v-if="account"
      >
        <div slot="msg">
          <el-dropdown :class="{active: haveUnread}" trigger="click" @visible-change="dropChange">
            <i
              class="maticon pull-left"
              v-html="icons('notifications')"
              @click="_refreshMessageList"
              style="margin-right:4px;"
            ></i>
            <el-dropdown-menu v-if="!messageShow" slot="dropdown" style="top:60px" class="msg-list">
              <!-- <span class="square"></span> -->
              <div class="message-box">
                <div class="message-title">
                  <span>消息中心</span>
                  <div data-stop-propagation="true" @click="_readAll" class="all-read">全部标为已读</div>
                </div>
                <div class="message-body">
                  <div v-if="messageBoxData.length>0">
                    <div
                      v-for="(item, index) in messageBoxData"
                      :key="index"
                      class="message-list box_flex flex_between"
                      :class="{unread: !item.isRead}"
                      @click="_checkMessage(item)"
                    >
                      <p class="msg-cnt">
                        <span>【{{messageBoxState.messageTypeJson[item.type]|| '其它类型'}}】</span>
                        <span>{{item.title}}</span>
                      </p>
                      <div class="msg-date">{{item.hours||'创建时间未知'}}</div>
                    </div>
                  </div>
                  <div v-else class="message-list flex_center" style="padding: 20px">暂无消息</div>
                </div>
              </div>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </v-account>
    </v-nav>
    <div
      class="page-container container-fluid"
      :class="{
        'full-screen': !headerShow
      }"
    >
      <!-- 侧边导航开始 -->
      <div class="page-content row">
        <div
          class="v-nav-toggle"
          :class="[layoutType+'-toggle', {'left-transform': !show}]"
          v-if="layoutType==='left'||layoutType==='left-absolute'"
        >
          <!-- <div class="toggle-icon pull-right" @click="toggle" v-if="navToggle">
            <i class="glyphicon glyphicon-chevron-left" v-if="show"></i>
            <i class="glyphicon glyphicon-chevron-right" v-else></i>
          </div>-->
          <v-list
            id="nav-tree"
            class="nav-tree"
            ref="tree"
            :iconView="false"
            :items="navList"
            @addBread="addBread"
          ></v-list>
        </div>
        <div
          class="col-sm-12 page"
          :class="{
          'left-show': layoutType==='left' && show,
          'right-show': layoutType==='right' && show
        }"
          :style="{
            'margin-left': show&&false?'54px':0
          }"
        >
          <!-- <transition v-for="(item,i) in bread" :key="i">
            <router-view :name="item.route.split('?')[0]" :role="item.data&&item.data.id" :data="item" :account="account" v-show="curRoute === item.route" @fullScreen="_setFullScreen" @addBread="addBread" v-if="!(curRoute === item.route&&curRoute === update)"></router-view>
          </transition>-->
          <keep-alive> 
            <router-view v-if="showRouterView && $route.meta.keepAlive" @addBread="addBread" :role="$route.query&&$route.query.id" @fullScreen="_setFullScreen"></router-view>
          </keep-alive> 
          <router-view v-if="showRouterView && !$route.meta.keepAlive" @addBread="addBread" :role="$route.query&&$route.query.id" @fullScreen="_setFullScreen"></router-view>
        </div>
        <div
          class="v-nav-toggle"
          :class="layoutType+'-toggle ' + (show?'':'right-transform')"
          v-if="layoutType==='right'||layoutType==='right-absolute'"
        >
          <!-- <div class="toggle-icon pull-left" @click="toggle" v-if="navToggle">
            <i class="glyphicon glyphicon-chevron-right " v-if="show"></i>
            <i class="glyphicon glyphicon-chevron-left" v-else></i>
          </div>-->
          <v-list
            id="nav-tree"
            class="nav-tree"
            ref="tree"
            :iconView="!show"
            :items="navList"
            @addBread="addBread"
          ></v-list>
        </div>
      </div>
      <div class="preview-container" v-if="layoutManageJson.preview">
        <preview
          :data="layoutManageJson.layoutsJson[layoutManageJson.curInfoId]&&layoutManageJson.layoutsJson[layoutManageJson.curInfoId].components"
          :defaultData="layoutManageJson.instanceJson[layoutManageJson.curInfoId]"
          :log="layoutManageJson.logsJson[layoutManageJson.curInfoId]"
          :script="layoutManageJson.layoutsJson[layoutManageJson.curInfoId]&&layoutManageJson.layoutsJson[layoutManageJson.curInfoId].property&&layoutManageJson.layoutsJson[layoutManageJson.curInfoId].property.script"
          :previewType="'form'"
          :infoSetting="{
            tabs: layoutManageJson.infoTypes,
            curInfoId: layoutManageJson.curInfoId
          }"
          @tabExchange="_initInfoType"
          @submit="_getInfoValue"
          @submitAll="_submitAll"
          @search="_getInfoTypes(null, $event)"
          @back="layoutManageJson.preview = false"
        ></preview>
      </div>
    </div>
    <div class="message-cover" @click="messageShow = false" v-if="messageShow">
      <div class="message-cover-content" @click.stop>
        <message
          :data="curMessage"
          @receive="_messageReceived"
          @close="_closeMessageModel"
          v-if="curMessage"
        ></message>
      </div>
    </div>
    <!-- <v-modal :show="messageShow" effect="fade" width="450">
      <div slot="modal-header" class="modal-header">
        <h5 class="modal-title">消息详情</h5>
      </div>
      <div slot="modal-body" class="modal-body" v-if="curMessage">
        <message :data="curMessage"></message>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <a
          type="button"
          class="btn cancel-btn clearBtnBorder"
          @click="messageShow = false;curMessage = null"
        >关闭</a>
      </div>
    </v-modal>-->
  </div>
</template>

<script>
import Vue from "vue";
import $ from "jquery";
import crypto from "crypto";
import { sAjax, translation, getIcons } from "../assets/utils/utils.js";
import VNav from "../components/VNav.vue";
import VList from "../components/VList.vue";
import VBread from "../components/VBread.vue";
import Message from "../pages/messageBox/message.vue";
import { setTimeout } from "timers";
Vue.component("v-nav", VNav);
Vue.component("v-list", VList);
Vue.component("v-bread", VBread);
Vue.component("message", Message);

const ASYNC_LOGIN_CACHE_FLAG = "ASYNC_LOGIN_CACHE_FLAG";
const ASYNC_LOGIN_WINDOW = "async_login_window";

export default {
  props: {
    navToggle: {
      default: true
    },
    sidebarShow: {
      default: true
    },
    breadShow: {
      default: true
    },
    layoutType: {
      default: "right"
    },
    defaultLang: {
      default: "zh-cn"
    },
    navList: {
      default: function() {
        return [];
      }
    },
    headItems: {
      default: function() {
        return [];
      }
    },
    account: {
      default: function() {
        return null;
      }
    },
    asyncLogin: {
      default: false
    }
  },
  created: function() {
      let arr = []
      let m = 0
      if(sessionStorage.getItem('bread')){
        JSON.parse(sessionStorage.getItem("bread")).forEach((item,index)=>{
        if(this.$route.path.split('?')[0] == this.$route.path){
          arr.push(item)
        }
        if(item.title == '首页'){
          m = 1
        }
      })
      if(m==0){
        arr.unshift({
        closeable:false,
        data:null,
        lang:"zh-cn",
        route:"/",
        title:"首页"
      })
      }
      this.bread = arr
    }
    else{
      if(this.$route.path != '/platform'){
        arr.push({
        closeable:false,
        data:null,
        lang:"zh-cn",
        route:"/",
        title:"首页"
      })
      let path = ''
      if(this.$route.path.indexOf('mmm')>-1){
        path = `${this.$route.path}?id=${this.$route.query.id}` 
      }else{
        path = this.$route.path
      }
      let nowObj = {
        closeable:true,
        data:null,
        lang:"zh-cn",
        route:`${path}`,
        title:"访问页"
      }
      if(this.$route.query.id){
        nowObj.data = {}
        nowObj.data['id'] = this.$route.query.id
      }
      arr.push(nowObj)
      sessionStorage.setItem("nowRoute",path)

      this.bread = arr
      }
    }
    if (sessionStorage.getItem("nowRoute")) {
      this.curRoute = sessionStorage.getItem("nowRoute");
    }
    var la = localStorage.getItem("lang");
    if (translation(la)) {
      this.lang = la;
    }
    if (/^\/school\/(\w+)/.test(this.$route.path)) {
      this.testEnvId = this.$route.params.id;
      this.toTestEnv = true;
    } else {
      this._checkAccount();
    }
    this._getSystemName();
    this._messageBoxPage();
    this.isAsyncLoginWindow = window.name === ASYNC_LOGIN_WINDOW;
    this.show = this.navList && this.navList.length > 0 ? true : false;
    Vue.prototype.$addBread = obj => {
      this.addBread(obj);
    };
    Vue.prototype.$removeBread = obj => {
      this.removeBread(obj);
    };
    Vue.prototype.$refreshBread = obj => {
      this._refresh(obj);
    };
  },
  data: function() {
    return {
      isRefresh:0,
      loginWay: "",
      show: this.sidebarShow,
      headerShow: true,
      bread: [
        {
          title: "首页",
          route: "",
          closeable: false,
          lang: this.defaultLang,
          data: null
        }
      ],
      username: "测试",
      schoolId: "",
      userid: "",
      password: "",
      schools: [],
      curRoute: "",
      update: false,
      toTestEnv: false,
      testEnvId: "",
      testEnvName: "",
      logining: false,
      isAsyncLoginWindow: false,
      accountOptions: [],
      theme: "",
      sysTitle: "",
      forget: false,
      checkCountInterval: null,
      layoutManageJson: {
        infoTypes: [],
        layoutsJson: {},
        logsJson: {},
        instanceJson: {},
        preview: false,
        curInfoId: "",
        distributary: "owner",
        infomationType: "",
        userId: ""
      },
      optionLabelJson: {
        student: "学生信息查看",
        instructor: "辅导员信息查看",
        teacher: "教工信息查看"
      },
      messageBoxData: [],
      messageShow: false,
      messageBoxState: {
        tab: "inform",
        listShow: false,
        refresh: false,
        messageTypeJson: {
          "1": "缴费消息",
          "2": "表单变动",
          "3": "平台消息"
        }
      },
      curMessage: null,
      messageShow: false,
      showRouterView: true,
    };
  },
  computed: {
    translate: function() {
      return translation(this.lang).manageTypeLayout;
    },
    historyBread: function() {
      var arr = [];
      this.bread.forEach((b, i) => {
        if (b.route !== this.curRoute) {
          arr.splice(0, 0, b.route);
        }
      });
      arr.splice(0, 0, this.curRoute);
      return arr;
    },
    haveUnread: function() {
      var have = false;
      this.messageBoxData.forEach(message => {
        if (!message.isRead && !message.settingInputPO.isSystem) {
          have = true;
        }
      });
      return have;
    }
  },
  watch: {
    navList: {
      deep: true,
      handler: function() {
        this.show = this.navList && this.navList.length > 0 ? true : false;
      }
    }
  },
  mounted: function() {
    window.onbeforeunload = function(e) {
      e.preventDefault();
    };
    if (this.isAsyncLoginWindow) {
      setTimeout(() => {
        this.closeAsyncLogin();
      }, 3000);
    }
    // this._forbidBack();
    // if(this.$router.path.indexOf('mmm')>-1){
    //   this.$route.meta.keepAlive = false
    // }
    // else{
    //   this.$route.meta.keepAlive = true
    // }
  },
  methods: {
    dropChange(val) {
      if (!val) {
        this.messageShow = false;
      }
    },
    _readAll(e) {
      e.stopPropagation();
      this.messageBoxState.listShow = true;
      let idArr = [];
      this.messageBoxData.forEach((item, index) => {
        idArr.push(item.id);
      });
      sAjax({
        url: `/api/message/isRead`,
        type: "post",
        data: {
          id: idArr
        },
        success: data => {
          if (data.state) {
            this.messageBoxData = this.messageBoxData.map(item => {
              item.isRead = true;
              e.stopPropagation();
              // this.$set(item, "isRead", true);
              return item;
            });
          } else {
            this.$toast(data.message);
          }
        }
      });
    },
    _forbidBack: function() {
      // 单页应用，禁用返回，避免误操作
      // var counter = 0;
      // if (window.history && window.history.pushState) {
      //   $(window).on("popstate", function () {
      // window.history.pushState("forward", null, "#");
      // window.history.forward(1);
      //   });
      // }
      // window.history.pushState("forward", null, "#"); //在IE中必须得有这两行
      // window.history.forward(1);
    },
    _refresh: function(item) {
      this.isRefresh = 1
      this.$route.meta.keepAlive = false


      if(item.route.indexOf('mmm')>-1){

      }else{
        this.$router.options.routes[0].children[0].children = this.$router.options.routes[0].children[0].children.map((o)=>{
        if(o.path == ''){
          if(item.route == '/'){
            o.meta.keepAlive = false
            return o
          }else{
            return o
          }
        }
        else{
          if(item.route.indexOf(o.path)>-1){
            o.meta.keepAlive = false
          }
        }
        return o
      })
      }
      
      
      this.$router.push('/platform/app/appMiddle')


      // this.$nextTick(()=>{
      //   this.$route.meta.keepAlive = true
      // })


      // this.showRouterView = false
      // setTimeout(() => {
      //   this.showRouterView = true
      // }, 100)
      // window.location.href = window.location.href
      //  if (item.data != null && item.data.id) {
      //   if (item.route.indexOf("?id") > -1) {
      //     this.$router.push({path:`${item.route}`})
      //   } else {
      //     this.$router.push({path:`${item.route}?id=${item.data.id}`})
      //   }
      // } else {
      //   this.$router.push({path:`${item.route}`})
      //   // this.$router.replace({path:`/platform/appsearch`})
      //   // this.$router.push({path:`/platform/document/studentManage/college?id=college`})
      // }

    },
    _setFullScreen: function(isShow) {
      this.headerShow = !isShow;
      // iconview
      this.show = this.headerShow;
    },
    toggle: function(type) {
      if (type) {
        this.headerShow = !this.headerShow;
        this.show = this.headerShow;
      } else {
        this.show = !this.show;
      }
      $(window).resize();
    },
    addBread: function(item) {
      this.showRouterView = false
      if(item.noGo){

      }else{
        if (item.data != null && item.data.id) {
        // window.location.href = `/platform${item.route}?id=${item.data.id}`
        this.$router
          .push(`/platform${item.route}?id=${item.data.id}`)
        
      } else {
        this.$router.push(`/platform${item.route}`)
      }
      }
      var newItem = null;
      if (
        item.route &&
        (item.route.indexOf("http") === 0 || item.route.indexOf("https") === 0)
      ) {
        newItem = {
          route: "/tip?url=" + item.route,
          title: "外链提示：" + item.title,
          data: {
            tip: `若无法打开外链窗口：请<a href="${item.route}">点击此处</a>站内打开`
          }
        };
        window.open(item.route);
      } else {
        newItem = item;
      }
      if (item.reflash) {
        //需要刷新
        this.bread.forEach((b, index) => {
          if (b.route === item.route) {
            this.bread.splice(index, 1);
          }
        });
      }
      var isExist = false;
      this.bread.forEach((b, index) => {
        if (b.route === newItem.route) {
          isExist = true;
        }
      });
      if (!isExist) {
        if (!newItem.data) {
          this.$set(newItem, "data", this._getParams(newItem.route));
        }
        this.bread.push(newItem);
      }
      this.curRoute = newItem.route;
      sessionStorage.setItem("nowRoute", this.curRoute);
      sessionStorage.setItem("bread", JSON.stringify(this.bread));
      
      this.$nextTick(() => {
        this.showRouterView = true
      })
    },
    removeBread: function(item) {
      this.bread.forEach((b, index) => {
        if (b.route === item.route) {
          this.bread.splice(index, 1);
        }
      });
      if (this.curRoute === item.route) {
        this.curRoute = this.historyBread[1];
        if(this.curRoute.indexOf('mmm')>-1){
          // window.location.href = `${this.curRoute}`
          this.$router.push(`${this.curRoute}`)
        }
      }
      //如果只剩一个
      if (this.bread.length == 1) {
        this.$router.push("/");
        sessionStorage.removeItem("bread");
      } else {

        //如果关闭的是本身，跳到最后一个路由
        let lastIndex = this.bread.length - 1;
        if (this.$route.path.indexOf(item.route) >-1 || item.route.indexOf(this.$route.path) >-1) {
         if(this.bread[lastIndex].route.indexOf('platform')>-1){
          //   if (this.bread[lastIndex].data && this.bread[lastIndex].data.id) {
          //   this.$router.push(`${this.bread[lastIndex].route}?id=${this.bread[lastIndex].data.id}`);
          // } else {
            // this.$router.push(`${this.bread[lastIndex].route}`);
            this.changeRoute(this.bread[lastIndex])
          // }
         }else{
            if (this.bread[lastIndex].data && this.bread[lastIndex].data.id) {
            this.$router.push(`/platform${this.bread[lastIndex].route}?id=${this.bread[lastIndex].data.id}`);
          } else {
            this.$router.push(`/platform${this.bread[lastIndex].route}`);
          }
         }
        }
      }
      sessionStorage.setItem("bread", JSON.stringify(this.bread));
      sessionStorage.setItem("nowRoute", this.curRoute);
    },
    _getParams: function(url) {
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
    changeRoute: function(r) {
      if(this.isRefresh == 1){
        this.isRefresh = 0
      }
      else{
        // if(r.route.indexOf('mmm')<0){
        //   this.$route.meta.keepAlive = true
        // }else{
        //   this.$route.meta.keepAlive = false
        // }
        this.showRouterView = false
      if (r.route.indexOf("/platform") > -1) {
        if (r.data != null && r.data.id && !(r.route.indexOf("id") > -1)) {
          if(r.route.indexOf('mmm')>-1){
            // window.location.href = `${r.route}?id=${r.data.id}`
          }else{
            this.$router.push(`${r.route}?id=${r.data.id}`);
          }
        } else if (r.data != null && r.data.id && r.route.indexOf("id") > -1) {
           if(r.route.indexOf('mmm')>-1){
            // window.location.href = `${r.route}`
          }else{
            this.$router.push(`${r.route}`);
          }
          this.$router.push(`${r.route}`);
        } else {
          this.$router.push(`${r.route}`);
        }
      } else {
        if (r.data != null && r.data.id) {
          if(r.route.indexOf('mmm')>-1){
            //  window.location.href = `/platform${r.route}?id=${r.data.id}`
          }else{
            this.$router.push(`/platform${r.route}?id=${r.data.id}`);
          }
        } else {
          this.$router.push(`/platform${r.route}`);
        }
      }
      sessionStorage.setItem("nowRoute", this.curRoute);
      sessionStorage.setItem("bread", JSON.stringify(this.bread));

      this.layoutManageJson.preview = false;
      this.$nextTick(() => {
        this.showRouterView = true
      })

      }
      
    },
    clearAllBreads: function() {
      this.curRoute = this.bread[0].route;
      this.bread.splice(1);
    },
    changeLan: function() {
      this.lang = this.lang === "zh-cn" ? "en" : "zh-cn";
      localStorage.setItem("lang", this.lang);
      window.location.reload();
    },
    _keypressToLogin: function(e) {
      if (e.keyCode === 13) {
        this.loginToTestEnv();
      }
    },
    _checkAccount: function() {
      this.$waiting.show();
      sAjax({
        url: "/login/check",
        type: "get",
        async: false,
        success: data => {
          if (!data.state) {
            return this.$emit("initAccount", null);
          }
          this.loginWay = data.data.type;
          let loginType = data.data.loginType;
          let type = data.data.type;
          let loginWay = data.data.loginWay;
          sAjax({
            url: "/api/relationship/instructor/check",
            type: "get",
            success: res => {
              if (res.state) {
                if (res.data && res.data.length > 0) {
                  res.data.forEach(role => {
                    var opt = {};
                    if (role && this.optionLabelJson[role]) {
                      opt.title = this.optionLabelJson[role];
                      opt.callback = () => {
                        this._resetLayoutManageJson();
                        this.layoutManageJson.infomationType = role.toUpperCase();
                        this.layoutManageJson.userId = data.data.id;
                        this.$waiting.show();
                        this._getInfoTypes(() => {
                          this.$waiting.close();
                          this._initInfoType(
                            this.layoutManageJson.infoTypes[0]
                          );
                        });
                      };
                      this.accountOptions.push(opt);
                    }
                  });
                  if (res.data.indexOf("student") >= 0) {
                    this.accountOptions.push({
                      title: "第二课堂成绩单",
                      callback: () => {
                        window.open(`/sc/report`);
                      }
                    });
                  }
                }
              }
              this.accountOptions.push({
                title: "缴费记录",
                callback: () => {
                  this.addBread({
                    route: "/payHall/payHallRecords",
                    title: "缴费记录"
                  });
                }
              });
            }
          }).always(() => {
            // if (loginType === "ixy" ) {
            if (type == "FRESHMAN" || loginWay == "workPlatform") {
              this.accountOptions.push({
                title: "密码修改",
                callback: () => {
                  this.forget = true;
                }
              });
            }
            this.$emit("initAccount", {
              userId: data.data.id,
              userName: data.data.name,
              userNo: data.data.userNo,
              type: data.data.type,
              loginType: data.data.loginType,
              options: this.accountOptions
            });
            this.schoolId = data.data.schoolId;
            Vue.prototype.$account = data.data;
            if (data.data.type === "FRESHMAN") {
              let routeInfo = {
                      title: "首页",
                      route: "/freshman/freshmanMainPage",
                      closeable: false,
                      lang: this.defaultLang,
                    }
              this.$set(this.bread, 0, routeInfo)
              this.curRoute = "/freshman/freshmanMainPage"
              this.changeRoute(this.bread[0])
            } else {
              if (this.$route.query.sys === "ca") {
                //课堂考勤特殊处理
                function setCaRoute() {
                  if (this.navList.length) {
                    if (this.navList[0].children.length) {
                      let curRoute = this.navList[0].children[0];
                      this.$set(this.bread, 0, {
                        title: curRoute.title,
                        route: curRoute.route,
                        closeable: false,
                        lang: this.defaultLang,
                        data: this._getParams(curRoute.route)
                      });
                      this.curRoute = curRoute.route;
                      this.changeRoute(this.bread[0])
                      return;
                    }
                  } else {
                    setTimeout(() => {
                      setCaRoute.call(this);
                    }, 300);
                    return;
                  }
                }
                setCaRoute.call(this);
                return;
              } else if (this.$route.query.sys === "fts") {
                // 家校通首页处理
                let routeInfo = {
                        title: "首页",
                        route: "/familyToSchool/home?sys=fts",
                        closeable: false,
                        lang: this.defaultLang,
                      }
                this.$set(this.bread, 0, routeInfo)
                this.curRoute = "/familyToSchool/home?sys=fts"
                this.changeRoute(this.bread[0])
              } else {
                this.$set(this.bread[0], "route", "/");
                this.curRoute = "/";
              }
            }
          });
        }
      }).always(() => {
        this.$waiting.close();
      });
    },
    _startCheckAccount: function() {
      let interval = 900 * 1000;
      setTimeout(() => {
        this.checkCountInterval = setInterval(() => {
          this._checkAccount();
        }, interval);
      }, interval);
    },
    _getTestEnvName: function() {
      sAjax({
        url: `/school/${this.testEnvId}/name`,
        type: "get",
        success: data => {
          if (data.state) {
            this.testEnvName = data.data || "i校园学工平台";
            document.title = this.testEnvName;
          } else {
            this.$toast(data.message);
          }
        }
      });
    },
    _getSystemName: function() {
      sAjax({
        url: `/system/name`,
        type: "get",
        success: data => {
          if (data.state) {
            this.sysTitle = data.data || "i校园学工平台";
            document.title = this.sysTitle;
          } else if (!data.unauthorized) {
            this.$toast(data.message);
          }
        }
      });
    },
    loginToTestEnv: function() {
        sessionStorage.removeItem("bread")
    sessionStorage.removeItem("nowRoute")
    sessionStorage.removeItem("activeRoute")
    
      var password = crypto
        .createHash("md5")
        .update(this.password)
        .digest("hex");
      var loginResult = { state: false, message: "连接超时" };
      sAjax({
        url: `/school/${this.testEnvId}/login`,
        type: "post",
        data: {
          userNo: this.userid,
          password: password
        },
        success: data => {
          loginResult = data;
          if (loginResult.state) {
            if (loginResult.data.redirect) {
              window.location.href = loginResult.data.redirect;
              // this.toTestEnv = false
              return;
            }
            this.$emit("initAccount", {
              userId: loginResult.data.id,
              userName: loginResult.data.name,
              type: loginResult.data.type
            });
          } else {
            this.$toast(loginResult.message);
          }
        }
      });
    },
    toAsyncLogin: function() {
      window.localStorage.setItem(ASYNC_LOGIN_CACHE_FLAG, true);
      window.open(
        `${window.location.origin}/${this.schoolId}/login`,
        ASYNC_LOGIN_WINDOW,
        "menubar=0,titlebar=0,toolbar=0,width=600,height=600,left=300,top=100"
      );
    },
    closeAsyncLogin: function() {
      window.localStorage.removeItem(ASYNC_LOGIN_CACHE_FLAG);
      window.close();
    },
    logout: function() {
      sAjax({
        url: "/logout",
        type: "get",
        success: data => {
          if (data.state) {
            this.$emit("initAccount", null);
            this.clearAllBreads();
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

    // 查看个人信息
    _initInfoType: function(tab) {
      // 获取布局
      if (!tab) {
        return;
      }
      if (
        !(
          this.layoutManageJson.layoutsJson[tab.id] &&
          this.layoutManageJson.logsJson[tab.id]
        )
      ) {
        this.$waiting.show({
          container: ".preview-container"
        });
        sAjax({
          url: `/api/information/my/infoSettings/${this.layoutManageJson.infomationType}/${tab.id}`,
          type: "get",
          data: {
            // userId: this.layoutManageJson.userId,
            distributary: this.layoutManageJson.distributary
          },
          success: data => {
            if (data.state) {
              if (!data.data) {
                data.data = [];
              }
              data.data.components.forEach(ele => {
                this.$set(ele, "x", ele.location.left);
                this.$set(ele, "y", ele.location.top);
                this.$set(ele, "w", ele.size.width);
                this.$set(ele, "h", ele.size.height);
              });
              this.$set(this.layoutManageJson.layoutsJson, tab.id, data.data);
              this.layoutManageJson.curInfoId = tab.id;
              // 获取操作日志
              sAjax({
                url: `/api/information/my/changeLogs/${tab.id}`,
                type: "get",
                // data: {
                //   userId: this.layoutManageJson.userId
                // },
                success: data => {
                  if (data.state) {
                    this.$set(
                      this.layoutManageJson.logsJson,
                      tab.id,
                      data.data || []
                    );
                    this.layoutManageJson.preview = true;
                  } else {
                    this.$toast(data.message);
                  }
                }
              });
            } else {
              this.$toast(data.message);
            }
          }
        }).always(() => {
          this.$waiting.close();
        });
      } else {
        this.layoutManageJson.curInfoId = tab.id;
        this.$nextTick(() => {
          this.layoutManageJson.preview = true;
        });
      }
    },
    _getInfoValue: function(obj) {
      // 获取当前类型数据
      this.$set(
        this.layoutManageJson.instanceJson,
        this.layoutManageJson.curInfoId,
        obj
      );
    },
    _submitAll: function() {
      // 提交全部修改记录
      var arr = [];
      for (var i in this.layoutManageJson.instanceJson) {
        arr.push({
          infoId: i,
          formData: this.layoutManageJson.instanceJson[i].formData
        });
      }
      if (arr.length === 0) {
        this.$toast("暂无需保存记录");
        return;
      }
      this.$waiting.show();
      let data = {
        typesValue: arr
      };
      if (this.layoutManageJson.infomationType === "INSTRUCTOR") {
        data.source = "MY_INSTRUCTOR";
      } else {
        data.source = "MY_STUDENT";
      }
      sAjax({
        url: `/api/information/infoInstance/${this.layoutManageJson.infomationType}/${this.layoutManageJson.distributary}/${this.layoutManageJson.userId}`,
        type: "post",
        data: data,
        success: data => {
          if (data.state) {
            this.$toast("保存成功");
            this.layoutManageJson.instanceJson = {};
            // this.layoutManageJson.preview = false
          } else {
            this.$toast(data.message);
          }
        }
      }).always(() => {
        this.$waiting.close();
      });
    },
    _getInfoTypes: function(cb, searchContent) {
      sAjax({
        url: `/api/information/columnTypes/${this.layoutManageJson.infomationType}`,
        type: "get",
        data: {
          searchContent: searchContent
        },
        success: data => {
          if (data.state) {
            if (data.data && data.data.length > 0) {
              this.layoutManageJson.infoTypes = data.data || [];
              this.layoutManageJson.infoTypes.forEach(type => {
                this.$set(type, "title", type.text);
              });
              cb && cb();
            } else {
              this.$toast("信息类型为空，不可查看");
            }
          } else {
            this.$toast(data.message);
          }
        }
      });
    },
    _resetLayoutManageJson: function() {
      this.layoutManageJson.layoutsJson = {};
      this.layoutManageJson.logsJson = {};
      this.layoutManageJson.instanceJson = {};
      this.layoutManageJson.curInfoId = "";
    },

    // 获取消息盒子内容
    _messageBoxPage: function() {
      sAjax({
        url: `/api/message/quiry`,
        type: "get",
        success: data => {
          if (data.state) {
            let messageBoxData = [];
            // this.messageBoxData = data.data || []
            data.data &&
              data.data.forEach(ele => {
                messageBoxData.push(ele);
              });
            this.messageBoxData = messageBoxData;
          } else {
            this.$toast(data.message);
          }
        }
      });
    },
    _closeMessageModel: function() {
      this.messageShow = false;
      this.curMessage = null;
    },
    _refreshMessageList: function() {
      this.messageBoxState.listShow = true;
      this.messageBoxState.refresh = !this.messageBoxState.refresh;
      if (this.messageBoxState.refresh) {
        this._messageBoxPage();
      }
    },
    _messageReceived: function(item) {
      // 确认收到
      sAjax({
        url: `/api/message/alreadyRead/${item.id}`,
        type: "post",
        success: data => {
          if (data.state) {
            this.$set(item, "alreadyReceived", "true");
          } else {
            this.$toast(data.message);
          }
        }
      });
    },
    _checkMessage: function(item) {
      var id = [];
      id.push(item.id);
      if (!item.isRead) {
        sAjax({
          url: `/api/message/isRead`,
          type: "post",
          data: {
            id: id
          },
          success: data => {
            if (data.state) {
              this.$set(item, "isRead", true);
              this.messageShow = true;
              this.curMessage = item;
            } else {
              this.$toast(data.message);
            }
          }
        });
      } else {
        this.messageShow = true;
        this.curMessage = item;
      }
    }
  },
  beforeDestroyed: function() {
    if (this.checkCountInterval) {
      clearInterval(this.checkCountInterval);
    }
  },
  // router
};
</script>
<style lang="less">
@import url("../assets/common.less");
@import url("../assets/newCommon.less");
@import url("../media/css/tableSearch.css");
@import url("../media/css/common.css");
@import url("../media/css/preview.css");
@import url("../media/css/theme.less");
@headerHeight: 66px;
@toggleWidth: 250px;
@breadContainerHeight: 55px;
@logincontentWidth: 600px;
@logincontentHeight: 450px;
@msgBoxWidth: 393px;
@msgBoxHeight: 417px;
@msgBoxHeaderHeight: 37px;
@msgBoxFooterHeight: 50px;
@msgListRight: 70px;
// @minBarWidth: 54px;
@minBarWidth: 0px;
.toggle-icon-leftside-style {
  position: absolute;
  top: @headerHeight;
  right: -20px;
}
.toggle-icon-rightside-style {
  position: absolute;
  top: @headerHeight;
  left: -20px;
}

html,
body,
.page-content {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: relative;
  background: @backColor;
  // /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
  // *::-webkit-scrollbar {
  //   width: 5px;
  //   height: 3px;
  //   background-color: transparent;
  // }

  // /*定义滚动条轨道 内阴影+圆角*/
  // *::-webkit-scrollbar-track {
  //   background-color: transparent;
  // }

  // /*定义滑块 内阴影+圆角*/
  // *::-webkit-scrollbar-thumb {
  //   background-color: #b0b0b0;
  // }
}
.login .dropdown-menu {
  background: none;
  border: none;
  box-shadow: none;
}
.message-box {
  // position: absolute;
  // top: @topHeight;
  // right: -@msgListRight;
  // width: @msgBoxWidth;
  // height: @msgBoxHeight;
  right: -50px;
  width: 372px;
  padding: 0 0 20px;
  border-radius: 10px;
  min-height: 200px;
  overflow: hidden;
  background: #fff;
  // transition: all .5s linear;
  // box-shadow:0px 4px 16px 0px rgba(216,223,226,0.3);
  .message-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    color: #303133;
    font-weight: bold;
    line-height: 50px;
    margin-top: -10px;
    padding: 0 14px 0 30px;
    border-bottom: 1px solid #dcdfe6;
    .all-read {
      width: 100px;
      height: 26px;
      font-size: 14px;
      line-height: 24px;
      text-align: center;
      border-radius: 2px;
      border: 1px solid #298ef8;
      color: #298ef8;
      cursor: pointer;
    }
  }
  .message-body {
    min-height: 200px;
    max-height: 300px;
    overflow: hidden;
    overflow-y: auto;
  }
  .detail-top {
    padding: 10px 20px 0;
    font-size: 15px;
    color: #303133;
    .close {
      cursor: pointer;
      font-size: 20px;
      color: #666;
    }
  }
  .detail-cnt {
    padding: 0 20px 10px;
    .msg-date {
      text-align: left;
      color: #909399;
    }
    .content {
      margin-top: 10px;
      font-size: 14px;
      color: #303133;
    }
    .model-footer {
      padding: 20px 0;
      text-align: center;
      .receive,
      .disabled {
        color: #333;
        background: #e0e0e0;
        box-shadow: 0 -2px 3px 0 rgba(0, 0, 0, 0.16);
        border-radius: 3px;
        transition: all 0.1s ease;
      }
      .receive {
        color: #fff;
        background: #298df7;
        &:hover {
          background: #6477e2;
        }
      }
    }
  }
  .message-list {
    position: relative;
    padding: 8px 20px;
    // margin: 0 10px;
    // border-bottom: 1px solid #fafafa;
    font-size: 14px;
    color: #909399;
    line-height: 20px;
    cursor: pointer;
    &.unread {
      color: #303133 !important;
      &::before {
        content: "";
        position: absolute;
        left: 14px;
        top: 15px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #298ef8;
      }
    }
  }
  p {
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    display: -webkit-inline-box;
    display: -webkit-box;
    text-overflow: ellipsis;
    overflow: hidden;
    margin: 0;
  }
  .msg-date {
    text-align: right;
    flex: 0 0 100px;
    font-size: #909399;
  }
}
.login {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 11;
  background: @backColor;
  .logincontent {
    position: absolute;
    left: 50%;
    top: 50%;
    width: @logincontentWidth;
    height: @logincontentHeight;
    padding: 20px 10px;
    margin-top: -@logincontentHeight / 2;
    margin-left: -@logincontentWidth / 2;
    background: @frontColor;
    border-radius: 3px;
    -webkit-box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
      0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
      0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
  }
  #login-to-test,
  #login-by-yiban {
    margin-top: 20px;
  }
}
@media screen and (max-width: 600px) {
  .login {
    .logincontent {
      position: relative;
      left: 0;
      top: 0;
      margin: 0;
      width: 100%;
      height: 100%;
      padding: 20px 10px;
      h2,
      p {
        text-align: center;
      }
    }
  }
  #login-to-test,
  #login-by-yiban {
    width: 100%;
  }
}

#main {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 1007;
  .msg-list {
    right: -@msgListRight;
    // width: @msgBoxWidth;
    // height: @msgBoxHeight;
    // margin-top: 5px;
    // box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.19);
    // border-radius: 0;
    .square {
      position: absolute;
      top: -5px;
      right: @msgListRight + 6px;
      display: inline-block;
      width: 10px;
      height: 10px;
      background: #fff;
      transform: rotate(45deg);
    }
    .Geee {
      .gm-scroll-view {
        width: 390px !important;
        height: 330px !important;
      }
    }
    .msg-header {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      height: @msgBoxHeaderHeight;
      white-space: nowrap;
      border-bottom: 1px solid #f0f0f0;
      letter-spacing: -4px; /*根据不同字体字号或许需要做一定的调整*/
      word-spacing: -4px;
      font-size: 0;
      span {
        display: inline-block;
        // width: 50.5%;
        width: 100%;
        line-height: @msgBoxHeaderHeight - 1px;
        font-size: 14px;
        color: #3b3d41;
        letter-spacing: 1px;
        text-align: center;
        background: #fafafa;
        &.open {
          background: #298ef8;
          color: white;
        }
      }
    }
    .msg-content {
      position: absolute;
      top: @msgBoxHeaderHeight;
      left: 0;
      right: 0;
      height: @msgBoxHeight - @msgBoxHeaderHeight - @msgBoxFooterHeight;
      overflow: auto;
      background: #ffffff;
    }
    .msg-footer {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: @msgBoxFooterHeight;
      padding: 10px 5px;
      border-top: 1px solid #f8f8f8;
      span {
        font-size: 14px;
        color: #f4aa35;
        letter-spacing: 0;
        line-height: @msgBoxFooterHeight - 21px;
      }
    }
  }
  .dropdown-item {
    position: relative;
    // max-width: 300px;
    padding: 5px 8px;
    border-top: 1px solid #f8f8f8;
    transition: all 0.1s ease;
    label {
      max-width: 250px;
      color: #333;
      font-size: 14px;
    }
    p,
    span {
      margin: 0;
      color: #999;
      font-size: 12px;
    }
    span {
      margin-right: 20px;
    }
    .item-content {
      font-size: 12px;
      color: #3d4a5d;
      line-height: 22px;
      span {
        margin: 0;
        font-size: 12px;
        color: #3d4a5d;
        line-height: 22px;
      }

      // .msg-type {
      //   margin-left: -8px;
      //   color: #15161a;
      //   line-height: 20px;
      // }
      .msg-time {
        font-size: 12px;
        color: #999;
        letter-spacing: 0;
      }
      // &.read {
      //   color: #999;
      //   span {
      //     color: #999;
      //   }
      // }
    }
    .nowrap {
      // white-space: nowrap;
      // overflow: hidden;
      // text-overflow: ellipsis;

      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .msg-read-tip {
      display: none;
      width: 8px;
      height: 8px;
      border-radius: 100%;
      &.uncheck {
        display: inline-block;
        background: #ff4c4c;
      }
    }

    &:hover {
      background: #d9d9d9;
      cursor: pointer;
    }
  }
  .exchangelan {
    position: fixed;
    bottom: 10px;
    left: 20px;
    z-index: 22;
    display: inline-block;
    width: @headerHeight*1.5;
    height: 32px;
    text-decoration: none;
    color: @fontColor;
    line-height: 32px;
    text-align: center;
    background: @backColor;
    border-radius: 3px;
    cursor: pointer;
  }
  // &.reset-container {
  //   @media screen and (min-width: 768px) {
  //     .container {
  //       width: 750px;
  //     }
  //   }
  //   @media screen and (min-width: 992px) {
  //     .container {
  //       width: 970px;
  //     }
  //   }
  //   @media screen and (min-width: 1200px) {
  //     .container {
  //       width: 1170px;
  //     }
  //   }
  // }
  .nav-container {
    top: 0;
  }
  .hide-nav {
    top: -92px;
  }
  .slide-toggle {
    position: fixed;
    top: -25px;
    left: 50%;
    width: 40px;
    height: 40px;
    margin-left: -20px;
    font-size: 12px;
    line-height: 65px;
    background: rgba(255, 255, 255, 0.67);
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.12);
    border-radius: 100px;
    overflow: hidden;
    cursor: pointer;
    i {
      transition: all 0.1s ease;
    }
    .rotate-180 {
      transform: rotate(180deg);
    }
  }
  .page-container {
    position: fixed;
    top: @headerHeight;
    bottom: 0;
    width: 100%;
    transition: all 0.3s cubic-bezier(0.94, -0.25, 0.32, 1.31);
    z-index: 19; //不能大于19,否则会有bug

    &.full-screen {
      // top: 10px;
      top: 0;
      z-index: 18;
    }
  }
  .bread-container {
    margin: 16px 15px 14px;
  }
  .bread {
    width: 70%;
    margin: 0 auto;
    text-align: center;
  }

  .page-content {
    display: flex;
    height: 100%;
    .page {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      width: auto;
      height: 100%;
      padding: 20px;
      background-color: #eef2f8;
      transition: all 0.3s ease;
      &.left-show {
        left: @toggleWidth;
      }
      &.right-show {
        right: @toggleWidth;
      }
      & > .container-fluid,
      & > .container {
        height: 100%;
      }
    }
  }
  .v-nav-toggle {
    position: fixed;
    z-index: 20;
    top: @headerHeight;
    bottom: 0;
    width: @toggleWidth;
    background: @backColor;
    // transition: all 0.1s cubic-bezier(0.94, -0.25, 0.32, 1.31);
    &.left-absolute-toggle {
      top: @headerHeight;
      left: 0;
      bottom: 0;
      box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.12);
      .toggle-icon {
        .toggle-icon-leftside-style;
      }
    }
    &.right-absolute-toggle {
      top: @headerHeight;
      top: 0;
      right: 0;
      bottom: 0;
      box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.12);
      .toggle-icon {
        .toggle-icon-rightside-style;
      }
    }
    &.left-toggle {
      position: relative;
      top: 0;
      .toggle-icon {
        .toggle-icon-leftside-style;
      }
    }
    &.right-toggle {
      position: relative;
      top: 0;
      .toggle-icon {
        .toggle-icon-rightside-style;
      }
    }
    .nav-tree {
      transition: all 0.3s cubic-bezier(0.94, -0.25, 0.32, 1.31);
      transform: translateX(0px);
    }
  }
  .toggle-icon {
    padding: 10px 5px;
    // background: @frontColor;
    border-radius: 3px;
    cursor: pointer;
  }
  .menu-toggle,
  .clear-toggle {
    padding: 15px;
    i {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.87);
      cursor: pointer;
      transition: all 0.3s ease-out;
      &:hover {
        color: #ff5252;
      }
    }
    font-size: 24px;
    color: rgba(0, 0, 0, 0.87);
    cursor: pointer;
    transition: all 0.3s ease-out;
    &:hover {
      color: #ff5252;
    }
  }
  .nav-tree {
    width: @toggleWidth;
    padding-top: 24px;
    height: 100%;
    &.icon-list {
      width: 54px;
      overflow: visible;
    }
  }
  .left-transform {
    transition: all 0.1s cubic-bezier(0.94, -0.25, 0.32, 1.31);
    width: @minBarWidth;
    .nav-tree {
      transition: all 0.1s cubic-bezier(0.94, -0.25, 0.32, 1.31);
      transform: translateX(-@toggleWidth);
    }
  }
  .right-transform {
    // transition: all 0.3s cubic-bezier(0.94, -0.25, 0.32, 1.31);
    width: @minBarWidth;
    .nav-tree {
      transform: translateX(@toggleWidth);
      // transition: all 0.1s cubic-bezier(0.94, -0.25, 0.32, 1.31);
    }
  }
  // .slide-fade-enter-active {
  //   transition: all 0.3s linear;
  // }
  // .slide-fade-leave-active {
  //   transition: all 0.3s linear reverse;
  // }
  // .slide-fade-enter,
  // .slide-fade-leave-to {
  //   // transform: scale(0.9);
  //   transform: rotateY(90deg) translateX(-100%);
  //   opacity: 0;
  // }
  .message-cover {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
    background: rgba(77, 77, 77, 0.15);
    .message-cover-content {
      position: absolute;
      right: 0;
      top: @headerHeight;
      bottom: 0;
      width: 482px;
      background: #f6f5f1;
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.23);
    }
  }
}
.tip-action {
  margin-top: 100px;
}

#async-login {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 99;
  text-align: center;
  padding-top: 300px;
  color: white;
  background: rgba(0, 0, 0, 0.31);
  cursor: pointer;
  font-size: 18px;
  i {
    font-size: 48px;
    font-weight: 500;
  }
}
#async-login-tip {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 99;
  text-align: center;
  padding-top: 100px;
  color: rgba(0, 0, 0, 0.89);
  font-size: 18px;
}
.clear_p {
  p {
    margin: 0;
    padding: 0;
    height: auto;
    color: #3d4a5d !important;
    display: inline-flex;
  }
}
</style>
