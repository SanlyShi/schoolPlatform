webpackJsonp([30],{iWUo:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=a("C331"),i={props:{data:{default:""}},data:function(){return{curRoute:"",bread:[],geolocation:null,location:null,signId:"",signTabVal:"",wxErr:!1,center:{},userInfo:{},signUrl:"",errText:"",signText:{signIn:"签到",signOut:"签退"},signSuccess:!1}},created:function(){this.signId=this.$route.query.signId,this.signTabVal=this.$route.query.signTabVal,this.getSignUrl()},mounted:function(){},methods:{addBread:function(t){var e=!1;this.bread.forEach(function(a,n){a.route===t.route&&(e=!0)}),e||(t.data||this.$set(t,"data",this._getParams(t.route)),this.bread.push(t)),this.curRoute=t.route},removeBread:function(t){var e=this;e.bread.forEach(function(a,n){a.route===t.route&&e.bread.splice(n,1)}),e.curRoute===t.route&&(e.curRoute=e.historyBread[1]),t.isUpdateLastPage&&this._refresh()},_getParams:function(t){var e={};if(-1!==t.indexOf("?"))for(var a=t.substr(t.indexOf("?")+1).split("&"),n=0;n<a.length;n++)e[a[n].split("=")[0]]=unescape(a[n].split("=")[1]);return e},getDistance:function(t,e,a,n){var i=t*Math.PI/180,s=a*Math.PI/180,r=i-s,o=e*Math.PI/180-n*Math.PI/180,c=2*Math.asin(Math.sqrt(Math.pow(Math.sin(r/2),2)+Math.cos(i)*Math.cos(s)*Math.pow(Math.sin(o/2),2)));return c*=6378.137,c=Math.round(1e4*c)/10},getSignInfo:function(){var t=this,e="api/ca/signIn/"+this.signId;Object(n.d)(e).then(function(e){if(e.data.isLocation){if(!t.location)return t.errText="环境异常,"+t.signText[t.signTabVal]+"失败!",void("micromessenger"==navigator.userAgent.toLowerCase().match(/MicroMessenger/i)?(t.$toast("安卓手机微信无法获取位置信息,请使用浏览器打开"),t.wxErr=!0):(t.$toast("请检查是否禁用了获取位置信息权限"),setTimeout(function(){t.getLocation()},1e3)));if(t.center=e.data.ranges[0],t.center.lat=t.center.latitude,t.center.lng=t.center.longitude,t.getDistance(t.center.latitude,t.center.longitude,t.location.lat,t.location.lng)>e.data.ranges[0].distance)return t.$toast("不在范围内,"+t.signText[t.signTabVal]+"失败!"),void(t.errText=t.signText[t.signTabVal]+"失败!")}else t.location=!1;if(e.data.dynamicCode&&(new Date).getTime()-t.$route.query.timestamp>4e4)return t.$toast("二维码已过期,请重新扫码!"),void(t.errText=t.signText[t.signTabVal]+"失败!");Object(n.d)(t.signUrl).then(function(e){"88888"===e.code?(t.signSuccess=!0,t.userInfo=e.data,t.userInfo.timeStart=t.userInfo.timeStart.replace(/-/g,"/"),t.userInfo.timeEnd=t.userInfo.timeEnd.replace(/-/g,"/"),t.userInfo.signInTime=t.userInfo.signInTime.replace(/-/g,"/")):(t.$toast(e.message),t.errText=t.signText[t.signTabVal]+"失败!","75008"===e.code&&t.addBread({route:"/ISignIn/mobileSignMain",title:""}))}).catch(function(t){})})},getSignUrl:function(){var t=this,e="api/ca/signIn/url/"+this.signId+"/"+this.signTabVal;Object(n.d)(e).then(function(e){e.state?(t.signUrl=e.data,t.getLocation()):t.$toast("请求失败")})},getLocation:function(){var t=this;this.geolocation=new qq.maps.Geolocation("J7MBZ-24CKP-TR6DO-VHSBB-5LASQ-LVBZY","saas"),this.geolocation.getLocation(function(e){t.location=e,t.center=e,t.getSignInfo()},function(e){t.location=!1,t.getSignInfo()})},_back:function(){this.addBread({route:"/ISignIn/mobileSignMain",title:""})}}},s={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return t.curRoute?a("div",{staticClass:"towCodeSignLayout"},t._l(t.bread,function(e,n){return a("transition",{key:n,attrs:{name:"slide-fade"}},[a("router-view",{staticClass:"router-view",style:"z-index:"+(t.curRoute===e.route?100:0)+";",attrs:{curRoute:e,name:e.route.split("?")[0],data:e,account:t.account},on:{addBread:t.addBread,removeBread:t.removeBread}})],1)}),1):t.signSuccess?a("div",[a("div",{staticClass:"header box_flex flex_center"},[a("i",{staticClass:"maticon back-icon",attrs:{slot:"overwrite-left"},domProps:{innerHTML:t._s(t.icons("navigate_before"))},on:{click:t._back},slot:"overwrite-left"},[t._v("navigate_before")]),t._v("\n    "+t._s(t.signText[t.signTabVal])+"成功\n  ")]),t._v(" "),a("div",{staticClass:"main_wrap"},[a("div",[a("div",{staticClass:"text_row"},[a("span",[t._v("姓名："+t._s(t.userInfo.name))])]),t._v(" "),a("div",{staticClass:"text_row"},[t._v("\n        班级："+t._s(t.userInfo.className)+"\n      ")])]),t._v(" "),a("div",{staticClass:"bar"}),t._v(" "),a("div",{staticClass:"sign_wrap box_flex"},[t._m(0),t._v(" "),a("div",{staticClass:"right box_flex column"},[a("div",{staticClass:"text_row"},[t._v("\n          时间："+t._s(new Date(t.userInfo.timeStart).format("yyyy-MM-dd HH:mm"))+"~"+t._s(new Date(t.userInfo.timeEnd).format("HH:mm"))+"\n        ")]),t._v(" "),a("div",{staticClass:"text_row gray"},[t._v("\n          课程："+t._s(t.userInfo.courseName)+"\n        ")]),t._v(" "),a("div",{staticClass:"sign_box"},[t._v("\n          已"+t._s(t.signText[t.signTabVal])+"\n        ")]),t._v(" "),a("div",{staticClass:"text_row bold"},[t._v("\n          "+t._s(t.signText[t.signTabVal])+"时间："+t._s(new Date(t.userInfo.signInTime).format("HH:mm"))+"\n        ")])]),t._v(" "),t.location&&t.userInfo.signInRange?a("div",{staticClass:"text_row gray",staticStyle:{height:"0.64rem",position:"absolute",bottom:"-0.64rem"}},[t._v("\n        "+t._s(t.userInfo.signInRange.address)+"\n      ")]):t._e()])]),t._v(" "),t.location&&t.center.lat?a("div",{staticClass:"map_wrap"},[a("v-map",{attrs:{hideCenter:!0,center:t.center}})],1):t._e()]):a("div",[a("div",{staticClass:"header box_flex flex_center"},[a("i",{staticClass:"maticon back-icon",attrs:{slot:"overwrite-left"},domProps:{innerHTML:t._s(t.icons("navigate_before"))},on:{click:t._back},slot:"overwrite-left"},[t._v("navigate_before")]),t._v("\n    "+t._s(t.errText)+"\n  ")]),t._v(" "),t.wxErr?a("div",{staticStyle:{padding:".2rem"}},[t._v("请点击右上角,用浏览器打开")]):t._e(),t._v(" "),t.location&&t.center.lat?a("div",{staticClass:"map_wrap"},[a("v-map",{attrs:{hideCenter:!0,center:t.center}})],1):t._e()])},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"left flex_shrink box_flex flex_center "},[e("div",{staticClass:"ball top"}),this._v(" "),e("div",{staticClass:"bar"}),this._v(" "),e("div",{staticClass:"ball bottom"})])}]};var r=a("C7Lr")(i,s,!1,function(t){a("qqb1")},"data-v-22d8c08e",null);e.default=r.exports},qqb1:function(t,e){}});