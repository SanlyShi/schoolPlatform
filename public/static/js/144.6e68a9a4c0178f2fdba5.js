webpackJsonp([144],{"1mFA":function(e,t){},BEQi:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=a("C331"),r=a("Gme2"),i=a("8c0Y"),n=(r.a,i.a,{data:function(){return{title:{},websiteName:"",pageType:0,components:"accountinfo",update:!1,curRoute:"",navList:[],userInfo:{},bread:[],showNavList:!this.$route.params.hideMenu,fullscreenLoading:!0}},components:{EmHeader:r.a,EmUser:i.a},beforeCreate:function(){document.querySelector("body").setAttribute("style","background-color:#f6f6f8")},beforeDestroy:function(){document.querySelector("body").removeAttribute("style")},computed:{},created:function(){},methods:{_getRouteObj:function(e){var t=this,a=arguments.length>1&&void 0!==arguments[1]&&arguments[1],s={};return s.title=e.name,e.url&&e.url.indexOf("?id=")>=0?(this.$set(s,"route",e.url.split("?id=")[0]),this.$set(s,"isHide",e.isHide),this.$set(s,"data",this._getParams(e.url))):(this.$set(s,"route",e.url),this.$set(s,"isHide",e.isHide)),e.subMenus&&e.subMenus.length>0&&(this.$set(s,"open",a),s.children||this.$set(s,"children",[]),e.subMenus.sort(this.compare("sort")).forEach(function(e){s.children.push(t._getRouteObj(e))})),s},compare:function(e){return function(t,a){return t[e]-a[e]}},addBread:function(e){var t=null;t=e;var a=!1;this.bread.forEach(function(e,s){e.route===t.route?(t.open=!0,e.active=!0,a=!0):e.open=!1}),a||(t.data||(this.$set(t,"data",this._getParams(t.route)),t.open=!0,t.active=!0),this.bread.push(t)),this.curRoute=t.route},_getParams:function(e){var t={};if(-1!==e.indexOf("?"))for(var a=e.substr(e.indexOf("?")+1).split("&"),s=0;s<a.length;s++)t[a[s].split("=")[0]]=unescape(a[s].split("=")[1]);return t},_checkLogin:function(){var e=this,t=this;Object(s.e)({url:"/login/check",type:"get",success:function(a){a.state&&(t.user=a.data,t.userInfo=a.data,a.data.email&&(e.userInfo.email=a.data.email.replace(a.data.email.substring(3,7),"****")))}})},_getMenu:function(){var e=this;Object(s.e)({url:"/api/employment/menu/getMenu",type:"get",success:function(t){if(t.state){var a=t.data;if(a.length||(e.$message.error("无任何权限"),e.$router.push("/employment/index")),a.forEach(function(t,a){if(e._getRouteObj(t,0===a).children)for(var s=e._getRouteObj(t,0===a).children,r=0;r<s.length;r++)e.addBread(s[r]);else e.addBread(e._getRouteObj(t,0===a));e.navList.push(e._getRouteObj(t,0===a)),1==t.isHide&&e.navList.splice(a,1)}),e.navList[0].children?e.curRoute=e.navList[0].children[0].route:e.curRoute=e.navList[0].route,e.$route.params.toPage){if(e.curRoute=e.$route.params.toPage,e.$route.params.toPage="",e.$route.params.hasParent){var s=e.$route.params.hasParent;e.navList.map(function(e){e.title==s&&(e.open=!0)})}delete e.$route.params.toPage,delete e.$route.params.hasParent}}else e.$toast(t.message);e.fullscreenLoading=!1}})},toPage:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:void 0,a=!(arguments.length>2&&void 0!==arguments[2])||arguments[2];if(this.curRoute=e,"/manage/statistics"!=e&&"/manage/sourceStatistics"!=e||(this.showNavList=a),t)for(var s=0;s<this.navList;s++)this.navList[s].title==t&&(this.navList[s].open=!0)}},mounted:function(){this._checkLogin(),this._getMenu()}}),o={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{attrs:{id:"employmentLayoutWarp"}},[a("div",{staticClass:"em-header"},[a("em-header",{attrs:{title:e.title}},[a("em-user",{attrs:{slot:"top-nav",isShowConsole:!1,pageType:e.pageType,user:e.userInfo},slot:"top-nav"})],1)],1),e._v(" "),a("div",{staticClass:"em-content"},[a("div",{directives:[{name:"loading",rawName:"v-loading.fullscreen.lock",value:e.fullscreenLoading,expression:"fullscreenLoading",modifiers:{fullscreen:!0,lock:!0}}],staticClass:"box",attrs:{id:"employmentLayout","element-loading-text":"拼命加载中"}},[e.showNavList?a("div",{staticClass:"v-nav-toggle left-toggle"},[a("v-list",{ref:"tree",staticClass:"nav-tree",attrs:{id:"nav-tree",iconView:!1,items:e.navList,curRoute:e.curRoute},on:{addBread:e.addBread}})],1):e._e(),e._v(" "),a("div",{class:["col-sm-12",e.showNavList?"":"fullScreen"],attrs:{id:"layoutContent"}},e._l(e.bread,function(t,s){return a("transition",{key:s},[e.curRoute==t.route?a("router-view",{attrs:{name:t.route.split("?")[0],isFull:!e.showNavList,role:t.data&&t.data.id,data:t,userInfo:e.userInfo},on:{addBread:e.addBread,toPage:e.toPage}}):e._e()],1)}),1)])])])},staticRenderFns:[]};var u=a("C7Lr")(n,o,!1,function(e){a("1mFA"),a("sIXA")},"data-v-0ec312ca",null);t.default=u.exports},sIXA:function(e,t){}});