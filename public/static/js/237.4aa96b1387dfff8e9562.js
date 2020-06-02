webpackJsonp([237],{GVzQ:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});a("kV13");var s=a("C331"),i={created:function(){var t=localStorage.getItem("lang"),e=this;Object(s.g)(t)&&(this.lang=t),this.columns=[{id:"schoolYear",title:"学年",className:"text-left",hidden:!1,search:{type:"select",data:{optionsLabel:"label",optionsValue:"value",url:"/api/ca/dict?typeName=学年"}}},{id:"term",title:"学期",className:"text-left",hidden:!1,search:{type:"select",data:{optionsLabel:"label",optionsValue:"value",url:"/api/ca/dict?typeName=学期"}}},{id:"startDate",title:"开始时间",className:"text-left",hidden:!1},{id:"endDate",title:"结束时间",className:"text-left",hidden:!1},{id:"userName",title:"操作人",className:"text-left",hidden:!1},{id:"createTime",title:"发布时间",className:"text-left",hidden:!1},{id:"opt",title:"操作",className:"text-center",width:"130px",hidden:!1,formatter:function(t){return[{tag:"a",text:t.isForbid?"启用":"禁用",className:"opt-btn",callback:function(t,a){var i="/api/ca/batch/forbidden/",l="确定禁用该批次吗？禁用后该批次无法使用！";t.isForbid&&(i="/api/ca/batch/unForbidden/",l="确定启用该批次吗？"),confirm(l)&&Object(s.e)({url:i+t.id,dataType:"json",data:{users:this.userInfoArr},type:"post",success:function(t){t.state?(e.showUserModal=!1,e.url=e.url+"?time="+(new Date).getTime(),e.$toast("操作成功")):e.$toast(t.message)}})}}]}}],this.initDict()},data:function(){return{columns:[],url:"/table-data/ca/batch/page",showUserModal:!1,roleDimension:!0,newObj:{schoolYear:"",term:"",startDate:"",endDate:""},modalType:"add",lang:"zh-cn",params:[{name:"学年",text:"schoolYear",isDict:!0,required:!0},{name:"学期",text:"term",isDict:!0,required:!0},{name:"开始时间",text:"startDate",isDict:!1,required:!0},{name:"结束时间",text:"endDate",isDict:!1,required:!0}],dictList:{schoolYear:[],term:[]}}},methods:{initDict:function(){var t=this;this.params.map(function(e){e.isDict&&t.getDict(e)})},getDict:function(t){var e=this;Object(s.e)({url:"/api/ca/dict?typeName="+t.name,dataType:"json",type:"GET",async:!1,success:function(a){a.state?e.dictList[t.text]=a.data:e.$toast(a.message)}})},addOrCancel:function(){this.newObj={schoolYear:this.dictList.schoolYear[0].value,term:this.dictList.term[0].value,startDate:"",endDate:""},this.showUserModal=!this.showUserModal},changeSchoolYear:function(t){this.newObj.schoolYear=t.val},changeTerm:function(t){this.newObj.term=t.val},startDateSelected:function(t){this.newObj.startDate=t.value.substring(0,10)},endDateSelected:function(t){this.newObj.endDate=t.value.substring(0,10)},add:function(){for(var t=this,e=0;e<this.params.length;e++){var a=this.params[e];if(a.required&&!this.newObj[a.text])return void this.$toast("请选择"+a.name)}Object(s.e)({url:"/api/ca/batch",dataType:"json",data:this.newObj,type:"post",success:function(e){e.state?(t.url=t.url+"?time="+(new Date).getTime(),t.$toast("新增成功"),t.addOrCancel()):t.$toast(e.message)}})}}},l={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"container-fluid",attrs:{id:"attendanceBatch-page"}},[a("div",{staticClass:"row text-center"},[a("v-table",{attrs:{title:"批次管理",url:t.url,pagesize:"10",idField:"id",order:!0,columns:t.columns,search:!1}},[a("div",{attrs:{slot:"btn-group",role:"group"},slot:"btn-group"},[a("div",{staticClass:"btn-group pull-right",attrs:{slot:"btn-group",role:"group"},slot:"btn-group"},[a("button",{staticClass:"btn batch-add-btn btn-bgColor-style clearBtnBorder",attrs:{type:"button"},on:{click:t.addOrCancel}},[t._v("新增")])])])])],1),t._v(" "),a("v-modal",{attrs:{show:t.showUserModal,effect:"fade",width:"340"}},[a("div",{staticClass:"modal-header",attrs:{slot:"modal-header"},slot:"modal-header"},[a("h5",{staticClass:"modal-title"},[t._v("\n        "+t._s("edit"==t.modalType?"编辑批次":"新增批次")+"\n      ")])]),t._v(" "),a("div",{staticClass:"modal-body",attrs:{slot:"modal-body"},slot:"modal-body"},[a("div",{staticClass:"form-group"},[a("label",{staticClass:"input-label"},[t._v("学年")]),t._v(" "),a("v-select",{staticClass:"select-info",attrs:{value:t.newObj.schoolYear,optionsLabel:"label",optionsValue:"value",options:t.dictList.schoolYear},on:{afterSelected:t.changeSchoolYear}})],1),t._v(" "),a("div",{staticClass:"form-group"},[a("label",{staticClass:"input-label"},[t._v("学期")]),t._v(" "),a("v-select",{staticClass:"select-info",attrs:{value:t.newObj.term,optionsLabel:"label",optionsValue:"value",options:t.dictList.term},on:{afterSelected:t.changeTerm}})],1),t._v(" "),a("div",{staticClass:"form-group"},[a("label",{staticClass:"input-label"},[t._v("开始时间")]),t._v(" "),a("v-datepicker",{staticClass:"select-info",attrs:{placeholder:"请选择开始时间",showTime:!1},on:{daySelected:t.startDateSelected}})],1),t._v(" "),a("div",{staticClass:"form-group"},[a("label",{staticClass:"input-label"},[t._v("结束时间")]),t._v(" "),a("v-datepicker",{staticClass:"select-info",attrs:{placeholder:"请选择结束时间",showTime:!1},on:{daySelected:t.endDateSelected}})],1)]),t._v(" "),a("div",{staticClass:"modal-footer",attrs:{slot:"modal-footer"},slot:"modal-footer"},[a("button",{staticClass:"btn cancel-btn clearBtnBorder",attrs:{type:"button"},on:{click:t.addOrCancel}},[t._v("取消")]),t._v(" "),a("button",{staticClass:"btn submit-btn clearBtnBorder",attrs:{type:"button"},on:{click:t.add}},[t._v("确定")])])])],1)},staticRenderFns:[]};var o=a("C7Lr")(i,l,!1,function(t){a("L08F")},null,null);e.default=o.exports},L08F:function(t,e){}});