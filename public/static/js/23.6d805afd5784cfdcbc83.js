webpackJsonp([23],{JhrW:function(s,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=a("3cXf"),e=a.n(i),n=a("qqHy"),p=a.n(n),c=a("C331"),r={props:{appData:{default:null},data:{default:null},account:null},data:function(){return{curApp:null,collapsed:!1,headerShow:!0,businessList:[],errorMessage:"",beginTime:"",endTime:"",canApplyOnAuthority:!0,canApplyOnTime:!0}},computed:{curBusiness:function(){var s=this,t=null;return this.businessList.forEach(function(a){a.id===s.curBusinessId&&(t=a)}),t},translate:function(){return Object(c.g)(this.lang).infoManage}},created:function(){var s=this,t=localStorage.getItem("lang");Object(c.g)(t)&&(this.lang=t),this.data&&this.data.appData?(this.data.appData.app?(this.curApp=JSON.parse(e()(this.data.appData.app)),this.curUserType=this.curApp.appType.userType):(this.curApp=JSON.parse(e()(this.data.appData)),this.curUserType=this.curApp.appType.userType),this._initBusinessList()):(this.$waiting.show(),Object(c.e)({url:"/api/app/"+this.data.data.id,type:"get",success:function(t){t.state?(s.closeWaiting(),s.curApp=t.data,s._initBusinessList()):s.$toast(t.message)}}).always(function(){s.$waiting.close()}))},watch:{appData:function(){this.appData?(this.appData.app?this.curApp=JSON.parse(e()(this.appData.app)):this.curApp=JSON.parse(e()(this.appData)),this._initBusinessList()):this.curApp=null}},methods:{_back:function(){this.$emit("back")},_afterSelectBusiness:function(s){},_initBusinessList:function(){var s=this;Object(c.e)({url:"/api/app/"+this.curApp.id+"/business/now",type:"get",success:function(t){t.state?t.data&&t.data.length>0?(s.businessList=t.data,s.businessList.forEach(function(s){s.id=s.business.id,s.name=s.business.name}),s.curBusinessId=s.businessList[0].id,s.beginTime=t.data[0].business.beginTime,s.endTime=t.data[0].business.endTime,s.canApplyOnAuthority=t.data[0].canApplyOnAuthority,s.canApplyOnTime=t.data[0].canApplyOnTime):"LINK"===s.curApp.setting.type?window.location.href=s.curApp.setting.linkUrl:s.errorMessage="暂无业务期":s.$toast(t.message)}})},unfoldAndfold:function(){this.collapsed=!this.collapsed},_apply:function(){if(!this.canApplyOnTime)return this.$toast("不在申请时间内"),!1;this.canApplyOnAuthority?window.open(this.curApp.setting.linkUrl):this.$toast("你无权申请该应用")}},mounted:function(){var s=this;p()(".app-detail-page-link").off("click"),p()(".app-detail-page-link").on("click",".guide-content img",function(t){var a=p()(s).attr("src");a.indexOf(s.imageUrlPrefix)>=0&&s.$preview({type:"png",url:a})}),p()(".app-detail-page-link").on("click",".guide-content a",function(t){var a=p()(s).attr("href");if(a.indexOf(s.fileUrlPrefix)>=0){if(t.preventDefault(),/(iP)/g.test(navigator.userAgent))return s.$toast("您的ios设备不支持附件下载，请用其它设备打开！造成不便尽请谅解~"),!1;var i=document.createElement("iframe");i.src=a,i.style.display="none",document.body.appendChild(i)}})}},l={render:function(){var s=this,t=s.$createElement,a=s._self._c||t;return s.curApp?a("div",{staticClass:"app-detail-page-link",class:s.data?"":"sub"},[a("div",{staticClass:"header"},[s.data?s._e():a("i",{staticClass:"maticon pull-left back-link",domProps:{innerHTML:s._s(s.icons("arrow_back"))},on:{click:s._back}},[s._v("arrow_back")]),s._v(" "),a("span",{directives:[{name:"show",rawName:"v-show",value:s.collapsed,expression:"collapsed"}],staticClass:"appNameControl"},[s._v(s._s(s.curApp.name))]),s._v(" "),a("a",{staticClass:"pull-right apartment-link",attrs:{href:"javascript:;"},on:{click:function(t){return s.unfoldAndfold()}}},[s.collapsed?a("span",[s._v("展开")]):a("span",[s._v("收起")])]),s._v(" "),s.headerShow?a("div",{staticClass:"title-div",class:s.collapsed?"collapsed":""},[a("div",{staticClass:"app-icon-div"},[a("div",{style:{"background-image":s.curApp.background}},[s.curApp.imgType&&"1"!==s.curApp.imgType?"2"===s.curApp.imgType?a("i",{staticClass:"app-icon"},[a("span",{staticClass:"saasicon-44px",class:["saasicon-44px-"+s.curApp.imgPath]})]):s._e():a("i",{staticClass:"maticon app-icon",domProps:{innerHTML:s._s(s.icons(s.curApp.imgPath))}},[s._v(s._s(s.curApp.imgPath))])])]),s._v(" "),a("div",{staticClass:"form-group app-name"},[a("label",[s._v(s._s(s.curApp.name))])]),s._v(" "),s.businessList.length>0?a("div",{staticClass:"input-group app-business"},[a("span",{staticClass:"input-group-addon"},[s._v("业务期")]),s._v(" "),a("v-select",{staticClass:"btn-block",attrs:{options:s.businessList,"options-value":"id","options-label":"name","close-on-select":"",justify:""},on:{afterSelected:s._afterSelectBusiness},model:{value:s.curBusinessId,callback:function(t){s.curBusinessId=t},expression:"curBusinessId"}})],1):s._e(),s._v(" "),a("div",{staticClass:"input-group text-center app-business"},[a("span",[s._v(s._s(s.errorMessage))])])]):s._e(),s._v(" "),s.curBusiness?a("div",{staticClass:"tab-div"},[a("span",{staticClass:"apply-entry",on:{click:function(t){return s._apply()}}},[s._v("申请")]),s._v(" "),s.curBusiness?a("div",{staticClass:"tab-container"},[a("div",{staticClass:"tab active",attrs:{title:"指南"}},[s._v("\n          指南\n        ")])]):s._e()]):s._e()]),s._v(" "),s.curBusiness?a("div",{staticClass:"middle",class:s.collapsed?"middle-top":""},[a("GeminiScrollbar",{staticClass:"tab-content"},[a("div",{staticClass:"guide-content",domProps:{innerHTML:s._s(s.curBusiness.business.guide)}}),s._v(" "),a("div",{staticClass:"business-time"},[a("div",{staticClass:"begin-time"},[s._v("\n          开始时间："),a("span",[s._v(s._s(s.beginTime||"未设置")+" ")])]),s._v(" "),a("div",{staticClass:"end-time"},[s._v("\n          结束时间："),a("span",[s._v(s._s(s.endTime||"未设置")+" ")])])])])],1):s._e()]):s._e()},staticRenderFns:[]};var u=a("C7Lr")(r,l,!1,function(s){a("XVqW")},null,null);t.default=u.exports},XVqW:function(s,t){}});