webpackJsonp([270],{"2oBD":function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});a("kV13");var r=a("C331"),s={data:function(){return{columns:[],baseUrl:"/table-data/document/teachers",ts:new Date,definedSearch:{tid:"",name:""},modalType:"",lang:"zh-cn",importTeachers:!1,importParams:{parentPageTitle:"",downloadTemplateUrl:"/document/teachers/templates",downloadErrorTemplateUrl:"/document/teachers/errExcel",checkTemplateUrl:"/document/teachers/templates/check",importBtnType:null,templateName:""}}},computed:{translate:function(){return Object(r.g)(this.lang).infoManage},url:function(){return this.baseUrl+"?ts="+this.ts}},created:function(){var t=this,e=localStorage.getItem("lang");Object(r.g)(e)&&(this.lang=e),this.importParams.templateName=this.translate.baseModel,this.importParams.parentPageTitle=this.translate.tableName,this.importParams.importBtnType=[{url:"/document/teachers/excel",name:this.translate.overrideImport,method:"post",isShowBtn:!0,success:function(e){e.state&&(t.ts=new Date)}}],this.columns=[{id:"tid",title:this.translate.teacherFields.teacherId,className:"text-left",hidden:!1,search:{type:"input",data:{autoFocus:!0}},formatter:function(t,e){return t.teacherId}},{id:"name",title:this.translate.teacherFields.name,className:"text-left",hidden:!1,search:{type:"input"}}]},methods:{}},n={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return t.importTeachers?a("v-import",t._b({on:{backParentPage:function(e){t.importTeachers=!1}}},"v-import",t.importParams,!1)):a("div",{staticClass:"container-fluid",attrs:{id:"import-teacher-page"}},[a("div",{staticClass:"row text-center"},[a("v-table",{attrs:{title:t.translate.tableName,url:t.url,pagesize:"10",idField:"id",columns:t.columns,order:!0,search:!0}},[a("div",{staticClass:"btn-group pull-right",attrs:{slot:"btn-group",role:"group"},slot:"btn-group"},[a("button",{staticClass:"btn add clearBtnBorder",attrs:{type:"button"},on:{click:function(e){t.importTeachers=!0}}},[t._v(t._s(t.translate.modelImport))])])])],1)])},staticRenderFns:[]};var i=a("C7Lr")(s,n,!1,function(t){a("9FuQ")},"data-v-0a4c2f04",null);e.default=i.exports},"9FuQ":function(t,e){}});