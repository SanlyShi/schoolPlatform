webpackJsonp([82],{"5lKl":function(t,e){},"7kTM":function(t,e){},DmHF:function(t,e,a){"use strict";a("68u/"),a("YXeK");var n=a("EA6R"),s=a.n(n),i=a("lC5x"),r=a.n(i),o=a("J0Oq"),l=a.n(o),c=a("IwLe"),u=a("VDkK"),d=a("hn+R"),p=a("713C"),f=a("V/it"),m=a("B/WJ"),v=a("2IYH"),y=a("Se9A"),h=(Boolean,Boolean,Object,Object,v.a,y.a,{props:{inline:Boolean,edit:Boolean,rules:{type:Object,default:Object}},mixins:[v.a],components:{ModuleContainer:y.a}}),_={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("module-container",{attrs:{title:"备注",inline:t.inline}},[t.edit?a("el-input",{attrs:{type:"textarea",autosize:{minRows:3}},model:{value:t.form,callback:function(e){t.form=e},expression:"form"}}):a("p",[t._v(t._s(t.form))])],1)},staticRenderFns:[]},I=a("C7Lr")(h,_,!1,null,null,null).exports,A=a("N9Ox"),g=a("fSJ2"),w=a("p+qa"),b=a("t7Ya"),k=a("mrGO"),T=(Number,Number,String,Number,Boolean,Boolean,y.a,A.a,c.a,u.a,d.a,p.a,f.a,m.a,{props:{unitApplyInfoId:Number,id:Number,dcwName:String,auditStatus:Number,isUnit:Boolean,isManager:Boolean},components:{ModuleContainer:y.a,ModuleLoader:A.a,BaseInfo:c.a,StandInfo:u.a,StandPicker:d.a,UnitInfo:p.a,PositionsInfo:f.a,RecruitmentInfo:m.a,RemarkInfo:I},data:function(){return{UnitApplyAuditStatus:k.a,loading:!0,dcw:null,unitApplyInfo:null,standsInitialized:!1,stands:[],rules:{name:{hidden:!0},applyTime:{hidden:!0}},managerUnitApplyRules:{desc:{readonly:!0}}}},computed:{auditStatusLabel:function(){return k.b[this.auditStatus]},auditStatusLabelType:function(){var t="";switch(this.auditStatus){case k.a.AUDITING:t="warning";break;case k.a.PASSED:t="success";break;case k.a.FAILED:t="danger";break;case k.a.COUNTERMAND:t="warning";break;case k.a.DISABLED:t="info";break;case k.a.REJECT:t="warning"}return t},canEditApplyInfo:function(){return this.isManager?this.auditStatus===k.a.AUDITING:!!this.isUnit&&[k.a.COUNTERMAND,k.a.REJECT].includes(this.auditStatus)},canAuditing:function(){return this.isManager&&this.auditStatus===k.a.AUDITING}},created:function(){var t=this;return l()(r.a.mark(function e(){return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.initDcw();case 2:return e.next=4,t.initUnitApplyInfo();case 4:return e.next=6,t.initStands();case 6:t.loading=!1;case 7:case"end":return e.stop()}},e,t)}))()},methods:{downloadTicket:function(){this.getPdf("入场券")},initDcw:function(){var t=this;return l()(r.a.mark(function e(){var a,n,s,i;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,g.a.dcw.get(t.id);case 2:a=e.sent,n=a.state,s=a.message,i=a.data,n?t.dcw=b.a.fromApi(i):t.$toast(s);case 7:case"end":return e.stop()}},e,t)}))()},initUnitApplyInfo:function(){var t=this;return l()(r.a.mark(function e(){var a,n,s,i;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,g.a.dcw.getUnitApplyInfo(t.unitApplyInfoId);case 2:a=e.sent,n=a.state,s=a.message,i=a.data,n?t.unitApplyInfo=b.d.fromApi(i):t.$toast(s);case 7:case"end":return e.stop()}},e,t)}))()},initStands:function(){var t=this;return l()(r.a.mark(function e(){var a;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:a=t.unitApplyInfo.stands.map(function(t){return t.id}),t.stands=t.dcw.standInfo.stands.map(function(t){var e=new b.c(t);return a.includes(t.id)&&(e.selected=!0,e.occupied=!1,e.applied=!1),e}),t.standsInitialized=!0;case 3:case"end":return e.stop()}},e,t)}))()},backToList:function(){this.$emit("back-to-list",{refresh:!0,tableName:"auditList"})},submitApply:function(){var t=this;return l()(r.a.mark(function e(){var a,n,s;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return alert("什么鬼"),e.next=3,g.a.dcw.apply(t.dcw.id,t.unitApplyInfo);case 3:a=e.sent,n=a.state,s=a.message,a.data,n?t.$toast("提交成功"):t.$toast(s);case 8:case"end":return e.stop()}},e,t)}))()},resubmitApply:function(){var t=this;return l()(r.a.mark(function e(){var a,n,s;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,t.$refs.unitInfo.validate();case 3:e.next=9;break;case 5:return e.prev=5,e.t0=e.catch(0),Object(w.a)(0,200),e.abrupt("return");case 9:if(t.unitApplyInfo.stands=t.stands.filter(function(t){return t.selected}),"UNIT"!==t.dcw.standInfo.chooseType||t.unitApplyInfo.stands.length){e.next=13;break}return t.$toast("您还未选择展位"),e.abrupt("return");case 13:return e.next=15,g.a.dcw.resubmit(t.unitApplyInfo);case 15:a=e.sent,n=a.state,s=a.message,a.data,n?(t.$toast("提交成功"),t.auditStatus=k.a.AUDITING):t.$toast(s);case 20:case"end":return e.stop()}},e,t,[[0,5]])}))()},countermandApply:function(){var t=this;return l()(r.a.mark(function e(){return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:s.a.confirm("确认撤回申请?").then(l()(r.a.mark(function e(){var a,n,s;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,g.a.dcw.countermand(t.unitApplyInfo.id);case 2:a=e.sent,n=a.state,s=a.message,a.data,n?(t.auditStatus=k.a.COUNTERMAND,t.$toast("撤回成功")):t.$toast(s);case 7:case"end":return e.stop()}},e,t)})));case 1:case"end":return e.stop()}},e,t)}))()},rejectApply:function(){var t=this;return l()(r.a.mark(function e(){return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:s.a.prompt("请填写驳回意见","驳回").then(function(){var e=l()(r.a.mark(function e(a){var n,i,o,l=a.value;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,g.a.dcw.reject(t.unitApplyInfo.id,l);case 2:n=e.sent,i=n.state,o=n.message,n.data,i?(t.auditStatus=k.a.REJECT,s.a.confirm("驳回成功，是否返回审核列表?").then(function(){t.backToList()})):t.$toast(o);case 7:case"end":return e.stop()}},e,t)}));return function(t){return e.apply(this,arguments)}}());case 1:case"end":return e.stop()}},e,t)}))()},disagreeApply:function(){var t=this;return l()(r.a.mark(function e(){return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:s.a.prompt("请填写不通过意见","不通过").then(function(){var e=l()(r.a.mark(function e(a){var n,i,o,l=a.value;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,g.a.dcw.disagree(t.unitApplyInfo.id,l);case 2:n=e.sent,i=n.state,o=n.message,n.data,i?(t.auditStatus=k.a.FAILED,s.a.confirm("操作成功，是否返回审核列表?").then(function(){t.backToList()})):t.$toast(o);case 7:case"end":return e.stop()}},e,t)}));return function(t){return e.apply(this,arguments)}}());case 1:case"end":return e.stop()}},e,t)}))()},agreeApply:function(){var t=this;return l()(r.a.mark(function e(){return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:t.unitApplyInfo.stands=t.stands.filter(function(t){return t.selected}),s.a.confirm("确认同意该申请?").then(l()(r.a.mark(function e(){var a,n,i;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,g.a.dcw.agree(t.unitApplyInfo);case 2:a=e.sent,n=a.state,i=a.message,a.data,n?(t.auditStatus=k.a.PASSED,s.a.confirm("操作成功，是否返回审核列表?").then(function(){t.backToList()})):t.$toast(i);case 7:case"end":return e.stop()}},e,t)})));case 2:case"end":return e.stop()}},e,t)}))()}}}),C={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("div",{staticClass:"back titleBack"},[a("div",{on:{click:t.backToList}},[a("i",{staticClass:"el-icon-back",staticStyle:{display:"inline-block"}}),t._v("返回")]),t._v(" "),a("div",{staticClass:"getTicket"},[a("el-button",{attrs:{type:"primary"},on:{click:t.downloadTicket}},[t._v("下载入场券")])],1)]),t._v(" "),a("div",{staticClass:"pdfdom",attrs:{id:"pdfDom"}},[a("div",{staticStyle:{border:"1px solid #000"}},[a("div",{staticClass:"title"},[a("h5",{staticClass:"mid",staticStyle:{"font-weight":"normal","font-size":"20px"}},[t._v("双选会名称")]),t._v(" "),a("h3",{staticClass:"mid"},[t._v("参会通知举办时间：")]),t._v(" "),a("p",{staticClass:"mid"},[t._v(t._s(t.dcw?t.dcw.getApplyTimeHtml():""))])]),t._v(" "),a("div",{staticClass:"details big"},[t._v("\n      参会详情\n    ")]),t._v(" "),t.unitApplyInfo?a("div",{staticClass:"th"},[a("el-row",[a("el-col",{attrs:{span:4}},[t._v("参展单位")]),t._v(" "),a("el-col",{attrs:{span:20}},[t._v(t._s(t.unitApplyInfo.name))])],1),t._v(" "),a("el-row",[a("el-col",{attrs:{span:4}},[t._v("单位地址")]),t._v(" "),a("el-col",{attrs:{span:20}},[t._v(t._s(t.unitApplyInfo.address))])],1),t._v(" "),a("el-row",[a("el-col",{attrs:{span:4}},[t._v("单位联系人")]),t._v(" "),a("el-col",{attrs:{span:8}},[t._v(t._s(t.unitApplyInfo.contactPeople))]),t._v(" "),a("el-col",{attrs:{span:4}},[t._v("单位电话")]),t._v(" "),a("el-col",{attrs:{span:8}},[t._v(t._s(t.unitApplyInfo.contactPhone))])],1),t._v(" "),a("el-row",[a("el-col",{attrs:{span:4}},[t._v("单位邮箱")]),t._v(" "),a("el-col",{attrs:{span:20}},[t._v(t._s(t.unitApplyInfo.email))])],1)],1):t._e(),t._v(" "),t.unitApplyInfo&&t.unitApplyInfo.positions.length?a("div",{staticClass:"position big"},[t._v("\n      职位信息\n    ")]):t._e(),t._v(" "),t.unitApplyInfo&&t.unitApplyInfo.positions.length?a("div",{staticClass:"th"},[a("el-row",[a("el-col",{attrs:{span:4}},[t._v("职位名称")]),t._v(" "),a("el-col",{staticStyle:{"font-weight":"bold"},attrs:{span:8}},[t._v("专业要求")]),t._v(" "),a("el-col",{attrs:{span:4}},[t._v("招聘人数")]),t._v(" "),a("el-col",{staticStyle:{"font-weight":"bold"},attrs:{span:8}},[t._v("工作地点")])],1),t._v(" "),t._l(t.unitApplyInfo.positions,function(e,n){return a("el-row",{key:n},[a("el-col",{staticStyle:{"font-weight":"normal"},attrs:{span:4}},[t._v(t._s(e.positionName))]),t._v(" "),a("el-col",{attrs:{span:8}},[t._v(t._s(e.major))]),t._v(" "),a("el-col",{staticStyle:{"font-weight":"normal"},attrs:{span:4}},[t._v(t._s(e.recruitNumber))]),t._v(" "),a("el-col",{attrs:{span:8}},[t._v(t._s(e.workplace))])],1)})],2):t._e(),t._v(" "),a("div",{staticClass:"position big"},[t._v("\n      展会信息\n    ")]),t._v(" "),a("div",{staticClass:"th"},[a("el-row",[a("el-col",{attrs:{span:4}},[t._v("双选会地点")]),t._v(" "),t.dcw?a("el-col",{attrs:{span:20}},[t._v(t._s(t.dcw.baseInfo.address))]):t._e()],1),t._v(" "),a("el-row",{staticStyle:{"boder-bottom":"1px solid #000"}},[a("el-col",{attrs:{span:4}},[t._v("展会号")]),t._v(" "),t.dcw&&"UNIT"===t.dcw.standInfo.chooseType?a("el-col",{attrs:{span:20}},[[a("span",[t._v(t._s(t.unitApplyInfo.stands.map(function(t){return t.name}).join(" ")))])]],2):a("el-col",{attrs:{span:20}},[t.unitApplyInfo&&t.unitApplyInfo.stands.length?[a("span",[t._v(t._s(t.unitApplyInfo.stands.map(function(t){return t.name}).join(" ")))])]:[a("span",[t._v("等待校方分配")])]],2)],1)],1)])]),t._v(" "),a("div",{staticClass:"page-title-status"},[a("p",[a("span",{staticClass:"title"},[t._v("审核状态：")]),a("el-tag",{attrs:{type:t.auditStatusLabelType,effect:"dark"}},[t._v(t._s(t.auditStatusLabel))])],1),t._v(" "),a("p",[a("span",{staticClass:"title"},[t._v("双选会名称：")]),a("span",[t._v(t._s(t.dcwName))])]),t._v(" "),a("p",[a("span",{staticClass:"title"},[t._v("双选会时间：")]),a("span",[t._v(t._s(t.dcw?t.dcw.getApplyTimeHtml():""))])])]),t._v(" "),t.loading?a("module-loader",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}]}):a("div",{staticClass:"module-container"},[a("unit-info",{ref:"unitInfo",attrs:{dcw:t.dcw,edit:t.canEditApplyInfo,rules:t.isManager?t.managerUnitApplyRules:{}},model:{value:t.unitApplyInfo,callback:function(e){t.unitApplyInfo=e},expression:"unitApplyInfo"}}),t._v(" "),a("positions-info",{attrs:{dcw:t.dcw,edit:t.canEditApplyInfo},model:{value:t.unitApplyInfo.positions,callback:function(e){t.$set(t.unitApplyInfo,"positions",e)},expression:"unitApplyInfo.positions"}}),t._v(" "),a("recruitment-info",{attrs:{dcw:t.dcw,edit:t.canEditApplyInfo},model:{value:t.unitApplyInfo.recruitment,callback:function(e){t.$set(t.unitApplyInfo,"recruitment",e)},expression:"unitApplyInfo.recruitment"}}),t._v(" "),a("stand-info",{model:{value:t.dcw.standInfo,callback:function(e){t.$set(t.dcw,"standInfo",e)},expression:"dcw.standInfo"}},[a("template",{slot:"start"},[a("el-form",[a("el-form-item",{attrs:{label:"双选会场地"}},[a("p",[t._v(t._s(t.dcw.baseInfo.address))])])],1)],1)],2),t._v(" "),"UNIT"===t.dcw.standInfo.chooseType?a("module-container",{attrs:{inline:"",loader:!t.standsInitialized,loaderText:"正在加载展位信息"}},[t.standsInitialized&&t.canEditApplyInfo?a("stand-picker",{attrs:{dcw:t.dcw,published:"",selectable:""},model:{value:t.stands,callback:function(e){t.stands=e},expression:"stands"}}):t._e(),t._v(" "),t.canEditApplyInfo?t._e():a("el-form",[a("el-form-item",{attrs:{label:"展位号"}},[a("p",[t._v(t._s(t.unitApplyInfo.stands.map(function(t){return t.name}).join(" ")))])])],1)],1):a("module-container",{attrs:{inline:""}},[t.unitApplyInfo.stands.length?a("el-form",[a("el-form-item",{attrs:{label:"展位号"}},[a("p",[t._v(t._s(t.unitApplyInfo.stands.map(function(t){return t.name}).join(" ")))])])],1):a("el-form",[a("el-form-item",{attrs:{label:"展位号"}},[a("p",[t._v("等待校方分配")])])],1)],1),t._v(" "),"MANAGER"===t.dcw.standInfo.chooseType?a("remark-info",{attrs:{dcw:t.dcw,edit:t.canEditApplyInfo},model:{value:t.unitApplyInfo.remark,callback:function(e){t.$set(t.unitApplyInfo,"remark",e)},expression:"unitApplyInfo.remark"}}):t._e(),t._v(" "),t.isUnit?a("module-container",{staticClass:"audit-actions",attrs:{actions:""}},[t.unitApplyInfo.id?t._e():a("el-button",{attrs:{type:"primary",size:"large"},on:{click:t.submitApply}},[t._v("提交审核")]),t._v(" "),[t.UnitApplyAuditStatus.COUNTERMAND,t.UnitApplyAuditStatus.REJECT].includes(t.auditStatus)?a("el-button",{attrs:{type:"primary",size:"large"},on:{click:t.resubmitApply}},[t._v("重新提交")]):t._e(),t._v(" "),t.auditStatus===t.UnitApplyAuditStatus.AUDITING?a("el-button",{attrs:{type:"danger",plain:"",size:"large"},on:{click:t.countermandApply}},[t._v("撤回")]):t._e()],1):t._e(),t._v(" "),t.isManager&&t.auditStatus===t.UnitApplyAuditStatus.AUDITING?a("module-container",{staticClass:"audit-actions",attrs:{actions:""}},[a("el-button",{attrs:{type:"danger",plain:"",size:"large"},on:{click:t.rejectApply}},[t._v("驳回")]),t._v(" "),a("el-button",{attrs:{size:"large"},on:{click:t.disagreeApply}},[t._v("不通过")]),t._v(" "),a("el-button",{attrs:{type:"primary",size:"large"},on:{click:t.agreeApply}},[t._v("通过")])],1):t._e()],1)],1)},staticRenderFns:[]};var S=a("C7Lr")(T,C,!1,function(t){a("7kTM")},null,null);e.a=S.exports},QMmo:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=a("lC5x"),s=a.n(n),i=a("J0Oq"),r=a.n(i),o=a("t7Ya"),l=a("mrGO"),c=a("DmHF"),u=a("fSJ2"),d=(c.a,"SCHOOL"),p="COLLEGE",f={components:{UnitApplyDetail:c.a},data:function(){var t=this;return{page:"LIST",dcw:new o.a,role:d,colleges:[],loadingColleges:!0,collegeCode:"",unitApplyInfoId:null,auditStatus:null,table:{url:"/table-data/employment/audit/getDoubleChooseAuditBySearch?ts=",search:{ts:+new Date,beginTime:"",endTime:""},columns:[{id:"companyName",title:"单位名称",className:"text-left",width:100,hidden:!1,search:{type:"",data:{placeholer:"",autoFocus:!1}}},{id:"doubleChooseName",title:"双选会名称",className:"text-left",width:100,hidden:!1,search:{type:"",data:{placeholer:"",autoFocus:!1}}},{id:"time",title:"双选会时间",className:"text-left line-height-normal",width:165,hidden:!1,hover:!1,formatter:function(t){return new Date(t.beginTime).format("yyyy-MM-dd HH:mm")+" -<br/> "+new Date(t.endTime).format("yyyy-MM-dd HH:mm")}},{id:"applyTime",title:"单位报名时间",className:"text-left line-height-normal",width:145,hidden:!1,hover:!1,formatter:function(t){return new Date(t.applyBeginTime).format("yyyy-MM-dd HH:mm")+" -<br/> "+new Date(t.applyEndTime).format("yyyy-MM-dd HH:mm")}},{id:"createTime",title:"提交时间",className:"text-left",width:145,hidden:!1},{id:"status",title:"审核状态",className:"text-left",width:90,hidden:!1,hover:!1,formatter:function(t){return'<span class="el-tag el-tag--small el-tag--dark el-tag--'+l.c[t.status]+'">'+l.b[t.status]+"</span>"},search:{type:"select",data:{placeholer:"审核状态",autoFocus:!1,optionsLabel:"text",optionsValue:"id",options:l.d.filter(function(t){return![l.a.COUNTERMAND.toString(),l.a.DISABLED.toString()].includes(t.id)})}}},{id:"reason",title:"审核意见",className:"text-left",width:100,hidden:!1,formatter:function(t){return t.reason||""}},{id:"opt",title:"操作",width:120,hidden:!1,formatter:function(e){return[{show:{tag:"a",text:e.status===l.a.AUDITING?"审核":"查看",callback:function(e,a){var n=new o.a;n.id=e.doubleChooseId,n.baseInfo.name=e.doubleChooseName,t.toApplyDetail({unitApplyInfoId:e.id,dcw:n,auditStatus:parseInt(e.status)})}}}.show]}}]}}},computed:{tableUrl:function(){return this.table.url+"&major="+this.collegeCode+"&beginTime="+(this.table.search.beginTime||"")+"&endTime="+(this.table.search.endTime||"")+"&ts="+this.table.search.ts}},created:function(){var t=this;return r()(s.a.mark(function e(){return s.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(t.role=t.$attrs.data&&t.$attrs.data.data&&t.$attrs.data.data.role||d,t.role!==p){e.next=4;break}return e.next=4,t.initManagedColleges();case 4:case"end":return e.stop()}},e,t)}))()},methods:{initManagedColleges:function(){var t=this;return r()(s.a.mark(function e(){var a;return s.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u.a.dcw.getManagedColleges();case 2:(a=e.sent).state?(t.colleges=a.data.map(function(t){return{id:t.collegeCode,name:t.collegeName}}),t.loadingColleges=!1,t.collegeCode=t.colleges[0]&&t.colleges[0].id):t.$toast(a.message);case 4:case"end":return e.stop()}},e,t)}))()},toApplyDetail:function(t){var e=t.unitApplyInfoId,a=t.dcw,n=t.auditStatus;this.dcw=a,this.unitApplyInfoId=e,this.auditStatus=n,this.page="DETAIL"},backToList:function(){this.page="LIST",this.refreshTable()},refreshTable:function(){this.table.search.ts=+new Date}}},m={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"main-content"},[a("div",{directives:[{name:"show",rawName:"v-show",value:"LIST"===t.page,expression:"page === 'LIST'"}]},["SCHOOL"===t.role||t.collegeCode?a("v-table",{ref:"manageAuditTable",attrs:{url:t.tableUrl,columns:t.table.columns,pagesize:"20",idField:"id",multiple:!1,order:!0,search:!1}},[a("div",{attrs:{slot:"btn-group"},slot:"btn-group"},["COLLEGE"===t.role?a("el-select",{attrs:{placeholder:"请选择学院",filterable:""},model:{value:t.collegeCode,callback:function(e){t.collegeCode=e},expression:"collegeCode"}},t._l(t.colleges,function(t){return a("el-option",{key:"college-"+t.id,attrs:{label:t.name,value:t.id}})}),1):t._e()],1)]):a("div",[a("div",{directives:[{name:"loading",rawName:"v-loading",value:t.loadingColleges,expression:"loadingColleges"}],staticClass:"college-loader",attrs:{"element-loading-text":"加载中"}},[t._v(t._s(t.loadingColleges?"":"您没有分管的学院"))])])],1),t._v(" "),"DETAIL"===t.page?a("unit-apply-detail",{attrs:{id:t.dcw.id,"dcw-name":t.dcw.baseInfo.name,"unit-apply-info-id":t.unitApplyInfoId,"audit-status":t.auditStatus,"is-manager":""},on:{"back-to-list":t.backToList}}):t._e()],1)},staticRenderFns:[]};var v=a("C7Lr")(f,m,!1,function(t){a("5lKl")},null,null);e.default=v.exports},mrGO:function(t,e,a){"use strict";a.d(e,"a",function(){return o}),a.d(e,"b",function(){return l}),a.d(e,"d",function(){return u}),a.d(e,"c",function(){return c});var n,s,i=a("a3Yh"),r=a.n(i),o={AUDITING:0,PASSED:1,FAILED:2,COUNTERMAND:3,DISABLED:4,REJECT:5},l=(n={},r()(n,o.AUDITING,"待审核"),r()(n,o.PASSED,"已通过"),r()(n,o.FAILED,"未通过"),r()(n,o.COUNTERMAND,"已撤回"),r()(n,o.DISABLED,"停用"),r()(n,o.REJECT,"已驳回"),n),c=(s={},r()(s,o.AUDITING,"warning"),r()(s,o.PASSED,"success"),r()(s,o.FAILED,"danger"),r()(s,o.COUNTERMAND,"warning"),r()(s,o.DISABLED,"info"),r()(s,o.REJECT,"warning"),s),u=[];for(var d in l)u.push({id:d,text:l[d]})}});