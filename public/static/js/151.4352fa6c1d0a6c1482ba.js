webpackJsonp([151],{"/u95":function(e,t){},wM6K:function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=s("3cXf"),a=s.n(n),i=s("kV13"),r=s("C331"),o={created:function(){var e=localStorage.getItem("lang"),t=this;Object(r.g)(e)&&(this.lang=e),Object(r.e)({url:"/api/department/person/rule",type:"get",success:function(e){e.state&&(t.permissionData=e.data)}}),this.getDeparmentData()},data:function(){return{columns:[],url:"/table-data/department/person",showAddModal:!1,departmentOptions:[],personnel:{},newPersonnel:{permission:[],name:"",departmentId:null},definedSearch:{empNo:"",name:"",departmentId:""},modalType:"",errorMessage:"",permissionData:[],department:{id:null,name:""},isDisabled:!0,isExistName:!1,isSelectDepartment:!1,isChecked:!1,fruitIds:["1"],isEdited:!1,lang:"zh-cn"}},computed:{translate:function(){return Object(r.g)(this.lang).personnelManage}},methods:{_initColumns:function(){var e=this;this.columns=[{id:"empNo",title:this.translate.studentId,className:"text-left",width:150,hidden:!1,search:{type:"input",data:{placeholder:this.translate.personnelIdlaceholder,autoFocus:!0}}},{id:"name",title:this.translate.studentName,className:"text-left",width:120,hidden:!1,search:{type:"input",data:{placeholder:this.translate.personnelNamePlaceholder}}},{id:"departmentId",title:this.translate.department,className:"text-left",hidden:!1,width:150,search:{type:"select",data:{options:this.departmentOptions,optionsLabel:"name",optionsValue:"id"}},formatter:function(e,t){return e.department?e.department.name:""}},{id:"departmentRuleList",title:this.translate.permissions,className:"text-left",hidden:!1,formatter:function(e,t){var s="";if(e.departmentRuleList.length>0){for(var n in e.departmentRuleList)s+=e.departmentRuleList[n].name+" ";return s}return" "}},{id:"opt",title:this.translate.opt,className:"text-center",width:130,hidden:!1,formatter:function(){return[{tag:"a",text:e.translate.edit,className:"opt-btn",callback:function(t,s){e.getDeparmentData(),e.personnel=t,e.newPersonnel.empNo=t.empNo,e.newPersonnel.name=t.name,e.newPersonnel.id=t.id,e.department.id=t.department.id,e.newPersonnel.departmentId=t.department.id.toString(),e.department.name=t.department.name,e.newPersonnel.permission=JSON.parse(a()(t.departmentRuleList)),e.modalType=e.translate.edit,e.errorMessage="",e.showAddModal=!0,e.isDisabled=!1,setTimeout(function(){e.isEdited=!1})}},{tag:"a",text:e.translate.remove,className:"opt-btn",callback:function(t,s){confirm(e.translate.removeConfirmTip)&&Object(r.e)({url:"/api/department/person/"+t.id+"/delete",dataType:"json",type:"post",success:function(t){t.state?e.url="/table-data/department/person?timestamp="+(new Date).getTime():e.$toast(e.translate.removeFailedTip+":"+t.message)}})}}]}}]},getDeparmentData:function(){var e=this;Object(r.e)({url:"/api/department/person/department",type:"get",success:function(t){t.state&&(e.departmentOptions=t.data,e._initColumns())}})},inputIsEdited:function(){this.isEdited=!0},editPersonnel:function(){var e=this;Object(r.e)({url:"/api/department/person/"+this.newPersonnel.id,dataType:"json",data:{name:this.newPersonnel.name,empNo:this.newPersonnel.empNo,department:this.department,departmentRuleList:this.newPersonnel.permission},type:"post",success:function(t){t.state?(e.url="/table-data/department/person?timestamp="+(new Date).getTime(),e.showAddModal=!1):e.$toast(e.translate.editSuccessTip+":"+t.message)}})},addModal:function(){this.getDeparmentData(),this.newPersonnel={permission:[],name:"",departmentId:null},this.modalType=this.translate.addNew,this.showAddModal=!0,this.isDisabled=!0,this.isEdited=!1},closeModal:function(){this.isEdited?confirm(this.translate.cancelEditText)&&(this.showAddModal=!1):this.showAddModal=!1},addPersonnel:function(){var e=this;Object(r.e)({url:"/api/department/person",dataType:"json",data:{name:this.newPersonnel.name,empNo:this.newPersonnel.empNo,department:this.department,departmentRuleList:this.newPersonnel.permission},type:"post",success:function(t){t.state?(e.url="/table-data/department/person?timestamp="+(new Date).getTime(),e.showAddModal=!1,e.$toast(e.translate.addSuccessTip)):e.$toast(e.translate.addFailedTip+":"+t.message)}})},checkPersonnel:function(){var e=this;if(this.isEdited=!0,!e.newPersonnel.empNo)return e.errorMessage=e.translate.enterStudentId,!1;Object(r.e)({url:"/api/users/"+this.newPersonnel.empNo,dataType:"json",type:"get",success:function(t){t.state?(e.newPersonnel.name=t.data.name,e.newPersonnel.empNo=t.data.id,e.errorMessage="",e.isExistName=!0,e.isSelectDepartment&&(e.isDisabled=!1)):(e.errorMessage=t.message,e.newPersonnel.name="",e.isExistName=!1,e.isDisabled=!0)}})},changeRole:function(e){if(this.modalType===this.translate.addNew){if(e)return!1;this.addPersonnel()}else this.modalType===this.translate.edit&&this.editPersonnel()},afterSelected:function(e){var t=this;this.isEdited=!0,this.department.id=e.value,this.newPersonnel.departmentId=e.value,this.departmentOptions.forEach(function(s){e.value===s.id&&(t.department.name=s.name)}),this.department.id?(this.isSelectDepartment=!0,this.isExistName&&(this.isDisabled=!1)):(this.isSelectDepartment=!1,this.isDisabled=!0)},departmentSearch:function(e){this.definedSearch.departmentId=e.val},_click:function(e,t){if(this.isEdited=!0,1===e)for(var s in this.newPersonnel.permission)this.newPersonnel.permission[s].id===t.id&&this.newPersonnel.permission.splice(s,1);else this.newPersonnel.permission||i.default.set(this.newPersonnel,"permission",[]),this.newPersonnel.permission.push(t)},getIsChecked:function(e,t){if(e){var s=!1;for(var n in e)e[n]&&e[n].id===t.id&&(s=!0);return s}}}},l={render:function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"container-fluid",attrs:{id:"personnel-page"}},[s("div",{staticClass:"row text-center"},[s("v-table",{attrs:{title:e.translate.tableName,url:e.url,pagesize:"10",idField:"id",columns:e.columns,order:!0,search:!0}},[s("div",{staticClass:"btn-group pull-right",attrs:{slot:"btn-group",role:"group"},slot:"btn-group"},[s("button",{staticClass:"btn add clearBtnBorder",attrs:{type:"button"},on:{click:function(t){return e.addModal()}}},[e._v(e._s(e.translate.addNew)+e._s(e.translate.personnel))])])])],1),e._v(" "),s("v-modal",{attrs:{show:e.showAddModal,effect:"fade",width:"446"}},[s("div",{staticClass:"modal-header",attrs:{slot:"modal-header"},slot:"modal-header"},[s("h5",{staticClass:"modal-title"},[e._v(e._s(e.modalType)+e._s(e.translate.personnel))])]),e._v(" "),s("div",{staticClass:"modal-body",attrs:{slot:"modal-body"},slot:"modal-body"},[s("div",{staticClass:"form-group"},[s("div",{staticClass:"student-number-group"},[s("label",{staticClass:"student-number-name"},[e._v(e._s(e.translate.studentId))]),e._v(" "),s("div",{staticClass:"box_flex"},[s("input",{directives:[{name:"model",rawName:"v-model",value:e.newPersonnel.empNo,expression:"newPersonnel.empNo"}],ref:"empNo",staticClass:"form-control student-number-input",attrs:{id:"personnelName",type:"text"},domProps:{value:e.newPersonnel.empNo},on:{input:[function(t){t.target.composing||e.$set(e.newPersonnel,"empNo",t.target.value)},e.inputIsEdited]}}),e._v(" "),s("button",{staticClass:"btn checkBtn clearBtnBorder",attrs:{type:"button"},on:{click:e.checkPersonnel}},[e._v(e._s(e.translate.check))])]),e._v(" "),s("label",{staticClass:"error-message"},[e._v(e._s(e.errorMessage))])]),e._v(" "),s("div",{staticClass:"student-name-group"},[s("label",{staticClass:"student-number-name"},[e._v(e._s(e.translate.studentName))]),e._v(" "),s("p",[s("label",{staticClass:"student-name"},[e._v(e._s(e.newPersonnel.name))])])])]),e._v(" "),s("div",{staticClass:"department-select"},[s("label",{staticClass:"department-title"},[e._v(e._s(e.translate.department))]),e._v(" "),s("div",{staticClass:"department-combobox"},[s("v-select",{attrs:{options:e.departmentOptions,value:e.newPersonnel.departmentId,optionsLabel:"name",optionsValue:"id",search:!0},on:{afterSelected:e.afterSelected}})],1)]),e._v(" "),s("div",{staticClass:"permissions"},[s("label",{staticClass:"permissions-title"},[e._v(e._s(e.translate.permissions))]),e._v(" "),s("ul",{staticClass:"media-list checkbox-list"},e._l(e.permissionData,function(t,n){return s("li",{key:n,staticClass:"media"},[s("div",{staticClass:"media-left"},[e.getIsChecked(e.newPersonnel.permission,t)?s("i",{staticClass:"maticon permissions-checked",domProps:{innerHTML:e._s(e.icons("check_box"))},on:{click:function(s){return e._click(1,t)}}},[e._v("check_box")]):s("i",{staticClass:"maticon permissions-unchecked",domProps:{innerHTML:e._s(e.icons("check_box_outline_blank"))},on:{click:function(s){return e._click(0,t)}}},[e._v("check_box_outline_blank")])]),e._v(" "),s("div",{staticClass:"media-body permissions-content"},[s("h5",{staticClass:"media-heading permissions-name"},[e._v(e._s(t.name))]),e._v(" "),s("p",{staticClass:"permissions-description"},[e._v(e._s(t.remark))])])])}),0)])]),e._v(" "),s("div",{staticClass:"modal-footer",attrs:{slot:"modal-footer"},slot:"modal-footer"},[s("button",{staticClass:"btn cancel-btn clearBtnBorder",attrs:{type:"button"},on:{click:e.closeModal}},[e._v(e._s(e.translate.cancel))]),e._v(" "),s("button",{staticClass:"btn confirm-btn clearBtnBorder",class:{disabled:e.isDisabled},attrs:{type:"button"},on:{click:function(t){return e.changeRole(e.isDisabled)}}},[e._v(e._s(e.translate.confirm))])])])],1)},staticRenderFns:[]};var d=s("C7Lr")(o,l,!1,function(e){s("/u95")},null,null);t.default=d.exports}});