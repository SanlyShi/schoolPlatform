webpackJsonp([119],{"4l8O":function(t,e){},"5tgB":function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});a("kV13");var s=a("C331"),i={data:function(){return{columns:[],url:"/table-data/fts/user/getUserAccountList?timestamp=",method:"get",timestamp:(new Date).getTime(),classList:[],gradeList:[],definedSearch:{studentId:"",name:"",college:"",grade:"",educationLevel:"",idCardNo:"",className:"",isRegister:"",familyName:"",relation:"",familyPhoneNum:"",familyNameAnother:"",relationAnother:"",familyUserIdAnother:"",fields:""},lang:"zh-cn",showExport:!1,fieldsToExport:[],exporting:!1,showModal:!1,curStudent:{},relationList:[{value:"FATHER",label:"父亲"},{value:"MOTHER",label:"母亲"}],registerList:[{value:"1",label:"已注册"},{value:"0",label:"未注册"}],curParent:[],parentInfo:[{id:"familyUserId",name:"familyName",relation:"relation",phone:"familyPhoneNum"},{id:"familyUserIdAnother",name:"familyNameAnother",relation:"relationAnother",phone:"familyPhoneNumAnother"}],pAcchountList:[],pIdx:"0"}},created:function(){var t=localStorage.getItem("lang");Object(s.g)(t)&&(this.lang=t),this.getClassList(),this.getGradeList(),this._initColumns(),this.getStuTree()},computed:{translate:function(){return Object(s.g)(this.lang).infoManage},exportStatus:function(){return this.exporting?"导出中":this.translate.export}},methods:{showExportModal:function(){this.showExport=!0},getStuTree:function(){var t=[],e={id:1,title:"全选",edit:!1,children:[]};this.columns.forEach(function(t,a){"opt"!=t.id&&e.children.push({id:a+1,title:t.title,disabled:!1,meta:!0})}),t.push(e),this.fieldsToExport=t},_initColumns:function(){var t=this;this.columns=[{id:"studentId",title:"学号",className:"text-left",width:120,hidden:!1,search:{type:"input"}},{id:"name",title:"姓名",className:"text-left",width:100,hidden:!1,search:{type:"input"}},{id:"idCardNo",title:"身份证",className:"text-left",width:160,hidden:!1,search:{type:"input"}},{id:"isRegister",title:"是否注册家长账号",className:"text-left",width:120,hidden:!1,search:{type:"select",data:{options:this.registerList,optionsLabel:"label",optionsValue:"value"}}},{id:"familyName",title:"家长姓名1",className:"text-left",width:120,hidden:!1,search:{data:{placeholder:"家长姓名"},type:"input"}},{id:"relation",title:"家长关系1",className:"text-left",width:120,hidden:!1,search:{type:"select",data:{options:this.relationList,optionsLabel:"label",optionsValue:"value",placeholder:"家长关系"}}},{id:"familyPhoneNum",title:"家长账号1",className:"text-left",width:120,hidden:!1,search:{data:{placeholder:"家长账号"},type:"input"}},{id:"familyNameAnother",title:"家长姓名2",className:"text-left",width:120,hidden:!1},{id:"relationAnother",title:"家长关系2",className:"text-left",width:120,hidden:!1},{id:"familyPhoneNumAnother",title:"家长账号2",className:"text-left",width:120,hidden:!1},{id:"college",title:"学院",className:"text-left",width:120,hidden:!1,search:{type:"select",data:{url:"/api/fts/dict/getUnitList",optionsLabel:"label",optionsValue:"value"}}},{id:"educationLevel",title:"培养层次",className:"text-left",width:100,hidden:!0,search:{type:"select",data:{url:"/api/fts/dict/findDictByTypeName?typeName=培养层次",optionsLabel:"label",optionsValue:"value"}}},{id:"grade",title:"年级",className:"text-left",width:100,hidden:!0,search:{type:"select",data:{options:this.gradeList,optionsLabel:"label",optionsValue:"value"}}},{id:"className",title:"班级",className:"text-left",width:120,hidden:!1,search:{type:"select",data:{options:this.classList,optionsLabel:"label",optionsValue:"value"}}},{id:"opt",title:"操作",className:"text-left",width:80,hidden:!1,options:[{tag:"a",text:"重置",callback:function(e,a){t.pAcchountList=[],t.pIdx="0",e.familyUserId?(t.curStudent=e,e.familyUserId&&t.pAcchountList.push({value:"0",label:"家长账号1"}),e.familyUserIdAnother&&t.pAcchountList.push({value:"1",label:"家长账号2"}),t.showModal=!0):confirm("该生还未绑定家长账号，无法重置！")}}]}]},filterRelation:function(t){return"FATHER"==t?"父亲":"MOTHER"==t?"母亲":t},reset:function(){var t=this;confirm("确定重置该学生家长信息吗？重置后数据将无法恢复!")&&Object(s.e)({url:"/api/fts/user/resetUser?userId="+this.curStudent[this.parentInfo[this.pIdx].id],type:"post",success:function(e){e.state?(t.timestamp=(new Date).getTime(),t.showModal=!1):t.$toast(e.message)}})},getClassList:function(){var t=this;Object(s.e)({url:"/api/fts/dict/getClassList",dataType:"json",type:"get",async:!1,success:function(e){e.state&&(t.classList=e.data.map(function(t){return{label:t,value:t}}))}})},getGradeList:function(){var t=this;Object(s.e)({url:"/api/fts/dict/getGradeList",dataType:"json",type:"get",async:!1,success:function(e){e.state&&(t.gradeList=e.data.map(function(t){return{label:t,value:t}}))}})},afterSelected:function(t){t.val&&(this.pIdx=t.val)},exportTable:function(){if(!this.exporting){var t=[];if(this.$refs.tree.getChecked().forEach(function(e){e.meta&&e.checked&&t.push(e.id)}),!t.length)return this.$toast("请勾选至少一个字段");this.exporting=!0,this.definedSearch.studentId=this.$refs.studentTable.tableSearchFields.studentId,this.definedSearch.name=this.$refs.studentTable.tableSearchFields.name,this.definedSearch.college=this.$refs.studentTable.tableSearchFields.college,this.definedSearch.educationLevel=this.$refs.studentTable.tableSearchFields.educationLevel,this.definedSearch.grade=this.$refs.studentTable.tableSearchFields.grade,this.definedSearch.idCardNo=this.$refs.studentTable.tableSearchFields.idCardNo,this.definedSearch.className=this.$refs.studentTable.tableSearchFields.className,this.definedSearch.isRegister=this.$refs.studentTable.tableSearchFields.isRegister,this.definedSearch.familyName=this.$refs.studentTable.tableSearchFields.familyName,this.definedSearch.relation=this.$refs.studentTable.tableSearchFields.relation,this.definedSearch.familyPhoneNum=this.$refs.studentTable.tableSearchFields.familyPhoneNum,this.definedSearch.familyNameAnother=this.$refs.studentTable.tableSearchFields.familyNameAnother,this.definedSearch.relationAnother=this.$refs.studentTable.tableSearchFields.relationAnother,this.definedSearch.familyUserIdAnother=this.$refs.studentTable.tableSearchFields.familyUserIdAnother,this.definedSearch.fields=t.join(",");var e="/downloads/fts/user/excelOutUserAccount?";for(var a in this.definedSearch)e+=a+"="+this.definedSearch[a]+"&";e=e.substr(0,e.length-1),window.location.href=e,this.exporting=!1,this.showExport=!1,this.getStuTree()}}}},l={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"info-set-container"},[a("div",{staticClass:"student-manage-page",attrs:{id:t.pageId}},[a("div",{staticClass:"content text-center"},[a("v-table",{ref:"studentTable",attrs:{title:"学生家长账号管理",url:t.url+t.timestamp,pagesize:"10",idField:"id",columns:t.columns,order:!0,search:!1,searchParams:t.definedSearch,columnsControl:!0}},[a("div",{staticClass:"btn-group pull-right",attrs:{slot:"btn-group",role:"group"},slot:"btn-group"},[a("button",{staticClass:"btn btn-bgColor-style clearBtnBorder",on:{click:t.showExportModal}},[t._v("批量导出")])])])],1),t._v(" "),a("v-modal",{attrs:{show:t.showExport,effect:"fade"}},[a("div",{staticClass:"modal-header",attrs:{slot:"modal-header"},slot:"modal-header"},[a("h5",{staticClass:"modal-title"},[t._v("导出")])]),t._v(" "),a("div",{staticClass:"modal-body",attrs:{slot:"modal-body"},slot:"modal-body"},[a("v-tree",{ref:"tree",attrs:{id:"resourceTree",cascade:"true",items:t.fieldsToExport,checkable:!0,search:!1}})],1),t._v(" "),a("div",{staticClass:"modal-footer",attrs:{slot:"modal-footer"},slot:"modal-footer"},[a("button",{staticClass:"btn cancel-btn clearBtnBorder",attrs:{type:"button"},on:{click:function(e){t.showExport=!1}}},[t._v(t._s(t.translate.cancel))]),t._v(" "),a("button",{staticClass:"btn submit-btn clearBtnBorder",attrs:{type:"button"},on:{click:t.exportTable}},[t._v(t._s(t.exportStatus))])])]),t._v(" "),a("v-modal",{attrs:{show:t.showModal,effect:"fade",width:"460"}},[a("div",{staticClass:"modal-header",attrs:{slot:"modal-header"},slot:"modal-header"},[a("h5",{staticClass:"modal-title"},[t._v("\n          "+t._s("add"==t.modalType?"新增":"编辑")+"\n        ")])]),t._v(" "),a("div",{staticClass:"modal-body container-fluid",staticStyle:{overflow:"inherit"},attrs:{slot:"modal-body"},slot:"modal-body"},[a("div",{staticClass:"form-group box_flex align_center"},[a("div",{staticClass:"label require"},[a("span",[t._v("家长账号:")])]),t._v(" "),a("v-select",{attrs:{options:t.pAcchountList,"options-value":"value","options-label":"label",value:t.pIdx,justify:""},on:{afterSelected:t.afterSelected}})],1),t._v(" "),a("div",{staticClass:"form-group box_flex align_center"},[a("div",{staticClass:"label"},[a("span",[t._v("家长姓名:")])]),t._v(" "),a("input",{directives:[{name:"model",rawName:"v-model",value:t.curStudent[t.parentInfo[t.pIdx].name],expression:"curStudent[parentInfo[pIdx].name]"}],staticClass:"form-control search-input",attrs:{type:"text",disabled:"true"},domProps:{value:t.curStudent[t.parentInfo[t.pIdx].name]},on:{input:function(e){e.target.composing||t.$set(t.curStudent,t.parentInfo[t.pIdx].name,e.target.value)}}})]),t._v(" "),a("div",{staticClass:"form-group box_flex align_center"},[a("div",{staticClass:"label"},[a("span",[t._v("家长关系:")])]),t._v(" "),a("input",{directives:[{name:"model",rawName:"v-model",value:t.curStudent[t.parentInfo[t.pIdx].relation],expression:"curStudent[parentInfo[pIdx].relation]"}],staticClass:"form-control search-input",attrs:{type:"text",disabled:"true"},domProps:{value:t.curStudent[t.parentInfo[t.pIdx].relation]},on:{input:function(e){e.target.composing||t.$set(t.curStudent,t.parentInfo[t.pIdx].relation,e.target.value)}}})]),t._v(" "),a("div",{staticClass:"form-group box_flex align_center"},[a("div",{staticClass:"label"},[a("span",[t._v("家长电话:")])]),t._v(" "),a("input",{directives:[{name:"model",rawName:"v-model",value:t.curStudent[t.parentInfo[t.pIdx].phone],expression:"curStudent[parentInfo[pIdx].phone]"}],staticClass:"form-control search-input",attrs:{type:"text",disabled:"true"},domProps:{value:t.curStudent[t.parentInfo[t.pIdx].phone]},on:{input:function(e){e.target.composing||t.$set(t.curStudent,t.parentInfo[t.pIdx].phone,e.target.value)}}})])]),t._v(" "),a("div",{staticClass:"modal-footer",attrs:{slot:"modal-footer"},slot:"modal-footer"},[a("button",{staticClass:"btn cancel-btn clearBtnBorder",attrs:{type:"button"},on:{click:function(e){t.showModal=!1}}},[t._v("取消")]),t._v(" "),a("button",{staticClass:"btn submit-btn clearBtnBorder",attrs:{type:"button"},on:{click:t.reset}},[t._v("确定")])])])],1)])},staticRenderFns:[]};var n=a("C7Lr")(i,l,!1,function(t){a("4l8O"),a("88ZR")},"data-v-8bfcc5be",null);e.default=n.exports},"88ZR":function(t,e){}});