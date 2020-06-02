webpackJsonp([180],{YLto:function(t,e){},gaWH:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=i("MVd6"),n={data:function(){var t=this;return{page:"LIST",table:{url:"/table-data/employment/manage/networkMeeting/getNetworkMeetingList?ts=",search:{ts:+new Date,beginTime:"",endTime:""},columns:[{id:"name",title:"网招会名称",className:"text-left",width:100,hidden:!1,search:{type:"",data:{placeholer:"网招会名称",autoFocus:!1}},formatter:function(t){return a.a.fromApi(t).getNameHtmlWithStatus()}},{id:"startTime",title:"网招会开始时间",className:"text-left",width:140,hidden:!1,formatter:function(t){return new Date(t.beginTime).format("yyyy-MM-dd HH:mm")}},{id:"endTime",title:"网招会结束时间",className:"text-left",width:140,hidden:!1,formatter:function(t){return new Date(t.endTime).format("yyyy-MM-dd HH:mm")}},{id:"startApplyTime",title:"申请开始时间",className:"text-left line-height-normal",width:145,hidden:!1,formatter:function(t){return""+new Date(t.applyBeginTime).format("yyyy-MM-dd HH:mm")}},{id:"endApplyTime",title:"申请结束时间",className:"text-left line-height-normal",width:145,hidden:!1,formatter:function(t){return""+new Date(t.applyEndTime).format("yyyy-MM-dd HH:mm")}},{id:"opt",title:"操作",width:120,hidden:!1,formatter:function(e){return[{show:{tag:"a",text:"查看",callback:function(e,i){t.showOjf(a.a.fromApi(e))}}}.show]}}]},currentDcw:null}},computed:{tableUrl:function(){return this.table.url+"&beginTime="+(this.table.search.beginTime||"")+"&endTime="+(this.table.search.endTime||"")+"&ts="+this.table.search.ts}},methods:{showOjf:function(t){this.$emit("to-detail",t)},refreshTable:function(){this.table.search.ts=+new Date}}},s={render:function(){var t=this.$createElement;return(this._self._c||t)("v-table",{attrs:{url:this.tableUrl,columns:this.table.columns,idField:"id",pagesize:"20",multiple:!1,search:!1,order:!0}})},staticRenderFns:[]},l=i("C7Lr")(n,s,!1,null,null,null).exports,o=i("DkpT"),r={data:function(){var t=this;return{table:{url:"/table-data/employment/networkMeeting/getMyNetworkMeetingList?ts=",search:{ts:+new Date,beginTime:"",endTime:""},columns:[{id:"name",title:"网招会名称",className:"text-left",width:130,hidden:!1,search:{type:"input",data:{placeholer:"",autoFocus:!1}}},{id:"beginTime",title:"网招会开始时间",className:"text-left",width:145,hidden:!1},{id:"createTime",title:"提交时间",className:"text-left",width:145,hidden:!1},{id:"status",title:"审核状态",className:"text-left",width:80,hidden:!1,hover:!1,formatter:function(t){var e=o.c[t.status]||o.b[t.status];return'<span class="el-tag el-tag--small el-tag--dark el-tag--'+o.d[t.status]+'">'+e+"</span>"},search:{type:"select",data:{placeholer:"审核状态",autoFocus:!1,optionsLabel:"text",optionsValue:"id",options:o.e}}},{id:"auditReason",title:"审核意见",className:"text-left",width:100,hidden:!1},{id:"opt",title:"操作",width:100,hidden:!1,formatter:function(e){return[{show:{tag:"a",text:"查看",callback:function(e,i){t.toApplyDetail({ojfUnitApplyId:e.participantId,ojf:new a.a({id:e.id}),auditReason:e.auditReason})}}}.show]}}]}}},computed:{tableUrl:function(){return this.table.url+"&beginTime="+(this.table.search.beginTime||"")+"&endTime="+(this.table.search.endTime||"")+"&ts="+this.table.search.ts}},methods:{toApplyDetail:function(t){this.$emit("to-apply-detail",t)},refreshTable:function(){this.table.search.ts=+new Date}}},c={render:function(){var t=this.$createElement;return(this._self._c||t)("v-table",{attrs:{url:this.tableUrl,columns:this.table.columns,idField:"id",pagesize:"20",multiple:!1,search:!1,order:!0}})},staticRenderFns:[]},p=i("C7Lr")(r,c,!1,null,null,null).exports,u=i("IHPB"),f=i.n(u),d=i("lC5x"),m=i.n(d),h=i("rVsN"),y=i.n(h),b=i("J0Oq"),g=i.n(b),v=i("Se9A"),j=i("p+qa"),A=i("XfSg"),L=i("+X9P"),w=i("0FSR"),T=(Object,v.a,L.a,w.a,{props:{ojf:Object},components:{ModuleContainer:v.a,BaseInfo:L.a,UnitsInfo:w.a},data:function(){return{loading:!1,showOpLogs:!1,myUnit:null,myApplyInfo:null,opLogDataUrl:"",isMyUnitDisabled:!0}},computed:{hasApplied:function(){return!(!this.myApplyInfo||this.myApplyInfo.status!==o.a.PASSED)},canApply:function(){return!this.hasApplied&&this.ojf.isApplying()&&!this.isMyUnitDisabled}},created:function(){var t=this;return g()(m.a.mark(function e(){return m.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,y.a.all([t.initUnits(),t.initMyUnit(),t.initMyUnitDisabled()]);case 2:t.loading=!1;case 3:case"end":return e.stop()}},e,t)}))()},methods:{initUnits:function(){var t=this;return g()(m.a.mark(function e(){var i,n,s,l,o;return m.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,A.a.get(t.ojf.id);case 2:i=e.sent,n=i.state,s=i.message,l=i.data,n?(t.ojf.units.splice(0,t.ojf.units.length),(o=t.ojf.units).push.apply(o,f()(a.a.fromApi(l).units))):t.$toast(s);case 7:case"end":return e.stop()}},e,t)}))()},initMyUnit:function(){var t=this;return g()(m.a.mark(function e(){var i,a,n,s;return m.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(j.k)();case 2:i=e.sent,a=i.state,n=i.message,s=i.data,a?(t.myUnit=s,t.initMyApplyInfo()):t.$toast(n);case 7:case"end":return e.stop()}},e,t)}))()},initMyUnitDisabled:function(){var t=this;return g()(m.a.mark(function e(){var i,a,n,s;return m.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(j.c)();case 2:i=e.sent,a=i.state,n=i.message,s=i.data,a?t.isMyUnitDisabled=!!s:t.$toast(n);case 7:case"end":return e.stop()}},e,t)}))()},initMyApplyInfo:function(){var t=this;return g()(m.a.mark(function e(){var i,n,s,l,o,r;return m.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if("/employment"!=t.$route.path){e.next=10;break}return e.next=3,A.a.getOjfUnitApplyById(t.myUnit.id);case 3:i=e.sent,n=i.state,s=i.code,l=i.message,o=i.data,e.next=17;break;case 10:return e.next=12,A.a.getMyOjfUnitApply(t.ojf.id);case 12:r=e.sent,n=r.state,s=r.code,l=r.message,o=r.data;case 17:n?o&&(t.myApplyInfo=a.b.fromApi(o)):"50001"===s?t.myApplyInfo=null:t.$toast(l);case 18:case"end":return e.stop()}},e,t)}))()},showMyApplyInfo:function(){var t=this;return g()(m.a.mark(function e(){return m.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:t.$emit("to-apply-detail",{ojf:t.ojf,ojfUnitApplyId:t.myApplyInfo.id,from:"DETAIL"});case 1:case"end":return e.stop()}},e,t)}))()},showOjfUnitApply:function(t,e){this.$emit("to-apply-detail",{ojf:this.ojf,ojfUnitApplyId:t.id,from:"DETAIL",hideLog:!0})},toApply:function(){this.$emit("to-apply",{myUnit:this.myUnit})},backToList:function(){this.$emit("back-to-list",{})}}}),U={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("div",{staticClass:"back",on:{click:t.backToList}},[i("i",{staticClass:"el-icon-back"}),t._v("返回\n  ")]),t._v(" "),i("div",{staticClass:"module-container"},[i("base-info",{model:{value:t.ojf,callback:function(e){t.ojf=e},expression:"ojf"}}),t._v(" "),i("units-info",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],on:{"show-ojf-unit-apply":t.showOjfUnitApply},model:{value:t.ojf.units,callback:function(e){t.$set(t.ojf,"units",e)},expression:"ojf.units"}}),t._v(" "),i("module-container",{attrs:{actions:"",loader:t.loading}},[t.hasApplied?i("el-button",{attrs:{type:"primary",size:"large"},on:{click:t.showMyApplyInfo}},[t._v("查看我的参会信息")]):t.isMyUnitDisabled?i("el-button",{attrs:{type:"primary",size:"large",disabled:""}},[t._v("单位已被停用")]):t.myApplyInfo?i("el-button",{attrs:{type:"primary",size:"large"},on:{click:t.showMyApplyInfo}},[t._v("查看我的申请")]):this.ojf.isApplying()?i("el-button",{attrs:{type:"primary",size:"large"},on:{click:t.toApply}},[t._v("申请")]):i("el-button",{attrs:{type:"info",size:"large",disabled:""}},[t._v("不在报名时间内")])],1)],1)])},staticRenderFns:[]},k=i("C7Lr")(T,U,!1,null,null,null).exports,D=i("PUN0"),I=i("G1RR"),x=(D.a,I.a,{components:{UnitOjfDetail:k,UnitOjfApply:D.a,UnitOjfApplyDetail:I.a,UnitAllOjfList:l,UnitMyOjfList:p},data:function(){return{activeList:"ALL",page:"LIST",ojf:null,ojfUnitApply:null,ojfUnitApplyId:null,myUnit:null,applyDetailFrom:null,hideLog:!1}},watch:{activeList:function(t){var e={ALL:"allOjfList",MINE:"myOjfList"}[t];this.$refs[e].refreshTable()}},methods:{toApply:function(t){var e=t.myUnit;this.myUnit=e,this.page="APPLY"},toDetail:function(t){this.ojf=t,this.ojfUnitApply=null,this.myUnit=null,this.page="DETAIL"},toApplyDetail:function(t){var e=t.ojfUnitApplyId,i=t.ojf,a=t.from,n=t.hideLog;this.ojf=i,this.ojfUnitApplyId=e,this.page="APPLY_DETAIL",this.applyDetailFrom=a,this.hideLog=!!n},bakcToMyList:function(){this.page="LIST",this.activeList="MINE",this.$refs.myOjfList.refreshTable()},backToDetail:function(){this.page="DETAIL"},backToList:function(){this.page="LIST"},applyDetailBack:function(t){var e=t.from,i=t.refresh;this.page=e||"LIST",i&&this.$refs.myOjfList.refreshTable()}}}),M={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"main-content"},[i("div",{directives:[{name:"show",rawName:"v-show",value:"LIST"===t.page,expression:"page === 'LIST'"}],staticClass:"tab-content"},[i("el-tabs",{model:{value:t.activeList,callback:function(e){t.activeList=e},expression:"activeList"}},[i("el-tab-pane",{attrs:{label:"网招会列表",name:"ALL"}},[i("unit-all-ojf-list",{ref:"allOjfList",on:{"to-detail":t.toDetail}})],1),t._v(" "),i("el-tab-pane",{attrs:{label:"我的网招会",name:"MINE"}},[i("unit-my-ojf-list",{ref:"myOjfList",on:{"to-apply-detail":t.toApplyDetail}})],1)],1)],1),t._v(" "),"DETAIL"===t.page?i("div",[i("unit-ojf-detail",{attrs:{ojf:t.ojf},on:{"back-to-list":t.backToList,"to-apply":t.toApply,"to-apply-detail":t.toApplyDetail}})],1):t._e(),t._v(" "),"APPLY"===t.page?i("div",[i("unit-ojf-apply",{attrs:{ojf:t.ojf,"my-unit":t.myUnit},on:{"back-to-list":t.backToDetail,"back-to-my-list":t.bakcToMyList}})],1):t._e(),t._v(" "),"APPLY_DETAIL"===t.page?i("div",[i("unit-ojf-apply-detail",{attrs:{ojf:t.ojf,"ojf-unit-apply-id":t.ojfUnitApplyId,"is-unit":"",from:t.applyDetailFrom,"hide-oplog":t.hideLog},on:{back:t.applyDetailBack,"back-to-my-list":t.bakcToMyList}})],1):t._e()])},staticRenderFns:[]};var _=i("C7Lr")(x,M,!1,function(t){i("YLto")},null,null);e.default=_.exports}});