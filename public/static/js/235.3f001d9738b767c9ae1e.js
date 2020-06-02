webpackJsonp([235],{"2YG7":function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});a("kV13");var n=a("C331"),s=a("y0ro"),i=(s.a,{mixins:[s.a],created:function(){this.organizationId=this.$route.query.organizationId,this.init()},data:function(){return{organizationId:"",columns:[],url:"",showAddModal:!1,timestamp:"?timestamp=''",department:{},newDepartment:{name:""},modalType:"",isChange:!1,isDisabled:!1,lang:"zh-cn"}},watch:{organizationId:function(t,e){t!==e&&this.init()}},computed:{translate:function(){return Object(n.g)(this.lang).departmentManage}},methods:{init:function(){var t=this,e=localStorage.getItem("lang"),a=this;Object(n.g)(e)&&(this.lang=e),a.url="/table-data/sc/orgDepartment/page/"+this.organizationId,this.columns=[{id:"orgDepartmentName",title:"组织部门名称",className:"text-left",hidden:!1,search:{type:"input",value:""}},{id:"opt",title:this.translate.opt,className:"text-center",width:"130px",hidden:!1,formatter:function(t){return[{tag:"a",text:a.translate.edit,className:"opt-btn",callback:function(t,e){a.department=t,a.newDepartment.id=t.id,a.newDepartment.name=t.orgDepartmentName,a.modalType=a.translate.edit,a.showAddModal=!0}},{tag:"a",text:t.isForbidden?"启用":"禁用",className:"opt-btn",callback:function(t,e){a.ableOrgDepartment(t)}}]}}],this.importParams={parentPageTitle:"",downloadTemplateUrl:"/sc/orgDepartment/batchCreateOrgDepartmentTemplate",downloadErrorTemplateUrl:"/excels/errorExcels",checkTemplateUrl:"/sc/orgDepartment/excel/"+this.organizationId,templateName:"批量导入模板",importBtnType:[{url:"/sc/orgDepartment/import",method:"post",isShowBtn:!0,name:"增量导入",success:function(e){t.timestamp="?timestamp="+(new Date).getTime(),t.curRoute="allStaff"}}]}},ableOrgDepartment:function(t){var e=this,a="";a=t.isForbidden?"api/sc/orgDepartment/unForbidden/"+t.id:"api/sc/orgDepartment/forbidden/"+t.id,Object(n.d)(a,{},"post").then(function(t){t.state&&(e.$toast("操作成功!"),e.timestamp="?timestamp="+(new Date).getTime())})},_verifyLength:function(){var t=0,e=0,a=0;if(!this.newDepartment.name)return!1;this.isChange=!0;for(var n=0;n<this.newDepartment.name.length;n++)this.newDepartment.name.charCodeAt(n)>127||94===this.newDepartment.name.charCodeAt(n)?t++:e+=.5,25===parseInt(t+e)&&(a=n);parseInt(t+e)>25&&(this.newDepartment.name=this.newDepartment.name.slice(0,a+1))},editDepartment:function(){var t=this;t.isDisabled=!0;var e="/api/sc/orgDepartment/"+this.newDepartment.id,a={organizationId:this.organizationId,orgDepartmentName:this.newDepartment.name};Object(n.d)(e,a,"post").then(function(e){e.state&&(t.timestamp="?timestamp="+(new Date).getTime(),t.showAddModal=!1,t.isDisabled=!1)})},addModal:function(){this.newDepartment={},this.modalType=this.translate.addNew,this.showAddModal=!0},addDepartment:function(){var t=this;this.newDepartment.name?(t.isDisabled=!0,Object(n.e)({url:"/api/sc/orgDepartment",dataType:"json",data:{organizationId:this.organizationId,orgDepartmentName:this.newDepartment.name},type:"post",success:function(e){t.isDisabled=!1,e.state?(t.timestamp="?timestamp="+(new Date).getTime(),t.showAddModal=!1,t.$toast(t.translate.addSuccessTip)):t.$toast(t.translate.addFailedTip+":"+e.message)}})):t.$toast("请输入部门名称")},changeRole:function(t){if(t)return!1;this.modalType===this.translate.addNew?this.addDepartment():this.modalType===this.translate.edit&&this.editDepartment()},cancleModal:function(){this.isChange?confirm(this.translate.cancelConfirmTip)&&(this.showAddModal=!1):this.showAddModal=!1}}}),r={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"container-fluid",attrs:{id:"org-department-page"}},[a("div",{staticClass:"row text-center"},[a("v-table",{attrs:{title:"组织部门列表",url:t.url+t.timestamp,pagesize:"10",idField:"id",columns:t.columns,multiple:!1,order:!0,search:!0}},[a("div",{staticClass:"btn-group pull-right",attrs:{slot:"btn-group",role:"group"},slot:"btn-group"},[a("button",{staticClass:"btn btn-bgColor-style clearBtnBorder",attrs:{type:"button"},on:{click:function(e){return t.quickAddRecord()}}},[t._v("批量新增组织部门")]),t._v(" "),a("button",{staticClass:"btn btn-bgColor-style clearBtnBorder",attrs:{type:"button"},on:{click:function(e){return t.addModal()}}},[t._v(t._s(t.translate.addNew)+"组织部门")])])])],1),t._v(" "),a("v-modal",{staticClass:"editDepartmentModal",attrs:{show:t.showAddModal,effect:"fade",width:"274"}},[a("div",{staticClass:"modal-header",attrs:{slot:"modal-header"},slot:"modal-header"},[a("h5",{staticClass:"modal-title"},[t._v(t._s(t.modalType)+"组织部门")])]),t._v(" "),a("div",{staticClass:"modal-body",attrs:{slot:"modal-body"},slot:"modal-body"},[a("div",{staticClass:"form-group"},[a("input",{directives:[{name:"model",rawName:"v-model",value:t.newDepartment.name,expression:"newDepartment.name"}],ref:"count",staticClass:"form-control search-input",attrs:{id:"departmentName",type:"text"},domProps:{value:t.newDepartment.name},on:{keyup:t._verifyLength,input:function(e){e.target.composing||t.$set(t.newDepartment,"name",e.target.value)}}})])]),t._v(" "),a("div",{staticClass:"modal-footer",attrs:{slot:"modal-footer"},slot:"modal-footer"},[a("button",{staticClass:"btn cancel-btn clearBtnBorder",attrs:{type:"button"},on:{click:t.cancleModal}},[t._v(t._s(t.translate.cancel))]),t._v(" "),a("button",{staticClass:"btn submit-btn clearBtnBorder",class:{disabled:t.isDisabled},attrs:{type:"button"},on:{click:function(e){return t.changeRole(t.isDisabled)}}},[t._v(t._s(t.translate.confirm))])])]),t._v(" "),a("div",{directives:[{name:"show",rawName:"v-show",value:"importPage"===t.curRoute,expression:"curRoute === 'importPage'"}],attrs:{id:"orgDepartmentImportPage"}},[a("v-import",t._b({on:{backParentPage:function(e){t.curRoute="allStaff"}}},"v-import",t.importParams,!1))],1)],1)},staticRenderFns:[]};var o=a("C7Lr")(i,r,!1,function(t){a("h4UO")},null,null);e.default=o.exports},h4UO:function(t,e){}});