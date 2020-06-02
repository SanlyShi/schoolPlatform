webpackJsonp([60],{DJbW:function(e,a){},iwuj:function(e,a){},nLRR:function(e,a,t){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var i=t("HzJ8"),s=t.n(i),l=t("C331"),n={props:["curPlaceId"],data:function(){return{isEdit:!1,errMsg:!1,curPlaceInfo:{},pickerOptions:{disabledDate:function(e){return e.getTime()<Date.now()-864e5}},placeInfo:{name:"",peopleNum:"",description:"",time:"",timeRangeObj:[]},placeInfo_rule:{name:[{required:!0,message:"请输入场地名称"}],peopleNum:[{validator:function(e,a,t){if(a){if(isNaN(a)||!(a>=1))return t(new Error("人数不可小于1"));t()}},trigger:"blur"}]},startTime:"",endTime:""}},methods:{changEdit:function(){var e=this;this.isEdit=!this.isEdit,this.placeInfo={name:this.curPlaceInfo.name,peopleNum:this.curPlaceInfo.peopleNum,description:this.curPlaceInfo.description,timeRangeObj:[]},this.$nextTick(function(){e.$refs.placeInfo.clearValidate()})},getIntroduction:function(e){this.placeInfo.description=e},timeRangeChange:function(e){},dateChange:function(e){},addTimeRange:function(){this.placeInfo.timeRangeObj.push({year:"",timeRange:""})},deteleRange:function(e){this.placeInfo.timeRangeObj.splice(e,1)},deteleRange_data:function(e){var a=this,t="/api/employment/area/deleteUseTimeById?id="+e;Object(l.e)({url:t,type:"post",success:function(e){e.state?(a.getPlaceInfo(),a.$message.success("删除成功")):a.message.error(e.message)}})},placeSubmit:function(){var e=this;this.$refs.placeInfo.validate(function(a){if(a){var t=e.placeInfo.timeRangeObj,i=[],n=!0,c="",o="",r="";if(""==e.curPlaceId){if(!t.length)return e.$message.error("请添加时段")}else if(!t.length&&!e.curPlaceInfo.freeTime.length)return e.$message.error("请添加时段");if(t.map(function(a){for(var t in a)if(!a[t])return n=!1,e.$message.error("请选择可用时间段")}),!n)return;if(t.length){var d=!0,p=!1,u=void 0;try{for(var m,f=s()(t);!(d=(m=f.next()).done);d=!0){var v=m.value;i.push({beginTime:v.year+" "+v.timeRange[0]+":00",endTime:v.year+" "+v.timeRange[1]+":00"})}}catch(e){p=!0,u=e}finally{try{!d&&f.return&&f.return()}finally{if(p)throw u}}}if(e.curPlaceId){c="/api/employment/area/updateArea",o="post",r="修改场地信息成功";var h=e.curPlaceInfo.freeTime;if(h.length){var _=!0,g=!1,y=void 0;try{for(var I,E=s()(h);!(_=(I=E.next()).done);_=!0){var b=I.value;i.push({id:b.id,beginTime:b.date+" "+b.startTime,endTime:b.date+" "+b.endTime,status:b.status})}}catch(e){g=!0,y=e}finally{try{!_&&E.return&&E.return()}finally{if(g)throw y}}}}else c="/api/employment/area/addArea",o="post",r="新增场地成功";var x={id:e.curPlaceId,name:e.placeInfo.name,peopleNum:e.placeInfo.peopleNum,description:e.placeInfo.description,areaUseVOList:i};Object(l.e)({url:c,type:o,data:x,success:function(a){a.state?(e.placeInfo.timeRangeObj=[],e.$message.success(r),e.curPlaceId?e.getPlaceInfo():e.$emit("getError")):e.$message.error(a.message)}})}})},getPlaceInfo:function(){var e=this;if(this.curPlaceId){var a="/api/employment/area/getArea?id="+this.curPlaceId;Object(l.e)({url:a,type:"get",success:function(a){if(a.state){if(e.curPlaceInfo=a.data,e.curPlaceInfo.freeTime=[],e.curPlaceInfo.areaUseVOList.length){var t=!0,i=!1,l=void 0;try{for(var n,c=s()(e.curPlaceInfo.areaUseVOList);!(t=(n=c.next()).done);t=!0){var o=n.value,r=o.beginTime.split(" ")[0],d=o.beginTime.split(" ")[1],p=o.endTime.split(" ")[1],u=o.id,m=o.status;e.curPlaceInfo.freeTime.push({date:r,startTime:d,endTime:p,id:u,status:m})}}catch(e){i=!0,l=e}finally{try{!t&&c.return&&c.return()}finally{if(i)throw l}}}}else e.$emit("getError","获取场地信息失败,请重试")}})}else this.isEdit=!0},cancleEdit:function(){var e=this;this.$nextTick(function(){e.$refs.placeInfo.clearValidate(),e.isEdit=!1}),this.curPlaceId||this.$emit("getError")}},mounted:function(){this.getPlaceInfo()}},c={render:function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("div",{attrs:{id:"placeDeatils"}},[t("div",{staticClass:"title clearfix"},[t("h1",[e._m(0),t("a",{directives:[{name:"show",rawName:"v-show",value:e.curPlaceId,expression:"curPlaceId"}],on:{click:e.changEdit}},[t("i"),t("em",[e._v("编辑")])])])]),e._v(" "),t("div",{staticClass:"placeInfo"},[t("el-form",{ref:"placeInfo",attrs:{model:e.placeInfo,rules:e.placeInfo_rule,"label-width":"150px"}},[t("el-form-item",{attrs:{label:"场地名称：",prop:"name"}},[e.isEdit?t("el-input",{staticStyle:{width:"280px"},model:{value:e.placeInfo.name,callback:function(a){e.$set(e.placeInfo,"name",a)},expression:"placeInfo.name"}}):t("span",{staticClass:"input_disabled"},[e._v(e._s(e.curPlaceInfo.name))])],1),e._v(" "),t("el-form-item",{attrs:{label:"可容纳人数：",prop:"peopleNum"}},[e.isEdit?e._t("default",[t("el-input",{staticStyle:{width:"280px"},model:{value:e.placeInfo.peopleNum,callback:function(a){e.$set(e.placeInfo,"peopleNum",a)},expression:"placeInfo.peopleNum"}}),t("i",[e._v("人")])]):t("span",{staticClass:"input_disabled"},[e._v(e._s(e.curPlaceInfo.peopleNum||0)+"人")])],2),e._v(" "),t("el-form-item",{staticStyle:{width:"100%"},attrs:{label:"场地说明："}},[e.isEdit?t("u-editor",{ref:"description",staticStyle:{"padding-left":"40px"},on:{change:e.getIntroduction},model:{value:e.placeInfo.description,callback:function(a){e.$set(e.placeInfo,"description",a)},expression:"placeInfo.description"}}):t("span",{staticClass:"input_disabled",domProps:{innerHTML:e._s(e.curPlaceInfo.description)}})],1),e._v(" "),t("el-form-item",{staticStyle:{width:"100%"}},[t("span",{attrs:{slot:"label"},slot:"label"},[t("em",{staticStyle:{color:"#d25050"}},[e._v("*")]),e._v("可用时间：")]),e._v(" "),e.isEdit?t("a",{staticClass:"addRange",on:{click:e.addTimeRange}},[e._v("添加时段")]):e._e(),e._v(" "),e._l(e.placeInfo.timeRangeObj,function(a,i){return e.isEdit?t("div",{key:i,staticClass:"dateBox"},[t("el-date-picker",{attrs:{"picker-options":e.pickerOptions,format:"yyyy 年 MM 月 dd 日","value-format":"yyyy-MM-dd",type:"date",placeholder:"选择日期"},on:{change:e.dateChange},model:{value:a.year,callback:function(t){e.$set(a,"year",t)},expression:"item.year"}}),e._v(" "),t("el-time-picker",{attrs:{"is-range":"","value-format":"HH:mm",format:"HH:mm","range-separator":"至","start-placeholder":"开始时间","end-placeholder":"结束时间",placeholder:"选择时间范围"},on:{change:e.timeRangeChange},model:{value:a.timeRange,callback:function(t){e.$set(a,"timeRange",t)},expression:"item.timeRange"}}),e._v(" "),t("span",{staticClass:"delete",on:{click:function(a){return e.deteleRange(i)}}},[t("i")])],1):e._e()}),e._v(" "),t("div",{staticClass:"freeTime"},[t("ul",{class:{isEdit:e.isEdit}},e._l(e.curPlaceInfo.freeTime,function(a){return t("li",{key:a.id,class:{isEdit:e.isEdit},attrs:{id:a.id}},[t("span",[e._v(e._s(a.date))]),e._v(" "),t("i",[e._v(e._s(a.startTime+" ~ "+a.endTime))]),e._v(" "),"FREE"==a.status?t("em",{staticClass:"delete deteleRange_data",on:{click:function(t){return e.deteleRange_data(a.id)}}},[t("i")]):e._e()])}),0)])],2)],1),e._v(" "),t("div",{directives:[{name:"show",rawName:"v-show",value:e.isEdit,expression:"isEdit"}],staticClass:"formBtn"},[t("a",{staticClass:"cancle",on:{click:e.cancleEdit}},[e._v("取消")]),e._v(" "),t("a",{staticClass:"add",domProps:{innerHTML:e._s(e.curPlaceId?"保存":"添加")},on:{click:e.placeSubmit}})])],1)])},staticRenderFns:[function(){var e=this.$createElement,a=this._self._c||e;return a("span",[a("em"),a("i",[this._v("场地基本信息")])])}]};var o=t("C7Lr")(n,c,!1,function(e){t("nuCT"),t("DJbW")},"data-v-5aa53bdf",null).exports,r={data:function(){return{tableDataUrl:"/table-data/employment/area/getAreaList",activeName:"first",choicePlaceType_meeting:"",choicePlaceType_face:"",concatBySelf_meeting:!1,concatBySelf_face:!1,showDetails:!1,curPlaceId:"",columns:[],placeRules:[],explainOfMeeting:"",explainOfExam:"",isEdit:!1,loading:!1}},components:{placeDetails:o},methods:{edit:function(){this.isEdit&&this.getPlaceRules(),this.isEdit=!this.isEdit},addPlace:function(){this.showDetails=!0,this.curPlaceId=""},getError:function(e){this.showDetails=!1,e&&this.$message.error(e)},addRules:function(){var e=this,a={areaRuleVOList:[]};a.areaRuleVOList.push({allocationScheme:""!=this.choicePlaceType_meeting?this.choicePlaceType_meeting:null,isAllow:this.concatBySelf_meeting?1:0,type:"PREACH_MEETING",areaExplain:this.explainOfMeeting},{allocationScheme:""!=this.choicePlaceType_face?this.choicePlaceType_face:null,isAllow:this.concatBySelf_face?1:0,type:"EXAMINATION",areaExplain:this.explainOfExam});Object(l.e)({url:"/api/employment/area/addAreaRules",type:"POST",data:a,success:function(a){a.state&&(e.getPlaceRules(),e.$message.success("保存成功"))}})},getPlaceRules:function(){var e=this;this.loading=!0,Object(l.e)({url:"/api/employment/area/getAreaRuleList",type:"get",success:function(a){a.state?(e.placeRules=a.data,2==e.placeRules.length&&(e.choicePlaceType_meeting=a.data[0].allocationScheme,e.explainOfMeeting=a.data[0].areaExplain?a.data[0].areaExplain:"",e.concatBySelf_meeting=1==a.data[0].isAllow,e.choicePlaceType_face=a.data[1].allocationScheme,e.explainOfExam=a.data[1].areaExplain?a.data[1].areaExplain:"",e.concatBySelf_face=1==a.data[1].isAllow),e.isEdit=!1,e.loading=!1):(e.isEdit=!1,e.placeRules=[],e.loading=!1)}})}},created:function(){var e=this;this.getPlaceRules(),this.columns=[{id:"name",title:"场地名称",className:"text-left",width:200,hidden:!1,search:{type:"input",data:{placeholer:"",autoFocus:!1}}},{id:"opts",title:"操作",width:200,hidden:!1,options:[{tag:"a",text:"查看",callback:function(a,t){e.curPlaceId=a.id,e.showDetails=!0}}]}]}},d={render:function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("div",{attrs:{id:"placeList"}},[e.showDetails?t("el-button",{staticStyle:{color:"#666"},attrs:{type:"text",icon:"el-icon-back"},on:{click:function(a){e.showDetails=!1}}},[e._v("返回")]):e._e(),e._v(" "),e.showDetails?t("place-details",{attrs:{curPlaceId:e.curPlaceId},on:{getError:e.getError}}):e._e(),e._v(" "),e.showDetails?e._e():t("div",{staticClass:"tabPane"},[t("el-tabs",{model:{value:e.activeName,callback:function(a){e.activeName=a},expression:"activeName"}},[t("el-tab-pane",{attrs:{label:"场地列表",name:"first"}},[t("v-table",{attrs:{url:e.tableDataUrl,columns:e.columns,idField:"id",pagesize:"10",multiple:!1,order:!0}},[t("div",{staticClass:"pull-right",attrs:{slot:"btn-group"},slot:"btn-group"},[t("el-button",{staticClass:"custom-btn",attrs:{type:"primary"},on:{click:e.addPlace}},[e._v("新增场地")])],1)])],1),e._v(" "),t("el-tab-pane",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],attrs:{label:"场地分配",name:"second"}},[t("div",{staticClass:"meetingList"},[t("div",{staticClass:"meetingOne"},[t("h1",{staticClass:"title"},[t("span",[t("em"),t("i",[e._v("宣讲会")])]),t("a",{on:{click:e.edit}},[t("em"),t("span",[e._v(e._s(e.isEdit?"取消编辑":"编辑"))])])]),e._v(" "),t("div",{staticClass:"type box"},[t("p",[e._v("分配方式：")]),e._v(" "),t("div",{staticClass:"radioGroup"},[t("el-radio-group",{attrs:{disabled:!e.isEdit},model:{value:e.choicePlaceType_meeting,callback:function(a){e.choicePlaceType_meeting=a},expression:"choicePlaceType_meeting"}},[t("el-radio",{attrs:{label:"COMPANY_CHOOSE"}},[e._v("管理员提供场地信息，单位选择")]),e._v(" "),t("el-radio",{attrs:{label:"ADMIN_ASSIGNMENT"}},[e._v("管理员不提供场地信息，审核时直接分配")])],1),e._v(" "),t("h2",[t("el-checkbox",{attrs:{disabled:!e.isEdit},model:{value:e.concatBySelf_meeting,callback:function(a){e.concatBySelf_meeting=a},expression:"concatBySelf_meeting"}},[e._v("允许单位自行联系场地")])],1)],1)]),e._v(" "),t("div",{directives:[{name:"show",rawName:"v-show",value:"ADMIN_ASSIGNMENT"==e.choicePlaceType_meeting,expression:'choicePlaceType_meeting == "ADMIN_ASSIGNMENT"'}],staticClass:"type box"},[t("p",[e._v("场地说明：")]),e._v(" "),t("div",{staticClass:"areaExplain"},[t("u-editor",{directives:[{name:"show",rawName:"v-show",value:e.isEdit,expression:"isEdit"}],ref:"description",model:{value:e.explainOfMeeting,callback:function(a){e.explainOfMeeting=a},expression:"explainOfMeeting"}}),e._v(" "),t("p",{directives:[{name:"show",rawName:"v-show",value:!e.isEdit,expression:"!isEdit"}],domProps:{innerHTML:e._s(e.explainOfMeeting)}})],1)])]),e._v(" "),t("div",{staticClass:"meetingTwo"},[t("h1",{staticClass:"title"},[t("span",[t("em"),t("i",[e._v("笔/面试")])])]),e._v(" "),t("div",{staticClass:"type box"},[t("p",[e._v("分配方式：")]),e._v(" "),t("div",{staticClass:"radioGroup"},[t("el-radio-group",{attrs:{disabled:!e.isEdit},model:{value:e.choicePlaceType_face,callback:function(a){e.choicePlaceType_face=a},expression:"choicePlaceType_face"}},[t("el-radio",{attrs:{label:"COMPANY_CHOOSE"}},[e._v("管理员提供场地信息，单位选择")]),e._v(" "),t("el-radio",{attrs:{label:"ADMIN_ASSIGNMENT"}},[e._v("管理员不提供场地信息，审核时直接分配")])],1),e._v(" "),t("h2",[t("el-checkbox",{attrs:{disabled:!e.isEdit},model:{value:e.concatBySelf_face,callback:function(a){e.concatBySelf_face=a},expression:"concatBySelf_face"}},[e._v("允许单位自行联系场地")])],1)],1)]),e._v(" "),t("div",{directives:[{name:"show",rawName:"v-show",value:"ADMIN_ASSIGNMENT"==e.choicePlaceType_face,expression:'choicePlaceType_face == "ADMIN_ASSIGNMENT"'}],staticClass:"type box"},[t("p",[e._v("场地说明：")]),e._v(" "),t("div",{staticClass:"areaExplain"},[t("u-editor",{directives:[{name:"show",rawName:"v-show",value:e.isEdit,expression:"isEdit"}],ref:"description",model:{value:e.explainOfExam,callback:function(a){e.explainOfExam=a},expression:"explainOfExam"}}),e._v(" "),t("p",{directives:[{name:"show",rawName:"v-show",value:!e.isEdit,expression:"!isEdit"}],domProps:{innerHTML:e._s(e.explainOfExam)}})],1)])])]),e._v(" "),t("div",{directives:[{name:"show",rawName:"v-show",value:e.isEdit,expression:"isEdit"}],staticClass:"formBtn"},[t("a",{staticClass:"cancle",on:{click:function(a){return e.getPlaceRules()}}},[e._v("取消")]),e._v(" "),t("a",{staticClass:"add",on:{click:e.addRules}},[e._v("保存")])])])],1)],1)],1)},staticRenderFns:[]};var p=t("C7Lr")(r,d,!1,function(e){t("nmqm"),t("iwuj")},"data-v-cb3ba566",null);a.default=p.exports},nmqm:function(e,a){},nuCT:function(e,a){}});