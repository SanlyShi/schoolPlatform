webpackJsonp([160],{fsAH:function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});s("kV13");var a=s("C331"),i={data:function(){return{columns:[],url:"/table-data/fts/student/getStudentList",method:"get",classList:[],gradeList:[],definedSearch:{studentId:"",name:"",college:"",instructorPhoneNum:"",grade:"",instructorName:"",educationLevel:"",idCardNo:"",accommodation:"",className:"",fields:""},lang:"zh-cn",showExport:!1,fieldsToExport:[],exporting:!1}},created:function(){var t=localStorage.getItem("lang");Object(a.g)(t)&&(this.lang=t),this.getClassList(),this.getGradeList(),this._initColumns(),this.getStuTree()},computed:{translate:function(){return Object(a.g)(this.lang).infoManage},exportStatus:function(){return this.exporting?"导出中":this.translate.export}},methods:{showExportModal:function(){this.showExport=!0},getStuTree:function(){var t=[],e={id:1,title:"全选",edit:!1,children:[]};this.columns.forEach(function(t,s){e.children.push({id:s+1,title:t.title,disabled:!1,meta:!0})}),t.push(e),this.fieldsToExport=t},_initColumns:function(){this.columns=[{id:"studentId",title:"学号",className:"text-left",width:120,hidden:!1,search:{type:"input",data:{placeholder:this.translate.studentIdPlaceholder}}},{id:"name",title:"姓名",className:"text-left",width:80,hidden:!1,search:{type:"input",data:{placeholder:this.translate.namePlaceholder}}},{id:"college",title:"学院",className:"text-left",width:120,hidden:!1,search:{type:"select",data:{url:"/api/fts/dict/getUnitList",optionsLabel:"label",optionsValue:"value"}}},{id:"educationLevel",title:"培养层次",className:"text-left",width:100,hidden:!1,search:{type:"select",data:{url:"/api/fts/dict/findDictByTypeName?typeName=培养层次",optionsLabel:"label",optionsValue:"value"}}},{id:"grade",title:"年级",className:"text-left",width:100,hidden:!1,search:{type:"select",data:{options:this.gradeList,optionsLabel:"label",optionsValue:"value"}}},{id:"className",title:"班级",className:"text-left",width:120,hidden:!1,search:{type:"select",data:{options:this.classList,optionsLabel:"label",optionsValue:"value"}}},{id:"idCardNo",title:"身份证号",className:"text-left",width:120,hidden:!1,search:{type:"input"}},{id:"accommodation",title:"宿舍",className:"text-left",width:80,hidden:!1,search:{type:"input"}},{id:"instructorName",title:"辅导员",className:"text-left",width:120,hidden:!1,search:{type:"input"}},{id:"instructorPhoneNum",title:"辅导员电话",className:"text-left",width:120,hidden:!1,search:{type:"input"}}],this.url="/table-data/fts/student/getStudentList?timestamp="+(new Date).getTime()},getClassList:function(){var t=this;Object(a.e)({url:"/api/fts/dict/getClassList",dataType:"json",type:"get",async:!1,success:function(e){e.state&&(t.classList=e.data.map(function(t){return{label:t,value:t}}))}})},getGradeList:function(){var t=this;Object(a.e)({url:"/api/fts/dict/getGradeList",dataType:"json",type:"get",async:!1,success:function(e){e.state&&(t.gradeList=e.data.map(function(t){return{label:t,value:t}}))}})},exportTable:function(){if(!this.exporting){var t=[];if(this.$refs.tree.getChecked().forEach(function(e){e.meta&&e.checked&&t.push(e.id)}),!t.length)return this.$toast("请勾选至少一个字段");this.exporting=!0,this.definedSearch.studentId=this.$refs.studentTable.tableSearchFields.studentId,this.definedSearch.name=this.$refs.studentTable.tableSearchFields.name,this.definedSearch.college=this.$refs.studentTable.tableSearchFields.college,this.definedSearch.educationLevel=this.$refs.studentTable.tableSearchFields.educationLevel,this.definedSearch.instructorPhoneNum=this.$refs.studentTable.tableSearchFields.instructorPhoneNum,this.definedSearch.instructorName=this.$refs.studentTable.tableSearchFields.instructorName,this.definedSearch.grade=this.$refs.studentTable.tableSearchFields.grade,this.definedSearch.idCardNo=this.$refs.studentTable.tableSearchFields.idCardNo,this.definedSearch.accommodation=this.$refs.studentTable.tableSearchFields.accommodation,this.definedSearch.className=this.$refs.studentTable.tableSearchFields.className,this.definedSearch.fields=t.join(",");var e="/downloads/fts/student/excelOutStudentInfo?";for(var s in this.definedSearch)e+=s+"="+this.definedSearch[s]+"&";e=e.substr(0,e.length-1),window.location.href=e,this.exporting=!1,this.showExport=!1,this.getStuTree()}}}},l={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"info-set-container"},[s("div",{staticClass:"student-manage-page",attrs:{id:t.pageId}},[s("div",{staticClass:"content text-center"},[s("v-table",{ref:"studentTable",attrs:{title:"学生基本信息",url:t.url,pagesize:"10",idField:"id",columns:t.columns,order:!0,search:!1,searchParams:t.definedSearch,columnsControl:!0}},[s("div",{staticClass:"btn-group pull-right",attrs:{slot:"btn-group",role:"group"},slot:"btn-group"},[s("button",{staticClass:"btn btn-bgColor-style clearBtnBorder",on:{click:t.showExportModal}},[t._v("批量导出")])])])],1),t._v(" "),s("v-modal",{attrs:{show:t.showExport,effect:"fade"}},[s("div",{staticClass:"modal-header",attrs:{slot:"modal-header"},slot:"modal-header"},[s("h5",{staticClass:"modal-title"},[t._v("导出")])]),t._v(" "),s("div",{staticClass:"modal-body",attrs:{slot:"modal-body"},slot:"modal-body"},[s("v-tree",{ref:"tree",attrs:{id:"resourceTree",cascade:"true",items:t.fieldsToExport,checkable:!0,search:!1}})],1),t._v(" "),s("div",{staticClass:"modal-footer",attrs:{slot:"modal-footer"},slot:"modal-footer"},[s("button",{staticClass:"btn cancel-btn clearBtnBorder",attrs:{type:"button"},on:{click:function(e){t.showExport=!1}}},[t._v(t._s(t.translate.cancel))]),t._v(" "),s("button",{staticClass:"btn submit-btn clearBtnBorder",attrs:{type:"button"},on:{click:t.exportTable}},[t._v(t._s(t.exportStatus))])])])],1)])},staticRenderFns:[]};var d=s("C7Lr")(i,l,!1,function(t){s("m2kJ")},null,null);e.default=d.exports},m2kJ:function(t,e){}});