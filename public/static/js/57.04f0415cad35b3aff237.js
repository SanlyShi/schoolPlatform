webpackJsonp([57],{4705:function(t,e){},"7kTM":function(t,e){},DmHF:function(t,e,a){"use strict";a("68u/"),a("YXeK");var n=a("EA6R"),i=a.n(n),s=a("lC5x"),r=a.n(s),o=a("J0Oq"),l=a.n(o),c=a("IwLe"),u=a("VDkK"),d=a("hn+R"),p=a("713C"),f=a("V/it"),m=a("B/WJ"),h=a("2IYH"),v=a("Se9A"),y=(Boolean,Boolean,Object,Object,h.a,v.a,{props:{inline:Boolean,edit:Boolean,rules:{type:Object,default:Object}},mixins:[h.a],components:{ModuleContainer:v.a}}),w={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("module-container",{attrs:{title:"备注",inline:t.inline}},[t.edit?a("el-input",{attrs:{type:"textarea",autosize:{minRows:3}},model:{value:t.form,callback:function(e){t.form=e},expression:"form"}}):a("p",[t._v(t._s(t.form))])],1)},staticRenderFns:[]},b=a("C7Lr")(y,w,!1,null,null,null).exports,_=a("N9Ox"),A=a("fSJ2"),I=a("p+qa"),g=a("t7Ya"),D=a("mrGO"),T=(Number,Number,String,Number,Boolean,Boolean,v.a,_.a,c.a,u.a,d.a,p.a,f.a,m.a,{props:{unitApplyInfoId:Number,id:Number,dcwName:String,auditStatus:Number,isUnit:Boolean,isManager:Boolean},components:{ModuleContainer:v.a,ModuleLoader:_.a,BaseInfo:c.a,StandInfo:u.a,StandPicker:d.a,UnitInfo:p.a,PositionsInfo:f.a,RecruitmentInfo:m.a,RemarkInfo:b},data:function(){return{UnitApplyAuditStatus:D.a,loading:!0,dcw:null,unitApplyInfo:null,standsInitialized:!1,stands:[],rules:{name:{hidden:!0},applyTime:{hidden:!0}},managerUnitApplyRules:{desc:{readonly:!0}}}},computed:{auditStatusLabel:function(){return D.b[this.auditStatus]},auditStatusLabelType:function(){var t="";switch(this.auditStatus){case D.a.AUDITING:t="warning";break;case D.a.PASSED:t="success";break;case D.a.FAILED:t="danger";break;case D.a.COUNTERMAND:t="warning";break;case D.a.DISABLED:t="info";break;case D.a.REJECT:t="warning"}return t},canEditApplyInfo:function(){return this.isManager?this.auditStatus===D.a.AUDITING:!!this.isUnit&&[D.a.COUNTERMAND,D.a.REJECT].includes(this.auditStatus)},canAuditing:function(){return this.isManager&&this.auditStatus===D.a.AUDITING}},created:function(){var t=this;return l()(r.a.mark(function e(){return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.initDcw();case 2:return e.next=4,t.initUnitApplyInfo();case 4:return e.next=6,t.initStands();case 6:t.loading=!1;case 7:case"end":return e.stop()}},e,t)}))()},methods:{downloadTicket:function(){this.getPdf("入场券")},initDcw:function(){var t=this;return l()(r.a.mark(function e(){var a,n,i,s;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,A.a.dcw.get(t.id);case 2:a=e.sent,n=a.state,i=a.message,s=a.data,n?t.dcw=g.a.fromApi(s):t.$toast(i);case 7:case"end":return e.stop()}},e,t)}))()},initUnitApplyInfo:function(){var t=this;return l()(r.a.mark(function e(){var a,n,i,s;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,A.a.dcw.getUnitApplyInfo(t.unitApplyInfoId);case 2:a=e.sent,n=a.state,i=a.message,s=a.data,n?t.unitApplyInfo=g.d.fromApi(s):t.$toast(i);case 7:case"end":return e.stop()}},e,t)}))()},initStands:function(){var t=this;return l()(r.a.mark(function e(){var a;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:a=t.unitApplyInfo.stands.map(function(t){return t.id}),t.stands=t.dcw.standInfo.stands.map(function(t){var e=new g.c(t);return a.includes(t.id)&&(e.selected=!0,e.occupied=!1,e.applied=!1),e}),t.standsInitialized=!0;case 3:case"end":return e.stop()}},e,t)}))()},backToList:function(){this.$emit("back-to-list",{refresh:!0,tableName:"auditList"})},submitApply:function(){var t=this;return l()(r.a.mark(function e(){var a,n,i;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return alert("什么鬼"),e.next=3,A.a.dcw.apply(t.dcw.id,t.unitApplyInfo);case 3:a=e.sent,n=a.state,i=a.message,a.data,n?t.$toast("提交成功"):t.$toast(i);case 8:case"end":return e.stop()}},e,t)}))()},resubmitApply:function(){var t=this;return l()(r.a.mark(function e(){var a,n,i;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,t.$refs.unitInfo.validate();case 3:e.next=9;break;case 5:return e.prev=5,e.t0=e.catch(0),Object(I.a)(0,200),e.abrupt("return");case 9:if(t.unitApplyInfo.stands=t.stands.filter(function(t){return t.selected}),"UNIT"!==t.dcw.standInfo.chooseType||t.unitApplyInfo.stands.length){e.next=13;break}return t.$toast("您还未选择展位"),e.abrupt("return");case 13:return e.next=15,A.a.dcw.resubmit(t.unitApplyInfo);case 15:a=e.sent,n=a.state,i=a.message,a.data,n?(t.$toast("提交成功"),t.auditStatus=D.a.AUDITING):t.$toast(i);case 20:case"end":return e.stop()}},e,t,[[0,5]])}))()},countermandApply:function(){var t=this;return l()(r.a.mark(function e(){return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:i.a.confirm("确认撤回申请?").then(l()(r.a.mark(function e(){var a,n,i;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,A.a.dcw.countermand(t.unitApplyInfo.id);case 2:a=e.sent,n=a.state,i=a.message,a.data,n?(t.auditStatus=D.a.COUNTERMAND,t.$toast("撤回成功")):t.$toast(i);case 7:case"end":return e.stop()}},e,t)})));case 1:case"end":return e.stop()}},e,t)}))()},rejectApply:function(){var t=this;return l()(r.a.mark(function e(){return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:i.a.prompt("请填写驳回意见","驳回").then(function(){var e=l()(r.a.mark(function e(a){var n,s,o,l=a.value;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,A.a.dcw.reject(t.unitApplyInfo.id,l);case 2:n=e.sent,s=n.state,o=n.message,n.data,s?(t.auditStatus=D.a.REJECT,i.a.confirm("驳回成功，是否返回审核列表?").then(function(){t.backToList()})):t.$toast(o);case 7:case"end":return e.stop()}},e,t)}));return function(t){return e.apply(this,arguments)}}());case 1:case"end":return e.stop()}},e,t)}))()},disagreeApply:function(){var t=this;return l()(r.a.mark(function e(){return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:i.a.prompt("请填写不通过意见","不通过").then(function(){var e=l()(r.a.mark(function e(a){var n,s,o,l=a.value;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,A.a.dcw.disagree(t.unitApplyInfo.id,l);case 2:n=e.sent,s=n.state,o=n.message,n.data,s?(t.auditStatus=D.a.FAILED,i.a.confirm("操作成功，是否返回审核列表?").then(function(){t.backToList()})):t.$toast(o);case 7:case"end":return e.stop()}},e,t)}));return function(t){return e.apply(this,arguments)}}());case 1:case"end":return e.stop()}},e,t)}))()},agreeApply:function(){var t=this;return l()(r.a.mark(function e(){return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:t.unitApplyInfo.stands=t.stands.filter(function(t){return t.selected}),i.a.confirm("确认同意该申请?").then(l()(r.a.mark(function e(){var a,n,s;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,A.a.dcw.agree(t.unitApplyInfo);case 2:a=e.sent,n=a.state,s=a.message,a.data,n?(t.auditStatus=D.a.PASSED,i.a.confirm("操作成功，是否返回审核列表?").then(function(){t.backToList()})):t.$toast(s);case 7:case"end":return e.stop()}},e,t)})));case 2:case"end":return e.stop()}},e,t)}))()}}}),k={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("div",{staticClass:"back titleBack"},[a("div",{on:{click:t.backToList}},[a("i",{staticClass:"el-icon-back",staticStyle:{display:"inline-block"}}),t._v("返回")]),t._v(" "),a("div",{staticClass:"getTicket"},[a("el-button",{attrs:{type:"primary"},on:{click:t.downloadTicket}},[t._v("下载入场券")])],1)]),t._v(" "),a("div",{staticClass:"pdfdom",attrs:{id:"pdfDom"}},[a("div",{staticStyle:{border:"1px solid #000"}},[a("div",{staticClass:"title"},[a("h5",{staticClass:"mid",staticStyle:{"font-weight":"normal","font-size":"20px"}},[t._v("双选会名称")]),t._v(" "),a("h3",{staticClass:"mid"},[t._v("参会通知举办时间：")]),t._v(" "),a("p",{staticClass:"mid"},[t._v(t._s(t.dcw?t.dcw.getApplyTimeHtml():""))])]),t._v(" "),a("div",{staticClass:"details big"},[t._v("\n      参会详情\n    ")]),t._v(" "),t.unitApplyInfo?a("div",{staticClass:"th"},[a("el-row",[a("el-col",{attrs:{span:4}},[t._v("参展单位")]),t._v(" "),a("el-col",{attrs:{span:20}},[t._v(t._s(t.unitApplyInfo.name))])],1),t._v(" "),a("el-row",[a("el-col",{attrs:{span:4}},[t._v("单位地址")]),t._v(" "),a("el-col",{attrs:{span:20}},[t._v(t._s(t.unitApplyInfo.address))])],1),t._v(" "),a("el-row",[a("el-col",{attrs:{span:4}},[t._v("单位联系人")]),t._v(" "),a("el-col",{attrs:{span:8}},[t._v(t._s(t.unitApplyInfo.contactPeople))]),t._v(" "),a("el-col",{attrs:{span:4}},[t._v("单位电话")]),t._v(" "),a("el-col",{attrs:{span:8}},[t._v(t._s(t.unitApplyInfo.contactPhone))])],1),t._v(" "),a("el-row",[a("el-col",{attrs:{span:4}},[t._v("单位邮箱")]),t._v(" "),a("el-col",{attrs:{span:20}},[t._v(t._s(t.unitApplyInfo.email))])],1)],1):t._e(),t._v(" "),t.unitApplyInfo&&t.unitApplyInfo.positions.length?a("div",{staticClass:"position big"},[t._v("\n      职位信息\n    ")]):t._e(),t._v(" "),t.unitApplyInfo&&t.unitApplyInfo.positions.length?a("div",{staticClass:"th"},[a("el-row",[a("el-col",{attrs:{span:4}},[t._v("职位名称")]),t._v(" "),a("el-col",{staticStyle:{"font-weight":"bold"},attrs:{span:8}},[t._v("专业要求")]),t._v(" "),a("el-col",{attrs:{span:4}},[t._v("招聘人数")]),t._v(" "),a("el-col",{staticStyle:{"font-weight":"bold"},attrs:{span:8}},[t._v("工作地点")])],1),t._v(" "),t._l(t.unitApplyInfo.positions,function(e,n){return a("el-row",{key:n},[a("el-col",{staticStyle:{"font-weight":"normal"},attrs:{span:4}},[t._v(t._s(e.positionName))]),t._v(" "),a("el-col",{attrs:{span:8}},[t._v(t._s(e.major))]),t._v(" "),a("el-col",{staticStyle:{"font-weight":"normal"},attrs:{span:4}},[t._v(t._s(e.recruitNumber))]),t._v(" "),a("el-col",{attrs:{span:8}},[t._v(t._s(e.workplace))])],1)})],2):t._e(),t._v(" "),a("div",{staticClass:"position big"},[t._v("\n      展会信息\n    ")]),t._v(" "),a("div",{staticClass:"th"},[a("el-row",[a("el-col",{attrs:{span:4}},[t._v("双选会地点")]),t._v(" "),t.dcw?a("el-col",{attrs:{span:20}},[t._v(t._s(t.dcw.baseInfo.address))]):t._e()],1),t._v(" "),a("el-row",{staticStyle:{"boder-bottom":"1px solid #000"}},[a("el-col",{attrs:{span:4}},[t._v("展会号")]),t._v(" "),t.dcw&&"UNIT"===t.dcw.standInfo.chooseType?a("el-col",{attrs:{span:20}},[[a("span",[t._v(t._s(t.unitApplyInfo.stands.map(function(t){return t.name}).join(" ")))])]],2):a("el-col",{attrs:{span:20}},[t.unitApplyInfo&&t.unitApplyInfo.stands.length?[a("span",[t._v(t._s(t.unitApplyInfo.stands.map(function(t){return t.name}).join(" ")))])]:[a("span",[t._v("等待校方分配")])]],2)],1)],1)])]),t._v(" "),a("div",{staticClass:"page-title-status"},[a("p",[a("span",{staticClass:"title"},[t._v("审核状态：")]),a("el-tag",{attrs:{type:t.auditStatusLabelType,effect:"dark"}},[t._v(t._s(t.auditStatusLabel))])],1),t._v(" "),a("p",[a("span",{staticClass:"title"},[t._v("双选会名称：")]),a("span",[t._v(t._s(t.dcwName))])]),t._v(" "),a("p",[a("span",{staticClass:"title"},[t._v("双选会时间：")]),a("span",[t._v(t._s(t.dcw?t.dcw.getApplyTimeHtml():""))])])]),t._v(" "),t.loading?a("module-loader",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}]}):a("div",{staticClass:"module-container"},[a("unit-info",{ref:"unitInfo",attrs:{dcw:t.dcw,edit:t.canEditApplyInfo,rules:t.isManager?t.managerUnitApplyRules:{}},model:{value:t.unitApplyInfo,callback:function(e){t.unitApplyInfo=e},expression:"unitApplyInfo"}}),t._v(" "),a("positions-info",{attrs:{dcw:t.dcw,edit:t.canEditApplyInfo},model:{value:t.unitApplyInfo.positions,callback:function(e){t.$set(t.unitApplyInfo,"positions",e)},expression:"unitApplyInfo.positions"}}),t._v(" "),a("recruitment-info",{attrs:{dcw:t.dcw,edit:t.canEditApplyInfo},model:{value:t.unitApplyInfo.recruitment,callback:function(e){t.$set(t.unitApplyInfo,"recruitment",e)},expression:"unitApplyInfo.recruitment"}}),t._v(" "),a("stand-info",{model:{value:t.dcw.standInfo,callback:function(e){t.$set(t.dcw,"standInfo",e)},expression:"dcw.standInfo"}},[a("template",{slot:"start"},[a("el-form",[a("el-form-item",{attrs:{label:"双选会场地"}},[a("p",[t._v(t._s(t.dcw.baseInfo.address))])])],1)],1)],2),t._v(" "),"UNIT"===t.dcw.standInfo.chooseType?a("module-container",{attrs:{inline:"",loader:!t.standsInitialized,loaderText:"正在加载展位信息"}},[t.standsInitialized&&t.canEditApplyInfo?a("stand-picker",{attrs:{dcw:t.dcw,published:"",selectable:""},model:{value:t.stands,callback:function(e){t.stands=e},expression:"stands"}}):t._e(),t._v(" "),t.canEditApplyInfo?t._e():a("el-form",[a("el-form-item",{attrs:{label:"展位号"}},[a("p",[t._v(t._s(t.unitApplyInfo.stands.map(function(t){return t.name}).join(" ")))])])],1)],1):a("module-container",{attrs:{inline:""}},[t.unitApplyInfo.stands.length?a("el-form",[a("el-form-item",{attrs:{label:"展位号"}},[a("p",[t._v(t._s(t.unitApplyInfo.stands.map(function(t){return t.name}).join(" ")))])])],1):a("el-form",[a("el-form-item",{attrs:{label:"展位号"}},[a("p",[t._v("等待校方分配")])])],1)],1),t._v(" "),"MANAGER"===t.dcw.standInfo.chooseType?a("remark-info",{attrs:{dcw:t.dcw,edit:t.canEditApplyInfo},model:{value:t.unitApplyInfo.remark,callback:function(e){t.$set(t.unitApplyInfo,"remark",e)},expression:"unitApplyInfo.remark"}}):t._e(),t._v(" "),t.isUnit?a("module-container",{staticClass:"audit-actions",attrs:{actions:""}},[t.unitApplyInfo.id?t._e():a("el-button",{attrs:{type:"primary",size:"large"},on:{click:t.submitApply}},[t._v("提交审核")]),t._v(" "),[t.UnitApplyAuditStatus.COUNTERMAND,t.UnitApplyAuditStatus.REJECT].includes(t.auditStatus)?a("el-button",{attrs:{type:"primary",size:"large"},on:{click:t.resubmitApply}},[t._v("重新提交")]):t._e(),t._v(" "),t.auditStatus===t.UnitApplyAuditStatus.AUDITING?a("el-button",{attrs:{type:"danger",plain:"",size:"large"},on:{click:t.countermandApply}},[t._v("撤回")]):t._e()],1):t._e(),t._v(" "),t.isManager&&t.auditStatus===t.UnitApplyAuditStatus.AUDITING?a("module-container",{staticClass:"audit-actions",attrs:{actions:""}},[a("el-button",{attrs:{type:"danger",plain:"",size:"large"},on:{click:t.rejectApply}},[t._v("驳回")]),t._v(" "),a("el-button",{attrs:{size:"large"},on:{click:t.disagreeApply}},[t._v("不通过")]),t._v(" "),a("el-button",{attrs:{type:"primary",size:"large"},on:{click:t.agreeApply}},[t._v("通过")])],1):t._e()],1)],1)},staticRenderFns:[]};var S=a("C7Lr")(T,k,!1,function(t){a("7kTM")},null,null);e.a=S.exports},FYgV:function(t,e){},mrGO:function(t,e,a){"use strict";a.d(e,"a",function(){return o}),a.d(e,"b",function(){return l}),a.d(e,"d",function(){return u}),a.d(e,"c",function(){return c});var n,i,s=a("a3Yh"),r=a.n(s),o={AUDITING:0,PASSED:1,FAILED:2,COUNTERMAND:3,DISABLED:4,REJECT:5},l=(n={},r()(n,o.AUDITING,"待审核"),r()(n,o.PASSED,"已通过"),r()(n,o.FAILED,"未通过"),r()(n,o.COUNTERMAND,"已撤回"),r()(n,o.DISABLED,"停用"),r()(n,o.REJECT,"已驳回"),n),c=(i={},r()(i,o.AUDITING,"warning"),r()(i,o.PASSED,"success"),r()(i,o.FAILED,"danger"),r()(i,o.COUNTERMAND,"warning"),r()(i,o.DISABLED,"info"),r()(i,o.REJECT,"warning"),i),u=[];for(var d in l)u.push({id:d,text:l[d]})},yjtQ:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=a("t7Ya"),i={data:function(){var t=this;return{page:"LIST",table:{url:"/table-data/employment/doubleChoose/getDoubleChooseAuditList?ts=",search:{ts:+new Date,beginTime:"",endTime:""},columns:[{id:"doubleChooseName",title:"双选会名称",className:"text-left",width:150,hidden:!1,search:{type:"input",data:{placeholer:"",autoFocus:!1}},formatter:function(t){return n.a.fromApi(t).getNameHtmlWithStatus()}},{id:"areaName",title:"双选会地点",className:"text-left",width:150,hidden:!1,search:{type:"input",data:{placeholer:"",autoFocus:!1}}},{id:"time",title:"双选会时间",className:"text-left line-height-normal",width:145,hidden:!1,hover:!1,search:{type:"datetime",data:{placeholder:"双选会",dateFormat:"yyyy-MM-dd hh:ii",change:function(e){e.value,e.target;t.table.search.beginTime=t.$refs.table.tableSearchFields.time_start,t.table.search.endTime=t.$refs.table.tableSearchFields.time_end}}},formatter:function(t){return new Date(t.beginTime).format("yyyy-MM-dd HH:mm")+" ~<br/> "+new Date(t.endTime).format("yyyy-MM-dd HH:mm")}},{id:"applyTime",title:"申请时间",className:"text-left line-height-normal",width:145,hidden:!1,hover:!1,formatter:function(t){return new Date(t.applyBeginTime).format("yyyy-MM-dd HH:mm")+" ~<br/> "+new Date(t.applyEndTime).format("yyyy-MM-dd HH:mm")}},{id:"opt",title:"操作",width:120,hidden:!1,formatter:function(e){n.a.fromApi(e);return[{show:{tag:"a",text:"查看",callback:function(e,a){var i=n.a.fromApi(e);t.showDcw(i)}}}.show]}}]},currentDcw:null}},computed:{tableUrl:function(){return this.table.url+"&beginTime="+(this.table.search.beginTime||"")+"&endTime="+(this.table.search.endTime||"")+"&ts="+this.table.search.ts}},methods:{showDcw:function(t){this.$emit("to-detail",t)},refreshTable:function(){this.table.search.ts=+new Date}}},s={render:function(){var t=this.$createElement;return(this._self._c||t)("v-table",{ref:"table",attrs:{url:this.tableUrl,columns:this.table.columns,idField:"id",pagesize:"20",multiple:!1,search:!1,order:!0}})},staticRenderFns:[]},r=a("C7Lr")(i,s,!1,null,null,null).exports,o=a("mrGO"),l={data:function(){var t=this;return{table:{url:"/table-data/employment/doubleChoose/getMyDoubleChooseAuditList?ts=",search:{ts:+new Date,beginTime:"",endTime:""},columns:[{id:"doubleChooseName",title:"双选会名称",className:"text-left",width:130,hidden:!1,search:{type:"input",data:{placeholer:"",autoFocus:!1}},formatter:function(t){return n.a.fromApi(t).getNameHtmlWithStatus()}},{id:"areaName",title:"双选会地点",className:"text-left",width:130,hidden:!1,search:{type:"input",data:{placeholer:"",autoFocus:!1}}},{id:"time",title:"双选会时间",className:"text-left line-height-normal",width:145,hidden:!1,hover:!1,search:{type:"datetime",data:{placeholder:"双选会",dateFormat:"yyyy-MM-dd hh:ii",change:function(e){e.value,e.target;t.table.search.beginTime=t.$refs.table.tableSearchFields.time_start,t.table.search.endTime=t.$refs.table.tableSearchFields.time_end}}},formatter:function(t){return new Date(t.beginTime).format("yyyy-MM-dd HH:mm")+" ~<br/> "+new Date(t.endTime).format("yyyy-MM-dd HH:mm")}},{id:"boothName",title:"展位号",className:"text-left",width:100,hidden:!1,formatter:function(t){return t.boothPOS&&t.boothPOS.length?t.boothPOS.map(function(t){return t.name}).join(" "):0==t.boothChoose?"等待校方分配":" "}},{id:"auditTime",title:"提交时间",className:"text-left",width:140,hidden:!1},{id:"status",title:"审核状态",className:"text-left",width:90,hidden:!1,hover:!1,formatter:function(t){return'<span class="el-tag el-tag--small el-tag--dark el-tag--'+o.c[t.auditStatus]+'">'+o.b[t.auditStatus]+"</span>"},search:{type:"select",data:{placeholer:"审核状态",autoFocus:!1,optionsLabel:"text",optionsValue:"id",options:o.d.filter(function(t){return![o.a.DISABLED.toString()].includes(t.id)})}}},{id:"reason",title:"审核意见",className:"text-left",width:100,hidden:!1},{id:"opt",title:"操作",width:100,hidden:!1,formatter:function(e){n.a.fromApi(e);return[{show:{tag:"a",text:"查看",callback:function(e,a){var i=new n.a;i.id=e.doubleChooseId,i.baseInfo.name=e.name,i.applied=!!e.isApplied,t.toApplyDetail({dcw:i,unitApplyInfoId:e.id,auditStatus:parseInt(e.auditStatus)})}}}.show]}}]}}},computed:{tableUrl:function(){return this.table.url+"&beginTime="+(this.table.search.beginTime||"")+"&endTime="+(this.table.search.endTime||"")+"&ts="+this.table.search.ts}},methods:{toApplyDetail:function(t){this.$emit("to-apply-detail",t)},refreshTable:function(){this.table.search.ts=+new Date}}},c={render:function(){var t=this.$createElement;return(this._self._c||t)("v-table",{ref:"table",attrs:{url:this.tableUrl,columns:this.table.columns,idField:"id",pagesize:"20",multiple:!1,search:!1,order:!0}})},staticRenderFns:[]},u=a("C7Lr")(l,c,!1,null,null,null).exports,d=a("lC5x"),p=a.n(d),f=a("J0Oq"),m=a.n(f),h=a("IwLe"),v=a("VDkK"),y=a("T6UY"),w=a("Se9A"),b=a("N9Ox"),_=a("fSJ2"),A=a("p+qa"),I=(Number,String,w.a,b.a,h.a,v.a,y.a,{props:{id:Number,dcwName:String},components:{ModuleContainer:w.a,ModuleLoader:b.a,BaseInfo:h.a,StandInfo:v.a,StandUnit:y.a},data:function(){return{loading:!0,dcw:null,myUnit:null,page:"DETAIL",rules:{name:{hidden:!0},applyTime:{hidden:!0}},isMyUnitDisabled:!0}},computed:{},created:function(){var t=this;return m()(p.a.mark(function e(){return p.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.initDcw();case 2:return e.next=4,t.initMyUnit();case 4:return e.next=6,t.initMyUnitDisabled();case 6:return e.next=8,t.initApplyStatus();case 8:t.loading=!1;case 9:case"end":return e.stop()}},e,t)}))()},methods:{initDcw:function(){var t=this;return m()(p.a.mark(function e(){var a,i,s,r;return p.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,_.a.dcw.getByUnit(t.id);case 2:a=e.sent,i=a.state,s=a.message,r=a.data,i?t.dcw=n.a.fromApi(r):t.$toast(s);case 7:case"end":return e.stop()}},e,t)}))()},initMyUnit:function(){var t=this;return m()(p.a.mark(function e(){var a,n,i,s;return p.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(A.k)();case 2:a=e.sent,n=a.state,i=a.message,s=a.data,n?t.myUnit=s:t.$toast(i);case 7:case"end":return e.stop()}},e,t)}))()},initMyUnitDisabled:function(){var t=this;return m()(p.a.mark(function e(){var a,n,i,s;return p.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(A.c)();case 2:a=e.sent,n=a.state,i=a.message,s=a.data,n?t.isMyUnitDisabled=!s:t.$toast(i);case 7:case"end":return e.stop()}},e,t)}))()},initApplyStatus:function(){var t=this;return m()(p.a.mark(function e(){return p.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(t.dcw.applied=t.dcw.standUnits.some(function(e){return e.unitId===t.myUnit.companyId}),!t.dcw.applied){e.next=3;break}return e.abrupt("return");case 3:t.dcw.applied=["0","1","3","4"].includes(t.dcw.applyStatus+"");case 4:case"end":return e.stop()}},e,t)}))()},showStandUnit:function(t){this.standUnitId=t.id,this.page="STAND_UNIT"},backToDetail:function(){this.page="DETAIL"},toApply:function(){this.$emit("to-apply")},backToList:function(){this.$emit("back-to-list")}}}),g={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return"DETAIL"===t.page?a("div",[a("div",{staticClass:"back",on:{click:t.backToList}},[a("i",{staticClass:"el-icon-back"}),t._v("返回\n  ")]),t._v(" "),a("div",{staticClass:"page-title"},[t._v("\n    "+t._s("双选会名称："+t.dcwName)+"\n  ")]),t._v(" "),t.loading?a("module-loader",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}]}):a("div",{staticClass:"module-container"},[a("base-info",{attrs:{rules:t.rules},model:{value:t.dcw.baseInfo,callback:function(e){t.$set(t.dcw,"baseInfo",e)},expression:"dcw.baseInfo"}}),t._v(" "),a("module-container",{attrs:{title:"申请信息"}},[a("el-form",{nativeOn:{submit:function(t){t.preventDefault()}}},[a("el-form-item",{attrs:{label:"申请时间"}},[a("p",[t._v(t._s(t.dcw.baseInfo.applyTimeRange.map(function(t){return new Date(t).format("yyyy-MM-dd HH:mm")}).join(" ~ "))+"  "),a("span",{staticClass:"apply-time-tip"},[t._v(t._s(t.dcw.isApplying()?"":"（不在申请时间内）"))])])])],1)],1),t._v(" "),a("stand-info",{model:{value:t.dcw.standInfo,callback:function(e){t.$set(t.dcw,"standInfo",e)},expression:"dcw.standInfo"}}),t._v(" "),a("module-container",{attrs:{inline:""}},[a("div",{staticClass:"stand-units"},[a("el-table",{staticStyle:{width:"100%"},attrs:{data:t.dcw.standUnits}},[a("el-table-column",{attrs:{prop:"stand.name",label:"展位号",width:"80"}}),t._v(" "),a("el-table-column",{attrs:{prop:"name",label:"用人单位",width:"260"}}),t._v(" "),a("el-table-column",{attrs:{prop:"typeName",label:"单位性质",width:"120"}}),t._v(" "),a("el-table-column",{attrs:{prop:"positionsCount",label:"职位总数",width:"120"}}),t._v(" "),a("el-table-column",{attrs:{prop:"opt",label:"操作",align:"right"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("el-button",{attrs:{type:"text"},on:{click:function(a){return t.showStandUnit(e.row)}}},[t._v("查看")])]}}],null,!1,1199398806)})],1)],1)]),t._v(" "),t.dcw.applied||!t.dcw.isApplying()||t.isMyUnitDisabled?t._e():a("module-container",{attrs:{actions:""}},[a("el-button",{attrs:{type:"primary",size:"large"},on:{click:t.toApply}},[t._v("申请")])],1)],1)],1):a("div",[a("stand-unit",{attrs:{dcw:t.dcw,standUnitId:t.standUnitId,"only-look":""},on:{"back-to-detail":t.backToDetail}})],1)},staticRenderFns:[]};var D=a("C7Lr")(I,g,!1,function(t){a("FYgV")},"data-v-58258363",null).exports,T=a("C6fk"),k=a("DmHF"),S=(T.a,k.a,{components:{UnitAllDcwList:r,UnitMyDcwList:u,UnitDcwDetail:D,UnitApplyDcw:T.a,UnitApplyDetail:k.a},data:function(){return{activeList:"ALL",page:"LIST",currentDcw:null,unitApplyInfoId:null,auditStatus:null}},watch:{activeList:function(t){if(t){var e={ALL:"allDcwList",MINE:"auditList"}[t];this.$refs[e].refreshTable&&this.$refs[e].refreshTable()}}},methods:{toDetail:function(t){this.currentDcw=t,this.page="DETAIL"},toApply:function(t){this.page="APPLY"},toApplyDetail:function(t){var e=t.unitApplyInfoId,a=t.dcw,n=t.auditStatus;this.currentDcw=a,this.unitApplyInfoId=e,this.auditStatus=n,this.page="APPLY_DETAIL"},backToList:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=t.refresh,a=t.tableName;this.page="LIST",e&&this.$refs[a].refreshTable()},applyBack:function(){this.page="LIST"},toMyDcw:function(){this.page="LIST",this.activeList="MINE"},refreshTable:function(){this.table.search.ts=+new Date}}}),x={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"main-content"},[a("div",{directives:[{name:"show",rawName:"v-show",value:"LIST"===t.page,expression:"page === 'LIST'"}],staticClass:"tab-content"},[a("el-tabs",{model:{value:t.activeList,callback:function(e){t.activeList=e},expression:"activeList"}},[a("el-tab-pane",{attrs:{label:"双选会列表",name:"ALL"}},[a("unit-all-dcw-list",{ref:"allDcwList",on:{"to-detail":t.toDetail}})],1),t._v(" "),a("el-tab-pane",{attrs:{label:"我的双选会",name:"MINE"}},[a("unit-my-dcw-list",{ref:"auditList",on:{"to-detail":t.toDetail,"to-apply":t.toApply,"to-apply-detail":t.toApplyDetail}})],1)],1)],1),t._v(" "),"DETAIL"===t.page?a("div",[a("unit-dcw-detail",{attrs:{id:t.currentDcw.id,"dcw-name":t.currentDcw.baseInfo.name},on:{"back-to-list":t.backToList,"to-apply":t.toApply}})],1):t._e(),t._v(" "),"APPLY"===t.page?a("div",[a("unit-apply-dcw",{attrs:{id:t.currentDcw.id,"dcw-name":t.currentDcw.baseInfo.name},on:{"back-to-list":t.applyBack,"to-my-dcw":t.toMyDcw}})],1):t._e(),t._v(" "),"APPLY_DETAIL"===t.page?a("div",[a("unit-apply-detail",{attrs:{id:t.currentDcw.id,"dcw-name":t.currentDcw.baseInfo.name,"unit-apply-info-id":t.unitApplyInfoId,"audit-status":t.auditStatus,"is-unit":""},on:{"back-to-list":t.backToList}})],1):t._e()])},staticRenderFns:[]};var L=a("C7Lr")(S,x,!1,function(t){a("4705")},null,null);e.default=L.exports}});