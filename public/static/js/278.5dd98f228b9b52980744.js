webpackJsonp([278],{AjNI:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=a("kV13"),i=a("C331"),o=a("lh7w");s.default.component("FlowSetManage",o.default);s.default.component("FlowSetManage",o.default);var l={props:{},created:function(){var t=this,e=localStorage.getItem("lang");Object(i.g)(e)&&(this.lang=e),this.columns=[{id:"name",title:this.translate.name,className:"text-left",hidden:!1,search:{type:"input",data:{placeholder:""}}},{id:"opt",title:this.translate.opt,className:"text-center",width:"210px",hidden:!1,formatter:function(e,a){return[{tag:"a",text:t.translate.edit,className:"opt-btn",callback:function(e,a){t.activityTypeName=e.name,t.flowId=e.flowId,t.showAddModal=!0,t.modalType=t.translate.edit,t.activityTypeId=e.id}},{tag:"a",text:t.translate.setActivityReviewProcess,className:"opt-btn",callback:function(e,a){t.flowId=e.flowId,t.activityTypeName=e.name,t.activityTypeId=e.id,t.miniRoutes="flowSetManage",t.$emit("fullScreen",!0)}},{tag:"a",text:t.translate.delete,className:"opt-btn",callback:function(e,a){confirm(t.translate.removeConfirmTip)&&Object(i.e)({url:"/api/sc/activities/types/"+e.id,dataType:"json",type:"post",success:function(e){e.state?t.url=t.url.split("?")[0]+"?timestamp="+Object(i.a)():"30510"==e.code?t.$toast("该定位已有活动，无法删除\n请下架活动后再进行删除操作"):t.$toast(t.translate.removeFailedTip+":"+e.message)}})}}]}}]},data:function(){return{columns:[],type:"",url:"/table-data/sc/activities/types/pages",activityTypeName:"",activityTypeId:"",showAddModal:!1,modalType:"",isDisabled:!0,flowId:"",miniRoutes:"list",lang:"zh-cn"}},computed:{translate:function(){return Object(i.g)(this.lang).activityTypeManage}},watch:{},mounted:function(){},methods:{_showAddModal:function(){this.showAddModal=!0,this.modalType=this.translate.add,this.activityTypeName=""},_changeActivityType:function(){if(!this.activityTypeName)return this.$toast("分类名称不能为空"),!1;this.modalType===this.translate.add?this._addActivityType():this.modalType===this.translate.edit&&this._editActivityType()},_addActivityType:function(){var t=this;Object(i.e)({url:"/api/sc/activities/types",dataType:"json",type:"post",data:{name:this.activityTypeName,flowId:this.flowId},success:function(e){e.state?(t.showAddModal=!1,t.url=t.url.split("?")[0]+"?timestamp="+Object(i.a)()):t.$toast(e.message)}})},_editActivityType:function(){var t=this;Object(i.e)({url:"/api/sc/activities/types/"+this.activityTypeId+"/update",dataType:"json",type:"post",data:{name:this.activityTypeName},success:function(e){e.state?(t.showAddModal=!1,t.url=t.url.split("?")[0]+"?timestamp="+Object(i.a)()):t.$toast(e.message)}})},_setProcess:function(){this.miniRoutes="flowSetMange"},_backToPage:function(t){this.miniRoutes=t,this.$emit("fullScreen",!1)},_saveFlowInfo:function(t){var e=this,a="/api/sc/activities/types/"+this.activityTypeId+"/flowSetting";Object(i.e)({url:a,type:"post",data:t,success:function(t){t.state?(e.$toast(e.translate.saveSuccessTip2,0,"check"),e._backToPage("list")):e.$toast(t.message)}})}}},n={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"activity-type-manage-page"},[a("div",{directives:[{name:"show",rawName:"v-show",value:"list"===t.miniRoutes,expression:"miniRoutes === 'list'"}],staticClass:"activity-type-manage"},[a("div",{staticClass:"content text-center"},[a("v-table",{ref:"activityTypeTable",attrs:{title:t.translate.title,url:t.url,pagesize:"10",idField:"id",columns:t.columns,multiple:!1,order:!0,search:!1}},[a("div",{attrs:{slot:"btn-group",role:"group"},slot:"btn-group"},[a("div",{staticClass:"btn-group pull-right "},[a("button",{staticClass:"btn add-activityType btn-bgColor-style clearBtnBorder",attrs:{type:"button"},on:{click:t._showAddModal}},[a("i",{staticClass:"maticon pull-left",domProps:{innerHTML:t._s(t.icons("add"))}},[t._v("add")]),t._v(t._s(t.translate.add)+t._s(t.translate.activityType))])])])])],1),t._v(" "),a("v-modal",{staticClass:"activityType-modal",attrs:{show:t.showAddModal,effect:"fade",width:"446"}},[a("div",{staticClass:"modal-header",attrs:{slot:"modal-header"},slot:"modal-header"},[a("h5",{staticClass:"modal-title"},[t._v("\n          "+t._s(t.modalType)+t._s(t.translate.activityType)+"\n        ")])]),t._v(" "),a("div",{staticClass:"modal-body",attrs:{slot:"modal-body"},slot:"modal-body"},[a("div",{staticClass:"form-group"},[a("input",{directives:[{name:"model",rawName:"v-model",value:t.activityTypeName,expression:"activityTypeName"}],staticClass:"form-control search-input activityType-input",attrs:{type:"text",placeholder:t.translate.typeNamePlaceholder,maxlength:"50"},domProps:{value:t.activityTypeName},on:{input:function(e){e.target.composing||(t.activityTypeName=e.target.value)}}})])]),t._v(" "),a("div",{staticClass:"modal-footer",attrs:{slot:"modal-footer"},slot:"modal-footer"},[a("button",{staticClass:"btn cancel-btn clearBtnBorder",attrs:{type:"button"},on:{click:function(e){t.showAddModal=!1}}},[t._v(t._s(t.translate.cancel))]),t._v(" "),a("button",{staticClass:"btn submit-btn clearBtnBorder",attrs:{type:"button"},on:{click:t._changeActivityType}},[t._v(t._s(t.translate.confirm))])])])],1),t._v(" "),"flowSetManage"===t.miniRoutes&&t.activityTypeId?a("FlowSetManage",{attrs:{type:"sc",appName:t.activityTypeName,appId:t.activityTypeId,flowId:t.flowId},on:{back:function(e){return t._backToPage("list")},submit:t._saveFlowInfo}}):t._e()],1)},staticRenderFns:[]};var c=a("C7Lr")(l,n,!1,function(t){a("Q/Yd")},null,null);e.default=c.exports},"Q/Yd":function(t,e){}});