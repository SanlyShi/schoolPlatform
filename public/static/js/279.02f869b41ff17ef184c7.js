webpackJsonp([279],{"5oB1":function(t,e){},TMfh:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=a("kV13"),i=a("C331"),n=a("Do79");s.default.component("c-reserveTable",n.a);s.default.component("c-reserveTable",n.a);var l={data:function(){return{showEditModal:!1,showSettingModal:!1,weekTime:{},schoolData:[],selectCampus:"",schedulingType:"RESERVATION",isShowSchedulingType:!1,isUpdateNext:!1,consultantArr:[],settingData:{schedulingId:"",startTime:"",endTime:"",timeList:[{timeId:"timeId",timeQuantumStart:"",timeQuantumEnd:""}]},schedulingSettingType:"add",schedulingTypeData:[{id:"RESERVATION",label:"预约"},{id:"ARRANGE_TALKS",label:"首次访谈"}],consultantId:"",schedulingData:[],selectedTabelCells:[],tableData:[],timeQuantumArray:[],consultantInfoArr:[],dataTimeId:"",changeDate:"",lang:"zh-cn"}},computed:{translate:function(){return Object(i.g)(this.lang).employmentUnitManage}},watch:{selectCampus:{deep:!0,handler:function(){this._initTableData(this.weekTime)}},schedulingType:{deep:!0,handler:function(){this._initTableData(this.weekTime)}}},created:function(){var t=this,e=localStorage.getItem("lang");Object(i.g)(e)&&(this.lang=e),Object(i.e)({url:"/api/mentality/scheduling/campus",dataType:"json",type:"get",success:function(e){e.state?(t.schoolData=e.data,t.selectCampus=e.data[0].value):t.$toast(e.message)}}),Object(i.e)({url:"/api/mentality/config",dataType:"json",type:"get",success:function(e){e.state?e.data&&(t.isShowSchedulingType=e.data.interviewFirst):t.$toast(e.message)}}),this._getWeekTime()},methods:{_getWeekTime:function(t){t&&(this.weekTime=t,this.selectCampus&&this._initTableData(t))},_initTableData:function(t){var e=this;Object(i.e)({url:"/api/mentality/scheduling/teachers/page/week?campus="+this.selectCampus+"&type="+this.schedulingType+"&dateStart="+t.dateStart+"&dateEnd="+t.dateEnd,dataType:"json",type:"get",success:function(t){if(t.state)if(t.data&&t.data.length>0){if(e.schedulingData=t.data,e.timeQuantumArray=[],t.data[0].setting)for(var a in t.data[0].setting.timeSetting){var s=t.data[0].setting.timeSetting[a];e.timeQuantumArray.push({id:s.id,timeQuantum:s.timeQuantumStart+"-"+s.timeQuantumEnd})}}else e.schedulingData=[],e.timeQuantumArray=[];else e.$toast(t.message)}}),Object(i.e)({url:"/api/mentality/scheduling/timeSettings/thisWeek?type="+this.schedulingType+"&campus="+this.selectCampus+"&dateStart="+t.dateStart+"&dateEnd="+t.dateEnd,dataType:"json",type:"get",success:function(t){if(t.state)if(t.data&&t.data.length>0)for(var a in e.timeQuantumArray=[],t.data){var s=t.data[a];e.timeQuantumArray.push({id:s.id,timeQuantum:s.timeQuantumStart+"-"+s.timeQuantumEnd})}else e.timeQuantumArray=[];else e.$toast(t.message)}})}}},c={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"container",attrs:{id:"my-scheduling"}},[a("div",{staticClass:"scheduling-manage"},[a("c-reserveTable",{attrs:{tableData:t.schedulingData,isShowDateOfDay:!0,tableType:"check",timeQuantumArray:t.timeQuantumArray},on:{getWeekTime:t._getWeekTime,editConsultant:t._editConsultant}},[a("div",{staticClass:"campus-select",attrs:{slot:"header-select"},slot:"header-select"},[t.schoolData.length>0?a("div",{staticClass:"select-radio"},[a("label",{staticClass:"radio-text"},[t._v("校区")]),t._v(" "),a("span"),t._v(" "),a("div",{staticClass:"radio-area"},t._l(t.schoolData,function(e,s){return a("div",{key:s},[a("input",{directives:[{name:"model",rawName:"v-model",value:t.selectCampus,expression:"selectCampus"}],attrs:{type:"radio",id:"col.id"},domProps:{value:e.value,checked:t._q(t.selectCampus,e.value)},on:{change:function(a){t.selectCampus=e.value}}}),t._v(" "),a("label",{staticClass:"campus-name",attrs:{for:"col.id"}},[t._v(t._s(e.label))])])}),0)]):t._e()]),t._v(" "),a("div",{staticClass:"body-slot",attrs:{slot:"body-slot"},slot:"body-slot"},[a("div",{staticClass:"pull-left"},[a("span",{staticClass:"time-tips"},[t._v(t._s(t.weekTime.weekStartTime)+"-"+t._s(t.weekTime.weekEndTime)+" 排班表")]),t._v(" "),a("span",[a("span",{staticClass:"show-schedule-color"}),t._v(" "),a("span",{staticClass:"show-schedule-name"},[t._v("排班对学生可见")])]),t._v(" "),a("span",[a("span",{staticClass:"hide-schedule-color"}),t._v(" "),a("span",{staticClass:"hide-schedule-name"},[t._v("排班对学生隐藏")])])])])])],1)])},staticRenderFns:[]};var u=a("C7Lr")(l,c,!1,function(t){a("5oB1")},null,null);e.default=u.exports}});