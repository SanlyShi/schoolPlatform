webpackJsonp([178],{BLwR:function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});s("kV13");var r=s("C331"),a=s("ZpE2"),o=s.n(a),n={data:function(){return{pwdStrong:[],studentModel:{freshNo:"",userNo:"",password:"",passwordConfirm:"",valiError:"",valiErrorSure:"",passwordTip:"",surepwTip:""},columns:[],baseUrl:"/table-data/document/students/freshman",ts:new Date,definedSearch:{studentId:"",name:"",account:""},showEditModal:!1,modalType:"",lang:"zh-cn",importStudents:!1,importParams:{parentPageTitle:"",downloadTemplateUrl:"",downloadErrorTemplateUrl:"",checkTemplateUrl:"",templateName:"",importBtnType:null},importType:"",isDisabled:"",isChange:!1,guideContent:""}},computed:{translate:function(){return Object(r.g)(this.lang).freshmanManage},url:function(){return this.baseUrl+"?ts="+this.ts}},created:function(){var t=this,e=localStorage.getItem("lang");Object(r.g)(e)&&(this.lang=e),this.columns=[{id:"name",title:this.translate.name,className:"text-left",hidden:!1,search:{type:"input"},formatter:function(t,e){return t.name?t.name:"-"}},{id:"account",title:this.translate.freshmanAccount,className:"text-left",hidden:!1,search:{type:"input"},formatter:function(t,e){return t.account?t.account:"-"}},{id:"endTime",title:this.translate.endTime,className:"text-left",hidden:!1,formatter:function(t,e){return t.endTime?t.endTime:"-"}},{id:"studentId",title:this.translate.studentId,className:"text-left",hidden:!1,width:150,search:{type:"input",data:{autoFocus:!0}},formatter:function(t,e){return t.studentId?t.studentId:"-"}},{id:"opt",className:"text-center",title:"操作",width:120,hidden:!1,formatter:function(e){return[{edit:{tag:"a",text:"编辑",callback:function(e,s){t.showEditModal=!0;var r=e.account,a=e.studentId,o=e.password,n=e.userId;t.studentModel.freshNo=r,t.studentModel.userNo=a,t.studentModel.oldPassword=o,t.studentModel.userId=n}}}.edit]}}]},methods:{cancle:function(){this.studentModel={freshNo:"",userNo:"",password:"",passwordConfirm:"",valiError:"",valiErrorSure:"",passwordTip:"",surepwTip:"",oldPassword:"",userId:""},this.pwdStrong=[],this.showEditModal=!1},submit:function(){var t=this;if(this.studentModel.valiError||this.studentModel.valiErrorSure)return!1;var e={accountType:"freshman",newPassword:o.a.createHash("md5").update(this.studentModel.password).digest("hex"),oldPassword:this.studentModel.oldPassword,userId:this.studentModel.userId,userNo:this.studentModel.userNo};Object(r.e)({url:"/api/account/modifyPassword",type:"post",data:e,success:function(e){e.state?(t.$toast("编辑成功"),t.cancle()):t.$toast(e.message)}})},_check:function(t){var e=this.studentModel;if("password"==t){var s=new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]"),r=new RegExp(/^(?![^a-zA-Z]+$)(?!\D+$)/);if(!e.password)return e.valiError=!0,e.passwordTip="密码不能为空",this.pwdStrong=[],!1;var a=e.password.length;if(!r.test(e.password)||a<8)return e.valiError=!0,e.passwordTip="密码格式不正确，必须包含数字和字母的8-25位字符串",this.pwdStrong=[],!1;s.test(e.password)?this.pwdStrong=a>=14?["low","mid","high"]:["low","mid"]:(this.pwdStrong=["low"],a>=14&&(this.pwdStrong=["low","mid"])),e.passwordConfirm&&this._check("passwordConfirm"),e.valiError=!1,e.passwordTip=""}else{if(!e.passwordConfirm)return e.valiError=!0,e.valiErrorSure=!0,e.surepwTip="确认密码不能为空",!1;if(e.password!==e.passwordConfirm)return e.valiErrorSure=!0,e.surepwTip="确认密码有误",!1;e.valiErrorSure=!1,e.surepwTip=""}},_studentIdBinding:function(){var t=this;this.importStudents=!0,this.importType="studentIdBinding",this.importParams={parentPageTitle:this.translate.tableName,downloadTemplateUrl:"/document/students/updateUserNoTemplates",downloadErrorTemplateUrl:"/document/students/errExcel",checkTemplateUrl:"/document/students/updateUserNoTemplates/check",templateName:this.translate.execlName,importBtnType:[{name:this.translate.overrideImport,url:"/document/students/updateUserNoExcel",method:"post",isShowBtn:!0,success:function(e){e.state&&(t.ts=new Date)}}]}},_studentAccountImport:function(){var t=this;this.importStudents=!0,this.importType="studentInfo",this.importParams={parentPageTitle:this.translate.tableName,downloadTemplateUrl:"/document/students/importFreshmanTemplate",downloadErrorTemplateUrl:"/document/students/errExcel",checkTemplateUrl:"/document/students/freshman/templates/check",templateName:this.translate.freshmanInfoExeclName,importBtnType:[{name:this.translate.overrideImport,url:"/document/students/freshman/excel",method:"post",isShowBtn:!0,success:function(e){e.state&&(t.ts=new Date)}}]}}}},d={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return t.importStudents?s("v-import",t._b({on:{backParentPage:function(e){t.importStudents=!1}}},"v-import",t.importParams,!1)):s("div",{staticClass:"container-fluid",attrs:{id:"freshmanManage-page"}},[s("div",{staticClass:"row text-center"},[s("v-table",{attrs:{title:t.translate.tableName,url:t.url,pagesize:"10",idField:"id",columns:t.columns,order:!0,search:!0}},[s("div",{staticClass:"btn-group pull-right",attrs:{slot:"btn-group",role:"group"},slot:"btn-group"},[s("button",{staticClass:"btn add clearBtnBorder btn-style ",attrs:{type:"button"},on:{click:t._studentIdBinding}},[t._v(t._s(t.translate.studentIdBinding))]),t._v(" "),s("button",{staticClass:"btn add clearBtnBorder btn-style",attrs:{type:"button"},on:{click:t._studentAccountImport}},[t._v(t._s(t.translate.add)+t._s(t.translate.freshmanAccount))])])])],1),t._v(" "),s("v-modal",{attrs:{show:t.showEditModal,effect:"fade",width:"500"}},[s("div",{staticClass:"modal-header",attrs:{slot:"modal-header"},slot:"modal-header"},[s("h5",{staticClass:"modal-title"},[t._v("账号编辑")])]),t._v(" "),s("div",{staticClass:"modal-body",attrs:{slot:"modal-body"},slot:"modal-body"},[s("div",{staticClass:"form-group class-committee-group"},[s("label",{staticClass:"classCommittee-text"},[t._v("新生账号:")]),t._v(" "),s("input",{directives:[{name:"model",rawName:"v-model",value:t.studentModel.freshNo,expression:"studentModel.freshNo"}],staticClass:"optionInput",attrs:{type:"text",disabled:""},domProps:{value:t.studentModel.freshNo},on:{input:function(e){e.target.composing||t.$set(t.studentModel,"freshNo",e.target.value)}}})]),t._v(" "),s("div",{staticClass:"form-group class-committee-group"},[s("label",{staticClass:"classCommittee-text"},[t._v("学号:")]),t._v(" "),s("input",{directives:[{name:"model",rawName:"v-model",value:t.studentModel.userNo,expression:"studentModel.userNo"}],staticClass:"optionInput",attrs:{type:"text",disabled:""},domProps:{value:t.studentModel.userNo},on:{input:function(e){e.target.composing||t.$set(t.studentModel,"userNo",e.target.value)}}})]),t._v(" "),s("div",{staticClass:"form-group class-committee-group"},[s("label",{staticClass:"classCommittee-text"},[t._v("新的密码:")]),t._v(" "),s("input",{directives:[{name:"model",rawName:"v-model",value:t.studentModel.password,expression:"studentModel.password"}],staticClass:"optionInput",class:t.valiError?"error":"",attrs:{type:"text",placeholder:"8-25位，必须包含数字和字母"},domProps:{value:t.studentModel.password},on:{blur:function(e){return t._check("password")},input:function(e){e.target.composing||t.$set(t.studentModel,"password",e.target.value)}}}),t._v(" "),t.studentModel.valiError?s("p",[t._v(t._s(t.studentModel.passwordTip))]):t._e()]),t._v(" "),t.pwdStrong.length?s("div",{staticClass:"form-group class-committee-group pwdStrong"},[s("span",{staticClass:"pwd-red"}),s("span",{directives:[{name:"show",rawName:"v-show",value:t.pwdStrong.length>1,expression:"pwdStrong.length > 1"}],staticClass:"pwd-yellow"}),s("span",{directives:[{name:"show",rawName:"v-show",value:t.pwdStrong.length>2,expression:"pwdStrong.length > 2"}],staticClass:"pwd-green"}),t._v(" "),s("em",[t._v(t._s(1==t.pwdStrong.length?"弱":2==t.pwdStrong.length?"中":"强"))])]):t._e(),t._v(" "),s("div",{staticClass:"form-group class-committee-group"},[s("label",{staticClass:"classCommittee-text"},[t._v("再次确认密码:")]),t._v(" "),s("input",{directives:[{name:"model",rawName:"v-model",value:t.studentModel.passwordConfirm,expression:"studentModel.passwordConfirm"}],staticClass:"optionInput",class:t.valiErrorSure?"error":"",attrs:{type:"text"},domProps:{value:t.studentModel.passwordConfirm},on:{blur:function(e){return t._check("passwordConfirm")},input:function(e){e.target.composing||t.$set(t.studentModel,"passwordConfirm",e.target.value)}}}),t._v(" "),t.studentModel.valiErrorSure?s("p",[t._v(t._s(t.studentModel.surepwTip))]):t._e()]),t._v(" "),s("div",{staticClass:"modal-body-content"})]),t._v(" "),s("div",{staticClass:"modal-footer",attrs:{slot:"modal-footer"},slot:"modal-footer"},[s("button",{staticClass:"btn cancel-btn clearBtnBorder",attrs:{type:"button"},on:{click:t.cancle}},[t._v("取消")]),t._v(" "),s("button",{staticClass:"btn submit-btn clearBtnBorder",attrs:{type:"button"},on:{click:t.submit}},[t._v("确定")])])])],1)},staticRenderFns:[]};var i=s("C7Lr")(n,d,!1,function(t){s("Dmnt")},null,null);e.default=i.exports},Dmnt:function(t,e){}});