webpackJsonp([63,231],{"+SRa":function(t,e){},"44Rq":function(t,e){},"5Wls":function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n("lC5x"),a=n.n(i),o=n("J0Oq"),s=n.n(o),r=n("MVd6"),l=n("DkpT"),c=n("Se9A"),u=n("XfSg"),f=n("p+qa"),p=n("+X9P"),d=n("0FSR"),m=n("G1RR"),y=n("PUN0"),h=(Number,Boolean,Object,c.a,p.a,d.a,y.a,m.a,{props:{id:Number,fromList:Boolean,props:Object},components:{ModuleContainer:c.a,BaseInfo:p.a,UnitsInfo:d.a,UnitOjfApply:y.a,UnitOjfApplyDetail:m.a},data:function(){return{page:"DETAIL",loading:!0,ojfUnitApplyId:null,ojf:null,myUnit:null,myApplyInfo:null,isMyUnitDisabled:!1}},computed:{ojfId:function(){return this.ojf?this.ojf.id:this.id||this.props.id},hasApplied:function(){return!!this.ojf&&!(!this.myApplyInfo||this.myApplyInfo.status!==l.a.PASSED)},canApply:function(){return!!this.ojf&&(!this.hasApplied&&this.ojf.isApplying()&&!this.isMyUnitDisabled)}},watch:{"props.id":function(t){t&&(this.ojf=null,this.initOjf())}},created:function(){var t=this;return s()(a.a.mark(function e(){return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.initOjf();case 2:t.$attrs&&t.$attrs.userInfo&&("COMPANY"==t.$attrs.userInfo.type&&t.initMyUnitDisabled(),"/student/onlineJobFair/detail"!=t.$attrs.content&&t.initMyUnit()),t.initMyApplyInfo(),t.loading=!1;case 5:case"end":return e.stop()}},e,t)}))()},methods:{addBread:function(t){this.$emit("toSomePage",{path:t.route})},initOjf:function(){var t=this;return s()(a.a.mark(function e(){var n,i,o,s;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u.a.getPublic(t.ojfId);case 2:n=e.sent,i=n.state,o=n.message,s=n.data,i?t.ojf=r.a.fromApi(s):t.$toast(o);case 7:case"end":return e.stop()}},e,t)}))()},initMyUnit:function(){var t=this;return s()(a.a.mark(function e(){var n,i,o,s;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(f.k)();case 2:n=e.sent,i=n.state,o=n.message,s=n.data,i?t.myUnit=s:t.$toast(o);case 7:case"end":return e.stop()}},e,t)}))()},initMyUnitDisabled:function(){var t=this;return s()(a.a.mark(function e(){var n,i,o,s;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(f.c)();case 2:n=e.sent,i=n.state,o=n.message,s=n.data,i?t.isMyUnitDisabled=!s:"41004"!==code&&t.$toast(o);case 7:case"end":return e.stop()}},e,t)}))()},initMyApplyInfo:function(){var t=this;return s()(a.a.mark(function e(){var n,i,o,s,l;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u.a.getPublicOjfUnitApplyById(t.ojfId);case 2:n=e.sent,i=n.state,o=n.code,s=n.message,l=n.data,i?l&&(t.myApplyInfo=r.b.fromApi(l)):"50001"===o?t.myApplyInfo=null:"41004"!==o&&t.$toast(s);case 8:case"end":return e.stop()}},e,t)}))()},showMyApplyInfo:function(){this.page="UNIT_APPLY_DETAIL",this.ojfUnitApplyId=this.myApplyInfo.id},showOjfUnitApply:function(t,e){this.page="UNIT_APPLY_DETAIL",this.ojfUnitApplyId=t.id},toApply:function(){this.page="APPLY"},bakcToMyList:function(){this.$router.push({name:"employment",params:{toPage:"/unit/onlineJobFair/list"}})},backToHomePage:function(){this.$emit("toSomePage","/index")},back:function(){this.fromList?this.$emit("back-to-list"):this.backToHomePage()}}}),b={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return"DETAIL"===t.page?n("div",{attrs:{id:"studentOjfDetails"}},[n("div",{staticClass:"studentOjfDetails"},[n("div",{staticClass:"module-container"},[n("el-button",{staticStyle:{color:"#666"},attrs:{type:"text",icon:"el-icon-back"},on:{click:t.back}},[t._v("返回")]),t._v(" "),t.ojf?n("div",[n("base-info",{model:{value:t.ojf,callback:function(e){t.ojf=e},expression:"ojf"}}),t._v(" "),n("units-info",{on:{"show-ojf-unit-apply":t.showOjfUnitApply},model:{value:t.ojf.units,callback:function(e){t.$set(t.ojf,"units",e)},expression:"ojf.units"}}),t._v(" "),n("module-container",{attrs:{actions:"",loader:t.loading}},[t.hasApplied?n("el-button",{attrs:{type:"primary",size:"large"},on:{click:t.showMyApplyInfo}},[t._v("查看我的参会信息")]):t.isMyUnitDisabled?n("el-button",{attrs:{type:"primary",size:"large",disabled:""}},[t._v("单位已被停用")]):t.myApplyInfo?n("el-button",{attrs:{type:"primary",size:"large",disabled:""}},[t._v("申请中")]):this.ojf.isApplying()?t.myUnit?n("el-button",{attrs:{type:"primary",size:"large"},on:{click:t.toApply}},[t._v("申请")]):t._e():n("el-button",{attrs:{type:"info",size:"large",disabled:""}},[t._v("不在报名时间内")])],1)],1):n("module-container",{attrs:{loader:""}})],1)])]):"UNIT_APPLY_DETAIL"===t.page?n("div",[n("unit-ojf-apply-detail",{attrs:{ojf:t.ojf,"ojf-unit-apply-id":t.ojfUnitApplyId,"hide-status":"","hide-oplog":"","only-look":""},on:{back:function(e){t.page="DETAIL"}}})],1):"APPLY"===t.page?n("div",[n("unit-ojf-apply",{attrs:{ojf:t.ojf,"my-unit":t.myUnit},on:{"back-to-list":function(e){t.page="DETAIL"},"back-to-my-list":t.bakcToMyList}})],1):t._e()},staticRenderFns:[]};var j=n("C7Lr")(h,b,!1,function(t){n("+SRa")},null,null);e.default=j.exports},bDXO:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n("MVd6"),a=n("5Wls"),o=(a.default,{components:{StudentOjfDetail:a.default},data:function(){var t=this;return{ojf:null,page:"LIST",table:{url:"/table-data/employment/platform/getNetworkMeetingList?ts=",search:{ts:+new Date,beginTime:"",endTime:""},columns:[{id:"name",title:"网招会名称",className:"text-left",width:150,hidden:!1,search:{type:"",data:{placeholer:"网招会名称",autoFocus:!1}},formatter:function(t){return i.a.fromApi(t).getNameHtmlWithStatus()}},{id:"startTime",title:"网招会开始时间",className:"text-left",width:140,hidden:!1,formatter:function(t){return new Date(t.beginTime).format("yyyy-MM-dd HH:mm")}},{id:"endTime",title:"网招会结束时间",className:"text-left",width:140,hidden:!1,formatter:function(t){return new Date(t.endTime).format("yyyy-MM-dd HH:mm")}},{id:"opt",title:"操作",width:50,hidden:!1,formatter:function(e){return[{show:{tag:"a",text:"查看",callback:function(e,n){t.showOjf(i.a.fromApi(e))}}}.show]}}]},currentDcw:null}},computed:{tableUrl:function(){return this.table.url+"&beginTime="+(this.table.search.beginTime||"")+"&endTime="+(this.table.search.endTime||"")+"&ts="+this.table.search.ts}},methods:{showOjf:function(t){this.ojf=t,this.page="DETAIL"},backToHomePage:function(){this.$emit("toSomePage","/index")},refreshTable:function(){this.table.search.ts=+new Date}}}),s={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return"LIST"===t.page?n("div",{attrs:{id:"ojfList"}},[n("div",{staticClass:"ojfList container col-sm-12"},[n("el-button",{staticStyle:{color:"#666"},attrs:{type:"text",icon:"el-icon-back"},on:{click:t.backToHomePage}},[t._v("返回")]),t._v(" "),n("v-table",{attrs:{url:t.tableUrl,columns:t.table.columns,idField:"id",pagesize:"20",multiple:!1,search:!1,order:!0}})],1)]):n("student-ojf-detail",{attrs:{id:t.ojf&&t.ojf.id,"from-list":""},on:{"back-to-list":function(e){t.page="LIST"}}})},staticRenderFns:[]};var r=n("C7Lr")(o,s,!1,function(t){n("oq+z"),n("44Rq")},"data-v-2a5511a9",null);e.default=r.exports},"oq+z":function(t,e){}});