webpackJsonp([48],{"1JNB":function(t,e,i){"use strict";(function(t){var a=i("3cXf"),s=i.n(a),o=i("C331"),c=i("eSLu");e.a={props:{data:{default:""}},components:{ActivityList:c.a},data:function(){return{searchName:"",activityListData:[],creatAjax:null,pageIndex:0,pageSize:10,isLoadMoreData:!1,loadingText:!1,showFilter:!1,filterData:{},timer:null,activityStatusList:[{key:"BEFORE_APPLY_START",value:"报名未开始"},{key:"APPLY_ING",value:"报名进行中"},{key:"BEFORE_ACTIVITY_START",value:"活动未开始"},{key:"ACTIVITY_ING",value:"活动进行中"},{key:"AFTER_ACTIVITY_END",value:"活动已结束"}],pageStatus:{pageOptions:{sort:[{key:"HEAT_SCORE",value:"按热度排序"},{key:"PUBLISH_TIME",value:"按时间排序"}]}},noDataTips:"",isShowBoxShadow:!1,isShowNoMoreDataTips:!1}},created:function(){this._initActivityList({page:this.pageIndex,size:this.pageSize}),this._getActivityTypes(),this._getContentTypes()},methods:{_search:function(t){this.showFilter=!1,"reset"===t&&(this.filterData={},this.searchName=""),this.pageIndex=0;var e=JSON.parse(s()(this.filterData));e.name=this.searchName,e.size=this.pageSize,e.page=this.pageIndex,this.activityListData=[],this._initActivityList(e)},_checkDetail:function(t){this.$emit("addBread",{route:"/activity/MActivityDetail",title:t.name,data:t})},_back:function(){this.$emit("removeBread",this.data)},_initActivityList:function(t){var e=this;this.loadingText=!0,this.isLoadMoreData=!1,t.status="AFTER_ACTIVITY_END",this.creatAjax=Object(o.e)({url:"/api/sc/activities/pages",type:"get",data:t,success:function(t){t.state?(e.loadingText=!1,t.data.content.length>0?e.noDataTips="":e.noDataTips="暂无相关数据",t.data.content.forEach(function(t,i){t.isCollect=!1,e.activityListData.push(t)}),t.data.content.length<e.pageSize?(e.isLoadMoreData=!1,e.isShowNoMoreDataTips=!0):(e.isLoadMoreData=!0,e.isShowNoMoreDataTips=!1)):e._toast(t.message)}})},_publishActivity:function(){var t=this;Object(o.e)({url:"/api/sc/organizations/list/join",type:"get",success:function(e){e.state?e.data&&e.data.length>0?t.$emit("addBread",{route:"/activity/MPublishActivity",title:"",data:{publishers:e.data}}):t.$vux.alert.show({title:"您尚未加入任何组织，快去加入吧！"}):t._toast("发布权限检测失败，请稍后重试")}})},_searchActivity:function(){this.$emit("addBread",{route:"/activity/MActivitySearch",title:""})},_filterActivity:function(){this.showFilter=!0},_organizationManagePage:function(){var t=this;Object(o.e)({url:"/api/sc/organizations/list/join-audit",type:"get",success:function(e){e.state?0===e.data.length?t.$emit("addBread",{route:"/organization/MOrganizationSearch",title:""}):t.$emit("addBread",{route:"/organization/MOrganizationManage",title:""}):t._toast(e.message)}})},_toast:function(t){this.$vux.toast.show({text:t,position:"bottom",type:"text"})},_getActivityTimeStatus:function(t){var e=new Date(t.applyStartTime.replace(/-/g,"/")),i=new Date(t.applyEndTime.replace(/-/g,"/")),a=new Date(t.startTime.replace(/-/g,"/")),s=new Date(t.endTime.replace(/-/g,"/")),o=this.creatAjax.getResponseHeader("Date")?new Date(this.creatAjax.getResponseHeader("Date")):new Date,c=e.getTime()-o.getTime(),n=i.getTime()-o.getTime(),r=a.getTime()-o.getTime(),l=s.getTime()-o.getTime(),u="";return u=c>0?this._getTimeString(c,"报名开始","start"):n>0?this._getTimeString(n,"报名截止","end"):r>0?this._getTimeString(r,"活动开始","start"):l>0?this._getTimeString(l,"活动结束","end"):"活动已结束",t.statusStr=u,u},_getTimeString:function(t,e,i){var a=t/1e3,s=Math.floor(a/86400),o=Math.floor((a-24*s*3600)/3600),c=Math.floor((a-24*s*3600-3600*o)/60);if(0!=s)return"距"+e+"还有 "+s+" 天 ";if(0!=o)return"距"+e+"还有 "+o+" 小时 ";if(0==o&&0!=c)if("start"===i){if("报名开始"===e)return"报名即将开始";if("活动开始"===e)return"活动即将开始"}else{if("报名截止"===e)return"报名即将结束";if("活动结束"===e)return"活动即将结束"}},_getContentTypes:function(){var t=this;Object(o.e)({url:"/api/sc/activityContentType",type:"get",success:function(e){e.state?(t.pageStatus.pageOptions.activityType||t.$set(t.pageStatus.pageOptions,"activityType",[]),e.data&&e.data.forEach(function(e){e.childType&&e.childType.forEach(function(i){var a={key:i.id+"",value:i.typeName,parent:e.id+""};t.pageStatus.pageOptions.activityType.push(a)})})):t._toast(e.message)}})},_collect:function(t){var e=this,i="";i=t.isCollect?"/api/sc/activitySocializations/cancelCollection":"/api/sc/activitySocializations/createCollection",Object(o.e)({url:i,type:"post",data:{id:t.id},success:function(i){i.state?(e.$toast(t.isCollect?"取消收藏":"收藏成功"),t.isCollect=!t.isCollect):e._toast(i.message)}})},_getActivityTypes:function(){var t=this;Object(o.e)({url:"/api/sc/activities/types",type:"get",success:function(e){e.state?(t.pageStatus.pageOptions.activityCategory||t.$set(t.pageStatus.pageOptions,"activityCategory",[]),e.data&&e.data.forEach(function(e){var i={key:e.id,value:e.name};t.pageStatus.pageOptions.activityCategory.push(i)})):t._toast(e.message)}})}},watch:{filterData:{deep:!0,handler:function(t){}}},mounted:function(){var e=this;this.$pullUpToLoad({container:".activityList-content1",down:{height:200,callback:function(){e.pageIndex=0,e.activityListData=[],e._initActivityList({page:e.pageIndex,size:e.pageSize})}},up:{callback:function(){e.isLoadMoreData&&(e.pageIndex++,e._initActivityList({page:e.pageIndex,size:e.pageSize}))}}});var i=this;t(".activityList-content1").on("scroll",function(){var e=t(this).scrollTop();i.isShowBoxShadow=e>=50})}}}).call(e,i("qqHy"))},"8qwD":function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});i("spXQ");var a=i("1JNB"),s={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{attrs:{id:"activityHistory"}},[i("x-header",{staticClass:"activityList-header",style:{"box-shadow":t.isShowBoxShadow?"0 0 4px 0 rgba(0,0,0,0.12), 0 4px 4px 0 rgba(0,0,0,0.12)":"none"},attrs:{title:t.isShowBoxShadow}},[i("i",{staticClass:"maticon back-icon",attrs:{slot:"overwrite-left"},domProps:{innerHTML:t._s(t.icons("navigate_before"))},on:{click:t._back},slot:"overwrite-left"},[t._v("navigate_before")]),t._v(" "),i("div",{staticStyle:{position:"relative"},attrs:{slot:"overwrite-title"},slot:"overwrite-title"},[i("div",{staticClass:"search_icon"}),t._v(" "),i("x-input",{ref:"search",staticClass:"header-search aavv",attrs:{"cancel-text":" ",position:"relative","auto-fixed":"false",placeholder:"请输入你想要搜索的内容","show-clear":!1,"auto-scroll-to-top":"",top:"0"},on:{"on-change":t._search,"on-submit":t._search},model:{value:t.searchName,callback:function(e){t.searchName=e},expression:"searchName"}})],1),t._v(" "),i("span",{staticClass:"activityList-header-opt",attrs:{slot:"right"},slot:"right"},[i("i",{staticClass:"maticon filter-icon",domProps:{innerHTML:t._s(t.icons("filter_list"))},on:{click:t._filterActivity}},[t._v("filter_list")]),t._v(" "),t.isShowPoint?i("span",{staticClass:"tips-point"}):t._e()])]),t._v(" "),i("div",{directives:[{name:"transfer-dom",rawName:"v-transfer-dom"}]},[i("popup",{staticClass:"popup-filter",attrs:{height:"100%","is-transparent":""},model:{value:t.showFilter,callback:function(e){t.showFilter=e},expression:"showFilter"}},[i("group",{staticClass:"popup-filter-header"},[i("cell",[i("span",{attrs:{slot:"icon"},on:{click:function(e){t.showFilter=!1}},slot:"icon"},[i("i",{staticClass:"maticon",domProps:{innerHTML:t._s(t.icons("navigate_before"))}})]),t._v(" "),i("p",[i("span",{staticClass:"filter-opt",on:{click:function(e){return t._search("reset")}}},[t._v("还原")]),i("span",{staticClass:"filter-opt sure",on:{click:t._search}},[t._v("确定")])])])],1),t._v(" "),i("div",{staticClass:"popup-filter-body",nativeOn:{click:function(e){t.showFilter=!1}}},[i("group",{staticClass:"filter-group"},[i("radio",{attrs:{title:"title",options:t.pageStatus.pageOptions.sort},model:{value:t.filterData.sort,callback:function(e){t.$set(t.filterData,"sort",e)},expression:"filterData['sort']"}})],1),t._v(" "),i("group",{staticClass:"filter-group"},[i("datetime",{attrs:{title:"活动时间开始时间"},model:{value:t.filterData.startTime,callback:function(e){t.$set(t.filterData,"startTime",e)},expression:"filterData['startTime']"}}),t._v(" "),i("datetime",{attrs:{title:"活动时间结束时间"},model:{value:t.filterData.endTime,callback:function(e){t.$set(t.filterData,"endTime",e)},expression:"filterData['endTime']"}})],1),t._v(" "),i("group",{staticClass:"filter-group"},[i("checklist",{attrs:{options:t.pageStatus.pageOptions.activityType||[]},model:{value:t.filterData.content_type_id,callback:function(e){t.$set(t.filterData,"content_type_id",e)},expression:"filterData['content_type_id']"}})],1),t._v(" "),i("group",{staticClass:"filter-group"},[i("checklist",{attrs:{options:t.pageStatus.pageOptions.activityCategory||[]},model:{value:t.filterData.type_id,callback:function(e){t.$set(t.filterData,"type_id",e)},expression:"filterData['type_id']"}})],1)],1)],1)],1),t._v(" "),i("div",{staticClass:"activityList-content1",attrs:{id:"listOfActivity1"}},[t.activityListData.length>0?i("div",[t._l(t.activityListData,function(e,a){return i("div",{key:a,on:{click:function(i){return t._checkDetail(e)}}},[i("activity-list",{attrs:{activityItem:e,creatAjax:t.creatAjax}})],1)}),t._v(" "),t.loadingText?i("div",{staticClass:"noMoreData"},[t._v("---加载中---")]):t._e(),t._v(" "),!t.isLoadMoreData&&t.isShowNoMoreDataTips?i("div",{staticClass:"noMoreData"},[t._v("---没有更多数据了---")]):t._e()],2):i("div",{staticClass:"nodataText"},[t._v(t._s(t.noDataTips))])])],1)},staticRenderFns:[]};var o=function(t){i("GK1S")},c=i("C7Lr")(a.a,s,!1,o,null,null);e.default=c.exports},GK1S:function(t,e){},ISAO:function(t,e,i){var a={"./icon_heart_choosed_b.png":"qHIn","./icon_heart_default_b.png":"eGZ5"};function s(t){return i(o(t))}function o(t){var e=a[t];if(!(e+1))throw new Error("Cannot find module '"+t+"'.");return e}s.keys=function(){return Object.keys(a)},s.resolve=o,t.exports=s,s.id="ISAO"},eSLu:function(t,e,i){"use strict";var a=i("C331"),s=i("EoEJ"),o=(s.a,{components:{actToast:s.a},props:{activityItem:{default:null},creatAjax:{default:null}},data:function(){return{toast:{show:!1,img:"",title:""},item:null,isCollect:!1,defaultImg:0}},computed:{},watch:{},created:function(){var t=this;this.item=this.activityItem,Object(a.e)({url:"/api/sc/activitySocializations/count/"+this.item.id,type:"get",success:function(e){t.defaultImg=Number(t.item.id)%4+1,e.state?(t.isCollect=e.data.isCollect,t.item.isCollect=t.isCollect):t._toast(e.message)}})},mounted:function(){},methods:{_collect:function(t){var e=this,i="";i=t.isCollect?"/api/sc/activitySocializations/cancelCollection":"/api/sc/activitySocializations/createCollection",Object(a.e)({url:i,type:"post",data:{id:t.id},success:function(i){i.state?(e.toast={show:!0,img:"icon_heart_"+(t.isCollect?"default":"choosed")+"_b",title:t.isCollect?"取消收藏":"收藏成功"},setTimeout(function(){e.toast.show=!1},1e3),t.isCollect=!t.isCollect,e.item.isCollect=t.isCollect):e._toast(i.message)}})},_getActivityTimeStatus:function(t){var e=new Date(t.applyStartTime.replace(/-/g,"/")),i=new Date(t.applyEndTime.replace(/-/g,"/")),a=new Date(t.startTime.replace(/-/g,"/")),s=new Date(t.endTime.replace(/-/g,"/")),o=this.creatAjax.getResponseHeader("Date")?new Date(this.creatAjax.getResponseHeader("Date")):new Date,c=e.getTime()-o.getTime(),n=i.getTime()-o.getTime(),r=a.getTime()-o.getTime(),l=s.getTime()-o.getTime(),u="";return u=c>0?this._getTimeString(c,"报名开始","start"):n>0?this._getTimeString(n,"报名截止","end"):r>0?this._getTimeString(r,"活动开始","start"):l>0?this._getTimeString(l,"活动结束","end"):"活动已结束",t.statusStr=u,u},_getTimeString:function(t,e,i){var a=t/1e3,s=Math.floor(a/86400),o=Math.floor((a-24*s*3600)/3600),c=Math.floor((a-24*s*3600-3600*o)/60);if(0!=s)return"距"+e+"还有 "+s+" 天 "+o+" 小时 ";if(0!=o)return"距"+e+"还有 "+o+" 小时 ";if(0==o&&0!=c)if("start"===i){if("报名开始"===e)return"报名即将开始";if("活动开始"===e)return"活动即将开始"}else{if("报名截止"===e)return"报名即将结束";if("活动结束"===e)return"活动即将结束"}}}}),c={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("div",{staticClass:"activity-positive-card"},[a("div",{staticClass:"collect",on:{click:function(e){return e.stopPropagation(),t._collect(t.item)}}},[a("img",{attrs:{src:i("ISAO")("./icon_heart_"+(t.item.isCollect||t.isCollect?"choosed":"default")+"_b.png"),alt:""}})]),t._v(" "),a("div",{staticClass:"activity-type set-text-right",attrs:{title:""}},[t._v(t._s(t.item.typeName))]),t._v(" "),a("div",{staticClass:"cover-wrap"},[t.item.images.length>0&&t.item.images[0].isCover?a("img",{staticClass:"activity-cover",attrs:{src:t.imageUrlPrefix+t.item.images[0].image+"?thumb=true",container:"#listOfActivity1",alt:""}}):t.defaultImg?a("img",{staticClass:"activity-cover",attrs:{src:i("VhEo")("./pic0"+t.defaultImg+".png"),alt:""}}):t._e(),t._v(" "),a("div",{staticClass:"activity-time"},[t._v(t._s(t._getActivityTimeStatus(t.item)))])]),t._v(" "),a("flexbox",{staticClass:"cnt-wrap",attrs:{orient:"vertical"}},[a("flexbox-item",[a("div",{staticClass:"activity-title",attrs:{title:""}},[t._v(t._s(t.item.name))]),t._v(" "),a("div",{staticClass:"activity-tag"},[t._v(t._s(t.item.contentTypeParentName))])]),t._v(" "),a("flexbox-item",{staticClass:"box_flex"},[t.item.teacherName?a("div",{staticClass:"activity-info mb7"},[a("img",{staticClass:"icon",attrs:{src:i("SLiz"),alt:""}}),t._v(t._s(t.item.teacherName))]):t._e(),t._v(" "),t.item.classTime?a("div",{staticClass:"activity-info mb7"},[a("img",{staticClass:"icon",attrs:{src:i("zPLm"),alt:""}}),t._v(t._s(t.item.classTime))]):t._e()]),t._v(" "),a("flexbox-item",{staticClass:"box_flex mb0"},[t.item.studentOriented&&t.item.studentOriented.length>0?a("div",{staticClass:"activity-info"},[a("img",{staticClass:"icon",attrs:{src:i("ZpGA"),alt:""}}),t._v(t._s(t.item.studentOriented.length>1?t.item.studentOriented[0].name+"等":t.item.studentOriented[0].name))]):t.item.grade&&t.item.grade.length>0?a("div",{staticClass:"activity-info"},[a("img",{staticClass:"icon",attrs:{src:i("ZpGA"),alt:""}}),t._v(t._s(t.item.grade.length>1?t.item.grade[0]+"级等":t.item.grade[0]+"等"))]):a("div",{staticClass:"activity-info"},[a("img",{staticClass:"icon",attrs:{src:i("ZpGA"),alt:""}}),t._v("面向全体")]),t._v(" "),a("div",{staticClass:"activity-info"},[a("img",{staticClass:"icon",attrs:{src:i("FxqL"),alt:""}}),t._v(t._s(t.item.place))])])],1)],1),t._v(" "),t.toast.show?a("act-toast",{attrs:{imgUrl:t.toast.img,title:t.toast.title}}):t._e()],1)},staticRenderFns:[]};var n=i("C7Lr")(o,c,!1,function(t){i("tHGq")},"data-v-cc33faa0",null);e.a=n.exports},spXQ:function(t,e,i){"use strict";(function(t){var e=i("3cXf");i.n(e),i("C331"),i("eSLu").a}).call(e,i("qqHy"))},tHGq:function(t,e){}});